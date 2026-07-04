import { useEffect } from 'react'
import { CaseStudyFooter } from '../components/CaseStudyFooter'
import '../styles/museo.css'

export function MuseoPage() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const slides = Array.from({ length: 21 }, (_, i) => `/images/museo/${i + 1}.png`)

  return (
    <div className="museo-page">
      <div className="museo-slides-container">
        {slides.map((slide, index) => (
          <section key={index} className="museo-slide">
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
