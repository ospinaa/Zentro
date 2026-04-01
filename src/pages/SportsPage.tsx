import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { DashboardLayout } from '../layout/DashboardLayout'

export function SportsPage() {
  useEffect(() => {
    document.title = 'Sports · Zentro'
  }, [])

  return (
    <DashboardLayout userInitials="U">
      <div className="dash-placeholder">
        <h1 className="dash-placeholder__title">Sports Activities</h1>
        <p className="dash-placeholder__text">This module is coming soon.</p>
        <Link to="/home" className="dash-placeholder__back">
          Back to dashboard
        </Link>
      </div>
    </DashboardLayout>
  )
}
