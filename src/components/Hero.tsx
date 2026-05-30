import { useState, useEffect, useRef, useCallback } from 'react'

const ROLES = [
  'Interaction Designer',
  'Researcher',
  'Product Manager',
  'AI Generalist',
  'Accessibility Designer',
]

/* Starting positions as % of viewport */
const INITIAL_SHAPES = [
  { id: 'clover',    x: 11,  y: 18 },
  { id: 'squiggle',  x: 78,  y: 12 },
  { id: 'daisy',     x: 9,   y: 58 },
  { id: 'scallop',   x: 76,  y: 50 },
  { id: 'hourglass', x: 44,  y: 72 },
]

interface ShapePos { id: string; x: number; y: number }

export function Hero() {
  const [roleIndex, setRoleIndex]   = useState(0)
  const [isExiting, setIsExiting]   = useState(false)
  const [displayed, setDisplayed]   = useState(ROLES[0])
  const [positions, setPositions]   = useState<ShapePos[]>(INITIAL_SHAPES)
  const [dragging, setDragging]     = useState<string | null>(null)
  const dragStart = useRef<{ mx: number; my: number; sx: number; sy: number } | null>(null)
  const timerRef  = useRef<ReturnType<typeof setTimeout> | null>(null)

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

  /* Drag handlers */
  const onPointerDown = useCallback((e: React.PointerEvent, id: string) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    setDragging(id)
    const pos = positions.find(p => p.id === id)!
    dragStart.current = {
      mx: e.clientX, my: e.clientY,
      sx: pos.x,     sy: pos.y,
    }
  }, [positions])

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging || !dragStart.current) return
    const dx = ((e.clientX - dragStart.current.mx) / window.innerWidth)  * 100
    const dy = ((e.clientY - dragStart.current.my) / window.innerHeight) * 100
    setPositions(prev => prev.map(p =>
      p.id === dragging
        ? { ...p, x: Math.max(0, Math.min(90, dragStart.current!.sx + dx)),
                  y: Math.max(0, Math.min(88, dragStart.current!.sy + dy)) }
        : p
    ))
  }, [dragging])

  const onPointerUp = useCallback(() => {
    setDragging(null)
    dragStart.current = null
  }, [])

  const pos = (id: string) => positions.find(p => p.id === id)!

  return (
    <section
      className="dh-section"
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      {/* ── Draggable shapes ──────────────────────────────────────── */}

      {/* Purple clover — rotates */}
      <div
        className={`dh-shape-wrap${dragging === 'clover' ? ' dragging' : ''}`}
        style={{ left: `${pos('clover').x}%`, top: `${pos('clover').y}%` }}
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
        className={`dh-shape-wrap${dragging === 'squiggle' ? ' dragging' : ''}`}
        style={{ left: `${pos('squiggle').x}%`, top: `${pos('squiggle').y}%` }}
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
        className={`dh-shape-wrap${dragging === 'daisy' ? ' dragging' : ''}`}
        style={{ left: `${pos('daisy').x}%`, top: `${pos('daisy').y}%` }}
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
        className={`dh-shape-wrap${dragging === 'scallop' ? ' dragging' : ''}`}
        style={{ left: `${pos('scallop').x}%`, top: `${pos('scallop').y}%` }}
        onPointerDown={e => onPointerDown(e, 'scallop')}
      >
        <svg viewBox="0 0 100 100" width="100" height="100" className="dh-rotate-slow-svg">
          <path d={scallop(50, 50, 36, 24)} fill="#2B62E8"/>
        </svg>
      </div>

      {/* Dark teal hourglass — float + bob */}
      <div
        className={`dh-shape-wrap dh-float-b${dragging === 'hourglass' ? ' dragging' : ''}`}
        style={{ left: `${pos('hourglass').x}%`, top: `${pos('hourglass').y}%`, animationDelay: '1.2s' }}
        onPointerDown={e => onPointerDown(e, 'hourglass')}
      >
        <svg viewBox="0 0 70 110" width="65" height="100">
          <path d="M10 5 L60 5 Q60 5 38 52 Q60 99 60 105 L10 105 Q10 105 32 52 Q10 5 10 5 Z"
            fill="#1B5252"/>
        </svg>
      </div>

      {/* ── Centre text ─────────────────────────────────────────── */}
      <div className="dh-center">
        <span className="dh-pre">Sri</span>
        <h1 className="dh-name">
          {/* Orange C — thick arc, same height as text, spins */}
          <span className="dh-crescent" aria-hidden="true">
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"
              className="dh-crescent-svg" style={{ overflow: 'visible' }}>
              {/* Thick arc: outer r=46, inner r=28, open on the right ~60° */}
              <path
                d="
                  M 73,27
                  A 46,46 0 1,0 73,73
                  L 60,73
                  A 32,32 0 1,1 60,27
                  Z
                "
                fill="#E8694A"
              />
            </svg>
          </span>
          <span className="dh-name-rest">herry</span>
        </h1>
        <span className="dh-last">Kotamreddy</span>
        <div className="dh-role-row">
          <div className="dh-role-ticker">
            <span key={roleIndex} className={`dh-role-slide${isExiting ? ' exiting' : ''}`}>
              {displayed}
            </span>
          </div>
        </div>
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
