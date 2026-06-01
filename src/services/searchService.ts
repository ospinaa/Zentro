import type {
  CollaborativeProject,
  CollaborativeTask,
  TaskStatus
} from './Collaborativeprojectservice'
import type { CalendarSession, SessionStatus } from './sessionService'


export type ResultKind = 'project' | 'task' | 'session'

export interface SearchResult {
  kind: ResultKind
  id: string
  title: string
  subtitle: string      
  status?: string
  tags?: string[]
  score: number         
  payload: CollaborativeProject | CollaborativeTask | CalendarSession
}


export interface SearchFilters {
  query: string

  taskStatus?: TaskStatus | 'all'

  
  sessionStatus?: SessionStatus | 'all'
  dateFrom?: string   
  dateTo?: string

  tags?: string[]     
  kinds?: ResultKind[]
  projectProgress?: number | 'all'
}


function scoreText(query: string, title: string, extra: string = ''): number {
  const q = query.toLowerCase().trim()
  if (!q) return 1  
  const t = title.toLowerCase()
  const e = extra.toLowerCase()
  if (t === q)             return 100
  if (t.startsWith(q))     return 80
  if (t.includes(q))       return 60
  if (e.includes(q))       return 30
  return 0
}

function matchesTags(entityTags: string[], filterTags: string[]): boolean {
  if (!filterTags.length) return true
  return filterTags.every((ft) =>
    entityTags.some((et) => et.toLowerCase().includes(ft.toLowerCase()))
  )
}

function inDateRange(date: string, from?: string, to?: string): boolean {
  if (from && date < from) return false
  if (to   && date > to)   return false
  return true
}


export function search(
  projects: CollaborativeProject[],
  sessions: CalendarSession[],
  filters: SearchFilters
): SearchResult[] {
  const { query, taskStatus, sessionStatus, dateFrom, dateTo, tags = [], kinds = [] } = filters
  const includeAll = kinds.length === 0
  const results: SearchResult[] = []

  if (includeAll || kinds.includes('project')) {
    for (const project of projects) {
      const score = scoreText(query, project.name, project.description)
      if (!score) continue
      if (!matchesTags([], tags)) continue  

      results.push({
        kind:     'project',
        id:       project.id,
        title:    project.name,
        subtitle: project.description || 'Sin descripción',
        status:   `${project.progress}% completado`,
        score,
        payload:  project,
      })
    }
  }

  if (includeAll || kinds.includes('task')) {
    for (const project of projects) {
      for (const task of project.tasks) {
        if (taskStatus && taskStatus !== 'all' && task.status !== taskStatus) continue
        const score = scoreText(query, task.title, project.name)
        if (!score) continue

        results.push({
          kind:     'task',
          id:       task.id,
          title:    task.title,
          subtitle: `Proyecto: ${project.name}`,
          status:   task.status,
          score,
          payload:  task,
        })
      }
    }
  }

  if (includeAll || kinds.includes('session')) {
    for (const session of sessions) {
      if (sessionStatus && sessionStatus !== 'all' && session.status !== sessionStatus) continue
      if (!inDateRange(session.date, dateFrom, dateTo)) continue
      if (!matchesTags(session.tags, tags)) continue

      const score = scoreText(query, session.title, session.description + session.tags.join(' '))
      if (!score) continue

      results.push({
        kind:     'session',
        id:       session.id,
        title:    session.title,
        subtitle: `${session.date} · ${session.startTime}–${session.endTime}`,
        status:   session.status,
        tags:     session.tags,
        score,
        payload:  session,
      })
    }
  }

  return results.sort((a, b) => b.score - a.score)
}


export function quickSearch(
  projects: CollaborativeProject[],
  sessions: CalendarSession[],
  query: string
): SearchResult[] {
  return search(projects, sessions, { query, kinds: [] })
}