
import type { Project, Task, TaskStatus } from '../pages/ProjectsPage'

const STORAGE_KEY = 'zentro_projects'


export function uid(): string {
  return Math.random().toString(36).slice(2, 9)
}


export function calcProgress(tasks: Task[]): number {
  if (tasks.length === 0) return 0
  const done = tasks.filter((t) => t.status === 'done').length
  return Math.round((done / tasks.length) * 100)
}


export function getProjects(): Project[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Project[]) : []
  } catch {
    return []
  }
}

function saveProjects(projects: Project[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects))
}


export function addProject(name: string, description: string): Project {
  const project: Project = {
    id: uid(),
    name,
    description,
    tasks: [],
    progress: 0,
  }
  const projects = getProjects()
  saveProjects([...projects, project])
  return project
}

export function deleteProject(projectId: string): void {
  const projects = getProjects().filter((p) => p.id !== projectId)
  saveProjects(projects)
}

export function updateProject(
  projectId: string,
  fields: Partial<Pick<Project, 'name' | 'description'>>
): Project[] {
  const projects = getProjects().map((p) =>
    p.id === projectId ? { ...p, ...fields } : p
  )
  saveProjects(projects)
  return projects
}


export function addTask(projectId: string, title: string): Project[] {
  const newTask: Task = { id: uid(), title, status: 'todo' }
  const projects = getProjects().map((p) => {
    if (p.id !== projectId) return p
    const tasks = [...p.tasks, newTask]
    return { ...p, tasks, progress: calcProgress(tasks) }
  })
  saveProjects(projects)
  return projects
}


export function updateTask(
  projectId: string,
  taskId: string,
  status: TaskStatus
): Project[] {
  const projects = getProjects().map((p) => {
    if (p.id !== projectId) return p
    const tasks = p.tasks.map((t) => (t.id === taskId ? { ...t, status } : t))
    return { ...p, tasks, progress: calcProgress(tasks) }
  })
  saveProjects(projects)
  return projects
}

export function deleteTask(projectId: string, taskId: string): Project[] {
  const projects = getProjects().map((p) => {
    if (p.id !== projectId) return p
    const tasks = p.tasks.filter((t) => t.id !== taskId)
    return { ...p, tasks, progress: calcProgress(tasks) }
  })
  saveProjects(projects)
  return projects
}


export function moveTask(
  projectId: string,
  fromIndex: number,
  toIndex: number
): Project[] {
  const projects = getProjects().map((p) => {
    if (p.id !== projectId) return p
    const tasks = [...p.tasks]
    const [moved] = tasks.splice(fromIndex, 1)
    tasks.splice(toIndex, 0, moved)
    return { ...p, tasks }
  })
  saveProjects(projects)
  return projects
}


export function getProjectStats(project: Project) {
  const total = project.tasks.length
  const done = project.tasks.filter((t) => t.status === 'done').length
  const inProgress = project.tasks.filter((t) => t.status === 'in-progress').length
  const todo = project.tasks.filter((t) => t.status === 'todo').length
  return { total, done, inProgress, todo, progress: project.progress }
}