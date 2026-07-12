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
  { id: 'ds-section-process', label: 'The Design Process' },
  { id: 'ds-section-ai-setup', label: 'AI Setup & Scenario' },
  { id: 'ds-section-scenario-on-scenario', label: 'Scenario on Scenario' },
  { id: 'ds-section-pro-rata', label: 'Pro-rata' },
  { id: 'ds-section-iterations', label: 'Iterations' },
  { id: 'ds-section-impact', label: 'Impact / Metrics' },
  { id: 'ds-section-learnings', label: 'Learnings & Next Steps' },
]

function ImageDuo() {
  return (
    <div className="ds-image-duo">
      <div className="ds-image-duo-primary">
        <PlaceholderIcon />
      </div>
      <div className="ds-image-duo-secondary">
        <PlaceholderIcon />
      </div>
    </div>
  )
}

function PlaceholderIcon() {
  return (
    <svg className="ds-image-duo-icon" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <rect x="3" y="4" width="18" height="14" rx="2" />
      <path d="M3 15l4.5-4.5a1.5 1.5 0 0 1 2.12 0L14 15" />
      <circle cx="16.5" cy="8.5" r="1.5" />
    </svg>
  )
}

function SwatchRow({ items }: { items: { title: string; body: string; color: 'cyan' | 'blue' | 'orange' }[] }) {
  return (
    <div className="ds-swatch-row">
      {items.map((item) => (
        <div className="ds-swatch-card" key={item.title}>
          <p className="ds-swatch-caption">
            {item.title}
            {item.body && <span> — {item.body}</span>}
          </p>
          <div className={`ds-swatch-block ds-swatch-block--${item.color}`} />
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
              Founders are terrified of losing control; finance teams are terrified of mathematical errors in the
              "pro-forma" cap table.
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
            <p className="ds-body">
              <strong>User goals</strong>: how a founder/CFO, before signing anything, can see exactly how a round
              changes ownership, control, and cash-out — including the SAFE/pool pieces with no clean share price
              yet.
            </p>
            <p className="ds-body">
              <strong>Business goals</strong>: convert scenario usage into new-user adoption and ARR; hit 70+ feature
              NPS among founders and CFOs.
            </p>
          </div>
        </div>

        {/* ── The Solution ── */}
        <div className="ds-section" id="ds-section-solution">
          <p className="ds-eyebrow">The Solution</p>
          <p className="ds-body">
            A guided scenario builder that turns the cap table math into a running, editable model — so founders and
            finance can see ownership shift in real time and negotiate against a number instead of a guess.
          </p>
          <ImageDuo />
        </div>

        {/* ── The Design Process ── */}
        <div className="ds-section" id="ds-section-process">
          <p className="ds-eyebrow">The Design Process</p>
          <div className="ds-body-group">
            <p className="ds-body"><strong>Research</strong></p>
            <p className="ds-body">Primary — User Interviews</p>
            <p className="ds-body">
              Secondary — Cognitive walkthrough / first-time-user experience when I use it; competitor analysis
              (competitor differentiators)
            </p>
            <p className="ds-body">Foundational design research — for AI design patterns</p>
            <div>
              <p className="ds-body">
                Showing adaptability, and what I did when things were going wrong:
              </p>
              <ul className="ds-list">
                <li>Engineers could not implement the data visualization — so I removed it</li>
                <li>
                  Initially designed as a fully manual flow and nearly signed off, then pivoted after feedback to
                  introduce AI assistance
                </li>
              </ul>
            </div>
          </div>

          <div className="ds-body-group" style={{ marginTop: '8px' }}>
            <p className="ds-body"><strong>Insights</strong></p>
            <p className="ds-body">Existing solutions were not well-rounded.</p>
          </div>

          <div className="ds-body-group">
            <p className="ds-body"><strong>User existing problems</strong></p>
            <p className="ds-body">
              JTBD — run a fundraise scenario to understand dilution and estimate ownership.
            </p>
            <ul className="ds-list">
              <li>Hard to understand, analyse, and draw conclusions — founders bring a wide range of financial literacy</li>
              <li>Lacks the ability to edit and view the analysis simultaneously</li>
            </ul>
          </div>

          <ImageDuo />

          <div className="ds-body-group">
            <p className="ds-body">Competitor differentiators and solutions:</p>
            <ul className="ds-list">
              <li>Ability to run a scenario with and without a cap table</li>
              <li>Pro-rata rights exercise and conflict resolution</li>
            </ul>
          </div>
        </div>

        {/* ── AI to set-up and Understand Scenario ── */}
        <div className="ds-section" id="ds-section-ai-setup">
          <p className="ds-eyebrow">AI to Set Up and Understand Scenario</p>
          <p className="ds-body">
            Letting founders describe a round in plain language and having the tool assemble the scenario — instead
            of hand-building every SAFE and priced round from scratch.
          </p>
          <ImageDuo />
        </div>

        {/* ── Scenario on Scenario ── */}
        <div className="ds-section" id="ds-section-scenario-on-scenario">
          <p className="ds-eyebrow">Scenario on Scenario</p>
          <p className="ds-body">
            Letting founders stack a hypothetical round on top of another to compare deal terms side by side, so a
            negotiation isn't a single frozen snapshot.
          </p>
          <SwatchRow
            items={[
              { title: 'Iteration 1', body: '', color: 'cyan' },
              { title: 'Iteration 2', body: '', color: 'blue' },
              { title: 'Iteration 3', body: '', color: 'orange' },
            ]}
          />
          <ImageDuo />
        </div>

        {/* ── Pro-rata ── */}
        <div className="ds-section" id="ds-section-pro-rata">
          <p className="ds-eyebrow">Pro-rata</p>
          <p className="ds-body">
            Surfacing existing investors' pro-rata rights inside the same scenario, so their participation — and the
            dilution it causes everyone else — is modeled instead of discovered after the round closes.
          </p>
          <SwatchRow
            items={[
              { title: 'Iteration 1', body: '', color: 'cyan' },
              { title: 'Iteration 2', body: '', color: 'blue' },
              { title: 'Iteration 3', body: '', color: 'orange' },
            ]}
          />
          <ImageDuo />
        </div>

        {/* ── Iterations ── */}
        <div className="ds-section" id="ds-section-iterations">
          <p className="ds-eyebrow">Iterations</p>
          <SwatchRow
            items={[
              { title: 'Iteration 1', body: 'how constraints shaped each pass', color: 'cyan' },
              { title: 'Iteration 2', body: '', color: 'blue' },
              { title: 'Iteration 3', body: '', color: 'orange' },
            ]}
          />
          <ImageDuo />
        </div>

        {/* ── Impact / Metrics ── */}
        <div className="ds-section" id="ds-section-impact">
          <p className="ds-eyebrow">Impact / Metrics</p>
          <p className="ds-body">
            Rolled out to founders and CFOs running live fundraises — measured against feature adoption, time spent
            per scenario, and feature NPS among the founders and finance teams who used it to negotiate a real round.
          </p>
        </div>

        {/* ── Learnings ── */}
        <div className="ds-section" id="ds-section-learnings">
          <p className="ds-eyebrow">Learnings and Next Steps / Areas of Future Improvement</p>
          <p className="ds-body">
            Removing the data visualization taught me to scope for engineering reality earlier, not just design
            reality. Next: revisit a lighter-weight visualization engineering can ship, and extend scenario-on-
            scenario comparison to more than two rounds at once.
          </p>
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
