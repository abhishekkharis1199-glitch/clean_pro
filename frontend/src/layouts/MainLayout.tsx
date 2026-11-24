import { useState, type FormEvent } from 'react'
import { Link, Outlet, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { clearSession, getStoredUser } from '../services/authApi'

export default function MainLayout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLocationSearchOpen, setIsLocationSearchOpen] = useState(false)
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false)
  const [searchParams] = useSearchParams()
  const [location, setLocation] = useState(() => searchParams.get('location') || 'Bengaluru')
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const isProviderSignup = pathname === '/provider/signup'
  const isLandingPage = pathname === '/'
  const user = getStoredUser()

  function handleLocationSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const query = location.trim()
    if (!query) return
    setLocation(query)
    setIsLocationSearchOpen(false)
    navigate(`/customer?location=${encodeURIComponent(query)}`)
  }

  function handleSignOut() {
    clearSession()
    setIsAccountMenuOpen(false)
    navigate('/')
  }

  return (
    <div className={`app-shell${isLandingPage ? ' landing-app-shell' : ''}`}>
      <header className={`site-header${isProviderSignup ? ' signup-site-header' : ''}${isLandingPage ? ' landing-site-header' : ''}`}>
        <Link className="brand" to="/" aria-label="CleanHome home">
          {isLandingPage ? (
            <>
              <svg className="brand-mark" viewBox="0 0 32 32" aria-hidden="true">
                <path d="M3 15 16 4l13 11M7 13v14h18V13M13 27v-9h6v9M11 14l5-4 5 4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
              </svg>
              <span>CleanHome</span>
            </>
          ) : (
            'CleanHome'
          )}
        </Link>

        <button
          className="menu-toggle"
          type="button"
          aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isMenuOpen}
          aria-controls="primary-navigation"
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav
          className={`main-nav${isMenuOpen ? ' is-open' : ''}`}
          id="primary-navigation"
          aria-label="Main navigation"
        >
          {isLandingPage ? (
            <>
              <a href="#services" onClick={() => setIsMenuOpen(false)}>Services</a>
              <a href="#about-us" onClick={() => setIsMenuOpen(false)}>About Us</a>
              <a href="#how-it-works" onClick={() => setIsMenuOpen(false)}>What We Do</a>
              <Link to="/provider/signup" onClick={() => setIsMenuOpen(false)}>Become a Partner</Link>
            </>
          ) : (
            <>
              <Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
              <Link to="/customer" onClick={() => setIsMenuOpen(false)}>Services</Link>
              <Link to="/customer" onClick={() => setIsMenuOpen(false)}>Bookings</Link>
              <Link to="/customer" onClick={() => setIsMenuOpen(false)}>Cleaners</Link>
              <Link to="/customer" onClick={() => setIsMenuOpen(false)}>Profile</Link>
            </>
          )}
        </nav>

        <div className="header-actions">
          {isLandingPage ? (
            <>
              <button
                className="landing-search-link"
                type="button"
                aria-label={isLocationSearchOpen ? 'Close location search' : 'Search by location'}
                aria-expanded={isLocationSearchOpen}
                aria-controls="header-location-search"
                onClick={() => setIsLocationSearchOpen((open) => !open)}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <circle cx="10.8" cy="10.8" r="6.8" fill="none" stroke="currentColor" strokeWidth="2" />
                  <path d="m16 16 4.5 4.5" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
                </svg>
              </button>
            </>
          ) : null}
          <button
            className="header-location-trigger"
            type="button"
            aria-label={`Change location, currently ${location}`}
            aria-expanded={isLocationSearchOpen}
            aria-controls="header-location-search"
            onClick={() => setIsLocationSearchOpen((open) => !open)}
            title={location}
          >
            <span>{location || 'Choose location'}</span>
            <svg viewBox="0 0 16 16" aria-hidden="true">
              <path d="m4 6 4 4 4-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            </svg>
          </button>
          {isLocationSearchOpen && (
            <form
              className="header-location-search"
              id="header-location-search"
              onSubmit={handleLocationSearch}
            >
              <label htmlFor="header-location-input">Search by city or area</label>
              <div>
                <input
                  id="header-location-input"
                  type="search"
                  required
                  value={location}
                  onChange={(event) => setLocation(event.target.value)}
                  placeholder="Enter a city or area"
                  autoFocus
                />
                <button type="submit">Search</button>
              </div>
            </form>
          )}
          <div className="landing-auth-links">
            {user ? (
              <div className="user-dropdown">
                <button className="user-dropdown-toggle" type="button" aria-haspopup="true" aria-expanded={isAccountMenuOpen} onClick={() => setIsAccountMenuOpen((open) => !open)}>
                  Welcome, {user.firstName}
                  <svg viewBox="0 0 16 16" aria-hidden="true">
                    <path d="m4 6 4 4 4-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                  </svg>
                </button>
                {isAccountMenuOpen && (
                  <div className="user-dropdown-menu" role="menu">
                    <Link to="/customer" className="user-dropdown-item" role="menuitem">Account details</Link>
                    <Link to="/customer" className="user-dropdown-item" role="menuitem">My bookings</Link>
                    <button
                      className="user-dropdown-item"
                      type="button"
                      role="menuitem"
                      onClick={handleSignOut}
                    >
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link className="landing-sign-in" to="/login">Log In</Link>
                <Link className="get-started-btn" to="/register">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </header>
      <Outlet />
    </div>
  )
}
