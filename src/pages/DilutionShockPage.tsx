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

const ASSET_BASE = '/images/dilution-shock'

function SwatchImage({ src, alt }: { src: string; alt: string }) {
  return <img className="ds-swatch-img" src={`${ASSET_BASE}/${src}`} alt={alt} loading="lazy" />
}

function BleedImage({ src, alt, className = '' }: { src: string; alt: string; className?: string }) {
  return <img className={`ds-bleed-img ${className}`.trim()} src={`${ASSET_BASE}/${src}`} alt={alt} loading="lazy" />
}

function HeroVideo({ src, webm, poster, aspect }: { src: string; webm: string; poster: string; aspect: string }) {
  return (
    <video
      className="ds-hero-video"
      style={{ aspectRatio: aspect }}
      controls
      preload="metadata"
      poster={`${ASSET_BASE}/${poster}`}
      playsInline
    >
      <source src={`${ASSET_BASE}/${webm}`} type="video/webm" />
      <source src={`${ASSET_BASE}/${src}`} type="video/mp4" />
    </video>
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
          <div className={`ds-swatch-block ds-swatch-block--${item.color}`}>{item.visual}</div>
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
          <h2 className="ds-eyebrow">Context</h2>
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
          <h2 className="ds-eyebrow">The Problem</h2>
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
          <h2 className="ds-eyebrow">The Deeper Problem</h2>
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
                visual: (
                  <SwatchImage
                    src="dilution-surprise.png"
                    alt="Series B cap table card showing post-money valuation, price per share, and an ownership bar broken out by holder"
                  />
                ),
              },
              {
                title: 'Pre- vs. post-money SAFE trap',
                body:
                  "identical-looking SAFEs dilute founders differently depending on structure; founders absorb a disproportionately larger hit than earlier investors, and the math isn't doable in your head.",
                color: 'blue',
                visual: (
                  <SwatchImage
                    src="pre-vs-post-money.png"
                    alt="SAFE conversion table listing valuation type as pre-money or post-money alongside valuation cap and discount for each SAFE"
                  />
                ),
              },
              {
                title: 'Circular option-pool math',
                body:
                  'a priced round often triggers SAFE conversion and a pool top-up at once. New investor share count depends on final pool size; final pool size depends on new investor share count. Neither can be solved first.',
                color: 'orange',
                visual: (
                  <SwatchImage
                    src="circular-math.png"
                    alt="Option pool details form asking whether to top up the option pool, carved out pre- or post-money, with a top-up percentage"
                  />
                ),
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
          <h2 className="ds-eyebrow">User and their Objectives</h2>
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
          <h2 className="ds-eyebrow">The Solution</h2>
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
          <HeroVideo
            src="scenario-final.mp4"
            webm="scenario-final.webm"
            poster="scenario-final-poster.jpg"
            aspect="2056 / 1456"
          />
          <p className="ds-body ds-solution-credit">Qapita</p>
        </div>

        {/* ── Impact / Metrics ── */}
        <div className="ds-section" id="ds-section-impact">
          <h2 className="ds-eyebrow">Impact / Metrics</h2>
          <ul className="ds-list ds-list--lg">
            <li>Drive 1,200+ new users and $180K Annual ARR through scenarios by exposing module to new to Qapita users.</li>
            <li>
              Improve founder/CFO satisfaction by demystifying scenarios, driving positive feature NPS score of 70+.
              The satisfied users will create positive word of mouth among investor and founder communities.
            </li>
          </ul>
        </div>

        {/* ── The Design Process ── */}
        <div className="ds-section" id="ds-section-process">
          <div className="ds-stack-80">
            <div className="ds-stack-24">
              <h2 className="ds-eyebrow">The Design Process</h2>
              <p className="ds-body ds-body--dark"><strong>Research</strong></p>

              <div className="ds-stack-56">
                <div className="ds-body-group">
                  <p className="ds-body">
                    <strong className="ds-body--dark">Primary Research</strong>
                    <br />
                    User Interview
                  </p>
                  <AudienceChips />
                </div>

                <div className="ds-body-group">
                  <p className="ds-body">
                    <strong className="ds-body--dark">Secondary Research</strong>
                    <br />
                    Cognitive walkthrough / First time user experience when I use it + Competitor analysis (Competitor
                    differentiators)
                  </p>
                  <BleedImage
                    src="competitors.png"
                    alt="Screenshots of Pulley, an exit modelling tool, and Carta's SAFE stakeholder breakdown for competitor analysis"
                  />
                  <p className="ds-body ds-body--italic">Pulley, LTSE Equity, Carta</p>
                </div>

                <div className="ds-stack-24">
                  <div className="ds-body-group">
                    <p className="ds-body ds-body--dark"><strong>Foundational Design Research — For AI Design Patterns</strong></p>
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
                  </div>

                  <div className="ds-body-group">
                    <p className="ds-body ds-body--dark"><strong>Goal:</strong></p>
                    <ul className="ds-list ds-list--dark">
                      <li>To identify patterns to surface prompt suggestions</li>
                      <li>Input patterns that help you complete a workflow</li>
                      <li>How do we build trust with AI?</li>
                      <li>AI identifiers and actions with AI outputs</li>
                    </ul>
                  </div>

                  <div className="ds-body-group">
                    <p className="ds-body ds-body--dark">Prompt Suggestions</p>
                    <BleedImage
                      src="prompt-suggestion.png"
                      alt="AI prompt suggestion patterns: recipe-style quick actions, a dark 'Ask anything' input, and 'Ready when you are' quick action chips"
                    />
                  </div>

                  <div className="ds-body-group">
                    <p className="ds-body ds-body--dark">AI Trust Builders</p>
                    <BleedImage
                      src="ai-trust-builders.png"
                      alt="AI trust-building UI patterns showing disclaimers that AI responses can be inaccurate and should be double-checked"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="ds-body-group">
              <p className="ds-body ds-body--dark"><strong>Insights</strong></p>
              <p className="ds-body ds-body-lg">JTBD — run a fundraise scenario to understand dilution and estimate ownership.</p>
              <p className="ds-body ds-body--dark"><strong>User existing problems</strong></p>
              <ul className="ds-list ds-list--dark">
                <li>Hard to understand, analyse, and draw conclusions — founders bring a wide range of financial literacy</li>
                <li>Lacks the ability to edit and view the analysis simultaneously</li>
                <li>The errors were not helpful and restricted finishing the task</li>
              </ul>
            </div>
          </div>
        </div>

        {/* ── Before / After ── */}
        <div className="ds-section" id="ds-section-before-after">
          <h2 className="ds-eyebrow">Before / After</h2>
          <div className="ds-before-after">
            <p className="ds-body"><strong>Before Fundraising Round Scenario Modelling Revamp</strong></p>
            <p className="ds-before-after-label">Input</p>
            <BleedImage
              src="before-input.png"
              alt="Old scenario analysis tool showing three dated, dense multi-step forms for building a scenario manually"
            />
            <p className="ds-before-after-label">Output</p>
            <BleedImage
              src="before-output.png"
              alt="Old tool's dense pro forma capitalization table output, hard to read at a glance"
              className="ds-bleed-img--narrow"
            />
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
          <h2 className="ds-eyebrow">AI to Set Up and Understand Scenario</h2>

          <div className="ds-body-group">
            <p className="ds-body"><strong>Iteration 1</strong></p>
            <p className="ds-statement ds-statement--sm">
              We need to group prompt suggestions since there are a number of tasks that can be done using the
              fundraising modelling tool
            </p>
          </div>
          <BleedImage
            src="ai-setup-iteration-1.png"
            alt="Let's build your first scenario screen with an AI prompt input and suggested prompt chips like Help me model a Series A round"
          />

          <HeroVideo
            src="prompt-through-pills.mp4"
            webm="prompt-through-pills.webm"
            poster="prompt-through-pills-poster.jpg"
            aspect="2056 / 1456"
          />

          <p className="ds-body ds-body--dark">Supporting Manual + AI flow</p>
          <BleedImage
            src="manual-ai-flow.png"
            alt="Fundraising scenario dashboard listing Series A, B, and C scenarios alongside the Qaptain AI assistant panel"
          />
        </div>

        {/* ── Scenario on Scenario ── */}
        <div className="ds-section" id="ds-section-scenario-on-scenario">
          <h2 className="ds-eyebrow">Scenario on Scenario</h2>
          <SwatchRow
            items={[
              {
                title: 'Iteration 1',
                body: 'Shows information of the previous round',
                color: 'cyan',
                visual: (
                  <SwatchImage
                    src="scenario-on-scenario-iteration-1.png"
                    alt="SAFEs and Convertibles table tagged with the Angel - Initial Investors previous round as base"
                  />
                ),
              },
              {
                title: 'Iteration 2',
                body: 'Gives the ability to configure whether pro-rata is to be exercised or not in the current round',
                color: 'blue',
                visual: (
                  <SwatchImage
                    src="scenario-on-scenario-iteration-2.png"
                    alt="SAFEs and Convertibles table with toggles for pro-rata and super pro-rata rights per investor"
                  />
                ),
              },
              {
                title: 'Iteration 3',
                body: 'Added other additional column configuration',
                color: 'orange',
                visual: (
                  <SwatchImage
                    src="scenario-on-scenario-iteration-3.png"
                    alt="SAFEs and Convertibles table with additional column toggles and a prior-round SAFE conversions table"
                  />
                ),
              },
            ]}
          />
          <p className="ds-body">
            Final — Removed the previous round details and added the column configuration in column settings to{' '}
            <strong>reduce cognitive load</strong>
          </p>
          <HeroVideo
            src="scenario-on-scenario-final.mp4"
            webm="scenario-on-scenario-final.webm"
            poster="scenario-on-scenario-final-poster.jpg"
            aspect="2056 / 1456"
          />
        </div>

        {/* ── Pro-rata ── */}
        <div className="ds-section" id="ds-section-pro-rata">
          <h2 className="ds-eyebrow">Pro-rata</h2>
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
                visual: (
                  <SwatchImage
                    src="pro-rata-iteration-1.png"
                    alt="Scenario table with pro-rata percent columns per investor and no guided way to resolve a conflict"
                  />
                ),
              },
              {
                title: 'Iteration 2',
                body:
                  'Prompt before the final analysis with options to come out of the error, where minimal input and trial and error is required',
                color: 'blue',
                visual: (
                  <SwatchImage
                    src="pro-rata-iteration-2.png"
                    alt="Pro-rata conflict modal describing the shortfall with options like increase round size, waive pro-rata, or split the difference"
                  />
                ),
              },
              {
                title: 'Iteration 3',
                body: 'Provide the ability to adjust the pro-rata rights and investment amount upfront to come out of the conflict',
                color: 'orange',
                visual: (
                  <SwatchImage
                    src="pro-rata-iteration-3.png"
                    alt="Pro-rata conflict modal with editable tables to adjust pro-rata rights per investor and round size directly"
                  />
                ),
              },
            ]}
          />
          <HeroVideo
            src="pro-rata-conflict-resolution.mp4"
            webm="pro-rata-conflict-resolution.webm"
            poster="pro-rata-conflict-resolution-poster.jpg"
            aspect="2056 / 1456"
          />
          <p className="ds-body">
            Designed the interaction layer for AI systems with{' '}
            <strong>feedback loops escalation paths and human override mechanisms</strong>
          </p>
        </div>

        {/* ── Constraints ── */}
        <div className="ds-section" id="ds-section-constraints">
          <h2 className="ds-eyebrow">Constraints that Shaped the Designs</h2>
          <div className="ds-body-group">
            <p className="ds-body">Constraint 1</p>
            <p className="ds-statement ds-statement--sm">Have the ability to create a scenario primarily using AI</p>
          </div>
          <div className="ds-body-group">
            <p className="ds-body">Constraint 2</p>
            <p className="ds-statement ds-statement--sm">Have the ability to edit scenario</p>
          </div>

          <SwatchRow
            items={[
              {
                title: 'Iteration 1',
                body: '',
                color: 'orange',
                visual: (
                  <SwatchImage
                    src="constraints-1.png"
                    alt="Manual Add Funding Round side panel next to a grayed-out scenario analysis table"
                  />
                ),
              },
              {
                title: 'Iteration 2',
                body: '',
                color: 'cyan',
                visual: (
                  <SwatchImage
                    src="constraints-2.png"
                    alt="Create Scenario screen with a Round and Pool Details tab next to a new AI tab, plus an upload term sheet option"
                  />
                ),
              },
              {
                title: 'Iteration 3',
                body: '',
                color: 'blue',
                visual: (
                  <SwatchImage
                    src="constraints-3.png"
                    alt="Multi-step Create Scenario flow with Round Set-up, SAFEs and Convertibles, Preferred Shares, and Option Pool Detail steps"
                  />
                ),
              },
            ]}
          />

          <div className="ds-body-group">
            <p className="ds-body">Final</p>
            <BleedImage
              src="constraints-final.png"
              alt="Final Option Pool Details step next to the Series A dashboard with the Qaptain AI assistant panel"
            />
          </div>

          <p className="ds-body">
            <strong>Design that died because of feasibility</strong>: Engineers could not implement the data
            visualization because the source of dilution would be difficult to trace — so I removed it
          </p>

          <div className="ds-chart-showcase">
            <BleedImage
              src="dilution-insights.png"
              alt="Dilution Insights sankey chart showing Founder A and investor ownership flowing across Angel, Series A, and Series B rounds"
              className="ds-chart-showcase-img"
            />
          </div>
        </div>

        {/* ── Learnings ── */}
        <div className="ds-section" id="ds-section-learnings">
          <h2 className="ds-eyebrow">Learnings and Next Steps / Areas of Future Improvement</h2>
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
