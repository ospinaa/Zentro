import type { ReactNode } from 'react'
import { Navbar } from '../components/Navbar'
import { useProfile } from '../context/ProfileContexts'

export interface DashboardLayoutProps {
  children: ReactNode
  userInitials?: string
}

export function DashboardLayout({
  children,
  userInitials,
}: DashboardLayoutProps) {

  const { profile, profileLoading } = useProfile()

 
  if (profileLoading) {
    return (
      <div className="dash-layout">
        <div className="dash-loading">
          <span>Cargando...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="dash-layout">

      <Navbar
        userInitials={userInitials}
        userPhoto={profile.photo}
      />

      <main className="dash-main">
        {children}
      </main>

    </div>
  )
}