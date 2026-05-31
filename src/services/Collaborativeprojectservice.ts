// src/services/collaborativeProjectService.ts
import { supabase } from './supabase'
import { auth } from './firebase'

// ── Types ──────────────────────────────────────────────────────

export type ProjectType = 'individual' | 'collaborative'
export type MemberRole = 'leader' | 'collaborator' | 'observer'
export type TaskStatus = 'pending' | 'in-progress' | 'completed' | 'blocked'

export interface ProjectMember {
  id: string
  project_id: string
  user_uid: string
  role: MemberRole
  joined_at: string
  // enriched from profiles
  name?: string
  photo?: string | null
  username?: string
}

export interface CollaborativeTask {
  id: string
  project_id: string
  title: string
  description: string
  assignee_uid: string | null
  due_date: string | null
  status: TaskStatus
  created_by: string
  created_at: string
  updated_at: string
  // enriched
  assignee_name?: string
  assignee_photo?: string | null
}

export interface ActivityEntry {
  id: string
  project_id: string
  user_uid: string
  action: 'created_task' | 'updated_task' | 'completed_task' | 'added_member'
  task_id: string | null
  task_title: string | null
  created_at: string
  // enriched
  user_name?: string
  user_photo?: string | null
}

export interface ProjectComment {
  id: string
  project_id: string
  user_uid: string
  content: string
  parent_id: string | null
  created_at: string
  // enriched
  user_name?: string
  user_photo?: string | null
  replies?: ProjectComment[]
}

export interface CollaborativeProject {
  id: string
  name: string
  description: string
  type: ProjectType
  owner_uid: string
  created_at: string
  // enriched
  members: ProjectMember[]
  tasks: CollaborativeTask[]
  // computed
  progress: number
  memberProgress: { uid: string; name: string; photo?: string | null; assigned: number; completed: number; pct: number }[]
}

// ── Helpers ─────────────────────────────────────────────────────

function getCurrentUid(): string | null {
  return auth.currentUser?.uid ?? null
}

async function enrichMembersWithProfiles(members: ProjectMember[]): Promise<ProjectMember[]> {
  if (members.length === 0) return members
  const uids = members.map((m) => m.user_uid)
  const { data } = await supabase
    .from('profiles')
    .select('firebase_uid, name, photo')
    .in('firebase_uid', uids)
  if (!data) return members
  return members.map((m) => {
    const p = data.find((d) => d.firebase_uid === m.user_uid)
    return { ...m, name: p?.name ?? 'Usuario', photo: p?.photo ?? null }
  })
}

async function enrichTasksWithProfiles(tasks: CollaborativeTask[]): Promise<CollaborativeTask[]> {
  if (tasks.length === 0) return tasks
  const uids = [...new Set(tasks.map((t) => t.assignee_uid).filter(Boolean) as string[])]
  if (uids.length === 0) return tasks
  const { data } = await supabase
    .from('profiles')
    .select('firebase_uid, name, photo')
    .in('firebase_uid', uids)
  if (!data) return tasks
  return tasks.map((t) => {
    const p = t.assignee_uid ? data.find((d) => d.firebase_uid === t.assignee_uid) : null
    return { ...t, assignee_name: p?.name ?? undefined, assignee_photo: p?.photo ?? null }
  })
}

function computeMemberProgress(
  members: ProjectMember[],
  tasks: CollaborativeTask[]
): CollaborativeProject['memberProgress'] {
  return members.map((m) => {
    const assigned = tasks.filter((t) => t.assignee_uid === m.user_uid).length
    const completed = tasks.filter((t) => t.assignee_uid === m.user_uid && t.status === 'completed').length
    return {
      uid: m.user_uid,
      name: m.name ?? 'Usuario',
      photo: m.photo,
      assigned,
      completed,
      pct: assigned > 0 ? Math.round((completed / assigned) * 100) : 0,
    }
  })
}

function computeOverallProgress(members: ProjectMember[], tasks: CollaborativeTask[]): number {
  if (tasks.length === 0) return 0
  const mp = computeMemberProgress(members, tasks)
  if (mp.length === 0) return 0
  const sum = mp.reduce((s, m) => s + m.pct, 0)
  return Math.round(sum / mp.length)
}

// ── Projects CRUD ────────────────────────────────────────────────

export async function getMyProjects(): Promise<CollaborativeProject[]> {
  const uid = getCurrentUid()
  if (!uid) return []

  // projects I own or am a member of
  const { data: memberRows } = await supabase
    .from('project_members')
    .select('project_id')
    .eq('user_uid', uid)

  const memberProjectIds = (memberRows ?? []).map((r) => r.project_id)

  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .or(`owner_uid.eq.${uid}${memberProjectIds.length > 0 ? `,id.in.(${memberProjectIds.join(',')})` : ''}`)
    .order('created_at', { ascending: false })

  if (!projects) return []

  const enriched: CollaborativeProject[] = []

  for (const p of projects) {
    const { data: rawMembers } = await supabase
      .from('project_members')
      .select('*')
      .eq('project_id', p.id)

    const { data: rawTasks } = await supabase
      .from('project_tasks')
      .select('*')
      .eq('project_id', p.id)
      .order('created_at', { ascending: true })

    const members = await enrichMembersWithProfiles(rawMembers ?? [])
    const tasks = await enrichTasksWithProfiles(rawTasks ?? [])

    enriched.push({
      ...p,
      members,
      tasks,
      progress: computeOverallProgress(members, tasks),
      memberProgress: computeMemberProgress(members, tasks),
    })
  }

  return enriched
}

export async function createProject(
  name: string,
  description: string,
  type: ProjectType,
  collaboratorUids: string[]
): Promise<CollaborativeProject | null> {
  const uid = getCurrentUid()
  if (!uid) return null

  const { data: project, error } = await supabase
    .from('projects')
    .insert({ name, description, type, owner_uid: uid })
    .select()
    .single()

  if (error || !project) return null

  // Add owner as leader
  await supabase.from('project_members').insert({
    project_id: project.id,
    user_uid: uid,
    role: 'leader',
  })

  // Add collaborators
  for (const cuid of collaboratorUids) {
    await supabase.from('project_members').insert({
      project_id: project.id,
      user_uid: cuid,
      role: 'collaborator',
    })
  }

  // Log activity
  await logActivity(project.id, 'created_task', null, `Proyecto "${name}" creado`)

  return getProjectById(project.id)
}

export async function getProjectById(id: string): Promise<CollaborativeProject | null> {
  const { data: p } = await supabase.from('projects').select('*').eq('id', id).single()
  if (!p) return null

  const { data: rawMembers } = await supabase.from('project_members').select('*').eq('project_id', id)
  const { data: rawTasks } = await supabase
    .from('project_tasks')
    .select('*')
    .eq('project_id', id)
    .order('created_at', { ascending: true })

  const members = await enrichMembersWithProfiles(rawMembers ?? [])
  const tasks = await enrichTasksWithProfiles(rawTasks ?? [])

  return {
    ...p,
    members,
    tasks,
    progress: computeOverallProgress(members, tasks),
    memberProgress: computeMemberProgress(members, tasks),
  }
}

export async function deleteProject(id: string): Promise<void> {
  await supabase.from('projects').delete().eq('id', id)
}

export async function updateProjectInfo(
  id: string,
  fields: { name?: string; description?: string }
): Promise<void> {
  await supabase.from('projects').update(fields).eq('id', id)
}

// ── Members ──────────────────────────────────────────────────────

export async function addMember(projectId: string, userUid: string, role: MemberRole = 'collaborator'): Promise<void> {
  await supabase.from('project_members').insert({ project_id: projectId, user_uid: userUid, role })
  await logActivity(projectId, 'added_member', null, null)
}

export async function removeMember(projectId: string, userUid: string): Promise<void> {
  await supabase.from('project_members').delete().eq('project_id', projectId).eq('user_uid', userUid)
}

export async function updateMemberRole(projectId: string, userUid: string, role: MemberRole): Promise<void> {
  await supabase.from('project_members').update({ role }).eq('project_id', projectId).eq('user_uid', userUid)
}

// ── Tasks ────────────────────────────────────────────────────────

export async function createTask(
  projectId: string,
  title: string,
  description: string,
  assigneeUid: string | null,
  dueDate: string | null
): Promise<CollaborativeTask | null> {
  const uid = getCurrentUid()
  if (!uid) return null

  const { data, error } = await supabase
    .from('project_tasks')
    .insert({
      project_id: projectId,
      title,
      description,
      assignee_uid: assigneeUid,
      due_date: dueDate,
      status: 'pending',
      created_by: uid,
    })
    .select()
    .single()

  if (error || !data) return null
  await logActivity(projectId, 'created_task', data.id, title)
  return data
}

export async function updateTaskStatus(
  projectId: string,
  taskId: string,
  status: TaskStatus
): Promise<void> {
  const uid = getCurrentUid()
  const { data: task } = await supabase.from('project_tasks').select('title').eq('id', taskId).single()
  await supabase
    .from('project_tasks')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', taskId)

  const action = status === 'completed' ? 'completed_task' : 'updated_task'
  await logActivity(projectId, action, taskId, task?.title ?? '')
  // keep assignee_uid in sync for activity tracking (no change needed)
  void uid
}

export async function updateTask(
  taskId: string,
  fields: Partial<Pick<CollaborativeTask, 'title' | 'description' | 'assignee_uid' | 'due_date' | 'status'>>
): Promise<void> {
  await supabase
    .from('project_tasks')
    .update({ ...fields, updated_at: new Date().toISOString() })
    .eq('id', taskId)
}

export async function deleteTask(taskId: string): Promise<void> {
  await supabase.from('project_tasks').delete().eq('id', taskId)
}

// ── Activity ─────────────────────────────────────────────────────

async function logActivity(
  projectId: string,
  action: ActivityEntry['action'],
  taskId: string | null,
  taskTitle: string | null
): Promise<void> {
  const uid = getCurrentUid()
  if (!uid) return
  await supabase.from('project_activity').insert({
    project_id: projectId,
    user_uid: uid,
    action,
    task_id: taskId,
    task_title: taskTitle,
  })
}

export async function getProjectActivity(projectId: string): Promise<ActivityEntry[]> {
  const { data } = await supabase
    .from('project_activity')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false })
    .limit(50)

  if (!data) return []
  const uids = [...new Set(data.map((e) => e.user_uid))]
  const { data: profiles } = await supabase
    .from('profiles')
    .select('firebase_uid, name, photo')
    .in('firebase_uid', uids)

  return data.map((e) => {
    const p = profiles?.find((pr) => pr.firebase_uid === e.user_uid)
    return { ...e, user_name: p?.name ?? 'Usuario', user_photo: p?.photo ?? null }
  })
}

// ── Comments ─────────────────────────────────────────────────────

export async function getProjectComments(projectId: string): Promise<ProjectComment[]> {
  const { data } = await supabase
    .from('project_comments')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: true })

  if (!data) return []
  const uids = [...new Set(data.map((c) => c.user_uid))]
  const { data: profiles } = await supabase
    .from('profiles')
    .select('firebase_uid, name, photo')
    .in('firebase_uid', uids)

  const enriched: ProjectComment[] = data.map((c) => {
    const p = profiles?.find((pr) => pr.firebase_uid === c.user_uid)
    return { ...c, user_name: p?.name ?? 'Usuario', user_photo: p?.photo ?? null, replies: [] }
  })

  // Build tree
  const top = enriched.filter((c) => !c.parent_id)
  const replies = enriched.filter((c) => c.parent_id)
  replies.forEach((r) => {
    const parent = top.find((c) => c.id === r.parent_id)
    if (parent) parent.replies!.push(r)
  })

  return top
}

export async function postComment(
  projectId: string,
  content: string,
  parentId: string | null = null
): Promise<ProjectComment | null> {
  const uid = getCurrentUid()
  if (!uid) return null
  const { data, error } = await supabase
    .from('project_comments')
    .insert({ project_id: projectId, user_uid: uid, content, parent_id: parentId })
    .select()
    .single()
  if (error || !data) return null
  return data
}

// ── User search ──────────────────────────────────────────────────

export async function searchUsers(query: string): Promise<{ uid: string; name: string; photo: string | null }[]> {
  if (!query.trim()) return []
  const { data } = await supabase
    .from('profiles')
    .select('firebase_uid, name, photo')
    .ilike('name', `%${query}%`)
    .limit(10)

  return (data ?? []).map((d) => ({ uid: d.firebase_uid, name: d.name ?? 'Usuario', photo: d.photo ?? null }))
}