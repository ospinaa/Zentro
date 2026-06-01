/* eslint-disable react-refresh/only-export-components */
// src/components/projects/TaskModal.tsx
import { useState } from 'react'
import type { CollaborativeProject, TaskStatus } from '../../services/Collaborativeprojectservice'

interface TaskModalProps {
  project: CollaborativeProject
  onClose: () => void
  onSubmit: (
    title: string,
    description: string,
    assigneeUid: string | null,
    dueDate: string | null
  ) => void
}

export function TaskModal({ project, onClose, onSubmit }: TaskModalProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [assigneeUid, setAssigneeUid] = useState<string>('')
  const [dueDate, setDueDate] = useState('')
  const [titleError, setTitleError] = useState('')

  function handleSubmit() {
    if (!title.trim()) { setTitleError('El título es obligatorio'); return }
    onSubmit(
      title.trim(),
      description.trim(),
      assigneeUid || null,
      dueDate || null
    )
    onClose()
  }

  return (
    <div className="pm-overlay" role="dialog" aria-modal="true">
      <div className="pm-panel">
        <div className="pm-header">
          <h2 className="pm-title">Nueva tarea</h2>
          <button className="pm-close" type="button" onClick={onClose}>✕</button>
        </div>

        <div className="pm-body">
          <div className="pm-field">
            <label className="pm-label">Título *</label>
            <input
              className={`pm-input ${titleError ? 'pm-input--error' : ''}`}
              placeholder="Título de la tarea"
              value={title}
              autoFocus
              onChange={(e) => { setTitle(e.target.value); setTitleError('') }}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            />
            {titleError && <span className="pm-error">{titleError}</span>}
          </div>

          <div className="pm-field">
            <label className="pm-label">Descripción</label>
            <textarea
              className="pm-input pm-textarea"
              placeholder="Detalles de la tarea…"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="pm-field">
            <label className="pm-label">Responsable</label>
            <select
              className="pm-input pm-select"
              value={assigneeUid}
              onChange={(e) => setAssigneeUid(e.target.value)}
            >
              <option value="">Sin asignar</option>
              {project.members.map((m) => (
                <option key={m.user_uid} value={m.user_uid}>
                  {m.name ?? 'Usuario'}
                </option>
              ))}
            </select>
          </div>

          <div className="pm-field">
            <label className="pm-label">Fecha límite</label>
            <input
              className="pm-input"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
        </div>

        <div className="pm-footer">
          <button className="pm-btn-ghost" type="button" onClick={onClose}>Cancelar</button>
          <button className="pm-btn-primary" type="button" onClick={handleSubmit}>
            Crear tarea
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Inline status badge ─────────────────────────────────────────

export const STATUS_LABELS: Record<TaskStatus, string> = {
  pending: 'Pendiente',
  'in-progress': 'En progreso',
  completed: 'Completada',
  blocked: 'Bloqueada',
}

export const STATUS_NEXT: Record<TaskStatus, TaskStatus> = {
  pending: 'in-progress',
  'in-progress': 'completed',
  completed: 'pending',
  blocked: 'pending',
}