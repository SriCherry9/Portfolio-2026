import { useEffect } from 'react'
import { Link } from 'react-router-dom'

const FIGMA_PROTOTYPE_URL = 'https://www.figma.com/proto/7Fg0788OOdANym3PJbksEf/Portfolio-Content'

export function MuseoPage() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const openPrototype = () => {
    window.open(FIGMA_PROTOTYPE_URL, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="cs-page cs-museo">
      {/* Figma Prototype Container */}
      <div className="cs-museo-prototype-container">
        <div className="cs-museo-prototype-placeholder">
          <h2>Museo Interactive Prototype</h2>
          <p>Explore the interactive prototype in Figma</p>
          <button
            className="cs-museo-prototype-button"
            onClick={openPrototype}
          >
            <span>Open Prototype</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M13 6l6 6m0 0l-6 6m6-6H7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="cs-footer cs-footer--museo">
        <div className="cs-footer-inner">
          <p className="cs-footer-label">Next Case Study</p>
          <Link to="/case-study/cashless" className="cs-footer-next">
            <span>Cashless Exercise — Qapita</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
          <Link to="/" className="cs-footer-home">Back to portfolio</Link>
        </div>
      </footer>
    </div>
  )
}
