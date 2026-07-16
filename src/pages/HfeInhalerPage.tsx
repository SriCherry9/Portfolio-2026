import { Fragment, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { CaseStudySideNav } from '../components/CaseStudySideNav'
import '../styles/hfe-inhaler.css'

const SECTIONS = [
  { id: 'hfe-section-hero', label: 'Human Factors & Ergonomics' },
  { id: 'hfe-section-brief', label: 'Brief' },
  { id: 'hfe-section-hta', label: 'Task Analysis (HTA)' },
  { id: 'hfe-section-cognitive', label: 'Cognitive Principles' },
  { id: 'hfe-section-analysis', label: 'Analysis' },
]

const HTA_BRANCHES = [
  {
    title: 'Preparation',
    steps: [
      'Retrieve inhaler from storage',
      'Ensure there is an available dose',
      'Shake the inhaler to mix the medication',
    ],
  },
  {
    title: 'Actuate Inhaler',
    steps: [
      'Take a deep breath and exhale fully',
      'Remove the inhaler cap and hold in position',
      'Press the canister to release the medication',
    ],
  },
  {
    title: 'Reading Inhaler',
    steps: [
      'Breathe in slowly and deeply through the mouth. Hold the breath and exhale',
      'Wait between puffs',
      'Read the doses left before storage',
    ],
  },
]

const COGNITIVE_PRINCIPLES = [
  'Visibility / Accessibility',
  'Signifier / Affordance',
  'Mapping / Hierarchy',
  'Feedback',
  'Constraint',
  'Consistency',
]

const ANALYSIS_ITEMS = [
  <>The L-shaped structure helps hold it in the proper position — <strong>good affordance with minimal constraints.</strong></>,
  <>The inhaler needs shaking for the medication to mix well before use; the direction for this isn't indicated on the device — <strong>no visibility.</strong></>,
  <>Opening the mouth cap — <strong>good affordance, visibility, and feedback</strong> (the cap visibly opens), <strong>no constraint</strong>, and <strong>good mapping</strong> (pulling the cap swings it open and down), and it's usually <strong>consistent.</strong></>,
  <>The opening hints at the hollow space the medication comes out of, suggesting where to place your mouth — <strong>good affordance and visibility.</strong></>,
  <>Pulling down the button placed behind the inhaler to release the medicine — <strong>poor visibility</strong> of the button, but <strong>good affordance</strong> to pull it down, <strong>above-average consistency</strong> of the end result, and <strong>good auditory feedback</strong> when the medicine releases. The <strong>mapping of the pull could be better.</strong></>,
  <>Reading the doses left — <strong>good visibility, moderate consistency and feedback.</strong></>,
]

function PlaceholderPhoto({ label, number }: { label: string; number?: number }) {
  return (
    <div className="hfe-placeholder">
      {number != null && <span className="hfe-placeholder-num">{number}</span>}
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <rect x="3" y="4" width="18" height="14" rx="2" />
        <path d="M3 15l4.5-4.5a1.5 1.5 0 0 1 2.12 0L14 15" />
        <circle cx="16.5" cy="8.5" r="1.5" />
      </svg>
      <span className="hfe-placeholder-label">{label}</span>
    </div>
  )
}

function HtaDiagram() {
  return (
    <div className="hta-diagram">
      <div className="hta-root-row">
        <div className="hta-node hta-node--root">User Inhaler</div>
      </div>
      <div className="hta-trunk" />
      <div className="hta-branches">
        {HTA_BRANCHES.map(branch => (
          <div className="hta-branch" key={branch.title}>
            <div className="hta-branch-stub" />
            <div className="hta-node hta-node--branch">{branch.title}</div>
            {branch.steps.map(step => (
              <Fragment key={step}>
                <div className="hta-leaf-connector" />
                <div className="hta-node hta-node--leaf">{step}</div>
              </Fragment>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export function HfeInhalerPage() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="hfe-page">
      <CaseStudySideNav sections={SECTIONS} />

      <div className="hfe-container">
        {/* ── Hero ── */}
        <div className="hfe-hero" id="hfe-section-hero">
          <p className="hfe-eyebrow">Playground · Case Study</p>
          <h1 className="hfe-title">Human Factors &amp; Ergonomics</h1>
          <p className="hfe-subtitle">
            Analysing an inhaler through ergonomic analysis, cognitive ergonomic principles, and artifact analysis.
          </p>
        </div>

        {/* ── Brief ── */}
        <div className="hfe-section" id="hfe-section-brief">
          <p className="hfe-eyebrow">Analysing an Inhaler</p>
          <div className="hfe-brief-grid">
            <div>
              <h2 className="hfe-h2" style={{ marginBottom: 20 }}>Brief</h2>
              <ul className="hfe-list">
                <li>Conduct a Hierarchical Task Analysis of an inhaler</li>
                <li>
                  Evaluate the device through:
                  <ul className="hfe-sublist">
                    <li>Ergonomic analysis</li>
                    <li>Cognitive ergonomic principles</li>
                    <li>Artifact analysis</li>
                  </ul>
                </li>
                <li>Suggest areas of improvement</li>
              </ul>
            </div>
            <PlaceholderPhoto label="Foracort 200 Synchrobreathe — Cipla" />
          </div>
        </div>

        {/* ── Hierarchical Task Analysis ── */}
        <div className="hfe-section" id="hfe-section-hta">
          <h2 className="hfe-h2 hfe-h2--center">Hierarchical Task Analysis (HTA)</h2>
          <HtaDiagram />
        </div>

        {/* ── Task performance + Cognitive Principles ── */}
        <div className="hfe-section" id="hfe-section-cognitive">
          <div className="hfe-two-col">
            <div>
              <h2 className="hfe-h2">Task performance</h2>
              <div className="hfe-photo-grid">
                {[1, 2, 3, 4, 5, 6, 7].map(n => (
                  <PlaceholderPhoto key={n} number={n} label={`Step ${n}`} />
                ))}
              </div>
            </div>
            <div>
              <h2 className="hfe-h2">Cognitive Principles</h2>
              <p className="hfe-body" style={{ marginTop: 16 }}>
                Based on how humans process information and make decisions. It aims to reduce cognitive load.
              </p>
              <ul className="hfe-principle-list">
                {COGNITIVE_PRINCIPLES.map(p => <li key={p}>{p}</li>)}
              </ul>
            </div>
          </div>
        </div>

        {/* ── Analysis ── */}
        <div className="hfe-section" id="hfe-section-analysis">
          <h2 className="hfe-h2">Analysis through cognitive ergonomic principles</h2>
          <div className="hfe-analysis-grid">
            <ol className="hfe-analysis-list" start={2}>
              {ANALYSIS_ITEMS.map((item, i) => <li key={i}>{item}</li>)}
            </ol>
            <div className="hfe-analysis-photos">
              <PlaceholderPhoto label="Annotated close-up" number={2} />
              <PlaceholderPhoto label="Annotated close-up" number={5} />
              <PlaceholderPhoto label="Annotated close-up" number={6} />
            </div>
          </div>
        </div>

        <p className="hfe-more">More sections coming soon.</p>
      </div>

      <footer className="hfe-footer">
        <Link to="/playground" className="hfe-back">← Back to Playground</Link>
      </footer>
    </div>
  )
}
