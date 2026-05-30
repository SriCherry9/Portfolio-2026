import { useState, useEffect, useRef } from 'react'
import Matter from 'matter-js'

const ROLES = [
  'Interaction Designer',
  'Researcher',
  'Product Manager',
  'AI Generalist',
  'Accessibility Designer',
]

const SHAPES = [
  { id: 'clover',    r: 42, w: 90,  h: 90  },
  { id: 'squiggle',  r: 26, w: 55,  h: 100 },
  { id: 'daisy',     r: 44, w: 105, h: 105 },
  { id: 'scallop',   r: 42, w: 100, h: 100 },
  { id: 'hourglass', r: 32, w: 65,  h: 100 },
]

export function Hero() {
  const [roleIndex, setRoleIndex] = useState(0)
  const [isExiting, setIsExiting] = useState(false)
  const [displayed, setDisplayed] = useState(ROLES[0])
  const timerRef   = useRef<ReturnType<typeof setTimeout> | null>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const nodeRefs   = useRef<Record<string, HTMLDivElement | null>>({})
  const rafRef     = useRef<number | undefined>(undefined)

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

  /* Matter.js physics */
  useEffect(() => {
    const section = sectionRef.current!
    // Use actual measured dimensions after layout
    const getW = () => section.getBoundingClientRect().width  || window.innerWidth
    const getH = () => section.getBoundingClientRect().height || window.innerHeight

    const { Engine, Runner, Bodies, Body, Mouse, MouseConstraint, Composite, World } = Matter

    const engine = Engine.create({ gravity: { x: 0, y: 1.5 } })
    const world  = engine.world

    const THICK = 60
    const buildWalls = (W: number, H: number) => [
      Bodies.rectangle(W / 2, H + THICK / 2, W * 3, THICK, { isStatic: true, label: 'floor',   restitution: 0.5, friction: 0.3 }),
      Bodies.rectangle(-THICK / 2, H / 2, THICK, H * 3,     { isStatic: true, label: 'wallL',   restitution: 0.5, friction: 0.1 }),
      Bodies.rectangle(W + THICK / 2, H / 2, THICK, H * 3,  { isStatic: true, label: 'wallR',   restitution: 0.5, friction: 0.1 }),
    ]

    let W = getW(), H = getH()
    const walls = buildWalls(W, H)
    Composite.add(world, walls)

    // Spawn shapes near the top, spread horizontally, staggered
    const bodies = SHAPES.map((s, i) => {
      const x = (W / (SHAPES.length + 1)) * (i + 1)
      const y = 60 + i * 30  // start near top, staggered
      return Bodies.circle(x, y, s.r, {
        label:      s.id,
        restitution: 0.6,
        friction:    0.05,
        frictionAir: 0.010,
        density:     0.0015,
      })
    })
    Composite.add(world, bodies)

    // Mouse drag
    const mouse = Mouse.create(section)
    // Fix scroll offset for mouse position
    mouse.element.removeEventListener('mousewheel', (mouse as any).mousewheel)
    mouse.element.removeEventListener('DOMMouseScroll', (mouse as any).mousewheel)
    const mc = MouseConstraint.create(engine, {
      mouse,
      constraint: { stiffness: 0.2, render: { visible: false } },
    })
    Composite.add(world, mc)

    // rAF loop: sync DOM nodes to physics bodies
    const runner = Runner.create()
    Runner.run(runner, engine)

    const syncDOM = () => {
      for (const b of bodies) {
        const node = nodeRefs.current[b.label]
        if (!node) continue
        const { x, y } = b.position
        const hw = b.label === 'squiggle' ? 27.5 : b.label === 'hourglass' ? 32.5 : 50
        const hh = b.label === 'squiggle' ? 50   : b.label === 'hourglass' ? 50   :
                   b.label === 'daisy'    ? 52.5  : 50
        node.style.transform = `translate(${x - hw}px, ${y - hh}px) rotate(${b.angle}rad)`
      }
      rafRef.current = requestAnimationFrame(syncDOM)
    }
    rafRef.current = requestAnimationFrame(syncDOM)

    // Resize: reposition walls
    const onResize = () => {
      W = getW(); H = getH()
      const [floor, wallL, wallR] = walls
      Body.setPosition(floor, { x: W / 2,          y: H + THICK / 2 })
      Body.setPosition(wallL, { x: -THICK / 2,      y: H / 2 })
      Body.setPosition(wallR, { x: W + THICK / 2,   y: H / 2 })
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(rafRef.current!)
      Runner.stop(runner)
      World.clear(world, false)
      Engine.clear(engine)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <section ref={sectionRef} className="dh-section">

      {SHAPES.map(s => (
        <div
          key={s.id}
          ref={el => { nodeRefs.current[s.id] = el }}
          className="dh-shape-wrap"
          style={{ position: 'absolute', top: 0, left: 0, willChange: 'transform' }}
        >
          {s.id === 'clover' && (
            <svg viewBox="0 0 80 80" width="90" height="90" className="dh-rotate-svg">
              <circle cx="40" cy="22" r="18" fill="#C49DD8"/>
              <circle cx="40" cy="58" r="18" fill="#C49DD8"/>
              <circle cx="22" cy="40" r="18" fill="#C49DD8"/>
              <circle cx="58" cy="40" r="18" fill="#C49DD8"/>
            </svg>
          )}
          {s.id === 'squiggle' && (
            <svg viewBox="0 0 60 110" width="55" height="100" className="dh-noodle-svg">
              <path d="M30 8 C52 8 52 32 30 38 C8 44 8 68 30 74 C52 80 52 100 30 102"
                fill="none" stroke="#C49DD8" strokeWidth="14" strokeLinecap="round"/>
            </svg>
          )}
          {s.id === 'daisy' && (
            <svg viewBox="0 0 100 100" width="105" height="105" className="dh-spin-svg">
              {[0,45,90,135].map(a => (
                <ellipse key={a} cx="50" cy="50" rx="10" ry="32" fill="#4A9B7F"
                  transform={`rotate(${a} 50 50)`}/>
              ))}
              <circle cx="50" cy="50" r="10" fill="#4A9B7F"/>
            </svg>
          )}
          {s.id === 'scallop' && (
            <svg viewBox="0 0 100 100" width="100" height="100" className="dh-rotate-slow-svg">
              <path d={scallop(50, 50, 36, 24)} fill="#2B62E8"/>
            </svg>
          )}
          {s.id === 'hourglass' && (
            <svg viewBox="0 0 70 110" width="65" height="100">
              <path d="M10 5 L60 5 Q60 5 38 52 Q60 99 60 105 L10 105 Q10 105 32 52 Q10 5 10 5 Z"
                fill="#1B5252"/>
            </svg>
          )}
        </div>
      ))}

      {/* Centre text — above physics layer, pointer-events off so mouse drag works on shapes */}
      <div className="dh-center" style={{ position: 'relative', zIndex: 4, pointerEvents: 'none' }}>
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
