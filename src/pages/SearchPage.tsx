import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { DashboardLayout } from '../layout/DashboardLayout'
import { useCollaborativeProjects } from '../context/Collaborativeprojectcontext'
import { useSessions } from '../context/SessionContext'
import { useSearch } from '../hooks/useSearch'
import type { ResultKind, SearchResult } from '../services/searchService'
import type { TaskStatus } from '../services/Collaborativeprojectservice'
import type { SessionStatus } from '../services/sessionService'
import { useProfile } from '../context/ProfileContexts'


const KIND_LABELS: Record<ResultKind, string> = {
  project: 'Proyecto',
  task:    'Tarea',
  session: 'Sesión',
}

const TASK_STATUS_OPTS: { value: TaskStatus | 'all'; label: string }[] = [
  { value: 'all',         label: 'Todas' },
  { value: 'pending',        label: 'Por hacer' },
  { value: 'in-progress', label: 'En progreso' },
  { value: 'completed',        label: 'Listo' },
]

const SESSION_STATUS_OPTS: { value: SessionStatus | 'all'; label: string }[] = [
  { value: 'all',       label: 'Todas' },
  { value: 'upcoming',  label: 'Próximas' },
  { value: 'in-progress',   label: 'En curso' },
  { value: 'completed', label: 'Listo' },
]

const KIND_OPTS: { value: ResultKind; label: string }[] = [
  { value: 'project', label: 'Proyectos' },
  { value: 'task',    label: 'Tareas' },
  { value: 'session', label: 'Sesiones' },
]


function ResultCard({ result, onClick }: { result: SearchResult; onClick: () => void }) {
  return (
    <button type="button" className="sr-card" onClick={onClick}>
      <div className="sr-card__left">
        <span className="sr-card__kind">{KIND_LABELS[result.kind]}</span>
        <p className="sr-card__title">{result.title}</p>
        <p className="sr-card__sub">{result.subtitle}</p>
        {result.tags && result.tags.length > 0 && (
          <div className="sr-card__tags">
            {result.tags.map((t) => (
              <span key={t} className="pf-tag">{t}</span>
            ))}
          </div>
        )}
      </div>
      {result.status && (
        <span className={`sr-card__status sr-card__status--${result.status.replace(/\s+/g, '-')}`}>
          {result.status}
        </span>
      )}
    </button>
  )
}


export function SearchPage() {
  const { projects } = useCollaborativeProjects()
  const { sessions } = useSessions()
  const { userInitials } = useProfile()
  const navigate = useNavigate()

  const {
    query, setQuery,
    filters, setFilter, resetFilters,
    results, isSearching, hasQuery, resultCount,
  } = useSearch({ projects, sessions })

  useEffect(() => { document.title = 'Buscar · Zentro' }, [])

  function handleResultClick(result: SearchResult) {
    if (result.kind === 'project' || result.kind === 'task') navigate('/projects')
    if (result.kind === 'session') navigate('/calendar')
  }

  function toggleKind(kind: ResultKind) {
    const current = filters.kinds ?? []
    const next = current.includes(kind)
      ? current.filter((k) => k !== kind)
      : [...current, kind]
    setFilter('kinds', next)
  }

  return (
    <DashboardLayout userInitials={userInitials}>
      <div className="sr-page">
        <div className="sr-hero">
          <div className="cal-header">
            <div className="cal-header__text">
              <p className="cal-header__eyebrow">Exploración</p>
              <h1 className="cal-header__title">Buscar en Zentro</h1>
              <p className="cal-header__subtitle">Proyectos, tareas y sesiones en un solo lugar.</p>
            </div>
          </div>
        </div>

        <div className="sr-search-bar">
          <span className="sr-search-bar__icon">🔍</span>
          <input
            className="sr-search-bar__input"
            type="search"
            placeholder="Buscar por nombre, descripción, tags…"
            value={query}
            autoFocus
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button type="button" className="sr-search-bar__clear" onClick={resetFilters}>✕</button>
          )}
        </div>

        <div className="sr-body">

          <aside className="sr-filters">
            <div className="sr-filters__group">
              <p className="sr-filters__label">Tipo de resultado</p>
              {KIND_OPTS.map((opt) => (
                <label key={opt.value} className="sr-filters__check">
                  <input
                    type="checkbox"
                    checked={(filters.kinds ?? []).includes(opt.value)}
                    onChange={() => toggleKind(opt.value)}
                  />
                  {opt.label}
                </label>
              ))}
            </div>

            <div className="sr-filters__group">
              <p className="sr-filters__label">Estado de tarea</p>
              <select
                className="auth-input"
                value={filters.taskStatus ?? 'all'}
                onChange={(e) => setFilter('taskStatus', e.target.value as TaskStatus | 'all')}
              >
                {TASK_STATUS_OPTS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>

            <div className="sr-filters__group">
              <p className="sr-filters__label">Estado de sesión</p>
              <select
                className="auth-input"
                value={filters.sessionStatus ?? 'all'}
                onChange={(e) => setFilter('sessionStatus', e.target.value as SessionStatus | 'all')}
              >
                {SESSION_STATUS_OPTS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>

            <div className="sr-filters__group">
              <p className="sr-filters__label">Rango de fechas (sesiones)</p>
              <input
                className="auth-input"
                type="date"
                placeholder="Desde"
                value={filters.dateFrom ?? ''}
                onChange={(e) => setFilter('dateFrom', e.target.value || undefined)}
              />
              <input
                className="auth-input"
                type="date"
                placeholder="Hasta"
                value={filters.dateTo ?? ''}
                onChange={(e) => setFilter('dateTo', e.target.value || undefined)}
              />
            </div>

            <button type="button" className="cal-action-btn cal-action-btn--cancel"
              style={{ marginTop: '1rem', width: '100%' }}
              onClick={resetFilters}>
              Limpiar filtros
            </button>
          </aside>

          <div className="sr-results">
            {isSearching && (
              <p className="sr-results__info">Buscando…</p>
            )}

            {!isSearching && hasQuery && (
              <p className="sr-results__info">
                {resultCount} resultado{resultCount !== 1 ? 's' : ''}
              </p>
            )}

            {!isSearching && hasQuery && resultCount === 0 && (
              <div className="dash-placeholder">
                <p className="dash-placeholder__text">
                  Sin resultados para <strong>"{query}"</strong>.
                  Intenta con otro término o ajusta los filtros.
                </p>
              </div>
            )}

            {!isSearching && !hasQuery && (
              <div className="dash-placeholder">
                <p className="dash-placeholder__text">
                  Escribe algo para empezar a buscar.
                </p>
              </div>
            )}

            {!isSearching && results.length > 0 && (
              <ul className="sr-result-list">
                {results.map((r) => (
                  <li key={`${r.kind}-${r.id}`}>
                    <ResultCard result={r} onClick={() => handleResultClick(r)} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}