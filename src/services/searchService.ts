// ─── src/services/searchService.ts ───────────────────────────────────────────
// Servicio de búsqueda y filtros avanzados.
// Opera sobre los datos en memoria (recibe arrays, no lee localStorage directamente).
// Así es fácilmente testeable y reutilizable en cualquier componente.

import type { Project, Task, TaskStatus } from '../pages/ProjectsPage'
import type { CalendarSession, SessionStatus } from './sessionService'

// ── Tipos de resultados unificados ────────────────────────────────────────────

export type ResultKind = 'project' | 'task' | 'session'

export interface SearchResult {
  kind: ResultKind
  id: string
  title: string
  subtitle: string      // contexto (nombre del proyecto padre, fecha, etc.)
  status?: string
  tags?: string[]
  score: number         // relevancia (mayor = más relevante)
  payload: Project | Task | CalendarSession
}

// ── Filtros disponibles ───────────────────────────────────────────────────────

export interface SearchFilters {
  query: string

  // Proyectos / tareas
  taskStatus?: TaskStatus | 'all'

  // Sesiones
  sessionStatus?: SessionStatus | 'all'
  dateFrom?: string   // ISO 'YYYY-MM-DD'
  dateTo?: string

  // Compartidos
  tags?: string[]     // AND: la entidad debe tener TODOS los tags
  kinds?: ResultKind[] // qué tipos incluir; vacío = todos
}

// ── Helpers internos ──────────────────────────────────────────────────────────

/**
 * Puntuación de relevancia por coincidencia de texto.
 * Coincidencia exacta en título > coincidencia parcial > coincidencia en descripción.
 */
function scoreText(query: string, title: string, extra: string = ''): number {
  const q = query.toLowerCase().trim()
  if (!q) return 1  // sin búsqueda → todos pasan con score 1
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

// ── Búsqueda principal ────────────────────────────────────────────────────────

/**
 * Búsqueda unificada sobre proyectos, tareas y sesiones.
 * Retorna resultados ordenados por relevancia descendente.
 */
export function search(
  projects: Project[],
  sessions: CalendarSession[],
  filters: SearchFilters
): SearchResult[] {
  const { query, taskStatus, sessionStatus, dateFrom, dateTo, tags = [], kinds = [] } = filters
  const includeAll = kinds.length === 0
  const results: SearchResult[] = []

  // ── Proyectos ──
  if (includeAll || kinds.includes('project')) {
    for (const project of projects) {
      const score = scoreText(query, project.name, project.description)
      if (!score) continue
      if (!matchesTags([], tags)) continue  // proyectos no tienen tags propios

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

  // ── Tareas ──
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

  // ── Sesiones ──
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

/**
 * Búsqueda rápida: solo por texto, sin filtros adicionales.
 * Útil para la barra de búsqueda del navbar.
 */
export function quickSearch(
  projects: Project[],
  sessions: CalendarSession[],
  query: string
): SearchResult[] {
  return search(projects, sessions, { query, kinds: [] })
}