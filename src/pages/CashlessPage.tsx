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

      {/* ── Problem Context ── */}
      <section className="cs-section">
        <div className="cs-section-inner">
          <div className="cs-section-tag">Background</div>
          <h2 className="cs-section-title">The Problem</h2>
          <p className="cs-section-desc">
            Employees couldn't exercise equity without upfront cash — a fundamental barrier to ownership. The platform only supported two methods, creating friction and limiting scaling potential.
          </p>
          <div className="cs-content-block">
            <h3>Why it became a top-priority initiative</h3>
            <p>
              Cashless exercise enables employees to exercise options and immediately sell shares to cover the exercise price and taxes — all without any upfront cash. This removes the primary barrier preventing employees from owning equity.
            </p>
          </div>
        </div>
      </section>

      {/* ── Research & Challenges ── */}
      <section className="cs-section">
        <div className="cs-section-inner">
          <div className="cs-section-tag">Research</div>
          <h2 className="cs-section-title">Challenges Identified</h2>
          <p className="cs-section-desc">
            Analyzing the PRD alongside admin, broker, trust manager, and executive input, we identified high-priority challenges across multiple dimensions.
          </p>

          <div className="cs-content-grid">
            <div className="cs-content-item">
              <h4>Employee Friction Points</h4>
              <ul className="cs-list">
                <li>Unable to exercise due to lack of upfront cash</li>
                <li>Confusion around calculations, taxes, and expected proceeds</li>
                <li>No visibility into sale outcomes or share deliveries</li>
                <li>Multi-step offline processes leading to drop-offs</li>
              </ul>
            </div>

            <div className="cs-content-item">
              <h4>Admin & Operational Gaps</h4>
              <ul className="cs-list">
                <li>Heavy reliance on offline Excel workflows</li>
                <li>No standardized way to group or process sale requests</li>
                <li>Lack of audit trails exposed them to compliance risks</li>
                <li>Markets like India required trust/SPV involvement, unlike the US</li>
              </ul>
            </div>

            <div className="cs-content-item">
              <h4>System Limitations</h4>
              <ul className="cs-list">
                <li>Couldn't mix workflows for different employee types or jurisdictions</li>
                <li>Could not meet the requirements of large enterprise clients</li>
                <li>US clients expected Sell All and Sell to Cover with live broker integrations</li>
                <li>Lack of configurability prevented affordable cashless and migration from the acquired company</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Design Objectives ── */}
      <section className="cs-section">
        <div className="cs-section-inner">
          <div className="cs-section-tag">Strategy</div>
          <h2 className="cs-section-title">Design Objectives</h2>
          <p className="cs-section-desc">
            Five distinct roles touch the cashless flow — each with their own permissions, views, and expectations. We designed with all stakeholders in mind.
          </p>

          <div className="cs-objectives-grid">
            <div className="cs-objective-card">
              <span className="cs-objective-icon">👤</span>
              <h4>Make the admin workflow efficient</h4>
            </div>
            <div className="cs-objective-card">
              <span className="cs-objective-icon">👥</span>
              <h4>Make the process transparent for employees</h4>
            </div>
            <div className="cs-objective-card">
              <span className="cs-objective-icon">🌍</span>
              <h4>Jurisdiction-based restrictions</h4>
            </div>
            <div className="cs-objective-card">
              <span className="cs-objective-icon">📈</span>
              <h4>Create a premium feature that supports revenue growth</h4>
            </div>
            <div className="cs-objective-card">
              <span className="cs-objective-icon">⚡</span>
              <h4>Ship fast to meet the promise made to clients</h4>
            </div>
            <div className="cs-objective-card">
              <span className="cs-objective-icon">🧩</span>
              <h4>Build a modular workflow that can be turned on/off based on client needs</h4>
            </div>
          </div>
        </div>
      </section>

      {/* ── Key Design Decisions ── */}
      <section className="cs-section">
        <div className="cs-section-inner">
          <div className="cs-section-tag">Design</div>
          <h2 className="cs-section-title">Key Design Decisions</h2>
          <p className="cs-section-desc">
            How constraints shaped pragmatic, production-ready solutions.
          </p>

          <div className="cs-decisions">
            <div className="cs-decision-block">
              <h4>1. Configurability as the Core Differentiator</h4>
              <p>
                No two enterprises shared processes — a rigid workflow wouldn't scale. Non-configurable cashless flows enforced full sequences despite partial needs. This shaped systems-led design where admins can enable/disable features based on their specific jurisdiction and business model.
              </p>
            </div>

            <div className="cs-decision-block">
              <h4>2. Modular Workflows</h4>
              <p>
                Lot creation &amp; sale execution needed to be independent yet chainable. This prevented clients from being locked into a single workflow and allowed piecemeal adoption based on enterprise maturity.
              </p>
            </div>

            <div className="cs-decision-block">
              <h4>3. Enterprise-Scale Lot Management</h4>
              <p>
                Enterprise clients process 10,000–25,000 exercises at once — so lot management needed strong validations, batching, and error handling. This required rethinking how we surface errors and guide users through bulk operations.
              </p>
            </div>

            <div className="cs-decision-block">
              <h4>4. Real-Time Transparency</h4>
              <p>
                Provide real-time preview of money, taxes, and outcomes. Employees needed to understand exactly what they'd receive before confirming — reducing support tickets and increasing confidence.
              </p>
            </div>

            <div className="cs-decision-block">
              <h4>5. Jurisdiction-Aware Constraints</h4>
              <p>
                Each market has different rules. Sell-All is often disallowed in some jurisdictions (issuance must go through trust). Market orders + "Sell to Cover" are widely used in others. Some jurisdictions cannot hold shares and require mandatory Sell All. The system needed to reflect these constraints without overwhelming users.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Process & Validation ── */}
      <section className="cs-section">
        <div className="cs-section-inner">
          <div className="cs-section-tag">Execution</div>
          <h2 className="cs-section-title">Validation & Iteration</h2>
          <p className="cs-section-desc">
            Rapid, collaborative iterations through multiple testing methodologies refined the design.
          </p>

          <div className="cs-process-items">
            <div className="cs-process-item">
              <h4>Parallel Prototypes</h4>
              <p>Explored multiple approaches to charge configuration simultaneously</p>
            </div>
            <div className="cs-process-item">
              <h4>Speed Dating</h4>
              <p>Quick feedback sessions with managed services and admin teams</p>
            </div>
            <div className="cs-process-item">
              <h4>RITE Testing</h4>
              <p>Rapid iterative testing and evaluation with real users</p>
            </div>
            <div className="cs-process-item">
              <h4>Cross-Team Critiques</h4>
              <p>Design refinements with product, engineering, and operations</p>
            </div>
            <div className="cs-process-item">
              <h4>Asynchronous Feedback</h4>
              <p>Used video recording tools to walk clients through flows for early feedback</p>
            </div>
            <div className="cs-process-item">
              <h4>Pixel-Perfect Reviews</h4>
              <p>Ensured design and dev alignment across all states before shipping</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Impact & Metrics ── */}
      <section className="cs-section">
        <div className="cs-section-inner">
          <div className="cs-section-tag">Results</div>
          <h2 className="cs-section-title">Measuring Impact</h2>
          <p className="cs-section-desc">
            Data-driven approach to measure adoption, user satisfaction, and business impact.
          </p>

          <div className="cs-metrics-grid">
            <div className="cs-metric-category">
              <h4>Adoption Metrics</h4>
              <ul className="cs-list">
                <li>Issuers using cashless / total issuers</li>
                <li>Complete setup / started setup</li>
                <li>Activation → first exercise request</li>
                <li>Time from account creation → activation</li>
                <li>Time to first cashless exercise request</li>
              </ul>
            </div>

            <div className="cs-metric-category">
              <h4>Engagement Metrics</h4>
              <ul className="cs-list">
                <li>Monthly/weekly active issuers using cashless</li>
                <li>Repeat usage of cashless exercise processing</li>
                <li>Frequency of lot creation per issuer</li>
                <li>Completion rate of instrument formula config</li>
                <li>Approval flow completion rate</li>
              </ul>
            </div>

            <div className="cs-metric-category">
              <h4>Business Metrics</h4>
              <ul className="cs-list">
                <li>Revenue from cashless-enabled issuers vs non</li>
                <li>Average transaction value per cashless exercise</li>
                <li>Upsell rate to advanced configurations</li>
                <li>Revenue impact: basic vs advanced tiers</li>
                <li>Churn rate of cashless feature</li>
              </ul>
            </div>

            <div className="cs-metric-category">
              <h4>Quality Metrics</h4>
              <ul className="cs-list">
                <li>Error rate in formula configuration</li>
                <li>Support tickets re: cashless setup</li>
                <li>Feature-specific Net Promoter Score</li>
                <li>Reduction in time vs manual processes</li>
                <li>Drop-off rate during initial config</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Learnings ── */}
      <section className="cs-section">
        <div className="cs-section-inner">
          <div className="cs-section-tag">Reflection</div>
          <h2 className="cs-section-title">Key Learnings</h2>

          <div className="cs-learnings">
            <div className="cs-learning-block">
              <h4>🏗️ Leverage Existing Architecture Over Building Anew</h4>
              <p>
                Complex RBAC &amp; ABAC systems don't scale when built reactively. Reusing existing capabilities (like the custom formula engine) and deferring infrastructure changes prevented scope creep and delivered faster.
              </p>
            </div>

            <div className="cs-learning-block">
              <h4>⏱️ Constraints Drive Better Design</h4>
              <p>
                Time constraints and engineering limitations didn't hurt — they clarified priorities and yielded pragmatic, production-ready designs faster than open-ended exploration.
              </p>
            </div>

            <div className="cs-learning-block">
              <h4>📊 Data-Driven Iteration</h4>
              <p>
                Measuring impact against the original objectives showed what worked, where users struggled, and where investments in complexity paid off.
              </p>
            </div>

            <div className="cs-learning-block">
              <h4>🤝 Stakeholder Alignment Early</h4>
              <p>
                Understanding the mental models of admins, brokers, finance teams, and employees (five distinct roles) prevented major rework and ensured the design served all perspectives.
              </p>
            </div>
          </div>
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
