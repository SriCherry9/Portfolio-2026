import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

export function CashlessPage() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoPlaying, setVideoPlaying] = useState(false)
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const handlePlayVideo = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play()
        setVideoPlaying(true)
      } else {
        videoRef.current.pause()
        setVideoPlaying(false)
      }
    }
  }

  return (
    <div className="cs-page cs-cashless">
      {/* ── Hero / Cover ── */}
      <section className="cs-hero cs-hero--cashless">
        <div className="cs-hero-bg">
          <div className="cs-hero-bg-grid" />
        </div>
        <div className="cs-hero-content">
          <div className="cs-hero-pills">
            <span className="cs-pill">2022 – 2024</span>
            <span className="cs-pill">Fintech · B2B SaaS</span>
          </div>
          <p className="cs-hero-company">QAPITA · Lead Product Designer</p>
          <h1 className="cs-hero-title">Cashless<br />Exercise</h1>
          <p className="cs-hero-sub">
            Designing the end-to-end workflow enabling employees to own equity through cashless methods — scaling a complex fintech platform from India to global markets.
          </p>
          <div className="cs-hero-meta">
            <div className="cs-meta-item">
              <span className="cs-meta-label">Role</span>
              <span className="cs-meta-value">Lead Product Designer</span>
            </div>
            <div className="cs-meta-item">
              <span className="cs-meta-label">Platform</span>
              <span className="cs-meta-value">Web · Enterprise SaaS</span>
            </div>
            <div className="cs-meta-item">
              <span className="cs-meta-label">Duration</span>
              <span className="cs-meta-value">2 years</span>
            </div>
          </div>
        </div>
        <div className="cs-hero-scroll-hint">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
          Scroll to read
        </div>
      </section>

      {/* ── Video Section ── */}
      <section className="cs-video-section cs-video-section--cashless">
        <div className="cs-section-inner">
          <div className="cs-section-tag">Product Walkthrough</div>
          <h2 className="cs-section-title">See it in action</h2>
          <p className="cs-section-desc">
            A walkthrough of the Cashless Exercise settlement flow — from request initiation to shares issued.
          </p>
          <div className="cs-video-wrap" onClick={handlePlayVideo}>
            <video
              ref={videoRef}
              className="cs-video"
              playsInline
              onEnded={() => setVideoPlaying(false)}
              poster="/images/card1-cover.png"
            >
              <source src="/videos/product-tour.mov" type="video/mp4" />
            </video>
            {!videoPlaying && (
              <div className="cs-video-overlay">
                <button className="cs-play-btn" aria-label="Play video">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </button>
                <span className="cs-video-hint">Watch the product demo</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Full SVG Case Study ── */}
      <section className="cs-svg-section">
        <img
          src="/case-studies/cashless.svg"
          alt="Cashless Exercise — full case study"
          className="cs-svg-full"
          loading="lazy"
        />
      </section>

      {/* ── Footer ── */}
      <footer className="cs-footer cs-footer--cashless">
        <div className="cs-footer-inner">
          <p className="cs-footer-label">Next Case Study</p>
          <Link to="/case-study/museo" className="cs-footer-next">
            <span>Museo — Broadcast Auction Platform</span>
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
