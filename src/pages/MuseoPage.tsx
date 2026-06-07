import { useEffect } from 'react'
import { Link } from 'react-router-dom'

const FIGMA_PROTOTYPE_URL = 'https://www.figma.com/proto/7Fg0788OOdANym3PJbksEf/Portfolio-Content?node-id=1958-30039&viewport=-573%2C534%2C0.03&t=Q4ut7u8klROGl8qx-1&scaling=min-zoom&content-scaling=fixed&page-id=819%3A20077'

export function MuseoPage() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="cs-page cs-museo">
      {/* Full-screen Figma Prototype */}
      <div className="cs-museo-prototype-container">
        <iframe
          className="cs-museo-prototype-iframe"
          src={FIGMA_PROTOTYPE_URL}
          allowFullScreen
          allow="fullscreen"
          sandbox="allow-same-origin allow-scripts allow-popups allow-presentation"
          title="Museo Interactive Prototype"
        />
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
