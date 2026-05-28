// src/pages/HomePage.tsx
import { useEffect } from 'react'
import { Link } from 'react-router-dom'

import { DashboardCard } from '../components/DashboardCard'
import { DashboardLayout } from '../layout/DashboardLayout'
import { useProfile } from '../context/ProfileContexts'
import { useSessions } from '../context/SessionContext'
import { useProjects } from '../context/ProjectContext'

function StatPill({ value, label, color }: { value: number; label: string; color: string }) {
  return (
    <div className="home-stat">
      <span className="home-stat__value" style={{ color }}>{value}</span>
      <span className="home-stat__label">{label}</span>
    </div>
  )
}

const CARDS = [
  {
    to: '/academic',
    icon: '🎓',
    title: 'Academic Exchange',
    desc: 'Comparte conocimiento, encuentra monitores o publica eventos académicos.',
    color: '#3b5bdb',
    bg: '#eef2ff',
  },
  {
    to: '/sports',
    icon: '⚽',
    title: 'Sports Activities',
    desc: 'Únete o crea actividades deportivas con tus compañeros.',
    color: '#059669',
    bg: '#ecfdf5',
  },
  {
    to: '/projects',
    icon: '📋',
    title: 'Projects',
    desc: 'Gestiona tareas, sigue el progreso y colabora en tus proyectos.',
    color: '#7c3aed',
    bg: '#f5f3ff',
  },
  {
    to: '/calendar',
    icon: '📅',
    title: 'Calendar',
    desc: 'Visualiza y organiza todas tus sesiones programadas.',
    color: '#d97706',
    bg: '#fffbeb',
  },
]

export function HomePage() {
  const { profile, userInitials } = useProfile()
  const { sessions } = useSessions()
  const { projects } = useProjects()

  const upcomingSessions = sessions.filter(s => s.status === 'upcoming').length
  const activeTasks = projects.flatMap(p => p.tasks).filter(t => t.status !== 'done').length
  const firstName = profile.name?.split(' ')[0] || userInitials

  useEffect(() => { document.title = 'Home · Zentro' }, [])

  return (
    <DashboardLayout>
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

    <DashboardLayout userInitials="U">
      <div className="dash-hero">
        <h1 className="dash-hero__title">Welcome to ZENTRO</h1>
        <p className="dash-hero__subtitle">Connect, learn and play</p>
        <Link to="/profile" className="dash-hero__profile-link">
          View profile
        </Link>
      </div>

        {/* ── Cards grid ── */}
        <div className="home-grid">
          {CARDS.map(card => (
            <Link key={card.to} to={card.to} className="home-card" style={{ '--card-color': card.color, '--card-bg': card.bg } as React.CSSProperties}>
              <span className="home-card__icon">{card.icon}</span>
              <h2 className="home-card__title">{card.title}</h2>
              <p className="home-card__desc">{card.desc}</p>
              <span className="home-card__cta">
                Explorar <span className="home-card__arrow">→</span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}