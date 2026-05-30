import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useTheme } from '../hooks/useTheme'

interface Props { onAboutClick: () => void }

export function Header({ onAboutClick }: Props) {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'
  const navigate = useNavigate()
  const location = useLocation()

  const goHome = () => {
    if (location.pathname !== '/') {
      navigate('/')
      // After navigation, scroll to top on next tick
      setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50)
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const goWork = () => {
    if (location.pathname !== '/') {
      navigate('/')
      setTimeout(() => {
        document.querySelector('.cards-section')?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    } else {
      document.querySelector('.cards-section')?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <header className="pill-header">
      <nav className="pill-nav">
        {/* Cherry logo → top of home */}
        <button className="pill-logo" aria-label="Home" onClick={goHome}>
          <svg width="32" height="30" viewBox="0 0 48 44" fill="none">
            <circle cx="13" cy="31" r="10" fill="#C41C1C"/>
            <circle cx="10" cy="27" r="3.5" fill="rgba(255,255,255,0.28)"/>
            <circle cx="32" cy="33" r="10" fill="#C41C1C"/>
            <circle cx="29" cy="29" r="3.5" fill="rgba(255,255,255,0.28)"/>
            <path d="M13 21 Q16 10 23 6" stroke="#2B6B2B" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
            <path d="M32 23 Q29 12 23 6" stroke="#2B6B2B" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
            <ellipse cx="33" cy="9" rx="7" ry="3.5" fill="#3A8C3A" transform="rotate(-38 33 9)"/>
          </svg>
        </button>

        <div className="pill-links">
          <button className="pill-link" onClick={goWork}>Work</button>
          <Link to="/playground" className="pill-link">Playground</Link>
          <button className="pill-link" onClick={onAboutClick}>About</button>
          <a href="#resume" className="pill-link">Resume</a>
        </div>

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
      </nav>
    </header>
  )
}
