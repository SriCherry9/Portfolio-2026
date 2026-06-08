import { useEffect } from 'react'
import { Link } from 'react-router-dom'
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

      <footer className="incite-footer">
        <Link to="/" className="incite-back-link">
          ← Back to Portfolio
        </Link>
      </footer>
    </div>
  )
}
