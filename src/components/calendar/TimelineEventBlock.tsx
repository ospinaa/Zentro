import type { CalendarSession, SessionStatus } from '../../services/sessionService'

export interface TimelineEventBlockProps {
  session: CalendarSession
  topPx: number
  heightPx: number
  columnIndex: number
  columnCount: number
  statusColor: Record<SessionStatus, string>
  onSelect: (session: CalendarSession) => void
}

/** Bloque flotante minimalista dentro de una columna del timeline. */
export function TimelineEventBlock({
  session,
  topPx,
  heightPx,
  columnIndex,
  columnCount,
  statusColor,
  onSelect,
}: TimelineEventBlockProps) {
  const widthPercent = 100 / columnCount
  const leftPercent = columnIndex * widthPercent

  return (
    <button
      type="button"
      className="tl-event"
      style={{
        top: `${topPx}px`,
        height: `${Math.max(heightPx, 28)}px`,
        left: `calc(${leftPercent}% + 3px)`,
        width: `calc(${widthPercent}% - 6px)`,
        ['--tl-accent' as string]: statusColor[session.status],
      }}
      onClick={() => onSelect(session)}
      title={`${session.title} (${session.startTime} – ${session.endTime})`}
    >
      <span className="tl-event__time">
        {session.startTime} – {session.endTime}
      </span>
      <span className="tl-event__title">{session.title}</span>
      {session.location && heightPx > 44 && (
        <span className="tl-event__meta">{session.location}</span>
      )}
    </button>
  )
}
