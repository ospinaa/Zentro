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

}