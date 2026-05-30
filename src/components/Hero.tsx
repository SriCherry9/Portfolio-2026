import { useState, useEffect, useRef, useCallback } from 'react'

const ROLES = [
  'Interaction Designer',
  'Researcher',
  'Product Manager',
  'AI Generalist',
  'Accessibility Designer',
]

const INITIAL_SHAPES = [
  { id: 'clover',    x: 11,  y: 18 },
  { id: 'squiggle',  x: 78,  y: 12 },
  { id: 'daisy',     x: 9,   y: 58 },
  { id: 'scallop',   x: 76,  y: 50 },
  { id: 'hourglass', x: 44,  y: 72 },
]

interface ShapePos { id: string; x: number; y: number }

export function Hero() {
  const [roleIndex, setRoleIndex] = useState(0)
  const [isExiting, setIsExiting] = useState(false)
  const [displayed, setDisplayed] = useState(ROLES[0])
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // All drag state lives in refs — zero re-renders during move
  const positionsRef = useRef<ShapePos[]>(INITIAL_SHAPES.map(s => ({ ...s })))
  const draggingRef  = useRef<string | null>(null)
  const dragStart    = useRef<{ mx: number; my: number; sx: number; sy: number } | null>(null)

  // Refs to the wrapper DOM nodes so we can move them with style directly
  const nodeRefs = useRef<Record<string, HTMLDivElement | null>>({})

  /* Role ticker */
  useEffect(() => {
    const cycle = () => {
      setIsExiting(true)
      timerRef.current = setTimeout(() => {
        setRoleIndex(prev => {
          const next = (prev + 1) % ROLES.length
          setDisplayed(ROLES[next])
          return next
        })
        setIsExiting(false)
      }, 420)
    }
    const id = setInterval(cycle, 2800)
    return () => { clearInterval(id); if (timerRef.current) clearTimeout(timerRef.current) }
  }, [])

  const onPointerDown = useCallback((e: React.PointerEvent, id: string) => {
    e.preventDefault()
    e.currentTarget.setPointerCapture(e.pointerId)
    draggingRef.current = id
    const pos = positionsRef.current.find(p => p.id === id)!
    dragStart.current = { mx: e.clientX, my: e.clientY, sx: pos.x, sy: pos.y }

    // Add dragging class directly on DOM node
    const node = nodeRefs.current[id]
    if (node) node.classList.add('dragging')
  }, [])

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    const id = draggingRef.current
    if (!id || !dragStart.current) return

    const dx = ((e.clientX - dragStart.current.mx) / window.innerWidth)  * 100
    const dy = ((e.clientY - dragStart.current.my) / window.innerHeight) * 100
    const nx = Math.max(0, Math.min(90, dragStart.current.sx + dx))
    const ny = Math.max(0, Math.min(88, dragStart.current.sy + dy))

    // Update ref position
    const p = positionsRef.current.find(p => p.id === id)!
    p.x = nx
    p.y = ny

    // Move DOM node directly — no React re-render
    const node = nodeRefs.current[id]
    if (node) {
      node.style.left = `${nx}%`
      node.style.top  = `${ny}%`
    }
  }, [])

  const onPointerUp = useCallback(() => {
    const id = draggingRef.current
    if (id) {
      const node = nodeRefs.current[id]
      if (node) node.classList.remove('dragging')
    }
    draggingRef.current = null
    dragStart.current   = null
  }, [])

  const setRef = (id: string) => (el: HTMLDivElement | null) => {
    nodeRefs.current[id] = el
  }

  return (
    <section
      className="dh-section"
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      {/* Purple clover — rotates */}
      <div
        ref={setRef('clover')}
        className="dh-shape-wrap"
        style={{ left: `${INITIAL_SHAPES[0].x}%`, top: `${INITIAL_SHAPES[0].y}%` }}
        onPointerDown={e => onPointerDown(e, 'clover')}
      >
        <svg viewBox="0 0 80 80" width="90" height="90" className="dh-rotate-svg">
          <circle cx="40" cy="22" r="18" fill="#C49DD8"/>
          <circle cx="40" cy="58" r="18" fill="#C49DD8"/>
          <circle cx="22" cy="40" r="18" fill="#C49DD8"/>
          <circle cx="58" cy="40" r="18" fill="#C49DD8"/>
        </svg>
      </div>

      {/* Purple squiggle — noodle wiggle */}
      <div
        ref={setRef('squiggle')}
        className="dh-shape-wrap"
        style={{ left: `${INITIAL_SHAPES[1].x}%`, top: `${INITIAL_SHAPES[1].y}%` }}
        onPointerDown={e => onPointerDown(e, 'squiggle')}
      >
        <svg viewBox="0 0 60 110" width="55" height="100" className="dh-noodle-svg">
          <path
            d="M30 8 C52 8 52 32 30 38 C8 44 8 68 30 74 C52 80 52 100 30 102"
            fill="none" stroke="#C49DD8" strokeWidth="14" strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Teal daisy — fast spin */}
      <div
        ref={setRef('daisy')}
        className="dh-shape-wrap"
        style={{ left: `${INITIAL_SHAPES[2].x}%`, top: `${INITIAL_SHAPES[2].y}%` }}
        onPointerDown={e => onPointerDown(e, 'daisy')}
      >
        <svg viewBox="0 0 100 100" width="105" height="105" className="dh-spin-svg">
          {[0,45,90,135].map(a => (
            <ellipse key={a} cx="50" cy="50" rx="10" ry="32" fill="#4A9B7F"
              transform={`rotate(${a} 50 50)`}/>
          ))}
          <circle cx="50" cy="50" r="10" fill="#4A9B7F"/>
        </svg>
      </div>

      {/* Blue scalloped circle — slow rotate */}
      <div
        ref={setRef('scallop')}
        className="dh-shape-wrap"
        style={{ left: `${INITIAL_SHAPES[3].x}%`, top: `${INITIAL_SHAPES[3].y}%` }}
        onPointerDown={e => onPointerDown(e, 'scallop')}
      >
        <svg viewBox="0 0 100 100" width="100" height="100" className="dh-rotate-slow-svg">
          <path d={scallop(50, 50, 36, 24)} fill="#2B62E8"/>
        </svg>
      </div>

      {/* Dark teal hourglass — float + bob */}
      <div
        ref={setRef('hourglass')}
        className="dh-shape-wrap dh-float-b"
        style={{ left: `${INITIAL_SHAPES[4].x}%`, top: `${INITIAL_SHAPES[4].y}%`, animationDelay: '1.2s' }}
        onPointerDown={e => onPointerDown(e, 'hourglass')}
      >
        <svg viewBox="0 0 70 110" width="65" height="100">
          <path d="M10 5 L60 5 Q60 5 38 52 Q60 99 60 105 L10 105 Q10 105 32 52 Q10 5 10 5 Z"
            fill="#1B5252"/>
        </svg>
      </div>

      {/* ── Centre text ── */}
      <div className="dh-center">
        <h1 className="dh-name">
          <span className="dh-name-sri">Sri&nbsp;</span>
          <span className="dh-crescent" aria-label="C">C</span>
          <span className="dh-name-rest">herry&nbsp;</span>
          <span className="dh-name-last">Kotamreddy</span>
        </h1>

        <div className="dh-role-row">
          <span className="dh-role-label">I design as a&nbsp;</span>
          <div className="dh-role-ticker">
            <span key={roleIndex} className={`dh-role-slide${isExiting ? ' exiting' : ''}`}>
              {displayed}
            </span>
          </div>
        </div>

        <p className="dh-bio">
          Crafting intuitive interfaces at the intersection of research, interaction & AI.
        </p>
      </div>
    </section>
  )
}

function scallop(cx: number, cy: number, r: number, petals: number): string {
  const step = (Math.PI * 2) / (petals * 2)
  return Array.from({ length: petals * 2 }, (_, i) => {
    const angle  = i * step - Math.PI / 2
    const radius = i % 2 === 0 ? r : r * 0.78
    const x = cx + radius * Math.cos(angle)
    const y = cy + radius * Math.sin(angle)
    return (i === 0 ? 'M' : 'L') + `${x},${y}`
  }).join(' ') + ' Z'
}
