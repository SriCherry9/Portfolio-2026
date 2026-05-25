import { useState, useEffect, useRef } from 'react'

const ROLES = [
  'Interaction Designer',
  'Researcher',
  'Product Manager',
  'AI Generalist',
  'Accessibility Designer',
]

export function StickyNote() {
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
    <div className="sticky-note-wrapper">
      <div className="sticky-note">
        <div className="sticky-note-title">Currently a</div>
        <div className="sticky-note-role-wrap">
          <span
            key={currentIndex}
            className={`sticky-note-role${isExiting ? ' exiting' : ''}`}
          >
            {displayedRole}
          </span>
        </div>
        <div className="sticky-note-lines">
          <div className="sticky-line" />
          <div className="sticky-line" />
          <div className="sticky-line" />
        </div>
      </div>
    </div>
  )
}
