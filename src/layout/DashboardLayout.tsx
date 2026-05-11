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

  // Mientras el perfil aún está cargando desde Supabase,
  // no renderizamos nada para evitar mostrar datos vacíos/mockeados.
  if (profileLoading) {
    return (
      <div className="dash-layout">
        <div className="dash-loading">
          {/* Puedes reemplazar esto con un spinner o skeleton de tu diseño */}
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