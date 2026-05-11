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

  const { profile } = useProfile()

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