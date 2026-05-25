import { Link } from 'react-router-dom'
import { ThemeToggle } from './ThemeToggle'

export function Header() {
  return (
    <header className="site-header">
      <a href="/" className="header-logo" aria-label="Home">
        <svg width="48" height="44" viewBox="0 0 48 44" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Left cherry */}
          <circle cx="13" cy="31" r="10" fill="#C41C1C" />
          <circle cx="10" cy="27" r="3.5" fill="rgba(255,255,255,0.28)" />
          {/* Right cherry */}
          <circle cx="32" cy="33" r="10" fill="#C41C1C" />
          <circle cx="29" cy="29" r="3.5" fill="rgba(255,255,255,0.28)" />
          {/* Left stem */}
          <path d="M13 21 Q16 10 23 6" stroke="#2B6B2B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          {/* Right stem */}
          <path d="M32 23 Q29 12 23 6" stroke="#2B6B2B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          {/* Leaf */}
          <ellipse cx="33" cy="9" rx="7" ry="3.5" fill="#3A8C3A" transform="rotate(-38 33 9)" />
        </svg>
      </a>

      <nav className="header-nav">
        <a href="#work" className="nav-link">Work</a>
        <Link to="/playground" className="nav-link">Playground</Link>
        <a href="#about" className="nav-link">About</a>
        <a href="#resume" className="nav-link">Resume</a>
      </nav>

      <ThemeToggle />
    </header>
  )
}
