import { useState, useEffect, useRef } from 'react'

const ROLES = [
  'Interaction Designer',
  'Researcher',
  'Product Manager',
  'AI Generalist',
  'Accessibility Designer',
]

export function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isExiting, setIsExiting]       = useState(false)
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
    <section className="dh-section">

      {/* ── Shape cards ─────────────────────────────────────────────── */}

      {/* Top-left: purple clover */}
      <div className="dh-card dh-card--tl dh-float-a">
        <svg viewBox="0 0 80 80" className="dh-shape">
          {/* 4-petal clover — four circles */}
          <circle cx="40" cy="22" r="18" fill="#C49DD8"/>
          <circle cx="40" cy="58" r="18" fill="#C49DD8"/>
          <circle cx="22" cy="40" r="18" fill="#C49DD8"/>
          <circle cx="58" cy="40" r="18" fill="#C49DD8"/>
        </svg>
      </div>

      {/* Top-right: purple squiggle */}
      <div className="dh-card dh-card--tr dh-float-b">
        <svg viewBox="0 0 60 110" className="dh-shape">
          <path
            d="M30 8 C52 8 52 32 30 38 C8 44 8 68 30 74 C52 80 52 100 30 102"
            fill="none"
            stroke="#C49DD8"
            strokeWidth="14"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Bottom-left: green asterisk / daisy */}
      <div className="dh-card dh-card--bl dh-spin-slow">
        <svg viewBox="0 0 100 100" className="dh-shape">
          {[0,45,90,135].map(angle => (
            <ellipse
              key={angle}
              cx="50" cy="50"
              rx="10" ry="32"
              fill="#4A9B7F"
              transform={`rotate(${angle} 50 50)`}
            />
          ))}
          <circle cx="50" cy="50" r="10" fill="#4A9B7F"/>
        </svg>
      </div>

      {/* Bottom-right: blue scalloped circle */}
      <div className="dh-card dh-card--mr dh-float-c">
        <svg viewBox="0 0 100 100" className="dh-shape">
          <path d={scallop(50, 50, 36, 24)} fill="#2B62E8"/>
        </svg>
      </div>

      {/* Bottom-center: dark teal hourglass */}
      <div className="dh-card dh-card--bc dh-float-b" style={{ animationDelay: '1.2s' }}>
        <svg viewBox="0 0 70 110" className="dh-shape">
          <path
            d="M10 5 L60 5 Q60 5 38 52 Q60 99 60 105 L10 105 Q10 105 32 52 Q10 5 10 5 Z"
            fill="#1B5252"
          />
        </svg>
      </div>

      {/* ── Centre text ──────────────────────────────────────────────── */}
      <div className="dh-center">
        <span className="dh-pre">Sri</span>

        <h1 className="dh-name">
          {/* Orange crescent replaces the "C" */}
          <span className="dh-crescent" aria-hidden="true">
            <svg viewBox="0 0 54 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M46 32C46 47.464 36.703 60 25 60C13.297 60 4 47.464 4 32C4 16.536 13.297 4 25 4C19 10 16 20.5 16 32C16 43.5 19 54 25 60C36.703 60 46 47.464 46 32Z"
                fill="#E8694A"
              />
            </svg>
          </span>
          <span className="dh-name-rest">herry</span>
        </h1>

        <span className="dh-last">Kotamreddy</span>

        <div className="dh-role-row">
          <div className="dh-role-ticker">
            <span
              key={currentIndex}
              className={`dh-role-slide${isExiting ? ' exiting' : ''}`}
            >
              {displayedRole}
            </span>
          </div>
        </div>
      </div>

    </section>
  )
}

/* ── Scalloped circle path generator ─────────────────────────────────── */
function scallop(cx: number, cy: number, r: number, petals: number): string {
  const points: string[] = []
  const step = (Math.PI * 2) / (petals * 2)
  for (let i = 0; i < petals * 2; i++) {
    const angle  = i * step - Math.PI / 2
    const radius = i % 2 === 0 ? r : r * 0.78
    const x = cx + radius * Math.cos(angle)
    const y = cy + radius * Math.sin(angle)
    points.push(i === 0 ? `M${x},${y}` : `L${x},${y}`)
  }
  return points.join(' ') + ' Z'
}
