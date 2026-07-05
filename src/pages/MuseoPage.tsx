import { useEffect } from 'react'
import { CaseStudyFooter } from '../components/CaseStudyFooter'
import { CaseStudySideNav } from '../components/CaseStudySideNav'
import '../styles/museo.css'

const SECTION_LABELS: Record<number, string> = {
  1: 'Cover',
  2: 'Art Auction',
  3: 'Design Brief',
  4: 'Project Overview',
  5: 'Setting Up Context',
  6: 'Elements of UX Design',
  7: 'Gathering Requirements',
  8: 'Literature Review',
  9: 'Competitive Analysis',
  10: 'Proto-Personas',
  11: 'Overview of the Service',
  12: 'Stakeholder Mapping',
  13: 'Service Blueprint',
  14: 'Pain Points & Insights',
  15: 'Prototype',
  16: 'Information Architecture',
  17: 'User Flow',
  18: 'UI Inspiration & Wireframes',
  19: 'UI Interactions',
  20: 'Lot Confirmation',
  21: 'Learnings & CES Images',
}

export function MuseoPage() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const slides = Array.from({ length: 21 }, (_, i) => `/images/museo/${i + 1}.png`)

  return (
    <div className="museo-page">
      <CaseStudySideNav
        sections={slides.map((_, index) => ({ id: `museo-section-${index + 1}`, label: SECTION_LABELS[index + 1] }))}
      />

      <div className="museo-slides-container">
        {slides.map((slide, index) => (
          <section key={index} id={`museo-section-${index + 1}`} className="museo-slide">
            <img src={slide} alt={`Museo case study slide ${index + 1}`} />
          </section>
        ))}
      </div>

      <CaseStudyFooter
        nextPath="/case-study/incite"
        nextTitle="In;cite — Ingredient Intelligence"
        nextCover="/images/incite-cover.png"
      />
    </div>
  )
}
