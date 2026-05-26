import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ThemeToggle } from '../components/ThemeToggle'
import { MuseoCover } from '../components/covers/MuseoCover'

export function MuseoPage() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoPlaying, setVideoPlaying] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
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
    <div className="cs-page cs-museo">
      {/* ── Nav ── */}
      <header className={`cs-nav cs-nav--museo${scrolled ? ' cs-nav--scrolled' : ''}`}>
        <Link to="/" className="cs-nav-back" aria-label="Back to portfolio">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          <span>Portfolio</span>
        </Link>
        <div className="cs-nav-label">MUSEO — GAIAN SOLUTIONS</div>
        <ThemeToggle />
      </header>

      {/* ── Hero / Cover ── */}
      <section className="cs-hero cs-hero--museo">
        {/* Spotlight beam */}
        <div className="cs-museo-spotlight" aria-hidden="true" />
        <div className="cs-hero-content cs-hero-content--museo">
          <div className="cs-museo-eyebrow">Art Auction</div>
          <h1 className="cs-museo-title">MUSEO</h1>
          <div className="cs-hero-pills cs-hero-pills--museo">
            <span className="cs-pill cs-pill--museo">2023 – 2024</span>
            <span className="cs-pill cs-pill--museo">B2B2C · Design System</span>
          </div>
          <p className="cs-hero-sub cs-hero-sub--museo">
            Designed the end-to-end product for the US market — a CES'24 Badge-winning auction platform powered by ATSC 3.0. Built a cohesive design system for a B2B2C experience.
          </p>
          <div className="cs-hero-meta cs-hero-meta--museo">
            <div className="cs-meta-item">
              <span className="cs-meta-label">Role</span>
              <span className="cs-meta-value">Lead Product Designer</span>
            </div>
            <div className="cs-meta-item">
              <span className="cs-meta-label">Platform</span>
              <span className="cs-meta-value">TV · Mobile · Web</span>
            </div>
            <div className="cs-meta-item">
              <span className="cs-meta-label">Award</span>
              <span className="cs-meta-value">CES 2024 Badge Winner</span>
            </div>
          </div>
        </div>

        <div className="cs-museo-cover-preview">
          <MuseoCover />
        </div>

        <div className="cs-hero-scroll-hint cs-hero-scroll-hint--museo">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
          Scroll to read
        </div>
      </section>

      {/* ── Video Section ── */}
      <section className="cs-video-section cs-video-section--museo">
        <div className="cs-section-inner">
          <div className="cs-section-tag cs-section-tag--museo">Product Walkthrough</div>
          <h2 className="cs-section-title cs-section-title--museo">Experience the platform</h2>
          <p className="cs-section-desc cs-section-desc--museo">
            A walkthrough of the Museo broadcast auction experience — from browsing to bidding on live TV.
          </p>
          <div className="cs-video-wrap cs-video-wrap--museo" onClick={handlePlayVideo}>
            <video
              ref={videoRef}
              className="cs-video"
              playsInline
              onEnded={() => setVideoPlaying(false)}
              poster="/images/card2-cover.png"
            >
              <source src="/videos/product-tour.mov" type="video/mp4" />
            </video>
            {!videoPlaying && (
              <div className="cs-video-overlay cs-video-overlay--museo">
                <button className="cs-play-btn cs-play-btn--museo" aria-label="Play video">
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
      <section className="cs-svg-section cs-svg-section--museo">
        <img
          src="/case-studies/museo.svg"
          alt="Museo — full case study"
          className="cs-svg-full"
          loading="lazy"
        />
      </section>

      {/* ── Footer ── */}
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
