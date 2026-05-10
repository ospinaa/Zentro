import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { DashboardLayout } from '../layout/DashboardLayout'

export function AcademicPage() {
  // Cambia el título de la pestaña del navegador al montar la página
  useEffect(() => {
    document.title = 'Academic · Zentro'
  }, []) // [] = solo se ejecuta una vez

  return (
    // Layout principal del dashboard, muestra la inicial del usuario en el header
    <DashboardLayout userInitials="U">
      <div className="dash-placeholder">
        {/* Título y mensaje de "próximamente" */}
        <h1 className="dash-placeholder__title">Academic Exchange</h1>
        <p className="dash-placeholder__text">This module is coming soon.</p>
        {/* Link para volver al dashboard principal */}
        <Link to="/home" className="dash-placeholder__back">
          Back to dashboard
        </Link>
      </div>
    </DashboardLayout>
  )
}