<<<<<<< HEAD
=======

>>>>>>> a26aa50691b5e80f70ab39b91744990bcbc72a30
import { useEffect, useState } from 'react'
import { DashboardLayout } from '../layout/DashboardLayout'
import { useSessions } from '../context/SessionContext'
import type {
  CalendarSession,
  SessionStatus,
} from '../services/sessionService'

import { useProfile } from '../context/ProfileContexts'
import { auth } from '../services/firebase'

<<<<<<< HEAD
=======

>>>>>>> a26aa50691b5e80f70ab39b91744990bcbc72a30
function daysInMonth(yearMonth: string): number {
  const [y, m] = yearMonth.split('-').map(Number)
  return new Date(y, m, 0).getDate()
}

function firstWeekday(yearMonth: string): number {
  const [y, m] = yearMonth.split('-').map(Number)
  return new Date(y, m - 1, 1).getDay()
}

function pad(n: number): string {
  return String(n).padStart(2, '0')
}

function formatMonthLabel(yearMonth: string): string {
  const [y, m] = yearMonth.split('-').map(Number)

  return new Date(y, m - 1, 1).toLocaleString(
    'es',
    {
      month: 'long',
      year: 'numeric',
    }
  )
}

function prevMonth(yearMonth: string): string {
  const [y, m] = yearMonth.split('-').map(Number)

  const d = new Date(y, m - 2, 1)

  return `${d.getFullYear()}-${pad(
    d.getMonth() + 1
  )}`
}

function nextMonth(yearMonth: string): string {
  const [y, m] = yearMonth.split('-').map(Number)

  const d = new Date(y, m, 1)

  return `${d.getFullYear()}-${pad(
    d.getMonth() + 1
  )}`
}

<<<<<<< HEAD
const STATUS_COLOR: Record<SessionStatus, string> = {
=======

const STATUS_COLOR: Record<
  SessionStatus,
  string
> = {
>>>>>>> a26aa50691b5e80f70ab39b91744990bcbc72a30
  upcoming: '#6c63ff',
  ongoing: '#f0a500',
  done: '#4caf82',
  cancelled: '#e05c5c',
}

<<<<<<< HEAD
const STATUS_LABEL: Record<SessionStatus, string> = {
=======
const STATUS_LABEL: Record<
  SessionStatus,
  string
> = {
>>>>>>> a26aa50691b5e80f70ab39b91744990bcbc72a30
  upcoming: 'Próxima',
  ongoing: 'En curso',
  done: 'Finalizada',
  cancelled: 'Cancelada',
}

<<<<<<< HEAD
=======

>>>>>>> a26aa50691b5e80f70ab39b91744990bcbc72a30
type ModalMode = 'create' | 'edit'

interface ModalState {
  mode: ModalMode
  session?: CalendarSession
}

<<<<<<< HEAD
=======

>>>>>>> a26aa50691b5e80f70ab39b91744990bcbc72a30
function emptyForm(date: string) {
  return {
    title: '',
    description: '',
    date,
    startTime: '09:00',
    endTime: '10:00',
    tags: '',
    location: '',
  }
}

<<<<<<< HEAD
=======

>>>>>>> a26aa50691b5e80f70ab39b91744990bcbc72a30
export function CalendarPage() {

  const {
    currentMonth,
    setCurrentMonth,

    selectedDate,
    setSelectedDate,

    daysWithSessions,
    sessionsOfDay,

    addSession,
    editSession,
    removeSession,
    cancelSession,
  } = useSessions()

  const { userInitials } =
    useProfile()

  const [modal, setModal] =
    useState<ModalState | null>(null)

  const [form, setForm] =
    useState(
      emptyForm(selectedDate)
    )

  const [formError, setFormError] =
    useState('')

  useEffect(() => {
    document.title =
      'Calendario · Zentro'
  }, [])

<<<<<<< HEAD
  useEffect(() => {
    document.title = 'Calendario · Zentro'
  }, [])
=======
>>>>>>> a26aa50691b5e80f70ab39b91744990bcbc72a30

  function openCreate() {

<<<<<<< HEAD
  function openEdit(session: CalendarSession) {
    setForm({
      title: session.title,
      description: session.description,
      date: session.date,
      startTime: session.startTime,
      endTime: session.endTime,
      tags: session.tags.join(', '),
      location: session.location,
    })

    setFormError('')
    setModal({ mode: 'edit', session })
  }

  function handleSubmit() {
    if (!form.title.trim()) {
      setFormError('El título es obligatorio.')
      return
    }

    if (form.startTime >= form.endTime) {
      setFormError('La hora de inicio debe ser antes del fin.')
=======
    setForm(
      emptyForm(selectedDate)
    )

    setFormError('')

    setModal({
      mode: 'create',
    })
  }


  function openEdit(
    session: CalendarSession
  ) {

    const isOwner =
      auth.currentUser?.uid ===
      session.firebase_uid

    if (!isOwner) return

    setForm({
      title: session.title,

      description:
        session.description,

      date: session.date,

      startTime:
        session.startTime,

      endTime:
        session.endTime,

      tags:
        session.tags.join(', '),

      location:
        session.location,
    })

    setFormError('')

    setModal({
      mode: 'edit',
      session,
    })
  }


  async function handleSubmit() {

    if (!form.title.trim()) {

      setFormError(
        'El título es obligatorio.'
      )

      return
    }

    if (
      form.startTime >=
      form.endTime
    ) {

      setFormError(
        'La hora de inicio debe ser antes del fin.'
      )

>>>>>>> a26aa50691b5e80f70ab39b91744990bcbc72a30
      return
    }

    const payload = {
<<<<<<< HEAD
      title: form.title.trim(),
      description: form.description.trim(),
      date: form.date,
      startTime: form.startTime,
      endTime: form.endTime,
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      location: form.location.trim(),
=======

      title:
        form.title.trim(),

      description:
        form.description.trim(),

      date:
        form.date,

      startTime:
        form.startTime,

      endTime:
        form.endTime,

      tags:
        form.tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),

      location:
        form.location.trim(),
>>>>>>> a26aa50691b5e80f70ab39b91744990bcbc72a30
    }

    if (
      modal?.mode === 'create'
    ) {

      await addSession(payload)

    } else if (
      modal?.mode === 'edit' &&
      modal.session
    ) {

      await editSession(
        modal.session.id,
        payload
      )
    }

    setModal(null)
  }

<<<<<<< HEAD
  const totalDays = daysInMonth(currentMonth)
  const startDay = firstWeekday(currentMonth)
  const today = new Date().toISOString().slice(0, 10)
  const [y, m] = currentMonth.split('-')
  const weekdays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
=======

  const totalDays =
    daysInMonth(currentMonth)

  const startDay =
    firstWeekday(currentMonth)

  const today =
    new Date()
      .toISOString()
      .slice(0, 10)

  const [y, m] =
    currentMonth.split('-')

  const weekdays = [
    'Dom',
    'Lun',
    'Mar',
    'Mié',
    'Jue',
    'Vie',
    'Sáb',
  ]
>>>>>>> a26aa50691b5e80f70ab39b91744990bcbc72a30

  return (

    <DashboardLayout
      userInitials={
        userInitials
      }
    >

      <div className="cal-page">
<<<<<<< HEAD
=======


>>>>>>> a26aa50691b5e80f70ab39b91744990bcbc72a30
        <div className="cal-header">

          <div>

            <h1 className="dash-hero__title">
              Calendario
            </h1>

            <p className="dash-hero__subtitle">
              Gestiona tus sesiones
            </p>

          </div>

          <button
            type="button"
            className="proj-page__new-btn"
            onClick={openCreate}
          >
            + Nueva sesión
          </button>

        </div>

        <div className="cal-body">
<<<<<<< HEAD
          <div className="cal-grid-panel">
            <div className="cal-nav">
              <button
                type="button"
                className="cal-nav__btn"
                onClick={() => setCurrentMonth(prevMonth(currentMonth))}
=======

          {/* Calendario */}

          <div className="cal-grid-panel">

            <div className="cal-nav">

              <button
                type="button"
                className="cal-nav__btn"
                onClick={() =>
                  setCurrentMonth(
                    prevMonth(currentMonth)
                  )
                }
>>>>>>> a26aa50691b5e80f70ab39b91744990bcbc72a30
              >
                ‹
              </button>

              <span className="cal-nav__label">
<<<<<<< HEAD
                {formatMonthLabel(currentMonth)}
=======
                {formatMonthLabel(
                  currentMonth
                )}
>>>>>>> a26aa50691b5e80f70ab39b91744990bcbc72a30
              </span>

              <button
                type="button"
                className="cal-nav__btn"
<<<<<<< HEAD
                onClick={() => setCurrentMonth(nextMonth(currentMonth))}
              >
                ›
              </button>
=======
                onClick={() =>
                  setCurrentMonth(
                    nextMonth(currentMonth)
                  )
                }
              >
                ›
              </button>

>>>>>>> a26aa50691b5e80f70ab39b91744990bcbc72a30
            </div>

            <div className="cal-grid">

              {weekdays.map((wd) => (
<<<<<<< HEAD
                <div key={wd} className="cal-grid__weekday">
                  {wd}
                </div>
              ))}

              {Array.from({ length: startDay }).map((_, i) => (
=======

                <div
                  key={wd}
                  className="cal-grid__weekday"
                >
                  {wd}
                </div>

              ))}

              {Array.from({
                length: startDay,
              }).map((_, i) => (

>>>>>>> a26aa50691b5e80f70ab39b91744990bcbc72a30
                <div
                  key={`empty-${i}`}
                  className="cal-grid__cell cal-grid__cell--empty"
                />
<<<<<<< HEAD
              ))}

              {Array.from({ length: totalDays }).map((_, i) => {
                const day = i + 1
                const iso = `${y}-${m}-${pad(day)}`
                const hasSess = daysWithSessions.has(iso)
                const isToday = iso === today
                const isSel = iso === selectedDate
=======

              ))}

              {Array.from({
                length: totalDays,
              }).map((_, i) => {

                const day =
                  i + 1

                const iso =
                  `${y}-${m}-${pad(day)}`

                const hasSess =
                  daysWithSessions.has(
                    iso
                  )

                const isToday =
                  iso === today

                const isSel =
                  iso === selectedDate
>>>>>>> a26aa50691b5e80f70ab39b91744990bcbc72a30

                return (

                  <button
                    key={iso}
                    type="button"
                    className={[
                      'cal-grid__cell',
<<<<<<< HEAD
                      isToday ? 'cal-grid__cell--today' : '',
                      isSel ? 'cal-grid__cell--selected' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    onClick={() => setSelectedDate(iso)}
                  >
                    <span className="cal-grid__day">{day}</span>

                    {hasSess && <span className="cal-grid__dot" />}
=======

                      isToday
                        ? 'cal-grid__cell--today'
                        : '',

                      isSel
                        ? 'cal-grid__cell--selected'
                        : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}

                    onClick={() =>
                      setSelectedDate(
                        iso
                      )
                    }
                  >

                    <span className="cal-grid__day">
                      {day}
                    </span>

                    {hasSess && (
                      <span className="cal-grid__dot" />
                    )}

>>>>>>> a26aa50691b5e80f70ab39b91744990bcbc72a30
                  </button>

                )
              })}
            </div>

<<<<<<< HEAD
            <div className="cal-legend">
              {(Object.entries(STATUS_LABEL) as [SessionStatus, string][])
                .map(([k, label]) => (
                  <span key={k} className="cal-legend__item">
                    <span
                      className="cal-legend__dot"
                      style={{ background: STATUS_COLOR[k] }}
                    />

                    {label}
                  </span>
                ))}
            </div>
          </div>

=======

            <div className="cal-legend">

              {(Object.entries(
                STATUS_LABEL
              ) as [
                SessionStatus,
                string
              ][]).map(
                ([k, label]) => (

                  <span
                    key={k}
                    className="cal-legend__item"
                  >

                    <span
                      className="cal-legend__dot"
                      style={{
                        background:
                          STATUS_COLOR[k],
                      }}
                    />

                    {label}

                  </span>
                )
              )}

            </div>
          </div>


>>>>>>> a26aa50691b5e80f70ab39b91744990bcbc72a30
          <div className="cal-day-panel">

            <h2 className="cal-day-panel__title">
<<<<<<< HEAD
              {new Date(selectedDate + 'T12:00').toLocaleDateString('es', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
              })}
=======

              {new Date(
                selectedDate + 'T12:00'
              ).toLocaleDateString(
                'es',
                {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                }
              )}

>>>>>>> a26aa50691b5e80f70ab39b91744990bcbc72a30
            </h2>

            {sessionsOfDay.length === 0 ? (

              <div className="cal-day-panel__empty">
<<<<<<< HEAD
                <p>Sin sesiones para este día.</p>
=======

                <p>
                  Sin sesiones para este día.
                </p>
>>>>>>> a26aa50691b5e80f70ab39b91744990bcbc72a30

                <button
                  type="button"
                  className="cal-day-panel__add-btn"
                  onClick={openCreate}
                >
                  + Agregar sesión
                </button>

              </div>

            ) : (

              <ul className="cal-session-list">

                {sessionsOfDay
<<<<<<< HEAD
                  .sort((a, b) => a.startTime.localeCompare(b.startTime))
                  .map((s) => (
                    <li
                      key={s.id}
                      className="cal-session-card"
                      style={{ borderLeftColor: STATUS_COLOR[s.status] }}
                    >
                      <div className="cal-session-card__top">
                        <span className="cal-session-card__time">
                          {s.startTime} – {s.endTime}
                        </span>

                        <span
                          className="cal-session-card__badge"
                          style={{ background: STATUS_COLOR[s.status] }}
                        >
                          {STATUS_LABEL[s.status]}
                        </span>
                      </div>

                      <p className="cal-session-card__title">{s.title}</p>

                      {s.description && (
                        <p className="cal-session-card__desc">
                          {s.description}
                        </p>
                      )}

                      {s.location && (
                        <p className="cal-session-card__loc">
                          📍 {s.location}
                        </p>
                      )}

                      {s.tags.length > 0 && (
                        <div className="cal-session-card__tags">
                          {s.tags.map((t) => (
                            <span key={t} className="pf-tag">
                              {t}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="cal-session-card__actions">
                        <button
                          type="button"
                          className="cal-action-btn cal-action-btn--edit"
                          onClick={() => openEdit(s)}
                        >
                          Editar
                        </button>

                        {s.status !== 'cancelled' && (
                          <button
                            type="button"
                            className="cal-action-btn cal-action-btn--cancel"
                            onClick={() => cancelSession(s.id)}
                          >
                            Cancelar
                          </button>
                        )}

                        <button
                          type="button"
                          className="cal-action-btn cal-action-btn--delete"
                          onClick={() => removeSession(s.id)}
                        >
                          Eliminar
                        </button>
                      </div>
                    </li>
                  ))}
=======
                  .sort((a, b) =>
                    a.startTime.localeCompare(
                      b.startTime
                    )
                  )
                  .map((s) => {

                    const isOwner =
                      auth.currentUser?.uid ===
                      s.firebase_uid

                    return (

                      <li
                        key={s.id}
                        className="cal-session-card"
                        style={{
                          borderLeftColor:
                            STATUS_COLOR[
                              s.status
                            ],
                        }}
                      >

                        <div className="cal-session-card__top">

                          <span className="cal-session-card__time">
                            {s.startTime} – {s.endTime}
                          </span>

                          <span
                            className="cal-session-card__badge"
                            style={{
                              background:
                                STATUS_COLOR[
                                  s.status
                                ],
                            }}
                          >
                            {STATUS_LABEL[
                              s.status
                            ]}
                          </span>

                        </div>

                        <p className="cal-session-card__title">
                          {s.title}
                        </p>

                        {s.description && (

                          <p className="cal-session-card__desc">
                            {s.description}
                          </p>

                        )}

                        {s.location && (

                          <p className="cal-session-card__loc">
                            📍 {s.location}
                          </p>

                        )}

                        {s.tags.length > 0 && (

                          <div className="cal-session-card__tags">

                            {s.tags.map((t) => (

                              <span
                                key={t}
                                className="pf-tag"
                              >
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
                              onClick={() =>
                                openEdit(s)
                              }
                            >
                              Editar
                            </button>

                            {s.status !==
                              'cancelled' && (

                              <button
                                type="button"
                                className="cal-action-btn cal-action-btn--cancel"
                                onClick={() =>
                                  cancelSession(
                                    s.id
                                  )
                                }
                              >
                                Cancelar
                              </button>

                            )}

                            <button
                              type="button"
                              className="cal-action-btn cal-action-btn--delete"
                              onClick={() =>
                                removeSession(
                                  s.id
                                )
                              }
                            >
                              Eliminar
                            </button>

                          </div>

                        )}

                      </li>
                    )
                  })}

>>>>>>> a26aa50691b5e80f70ab39b91744990bcbc72a30
              </ul>

            )}

          </div>

        </div>

      </div>

<<<<<<< HEAD
=======

>>>>>>> a26aa50691b5e80f70ab39b91744990bcbc72a30
      {modal && (

        <div
          className="pm-overlay"
          role="dialog"
          aria-modal="true"
        >

          <div className="pm-panel">

            <div className="pm-header">

              <h2 className="pm-title">
<<<<<<< HEAD
                {modal.mode === 'create'
                  ? 'Nueva sesión'
                  : 'Editar sesión'}
=======

                {modal.mode ===
                'create'
                  ? 'Nueva sesión'
                  : 'Editar sesión'}

>>>>>>> a26aa50691b5e80f70ab39b91744990bcbc72a30
              </h2>

              <button
                className="pm-close"
                type="button"
<<<<<<< HEAD
                onClick={() => setModal(null)}
              >
                ✕
              </button>
            </div>

            <div className="pm-body">
              <div className="auth-field">
                <label className="auth-label">Título *</label>
=======
                onClick={() =>
                  setModal(null)
                }
              >
                ✕
              </button>

            </div>

            <div className="pm-body">

              <div className="auth-field">

                <label className="auth-label">
                  Título *
                </label>
>>>>>>> a26aa50691b5e80f70ab39b91744990bcbc72a30

                <input
                  className="auth-input"
                  placeholder="Ej: Clase de React"
                  value={form.title}
                  onChange={(e) =>
<<<<<<< HEAD
                    setForm({ ...form, title: e.target.value })
                  }
                />
              </div>

              <div className="auth-field">
                <label className="auth-label">Descripción</label>
=======
                    setForm({
                      ...form,
                      title:
                        e.target.value,
                    })
                  }
                />

              </div>

              <div className="auth-field">

                <label className="auth-label">
                  Descripción
                </label>
>>>>>>> a26aa50691b5e80f70ab39b91744990bcbc72a30

                <textarea
                  className="auth-input pm-textarea"
                  rows={2}
                  placeholder="¿De qué trata la sesión?"
                  value={form.description}
                  onChange={(e) =>
<<<<<<< HEAD
                    setForm({ ...form, description: e.target.value })
                  }
                />
              </div>

              <div className="auth-field">
                <label className="auth-label">Fecha</label>
=======
                    setForm({
                      ...form,
                      description:
                        e.target.value,
                    })
                  }
                />

              </div>

              <div className="auth-field">

                <label className="auth-label">
                  Fecha
                </label>
>>>>>>> a26aa50691b5e80f70ab39b91744990bcbc72a30

                <input
                  className="auth-input"
                  type="date"
                  value={form.date}
                  onChange={(e) =>
<<<<<<< HEAD
                    setForm({ ...form, date: e.target.value })
                  }
                />
=======
                    setForm({
                      ...form,
                      date:
                        e.target.value,
                    })
                  }
                />

>>>>>>> a26aa50691b5e80f70ab39b91744990bcbc72a30
              </div>

              <div className="cal-modal__time-row">

                <div className="auth-field">
<<<<<<< HEAD
                  <label className="auth-label">Inicio</label>
=======

                  <label className="auth-label">
                    Inicio
                  </label>
>>>>>>> a26aa50691b5e80f70ab39b91744990bcbc72a30

                  <input
                    className="auth-input"
                    type="time"
                    value={form.startTime}
                    onChange={(e) =>
<<<<<<< HEAD
                      setForm({ ...form, startTime: e.target.value })
                    }
                  />
                </div>

                <div className="auth-field">
                  <label className="auth-label">Fin</label>
=======
                      setForm({
                        ...form,
                        startTime:
                          e.target.value,
                      })
                    }
                  />

                </div>

                <div className="auth-field">

                  <label className="auth-label">
                    Fin
                  </label>
>>>>>>> a26aa50691b5e80f70ab39b91744990bcbc72a30

                  <input
                    className="auth-input"
                    type="time"
                    value={form.endTime}
                    onChange={(e) =>
<<<<<<< HEAD
                      setForm({ ...form, endTime: e.target.value })
                    }
                  />
=======
                      setForm({
                        ...form,
                        endTime:
                          e.target.value,
                      })
                    }
                  />

>>>>>>> a26aa50691b5e80f70ab39b91744990bcbc72a30
                </div>

              </div>

              <div className="auth-field">
<<<<<<< HEAD
                <label className="auth-label">Lugar / Link</label>

                <input
                  className="auth-input"
                  placeholder="Sala B2 o https://meet.google.com/..."
                  value={form.location}
                  onChange={(e) =>
                    setForm({ ...form, location: e.target.value })
                  }
                />
              </div>

              <div className="auth-field">
                <label className="auth-label">
                  Tags (separados por coma)
=======

                <label className="auth-label">
                  Lugar / Link
                </label>

                <input
                  className="auth-input"
                  placeholder="Sala B2 o Meet"
                  value={form.location}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      location:
                        e.target.value,
                    })
                  }
                />

              </div>

              <div className="auth-field">

                <label className="auth-label">
                  Tags
>>>>>>> a26aa50691b5e80f70ab39b91744990bcbc72a30
                </label>

                <input
                  className="auth-input"
<<<<<<< HEAD
                  placeholder="React, DMI, Proyecto"
                  value={form.tags}
                  onChange={(e) =>
                    setForm({ ...form, tags: e.target.value })
                  }
                />
              </div>

              {formError && (
                <p className="auth-field-error" role="alert">
                  {formError}
                </p>
=======
                  placeholder="React, DMI"
                  value={form.tags}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      tags:
                        e.target.value,
                    })
                  }
                />

              </div>

              {formError && (

                <p
                  className="auth-field-error"
                  role="alert"
                >
                  {formError}
                </p>

>>>>>>> a26aa50691b5e80f70ab39b91744990bcbc72a30
              )}

            </div>

            <div className="pm-footer">
<<<<<<< HEAD
              <button
                type="button"
                className="auth-btn auth-btn--secondary"
                onClick={() => setModal(null)}
              >
                Cancelar
              </button>

              <button
                type="button"
                className="auth-btn auth-btn--primary"
                onClick={handleSubmit}
              >
                {modal.mode === 'create'
                  ? 'Crear sesión'
                  : 'Guardar cambios'}
=======

              <button
                type="button"
                className="auth-btn auth-btn--secondary"
                onClick={() =>
                  setModal(null)
                }
              >
                Cancelar
>>>>>>> a26aa50691b5e80f70ab39b91744990bcbc72a30
              </button>

              <button
                type="button"
                className="auth-btn auth-btn--primary"
                onClick={handleSubmit}
              >

                {modal.mode ===
                'create'
                  ? 'Crear sesión'
                  : 'Guardar cambios'}

              </button>

            </div>

          </div>

        </div>

      )}

    </DashboardLayout>
  )
}