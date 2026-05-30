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
  // existing
  { id: 'clover',          r: 42, w: 90,  h: 90  },
  { id: 'squiggle',        r: 26, w: 55,  h: 100 },
  { id: 'daisy',           r: 44, w: 105, h: 105 },
  { id: 'scallop',         r: 42, w: 100, h: 100 },
  { id: 'hourglass',       r: 32, w: 65,  h: 100 },
  // new
  { id: 'teal-sunflower',  r: 44, w: 95,  h: 95  },
  { id: 'lavender-blob',   r: 44, w: 95,  h: 95  },
  { id: 'blue-starburst',  r: 44, w: 95,  h: 95  },
  { id: 'yellow-flower',   r: 40, w: 88,  h: 88  },
  { id: 'orange-wave',     r: 28, w: 58,  h: 108 },
  { id: 'lavender-petals', r: 40, w: 88,  h: 88  },
  { id: 'blue-asterisk',   r: 38, w: 84,  h: 84  },
  { id: 'teal-vase',       r: 32, w: 68,  h: 108 },
  { id: 'blue-sparkle',    r: 44, w: 95,  h: 95  },
  { id: 'teal-star',       r: 42, w: 90,  h: 90  },
  { id: 'yellow-vase',     r: 30, w: 64,  h: 105 },
  { id: 'yellow-sparkle',  r: 40, w: 90,  h: 90  },
  { id: 'orange-daisy',    r: 42, w: 90,  h: 90  },
  { id: 'blue-column',     r: 28, w: 58,  h: 108 },
]

const shapeMap = Object.fromEntries(SHAPES.map(s => [s.id, s]))

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
    const getW = () => section.getBoundingClientRect().width  || window.innerWidth
    const getH = () => section.getBoundingClientRect().height || window.innerHeight

    const { Engine, Runner, Bodies, Body, Mouse, MouseConstraint, Composite, World } = Matter

    const engine = Engine.create({ gravity: { x: 0, y: 1.5 } })
    const world  = engine.world

    const THICK = 60
    const buildWalls = (W: number, H: number) => [
      Bodies.rectangle(W / 2, H + THICK / 2, W * 3, THICK, { isStatic: true, label: 'floor',  restitution: 0.5, friction: 0.3 }),
      Bodies.rectangle(-THICK / 2, H / 2, THICK, H * 3,    { isStatic: true, label: 'wallL',  restitution: 0.5, friction: 0.1 }),
      Bodies.rectangle(W + THICK / 2, H / 2, THICK, H * 3, { isStatic: true, label: 'wallR',  restitution: 0.5, friction: 0.1 }),
    ]

    let W = getW(), H = getH()
    const walls = buildWalls(W, H)
    Composite.add(world, walls)

    const bodies = SHAPES.map((s, i) => {
      const x = (W / (SHAPES.length + 1)) * (i + 1)
      const y = 40 + (i % 6) * 28
      return Bodies.circle(x, y, s.r, {
        label:       s.id,
        restitution: 0.55,
        friction:    0.05,
        frictionAir: 0.010,
        density:     0.0015,
      })
    })
    Composite.add(world, bodies)

    const mouse = Mouse.create(section)
    mouse.element.removeEventListener('mousewheel', (mouse as any).mousewheel)
    mouse.element.removeEventListener('DOMMouseScroll', (mouse as any).mousewheel)
    const mc = MouseConstraint.create(engine, {
      mouse,
      constraint: { stiffness: 0.2, render: { visible: false } },
    })
    Composite.add(world, mc)

    const runner = Runner.create()
    Runner.run(runner, engine)

    const syncDOM = () => {
      for (const b of bodies) {
        const node = nodeRefs.current[b.label]
        if (!node) continue
        const s  = shapeMap[b.label]
        const hw = s.w / 2
        const hh = s.h / 2
        const { x, y } = b.position
        node.style.transform = `translate(${x - hw}px, ${y - hh}px) rotate(${b.angle}rad)`
      }
      rafRef.current = requestAnimationFrame(syncDOM)
    }
    rafRef.current = requestAnimationFrame(syncDOM)

    const onResize = () => {
      W = getW(); H = getH()
      const [floor, wallL, wallR] = walls
      Body.setPosition(floor, { x: W / 2,        y: H + THICK / 2 })
      Body.setPosition(wallL, { x: -THICK / 2,    y: H / 2 })
      Body.setPosition(wallR, { x: W + THICK / 2, y: H / 2 })
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
          {renderShape(s.id)}
        </div>
      ))}

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

/* ── Shape SVGs ───────────────────────────────────────────────────────────── */

function renderShape(id: string) {
  switch (id) {

    /* ── Original 5 ── */

    case 'clover':
      return (
        <svg viewBox="0 0 80 80" width="90" height="90" className="dh-rotate-svg">
          <circle cx="40" cy="22" r="18" fill="#C49DD8"/>
          <circle cx="40" cy="58" r="18" fill="#C49DD8"/>
          <circle cx="22" cy="40" r="18" fill="#C49DD8"/>
          <circle cx="58" cy="40" r="18" fill="#C49DD8"/>
        </svg>
      )

    case 'squiggle':
      return (
        <svg viewBox="0 0 60 110" width="55" height="100" className="dh-noodle-svg">
          <path d="M30 8 C52 8 52 32 30 38 C8 44 8 68 30 74 C52 80 52 100 30 102"
            fill="none" stroke="#C49DD8" strokeWidth="14" strokeLinecap="round"/>
        </svg>
      )

    case 'daisy':
      return (
        <svg viewBox="0 0 100 100" width="105" height="105" className="dh-spin-svg">
          {[0,45,90,135].map(a => (
            <ellipse key={a} cx="50" cy="50" rx="10" ry="32" fill="#4A9B7F"
              transform={`rotate(${a} 50 50)`}/>
          ))}
          <circle cx="50" cy="50" r="10" fill="#4A9B7F"/>
        </svg>
      )

    case 'scallop':
      return (
        <svg viewBox="0 0 100 100" width="100" height="100" className="dh-rotate-slow-svg">
          <path d={starPath(50, 50, 46, 36, 24)} fill="#2B62E8"/>
        </svg>
      )

    case 'hourglass':
      return (
        <svg viewBox="0 0 70 110" width="65" height="100">
          <path d="M10 5 L60 5 Q60 5 38 52 Q60 99 60 105 L10 105 Q10 105 32 52 Q10 5 10 5 Z"
            fill="#1B5252"/>
        </svg>
      )

    /* ── New shapes ── */

    /* Teal 12-petal sunflower */
    case 'teal-sunflower':
      return (
        <svg viewBox="0 0 100 100" width="95" height="95" className="dh-rotate-slow-svg">
          {[0,30,60,90,120,150,180,210,240,270,300,330].map(a => (
            <ellipse key={a} cx="50" cy="24" rx="8" ry="16" fill="#4A9B7F"
              transform={`rotate(${a} 50 50)`}/>
          ))}
          <circle cx="50" cy="50" r="26" fill="#4A9B7F"/>
        </svg>
      )

    /* Lavender 8-petal rounded blob */
    case 'lavender-blob':
      return (
        <svg viewBox="0 0 100 100" width="95" height="95" className="dh-spin-svg">
          {[0,45,90,135,180,225,270,315].map(a => (
            <circle key={a}
              cx={50 + 26 * Math.cos(a * Math.PI / 180)}
              cy={50 + 26 * Math.sin(a * Math.PI / 180)}
              r="18" fill="#D4BFEC"/>
          ))}
          <circle cx="50" cy="50" r="28" fill="#D4BFEC"/>
        </svg>
      )

    /* Dark navy 20-point spiky starburst */
    case 'blue-starburst':
      return (
        <svg viewBox="0 0 100 100" width="95" height="95" className="dh-rotate-svg">
          <path d={starPath(50, 50, 46, 26, 20)} fill="#1B4B6B"/>
        </svg>
      )

    /* Yellow 5-petal flower */
    case 'yellow-flower':
      return (
        <svg viewBox="0 0 100 100" width="88" height="88" className="dh-rotate-slow-svg">
          {[270,342,54,126,198].map(a => (
            <circle key={a}
              cx={50 + 24 * Math.cos(a * Math.PI / 180)}
              cy={50 + 24 * Math.sin(a * Math.PI / 180)}
              r="22" fill="#F5D47E"/>
          ))}
          <circle cx="50" cy="50" r="22" fill="#F5D47E"/>
        </svg>
      )

    /* Orange wavy column */
    case 'orange-wave':
      return (
        <svg viewBox="0 0 60 110" width="58" height="108" className="dh-noodle-svg">
          <path d="
            M14,5 L46,5
            C46,18 54,26 46,36
            C38,46 54,54 46,64
            C38,74 54,82 46,92
            L46,106 L14,106
            C14,92 22,82 14,72
            C6,62 22,54 14,44
            C6,34 22,26 14,18
            Z"
            fill="#E8694A"/>
        </svg>
      )

    /* Lavender 8 pointed petals (elongated ellipses) */
    case 'lavender-petals':
      return (
        <svg viewBox="0 0 100 100" width="88" height="88" className="dh-rotate-svg">
          {[0,45,90,135,180,225,270,315].map(a => (
            <ellipse key={a} cx="50" cy="50" rx="9" ry="38" fill="#C9B4E8"
              transform={`rotate(${a} 50 50)`}/>
          ))}
          <circle cx="50" cy="50" r="18" fill="#C9B4E8"/>
        </svg>
      )

    /* Blue 6-bar asterisk */
    case 'blue-asterisk':
      return (
        <svg viewBox="0 0 100 100" width="84" height="84" className="dh-spin-svg">
          {[0,30,60,90,120,150].map(a => (
            <rect key={a} x="44" y="12" width="12" height="76" rx="4" fill="#2B62E8"
              transform={`rotate(${a} 50 50)`}/>
          ))}
        </svg>
      )

    /* Dark teal wavy vase */
    case 'teal-vase':
      return (
        <svg viewBox="0 0 70 110" width="68" height="108">
          <path d="
            M8,5 L62,5
            Q58,20 46,28
            Q62,42 46,56
            Q62,70 62,90
            Q62,106 35,106
            Q8,106 8,90
            Q8,70 24,56
            Q8,42 24,28
            Q12,20 8,5 Z"
            fill="#1B5252"/>
        </svg>
      )

    /* Blue 8-point sharp sparkle star */
    case 'blue-sparkle':
      return (
        <svg viewBox="0 0 100 100" width="95" height="95" className="dh-rotate-slow-svg">
          <path d={starPath(50, 50, 46, 10, 8)} fill="#2B62E8"/>
        </svg>
      )

    /* Teal 9-point star */
    case 'teal-star':
      return (
        <svg viewBox="0 0 100 100" width="90" height="90" className="dh-rotate-svg">
          <path d={starPath(50, 50, 46, 26, 9)} fill="#4A9B7F"/>
        </svg>
      )

    /* Yellow wavy vase with scalloped sides */
    case 'yellow-vase':
      return (
        <svg viewBox="0 0 65 105" width="64" height="105">
          <path d="
            M6,5 L59,5
            Q54,16 46,22 Q54,30 46,38 Q54,46 46,54
            Q54,62 59,72
            Q59,100 32,100
            Q6,100 6,72
            Q11,62 19,54 Q11,46 19,38 Q11,30 19,22 Q11,16 6,5 Z"
            fill="#F5D47E"/>
        </svg>
      )

    /* Yellow 4-point sparkle */
    case 'yellow-sparkle':
      return (
        <svg viewBox="0 0 100 100" width="90" height="90" className="dh-rotate-slow-svg">
          <path d={starPath(50, 50, 46, 8, 4)} fill="#F5D47E"/>
        </svg>
      )

    /* Orange/coral 9-petal rounded daisy */
    case 'orange-daisy':
      return (
        <svg viewBox="0 0 100 100" width="90" height="90" className="dh-spin-svg">
          {[0,40,80,120,160,200,240,280,320].map(a => (
            <ellipse key={a} cx="50" cy="22" rx="10" ry="20" fill="#E8694A"
              transform={`rotate(${a} 50 50)`}/>
          ))}
          <circle cx="50" cy="50" r="22" fill="#E8694A"/>
        </svg>
      )

    /* Blue narrow column with scalloped/tooth sides */
    case 'blue-column':
      return (
        <svg viewBox="0 0 60 110" width="58" height="108">
          <path d="
            M14,5 L46,5
            Q46,14 38,18 Q46,22 38,26 Q46,30 38,34
            Q46,38 38,42 Q46,46 38,50
            Q46,54 38,58 Q46,62 38,66
            Q46,70 38,74 Q46,78 38,82
            Q46,86 38,90 Q46,94 46,105
            L14,105
            Q14,94 22,90 Q14,86 22,82 Q14,78 22,74
            Q14,70 22,66 Q14,62 22,58
            Q14,54 22,50 Q14,46 22,42
            Q14,38 22,34 Q14,30 22,26
            Q14,22 22,18 Q14,14 14,5 Z"
            fill="#2B62E8"/>
        </svg>
      )

    default:
      return null
  }
}

/* ── Path helpers ─────────────────────────────────────────────────────────── */

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
