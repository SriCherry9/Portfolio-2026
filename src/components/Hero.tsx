import { useState, useEffect, useRef, useCallback } from 'react'
import { StickyNote } from './StickyNote'

const ROLES = [
  'Interaction Designer',
  'Researcher',
  'Product Manager',
  'AI Generalist',
  'Accessibility Designer',
]

interface Cherry {
  id: number
  x: number        // % from left
  size: number     // px
  sway: number     // horizontal drift px
  duration: number // fall duration s
  delay: number    // s
  spin: number     // rotation during fall
}

let cherryId = 0

export function Hero() {
  const [currentIndex, setCurrentIndex]   = useState(0)
  const [isExiting, setIsExiting]         = useState(false)
  const [displayedRole, setDisplayedRole] = useState(ROLES[0])
  const [cherries, setCherries]           = useState<Cherry[]>([])
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const treeRef  = useRef<HTMLDivElement>(null)

  // Role ticker
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

  const spawnCherries = useCallback(() => {
    const tree = treeRef.current
    if (!tree) return
    const rect    = tree.getBoundingClientRect()
    const left    = (rect.left  / window.innerWidth) * 100
    const width   = (rect.width / window.innerWidth) * 100
    const spread  = width * 0.7

    const batch: Cherry[] = Array.from({ length: 28 }, () => ({
      id:       cherryId++,
      x:        left + width * 0.5 - spread / 2 + Math.random() * spread,
      size:     10 + Math.random() * 8,
      sway:     20 + Math.random() * 50,
      duration: 1.8 + Math.random() * 1.8,
      delay:    Math.random() * 0.9,
      spin:     (Math.random() - 0.5) * 360,
    }))

    setCherries(prev => [...prev, ...batch])
    setTimeout(() => {
      const ids = new Set(batch.map(c => c.id))
      setCherries(prev => prev.filter(c => !ids.has(c.id)))
    }, 5000)
  }, [])

  return (
    <section className="hero-section">
      {/* Falling cherries */}
      {cherries.map(c => (
        <div
          key={c.id}
          className="hero-cherry"
          style={{
            left:              `${c.x}%`,
            width:             c.size,
            height:            c.size,
            '--sway':          `${c.sway}px`,
            '--spin':          `${c.spin}deg`,
            animationDuration: `${c.duration}s`,
            animationDelay:    `${c.delay}s`,
          } as React.CSSProperties}
        />
      ))}

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

      {/* Cherry tree — click to drop cherries */}
      <div
        ref={treeRef}
        className="hero-tree-block"
        onClick={spawnCherries}
        role="button"
        aria-label="Click to drop cherries"
      >
        <div className="hero-tree-hint">Click the tree ✦</div>
        <CherryTree />
      </div>
    </section>
  )
}

/* ── SVG cherry tree ─────────────────────────────────────────────────── */
function CherryTree() {
  return (
    <svg
      viewBox="0 0 520 560"
      xmlns="http://www.w3.org/2000/svg"
      className="hero-tree-svg"
      aria-hidden="true"
    >
      {/* Ground */}
      <ellipse cx="260" cy="528" rx="195" ry="26" fill="#A8D86E"/>
      <ellipse cx="260" cy="528" rx="170" ry="18" fill="#B8E87E"/>

      {/* Root flares */}
      <path d="M230 520 C220 510 215 500 210 488" stroke="#6B3A2A" strokeWidth="10" strokeLinecap="round" fill="none"/>
      <path d="M290 520 C300 510 305 500 310 488" stroke="#6B3A2A" strokeWidth="10" strokeLinecap="round" fill="none"/>

      {/* Trunk */}
      <path d="M235 522 C232 470 238 420 248 370 C254 340 260 310 260 280"
        stroke="#5C2E1A" strokeWidth="38" strokeLinecap="round" fill="none"/>
      <path d="M285 522 C288 470 282 420 272 370 C266 340 260 310 260 280"
        stroke="#5C2E1A" strokeWidth="32" strokeLinecap="round" fill="none"/>
      {/* Trunk highlight */}
      <path d="M248 510 C245 460 250 415 256 370"
        stroke="#8B5A3A" strokeWidth="7" strokeLinecap="round" fill="none" opacity="0.45"/>

      {/* Main branches */}
      <path d="M260 280 C242 252 205 222 168 202" stroke="#5C2E1A" strokeWidth="18" strokeLinecap="round" fill="none"/>
      <path d="M260 280 C278 252 315 222 352 202" stroke="#5C2E1A" strokeWidth="18" strokeLinecap="round" fill="none"/>
      <path d="M260 280 C257 248 254 218 252 192" stroke="#5C2E1A" strokeWidth="15" strokeLinecap="round" fill="none"/>

      {/* Secondary branches */}
      <path d="M168 202 C140 188 110 176  88 165" stroke="#5C2E1A" strokeWidth="11" strokeLinecap="round" fill="none"/>
      <path d="M168 202 C158 178 150 158 146 136" stroke="#5C2E1A" strokeWidth="9"  strokeLinecap="round" fill="none"/>
      <path d="M352 202 C380 188 410 176 432 165" stroke="#5C2E1A" strokeWidth="11" strokeLinecap="round" fill="none"/>
      <path d="M352 202 C362 178 370 158 374 136" stroke="#5C2E1A" strokeWidth="9"  strokeLinecap="round" fill="none"/>
      <path d="M252 192 C248 165 244 140 242 118" stroke="#5C2E1A" strokeWidth="8"  strokeLinecap="round" fill="none"/>
      <path d="M260 280 C270 255 290 235 312 222" stroke="#5C2E1A" strokeWidth="9"  strokeLinecap="round" fill="none"/>

      {/* Leaf canopy — dark back layer */}
      {[
        [88,148,52],[146,118,56],[200,96,60],[252,80,66],[312,92,60],
        [374,118,56],[432,148,52],[455,188,46],[65,188,46],[312,200,42],[210,200,42],
      ].map(([cx,cy,r],i)=>(
        <circle key={`cd-${i}`} cx={cx} cy={cy} r={r} fill="#2E7D32" opacity="0.6"/>
      ))}
      {/* Mid green */}
      {[
        [100,136,48],[155,106,52],[208,84,56],[253,70,62],[314,82,56],
        [366,106,52],[418,136,48],[446,178,42],[78,176,42],[296,185,38],[222,185,38],
      ].map(([cx,cy,r],i)=>(
        <circle key={`cm-${i}`} cx={cx} cy={cy} r={r} fill="#388E3C" opacity="0.85"/>
      ))}
      {/* Front bright green */}
      {[
        [118,126,42],[165,98,46],[218,76,50],[254,62,56],[308,74,50],
        [358,98,46],[402,126,42],[432,165,36],[92,163,36],[283,176,34],[236,174,34],
        [188,118,30],[330,118,30],[254,100,32],
      ].map(([cx,cy,r],i)=>(
        <circle key={`cf-${i}`} cx={cx} cy={cy} r={r} fill="#43A047" opacity="0.7"/>
      ))}

      {/* ── Cherries ── each is a pair of red circles with stems */}
      {[
        [115,148],[155,116],[200,98],[242,82],[272,82],[300,96],
        [340,116],[382,146],[418,168],[92,175],[444,175],
        [165,162],[348,162],[254,120],[228,148],[282,148],
        [140,130],[370,130],[254,146],
      ].map(([cx,cy],i) => {
        const angle  = (i % 5 - 2) * 18   // slight spread
        const rad    = angle * Math.PI / 180
        const ox     = Math.sin(rad) * 12
        const stemH  = 14 + (i % 3) * 4
        return (
          <g key={`ch-${i}`}>
            {/* Stem fork */}
            <line x1={cx} y1={cy} x2={cx - 6} y2={cy + stemH}
              stroke="#2E7D32" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1={cx} y1={cy} x2={cx + 6} y2={cy + stemH}
              stroke="#2E7D32" strokeWidth="1.5" strokeLinecap="round"/>
            {/* Two cherries */}
            <circle cx={cx - 6 + ox * 0.3} cy={cy + stemH + 5} r="6.5" fill="#C62828"/>
            <circle cx={cx + 6 - ox * 0.3} cy={cy + stemH + 5} r="6.5" fill="#B71C1C"/>
            {/* Highlight */}
            <circle cx={cx - 6 + ox * 0.3 - 2} cy={cy + stemH + 3} r="2" fill="#EF5350" opacity="0.6"/>
            <circle cx={cx + 6 - ox * 0.3 - 2} cy={cy + stemH + 3} r="2" fill="#EF5350" opacity="0.6"/>
          </g>
        )
      })}

      {/* Cherries on ground */}
      {[170,210,255,300,345].map((x,i)=>(
        <g key={`gc-${i}`}>
          <circle cx={x} cy={526} r="5.5" fill="#C62828"/>
          <circle cx={x-2} cy={524} r="1.8" fill="#EF5350" opacity="0.5"/>
        </g>
      ))}
    </svg>
  )
}
