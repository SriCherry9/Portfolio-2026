import { useEffect } from 'react'
import { CaseStudyFooter } from '../components/CaseStudyFooter'
import { CaseStudySideNav } from '../components/CaseStudySideNav'
import '../styles/dilution-shock.css'

const SECTIONS = [
  { id: 'ds-section-overview', label: 'Overview' },
  { id: 'ds-section-context', label: 'Context' },
  { id: 'ds-section-problem', label: 'The Problem' },
  { id: 'ds-section-deeper-problem', label: 'The Deeper Problem' },
  { id: 'ds-section-objectives', label: 'User & Objectives' },
  { id: 'ds-section-solution', label: 'The Solution' },
  { id: 'ds-section-impact', label: 'Impact / Metrics' },
  { id: 'ds-section-process', label: 'The Design Process' },
  { id: 'ds-section-before-after', label: 'Before / After' },
  { id: 'ds-section-ai-setup', label: 'AI Setup & Scenario' },
  { id: 'ds-section-scenario-on-scenario', label: 'Scenario on Scenario' },
  { id: 'ds-section-pro-rata', label: 'Pro-rata' },
  { id: 'ds-section-constraints', label: 'Constraints' },
  { id: 'ds-section-learnings', label: 'Learnings & Next Steps' },
]

const CHART_LEGEND = [
  { name: 'Founder A', color: '#658de5' },
  { name: 'Era Tum', color: '#57b158' },
  { name: 'John Doe', color: '#e37474' },
  { name: 'Gill Thorn', color: '#ae9bcf' },
  { name: 'Harry Sam', color: '#ffce5e' },
  { name: 'Pool / New Investors', color: '#d0d0d0' },
]

const CHART_ROUNDS = [
  {
    label: 'Angel Round (8M)',
    holders: [{ name: 'Founder A', amount: '$8,000,000', pct: 100, color: '#658de5' }],
  },
  {
    label: 'Series A (50M)',
    holders: [
      { name: 'Founder A', amount: '$2,000,000', pct: 20, color: '#658de5' },
      { name: 'Era Tum', amount: '$2,000,000', pct: 20, color: '#57b158' },
      { name: 'John Doe', amount: '$1,500,000', pct: 18, color: '#e37474' },
      { name: 'Gill Thorn', amount: '$1,500,000', pct: 18, color: '#ae9bcf' },
      { name: 'Harry Sam', amount: '$1,000,000', pct: 12, color: '#ffce5e' },
      { name: 'Pool / New Investors', amount: '', pct: 12, color: '#d0d0d0' },
    ],
  },
  {
    label: 'Series B (100M)',
    holders: [
      { name: 'Founder A', amount: '$2,000,000', pct: 20, color: '#658de5' },
      { name: 'Era Tum', amount: '$633,895', pct: 9.3, color: '#57b158' },
      { name: 'John Doe', amount: '$6,000,000', pct: 9, color: '#e37474' },
      { name: 'Gill Thorn', amount: '$6,000,000', pct: 9, color: '#ae9bcf' },
      { name: 'Harry Sam', amount: '$6,000,000', pct: 9, color: '#ffce5e' },
      { name: 'Pool / New Investors', amount: '', pct: 43.7, color: '#d0d0d0' },
    ],
  },
]

function PlaceholderIcon() {
  return (
    <svg className="ds-image-duo-icon" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <rect x="3" y="4" width="18" height="14" rx="2" />
      <path d="M3 15l4.5-4.5a1.5 1.5 0 0 1 2.12 0L14 15" />
      <circle cx="16.5" cy="8.5" r="1.5" />
    </svg>
  )
}

function HeroPlaceholder({ aspect }: { aspect: string }) {
  return (
    <div className="ds-hero-placeholder" style={{ aspectRatio: aspect }}>
      <PlaceholderIcon />
    </div>
  )
}

function HeroPlaceholderFramed({ aspect }: { aspect: string }) {
  return (
    <div className="ds-hero-placeholder-framed" style={{ aspectRatio: aspect }}>
      <div className="ds-hero-placeholder-inner">
        <PlaceholderIcon />
      </div>
    </div>
  )
}

function ResearchImageBlock({ background, count }: { background: string; count: number }) {
  return (
    <div className="ds-research-block" style={{ background }}>
      <div className="ds-research-block-row">
        {Array.from({ length: count }).map((_, i) => (
          <div className="ds-research-thumb" key={i}>
            <PlaceholderIcon />
          </div>
        ))}
      </div>
    </div>
  )
}

function AudienceChips() {
  const items = [
    { label: 'Founders', color: '#e18bf8' },
    { label: 'CFOs', color: '#2fe0e0' },
    { label: 'Lawyer', color: '#fd02e4' },
    { label: 'Investors', color: '#633ea5' },
  ]
  return (
    <div className="ds-chip-row">
      {items.map((item) => (
        <div className="ds-chip" key={item.label} style={{ borderColor: item.color }}>
          {item.label}
        </div>
      ))}
    </div>
  )
}

function CapTableCard() {
  const segments = [
    { pct: 48, color: '#633ea5' },
    { pct: 11, color: '#3b82f6' },
    { pct: 7, color: '#ec4899' },
    { pct: 9, color: '#f59e0b' },
    { pct: 14, color: '#10b981' },
    { pct: 11, color: '#06b6d4' },
  ]
  return (
    <div className="ds-cap-card">
      <div className="ds-cap-card-header">
        <span className="ds-cap-checkbox" aria-hidden="true" />
        <div className="ds-cap-card-heading">
          <p className="ds-cap-title">Series B</p>
          <p className="ds-cap-subtitle">
            Series A · Lead Ventures <span className="ds-cap-subtitle-link">+2</span>
          </p>
          <p className="ds-cap-date">As on 24 Aug, 2025</p>
        </div>
        <span className="ds-cap-kebab" aria-hidden="true">
          <span />
        </span>
      </div>
      <div className="ds-cap-card-body">
        <div className="ds-cap-stats-row">
          <div className="ds-cap-stat">
            <p className="ds-cap-stat-label">Post-Money Valuation</p>
            <p className="ds-cap-stat-value">$25.00M</p>
          </div>
          <div className="ds-cap-stat ds-cap-stat--right">
            <p className="ds-cap-stat-label">Amount Raised</p>
            <p className="ds-cap-stat-value">$13.00M</p>
          </div>
        </div>
        <div className="ds-cap-stats-row">
          <div className="ds-cap-stat">
            <p className="ds-cap-stat-label">Price/Share</p>
            <p className="ds-cap-stat-value">$1.3398</p>
          </div>
          <div className="ds-cap-stat ds-cap-stat--right">
            <p className="ds-cap-stat-label">FD Shares</p>
            <p className="ds-cap-stat-value">18,658,892</p>
          </div>
        </div>
        <div className="ds-cap-ownership">
          <p className="ds-cap-ownership-label">Ownership</p>
          <div className="ds-cap-ownership-bar">
            {segments.map((s, i) => (
              <span key={i} className="ds-cap-ownership-segment" style={{ width: `${s.pct}%`, background: s.color }} />
            ))}
          </div>
        </div>
        <span className="ds-cap-manage-btn">Manage</span>
      </div>
    </div>
  )
}

function OwnershipChart({ size = 'large' }: { size?: 'small' | 'large' }) {
  return (
    <div className={`ds-chart-card ds-chart-card--${size}`}>
      <p className="ds-chart-title">Dilution Insights</p>
      <div className="ds-chart-columns">
        {CHART_ROUNDS.map((round) => (
          <div className="ds-chart-column" key={round.label}>
            <p className="ds-chart-round-label">{round.label}</p>
            <div className="ds-chart-bar">
              {round.holders.map((h) => (
                <span
                  key={h.name}
                  className="ds-chart-segment"
                  style={{ height: `${h.pct}%`, background: h.color }}
                  title={`${h.name} ${h.pct}%`}
                />
              ))}
            </div>
            {size === 'large' && (
              <div className="ds-chart-holders">
                {round.holders
                  .filter((h) => h.pct > 0)
                  .map((h) => (
                    <p className="ds-chart-holder" key={h.name}>
                      {h.name}
                      {h.amount && ` ${h.amount}`} ({h.pct}%)
                    </p>
                  ))}
              </div>
            )}
          </div>
        ))}
      </div>
      {size === 'large' && (
        <div className="ds-chart-legend">
          {CHART_LEGEND.map((l) => (
            <span className="ds-chart-legend-item" key={l.name}>
              <span className="ds-chart-legend-dot" style={{ background: l.color }} />
              {l.name}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

function SwatchRow({
  items,
}: {
  items: { title: string; body: string; color: 'cyan' | 'blue' | 'orange'; visual?: React.ReactNode }[]
}) {
  return (
    <div className="ds-swatch-row">
      {items.map((item) => (
        <div className="ds-swatch-card" key={item.title}>
          <p className="ds-swatch-caption">
            {item.title}
            {item.body && <span> — {item.body}</span>}
          </p>
          <div className={`ds-swatch-block ds-swatch-block--${item.color}${item.visual ? ' ds-swatch-block--framed' : ''}`}>
            {item.visual}
          </div>
        </div>
      ))}
    </div>
  )
}

export function DilutionShockPage() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="ds-page">
      <CaseStudySideNav sections={SECTIONS} />

      <div className="ds-container">
        {/* ── Header ── */}
        <div className="ds-header" id="ds-section-overview">
          <h1 className="ds-title">
            Designing for Dilution Shock: The Fundraising Scenario Tool
          </h1>
          <div className="ds-meta-grid">
            <div className="ds-meta-item">
              <p className="ds-meta-label">Timeline</p>
              <p className="ds-meta-value">2 Week Sprint</p>
            </div>
            <div className="ds-meta-item">
              <p className="ds-meta-label">Role</p>
              <p className="ds-meta-value">Product Designer</p>
            </div>
            <div className="ds-meta-item">
              <p className="ds-meta-label">Team</p>
              <div className="ds-meta-values">
                <p className="ds-meta-value">1 Designer — Sri Cherry K</p>
                <p className="ds-meta-value">1 Product Manager</p>
                <p className="ds-meta-value">4 Developers</p>
              </div>
            </div>
            <div className="ds-meta-item">
              <p className="ds-meta-label">Tools</p>
              <div className="ds-meta-values">
                <p className="ds-meta-value">Figma</p>
                <p className="ds-meta-value">Claude</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Context ── */}
        <div className="ds-section" id="ds-section-context">
          <p className="ds-eyebrow">Context</p>
          <div className="ds-body-group">
            <p className="ds-statement">
              Founders and CFOs were negotiating six- and seven-figure rounds on spreadsheets that couldn't correctly
              model SAFE/note conversion — the highest-stakes moment in a company's life running on the least
              reliable tool they had.
            </p>
            <p className="ds-body">
              Founders sign five SAFEs over a year with no share price attached to any of them, then get blindsided
              by how much of their company disappears the moment a priced round forces them all to convert at once.
              This case study covers how <strong>I designed the fundraising module</strong> that turns that{' '}
              <strong>blind spot into a number they can see and negotiate against, before they sign anything.</strong>
            </p>
          </div>
        </div>

        {/* ── The Problem ── */}
        <div className="ds-section" id="ds-section-problem">
          <p className="ds-eyebrow">The Problem</p>
          <div className="ds-body-group">
            <p className="ds-statement">
              Uncertainty about how new SAFEs/Notes and new priced rounds impact the ownership
            </p>
            <p className="ds-body ds-body--dark">
              Founders are terrified of losing control; Finance teams are terrified of mathematical errors in the
              "pro-forma" Cap table.
            </p>
            <p className="ds-body">
              The user sentiment is <em><strong>"Anxiety"</strong></em>
            </p>
            <p className="ds-body">
              <strong>
                Founders fear losing control; finance fears a math error reaching a legal cap table. That's why this
                couldn't be designed as a speed-first tool — users needed to feel certain before acting.
              </strong>
            </p>
          </div>
        </div>

        {/* ── The Deeper Problem ── */}
        <div className="ds-section" id="ds-section-deeper-problem">
          <p className="ds-eyebrow">The Deeper Problem</p>
          <p className="ds-body">
            Three specific failure modes — naming these, rather than "cap tables are confusing," is what makes this a
            design problem, not just a data problem:
          </p>
          <SwatchRow
            items={[
              {
                title: 'Dilution Surprise',
                body:
                  'SAFEs carry a cap or discount instead of a share price, so founders stack several without a live read on ownership already given away.',
                color: 'cyan',
                visual: <CapTableCard />,
              },
              {
                title: 'Pre- vs. post-money SAFE trap',
                body:
                  "identical-looking SAFEs dilute founders differently depending on structure; founders absorb a disproportionately larger hit than earlier investors, and the math isn't doable in your head.",
                color: 'blue',
              },
              {
                title: 'Circular option-pool math',
                body:
                  'a priced round often triggers SAFE conversion and a pool top-up at once. New investor share count depends on final pool size; final pool size depends on new investor share count. Neither can be solved first.',
                color: 'orange',
              },
            ]}
          />
          <p className="ds-body">
            This started as a <strong>calculation-accuracy problem</strong>. The{' '}
            <strong>sharper problem was negotiation support</strong> — founders needed to{' '}
            <strong>compare deals fast</strong> enough to <strong>negotiate in real time</strong>, and{' '}
            <strong>needed to know when the math had hit a wall it couldn't solve</strong> (see Constraints).
          </p>
        </div>

        {/* ── User and their Objectives ── */}
        <div className="ds-section" id="ds-section-objectives">
          <p className="ds-eyebrow">User and their Objectives</p>
          <div className="ds-body-group">
            <p className="ds-body ds-body-lg">
              <strong>User goals</strong>: how a <strong>founder/CFO/investor</strong>, before signing anything, can
              see exactly how a round changes ownership, control, and cash-out — including the SAFE/pool pieces with
              no clean share price yet.
            </p>
            <p className="ds-body ds-body-lg">
              <strong>Business goals</strong>: convert scenario usage into new-user adoption and ARR; hit 70+ feature
              NPS among founders and CFOs.
            </p>
          </div>
        </div>

        {/* ── The Solution ── */}
        <div className="ds-section" id="ds-section-solution">
          <p className="ds-eyebrow">The Solution</p>
          <div className="ds-body-group">
            <p className="ds-statement">
              A "look-ahead" version of the cap table. It simulates the conversion of all unpriced instruments
              (SAFEs/C-Notes) alongside a new priced round, calculating the new post-money valuation and ownership
              percentages.
            </p>
            <p className="ds-body ds-body--dark">
              It prevents "dilution shock." Finance teams can see how much ownership the current team will lose and
              decide whether the existing option pool is sufficient or needs to be expanded before signing the term
              sheet.
            </p>
            <p className="ds-body">
              Fundraising scenario modelling enabled by AI: AI augmented workflows from concept through deployment
            </p>
          </div>
          <HeroPlaceholder aspect="2056 / 1456" />
          <p className="ds-body ds-solution-credit">Qapita</p>
        </div>

        {/* ── Impact / Metrics ── */}
        <div className="ds-section" id="ds-section-impact">
          <p className="ds-eyebrow">Impact / Metrics</p>
          <ul className="ds-list">
            <li>Drive XX new users and YY Annual ARR through scenarios by exposing module to new to Qapita users.</li>
            <li>
              Improve founder/CFO satisfaction by demystifying scenarios, driving positive feature NPS score of 70+.
              The satisfied users will create positive WoM among investor and founder communities.
            </li>
          </ul>
        </div>

        {/* ── The Design Process ── */}
        <div className="ds-section" id="ds-section-process">
          <p className="ds-eyebrow">The Design Process</p>

          <div className="ds-body-group">
            <p className="ds-body"><strong>Research</strong></p>

            <div className="ds-body-group">
              <p className="ds-body">
                <strong>Primary Research</strong>
                <br />
                User Interview
              </p>
              <AudienceChips />
            </div>

            <div className="ds-body-group">
              <p className="ds-body">
                <strong>Secondary Research</strong>
                <br />
                Cognitive walkthrough / First time user experience when I use it + Competitor analysis (Competitor
                differentiators)
              </p>
              <p className="ds-body ds-body--italic">Pulley, LTSE Equity, Carta</p>
              <ResearchImageBlock background="#fd02e4" count={3} />
            </div>

            <div className="ds-body-group">
              <p className="ds-body"><strong>Foundational Design Research — For AI Design Patterns</strong></p>
              <div className="ds-link-row">
                <a
                  className="ds-inline-link"
                  href="https://www.shapeof.ai/#inputs"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://www.shapeof.ai/#inputs
                </a>
                <span className="ds-link-divider" aria-hidden="true" />
                <p className="ds-inline-link ds-inline-link--static">https://www.aiuxpatterns.com/patterns.html</p>
              </div>
              <div className="ds-body-group">
                <p className="ds-body"><strong>Goal:</strong></p>
                <ul className="ds-list">
                  <li>To identify patterns to surface prompt suggestions</li>
                  <li>Input patterns that help you complete a workflow</li>
                  <li>How do we build trust with AI?</li>
                  <li>AI identifiers and actions with AI outputs</li>
                </ul>
              </div>
            </div>

            <div className="ds-body-group">
              <p className="ds-body ds-body--dark">Prompt Suggestions</p>
              <ResearchImageBlock background="#0a5b37" count={3} />
            </div>

            <div className="ds-body-group">
              <p className="ds-body ds-body--dark">AI Trust Builders</p>
              <ResearchImageBlock background="#e5fe94" count={2} />
            </div>
          </div>

          <div className="ds-body-group">
            <p className="ds-body"><strong>Insights</strong></p>
            <p className="ds-body ds-body-lg">JTBD — run a fundraise scenario to understand dilution and estimate ownership.</p>
            <p className="ds-body"><strong>User existing problems</strong></p>
            <ul className="ds-list">
              <li>Hard to understand, analyse, and draw conclusions — founders bring a wide range of financial literacy</li>
              <li>Lacks the ability to edit and view the analysis simultaneously</li>
              <li>The errors were not helpful and restricted finishing the task</li>
            </ul>
          </div>
        </div>

        {/* ── Before / After ── */}
        <div className="ds-section" id="ds-section-before-after">
          <p className="ds-eyebrow">Before / After</p>
          <div className="ds-before-after">
            <p className="ds-body"><strong>Before Fundraising Round Scenario Modelling Revamp</strong></p>
            <p className="ds-before-after-label">Input</p>
            <div className="ds-before-after-row">
              <div className="ds-before-after-phone">
                <PlaceholderIcon />
              </div>
              <div className="ds-before-after-phone">
                <PlaceholderIcon />
              </div>
              <div className="ds-before-after-phone">
                <PlaceholderIcon />
              </div>
            </div>
            <p className="ds-before-after-label">Output</p>
            <div className="ds-before-after-row ds-before-after-row--single">
              <div className="ds-before-after-phone">
                <PlaceholderIcon />
              </div>
            </div>
          </div>

          <div className="ds-body-group">
            <p className="ds-body"><strong>Competitor differentiators and solutions</strong></p>
            <ul className="ds-list">
              <li><strong>Our gap to fill</strong> — ability to run a scenario with and without a cap table</li>
              <li>
                <strong>Our differentiator</strong> — 1. Pro-rata rights exercise and conflict resolution. 2. Ability
                to run one scenario on another.
              </li>
            </ul>
          </div>
        </div>

        {/* ── AI to set-up and Understand Scenario ── */}
        <div className="ds-section" id="ds-section-ai-setup">
          <p className="ds-phase-label">After Revamp</p>
          <p className="ds-eyebrow">AI to Set Up and Understand Scenario</p>

          <div className="ds-body-group">
            <p className="ds-body"><strong>Iteration 1</strong></p>
            <p className="ds-statement ds-statement--sm">
              We need to group prompt suggestions since there are a number of tasks that can be done using the
              fundraising modelling tool
            </p>
          </div>
          <div className="ds-research-block" style={{ background: '#ddf1f5' }}>
            <div className="ds-research-block-row">
              <div className="ds-research-thumb">
                <PlaceholderIcon />
              </div>
            </div>
          </div>

          <HeroPlaceholderFramed aspect="1075 / 770" />

          <p className="ds-body ds-body--dark">Supporting Manual + AI flow</p>
          <HeroPlaceholderFramed aspect="1075 / 776" />
        </div>

        {/* ── Scenario on Scenario ── */}
        <div className="ds-section" id="ds-section-scenario-on-scenario">
          <p className="ds-eyebrow">Scenario on Scenario</p>
          <SwatchRow
            items={[
              { title: 'Iteration 1', body: 'Shows information of the previous round', color: 'cyan' },
              {
                title: 'Iteration 2',
                body: 'Gives the ability to configure whether pro-rata is to be exercised or not in the current round',
                color: 'blue',
              },
              { title: 'Iteration 3', body: 'Added other additional column configuration', color: 'orange' },
            ]}
          />
          <p className="ds-body">
            Final — Removed the previous round details and added the column configuration in column settings to{' '}
            <strong>reduce cognitive load</strong>
          </p>
          <HeroPlaceholder aspect="1085 / 768" />
        </div>

        {/* ── Pro-rata ── */}
        <div className="ds-section" id="ds-section-pro-rata">
          <p className="ds-eyebrow">Pro-rata</p>
          <p className="ds-statement ds-statement--sm">
            Gives the right to participate in future funding rounds to maintain their exact percentage of ownership,
            preventing their shares from being diluted.
          </p>
          <SwatchRow
            items={[
              {
                title: 'Iteration 1',
                body:
                  'Show a note of the error — however, it becomes hard for the user to come out of the error since it required trial and error',
                color: 'cyan',
              },
              {
                title: 'Iteration 2',
                body:
                  'Prompt before the final analysis with options to come out of the error, where minimal input and trial and error is required',
                color: 'blue',
              },
              {
                title: 'Iteration 3',
                body: 'Provide the ability to adjust the pro-rata rights and investment amount upfront to come out of the conflict',
                color: 'orange',
              },
            ]}
          />
          <HeroPlaceholder aspect="1063 / 753" />
          <p className="ds-body ds-body--dark">Utilised AI to help give options to come out of the conflict</p>
          <p className="ds-body ds-body--dark">
            Design the interaction layer for AI systems including prompts, workflows,{' '}
            <strong>feedback loops, escalation paths, and human override mechanisms</strong>
          </p>
        </div>

        {/* ── Constraints ── */}
        <div className="ds-section" id="ds-section-constraints">
          <p className="ds-eyebrow">Constraints that Shaped the Designs</p>
          <p className="ds-body"><strong>Constraint 1: Have the ability to create a scenario primarily using AI</strong></p>
          <p className="ds-body"><strong>Constraint 2: Have the ability to edit scenario</strong></p>

          <SwatchRow
            items={[
              { title: 'Iteration 1', body: '', color: 'orange' },
              { title: 'Iteration 2', body: '', color: 'cyan' },
              { title: 'Iteration 3', body: '', color: 'blue' },
            ]}
          />

          <div className="ds-body-group">
            <p className="ds-body">Final</p>
            <div className="ds-constraints-final">
              <OwnershipChart size="small" />
              <OwnershipChart size="small" />
            </div>
          </div>

          <p className="ds-body">
            <strong>Design that died because of feasibility</strong>: Engineers could not implement the data
            visualization — so I removed it
          </p>

          <div className="ds-chart-showcase">
            <OwnershipChart size="large" />
          </div>
        </div>

        {/* ── Learnings ── */}
        <div className="ds-section" id="ds-section-learnings">
          <p className="ds-eyebrow">Learnings and Next Steps / Areas of Future Improvement</p>
          <ul className="ds-list">
            <li>
              Integrate <strong>sound to notify the user</strong> — this lets users simultaneously complete other
              tasks while this runs in the background.
            </li>
            <li>
              <strong>Mixpanel analytics</strong> were not available to take data-driven decisions.
            </li>
          </ul>
        </div>
      </div>

      <CaseStudyFooter
        nextPath="/case-study/museo"
        nextTitle="Museo — Broadcast Auction Platform"
        nextCover="/images/museo-cover.png"
      />
    </div>
  )
}
