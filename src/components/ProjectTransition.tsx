import { useEffect, useRef, useState } from 'react'
import './ProjectTransition.css'
import { playXyloArpeggio } from '../utils/xyloSound'
import { preloadCaseStudyImages } from '../utils/caseStudyAssets'

interface ProjectTransitionProps {
  active: boolean
  color: string
  /** The route being opened — its images are preloaded while the splash plays,
   *  so the case study is already in the browser's cache by the time it mounts. */
  path: string
  /** Fired once, once the splash has held long enough and the destination is ready. */
  onNavigate: () => void
  /** Fired once the overlay has fully faded out, so the parent can unmount it. */
  onDone: () => void
}

// The shapes' own fall animation needs this long to read as finished — never
// navigate before it, even on a fast connection where images are ready sooner.
const MIN_VISIBLE = 780
// A ceiling so a slow connection still gets moving rather than waiting forever.
const MAX_WAIT     = 4000
// Matches the pt-fade-out duration in ProjectTransition.css.
const LEAVE_MS      = 260

/**
 * Full-screen colour splash + falling "loading" shapes (same motif as the
 * landing hero) shown while a project's case study opens — held until that
 * case study's images have preloaded (or MAX_WAIT elapses), so there's no
 * second, separate wait once it's on screen.
 *
 * Only mounted while `active` — each activation is a fresh mount, so its
 * internal timers and "leaving" state never need resetting between uses.
 */
export function ProjectTransition(props: ProjectTransitionProps) {
  if (!props.active) return null
  return <ActiveProjectTransition {...props} />
}

type ActiveProps = Omit<ProjectTransitionProps, 'active'>

function ActiveProjectTransition({ color, path, onNavigate, onDone }: ActiveProps) {
  const firedRef = useRef(false)
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    let cancelled = false
    let leaveTimer: ReturnType<typeof setTimeout> | undefined
    // Same xylophone voice as hovering the letters elsewhere on the site — here
    // timed to the falling shapes, so opening a project sounds the same way it
    // feels: playful, and of a piece with the rest of the hover interactions.
    const cancelArpeggio = playXyloArpeggio()

    const wait = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms))
    Promise.all([
      wait(MIN_VISIBLE),
      Promise.race([preloadCaseStudyImages(path), wait(MAX_WAIT)]),
    ]).then(() => {
      if (cancelled || firedRef.current) return
      firedRef.current = true
      onNavigate()
      setLeaving(true)
      leaveTimer = setTimeout(onDone, LEAVE_MS)
    })

    return () => {
      cancelled = true
      cancelArpeggio()
      if (leaveTimer) clearTimeout(leaveTimer)
    }
  }, [path, onNavigate, onDone])

  return (
    <div
      className={`pt-overlay${leaving ? ' pt-leaving' : ''}`}
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
