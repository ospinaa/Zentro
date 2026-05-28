// src/pages/HomePage.tsx
import { useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'

import { DashboardLayout } from '../layout/DashboardLayout'
import { useProfile } from '../context/ProfileContexts'
import { useSessions } from '../context/SessionContext'
import { useProjects } from '../context/ProjectContext'
import { useSports } from '../context/SportsContext'
import { useAcademic } from '../context/AcademicContext'

function StatPill({ value, label, color }: { value: number; label: string; color: string }) {
  return (
    <div className="home-stat">
      <span className="home-stat__value" style={{ color }}>{value}</span>
      <span className="home-stat__label">{label}</span>
    </div>
  )
}

const CARDS = [
  { to: '/academic', icon: '🎓', title: 'Academic Exchange', desc: 'Comparte conocimiento, encuentra monitores o publica eventos académicos.', color: '#3b5bdb', bg: '#eef2ff' },
  { to: '/sports',   icon: '⚽', title: 'Sports Activities',  desc: 'Únete o crea actividades deportivas con tus compañeros.',              color: '#059669', bg: '#ecfdf5' },
  { to: '/projects', icon: '📋', title: 'Projects',           desc: 'Gestiona tareas, sigue el progreso y colabora en tus proyectos.',       color: '#7c3aed', bg: '#f5f3ff' },
  { to: '/calendar', icon: '📅', title: 'Calendar',           desc: 'Visualiza y organiza todas tus sesiones programadas.',                  color: '#d97706', bg: '#fffbeb' },
]

function formatEventDate(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('es-CO', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
}

function formatSessionDate(dateStr: string, start: string) {
  const d = new Date(`${dateStr}T${start}`)
  return d.toLocaleDateString('es-CO', { weekday: 'short', day: 'numeric', month: 'short' }) + ' · ' + start
}

function getWeekRange() {
  const now = new Date()
  const monday = new Date(now)
  monday.setDate(now.getDate() - ((now.getDay() + 6) % 7))
  monday.setHours(0, 0, 0, 0)
  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)
  sunday.setHours(23, 59, 59, 999)
  return { monday, sunday }
}

export function HomePage() {
  const { profile, userInitials } = useProfile()
  const { sessions } = useSessions()
  const { projects } = useProjects()
  const { events: sportsEvents } = useSports()
  const { events: academicEvents } = useAcademic()

  const upcomingSessions = sessions.filter(s => s.status === 'upcoming').length
  const activeTasks = projects.flatMap(p => p.tasks).filter(t => t.status !== 'done').length
  const firstName = profile.name?.split(' ')[0] || userInitials

  // Sessions this week
  const weekSessions = useMemo(() => {
    const { monday, sunday } = getWeekRange()
    return sessions
      .filter(s => {
        const d = new Date(s.date)
        return d >= monday && d <= sunday && s.status !== 'cancelled'
      })
      .sort((a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime))
      .slice(0, 5)
  }, [sessions])

  // Latest sports events (top 6 for grid)
  const latestSports = useMemo(() =>
    [...sportsEvents].sort((a, b) => b.createdAt - a.createdAt).slice(0, 6),
    [sportsEvents]
  )

  // Latest academic events (top 6 for grid)
  const latestAcademic = useMemo(() =>
    [...academicEvents].sort((a, b) => b.createdAt - a.createdAt).slice(0, 6),
    [academicEvents]
  )

  useEffect(() => { document.title = 'Home · Zentro' }, [])

  return (
    <DashboardLayout userInitials={userInitials}>
      <div className="home-page">

        {/* ── Hero ── */}
        <div className="home-hero">
          <div className="home-hero__text">
            <p className="home-hero__greeting">Bienvenido de vuelta,</p>
            <h1 className="home-hero__name">{firstName} 👋</h1>
            <p className="home-hero__sub">Aquí está tu resumen de hoy</p>
          </div>
          <div className="home-stats">
            <StatPill value={upcomingSessions} label="Sesiones próximas" color="#3b5bdb" />
            <StatPill value={activeTasks}      label="Tareas activas"    color="#7c3aed" />
            <StatPill value={projects.length}  label="Proyectos"         color="#059669" />
          </div>
        </div>

        {/* ── Main layout: left content + right sticky sidebar ── */}
        <div className="home-layout">

          {/* ── Left / main content ── */}
          <div className="home-layout__main">

            {/* Cards grid */}
            <div className="home-grid">
              {CARDS.map(card => (
                <Link
                  key={card.to}
                  to={card.to}
                  className="home-card"
                  style={{ '--card-color': card.color, '--card-bg': card.bg } as React.CSSProperties}
                >
                  <span className="home-card__icon">{card.icon}</span>
                  <h2 className="home-card__title">{card.title}</h2>
                  <p className="home-card__desc">{card.desc}</p>
                  <span className="home-card__cta">Explorar <span className="home-card__arrow">→</span></span>
                </Link>
              ))}
            </div>

            {/* Sports recientes */}
            <div className="home-feed-section">
              <div className="home-feed-section__header">
                <span className="home-feed-section__icon">⚽</span>
                <h2 className="home-feed-section__title">Sports · Recientes</h2>
                <Link to="/sports" className="home-feed-section__link">Ver todo →</Link>
              </div>
              {latestSports.length === 0 ? (
                <p className="home-feed__empty">No hay actividades deportivas aún.</p>
              ) : (
                <div className="home-feed__grid">
                  {latestSports.map(ev => (
                    <div key={ev.id} className="home-feed-card home-feed-card--sports">
                      <div className="home-feed-card__badge">Deporte</div>
                      <h3 className="home-feed-card__title">{ev.title}</h3>
                      <p className="home-feed-card__desc">{ev.description}</p>
                      <div className="home-feed-card__meta">
                        <span className="home-feed-card__date">📅 {formatEventDate(ev.eventTime)}</span>
                        {ev.externalLink && (
                          <a href={ev.externalLink} target="_blank" rel="noopener noreferrer" className="home-feed-card__ext">
                            Ver más ↗
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Academic recientes */}
            <div className="home-feed-section">
              <div className="home-feed-section__header">
                <span className="home-feed-section__icon">🎓</span>
                <h2 className="home-feed-section__title">Academic · Recientes</h2>
                <Link to="/academic" className="home-feed-section__link">Ver todo →</Link>
              </div>
              {latestAcademic.length === 0 ? (
                <p className="home-feed__empty">No hay eventos académicos aún.</p>
              ) : (
                <div className="home-feed__grid">
                  {latestAcademic.map(ev => (
                    <div key={ev.id} className="home-feed-card home-feed-card--academic">
                      <div className="home-feed-card__badge">Académico</div>
                      <h3 className="home-feed-card__title">{ev.title}</h3>
                      <p className="home-feed-card__desc">{ev.description}</p>
                      <div className="home-feed-card__meta">
                        <span className="home-feed-card__date">📅 {formatEventDate(ev.eventTime)}</span>
                        {ev.externalLink && (
                          <a href={ev.externalLink} target="_blank" rel="noopener noreferrer" className="home-feed-card__ext">
                            Ver más ↗
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* ── Right sticky sidebar: This week's sessions ── */}
          <div className="home-layout__sidebar">
            <div className="home-week">
              <div className="home-feed-section__header">
                <span className="home-feed-section__icon">📅</span>
                <h2 className="home-feed-section__title">Esta semana</h2>
                <Link to="/calendar" className="home-feed-section__link">Ver calendario →</Link>
              </div>
              {weekSessions.length === 0 ? (
                <div className="home-week__empty">
                  <span className="home-week__empty-icon">🗓️</span>
                  <p>Sin sesiones programadas esta semana.</p>
                </div>
              ) : (
                <div className="home-week__list">
                  {weekSessions.map(s => (
                    <div key={s.id} className={`home-week-item home-week-item--${s.status}`}>
                      <div className="home-week-item__dot" />
                      <div className="home-week-item__body">
                        <p className="home-week-item__title">{s.title}</p>
                        <p className="home-week-item__date">{formatSessionDate(s.date, s.startTime)}</p>
                        {s.location && <p className="home-week-item__loc">📍 {s.location}</p>}
                        {s.tags.length > 0 && (
                          <div className="home-week-item__tags">
                            {s.tags.slice(0, 3).map(t => (
                              <span key={t} className="home-week-item__tag">{t}</span>
                            ))}
                          </div>
                        )}
                      </div>
                      <span className={`home-week-item__status home-week-item__status--${s.status}`}>
                        {s.status === 'upcoming' ? 'Próxima' : s.status === 'ongoing' ? 'En curso' : 'Lista'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  )
}