import { Fragment, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

type MetricRow = { metric: string; current?: string; target?: string; notes: string }
type MetricSection = { name: string; rows: MetricRow[] }
type MetricTable = { caption: string; sections: MetricSection[] }

const METRICS_TABLES: MetricTable[] = [
  {
    caption: 'Summary — Measure performance against objectives',
    sections: [
      {
        name: 'Key Performance Indicators',
        rows: [
          { metric: 'Overall Adoption Rate', target: '80%', notes: 'Issuers using cashless / total issuers' },
          { metric: 'Activation Completion Rate', target: '90%', notes: 'Complete setup / started setup' },
          { metric: 'Average Time to Value', target: '7 days', notes: 'Activation → first exercise request' },
          { metric: 'Monthly Active Users (MAU)', notes: 'Issuers using feature in last 30 days' },
          { metric: 'Feature Stickiness (DAU/MAU)', target: '30%', notes: 'Daily / Monthly active users' },
          { metric: 'Overall Task Success Rate', target: '95%', notes: 'Completed / attempted tasks' },
          { metric: 'Support Ticket Rate', target: '<5%', notes: 'Tickets / total users per month' },
          { metric: 'Feature NPS Score', target: '50+', notes: 'Cashless feature Net Promoter Score' },
          { metric: 'Revenue per Cashless User', notes: 'Average monthly revenue per issuer' },
        ],
      },
      {
        name: 'Health Indicators',
        rows: [
          { metric: 'System Error Rate', target: '<2%', notes: 'System/configuration errors' },
          { metric: 'Feature Churn Rate', target: '<5%', notes: 'Monthly feature abandonment rate' },
          { metric: 'Average Time to Resolution', target: '<24 hrs', notes: 'Support ticket resolution time' },
          { metric: 'System Performance (Page Load)', target: '<3 sec', notes: 'Average page load time' },
          { metric: 'Formula Configuration Error Rate', target: '<3%', notes: 'Incorrect formula setups' },
          { metric: 'Approval Bottleneck Rate', target: '<10%', notes: 'Stuck approvals / total approvals' },
        ],
      },
      {
        name: 'Tracking Frequency Recommendations',
        rows: [
          { metric: 'Daily Tracking', notes: 'DAU, system errors, performance' },
          { metric: 'Weekly Tracking', notes: 'WAU, support tickets, task success' },
          { metric: 'Monthly Tracking', notes: 'MAU, NPS, revenue, adoption, retention' },
          { metric: 'Quarterly Tracking', notes: 'UX improvements, A/B tests, feature' },
        ],
      },
    ],
  },
  {
    caption: 'AARRR Pirates Model',
    sections: [
      {
        name: 'Acquisition',
        rows: [
          { metric: 'Number of issuers activating cashless modules', notes: 'Track monthly new activations' },
          { metric: 'Time from account creation to cashless setup', notes: 'Average time in days' },
          { metric: 'Conversion rate from issuer pause creation to SPV/Plan linking', notes: 'Percentage completing this step' },
          { metric: 'Source of cashless feature discovery', notes: 'Where users abandon setup' },
        ],
      },
      {
        name: 'Activation',
        rows: [
          { metric: 'Percentage of issuers who complete full cashless setup', notes: 'Formula configuration → method' },
          { metric: 'Time to first cashless exercise request submitted', notes: 'From activation to first use' },
          { metric: 'Completion rate of instrument formula configuration', notes: 'Successfully configured formulas' },
          { metric: 'Number of issuers activating at least one exercise method', notes: 'Sell to cover vs cashless sell' },
          { metric: 'Drop-off points in the setup flow', notes: 'SPV creation → charge config →' },
        ],
      },
      {
        name: 'Retention',
        rows: [
          { metric: 'Monthly/weekly active issuers using cashless features', notes: 'MAU and WAU metrics' },
          { metric: 'Repeat usage rate of cashless exercise support', notes: 'Issuers using >1 per period' },
          { metric: 'Feature stickiness (DAU/MAU for cashless module)', notes: 'Daily active / Monthly active' },
          { metric: 'Churn rate of cashless feature', notes: 'Issuers who deactivate' },
          { metric: 'Frequency of lot creation per issuer', notes: 'Average lots per time period' },
        ],
      },
      {
        name: 'Revenue',
        rows: [
          { metric: 'Revenue from cashless-enabled issuers vs non-cashless', notes: 'Comparative revenue analysis' },
          { metric: 'Average transaction value per cashless exercise', notes: 'Mean transaction size' },
          { metric: 'Broker charge revenue implemented', notes: 'When broker charges implemented' },
          { metric: 'Upsell rate to advanced configurations', notes: 'ABAC, multi-level approval adoption' },
          { metric: 'Revenue impact from basic vs advanced client tiers', notes: 'Tier comparison' },
        ],
      },
      {
        name: 'Referral',
        rows: [
          { metric: 'NPS score specifically for cashless feature', notes: 'Feature-specific Net Promoter Score' },
          { metric: 'Number of referrals mentioning cashless capabilities', notes: 'Cashless as a decision factor' },
          { metric: 'Case studies/testimonials generated from cashless users', notes: 'Success stories collected' },
          { metric: 'Feature requests from non-cashless issuers after seeing it', notes: 'Interest from prospects' },
        ],
      },
    ],
  },
  {
    caption: 'Learning Curve / Efficiency',
    sections: [
      {
        name: 'Time-Based Metrics',
        rows: [
          { metric: 'Time to complete initial cashless configuration', notes: 'From start to full activation' },
          { metric: 'Time to create first lot', notes: 'First lot creation duration' },
          { metric: 'Time from lot creation to sale initiation', notes: 'Processing efficiency metric' },
          { metric: 'Time to process multi-level approvals', notes: 'Hierarchical vs simultaneous' },
          { metric: 'Reduction in time compared to manual/previous processes', notes: 'Efficiency improvement percentage' },
        ],
      },
      {
        name: 'Error & Confusion Metrics',
        rows: [
          { metric: 'Error rate in formula configuration', notes: 'Incorrect formula setups' },
          { metric: 'Number of support tickets related to cashless setup', notes: 'Monthly ticket count' },
          { metric: 'Frequency of accessing help documentation/knowledge base', notes: 'KB article views and searches' },
          { metric: 'Abandonment rate at each configuration step', notes: 'Where users get stuck in flow' },
          { metric: 'Number of attempts to activate method before formula config', notes: 'Missing prerequisite errors' },
        ],
      },
      {
        name: 'Complexity Indicators',
        rows: [
          { metric: 'Usage rate of advanced configurations vs basic', notes: 'ABAC, RBAC adoption rate' },
          { metric: 'Number of configurations modified after initial setup', notes: 'Rework frequency indicator' },
          { metric: 'Frequency of using "Reset" vs "Update" buttons', notes: 'User confidence indicator' },
          { metric: 'Time spent on approval flow configuration', notes: 'Setup complexity measure' },
        ],
      },
    ],
  },
  {
    caption: 'Task Success Rate',
    sections: [
      {
        name: 'Configuration Tasks',
        rows: [
          { metric: 'Success rate of SPV creation and plan linking', notes: 'Completed without errors' },
          { metric: 'Success rate of instrument formula configuration', notes: 'Correct formula setup first time' },
          { metric: 'Success rate of activating exercise methods without errors', notes: 'Error-free activation' },
          { metric: 'Completion rate of multi-level approval setup', notes: 'Successfully configured approvals' },
          { metric: 'Success rate of lot creation from eligible requests', notes: 'Eligible requests → lots created' },
        ],
      },
      {
        name: 'Processing Tasks',
        rows: [
          { metric: 'Percentage of exercise requests successfully processed', notes: 'End-to-end completion through cashless' },
          { metric: 'Approval flow completion rate', notes: 'No bottlenecks/rejections' },
          { metric: 'Success rate of moving lots through stages', notes: 'Pending → sale initiated → shares' },
          { metric: 'Accuracy of tentative vs actual calculations', notes: 'Calculation precision percentage' },
          { metric: 'Error rate in payment configuration', notes: 'Payment setup issues' },
        ],
      },
      {
        name: 'Management Tasks',
        rows: [
          { metric: 'Success rate of finding specific requests/lots via search', notes: 'Search effectiveness' },
          { metric: 'Success rate of filtering by exercise method, status, lot number', notes: 'Filter accuracy' },
          { metric: 'Efficiency of switching between Requests and Cashless Lots', notes: 'Navigation ease' },
          { metric: 'Success rate of bulk operations', notes: 'Creating lots from multiple requests' },
        ],
      },
    ],
  },
  {
    caption: 'Engagement Metrics',
    sections: [
      {
        name: 'Feature Usage Depth',
        rows: [
          { metric: 'Percentage using basic vs advanced approval configurations', notes: 'Configuration complexity split' },
          { metric: 'Usage rate of different exercise methods', notes: 'Sell to cover vs cashless sell' },
          { metric: 'Adoption of simultaneous vs hierarchical approval flows', notes: 'Approval flow preferences' },
          { metric: 'Usage of filters and search functionality', notes: 'Feature utilization frequency' },
          { metric: 'Engagement with tentative calculation views', notes: 'View switching frequency' },
        ],
      },
      {
        name: 'User Actions',
        rows: [
          { metric: 'Number of lots created per month/quarter', notes: 'Activity volume by period' },
          { metric: 'Number of exercise requests processed per lot', notes: 'Average requests per lot' },
          { metric: 'Frequency of modifying lot composition', notes: 'Add/remove requests from lots' },
          { metric: 'Usage of "Save view" functionality', notes: 'Custom view creation' },
          { metric: 'Number of custom columns configured', notes: 'Personalization level' },
        ],
      },
      {
        name: 'Role-Based Engagement',
        rows: [
          { metric: 'Admin vs Finance Admin activity levels', notes: 'Sessions and actions per session' },
          { metric: 'Employee self-service usage', notes: 'Submitting cashless requests' },
          { metric: 'Broker interaction rates (if applicable)', notes: 'Broker engagement in Phase 2' },
          { metric: 'Approver response time and engagement', notes: 'Approval speed and activity' },
          { metric: 'Managed service team usage activity', notes: 'Internal team efficiency' },
        ],
      },
      {
        name: 'Navigation & Discoverability',
        rows: [
          { metric: 'Click-through rate from Settlement page to Cashless Lots tab', notes: 'Tab discovery rate' },
          { metric: 'Usage of grouped vs ungrouped views', notes: 'View preference patterns' },
          { metric: 'Frequency of accessing Insider status information', notes: 'Compliance awareness' },
          { metric: 'Engagement with document uploads/downloads', notes: 'Document management activity' },
          { metric: 'Usage of lot number for quick verification', notes: 'Quick lookup frequency' },
        ],
      },
    ],
  },
  {
    caption: 'Other Metrics',
    sections: [
      {
        name: 'Findability',
        rows: [
          { metric: 'Time to locate specific exercise request or lot', notes: 'Search/navigation speed in seconds' },
          { metric: 'Search success rate', notes: 'Query leads to desired result' },
          { metric: 'Usage of lot number vs other identifiers', notes: 'Preferred lookup method' },
          { metric: 'Effectiveness of grouping and labeling improvements', notes: 'User satisfaction score' },
        ],
      },
      {
        name: 'Scalability Indicators',
        rows: [
          { metric: 'Performance with high volume (500+ requests)', notes: 'Load time and responsiveness' },
          { metric: 'User satisfaction when managing multiple lots simultaneously', notes: 'CSAT or satisfaction score' },
          { metric: 'System response time as data grows', notes: 'Performance degradation tracking' },
          { metric: 'Pagination usage patterns', notes: 'Page navigation frequency' },
        ],
      },
      {
        name: 'Cognitive Load',
        rows: [
          { metric: 'Number of clicks to complete key workflows', notes: 'Interaction efficiency measure' },
          { metric: 'Help/tooltip engagement rate', notes: 'Need for guidance indicators' },
          { metric: 'User satisfaction scores for complexity', notes: 'SUS or CSAT scores' },
          { metric: 'A/B test results: basic vs advanced interface variations', notes: 'Interface variation testing' },
        ],
      },
    ],
  },
]

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
                <img src="/images/contract-notes.svg" alt="Contract Notes" className="cs-artifact-image" />
                <p className="cs-artifact-label">Contract Notes</p>
              </div>
              <div className="cs-research-artifact-item">
                <img src="/images/cashless-report.svg" alt="Cashless Exercise Reports" className="cs-artifact-image" />
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

      {/* ── HTA Section ── */}
      <section className="cs-design-hta">
        <div className="cs-design-hta-inner">
          <div className="cs-design-hta-header">
            <h2 className="cs-design-hta-title">DEFINE</h2>
            <p className="cs-design-hta-subtitle">Product Requirement Document + Hierarchical Task Analysis clarified critical workflows, scenarios, and edge cases</p>
          </div>

          <div className="cs-hta-grid">
            <div className="cs-hta-item">
              <p className="cs-hta-label">Admin - SPV Set-up</p>
              <div className="cs-hta-image-wrapper">
                <img src="/images/hta-1-spv-setup.png" alt="HTA 1: Admin - SPV Set-up" className="cs-hta-image" />
              </div>
            </div>

            <div className="cs-hta-item">
              <p className="cs-hta-label">Admin - Configure Broker & Cashless Charges</p>
              <div className="cs-hta-image-wrapper">
                <img src="/images/hta-2-broker-charges.png" alt="HTA 2: Admin - Configure Broker & Cashless Charges" className="cs-hta-image" />
              </div>
            </div>

            <div className="cs-hta-item">
              <p className="cs-hta-label">Admin - Cashless Activation</p>
              <div className="cs-hta-image-wrapper">
                <img src="/images/hta-3-cashless-activation.png" alt="HTA 3: Admin - Cashless Activation" className="cs-hta-image" />
              </div>
            </div>

            <div className="cs-hta-item">
              <p className="cs-hta-label">Employee Exercise Flow - Cashless with Calculations</p>
              <div className="cs-hta-image-wrapper">
                <img src="/images/hta-4-employee-exercise.png" alt="HTA 4: Employee Exercise Flow - Cashless with Calculations" className="cs-hta-image" />
              </div>
            </div>

            <div className="cs-hta-item">
              <p className="cs-hta-label">Admin - Cashless Processing</p>
              <div className="cs-hta-image-wrapper">
                <img src="/images/hta-5-cashless-processing.png" alt="HTA 5: Admin - Cashless Processing" className="cs-hta-image" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Ideate & Implement Section ── */}
      <section className="cs-design-ideate">
        <div className="cs-design-ideate-inner">
          <h2 className="cs-design-ideate-title">IDEATE & IMPLEMENT</h2>
          <p className="cs-design-ideate-subtitle">
            <span style={{fontWeight: 600}}>Goal:</span> Validate designs, refine micro-interactions, and ship to production.
            <br />
            <span style={{fontWeight: 600}}>Methods:</span> Rapid, collaborative iterations via parallel prototypes, speed dating, RITE testing, and critiques refined equity workflows with cross-team input.
          </p>

          {/* Issuer Creation Section */}
          <div className="cs-ideate-section">
            <div className="cs-ideate-section-header">
              <h3 className="cs-ideate-section-title">Issuer Creation - Activating Cashless Modules</h3>
            </div>

            <div className="cs-ideate-image-container">
              <img
                src="/images/ideate-issuer-creation.png"
                alt="Issuer Creation - Activating Cashless Modules"
                className="cs-ideate-large-image"
              />
            </div>

            <p className="cs-ideate-section-description">
              Offer cashless features modularly—clients pay only for what they activate.
            </p>
          </div>

          {/* Create SPV Workflow Section */}
          <div className="cs-ideate-workflow-section">
            <h3 className="cs-ideate-workflow-title">Create SPV and link to a Plan</h3>

            <div className="cs-ideate-workflow-content">
              <div className="cs-workflow-left">
                <img
                  src="/images/ideate-create-spv-workflow.png"
                  alt="Create SPV Workflow"
                  className="cs-workflow-image"
                />
              </div>

              <div className="cs-workflow-center">
                <img
                  src="/images/ideate-spv-details-form.png"
                  alt="Create Award Plan Form"
                  className="cs-workflow-form-image"
                />
              </div>

            </div>

            {/* Bottom Section with Terminology and SPV Details */}
            <div className="cs-ideate-bottom-section">
              <div className="cs-terminology-section">
                <h4 className="cs-terminology-title">Introducing<br />TERMINOLOGY TOOLTIPS TO EXPLAIN JARGONS</h4>
              </div>

              <div className="cs-spv-details-tooltip">
                <div className="cs-tooltip-arrow"></div>
                <h4 className="cs-spv-details-label">SPV Details</h4>
                <h5 className="cs-spv-details-question">What does SPV mean?</h5>
                <p className="cs-spv-details-definition">
                  SPV (Special Purpose Vehicle) is a separate legal entity created by a parent company for specific, often temporary objectives—such as isolating financial risk or facilitating projects—by segregating assets, liabilities, and risks from the parent's balance sheet to enable securitization, fundraising, or project finance without broader exposure
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Constraints & Metrics Section ── */}
      <section className="cs-design-constraints">
        <div className="cs-design-constraints-inner">
          <div className="cs-section-eyebrow">07 —— CONSTRAINTS &amp; METRICS</div>

          <div className="cs-constraints-header-grid">
            <div>
              <h2 className="cs-design-constraints-title">How constraints shaped the design</h2>
              <p className="cs-design-constraints-subtitle">
                Engineering constraints, time pressure, and platform architecture differences all became design
                inputs — yielding pragmatic, production-ready solutions faster.
              </p>
            </div>

            <div className="cs-constraints-cards">
              <div className="cs-constraint-card">
                <h4>Time constraint simplified Phase 1</h4>
                <p>Deadlines forced us to descope non-critical paths and focus on the highest-impact workflows first.</p>
              </div>
              <div className="cs-constraint-card">
                <h4>Engineering constraints refined scope</h4>
                <p>Understanding the data model yielded pragmatic, production-ready designs. Constraints became clarity.</p>
              </div>
              <div className="cs-constraint-card">
                <h4>Platform architecture forced journey mapping</h4>
                <p>Adapting designs from the acquired company's system required end-to-end flow tracing rather than copy-paste.</p>
              </div>
              <div className="cs-constraint-card">
                <h4>Testing — prototypes sent to clients early</h4>
                <p>Sent interactive prototypes to clients for early feedback before development began, catching major flow issues.</p>
              </div>
            </div>
          </div>

          <div className="cs-metrics-framework">
            <div className="cs-metrics-framework-label">METRICS FRAMEWORK</div>
            <p className="cs-metrics-framework-subtitle">
              Layered approach — AARRR Pirates Model + Design Metrics (Learning Curve / Efficiency + Task Success + Engagement)
            </p>

            <div className="cs-metrics-grid">
              {METRICS_TABLES.map((table) => (
                <div className="cs-metrics-table-wrap" key={table.caption}>
                  <table className="cs-metrics-table">
                    <thead>
                      <tr>
                        <th>Metric</th>
                        <th>Current Value</th>
                        <th>Target Value</th>
                        <th>Notes/Definition</th>
                      </tr>
                    </thead>
                    <tbody>
                      {table.sections.map((section) => (
                        <Fragment key={section.name}>
                          <tr className="cs-metrics-section-row">
                            <td colSpan={4}>{section.name}</td>
                          </tr>
                          {section.rows.map((row) => (
                            <tr key={row.metric}>
                              <td>{row.metric}</td>
                              <td>{row.current ?? ''}</td>
                              <td>{row.target ?? ''}</td>
                              <td>{row.notes}</td>
                            </tr>
                          ))}
                        </Fragment>
                      ))}
                    </tbody>
                  </table>
                  <p className="cs-metrics-table-caption">{table.caption}</p>
                </div>
              ))}
            </div>

            <div className="cs-release-note-structure">
              <div className="cs-release-note-label">Release Note Structure</div>
              <ul>
                <li>What is it</li>
                <li>Value Delivered</li>
                <li>Who benefits</li>
                <li>What's new</li>
                <li>Why is it important</li>
                <li>How does it work</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Results & Next Steps Section ── */}
      <section className="cs-design-outcomes">
        <div className="cs-design-outcomes-inner">
          <div className="cs-section-eyebrow cs-section-eyebrow--light">08 —— RESULTS &amp; NEXT STEPS</div>

          <h2 className="cs-design-outcomes-title">
            Shipped, measured,
            <br />
            and ready to iterate
          </h2>
          <p className="cs-design-outcomes-subtitle">
            Measure performance against the objectives — how well did the design meet the objectives, the impact on
            users, and benefits to the business.
          </p>

          <div className="cs-outcomes-grid">
            <div className="cs-outcomes-column">
              <div className="cs-outcomes-column-label">Areas of Future Improvement</div>
              <div className="cs-future-improvement-card">
                <h4>Sophisticated Roles &amp; Permissions</h4>
                <p>More granular RBAC and ABAC controls to support complex enterprise hierarchies and jurisdiction-specific rules.</p>
              </div>
            </div>

            <div className="cs-outcomes-column">
              <div className="cs-outcomes-column-label">Lessons Learnt</div>
              <div className="cs-lessons-grid">
                <div className="cs-lesson-card">Thinking in systems</div>
                <div className="cs-lesson-card">Complex RBAC &amp; ABAC issues</div>
                <div className="cs-lesson-card">New &amp; existing client balance</div>
                <div className="cs-lesson-card">Preventing regression</div>
                <div className="cs-lesson-card">Understanding data model</div>
                <div className="cs-lesson-card">Release Notes</div>
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
