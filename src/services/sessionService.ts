// ─── src/services/sessionService.ts ───────────────────────────────────────────
// Servicio de sesiones del calendario.
// Persiste en localStorage. Independiente del perfil para mayor flexibilidad.

export type SessionStatus = 'upcoming' | 'ongoing' | 'done' | 'cancelled'

export interface CalendarSession {
  id: string
  title: string
  description: string
  date: string        // ISO: '2025-04-28'
  startTime: string   // '15:00'
  endTime: string     // '16:30'
  status: SessionStatus
  tags: string[]
  location: string    // presencial o link
  createdAt: number   // timestamp
}

const STORAGE_KEY = 'zentro_sessions'

// ── Helpers ───────────────────────────────────────────────────────────────────

export function uid(): string {
  return Math.random().toString(36).slice(2, 9)
}

/**
 * Calcula el status automáticamente según la fecha y hora actuales.
 * Si el usuario no lo fijó manualmente como 'cancelled'.
 */
export function resolveStatus(session: CalendarSession): SessionStatus {
  if (session.status === 'cancelled') return 'cancelled'
  const now = new Date()
  const start = new Date(`${session.date}T${session.startTime}`)
  const end   = new Date(`${session.date}T${session.endTime}`)
  if (now < start) return 'upcoming'
  if (now >= start && now <= end) return 'ongoing'
  return 'done'
}

// ── CRUD ──────────────────────────────────────────────────────────────────────

export function getSessions(): CalendarSession[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as CalendarSession[]) : []
  } catch {
    return []
  }
}

function persist(sessions: CalendarSession[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions))
}

export function addSession(
  data: Omit<CalendarSession, 'id' | 'status' | 'createdAt'>
): CalendarSession[] {
  const session: CalendarSession = {
    ...data,
    id: uid(),
    status: 'upcoming',
    createdAt: Date.now(),
  }
  session.status = resolveStatus(session)
  const sessions = [...getSessions(), session]
  persist(sessions)
  return sessions
}

export function updateSession(
  id: string,
  fields: Partial<Omit<CalendarSession, 'id' | 'createdAt'>>
): CalendarSession[] {
  const sessions = getSessions().map((s) => {
    if (s.id !== id) return s
    const updated = { ...s, ...fields }
    // recalcula status salvo que se cancele explícitamente
    if (fields.status !== 'cancelled') updated.status = resolveStatus(updated)
    return updated
  })
  persist(sessions)
  return sessions
}

export function deleteSession(id: string): CalendarSession[] {
  const sessions = getSessions().filter((s) => s.id !== id)
  persist(sessions)
  return sessions
}

export function cancelSession(id: string): CalendarSession[] {
  return updateSession(id, { status: 'cancelled' })
}

// ── Consultas ─────────────────────────────────────────────────────────────────

/** Sesiones de un día específico (ISO date string). */
export function getSessionsByDay(date: string): CalendarSession[] {
  return getSessions().filter((s) => s.date === date)
}

/** Sesiones del mes (YYYY-MM). */
export function getSessionsByMonth(yearMonth: string): CalendarSession[] {
  return getSessions().filter((s) => s.date.startsWith(yearMonth))
}

/** Días del mes que tienen al menos una sesión. */
export function getDaysWithSessions(yearMonth: string): Set<string> {
  return new Set(getSessionsByMonth(yearMonth).map((s) => s.date))
}

/** Estadísticas rápidas. */
export function getSessionStats() {
  const all = getSessions()
  return {
    total:     all.length,
    upcoming:  all.filter((s) => s.status === 'upcoming').length,
    ongoing:   all.filter((s) => s.status === 'ongoing').length,
    done:      all.filter((s) => s.status === 'done').length,
    cancelled: all.filter((s) => s.status === 'cancelled').length,
  }
}