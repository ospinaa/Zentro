import { useEffect } from 'react'
import { DashboardCard } from '../components/DashboardCard'
import { DashboardLayout } from '../layout/DashboardLayout'

export function HomePage() {
  useEffect(() => {
    document.title = 'Home · Zentro'
  }, [])

  return (
    <DashboardLayout userInitials="U">
      <div className="dash-hero">
        <h1 className="dash-hero__title">Welcome to ZENTRO</h1>
        <p className="dash-hero__subtitle">Connect, learn and play</p>
      </div>

      <div className="dash-grid">
        <DashboardCard
          title="Academic Exchange"
          description="Find help or share your knowledge"
          to="/academic"
        />
        <DashboardCard
          title="Sports Activities"
          description="Join or create sports events"
          to="/sports"
        />
        {/* ← nuevo */}
        <DashboardCard
          title="Projects"
          description="Manage tasks and track your progress"
          to="/projects"
          ctaLabel="Open"
        />
      </div>
    </DashboardLayout>
  )
}