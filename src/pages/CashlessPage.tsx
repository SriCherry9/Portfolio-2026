import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ThemeToggle } from '../components/ThemeToggle'

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
    <div className="cs-page cs-cashless-design">
      {/* ── Premium Hero Landing Section ── */}
      <section className="cs-landing-hero">
        <div className="cs-landing-inner">
          {/* Timeline & Category Badges */}
          <div className="cs-landing-badges">
            <span className="cs-landing-badge">2022 – 2024</span>
            <span className="cs-landing-badge">Fintech · B2B SaaS</span>
          </div>

          {/* Company & Role */}
          <p className="cs-landing-company">QAPITA · LEAD PRODUCT DESIGNER</p>

          {/* Main Title */}
          <h1 className="cs-landing-title">Cashless Exercise</h1>

          {/* Description */}
          <p className="cs-landing-description">
            Designing the end-to-end workflow enabling employees to own equity through cashless methods — scaling a complex fintech platform from India to global markets.
          </p>

          {/* Key Info */}
          <div className="cs-landing-info">
            <div className="cs-landing-info-item">
              <span className="cs-landing-info-label">ROLE</span>
              <p className="cs-landing-info-value">Lead Product Designer</p>
            </div>
            <div className="cs-landing-info-item">
              <span className="cs-landing-info-label">PLATFORM</span>
              <p className="cs-landing-info-value">Web · Enterprise SaaS</p>
            </div>
            <div className="cs-landing-info-item">
              <span className="cs-landing-info-label">DURATION</span>
              <p className="cs-landing-info-value">2 years</p>
            </div>
          </div>

          {/* Scroll Prompt */}
          <div className="cs-landing-scroll">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M19 12l-7 7-7-7" />
            </svg>
            <span>SCROLL TO READ</span>
          </div>
        </div>
      </section>

      {/* ── Hero Section with Product Screenshot ── */}
      <section className="cs-design-hero">
        <div className="cs-design-hero-inner">
          <h2 className="cs-design-hero-title">CASHLESS EXERCISE</h2>
          <div className="cs-design-product-screenshot">
            <img src="/images/card1-cover.png" alt="Cashless Exercise Product" />
          </div>
        </div>
      </section>

      {/* ── Overview Section ── */}
      <section className="cs-design-overview">
        <div className="cs-design-overview-inner">
          <div className="cs-design-overview-main">
            <div className="cs-design-overview-badge">Overview</div>
            <h2 className="cs-design-overview-title">
              Designing a Global Cashless Exercise System for Equity Holders Across India, US, and International Markets
            </h2>
          </div>

          <div className="cs-design-overview-grid">
            <div className="cs-design-overview-item">
              <h4>Project Year</h4>
              <p>2025</p>
            </div>
            <div className="cs-design-overview-item">
              <h4>Team & Role</h4>
              <p>1 Product Designer, 1 Product Manager, 5 Engineers, 1 QA Tester, 1 Engineering Manager</p>
            </div>
            <div className="cs-design-overview-item">
              <h4>Design Sprint</h4>
              <p>2 Month</p>
            </div>
            <div className="cs-design-overview-item">
              <h4>Development Sprint</h4>
              <p>6 Month</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Context & Problem Section ── */}
      <section className="cs-design-context">
        <div className="cs-design-context-header">
          <h2 className="cs-design-context-title">CONTEXT & PROBLEM</h2>
        </div>

        <div className="cs-design-context-content">
          <p className="cs-design-context-statement">
            Equity holders across global markets expect the ability to exercise equity without having to pay cash upfront.
          </p>

          <div className="cs-design-context-methods">
            <p className="cs-design-methods-label">The platform only supported two basic methods</p>
            <div className="cs-design-methods-boxes">
              <div className="cs-design-method-box">Pay through Own Funds</div>
              <div className="cs-design-method-box">Net Exercise</div>
            </div>
            <p className="cs-design-friction">Creating friction for employees who lacked liquidity</p>
          </div>

          <div className="cs-design-priorities">
            <p className="cs-design-priorities-label">So it became a top-priority initiative</p>
            <div className="cs-design-priorities-boxes">
              <button className="cs-design-priority-btn">US GTM readiness</button>
              <button className="cs-design-priority-btn">Enterprise expansion</button>
              <button className="cs-design-priority-btn">Migrate clients from acquired company</button>
              <button className="cs-design-priority-btn">Operational efficiency</button>
              <button className="cs-design-priority-btn">Revenue growth</button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Problem Space Section ── */}
      <section className="cs-design-problem-space">
        <div className="cs-design-problem-space-inner">
          <h2 className="cs-design-problem-title">PROBLEM SPACE</h2>
          <p className="cs-design-problem-subtitle">
            Analyzing the PRD alongside admin, broker, trust manager, and executive input, we identified high-priority challenges
          </p>

          <div className="cs-design-painpoints-layout">
            <div className="cs-design-painpoints-top">
              <div className="cs-design-painpoint-card cs-design-painpoint-card--top">
                <h3 className="cs-design-painpoint-title">Employee Painpoints</h3>
                <ul className="cs-design-painpoint-items">
                  <li>Unable to exercise due to lack of upfront cash</li>
                  <li>Confusion around calculations, taxes, and expected proceeds</li>
                  <li>No visibility into sale outcomes or share deliveries</li>
                  <li>Multi-step offline processes leading to drop-offs</li>
                </ul>
              </div>
            </div>

            <div className="cs-design-painpoints-bottom">
              <div className="cs-design-painpoint-card">
                <h3 className="cs-design-painpoint-title">Admin Painpoints</h3>
                <ul className="cs-design-painpoint-items">
                  <li>Heavy reliance on offline Excel workflows</li>
                  <li>No standardized way to group or process sale requests</li>
                  <li>Lack of audit trails exposed them to compliance risks</li>
                  <li>Markets like India required trust/SPV involvement, unlike the US</li>
                  <li>Couldn't mix workflows for different employee types or jurisdictions</li>
                </ul>
              </div>
              <div className="cs-design-painpoint-card">
                <h3 className="cs-design-painpoint-title">Business Painpoints</h3>
                <ul className="cs-design-painpoint-items">
                  <li>Could not meet the requirements of large enterprise clients</li>
                  <li>US clients expected Sell All and Sell to Cover with live broker integrations.</li>
                  <li>Lack of configurability prevented the company from offering affordable cashless process and migrating customers from the acquired company</li>
                </ul>
              </div>
            </div>

            <div className="cs-design-existing-solution">
              <h3>Existing Solution</h3>
              <p>The feature exists in the acquired company, but it's costly and built on a legacy architecture that's incompatible with our platform.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Video Section ── */}
      <section className="cs-design-video-section">
        <div className="cs-design-video-inner">
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
