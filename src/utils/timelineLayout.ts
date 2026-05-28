import type { CalendarSession } from '../services/sessionService'

/** Horario visible en el grid (6:00 – 22:00). */
export const TIMELINE_START_HOUR = 6
export const TIMELINE_END_HOUR = 22
export const TIMELINE_HOUR_PX = 56

export const TIMELINE_TOTAL_MINUTES =
  (TIMELINE_END_HOUR - TIMELINE_START_HOUR) * 60

export const TIMELINE_CANVAS_HEIGHT_PX =
  (TIMELINE_END_HOUR - TIMELINE_START_HOUR) * TIMELINE_HOUR_PX

export function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number)
  return h * 60 + (m || 0)
}

export function formatHourLabel(hour: number): string {
  const h12 = hour % 12 === 0 ? 12 : hour % 12
  const suffix = hour < 12 ? 'AM' : 'PM'
  return `${h12} ${suffix}`
}

export interface PositionedTimelineEvent {
  session: CalendarSession
  topPx: number
  heightPx: number
  columnIndex: number
  columnCount: number
}

/**
 * Calcula posición vertical y columnas para eventos solapados en un día.
 */
export function layoutDayEvents(
  sessions: CalendarSession[],
): PositionedTimelineEvent[] {
  const gridStart = TIMELINE_START_HOUR * 60
  const gridEnd = TIMELINE_END_HOUR * 60

  const sorted = [...sessions].sort(
    (a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime),
  )

  const columns: CalendarSession[][] = []

  for (const session of sorted) {
    const start = timeToMinutes(session.startTime)
    let placed = false

    for (const col of columns) {
      const last = col[col.length - 1]
      if (timeToMinutes(last.endTime) <= start) {
        col.push(session)
        placed = true
        break
      }
    }

    if (!placed) columns.push([session])
  }

  const columnCount = Math.max(columns.length, 1)
  const result: PositionedTimelineEvent[] = []

  columns.forEach((col, columnIndex) => {
    for (const session of col) {
      const start = Math.max(timeToMinutes(session.startTime), gridStart)
      const end = Math.min(timeToMinutes(session.endTime), gridEnd)
      const duration = Math.max(end - start, 15)

      result.push({
        session,
        topPx: ((start - gridStart) / 60) * TIMELINE_HOUR_PX,
        heightPx: (duration / 60) * TIMELINE_HOUR_PX,
        columnIndex,
        columnCount,
      })
    }
  })

  return result
}

export function getHourSlots(): number[] {
  const slots: number[] = []
  for (let h = TIMELINE_START_HOUR; h < TIMELINE_END_HOUR; h += 1) {
    slots.push(h)
  }
  return slots
}
