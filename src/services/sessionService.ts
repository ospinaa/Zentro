export type SessionStatus =
  | 'upcoming'
  | 'ongoing'
  | 'done'
  | 'cancelled'

export interface CalendarSession {
  id: string
  title: string
  description: string
  date: string
  startTime: string
  endTime: string
  status: SessionStatus
  tags: string[]
  location: string
  createdAt: number
}

const STORAGE_KEY = 'zentro_sessions'

export function uid(): string {
  return Math.random().toString(36).slice(2, 9)
}

export function resolveStatus(
  session: CalendarSession
): SessionStatus {
  if (session.status === 'cancelled') {
    return 'cancelled'
  }

  const now = new Date()

  const start = new Date(
    `${session.date}T${session.startTime}`
  )

  const end = new Date(
    `${session.date}T${session.endTime}`
  )

  if (now < start) return 'upcoming'

  if (now >= start && now <= end) {
    return 'ongoing'
  }

  return 'done'
}

export function getSessions(): CalendarSession[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)

    return raw
      ? (JSON.parse(raw) as CalendarSession[])
      : []
  } catch {
    return []
  }
}

function persist(
  sessions: CalendarSession[]
): void {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(sessions)
  )
}

export function addSession(
  data: Omit<
    CalendarSession,
    'id' | 'status' | 'createdAt'
  >
): CalendarSession[] {
  const session: CalendarSession = {
    ...data,
    id: uid(),
    status: 'upcoming',
    createdAt: Date.now(),
  }

  session.status = resolveStatus(session)

  const sessions = [
    ...getSessions(),
    session
  ]

  persist(sessions)

  return sessions
}

export function updateSession(
  id: string,
  fields: Partial<
    Omit<CalendarSession, 'id' | 'createdAt'>
  >
): CalendarSession[] {
  const sessions = getSessions().map((s) => {
    if (s.id !== id) return s

    const updated = {
      ...s,
      ...fields
    }

    if (fields.status !== 'cancelled') {
      updated.status = resolveStatus(updated)
    }

    return updated
  })

  persist(sessions)

  return sessions
}

export function deleteSession(
  id: string
): CalendarSession[] {
  const sessions = getSessions().filter(
    (s) => s.id !== id
  )

  persist(sessions)

  return sessions
}

export function cancelSession(
  id: string
): CalendarSession[] {
  return updateSession(id, {
    status: 'cancelled'
  })
}

export function getSessionsByDay(
  date: string
): CalendarSession[] {
  return getSessions().filter(
    (s) => s.date === date
  )
}

export function getSessionsByMonth(
  yearMonth: string
): CalendarSession[] {
  return getSessions().filter((s) =>
    s.date.startsWith(yearMonth)
  )
}

export function getDaysWithSessions(
  yearMonth: string
): Set<string> {
  return new Set(
    getSessionsByMonth(yearMonth).map(
      (s) => s.date
    )
  )
}

export function getSessionStats() {
  const all = getSessions()

  return {
    total: all.length,

    upcoming: all.filter(
      (s) => s.status === 'upcoming'
    ).length,

    ongoing: all.filter(
      (s) => s.status === 'ongoing'
    ).length,

    done: all.filter(
      (s) => s.status === 'done'
    ).length,

    cancelled: all.filter(
      (s) => s.status === 'cancelled'
    ).length,
  }
}