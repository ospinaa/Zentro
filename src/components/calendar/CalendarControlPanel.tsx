import { formatDayHeading } from '../../utils/calendarDates'
import { MiniMonthCalendar } from './MiniMonthCalendar'

export interface CalendarControlPanelProps {
  selectedDate: string
  currentMonth: string
  today: string
  daysWithSessions: Set<string>
  sessionCountForDay: number
  onPrevMonth: () => void
  onNextMonth: () => void
  onSelectDate: (iso: string) => void
  onCreateSession: () => void
}

/**
 * Panel derecho (~25%): navegación por fecha y acción principal.
 * No muestra lista de sesiones — el timeline es la única vista de eventos.
 */
export function CalendarControlPanel({
  selectedDate,
  currentMonth,
  today,
  daysWithSessions,
  sessionCountForDay,
  onPrevMonth,
  onNextMonth,
  onSelectDate,
  onCreateSession,
}: CalendarControlPanelProps) {
  return (
    <aside className="tl-control" aria-label="Control de calendario">
      <header className="tl-control__head">
        <p className="tl-control__eyebrow">Detalle del día</p>
        <h2 className="tl-control__date">{formatDayHeading(selectedDate)}</h2>
        <p className="tl-control__meta">
          {sessionCountForDay === 0
            ? 'Sin sesiones este día'
            : `${sessionCountForDay} sesión${sessionCountForDay === 1 ? '' : 'es'} en el timeline`}
        </p>
      </header>

      <MiniMonthCalendar
        currentMonth={currentMonth}
        selectedDate={selectedDate}
        today={today}
        daysWithSessions={daysWithSessions}
        onPrevMonth={onPrevMonth}
        onNextMonth={onNextMonth}
        onSelectDate={onSelectDate}
      />

      <button type="button" className="tl-control__create" onClick={onCreateSession}>
        Nueva sesión
      </button>

      <p className="tl-control__hint">
        Haz clic en un bloque del timeline para editar. Los cambios se sincronizan al guardar.
      </p>
    </aside>
  )
}
