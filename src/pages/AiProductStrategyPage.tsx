import { useEffect } from 'react'
import { CaseStudyFooter } from '../components/CaseStudyFooter'
import '../styles/ai-product-strategy.css'

export function AiProductStrategyPage() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const slideNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
  const slides = slideNumbers.map(num => `/images/ai-product-strategy/${num}.png`)

  return (
    <div className="ai-product-strategy-page">
      <div className="ai-product-strategy-slides-container">
        {slides.map((slide, index) => (
          <section key={index} className="ai-product-strategy-slide">
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
