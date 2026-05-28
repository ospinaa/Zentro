/**
 * Panel izquierdo: calendario compacto, búsqueda y acción principal.
 * Solo presentación; la lógica de estado vive en CalendarPage + SessionContext.
 */

import type { CalendarSession } from '../../services/sessionService'
import {
  daysInMonth,
  firstWeekday,
  formatMonthLabel,
  pad,
  WEEKDAY_LABELS,
} from '../../utils/calendarDates'

export interface CalendarSidebarProps {
  currentMonth: string
  selectedDate: string
  today: string
  daysWithSessions: Set<string>
  searchQuery: string
  searchResults: CalendarSession[]
  onSearchChange: (value: string) => void
  onPickSearchResult: (session: CalendarSession) => void
  onPrevMonth: () => void
  onNextMonth: () => void
  onSelectDate: (iso: string) => void
  onCreateSession: () => void
}

export function CalendarSidebar({
  currentMonth,
  selectedDate,
  today,
  daysWithSessions,
  searchQuery,
  searchResults,
  onSearchChange,
  onPickSearchResult,
  onPrevMonth,
  onNextMonth,
  onSelectDate,
  onCreateSession,
}: CalendarSidebarProps) {
  const totalDays = daysInMonth(currentMonth)
  const startDay = firstWeekday(currentMonth)
  const [y, m] = currentMonth.split('-')

  return (
    <aside className="cal-sidebar" aria-label="Calendario y búsqueda">
      <div className="cal-sidebar__card">
        <header className="cal-sidebar__head">
          <div>
            <p className="cal-sidebar__eyebrow">Agenda</p>
            <h2 className="cal-sidebar__title">Calendario</h2>
          </div>
          <button type="button" className="cal-sidebar__create" onClick={onCreateSession}>
            + Nueva sesión
          </button>
        </header>

        {/* Buscador de fechas / eventos */}
        <div className="cal-sidebar__search-wrap">
          <label className="cal-sidebar__search-label" htmlFor="cal-search">
            Buscar fecha o evento
          </label>
          <div className="cal-sidebar__search">
            <span className="cal-sidebar__search-icon" aria-hidden="true">
              ⌕
            </span>
            <input
              id="cal-search"
              type="search"
              className="cal-sidebar__search-input"
              placeholder="2025-05-28 o nombre de sesión"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              autoComplete="off"
            />
          </div>
          {searchQuery.trim() && searchResults.length > 0 && (
            <ul className="cal-sidebar__search-results" role="listbox">
              {searchResults.map((s) => (
                <li key={s.id}>
                  <button
                    type="button"
                    className="cal-sidebar__search-hit"
                    role="option"
                    onClick={() => onPickSearchResult(s)}
                  >
                    <span className="cal-sidebar__search-hit-date">{s.date}</span>
                    <span className="cal-sidebar__search-hit-title">{s.title}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
          {searchQuery.trim() && searchResults.length === 0 && (
            <p className="cal-sidebar__search-empty">Sin coincidencias</p>
          )}
        </div>

        {/* Navegación mensual */}
        <div className="cal-nav">
          <button type="button" className="cal-nav__btn" onClick={onPrevMonth} aria-label="Mes anterior">
            ‹
          </button>
          <span className="cal-nav__label">{formatMonthLabel(currentMonth)}</span>
          <button type="button" className="cal-nav__btn" onClick={onNextMonth} aria-label="Mes siguiente">
            ›
          </button>
        </div>

        {/* Grilla mensual compacta */}
        <div className="cal-grid">
          {WEEKDAY_LABELS.map((wd) => (
            <div key={wd} className="cal-grid__weekday">
              {wd}
            </div>
          ))}

          {Array.from({ length: startDay }).map((_, i) => (
            <div key={`empty-${i}`} className="cal-grid__cell cal-grid__cell--empty" />
          ))}

          {Array.from({ length: totalDays }).map((_, i) => {
            const day = i + 1
            const iso = `${y}-${m}-${pad(day)}`
            const hasSess = daysWithSessions.has(iso)
            const isToday = iso === today
            const isSel = iso === selectedDate

            return (
              <button
                key={iso}
                type="button"
                className={[
                  'cal-grid__cell',
                  isToday ? 'cal-grid__cell--today' : '',
                  isSel ? 'cal-grid__cell--selected' : '',
                  hasSess ? 'cal-grid__cell--has-event' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => onSelectDate(iso)}
                aria-label={`${day}, ${hasSess ? 'con actividades' : 'sin actividades'}`}
                aria-pressed={isSel}
              >
                <span className="cal-grid__day">{day}</span>
                {hasSess && <span className="cal-grid__dot" aria-hidden="true" />}
              </button>
            )
          })}
        </div>

        <p className="cal-sidebar__hint">Los puntos indican días con sesiones programadas.</p>
      </div>
    </aside>
  )
}
