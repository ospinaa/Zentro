import { useRef, useState } from 'react'
import type { ProfileData, Service, Session, SocialLink } from '../pages/ProfilePage'
import { Button } from './Button'
import { Input } from './Input'

function uid() { return Math.random().toString(36).slice(2, 9) }

const PLATFORMS = ['whatsapp','github','linkedin','discord','youtube','other'] as const

interface Props {
  profile: ProfileData
  onClose: () => void
  onSave: (p: ProfileData) => void
}

type Tab = 'general' | 'tags' | 'socials' | 'services' | 'sessions'

export function ProfileEditModal({ profile, onClose, onSave }: Props) {
  const [draft, setDraft] = useState<ProfileData>(JSON.parse(JSON.stringify(profile)))
  const [tab, setTab] = useState<Tab>('general')
  const [tagInput, setTagInput] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  // ── Helpers ──
  function setField<K extends keyof ProfileData>(key: K, val: ProfileData[K]) {
    setDraft(d => ({ ...d, [key]: val }))
  }

  function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setField('photo', reader.result as string)
    reader.readAsDataURL(file)
  }

  // Tags
  function addTag() {
    const t = tagInput.trim().toUpperCase()
    if (t && !draft.tags.includes(t)) setField('tags', [...draft.tags, t])
    setTagInput('')
  }
  function removeTag(t: string) { setField('tags', draft.tags.filter(x => x !== t)) }

  // Socials
  function updateSocial(id: string, field: keyof SocialLink, val: string) {
    setField('socials', draft.socials.map(s => s.id === id ? { ...s, [field]: val } : s))
  }
  function addSocial() {
    setField('socials', [...draft.socials, { id: uid(), platform: 'other', url: '' }])
  }
  function removeSocial(id: string) { setField('socials', draft.socials.filter(s => s.id !== id)) }

  // Services
  function updateService(id: string, field: keyof Service, val: string) {
    setField('services', draft.services.map(s => s.id === id ? { ...s, [field]: val } : s))
  }
  function addService() {
    setField('services', [...draft.services, { id: uid(), title: '', description: '', icon: '⭐' }])
  }
  function removeService(id: string) { setField('services', draft.services.filter(s => s.id !== id)) }

  // Sessions
  function updateSession(id: string, field: keyof Session, val: string) {
    setField('sessions', draft.sessions.map(s => s.id === id ? { ...s, [field]: val } : s))
  }
  function addSession() {
    setField('sessions', [...draft.sessions, { id: uid(), title: '', date: '', time: '' }])
  }
  function removeSession(id: string) { setField('sessions', draft.sessions.filter(s => s.id !== id)) }

  const TABS: { key: Tab; label: string }[] = [
    { key: 'general',  label: 'General' },
    { key: 'tags',     label: 'Tags' },
    { key: 'socials',  label: 'Redes' },
    { key: 'services', label: 'Servicios' },
    { key: 'sessions', label: 'Sesiones' },
  ]

  return (
    <div className="pm-overlay" role="dialog" aria-modal="true">
      <div className="pm-panel pem-panel">
       
        <div className="pm-header">
          <h2 className="pm-title">Editar perfil</h2>
          <button className="pm-close" type="button" onClick={onClose}>✕</button>
        </div>

        
        <div className="pem-tabs">
          {TABS.map(t => (
            <button
              key={t.key}
              type="button"
              className={`pem-tab ${tab === t.key ? 'pem-tab--active' : ''}`}
              onClick={() => setTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>

        
        <div className="pem-body">

          
          {tab === 'general' && (
            <div className="pem-section">
              
              <div className="pem-photo-row">
                <div className="pem-avatar-preview">
                  {draft.photo
                    ? <img src={draft.photo} alt="preview" />
                    : <span>{draft.name.slice(0,2).toUpperCase()}</span>
                  }
                </div>
                <div>
                  <button type="button" className="pem-upload-btn" onClick={() => fileRef.current?.click()}>
                    Cambiar foto
                  </button>
                  {draft.photo && (
                    <button type="button" className="pem-remove-btn" onClick={() => setField('photo', null)}>
                      Quitar foto
                    </button>
                  )}
                  <input ref={fileRef} type="file" accept="image/*" className="pem-file-hidden" onChange={handlePhoto} />
                </div>
              </div>

              <Input
                id="pem-name"
                name="name"
                type="text"
                label="Nombre completo"
                value={draft.name}
                onChange={e => setField('name', e.target.value)}
              />

              <div className="auth-field">
                <label htmlFor="pem-bio" className="auth-label">Biografía</label>
                <textarea
                  id="pem-bio"
                  className="auth-input pm-textarea"
                  rows={3}
                  value={draft.bio}
                  onChange={e => setField('bio', e.target.value)}
                />
              </div>
            </div>
          )}

          
          {tab === 'tags' && (
            <div className="pem-section">
              <div className="pem-tag-input-row">
                <input
                  className="auth-input"
                  placeholder="Ej: DMI, COM, ING…"
                  value={tagInput}
                  onChange={e => setTagInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addTag()}
                />
                <button type="button" className="pem-add-btn" onClick={addTag}>Agregar</button>
              </div>
              <div className="pem-tag-list">
                {draft.tags.map(t => (
                  <span key={t} className="pf-tag pem-tag-removable">
                    {t}
                    <button type="button" onClick={() => removeTag(t)} className="pem-tag-x">✕</button>
                  </span>
                ))}
              </div>
              {draft.tags.length === 0 && <p className="pem-empty">Sin tags aún.</p>}
            </div>
          )}

          
          {tab === 'socials' && (
            <div className="pem-section">
              {draft.socials.map(s => (
                <div key={s.id} className="pem-social-row">
                  <select
                    className="auth-input pem-select"
                    value={s.platform}
                    onChange={e => updateSocial(s.id, 'platform', e.target.value)}
                  >
                    {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                  <input
                    className="auth-input pem-url-input"
                    placeholder="https://..."
                    value={s.url}
                    onChange={e => updateSocial(s.id, 'url', e.target.value)}
                  />
                  <button type="button" className="pem-rm-btn" onClick={() => removeSocial(s.id)}>✕</button>
                </div>
              ))}
              <button type="button" className="pem-add-btn pem-add-btn--full" onClick={addSocial}>
                + Agregar red social
              </button>
            </div>
          )}

        
          {tab === 'services' && (
            <div className="pem-section">
              {draft.services.map(svc => (
                <div key={svc.id} className="pem-service-row">
                  <input
                    className="auth-input pem-icon-input"
                    placeholder="🌟"
                    value={svc.icon}
                    onChange={e => updateService(svc.id, 'icon', e.target.value)}
                    maxLength={2}
                  />
                  <div className="pem-service-fields">
                    <input
                      className="auth-input"
                      placeholder="Título del servicio"
                      value={svc.title}
                      onChange={e => updateService(svc.id, 'title', e.target.value)}
                    />
                    <input
                      className="auth-input"
                      placeholder="Descripción breve"
                      value={svc.description}
                      onChange={e => updateService(svc.id, 'description', e.target.value)}
                    />
                  </div>
                  <button type="button" className="pem-rm-btn" onClick={() => removeService(svc.id)}>✕</button>
                </div>
              ))}
              <button type="button" className="pem-add-btn pem-add-btn--full" onClick={addService}>
                + Agregar servicio
              </button>
            </div>
          )}

          
          {tab === 'sessions' && (
            <div className="pem-section">
              {draft.sessions.map(ses => (
                <div key={ses.id} className="pem-session-row">
                  <div className="pem-session-fields">
                    <input
                      className="auth-input"
                      placeholder="Título de la sesión"
                      value={ses.title}
                      onChange={e => updateSession(ses.id, 'title', e.target.value)}
                    />
                    <div className="pem-session-datetime">
                      <input
                        className="auth-input"
                        placeholder="Fecha (ej: 20 de marzo)"
                        value={ses.date}
                        onChange={e => updateSession(ses.id, 'date', e.target.value)}
                      />
                      <input
                        className="auth-input"
                        placeholder="Hora (ej: 15:00 pm)"
                        value={ses.time}
                        onChange={e => updateSession(ses.id, 'time', e.target.value)}
                      />
                    </div>
                  </div>
                  <button type="button" className="pem-rm-btn" onClick={() => removeSession(ses.id)}>✕</button>
                </div>
              ))}
              <button type="button" className="pem-add-btn pem-add-btn--full" onClick={addSession}>
                + Agregar sesión
              </button>
            </div>
          )}
        </div>

        
        <div className="pm-footer">
          <Button type="button" variant="secondary" fullWidth={false} onClick={onClose}>Cancelar</Button>
          <Button type="button" variant="primary" fullWidth={false} onClick={() => onSave(draft)}>Guardar cambios</Button>
        </div>
      </div>
    </div>
  )
}