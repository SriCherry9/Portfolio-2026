import { useEffect } from 'react'
import { CaseStudyFooter } from '../components/CaseStudyFooter'
import { CaseStudySideNav } from '../components/CaseStudySideNav'
import { PasswordGate } from '../components/PasswordGate'
import { CASHLESS_PASSWORD, CASHLESS_UNLOCK_KEY } from '../utils/protectedProjects'

const SECTIONS = [
  { id: 'cashless-section-1', label: 'Cashless Exercise' },
  { id: 'cashless-section-3', label: 'Product Screenshot' },
  { id: 'cashless-section-4', label: 'Context & Problem' },
  { id: 'cashless-section-5', label: 'Problem Space' },
  { id: 'cashless-section-6', label: 'Objectives' },
  { id: 'cashless-section-7', label: 'Personas' },
  { id: 'cashless-section-8', label: 'Research' },
  { id: 'cashless-section-9', label: 'Define' },
  { id: 'cashless-section-10', label: 'Ideate — SPV & Plan' },
  { id: 'cashless-section-11', label: 'Ideate — Broker Config' },
  { id: 'cashless-section-12', label: 'Ideate — Enable Cashless' },
  { id: 'cashless-section-13', label: 'Ideate — Exercise Request' },
  { id: 'cashless-section-14', label: 'Ideate — Approval Flow' },
  { id: 'cashless-section-15', label: 'Ideate — Lot Management' },
  { id: 'cashless-section-16', label: 'Design Iterations' },
  { id: 'cashless-section-17', label: 'Constraints & Metrics' },
  { id: 'cashless-section-18', label: 'Results & Next Steps' },
]

export function CashlessPage() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <PasswordGate password={CASHLESS_PASSWORD} storageKey={CASHLESS_UNLOCK_KEY} title="Cashless Equity Ownership is password protected">
    <div className="cs-page cs-cashless-design">
      <CaseStudySideNav sections={SECTIONS} />

      {/* ── Cashless Exercise Section ── */}
      <section className="cs-slides">
        <img id="cashless-section-1" src="/images/cashless-slide-01.png" alt="Cashless Exercise Platform — project overview, role, platform, timeline, and scale" className="cs-slide-image" />
      </section>

      {/* ── Case Study Slides ── */}
      <section className="cs-slides">
        <img id="cashless-section-3" src="/images/cashless-slide-02.png" alt="Cashless Exercise settlement dashboard product screenshot" className="cs-slide-image" />
        <img id="cashless-section-4" src="/images/cashless-slide-03.png" alt="Context and problem — a broken equity exercise experience, and why it became a top-priority initiative" className="cs-slide-image" />
        <img id="cashless-section-5" src="/images/cashless-slide-04.png" alt="Problem space — pain felt by employees, admins, and the business at every layer" className="cs-slide-image" />
        <img id="cashless-section-6" src="/images/cashless-slide-05.png" alt="Objectives — what success looked like across product, business, and design" className="cs-slide-image" />
        <img id="cashless-section-7" src="/images/cashless-slide-06.png" alt="Role-based personas — designing for five distinct roles" className="cs-slide-image" />
        <img id="cashless-section-8" src="/images/cashless-slide-07.png" alt="Research — understanding the full reconciliation workflow, interviews, artifact analysis, and key insights" className="cs-slide-image" />
        <img id="cashless-section-9" src="/images/cashless-slide-08.png" alt="Define — building the configurable system across eight core flows" className="cs-slide-image" />
        <img id="cashless-section-10" src="/images/cashless-slide-09.png" alt="Ideate and implement — activating cashless for exercise, and creating an SPV linked to a plan with terminology tooltips" className="cs-slide-image" />
        <img id="cashless-section-11" src="/images/cashless-slide-10.png" alt="Ideate and implement — broker creation and charges configuration, exploring two mental models" className="cs-slide-image" />
        <img id="cashless-section-12" src="/images/cashless-slide-11.png" alt="Ideate and implement — enabling cashless payment for exercise, before and after redesign" className="cs-slide-image" />
        <img id="cashless-section-13" src="/images/cashless-slide-12.png" alt="Ideate and implement — employee exercise request flow with tentative cashless calculations" className="cs-slide-image" />
        <img id="cashless-section-14" src="/images/cashless-slide-13.png" alt="Ideate and implement — cashless exercise processing with multi-level, attribute-based approval" className="cs-slide-image" />
        <img id="cashless-section-15" src="/images/cashless-slide-14.png" alt="Ideate and implement — lot creation and management, before and after cashless" className="cs-slide-image" />
        <img id="cashless-section-16" src="/images/cashless-slide-15.png" alt="Design iterations — how the lot creation flow evolved" className="cs-slide-image" />
        <img
          id="cashless-section-17"
          src="/images/cashless-slide-constraints-metrics.png"
          alt="How constraints shaped the design, and the metrics framework used to measure success"
          className="cs-slide-image"
        />
        <img
          id="cashless-section-18"
          src="/images/cashless-slide-results-next-steps.png"
          alt="Results, lessons learnt, and areas of future improvement"
          className="cs-slide-image"
        />
      </section>

      <CaseStudyFooter
        nextPath="/case-study/dilution-shock"
        nextTitle="Designing for Dilution Shock — Fundraising Scenario Tool"
        nextCover="/images/dilution-shock-cover.svg"
        nextAccentColor="#633ea5"
      />
    </div>
    </PasswordGate>
  )
}
