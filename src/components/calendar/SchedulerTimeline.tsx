import { useMemo } from 'react'
import type { CalendarSession, SessionStatus } from '../../services/sessionService'
import { formatShortWeekday } from '../../utils/calendarDates'
import {
  formatHourLabel,
  getHourSlots,
  layoutDayEvents,
  TIMELINE_CANVAS_HEIGHT_PX,
} from '../../utils/timelineLayout'
import { TimelineEventBlock } from './TimelineEventBlock'

export interface SchedulerTimelineProps {
  weekDates: string[]
  weekLabel: string
  sessions: CalendarSession[]
  selectedDate: string
  today: string
  statusColor: Record<SessionStatus, string>
  onPrevWeek: () => void
  onNextWeek: () => void
  onGoToday: () => void
  onSelectDate: (iso: string) => void
  onEventSelect: (session: CalendarSession) => void
}

/**
 * Grid semanal: días en columnas, horas en filas, eventos posicionados dinámicamente.
 */
export function SchedulerTimeline({
  weekDates,
  weekLabel,
  sessions,
  selectedDate,
  today,
  statusColor,
  onPrevWeek,
  onNextWeek,
  onGoToday,
  onSelectDate,
  onEventSelect,
}: SchedulerTimelineProps) {
  const hourSlots = getHourSlots()

  const eventsByDay = useMemo(() => {
    const map = new Map<string, ReturnType<typeof layoutDayEvents>>()
    for (const date of weekDates) {
      const daySessions = sessions.filter((s) => s.date === date)
      map.set(date, layoutDayEvents(daySessions))
    }
    return map
  }, [weekDates, sessions])

  return (
    <section className="tl-scheduler" aria-label="Agenda semanal">
      <header className="tl-toolbar">
        <div className="tl-toolbar__left">
          <h1 className="tl-toolbar__title">Calendario</h1>
          <p className="tl-toolbar__range">{weekLabel}</p>
        </div>
        <div className="tl-toolbar__nav">
          <button type="button" className="tl-toolbar__btn" onClick={onPrevWeek} aria-label="Semana anterior">
            ‹
          </button>
          <button type="button" className="tl-toolbar__btn tl-toolbar__btn--ghost" onClick={onGoToday}>
            Hoy
          </button>
          <button type="button" className="tl-toolbar__btn" onClick={onNextWeek} aria-label="Semana siguiente">
            ›
          </button>
        </div>
      </header>

      <div className="tl-scroll">
        <div className="tl-matrix">
          <div className="tl-matrix__head">
            <div className="tl-matrix__gutter" />
            {weekDates.map((date) => {
              const isSelected = date === selectedDate
              const isToday = date === today
              const dayNum = new Date(`${date}T12:00`).getDate()

              return (
                <button
                  key={date}
                  type="button"
                  className={[
                    'tl-day-head',
                    isSelected ? 'tl-day-head--selected' : '',
                    isToday ? 'tl-day-head--today' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() => onSelectDate(date)}
                >
                  <span className="tl-day-head__wd">{formatShortWeekday(date)}</span>
                  <span className="tl-day-head__num">{dayNum}</span>
                </button>
              )
            })}
          </div>

          <div className="tl-matrix__body">
            <div className="tl-hours" style={{ height: TIMELINE_CANVAS_HEIGHT_PX }}>
              {hourSlots.map((hour) => (
                <div key={hour} className="tl-hours__slot">
                  {formatHourLabel(hour)}
                </div>
              ))}
            </div>

            <div className="tl-days">
              {weekDates.map((date) => {
                const positioned = eventsByDay.get(date) ?? []
                const isSelected = date === selectedDate

                return (
                  <div
                    key={`col-${date}`}
                    className={['tl-day-col', isSelected ? 'tl-day-col--selected' : '']
                      .filter(Boolean)
                      .join(' ')}
                    style={{ height: TIMELINE_CANVAS_HEIGHT_PX }}
                  >
                    {hourSlots.map((hour) => (
                      <div key={hour} className="tl-day-col__line" />
                    ))}
                    {positioned.map((item) => (
                      <TimelineEventBlock
                        key={item.session.id}
                        session={item.session}
                        topPx={item.topPx}
                        heightPx={item.heightPx}
                        columnIndex={item.columnIndex}
                        columnCount={item.columnCount}
                        statusColor={statusColor}
                        onSelect={onEventSelect}
                      />
                    ))}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
