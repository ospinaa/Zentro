import type { ReactNode } from 'react'
import { Navbar } from '../components/Navbar'

export interface DashboardLayoutProps {
  children: ReactNode
  userInitials?: string
}

export function DashboardLayout({ children, userInitials }: DashboardLayoutProps) {
  return (
    <div className="dash-layout">
      <Navbar userInitials={userInitials} />
      <main className="dash-main">{children}</main>
    </div>
  )
}
