// src/components/Navbar.tsx
import { NavLink, useNavigate } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { auth } from '../services/firebase'

export interface NavbarProps {
  userInitials?: string
  userPhoto?: string | null
}

const NAV_LINKS = [
  { to: '/home',     label: 'Home'     },
  { to: '/academic', label: 'Academic' },
  { to: '/sports',   label: 'Sports'   },
  { to: '/projects', label: 'Projects' },
  { to: '/calendar', label: 'Calendar' },
  { to: '/search',   label: 'Search'   },
]

export function Navbar({ userInitials = 'ZU', userPhoto = null }: NavbarProps) {
  const navigate = useNavigate()

  async function handleLogout() {
    try {
      await signOut(auth)
    } catch (e) {
      console.error('Logout error:', e)
    } finally {
      navigate('/login', { replace: true })
    }
  }

  return (
    <header className="dash-nav">
      <NavLink to="/home" className="dash-nav__brand">
        ZENTRO
      </NavLink>

      <nav className="dash-nav__links" aria-label="Navegación principal">
        {NAV_LINKS.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `dash-nav__link${isActive ? ' active' : ''}`
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="dash-nav__actions">
        <NavLink

        <Link
          to="/profile"
          className="dash-nav__avatar"
          title="Profile"
          aria-label="View profile"
        >
          {userInitials.slice(0, 2).toUpperCase()}
        </Link>
        <button type="button" className="dash-nav__logout" onClick={handleLogout}>

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
        </NavLink>

        <button type="button" className="dash-nav__logout" onClick={handleLogout}>
          Log out
        </button>
      </div>
    </header>
  )
}