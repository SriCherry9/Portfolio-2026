import { useEffect } from 'react'
import { CaseStudyFooter } from '../components/CaseStudyFooter'
import { CaseStudySideNav } from '../components/CaseStudySideNav'
import '../styles/incite.css'

const SECTION_LABELS: Record<number, string> = {
  1: 'Cover',
  2: 'Introduction',
  3: 'First Design Competition',
  4: 'Origin Story',
  5: 'Setting the Context',
  6: 'Project Overview',
  7: 'Problem & Solution',
  8: 'Primary Research',
  9: 'Research Process',
  10: 'Research Process',
  11: 'User Sampling',
  12: 'Shadowing',
  13: 'Triading',
  14: 'Contextual Inquiry Insights',
  15: 'Research Insight',
  16: 'Survey',
  17: 'Biases in Check',
  18: 'Survey Insights',
  19: 'Secondary Study',
  20: 'Literature Review',
  21: 'Key Takeaways',
  22: 'Stakeholder Mapping',
  23: 'Competitive Analysis',
  24: 'Market Insight',
  25: 'Value Opportunity Analysis',
  26: 'Value Proposition',
  27: 'Personas',
  28: 'User Journey Map',
  29: 'Information Architecture',
  30: 'Concept Testing',
  31: 'Branding',
  32: 'Final Screens',
  33: 'Learnings & Next Steps',
}

export function IncitePage() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const slides = Array.from({ length: 33 }, (_, i) => `/images/incite/${i + 1}.png`)

  return (
    <div className="incite-page">
      <CaseStudySideNav
        sections={slides.map((_, index) => ({ id: `incite-section-${index + 1}`, label: SECTION_LABELS[index + 1] }))}
      />

      <div className="incite-slides-container">
        {slides.map((slide, index) => (
          <section key={index} id={`incite-section-${index + 1}`} className="incite-slide">
            <img src={slide} alt={`Incite case study slide ${index + 1}`} />
          </section>
        ))}
      </div>

      <CaseStudyFooter
        nextPath="/case-study/ai-product-strategy"
        nextTitle="AI Product Strategy"
        nextCover="/images/ai-product-strategy-cover.png"
      />
    </div>
  )
}
