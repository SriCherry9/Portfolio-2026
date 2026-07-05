import { useEffect } from 'react'
import { CaseStudyFooter } from '../components/CaseStudyFooter'
import { CaseStudySideNav } from '../components/CaseStudySideNav'
import '../styles/ai-product-strategy.css'

const SECTION_LABELS: Record<number, string> = {
  1: 'Cover',
  2: 'Executive Summary',
  3: 'Divider',
  4: 'Context & Problem Space',
  5: 'Vision & Objectives',
  6: 'Target Audience',
  7: 'Research & Competitive Landscape',
  8: 'Define & Ideate',
  9: 'AI Design Principles & Guidelines',
  10: 'Use Case-Specific Principles',
  11: 'Prioritization',
  12: 'MoSCoW & Kano Matrix',
  13: 'Stakeholder Alignment',
  14: 'Prioritization & Alignment Recap',
  15: 'Lessons Learnt',
  16: 'Closing Summary',
}

export function AiProductStrategyPage() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const slideNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
  const slides = slideNumbers.map(num => `/images/ai-product-strategy/${num}.png`)

  return (
    <div className="ai-product-strategy-page">
      <CaseStudySideNav
        sections={slideNumbers.map((num) => ({ id: `ai-product-strategy-section-${num}`, label: SECTION_LABELS[num] }))}
      />

      <div className="ai-product-strategy-slides-container">
        {slides.map((slide, index) => (
          <section key={index} id={`ai-product-strategy-section-${index + 1}`} className="ai-product-strategy-slide">
            <img src={slide} alt={`AI Product Strategy slide ${index + 1}`} />
          </section>
        ))}
      </div>

      <CaseStudyFooter
        nextPath="/case-study/luna"
        nextTitle="Luna — Human Robot Interaction"
        nextCover="/images/luna-cover.png"
      />
    </div>
  )
}
