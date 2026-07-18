import { Link, useNavigate } from 'react-router-dom'
import { useTheme } from '../hooks/useTheme'

export function Header() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'
  const navigate = useNavigate()

  const goHome = () => {
    navigate('/')
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50)
  }

  const goWork = () => {
    navigate('/#work')
    setTimeout(() => {
      document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' })
    }, 80)
  }

  return (
    <header className="pill-header">
      <nav className="pill-nav">
        {/* Cherry logo → top of home */}
        <button className="pill-logo" aria-label="Home" onClick={goHome}>
          <img src="/Cherry.svg" alt="" width="30" height="30" />
        </button>

        <div className="pill-links">
          <button className="pill-link" onClick={goWork}>Work</button>
          <Link to="/playground" className="pill-link">Playground</Link>
          <button className="pill-link" onClick={() => navigate('/about')}>About</button>
          <Link to="/resume" className="pill-link">Resume</Link>
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
