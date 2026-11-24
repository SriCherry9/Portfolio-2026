import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTheme } from '../hooks/useTheme'
import { useSound } from '../hooks/useSound'

export function Header() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'
  const { soundEnabled, toggleSound } = useSound()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  // Close the mobile menu on route change / resize back to desktop
  useEffect(() => {
    if (!menuOpen) return
    const onResize = () => { if (window.innerWidth > 640) setMenuOpen(false) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [menuOpen])

  const goHome = () => {
    setMenuOpen(false)
    navigate('/')
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50)
  }

  const goWork = () => {
    setMenuOpen(false)
    navigate('/#work')
    setTimeout(() => {
      document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' })
    }, 80)
  }

  const goAbout = () => {
    setMenuOpen(false)
    navigate('/about')
  }

  return (
    <header className="pill-header">
      <nav className={`pill-nav${menuOpen ? ' pill-nav--open' : ''}`}>
        {/* Cherry logo → top of home */}
        <button className="pill-logo" aria-label="Home" onClick={goHome}>
          <img src="/Cherry.svg" alt="" width="30" height="30" />
        </button>

        <div className="pill-links">
          <button className="pill-link" onClick={goWork}>Work</button>
          <Link to="/playground" className="pill-link">Playground</Link>
          <button className="pill-link" onClick={goAbout}>About</button>
          <Link to="/resume" className="pill-link">Resume</Link>
        </div>

        <button
          onClick={toggleSound}
          className="pill-sound-btn"
          role="switch"
          aria-checked={soundEnabled}
          aria-label={soundEnabled ? 'Turn sound off' : 'Turn sound on'}
          title={soundEnabled ? 'Sound on' : 'Sound off'}
        >
          {soundEnabled ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 5 6 9H2v6h4l5 4V5Z" />
              <path d="M15.5 8.5a5 5 0 0 1 0 7" />
              <path d="M18.5 5.5a9 9 0 0 1 0 13" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 5 6 9H2v6h4l5 4V5Z" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </svg>
          )}
        </button>

        <button
          onClick={toggleTheme}
          className="pill-theme-btn"
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="4"/>
              <line x1="12" y1="2"  x2="12" y2="5"/>
              <line x1="12" y1="19" x2="12" y2="22"/>
              <line x1="4.22" y1="4.22"   x2="6.34" y2="6.34"/>
              <line x1="17.66" y1="17.66" x2="19.78" y2="19.78"/>
              <line x1="2"  y1="12" x2="5"  y2="12"/>
              <line x1="19" y1="12" x2="22" y2="12"/>
              <line x1="4.22" y1="19.78"  x2="6.34" y2="17.66"/>
              <line x1="17.66" y1="6.34"  x2="19.78" y2="4.22"/>
            </svg>
          ) : (
            <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" stroke="none">
              <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"/>
            </svg>
          )}
        </button>

        <button
          className="pill-hamburger"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(o => !o)}
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      {menuOpen && (
        <div className="pill-mobile-menu">
          <button className="pill-mobile-link" onClick={goWork}>Work</button>
          <Link to="/playground" className="pill-mobile-link" onClick={() => setMenuOpen(false)}>Playground</Link>
          <button className="pill-mobile-link" onClick={goAbout}>About</button>
          <Link to="/resume" className="pill-mobile-link" onClick={() => setMenuOpen(false)}>Resume</Link>
        </div>
      )}
    </header>
  )
}
