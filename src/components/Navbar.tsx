import { Link, useNavigate } from 'react-router-dom'

export interface NavbarProps {
  userInitials?: string
}

export function Navbar({ userInitials = 'U' }: NavbarProps) {
  const navigate = useNavigate()

  function handleLogout() {
    navigate('/login', { replace: true })
  }

  return (
    <header className="dash-nav">
      <Link to="/home" className="dash-nav__brand">
        ZENTRO
      </Link>
      <div className="dash-nav__actions">
       
        <Link
          to="/profile"
          className="dash-nav__avatar"
          title="Ver perfil"
          aria-label="Ir al perfil"
        >
          {userInitials.slice(0, 2).toUpperCase()}
        </Link>
        <button type="button" className="dash-nav__logout" onClick={handleLogout}>
          Log out
        </button>
      </div>
    </header>
  )
}