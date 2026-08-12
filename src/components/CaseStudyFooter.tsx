import { Link } from 'react-router-dom'

interface CaseStudyFooterProps {
  nextPath: string
  nextTitle: string
  nextCover: string
}

export function CaseStudyFooter({ nextPath, nextTitle, nextCover }: CaseStudyFooterProps) {
  return (
    <footer className="case-footer">
      <div className="case-footer-inner">
        <div className="case-footer-cta">
          <p className="case-footer-eyebrow">Thanks for reading</p>
          <h3 className="case-footer-message">
            If this made the problem look simpler than it was, that's the job. I'd love to hear your
            thoughts — or talk about what you're building.
          </h3>
          <div className="case-footer-contact">
            <a href="https://www.linkedin.com/in/sricherrykotamreddy" target="_blank" rel="noopener noreferrer" className="case-footer-contact-link">
              LinkedIn
            </a>
            <a href="https://medium.com/@sricherry.k" target="_blank" rel="noopener noreferrer" className="case-footer-contact-link">
              Medium
            </a>
            <a href="/resume" className="case-footer-contact-link">Resume</a>
          </div>
        </div>

        <Link to={nextPath} className="case-footer-next">
          <span className="case-footer-next-thumb">
            <img src={nextCover} alt="" />
          </span>
          <span className="case-footer-next-copy">
            <span className="case-footer-label">Next Case Study</span>
            <span className="case-footer-next-title">
              {nextTitle}
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </span>
          </span>
        </Link>

        <div className="case-footer-bottom">
          <p className="case-footer-signature">Designed &amp; built by Sri Cherry Kotamreddy</p>
          <Link to="/" className="case-footer-home">← Back to portfolio</Link>
        </div>
      </div>
    </footer>
  )
}
