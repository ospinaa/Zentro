// src/components/projects/CollaborativeProjectModal.tsx
import { useState, useCallback } from 'react'
import { searchUsers } from '../../services/Collaborativeprojectservice'
import type { ProjectType } from '../../services/Collaborativeprojectservice'
import { useAuth } from '../../context/AuthContext'

interface UserResult {
  uid: string
  name: string
  photo: string | null
}

interface CollaborativeProjectModalProps {
  onClose: () => void
  onSubmit: (name: string, description: string, type: ProjectType, collaborators: string[]) => void
}

export function CollaborativeProjectModal({ onClose, onSubmit }: CollaborativeProjectModalProps) {
  const { user } = useAuth()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState<ProjectType>('individual')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<UserResult[]>([])
  const [selectedUsers, setSelectedUsers] = useState<UserResult[]>([])
  const [searching, setSearching] = useState(false)
  const [nameError, setNameError] = useState('')

  const handleSearch = useCallback(async (q: string) => {
    setSearchQuery(q)
    if (!q.trim()) { setSearchResults([]); return }
    setSearching(true)
    const results = await searchUsers(q)
    // exclude current user and already selected
    const filtered = results.filter(
      (r) => r.uid !== user?.uid && !selectedUsers.find((s) => s.uid === r.uid)
    )
    setSearchResults(filtered)
    setSearching(false)
  }, [user, selectedUsers])

  function addUser(u: UserResult) {
    setSelectedUsers((prev) => [...prev, u])
    setSearchResults((prev) => prev.filter((r) => r.uid !== u.uid))
    setSearchQuery('')
  }

  function removeUser(uid: string) {
    setSelectedUsers((prev) => prev.filter((u) => u.uid !== uid))
  }

  function handleSubmit() {
    if (!name.trim()) { setNameError('El nombre es obligatorio'); return }
    onSubmit(name.trim(), description.trim(), type, selectedUsers.map((u) => u.uid))
    onClose()
  }

  return (
    <div className="pm-overlay" role="dialog" aria-modal="true">
      <div className="pm-panel pm-panel--wide">
        <div className="pm-header">
          <h2 className="pm-title">Nuevo proyecto</h2>
          <button className="pm-close" type="button" onClick={onClose}>✕</button>
        </div>

        <div className="pm-body">
          {/* Name */}
          <div className="pm-field">
            <label className="pm-label">Nombre del proyecto *</label>
            <input
              className={`pm-input ${nameError ? 'pm-input--error' : ''}`}
              placeholder="Mi proyecto increíble"
              value={name}
              onChange={(e) => { setName(e.target.value); setNameError('') }}
            />
            {nameError && <span className="pm-error">{nameError}</span>}
          </div>

          {/* Description */}
          <div className="pm-field">
            <label className="pm-label">Descripción</label>
            <textarea
              className="pm-input pm-textarea"
              placeholder="¿De qué trata este proyecto?"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Type toggle */}
          <div className="pm-field">
            <label className="pm-label">Tipo de proyecto</label>
            <div className="pm-type-toggle">
              <button
                type="button"
                className={`pm-type-btn ${type === 'individual' ? 'pm-type-btn--active' : ''}`}
                onClick={() => setType('individual')}
              >
                <span className="pm-type-icon">👤</span>
                <span>Individual</span>
              </button>
              <button
                type="button"
                className={`pm-type-btn ${type === 'collaborative' ? 'pm-type-btn--active' : ''}`}
                onClick={() => setType('collaborative')}
              >
                <span className="pm-type-icon">👥</span>
                <span>Colaborativo</span>
              </button>
            </div>
          </div>

          {/* Collaborator search (only if collaborative) */}
          {type === 'collaborative' && (
            <div className="pm-field">
              <label className="pm-label">Agregar integrantes</label>
              <div className="pm-search-wrap">
                <input
                  className="pm-input"
                  placeholder="Buscar por nombre o correo…"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                />
                {searching && <span className="pm-search-spinner">⏳</span>}
              </div>

              {searchResults.length > 0 && (
                <ul className="pm-search-results">
                  {searchResults.map((u) => (
                    <li key={u.uid} className="pm-search-item" onClick={() => addUser(u)}>
                      <div className="pm-search-avatar">
                        {u.photo
                          ? <img src={u.photo} alt={u.name} />
                          : <span>{u.name.charAt(0).toUpperCase()}</span>}
                      </div>
                      <div className="pm-search-info">
                        <span className="pm-search-name">{u.name}</span>
                      </div>
                      <span className="pm-search-add">+</span>
                    </li>
                  ))}
                </ul>
              )}

              {selectedUsers.length > 0 && (
                <div className="pm-selected-users">
                  {selectedUsers.map((u) => (
                    <div key={u.uid} className="pm-selected-chip">
                      <div className="pm-selected-avatar">
                        {u.photo
                          ? <img src={u.photo} alt={u.name} />
                          : <span>{u.name.charAt(0).toUpperCase()}</span>}
                      </div>
                      <span>{u.name}</span>
                      <button type="button" onClick={() => removeUser(u.uid)}>×</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="pm-footer">
          <button className="pm-btn-ghost" type="button" onClick={onClose}>Cancelar</button>
          <button className="pm-btn-primary" type="button" onClick={handleSubmit}>
            Crear proyecto
          </button>
        </div>
      </div>
    </div>
  )
}