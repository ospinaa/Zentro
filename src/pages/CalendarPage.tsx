import { useEffect, useState } from 'react'
import { DashboardLayout } from '../layout/DashboardLayout'
import { useSessions } from '../context/SessionContext'
import type {
  CalendarSession,
  SessionStatus,
} from '../services/sessionService'

import { useProfile } from '../context/ProfileContexts'
import { auth } from '../services/firebase'


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


const STATUS_COLOR: Record<
  SessionStatus,
  string
> = {
  upcoming: '#6c63ff',
  ongoing: '#f0a500',
  done: '#4caf82',
  cancelled: '#e05c5c',
}

const STATUS_LABEL: Record<
  SessionStatus,
  string
> = {
  upcoming: 'Próxima',
  ongoing: 'En curso',
  done: 'Finalizada',
  cancelled: 'Cancelada',
}


type ModalMode = 'create' | 'edit'

interface ModalState {
  mode: ModalMode
  session?: CalendarSession
}


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


  function openCreate() {

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

      return
    }

    const payload = {

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

  return (

    <DashboardLayout
      userInitials={
        userInitials
      }
    >

      <div className="cal-page">


        <div className="cal-header">
          <div className="cal-header__text">
            <p className="cal-header__eyebrow">Organización</p>
            <h1 className="cal-header__title">Calendario</h1>
            <p className="cal-header__subtitle">Visualiza y organiza todas tus sesiones programadas.</p>
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
              >
                ‹
              </button>

              <span className="cal-nav__label">
                {formatMonthLabel(
                  currentMonth
                )}
              </span>

              <button
                type="button"
                className="cal-nav__btn"
                onClick={() =>
                  setCurrentMonth(
                    nextMonth(currentMonth)
                  )
                }
              >
                ›
              </button>

            </div>

            <div className="cal-grid">

              {weekdays.map((wd) => (

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

                <div
                  key={`empty-${i}`}
                  className="cal-grid__cell cal-grid__cell--empty"
                />

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

                return (

                  <button
                    key={iso}
                    type="button"
                    className={[
                      'cal-grid__cell',

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

                  </button>

                )
              })}
            </div>


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


          <div className="cal-day-panel">

            <h2 className="cal-day-panel__title">

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

            </h2>

            {sessionsOfDay.length === 0 ? (

              <div className="cal-day-panel__empty">

                <p>
                  Sin sesiones para este día.
                </p>

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

              </ul>

            )}

          </div>

        </div>

      </div>


      {modal && (

        <div
          className="pm-overlay"
          role="dialog"
          aria-modal="true"
        >

          <div className="pm-panel">

            <div className="pm-header">

              <h2 className="pm-title">

                {modal.mode ===
                'create'
                  ? 'Nueva sesión'
                  : 'Editar sesión'}

              </h2>

              <button
                className="pm-close"
                type="button"
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

                <input
                  className="auth-input"
                  placeholder="Ej: Clase de React"
                  value={form.title}
                  onChange={(e) =>
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

                <textarea
                  className="auth-input pm-textarea"
                  rows={2}
                  placeholder="¿De qué trata la sesión?"
                  value={form.description}
                  onChange={(e) =>
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

                <input
                  className="auth-input"
                  type="date"
                  value={form.date}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      date:
                        e.target.value,
                    })
                  }
                />

              </div>

              <div className="cal-modal__time-row">

                <div className="auth-field">

                  <label className="auth-label">
                    Inicio
                  </label>

                  <input
                    className="auth-input"
                    type="time"
                    value={form.startTime}
                    onChange={(e) =>
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

                  <input
                    className="auth-input"
                    type="time"
                    value={form.endTime}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        endTime:
                          e.target.value,
                      })
                    }
                  />

                </div>

              </div>

              <div className="auth-field">

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
                </label>

                <input
                  className="auth-input"
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

              )}

            </div>

            <div className="pm-footer">

              <button
                type="button"
                className="auth-btn auth-btn--secondary"
                onClick={() =>
                  setModal(null)
                }
              >
                Cancelar
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