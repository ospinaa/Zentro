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

