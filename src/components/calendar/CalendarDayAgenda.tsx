/**
 * Panel derecho: detalle del día seleccionado (estilo naranja / agenda).
 * Acciones de edición conservan la lógica del padre (auth + SessionContext).
 */

import { auth } from '../../services/firebase'
import type { CalendarSession, SessionStatus } from '../../services/sessionService'
import { formatDayHeading } from '../../utils/calendarDates'

export interface CalendarDayAgendaProps {
  selectedDate: string
  sessions: CalendarSession[]
  statusColor: Record<SessionStatus, string>
  statusLabel: Record<SessionStatus, string>
  onCreateSession: () => void
  onEditSession: (session: CalendarSession) => void
  onCancelSession: (id: string) => void
  onRemoveSession: (id: string) => void
}

export function CalendarDayAgenda({
  selectedDate,
  sessions,
  statusColor,
  statusLabel,
  onCreateSession,
  onEditSession,
  onCancelSession,
  onRemoveSession,
}: CalendarDayAgendaProps) {
  const sorted = [...sessions].sort((a, b) => a.startTime.localeCompare(b.startTime))

  return (
    <section className="cal-agenda" aria-label="Actividades del día">
      <header className="cal-agenda__header">
        <div className="cal-agenda__header-text">
          <p className="cal-agenda__eyebrow">Detalle del día</p>
          <h2 className="cal-agenda__title">{formatDayHeading(selectedDate)}</h2>
          <p className="cal-agenda__meta">
            {sorted.length === 0
              ? 'No hay sesiones programadas'
              : `${sorted.length} sesión${sorted.length === 1 ? '' : 'es'}`}
          </p>
        </div>
        <button type="button" className="cal-agenda__add" onClick={onCreateSession}>
          + Agregar
        </button>
      </header>

      <div className="cal-agenda__body">
        {sorted.length === 0 ? (
          <div className="cal-agenda__empty">
            <p>Sin sesiones para este día.</p>
            <button type="button" className="cal-agenda__empty-btn" onClick={onCreateSession}>
              Programar primera sesión
            </button>
          </div>
        ) : (
          <ul className="cal-session-list">
            {sorted.map((s) => {
              const isOwner = auth.currentUser?.uid === s.firebase_uid

              return (
                <li
                  key={s.id}
                  className="cal-session-card"
                  style={{ '--cal-session-accent': statusColor[s.status] } as React.CSSProperties}
                >
                  <div className="cal-session-card__top">
                    <span className="cal-session-card__time">
                      {s.startTime} – {s.endTime}
                    </span>
                    <span
                      className="cal-session-card__badge"
                      style={{ background: statusColor[s.status] }}
                    >
                      {statusLabel[s.status]}
                    </span>
                  </div>

                  <h3 className="cal-session-card__title">{s.title}</h3>

                  {s.description && <p className="cal-session-card__desc">{s.description}</p>}

                  {s.location && (
                    <p className="cal-session-card__loc">
                      <span className="cal-session-card__loc-label">Ubicación</span>
                      {s.location}
                    </p>
                  )}

                  {s.tags.length > 0 && (
                    <div className="cal-session-card__tags">
                      {s.tags.map((t) => (
                        <span key={t} className="cal-tag">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}

                  {isOwner && (
                    <div className="cal-session-card__actions">
                      <button
                        type="button"
                        className="cal-action-btn cal-action-btn--edit"
                        onClick={() => onEditSession(s)}
                      >
                        Editar
                      </button>
                      {s.status !== 'cancelled' && (
                        <button
                          type="button"
                          className="cal-action-btn cal-action-btn--cancel"
                          onClick={() => onCancelSession(s.id)}
                        >
                          Cancelar
                        </button>
                      )}
                      <button
                        type="button"
                        className="cal-action-btn cal-action-btn--delete"
                        onClick={() => onRemoveSession(s.id)}
                      >
                        Eliminar
                      </button>
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </div>

      <footer className="cal-agenda__legend">
        {(Object.entries(statusLabel) as [SessionStatus, string][]).map(([key, label]) => (
          <span key={key} className="cal-legend__item">
            <span className="cal-legend__dot" style={{ background: statusColor[key] }} />
            {label}
          </span>
        ))}
      </footer>
    </section>
  )
}
