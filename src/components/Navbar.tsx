// src/components/Navbar.tsx
import { useEffect, useRef, useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
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
  const navigate  = useNavigate()
  const location  = useLocation()
  const navRef    = useRef<HTMLDivElement>(null)
  const pillRef   = useRef<HTMLSpanElement>(null)
  const linkRefs  = useRef<(HTMLAnchorElement | null)[]>([])

  // Track which link is active so we can animate the pill
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  // Move the sliding pill to sit under the active link
  useEffect(() => {
    if (!pillRef.current || !navRef.current) return

    const activeIndex = NAV_LINKS.findIndex(l =>
      location.pathname.startsWith(l.to)
    )
    const activeEl = linkRefs.current[activeIndex]
    if (!activeEl) return

    const navRect  = navRef.current.getBoundingClientRect()
    const linkRect = activeEl.getBoundingClientRect()

    pillRef.current.style.width  = `${linkRect.width}px`
    pillRef.current.style.left   = `${linkRect.left - navRect.left}px`
    pillRef.current.style.opacity = '1'
  }, [location.pathname, mounted])

  async function handleLogout() {
    try { await signOut(auth) } catch (e) { console.error('Logout error:', e) }
    finally { navigate('/login', { replace: true }) }
  }

  return (
    <header className="dash-nav">
      <NavLink to="/home" className="dash-nav__brand">ZENTRO</NavLink>

      <nav
        ref={navRef}
        className="dash-nav__links"
        aria-label="Navegación principal"
      >
        {/* Sliding pill — positioned absolutely inside the nav pill */}
        <span ref={pillRef} className="dash-nav__slider" aria-hidden="true" />

        {NAV_LINKS.map(({ to, label }, i) => (
          <NavLink
            key={to}
            to={to}
            ref={el => { linkRefs.current[i] = el }}
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
          to="/profile"
          className="dash-nav__avatar"
          title="Ver perfil"
          aria-label="Ir al perfil"
        >
          {userPhoto ? (
            <img src={userPhoto} alt="Foto de perfil" className="dash-nav__avatar-img" />
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