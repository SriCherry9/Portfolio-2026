import { useRef, useState, useEffect } from 'react'

interface PlayItem {
  id: number
  title: string
  desc: string
  x: number
  y: number
  width: number
  height: number
  visualStyle: React.CSSProperties
  label?: string
  labelStyle?: React.CSSProperties
}

const ITEMS: PlayItem[] = [
  // ── Row 1 (y ≈ 60) — spans full viewport width ────────────────
  {
    id: 1,
    title: 'Gradient Study No. 01',
    desc: 'Exploring warm hue transitions and color theory',
    x: 60, y: 70, width: 310, height: 230,
    visualStyle: { background: 'linear-gradient(145deg, #ffecd2 0%, #fcb69f 50%, #f6a09a 100%)' },
  },
  {
    id: 2,
    title: 'Violet Hour',
    desc: 'Portrait study — digital painting series',
    x: 420, y: 50, width: 210, height: 310,
    visualStyle: { background: 'linear-gradient(180deg, #5c3d8f 0%, #a855f7 40%, #ec4899 100%)' },
  },
  {
    id: 3,
    title: 'Generative Circles',
    desc: 'Canvas API with Perlin noise displacement',
    x: 680, y: 70, width: 390, height: 270,
    visualStyle: {
      background: [
        'radial-gradient(ellipse at 30% 50%, rgba(255,77,77,0.9) 0%, transparent 45%)',
        'radial-gradient(ellipse at 72% 30%, rgba(77,121,255,0.9) 0%, transparent 45%)',
        'radial-gradient(ellipse at 55% 72%, rgba(255,170,0,0.8) 0%, transparent 40%)',
        '#0d1117',
      ].join(', '),
    },
  },
  {
    id: 4,
    title: 'Morning Blue',
    desc: 'Photography — early morning fog series',
    x: 1120, y: 60, width: 250, height: 240,
    visualStyle: { background: 'linear-gradient(180deg, #89f7fe 0%, #66a6ff 100%)' },
  },
  {
    id: 5,
    title: 'Editorial Layout',
    desc: 'Typographic composition for a magazine feature',
    x: 1420, y: 50, width: 270, height: 380,
    visualStyle: { background: 'linear-gradient(135deg, #f5e6d3 0%, #e8c9a0 100%)' },
    label: '01',
    labelStyle: {
      fontSize: '130px',
      color: 'rgba(0,0,0,0.07)',
      fontFamily: 'Georgia, serif',
      lineHeight: '1',
      fontWeight: '700',
    },
  },

  // ── Row 2 (y ≈ 380) ───────────────────────────────────────────
  {
    id: 6,
    title: 'Type Study: Grotesque',
    desc: 'Letterform anatomy and optical correction',
    x: 60, y: 380, width: 260, height: 320,
    visualStyle: { background: '#1c1c1c' },
    label: 'Gg',
    labelStyle: {
      fontSize: '108px',
      color: 'rgba(255,255,255,0.15)',
      fontFamily: 'Georgia, serif',
      lineHeight: '1',
      letterSpacing: '-4px',
    },
  },
  {
    id: 7,
    title: 'Botanical Study',
    desc: 'Watercolor-style gradient experiments',
    x: 370, y: 410, width: 320, height: 230,
    visualStyle: { background: 'linear-gradient(135deg, #d4fc79 0%, #96e6a1 50%, #74b9ff 100%)' },
  },
  {
    id: 8,
    title: 'Color Field No. 3',
    desc: 'Inspired by Rothko — abstract color study',
    x: 740, y: 400, width: 230, height: 290,
    visualStyle: { background: 'linear-gradient(180deg, #e17055 0%, #d63031 50%, #2d3436 100%)' },
  },
  {
    id: 9,
    title: 'Grid System',
    desc: 'Modular grids for editorial design',
    x: 1020, y: 370, width: 360, height: 270,
    visualStyle: {
      background: '#f5f5f0',
      backgroundImage: 'radial-gradient(circle, #c0c0bb 1px, transparent 1px)',
      backgroundSize: '22px 22px',
    } as React.CSSProperties,
  },
  {
    id: 10,
    title: 'Dark Palette',
    desc: 'UI exploration — dark mode color system',
    x: 1430, y: 500, width: 270, height: 330,
    visualStyle: { background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' },
  },

  // ── Row 3 (y ≈ 720) ───────────────────────────────────────────
  {
    id: 11,
    title: 'Motion Study',
    desc: 'After Effects — looping color animation',
    x: 60, y: 770, width: 300, height: 370,
    visualStyle: {
      background: 'conic-gradient(from 0deg at 50% 50%, #ffeaa7, #fd79a8, #a29bfe, #74b9ff, #55efc4, #ffeaa7)',
    },
  },
  {
    id: 12,
    title: 'Brand Identity',
    desc: 'Visual identity system — studio mark',
    x: 410, y: 720, width: 310, height: 230,
    visualStyle: { background: '#2d3561' },
    label: 'SC',
    labelStyle: {
      fontSize: '72px',
      color: 'rgba(255,255,255,0.12)',
      fontWeight: '700',
      letterSpacing: '10px',
      fontFamily: 'sans-serif',
    },
  },
  {
    id: 13,
    title: 'Pastels Collection',
    desc: 'Color swatches — pastel tone study',
    x: 770, y: 760, width: 300, height: 250,
    visualStyle: {
      background: 'linear-gradient(90deg, #ffeaa7 25%, #fdcb6e 25% 50%, #fd79a8 50% 75%, #a29bfe 75%)',
    },
  },
  {
    id: 14,
    title: 'Sunset Chromatics',
    desc: 'Analogous color harmony exploration',
    x: 1120, y: 720, width: 310, height: 260,
    visualStyle: { background: 'linear-gradient(145deg, #ff9a9e 0%, #fad0c4 50%, #ffecd2 100%)' },
  },
  {
    id: 15,
    title: 'Noise & Grain',
    desc: 'Generative texture with grain overlay',
    x: 1480, y: 900, width: 240, height: 330,
    visualStyle: { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  },

  // ── Row 4 — below the fold, discovered by scrolling ───────────
  {
    id: 16,
    title: 'Tonal Scale',
    desc: 'Luminance study across a single hue',
    x: 410, y: 1070, width: 220, height: 220,
    visualStyle: { background: 'linear-gradient(135deg, #f8f4f0, #c8a882, #8b5e3c)' },
  },
]

export function PlaygroundPage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const dragging = useRef(false)
  const lastPos = useRef({ x: 0, y: 0 })
  const velocity = useRef({ x: 0, y: 0 })
  const animFrame = useRef<number | undefined>(undefined)
  const [isDragging, setIsDragging] = useState(false)

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!dragging.current) return
      const dx = e.clientX - lastPos.current.x
      const dy = e.clientY - lastPos.current.y
      velocity.current = { x: dx, y: dy }
      lastPos.current = { x: e.clientX, y: e.clientY }
      setPan(p => ({ x: p.x + dx, y: p.y + dy }))
    }

    const onMouseUp = () => {
      if (!dragging.current) return
      dragging.current = false
      setIsDragging(false)

      cancelAnimationFrame(animFrame.current!)
      let vx = velocity.current.x * 6
      let vy = velocity.current.y * 6
      const decay = 0.88

      const animate = () => {
        vx *= decay
        vy *= decay
        if (Math.abs(vx) < 0.3 && Math.abs(vy) < 0.3) return
        setPan(p => ({ x: p.x + vx, y: p.y + vy }))
        animFrame.current = requestAnimationFrame(animate)
      }
      animFrame.current = requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
      cancelAnimationFrame(animFrame.current!)
    }
  }, [])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      cancelAnimationFrame(animFrame.current!)
      setPan(p => ({ x: p.x - e.deltaX, y: p.y - e.deltaY }))
    }
    el.addEventListener('wheel', handleWheel, { passive: false })
    return () => el.removeEventListener('wheel', handleWheel)
  }, [])

  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    cancelAnimationFrame(animFrame.current!)
    dragging.current = true
    velocity.current = { x: 0, y: 0 }
    lastPos.current = { x: e.clientX, y: e.clientY }
    setIsDragging(true)
  }

  return (
    <div className="pg-page">

      {/* Full-screen infinite canvas */}
      <div
        ref={containerRef}
        className={`pg-canvas-wrap${isDragging ? ' pg-dragging' : ''}`}
        onMouseDown={onMouseDown}
      >
        <div
          className="pg-canvas"
          style={{ transform: `translate(${pan.x}px, ${pan.y}px)` }}
        >
          {ITEMS.map(item => (
            <div
              key={item.id}
              className="play-item"
              style={{ left: item.x, top: item.y, width: item.width }}
            >
              <div
                className="play-item-visual"
                style={{ height: item.height, ...item.visualStyle }}
              >
                {item.label && (
                  <span className="play-item-label" style={item.labelStyle}>
                    {item.label}
                  </span>
                )}
              </div>
              <p className="play-item-title">{item.title}</p>
              <p className="play-item-desc">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="playground-hint">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="5 9 2 12 5 15" />
            <polyline points="9 5 12 2 15 5" />
            <polyline points="15 19 12 22 9 19" />
            <polyline points="19 9 22 12 19 15" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <line x1="12" y1="2" x2="12" y2="22" />
          </svg>
          SCROLL/DRAG TO MOVE
        </div>
      </div>
    </div>
  )
}
