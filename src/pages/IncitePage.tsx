import { useEffect } from 'react'
import { CaseStudyFooter } from '../components/CaseStudyFooter'
import '../styles/incite.css'

export function IncitePage() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const slides = Array.from({ length: 33 }, (_, i) => `/images/incite/${i + 1}.png`)

  return (
    <div className="incite-page">
      <div className="incite-slides-container">
        {slides.map((slide, index) => (
          <section key={index} className="incite-slide">
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
