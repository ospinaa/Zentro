// src/components/EventPage.tsx
//
// Generic reusable page for community events (Academic, Sports, etc.)
// Eliminates the ~95% duplicate code between AcademicPage and SportsPage.
//
import { useState } from 'react'
import { DashboardLayout } from '../layout/DashboardLayout'
import { auth } from '../services/firebase'

export interface GenericEvent {
  id: string
  firebase_uid: string
  title: string
  description: string
  eventTime: string
  externalLink: string
  createdAt: number
}

interface EventPageProps {
  /** Page title shown in <h1> and document.title */
  pageTitle: string
  /** Section emoji or icon string */
  icon: string
  /** Color accent for cards — any valid CSS color */
  accentColor: string
  events: GenericEvent[]
  onAdd: (data: Omit<GenericEvent, 'id' | 'firebase_uid' | 'createdAt'>) => Promise<void>
  onEdit: (id: string, data: Partial<GenericEvent>) => Promise<void>
  onRemove: (id: string) => Promise<void>
  /** Label for the external link button */
  linkLabel?: string
}

const EMPTY_FORM = { title: '', description: '', eventTime: '', externalLink: '' }

export function EventPage({
  pageTitle,
  icon,
  accentColor,
  events,
  onAdd,
  onEdit,
  onRemove,
  linkLabel = 'Más información',
}: EventPageProps) {
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [submitting, setSubmitting] = useState(false)

  function openCreate() {
    setForm(EMPTY_FORM)
    setEditingId(null)
    setShowForm(true)
  }

  function openEdit(event: GenericEvent) {
    setForm({
      title: event.title,
      description: event.description,
      eventTime: event.eventTime,
      externalLink: event.externalLink,
    })
    setEditingId(event.id)
    setShowForm(true)
  }

  function resetForm() {
    setForm(EMPTY_FORM)
    setEditingId(null)
    setShowForm(false)
  }

  async function handleSubmit() {
    if (!form.title.trim()) return
    setSubmitting(true)
    try {
      if (editingId) {
        await onEdit(editingId, form)
      } else {
        await onAdd(form)
      }
      resetForm()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="ep-page">
        {/* ── Header ── */}
        <div className="ep-header">
          <div>
            <h1 className="ep-header__title">
              <span className="ep-header__icon">{icon}</span>
              {pageTitle}
            </h1>
            <p className="ep-header__sub">
              {events.length} evento{events.length !== 1 ? 's' : ''} publicado{events.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button className="proj-page__new-btn" onClick={openCreate}>
            + Publicar evento
          </button>
        </div>

        {/* ── Form modal ── */}
        {showForm && (
          <div className="pm-overlay" role="dialog" aria-modal="true">
            <div className="pm-panel">
              <div className="pm-header">
                <h2 className="pm-title">
                  {editingId ? 'Editar evento' : 'Nuevo evento'}
                </h2>
                <button className="pm-close" type="button" onClick={resetForm}>✕</button>
              </div>

              <div className="pm-body">
                <div className="auth-field">
                  <label className="auth-label">Título *</label>
                  <input
                    className="auth-input"
                    placeholder="Nombre del evento"
                    value={form.title}
                    onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  />
                </div>
                <div className="auth-field">
                  <label className="auth-label">Descripción</label>
                  <textarea
                    className="auth-input pm-textarea"
                    rows={3}
                    placeholder="¿De qué trata el evento?"
                    value={form.description}
                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  />
                </div>
                <div className="auth-field">
                  <label className="auth-label">Hora</label>
                  <input
                    type="time"
                    className="auth-input"
                    value={form.eventTime}
                    onChange={e => setForm(f => ({ ...f, eventTime: e.target.value }))}
                  />
                </div>
                <div className="auth-field">
                  <label className="auth-label">Link / Contacto</label>
                  <input
                    className="auth-input"
                    placeholder="https://... o número de contacto"
                    value={form.externalLink}
                    onChange={e => setForm(f => ({ ...f, externalLink: e.target.value }))}
                  />
                </div>
              </div>
