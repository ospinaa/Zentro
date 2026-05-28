import {
  daysInMonth,
  firstWeekday,
  formatMonthLabel,
  pad,
  WEEKDAY_LABELS,
} from '../../utils/calendarDates'

export interface MiniMonthCalendarProps {
  currentMonth: string
  selectedDate: string
  today: string
  daysWithSessions: Set<string>
  onPrevMonth: () => void
  onNextMonth: () => void
  onSelectDate: (iso: string) => void
}

/** Calendario mensual compacto para el panel de control (solo navegación). */
export function MiniMonthCalendar({
  currentMonth,
  selectedDate,
  today,
  daysWithSessions,
  onPrevMonth,
  onNextMonth,
  onSelectDate,
}: MiniMonthCalendarProps) {
  const totalDays = daysInMonth(currentMonth)
  const startDay = firstWeekday(currentMonth)
  const [y, m] = currentMonth.split('-')

  return (
    <div className="tl-mini-cal">
      <div className="tl-mini-cal__nav">
        <button type="button" className="tl-mini-cal__btn" onClick={onPrevMonth} aria-label="Mes anterior">
          ‹
        </button>
        <span className="tl-mini-cal__label">{formatMonthLabel(currentMonth)}</span>
        <button type="button" className="tl-mini-cal__btn" onClick={onNextMonth} aria-label="Mes siguiente">
          ›
        </button>
      </div>

      <div className="tl-mini-cal__grid">
        {WEEKDAY_LABELS.map((wd) => (
          <span key={wd} className="tl-mini-cal__wd">
            {wd.slice(0, 2)}
          </span>
        ))}

        {Array.from({ length: startDay }).map((_, i) => (
          <span key={`e-${i}`} className="tl-mini-cal__cell tl-mini-cal__cell--empty" />
        ))}

        {Array.from({ length: totalDays }).map((_, i) => {
          const day = i + 1
          const iso = `${y}-${m}-${pad(day)}`
          const isSelected = iso === selectedDate
          const isToday = iso === today
          const hasEvent = daysWithSessions.has(iso)

          return (
            <button
              key={iso}
              type="button"
              className={[
                'tl-mini-cal__cell',
                isSelected ? 'tl-mini-cal__cell--selected' : '',
                isToday ? 'tl-mini-cal__cell--today' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={() => onSelectDate(iso)}
            >
              {day}
              {hasEvent && <span className="tl-mini-cal__dot" />}
            </button>
          )
        })}
      </div>
    </div>
  )
}
