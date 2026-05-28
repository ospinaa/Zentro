import { useEffect, useMemo, useState } from 'react'
import { CalendarControlPanel } from '../components/calendar/CalendarControlPanel'
import { SchedulerTimeline } from '../components/calendar/SchedulerTimeline'
import { useProfile } from '../context/ProfileContexts'
import { useSessions } from '../context/SessionContext'
import { DashboardLayout } from '../layout/DashboardLayout'
import { auth } from '../services/firebase'
import type { CalendarSession, SessionStatus } from '../services/sessionService'
import {
  addDays,
  formatWeekRange,
  getWeekDates,
  nextMonth,
  prevMonth,
  todayISO,
} from '../utils/calendarDates'

const STATUS_COLOR: Record<SessionStatus, string> = {
  upcoming: '#2563eb',
  ongoing: '#d97706',
  done: '#4caf82',
  cancelled: '#94a3b8',
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

/**
 * Calendario full-width: timeline semanal (75%) + panel de control (25%).
 * Reutiliza SessionContext y el modal CRUD existente.
 */
export function CalendarPage() {
  const {
    sessions,
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

  const { userInitials } = useProfile()

  const [modal, setModal] = useState<ModalState | null>(null)
  const [form, setForm] = useState(emptyForm(selectedDate))
  const [formError, setFormError] = useState('')

  const today = todayISO()
  const weekDates = useMemo(() => getWeekDates(selectedDate), [selectedDate])
  const weekLabel = useMemo(() => formatWeekRange(weekDates), [weekDates])

  useEffect(() => {
    document.title = 'Calendario · Zentro'
  }, [])

  useEffect(() => {
    setForm((prev) => ({ ...prev, date: selectedDate }))
  }, [selectedDate])

  function openCreate() {
    setForm(emptyForm(selectedDate))
    setFormError('')
    setModal({ mode: 'create' })
  }

  function openEdit(session: CalendarSession) {
    const isOwner = auth.currentUser?.uid === session.firebase_uid
    if (!isOwner) return

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

  function handleSelectDate(iso: string) {
    setSelectedDate(iso)
    setCurrentMonth(iso.slice(0, 7))
  }

  function shiftWeek(delta: number) {
    const next = addDays(selectedDate, delta)
    handleSelectDate(next)
  }

  async function handleSubmit() {
    if (!form.title.trim()) {
      setFormError('El título es obligatorio.')
      return
    }

    if (form.startTime >= form.endTime) {
      setFormError('La hora de inicio debe ser antes del fin.')
      return
    }

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      date: form.date,
      startTime: form.startTime,
      endTime: form.endTime,
      tags: form.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      location: form.location.trim(),
    }

    if (modal?.mode === 'create') {
      await addSession(payload)
    } else if (modal?.mode === 'edit' && modal.session) {
      await editSession(modal.session.id, payload)
    }

    setModal(null)
  }

  return (
    <DashboardLayout userInitials={userInitials}>
      <div className="cal-scheduler-page">
        <div className="cal-scheduler-layout">
          <SchedulerTimeline
            weekDates={weekDates}
            weekLabel={weekLabel}
            sessions={sessions}
            selectedDate={selectedDate}
            today={today}
            statusColor={STATUS_COLOR}
            onPrevWeek={() => shiftWeek(-7)}
            onNextWeek={() => shiftWeek(7)}
            onGoToday={() => handleSelectDate(today)}
            onSelectDate={handleSelectDate}
            onEventSelect={openEdit}
          />

          <CalendarControlPanel
            selectedDate={selectedDate}
            currentMonth={currentMonth}
            today={today}
            daysWithSessions={daysWithSessions}
            sessionCountForDay={sessionsOfDay.length}
            onPrevMonth={() => setCurrentMonth(prevMonth(currentMonth))}
            onNextMonth={() => setCurrentMonth(nextMonth(currentMonth))}
            onSelectDate={handleSelectDate}
            onCreateSession={openCreate}
          />
        </div>
      </div>

      {modal && (
        <div className="pm-overlay" role="dialog" aria-modal="true">
          <div className="pm-panel">
            <div className="pm-header">
              <h2 className="pm-title">
                {modal.mode === 'create' ? 'Nueva sesión' : 'Editar sesión'}
              </h2>
              <button className="pm-close" type="button" onClick={() => setModal(null)}>
                ✕
              </button>
            </div>

            <div className="pm-body">
              <div className="auth-field">
                <label className="auth-label">Título *</label>
                <input
                  className="auth-input"
                  placeholder="Ej: Clase de React"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>

              <div className="auth-field">
                <label className="auth-label">Descripción</label>
                <textarea
                  className="auth-input pm-textarea"
                  rows={2}
                  placeholder="¿De qué trata la sesión?"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>

              <div className="auth-field">
                <label className="auth-label">Fecha</label>
                <input
                  className="auth-input"
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                />
              </div>

              <div className="cal-modal__time-row">
                <div className="auth-field">
                  <label className="auth-label">Inicio</label>
                  <input
                    className="auth-input"
                    type="time"
                    value={form.startTime}
                    onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                  />
                </div>
                <div className="auth-field">
                  <label className="auth-label">Fin</label>
                  <input
                    className="auth-input"
                    type="time"
                    value={form.endTime}
                    onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                  />
                </div>
              </div>

              <div className="auth-field">
                <label className="auth-label">Lugar / Link</label>
                <input
                  className="auth-input"
                  placeholder="Sala B2 o Meet"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                />
              </div>

              <div className="auth-field">
                <label className="auth-label">Tags</label>
                <input
                  className="auth-input"
                  placeholder="React, DMI"
                  value={form.tags}
                  onChange={(e) => setForm({ ...form, tags: e.target.value })}
                />
              </div>

              {formError && (
                <p className="auth-field-error" role="alert">
                  {formError}
                </p>
              )}
            </div>

            <div className="pm-footer">
              <button
                type="button"
                className="auth-btn auth-btn--secondary"
                onClick={() => setModal(null)}
              >
                Cancelar
              </button>
              {modal.mode === 'edit' && modal.session && (
                <>
                  {modal.session.status !== 'cancelled' && (
                    <button
                      type="button"
                      className="auth-btn auth-btn--secondary"
                      onClick={() => void cancelSession(modal.session!.id)}
                    >
                      Cancelar sesión
                    </button>
                  )}
                  <button
                    type="button"
                    className="auth-btn auth-btn--secondary"
                    onClick={() => modal.session && void removeSession(modal.session.id)}
                  >
                    Eliminar
                  </button>
                </>
              )}
              <button type="button" className="auth-btn auth-btn--primary" onClick={() => void handleSubmit()}>
                {modal.mode === 'create' ? 'Crear sesión' : 'Guardar cambios'}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
