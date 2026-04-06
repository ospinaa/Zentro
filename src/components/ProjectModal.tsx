import { useState, type FormEvent } from 'react'
import { Button } from './Button'
import { Input } from './Input'

interface ProjectModalProps {
  onClose: () => void
  onSubmit: (name: string, description: string) => void
}

export function ProjectModal({ onClose, onSubmit }: ProjectModalProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [nameError, setNameError] = useState('')

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!name.trim()) {
      setNameError('Project name is required')
      return
    }
    onSubmit(name.trim(), description.trim())
    onClose()
  }

  return (
    <div className="pm-overlay" role="dialog" aria-modal="true" aria-label="Create project">
      <div className="pm-panel">
        <div className="pm-header">
          <h2 className="pm-title">New Project</h2>
          <button className="pm-close" type="button" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="pm-body">
            <Input
              id="proj-name"
              name="name"
              type="text"
              label="Project name"
              placeholder="My awesome project"
              value={name}
              onChange={(e) => { setName(e.target.value); setNameError('') }}
              error={nameError}
              required
            />
            <div className="auth-field">
              <label htmlFor="proj-desc" className="auth-label">Description</label>
              <textarea
                id="proj-desc"
                className="auth-input pm-textarea"
                placeholder="What is this project about?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <div className="pm-footer">
            <Button type="button" variant="secondary" fullWidth={false} onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" fullWidth={false}>
              Create
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}