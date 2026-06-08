import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import '../styles/ai-product-strategy.css'

export function AiProductStrategyPage() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const slideNumbers = [48, 50, 52, 53, 55, 57, 58, 61, 62, 64]
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

      <footer className="ai-product-strategy-footer">
        <Link to="/" className="ai-product-strategy-back-link">
          ← Back to Portfolio
        </Link>
      </footer>
    </div>
  )
}
