import { useEffect } from 'react'
import { CaseStudyFooter } from '../components/CaseStudyFooter'
import { CaseStudySideNav } from '../components/CaseStudySideNav'

const SECTIONS = [
  { id: 'hfe-section-cover', label: 'Cover' },
  { id: 'hfe-section-1', label: 'Overview' },
  { id: 'hfe-section-2', label: 'Brief' },
  { id: 'hfe-section-3', label: 'Task Analysis (HTA)' },
  { id: 'hfe-section-4', label: 'Task Performance' },
  { id: 'hfe-section-5', label: 'Cognitive Principles' },
  { id: 'hfe-section-6', label: 'Overall Observation' },
  { id: 'hfe-section-7', label: 'Ergonomic Criteria' },
  { id: 'hfe-section-8', label: 'Ergonomic Ratings' },
  { id: 'hfe-section-9', label: 'Artifact Analysis' },
  { id: 'hfe-section-10', label: 'Areas of Improvement' },
  { id: 'hfe-section-11', label: 'Learnings' },
]

export function HfeInhalerPage() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="cs-page cs-hfe-inhaler">
      <CaseStudySideNav sections={SECTIONS} />

      <section className="cs-slides">
        <img id="hfe-section-cover" src="/images/hfe-inhaler-cover.png" alt="Human Factors & Ergonomics — case study cover" className="cs-slide-image" />
        <img id="hfe-section-1" src="/images/hfe-inhaler/hfe-inhaler-slide-01.png" alt="Human Factors & Ergonomics — title slide" className="cs-slide-image" />
        <img id="hfe-section-2" src="/images/hfe-inhaler/hfe-inhaler-slide-02.png" alt="Brief — analysing a Foracort 200 Synchrobreathe inhaler through Hierarchical Task Analysis, ergonomic analysis, cognitive ergonomic principles, and artifact analysis" className="cs-slide-image" />
        <img id="hfe-section-3" src="/images/hfe-inhaler/hfe-inhaler-slide-03.png" alt="Hierarchical Task Analysis of the inhaler — preparation, actuation, and reading steps" className="cs-slide-image" />
        <img id="hfe-section-4" src="/images/hfe-inhaler/hfe-inhaler-slide-04.png" alt="Task performance photos of the inhaler being used, and the six cognitive principles used for evaluation" className="cs-slide-image" />
        <img id="hfe-section-5" src="/images/hfe-inhaler/hfe-inhaler-slide-05.png" alt="Analysis of each task step through cognitive ergonomic principles" className="cs-slide-image" />
        <img id="hfe-section-6" src="/images/hfe-inhaler/hfe-inhaler-slide-06.png" alt="Overall observation table rating each cognitive principle as poor, can be improved, or good" className="cs-slide-image" />
        <img id="hfe-section-7" src="/images/hfe-inhaler/hfe-inhaler-slide-07.png" alt="Ergonomic analysis criteria — size, strength, reach, clearance, and posture" className="cs-slide-image" />
        <img id="hfe-section-8" src="/images/hfe-inhaler/hfe-inhaler-slide-08.png" alt="Star-rated ergonomic analysis of the inhaler's size, strength, reach, clearance, and posture" className="cs-slide-image" />
        <img id="hfe-section-9" src="/images/hfe-inhaler/hfe-inhaler-slide-09.png" alt="Artifact analysis covering material, aesthetics, interactive aspects, and context of use" className="cs-slide-image" />
        <img id="hfe-section-10" src="/images/hfe-inhaler/hfe-inhaler-slide-10.png" alt="Suggested areas of improvement for the inhaler" className="cs-slide-image" />
        <img id="hfe-section-11" src="/images/hfe-inhaler/hfe-inhaler-slide-11.png" alt="My learnings from the human factors and ergonomics exercise" className="cs-slide-image" />
      </section>

      <CaseStudyFooter
        nextPath="/case-study/comic-strip"
        nextTitle="Oh No! — A Comic Strip"
        nextCover="/images/comic-strip-cover.png"
      />
    </div>
  )
}
