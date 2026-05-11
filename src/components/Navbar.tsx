// ─── src/components/Navbar.tsx ────────────────────────────────────────────────

import { Link, useNavigate } from 'react-router-dom'

export interface NavbarProps {
  userInitials?: string
  userPhoto?: string | null
}

export function Navbar({
  userInitials = 'U',
  userPhoto = null,
}: NavbarProps) {

  const navigate = useNavigate()

  function handleLogout() {
    navigate('/login', { replace: true })
  }

  return (
    <header className="dash-nav">

      <Link to="/home" className="dash-nav__brand">
        ZENTRO
      </Link>

      {/* ── Accesos rápidos ── */}
      <nav className="dash-nav__links">

        <Link
          to="/calendar"
          className="dash-nav__link"
          title="Calendario"
        >
          Calendar
        </Link>

        <Link
          to="/search"
          className="dash-nav__link"
          title="Buscar"
        >
          Search
        </Link>

      </nav>

      <div className="dash-nav__actions">

        <Link
          to="/profile"
          className="dash-nav__avatar"
          title="Ver perfil"
          aria-label="Ir al perfil"
        >

          {userPhoto ? (

            <img
              src={userPhoto}
              alt="Foto de perfil"
              className="dash-nav__avatar-img"
            />

          ) : (

            userInitials.slice(0, 2).toUpperCase()

          )}

        </Link>

        <button
          type="button"
          className="dash-nav__logout"
          onClick={handleLogout}
        >
          Log out
        </button>

      </div>
    </header>
  )
}