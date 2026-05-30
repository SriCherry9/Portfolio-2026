import { useState, useEffect, useRef } from 'react'
import { StickyNote } from './StickyNote'

const ROLES = [
  'Interaction Designer',
  'Researcher',
  'Product Manager',
  'AI Generalist',
  'Accessibility Designer',
]

export function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isExiting, setIsExiting] = useState(false)
  const [displayedRole, setDisplayedRole] = useState(ROLES[0])
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const cycle = () => {
      setIsExiting(true)
      timerRef.current = setTimeout(() => {
        setCurrentIndex(prev => {
          const next = (prev + 1) % ROLES.length
          setDisplayedRole(ROLES[next])
          return next
        })
        setIsExiting(false)
      }, 420)
    }
    const interval = setInterval(cycle, 2800)
    return () => {
      clearInterval(interval)
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  return (
    <section className="hero-section">
      <div className="hero-top">
        <div className="hero-text">
          <h1 className="hero-name">Sri Cherry<br />Kotamreddy</h1>

          <div className="hero-role-wrapper">
            <span className="hero-role-label">I'm a</span>
            <div className="hero-role-ticker">
              <span
                key={currentIndex}
                className={`hero-role-slide${isExiting ? ' exiting' : ''}`}
              >
                {displayedRole}
              </span>
            </div>
          </div>

          <p className="hero-bio">
            Designing thoughtful product experiences at the intersection of
            interaction, research, and AI — crafting interfaces that feel
            intuitive and work for everyone.
          </p>
        </div>

        <StickyNote />
      </div>

      <div className="hero-video-block">
        <video
          autoPlay
          muted
          loop
          playsInline
          poster="/images/hero-content.png"
        >
          <source src="/videos/hero.mov" type="video/mp4" />
        </video>
      </div>
    </section>
  )
}
