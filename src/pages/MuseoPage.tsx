import { useEffect } from 'react'
import { Link } from 'react-router-dom'

const FIGMA_PROTOTYPE_URL = 'https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fproto%2F7Fg0788OOdANym3PJbksEf%2FPortfolio-Content%3Fnode-id%3D1958-30039%26viewport%3D-573%252C534%252C0.03%26t%3DQ4ut7u8klROGl8qx-1%26scaling%3Dmin-zoom%26content-scaling%3Dfixed%26page-id%3D819%253A20077'

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
