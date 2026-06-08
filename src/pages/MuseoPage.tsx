import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import '../styles/museo.css'

export function MuseoPage() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const slides = Array.from({ length: 20 }, (_, i) => `/images/museo/${i + 1}.png`)

  return (
    <div className="museo-page">
      <div className="museo-slides-container">
        {slides.map((slide, index) => (
          <section key={index} className="museo-slide">
            <img src={slide} alt={`Museo case study slide ${index + 1}`} />
          </section>
        ))}
      </div>

      <footer className="museo-footer">
        <Link to="/" className="museo-back-link">
          ← Back to Portfolio
        </Link>
      </footer>
    </div>
  )
}
