import { useState, useEffect, useRef } from 'react'
import Matter from 'matter-js'

const ROLES = [
  'Interaction Designer',
  'Researcher',
  'Product Manager',
  'AI Generalist',
  'Accessibility Designer',
]

// Shape definitions — id, approximate radius for physics body, SVG render size
const SHAPES = [
  { id: 'clover',    r: 44,  w: 90,  h: 90  },
  { id: 'squiggle',  r: 28,  w: 55,  h: 100 },
  { id: 'daisy',     r: 46,  w: 105, h: 105 },
  { id: 'scallop',   r: 44,  w: 100, h: 100 },
  { id: 'hourglass', r: 34,  w: 65,  h: 100 },
]

export function Hero() {
  const [roleIndex, setRoleIndex] = useState(0)
  const [isExiting, setIsExiting] = useState(false)
  const [displayed, setDisplayed] = useState(ROLES[0])
  const timerRef   = useRef<ReturnType<typeof setTimeout> | null>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const nodeRefs   = useRef<Record<string, HTMLDivElement | null>>({})
  const engineRef  = useRef<Matter.Engine | null>(null)
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

  /* Physics */
  useEffect(() => {
    const section = sectionRef.current!
    const W = section.offsetWidth
    const H = section.offsetHeight

    const { Engine, Runner, Bodies, Body,
            Mouse, MouseConstraint, Composite, World } = Matter

    const engine = Engine.create({ gravity: { x: 0, y: 1.2 } })
    engineRef.current = engine
    const world  = engine.world

    // Walls: floor, left, right, ceiling
    const wallOpts = { isStatic: true, restitution: 0.6, friction: 0.1 }
    const floor   = Bodies.rectangle(W/2, H + 30, W * 2, 60, wallOpts)
    const wallL   = Bodies.rectangle(-30, H/2, 60, H * 2, wallOpts)
    const wallR   = Bodies.rectangle(W + 30, H/2, 60, H * 2, wallOpts)
    const ceiling = Bodies.rectangle(W/2, -30, W * 2, 60, wallOpts)
    Composite.add(world, [floor, wallL, wallR, ceiling])

    // Create one circular physics body per shape, spread across top
    const bodies: Matter.Body[] = []
    SHAPES.forEach((s, i) => {
      const x = (W / (SHAPES.length + 1)) * (i + 1)
      const y = -60 - i * 80  // stagger drop-in
      const b = Bodies.circle(x, y, s.r, {
        restitution: 0.55,
        friction: 0.08,
        frictionAir: 0.012,
        label: s.id,
        density: 0.002,
      })
      bodies.push(b)
    })
    Composite.add(world, bodies)

    // Mouse constraint — drag shapes
    const mouse = Mouse.create(section)
    const mc = MouseConstraint.create(engine, {
      mouse,
      constraint: { stiffness: 0.18, render: { visible: false } },
    })
    Composite.add(world, mc)

    // rAF loop — sync DOM nodes to physics bodies
    const runner = Runner.create()
    Runner.run(runner, engine)

    const syncDOM = () => {
      bodies.forEach(b => {
        const node = nodeRefs.current[b.label]
        if (!node) return
        const { x, y } = b.position
        const angle = b.angle
        node.style.transform = `translate(${x}px, ${y}px) rotate(${angle}rad) translate(-50%, -50%)`
      })
      rafRef.current = requestAnimationFrame(syncDOM)
    }
    rafRef.current = requestAnimationFrame(syncDOM)

    // Resize: rebuild walls
    const onResize = () => {
      const nW = section.offsetWidth
      const nH = section.offsetHeight
      Body.setPosition(floor,   { x: nW/2, y: nH + 30 })
      Body.setPosition(wallR,   { x: nW + 30, y: nH/2 })
      Body.setPosition(ceiling, { x: nW/2, y: -30 })
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(rafRef.current!)
      Runner.stop(runner)
      Engine.clear(engine)
      World.clear(world, false)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <section ref={sectionRef} className="dh-section" style={{ position: 'relative', overflow: 'hidden' }}>

      {/* Physics shapes — positioned via Matter.js transform, origin at center */}
      <div ref={el => { nodeRefs.current['clover'] = el }} className="dh-shape-wrap" style={{ position: 'absolute', top: 0, left: 0, willChange: 'transform' }}>
        <svg viewBox="0 0 80 80" width="90" height="90" className="dh-rotate-svg">
          <circle cx="40" cy="22" r="18" fill="#C49DD8"/>
          <circle cx="40" cy="58" r="18" fill="#C49DD8"/>
          <circle cx="22" cy="40" r="18" fill="#C49DD8"/>
          <circle cx="58" cy="40" r="18" fill="#C49DD8"/>
        </svg>
      </div>

      <div ref={el => { nodeRefs.current['squiggle'] = el }} className="dh-shape-wrap" style={{ position: 'absolute', top: 0, left: 0, willChange: 'transform' }}>
        <svg viewBox="0 0 60 110" width="55" height="100" className="dh-noodle-svg">
          <path d="M30 8 C52 8 52 32 30 38 C8 44 8 68 30 74 C52 80 52 100 30 102"
            fill="none" stroke="#C49DD8" strokeWidth="14" strokeLinecap="round"/>
        </svg>
      </div>

      <div ref={el => { nodeRefs.current['daisy'] = el }} className="dh-shape-wrap" style={{ position: 'absolute', top: 0, left: 0, willChange: 'transform' }}>
        <svg viewBox="0 0 100 100" width="105" height="105" className="dh-spin-svg">
          {[0,45,90,135].map(a => (
            <ellipse key={a} cx="50" cy="50" rx="10" ry="32" fill="#4A9B7F"
              transform={`rotate(${a} 50 50)`}/>
          ))}
          <circle cx="50" cy="50" r="10" fill="#4A9B7F"/>
        </svg>
      </div>

      <div ref={el => { nodeRefs.current['scallop'] = el }} className="dh-shape-wrap" style={{ position: 'absolute', top: 0, left: 0, willChange: 'transform' }}>
        <svg viewBox="0 0 100 100" width="100" height="100" className="dh-rotate-slow-svg">
          <path d={scallop(50, 50, 36, 24)} fill="#2B62E8"/>
        </svg>
      </div>

      <div ref={el => { nodeRefs.current['hourglass'] = el }} className="dh-shape-wrap" style={{ position: 'absolute', top: 0, left: 0, willChange: 'transform' }}>
        <svg viewBox="0 0 70 110" width="65" height="100">
          <path d="M10 5 L60 5 Q60 5 38 52 Q60 99 60 105 L10 105 Q10 105 32 52 Q10 5 10 5 Z"
            fill="#1B5252"/>
        </svg>
      </div>

      {/* Centre text — sits above physics layer */}
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
