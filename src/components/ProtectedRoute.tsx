// src/components/ProtectedRoute.tsx
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

interface Props {
  children: React.ReactNode
}

/**
 * Wraps any route that requires authentication.
 * Redirects to /login if the user is not authenticated.
 * Shows nothing while auth state is loading.
 */
export function ProtectedRoute({ children }: Props) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="route-loading">
        <div className="route-loading__spinner" aria-label="Cargando..." />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}