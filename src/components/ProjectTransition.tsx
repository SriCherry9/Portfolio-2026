import { useEffect, useRef } from 'react'
import './ProjectTransition.css'
import { playXyloArpeggio } from '../utils/xyloSound'

interface ProjectTransitionProps {
  active: boolean
  color: string
  /** Fired once, partway through the splash, to perform the actual route change. */
  onNavigate: () => void
  /** Fired once the overlay has fully faded out, so the parent can unmount it. */
  onDone: () => void
}

const NAVIGATE_AT = 780
const DONE_AT      = 1060

/**
 * Full-screen colour splash + falling "loading" shapes (same motif as the
 * landing hero) shown briefly while a project's case study opens.
 */
export function ProjectTransition({ active, color, onNavigate, onDone }: ProjectTransitionProps) {
  const firedRef = useRef(false)

  useEffect(() => {
    if (!active) { firedRef.current = false; return }
    const navTimer = setTimeout(() => {
      if (!firedRef.current) { firedRef.current = true; onNavigate() }
    }, NAVIGATE_AT)
    const doneTimer = setTimeout(onDone, DONE_AT)
    // Same xylophone voice as hovering the letters elsewhere on the site — here
    // timed to the falling shapes, so opening a project sounds the same way it
    // feels: playful, and of a piece with the rest of the hover interactions.
    const cancelArpeggio = playXyloArpeggio()
    return () => { clearTimeout(navTimer); clearTimeout(doneTimer); cancelArpeggio() }
  }, [active, onNavigate, onDone])

  if (!active) return null

  return (
    <div
      className="pt-overlay"
      style={{ '--pt-color': color } as React.CSSProperties}
      role="status"
      aria-live="polite"
    >
      <div className="pt-splash" />
      <div className="pt-loader">
        <div className="pt-shapes">
          <span className="pt-shape pt-shape--clover" aria-hidden="true">
            <svg viewBox="0 0 80 80" width="38" height="38">
              <circle cx="40" cy="22" r="18" fill="#fff" fillOpacity="0.92" />
              <circle cx="40" cy="58" r="18" fill="#fff" fillOpacity="0.92" />
              <circle cx="22" cy="40" r="18" fill="#fff" fillOpacity="0.92" />
              <circle cx="58" cy="40" r="18" fill="#fff" fillOpacity="0.92" />
            </svg>
          </span>
          <span className="pt-shape pt-shape--star" aria-hidden="true">
            <svg viewBox="0 0 100 100" width="40" height="40">
              <path d={starPath(50, 50, 46, 22, 6)} fill="#fff" fillOpacity="0.92" />
            </svg>
          </span>
          <span className="pt-shape pt-shape--daisy" aria-hidden="true">
            <svg viewBox="0 0 100 100" width="40" height="40">
              {[0, 72, 144, 216, 288].map(a => (
                <ellipse key={a} cx="50" cy="26" rx="11" ry="22" fill="#fff" fillOpacity="0.92"
                  transform={`rotate(${a} 50 50)`} />
              ))}
              <circle cx="50" cy="50" r="16" fill="#fff" fillOpacity="0.92" />
            </svg>
          </span>
          <span className="pt-shape pt-shape--blob" aria-hidden="true">
            <svg viewBox="0 0 100 100" width="36" height="36">
              {[0, 60, 120, 180, 240, 300].map(a => (
                <circle key={a}
                  cx={50 + 26 * Math.cos((a * Math.PI) / 180)}
                  cy={50 + 26 * Math.sin((a * Math.PI) / 180)}
                  r="18" fill="#fff" fillOpacity="0.92" />
              ))}
              <circle cx="50" cy="50" r="24" fill="#fff" fillOpacity="0.92" />
            </svg>
          </span>
        </div>
        <p className="pt-label">Opening project&hellip;</p>
      </div>
    </div>
  )
}

function starPath(cx: number, cy: number, outerR: number, innerR: number, points: number): string {
  const step = Math.PI / points
  return Array.from({ length: points * 2 }, (_, i) => {
    const angle = i * step - Math.PI / 2
    const r = i % 2 === 0 ? outerR : innerR
    const x = cx + r * Math.cos(angle)
    const y = cy + r * Math.sin(angle)
    return (i === 0 ? 'M' : 'L') + `${x.toFixed(2)},${y.toFixed(2)}`
  }).join(' ') + ' Z'
}
