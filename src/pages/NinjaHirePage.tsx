import { useEffect } from 'react'
import { CaseStudyFooter } from '../components/CaseStudyFooter'
import { CaseStudySideNav } from '../components/CaseStudySideNav'
import '../styles/ninjahire.css'

const SECTIONS = [
  { id: 'nh-section-overview', label: 'Overview' },
  { id: 'nh-section-context', label: 'Context' },
  { id: 'nh-section-problem', label: 'The Problem' },
  { id: 'nh-section-goals', label: 'User Goals & Objectives' },
  { id: 'nh-section-solution', label: 'The Solution' },
  { id: 'nh-section-impact', label: 'Impact / Metrics' },
  { id: 'nh-section-process', label: 'The Design Process' },
  { id: 'nh-section-iterations', label: 'Iterations' },
  { id: 'nh-section-learnings', label: 'Learnings & Next Steps' },
]

export function NinjaHirePage() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="nh-page">
      <CaseStudySideNav sections={SECTIONS} />

      <main className="nh-container" id="nh-main-content">
        {/* ── Header ── */}
        <div className="nh-header" id="nh-section-overview">
          <h1 className="nh-title">
            Enhanced Search for Agentic Experience - Onboarding to first experience - Growth and Monetisation UX
          </h1>
          <dl className="nh-meta-grid">
            <div className="nh-meta-item">
              <dt className="nh-meta-label">Timeline</dt>
              <dd className="nh-meta-value">2 Week Sprint</dd>
            </div>
            <div className="nh-meta-item">
              <dt className="nh-meta-label">Role</dt>
              <dd className="nh-meta-value">Product Designer</dd>
            </div>
            <div className="nh-meta-item">
              <dt className="nh-meta-label">Team</dt>
              <dd className="nh-meta-values">
                <p className="nh-meta-value">1 Designer — Sri Cherry K</p>
                <p className="nh-meta-value">1 Founder/CEO</p>
                <p className="nh-meta-value">2 Developers</p>
              </dd>
            </div>
            <div className="nh-meta-item">
              <dt className="nh-meta-label">Tools</dt>
              <dd className="nh-meta-values">
                <p className="nh-meta-value">Figma</p>
                <p className="nh-meta-value">Claude</p>
              </dd>
            </div>
          </dl>
        </div>

        {/* ── Context ── */}
        <div className="nh-section" id="nh-section-context">
          <h2 className="nh-eyebrow">Context</h2>
          <div className="nh-body-group">
            <p className="nh-statement">
              The HRs and recruiting agencies come to the application to find the right talent, shortlist, interview
              and send over to their clients or directors of the department.
            </p>
            <p className="nh-body">
              The agenda is to make the experience of onboarding to first experience faster and seamless.
            </p>
          </div>
        </div>

        {/* ── The Problem ── */}
        <div className="nh-section" id="nh-section-problem">
          <h2 className="nh-eyebrow">The Problem</h2>
          <p className="nh-statement">
            The current journey takes time to experience the application. &ldquo;It lacks the hook point as the
            user enters&rdquo;
          </p>

          <div className="nh-panel nh-panel--mint" style={{ marginTop: '24px' }}>
            <img
              src="/images/ninjahire/context-problem.png"
              alt="Before and after — original sign-up form versus the new search-first onboarding screen asking 'Who are you looking for?'"
            />
          </div>
          <p className="nh-caption">
            Reduced the onboarding from 5-6 steps to 3 steps - <strong>leading to reduced time to value</strong>
          </p>
        </div>

        {/* ── User Goals and Their Objectives ── */}
        <div className="nh-section" id="nh-section-goals">
          <h2 className="nh-eyebrow">User Goals and Their Objectives</h2>
          <dl className="nh-dl-reset">
            <div className="nh-body-group">
              <dt className="nh-body">User goals</dt>
              <dd className="nh-statement">Fill the role fast - See qualified candidates ASAP, not configure a system</dd>
            </div>
            <div className="nh-body-group">
              <dt className="nh-body">Business goals</dt>
              <dd className="nh-statement">Increase in new-user adoption and ARR</dd>
            </div>
          </dl>
        </div>

        {/* ── The Solution ── */}
        <div className="nh-section" id="nh-section-solution">
          <div className="nh-body-group">
            <h2 className="nh-eyebrow">The Solution</h2>
            <p className="nh-statement">
              Re-arranged the flow and introduced the hook point which is the search right into the onboarding
              process.
            </p>
          </div>
          <video
            className="nh-video"
            controls
            playsInline
            poster="/images/ninjahire/solution.png"
            aria-label="Screen recording of the redesigned onboarding and search flow, no spoken audio"
          >
            <source src="/videos/ninjahire-walkthrough.mov" type="video/mp4" />
          </video>
        </div>

        {/* ── Impact / Metrics ── */}
        <div className="nh-section" id="nh-section-impact">
          <h2 className="nh-eyebrow">Impact / Metrics</h2>
          <div className="nh-body-group" style={{ gap: '24px' }}>
            <div className="nh-body-group">
              <p className="nh-body" style={{ fontStyle: 'italic' }}>Activation</p>
              <h3 className="nh-statement" style={{ fontSize: '24px' }}>Time-to-first-good-candidate</h3>
              <p className="nh-body">
                Seconds/minutes from landing to the user viewing a shortlist they'd act on.
              </p>
              <p className="nh-body" style={{ fontStyle: 'italic' }}>
                <strong>Why</strong>: Directly measures whether the "hook" lands before setup fatigue kicks in —
                replaces a setup-completion metric that only measures compliance, not value felt
              </p>
            </div>
            <div className="nh-body-group">
              <h3 className="nh-statement" style={{ fontSize: '24px' }}>Session abandonment before first result</h3>
              <p className="nh-body" style={{ fontStyle: 'italic' }}>
                <strong>Why</strong>: Analyse current gap — users likely drop during config before ever seeing agent
                output
              </p>
            </div>
            <div className="nh-body-group">
              <h3 className="nh-statement" style={{ fontSize: '24px' }}>Refinement iterations per search</h3>
              <p className="nh-body" style={{ fontStyle: 'italic' }}>
                <strong>Why</strong>: Fewer "dial adjustments" needed to reach a satisfactory shortlist suggests the
                initial weighting model is closer to right the first time
              </p>
            </div>
          </div>
        </div>

        {/* ── The Design Process ── */}
        <div className="nh-section" id="nh-section-process">
          <h2 className="nh-eyebrow">The Design Process</h2>
          <h3 className="nh-subsection-label">Research</h3>

          <div className="nh-subsection">
            {/* Primary Research */}
            <div className="nh-subsection-header">
              <p className="nh-body">Primary Research</p>
              <h4 className="nh-artifact-title">Stakeholder Interview</h4>
            </div>
            <div className="nh-tag-banner">
              <p className="nh-tag-banner-label">Founder/CEO</p>
            </div>

            {/* Secondary Research */}
            <div className="nh-subsection-header">
              <p className="nh-body">Secondary Research</p>
              <h4 className="nh-artifact-title">Service Blueprint of the application to understand the Lifecycle of the Product</h4>
            </div>
            <div className="nh-panel nh-panel--peach">
              <img src="/images/ninjahire/service-blueprint.png" alt="Service blueprint mapping onboarding and activation across the candidate hiring journey" />
            </div>

            {/* Cognitive Walkthrough */}
            <div className="nh-subsection-header">
              <h4 className="nh-artifact-title">Cognitive Walkthrough/First time experience</h4>
            </div>
            <div className="nh-panel nh-panel--lime">
              <img src="/images/ninjahire/cognitive-walkthrough.png" alt="Cognitive walkthrough annotations across the first-time experience flow" />
            </div>
            <div className="nh-subsection-header">
              <h4 className="nh-artifact-title">Takeaways</h4>
            </div>
            <div className="nh-panel nh-panel--flush">
              <img src="/images/ninjahire/cognitive-walkthrough-takeaways.png" alt="Takeaways from the cognitive walkthrough, broken into functional/process, financial, and product quality issues with proposed solutions" />
            </div>

            {/* Competitor Analysis */}
            <div className="nh-subsection-header">
              <h4 className="nh-artifact-title">Competitor analysis (Competitor differentiators)</h4>
              <p className="nh-artifact-subtitle">Juicebox and Pin</p>
            </div>
            <div className="nh-panel nh-panel--magenta">
              <img src="/images/ninjahire/competitor-analysis.png" alt="Competitor analysis screenshots of Juicebox's PeopleGPT and Pin's candidate search" />
            </div>
            <div className="nh-subsection-header">
              <h4 className="nh-artifact-title">Takeaways</h4>
            </div>
            <div className="nh-panel nh-panel--flush">
              <img src="/images/ninjahire/competitor-analysis-takeaways.png" alt="Competitor differentiator table comparing JuiceBox, Pin, and NinjaHire across onboarding goals" />
            </div>

            {/* Heuristic Evaluation */}
            <div className="nh-subsection-header">
              <h4 className="nh-artifact-title">Heuristic Evaluation</h4>
            </div>
            <div className="nh-panel nh-panel--cyan">
              <img src="/images/ninjahire/heuristic-evaluation.png" alt="Heuristic evaluation flow across the onboarding and search screens, annotated with issues" />
            </div>

            {/* Change Checklist */}
            <div className="nh-subsection-header">
              <h4 className="nh-artifact-title">Change Checklist</h4>
            </div>
            <div className="nh-panel nh-panel--cream">
              <img src="/images/ninjahire/change-checklist.png" alt="Change checklist across sign-up, email confirmation, set-up, and onboarding, each with a proposed fix" />
            </div>

            {/* Information Architecture */}
            <div className="nh-subsection-header">
              <h4 className="nh-artifact-title">New Information Architecture and User Journey</h4>
            </div>
            <div className="nh-panel nh-panel--flush">
              <img src="/images/ninjahire/information-architecture.png" alt="New information architecture — Sign Up, Confirm Email, Confirm Details, Integration, Create Own Site, Add First Job — landing on the candidate results page" />
            </div>
          </div>
        </div>

        {/* ── Iterations ── */}
        <div className="nh-section" id="nh-section-iterations">
          <h2 className="nh-eyebrow">Iterations</h2>

          <div className="nh-subsection">
            {/* Login/Sign up Iterations */}
            <div className="nh-body-group" style={{ gap: '16px' }}>
              <h3 className="nh-statement" style={{ fontSize: '24px' }}>Login/Sign up Iterations</h3>
              <div className="nh-grid-2x2">
                <img src="/images/ninjahire/login-iteration-1.png" alt="Login/sign-up iteration 1 — sign-up form with a decorative dark panel" />
                <img src="/images/ninjahire/login-iteration-2.png" alt="Login/sign-up iteration 2 — sign-up form with Sourcing, Outreach, and Screening agent explainers" />
                <img src="/images/ninjahire/login-iteration-3.png" alt="Login/sign-up iteration 3 — sign-up form with an animated dot-grid pattern" />
                <img src="/images/ninjahire/login-iteration-4.png" alt="Login/sign-up iteration 4 — sign-up form with an abstract blob illustration" />
              </div>
            </div>
            <div className="nh-body-group" style={{ gap: '16px' }}>
              <h4 className="nh-subsection-label">Final</h4>
              <p className="nh-statement" style={{ fontSize: '24px' }}>
                Rather than splitting attention between form and visual, I sequenced them: the form carries the
                primary task, and the visual follows to reinforce it — using that moment to also communicate what
                the product can do.
              </p>
              <div className="nh-panel nh-panel--teal">
                <img src="/images/ninjahire/login-final.png" alt="Final sign-up screen — form on the left, Sourcing Agent capability panel on the right" />
              </div>
            </div>
          </div>

          <div className="nh-subsection" style={{ gap: '8px' }}>
            {/* Set-up Iterations */}
            <h3 className="nh-statement" style={{ fontSize: '24px' }}>Set-up Iterations</h3>
            <div className="nh-iteration-row">
              <div className="nh-iteration-card">
                <p className="nh-body">
                  <strong>Iteration</strong>: For smoother integration, the plan was to connect to Kombo where all
                  the integrations to ATS, HRMS can be done with One API. So removed the integrations step in this
                  phase.
                </p>
                <div className="nh-panel nh-panel--lightblue" style={{ padding: 0 }}>
                  <img src="/images/ninjahire/setup-iteration.png" alt="Set-up iteration — dedicated Integrations step connecting LinkedIn, Dice, ZipRecruiter, Monster, Indeed, and Career Builder" />
                </div>
              </div>
              <div className="nh-iteration-card">
                <p className="nh-body">
                  <strong>Final</strong>: Designed end-to-end AI-native workflows from prompt structuring, legible
                  agent outputs, and feedback loops that keep users in control of agent decisions, not passively
                  consuming them.
                </p>
                <div className="nh-panel nh-panel--orange" style={{ padding: 0 }}>
                  <img src="/images/ninjahire/setup-final.png" alt="Final set-up flow — Search for Candidates screen reached directly after account set-up, with the integrations step removed" />
                </div>
              </div>
            </div>
          </div>

          <div className="nh-subsection" style={{ gap: '16px' }}>
            {/* Product Tour Iterations */}
            <div className="nh-body-group" style={{ gap: '8px' }}>
              <h3 className="nh-statement" style={{ fontSize: '24px' }}>Product Tour Iterations</h3>
              <div className="nh-iteration-row">
                <div className="nh-iteration-card">
                  <h4 className="nh-subsection-label">Iteration 1</h4>
                  <div className="nh-panel nh-panel--lightblue" style={{ padding: 0 }}>
                    <img src="/images/ninjahire/product-tour-iteration-1.png" alt="Product tour iteration 1 — full-screen 'Get Started' checklist modal over the search results" />
                  </div>
                </div>
                <div className="nh-iteration-card">
                  <h4 className="nh-subsection-label">Iteration 2</h4>
                  <div className="nh-panel nh-panel--blue" style={{ padding: 0 }}>
                    <img src="/images/ninjahire/product-tour-iteration-2.png" alt="Product tour iteration 2 — step-by-step 'Add to Sequence' walkthrough panel" />
                  </div>
                </div>
                <div className="nh-iteration-card">
                  <h4 className="nh-subsection-label">Iteration 3</h4>
                  <div className="nh-panel nh-panel--orange" style={{ padding: 0 }}>
                    <img src="/images/ninjahire/product-tour-iteration-3.png" alt="Product tour iteration 3 — inline sidebar tooltip pointing to the Shortlisted tab" />
                  </div>
                </div>
              </div>
            </div>
            <div className="nh-body-group" style={{ gap: '16px' }}>
              <p className="nh-statement" style={{ fontSize: '24px' }}>
                <strong>Final</strong> Rather than front-loading instructions, the product teaches through use —
                each action surfaces the next logical step
              </p>
              <div className="nh-panel nh-panel--teal">
                <img src="/images/ninjahire/product-tour-final.png" alt="Final product tour — a lightweight 'Add to Shortlist' tooltip appears the first time a candidate result is starred" />
              </div>
              <a className="nh-link" href="https://www.onborda.dev" target="_blank" rel="noopener noreferrer">
                https://www.onborda.dev
              </a>
            </div>
          </div>
        </div>

        {/* ── Learnings ── */}
        <div className="nh-section" id="nh-section-learnings">
          <h2 className="nh-eyebrow">Learnings and Next Steps/Areas of Future Improvement</h2>
          <p className="nh-body">
            Learnt to design for <strong>Agentic AI Enterprise Product</strong>
          </p>
          <p className="nh-body">
            NinjaHire's sourcing agent taught me that agentic UX isn't about displaying results faster — it's about
            making a <strong>black-box decision legible</strong>, since recruiters were evaluating the agent's
            reasoning as much as the candidates themselves. <strong>Surfacing weighted, disagreeable criteria</strong>{' '}
            instead of a flat list, <strong>designing correction as collaboration</strong> rather than failure, and{' '}
            <strong>earning trust before asking for setup investment</strong> — this reframed my role from hiding
            the agent's complexity to <strong>exposing just enough of it for users to supervise,</strong> not
            blindly trust or reflexively distrust.
          </p>
        </div>
      </main>

      <CaseStudyFooter
        nextPath="/case-study/incite"
        nextTitle="In;cite — Ingredient Intelligence"
        nextCover="/images/incite-cover.png"
      />
    </div>
  )
}
