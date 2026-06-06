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
    <div className="cs-page cs-cashless-design">
      {/* ── Header Section ── */}
      <section className="cs-header">
        <div className="cs-header-content">
          <h2 className="cs-header-title">CASHLESS EXERCISE</h2>
          <p className="cs-header-subtitle">Enterprise Experience Design</p>
        </div>
      </section>

      {/* ── Cover Section ── */}
      <section className="cs-cover-section">
        <div className="cs-cover-image-wrapper">
          <img src="/images/cashless-cover.png" alt="Cashless Exercise Dashboard" className="cs-cover-image" />
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
              <p>1 <span className="cs-design-highlight">Product Designer</span>, 1 Product Manager, 5 Engineers, 1 QA Tester, 1 Engineering Manager</p>
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

      {/* ── Objectives Section ── */}
      <section className="cs-design-objectives">
        <div className="cs-design-objectives-inner">
          <h2 className="cs-design-objectives-title">OBJECTIVES</h2>

          <div className="cs-design-objectives-tabs">
            <button className="cs-objectives-tab cs-objectives-tab--active">Product & Business Objectives</button>
            <button className="cs-objectives-tab">Design Objectives</button>
          </div>

          <div className="cs-design-objectives-content">
            <div className="cs-objectives-column cs-objectives-column--left">
              <ul className="cs-objectives-list">
                <li>Make the admin workflow efficient</li>
                <li>Make the process transparent for employees</li>
                <li>Build a system architecture that supports:
                  <ul className="cs-objectives-sublist">
                    <li>Brokers</li>
                    <li>Trusts / SPVs</li>
                    <li>Jurisdiction-based restrictions</li>
                    <li>Large-scale bulk processing</li>
                  </ul>
                </li>
                <li>Create a premium feature that supports revenue growth</li>
                <li>Ship fast to meet the promise made to the clients</li>
              </ul>
            </div>

            <div className="cs-objectives-column cs-objectives-column--right">
              <ul className="cs-objectives-list">
                <li>Build a modular workflow that can be turned on/off based on client needs</li>
                <li>Support configuration at:
                  <ul className="cs-objectives-sublist">
                    <li>Issuer level</li>
                    <li>Instrument level</li>
                    <li>Grant level</li>
                    <li>Employee tag / country</li>
                  </ul>
                </li>
                <li>Provide real-time preview of money, taxes, and outcomes</li>
                <li>Ensure the design can scale to 100k+ exercises across enterprise accounts</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Role Based Personas Section ── */}
      <section className="cs-design-personas">
        <div className="cs-design-personas-inner">
          <h2 className="cs-design-personas-title">ROLE BASED PERSONAS</h2>

          <div className="cs-personas-grid">
            <button className="cs-persona-btn">
              <span className="cs-persona-indicator"></span>
              <span className="cs-persona-label">Employees</span>
            </button>
            <button className="cs-persona-btn">
              <span className="cs-persona-indicator"></span>
              <span className="cs-persona-label">Investors</span>
            </button>
            <button className="cs-persona-btn">
              <span className="cs-persona-indicator"></span>
              <span className="cs-persona-label">Board Members</span>
            </button>
            <button className="cs-persona-btn">
              <span className="cs-persona-indicator"></span>
              <span className="cs-persona-label">Finance Managers</span>
            </button>
            <button className="cs-persona-btn">
              <span className="cs-persona-indicator"></span>
              <span className="cs-persona-label">Managed Services Team</span>
            </button>
          </div>
        </div>
      </section>

      {/* ── Research Section ── */}
      <section className="cs-design-research">
        <div className="cs-design-research-inner">
          <h2 className="cs-design-research-title">RESEARCH</h2>

          <div className="cs-research-subsection">
            <div className="cs-research-label">Interviews</div>

            <div className="cs-research-goal-box">
              <h3 className="cs-research-goal-title">Goal</h3>
              <p className="cs-research-goal-text">To gain a comprehensive understanding of the reconciliation workflow, role-based permission structures, and settlement timelines, as well as identify current pain points and inefficiencies in Acquired Company</p>
            </div>

            <div className="cs-research-interview-types">
              <span className="cs-interview-type">Admins</span>
              <span className="cs-interview-type">Chartered Accountants</span>
              <span className="cs-interview-type">Managed Services Team</span>
              <span className="cs-interview-type">C-suite Leaders</span>
            </div>

            <div className="cs-research-consideration">
              <h4 className="cs-research-consideration-title">Technical Consideration</h4>
              <p className="cs-research-consideration-text">The system architecture is different from Acquired Company, so the team had to build in a way that workflow is configurable and formulas customisable according to clients' need</p>
            </div>
          </div>

          <div className="cs-research-subsection">
            <div className="cs-research-label">Secondary Research</div>
            <p className="cs-research-description">Analyzed Acquired Company's cashless reports and contract notes to uncover pain points and shape my design approach</p>
          </div>

          {/* Artifact Analysis */}
          <div className="cs-research-artifact">
            <h3 className="cs-research-artifact-title">ARTIFACT ANALYSIS</h3>
            <div className="cs-research-artifact-grid">
              <div className="cs-research-artifact-item">
                <div className="cs-artifact-image-placeholder"></div>
                <p className="cs-artifact-label">Contract Notes</p>
              </div>
              <div className="cs-research-artifact-item">
                <div className="cs-artifact-image-placeholder"></div>
                <p className="cs-artifact-label">Cashless Exercise Reports - Helps in reconciliation</p>
              </div>
            </div>
          </div>

          {/* Insights */}
          <div className="cs-research-insights">
            <h3 className="cs-research-insights-title">INSIGHTS</h3>
            <div className="cs-research-insights-grid">
              <div className="cs-research-insight-box">
                <h4>Each market has different rules</h4>
                <ul>
                  <li>India: Sell-All often disallowed; issuance must go through trust.</li>
                  <li>US: Market orders + "Sell to Cover" widely used.</li>
                  <li>Foreign nationals: Often cannot hold shares; require mandatory Sell All.</li>
                </ul>
              </div>
              <div className="cs-research-insight-box">
                <h4>Cashless has 4 sub-workflows</h4>
                <ul>
                  <li>Exercise request</li>
                  <li>Lot creation & sale execution</li>
                  <li>Allocation & confirmation</li>
                  <li>Share issuance</li>
                  <li>These subflows needed to be independent yet chainable.</li>
                </ul>
              </div>
              <div className="cs-research-insight-box">
                <h4>Configurability is the key differentiator</h4>
                <p>No two enterprises shared processes—a rigid workflow wouldn't scale. Non-configurable cashless flows enforced full sequences despite partial needs. This shaped systems-led design</p>
              </div>
              <div className="cs-research-insight-box">
                <h4>Scale matters</h4>
                <p>Enterprise clients process 10,000–25,000 exercises at once — so lot management needed strong validations, batching, and error handling.</p>
              </div>
            </div>
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
