import { useRef, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { AudioRhythmVisualizer } from '../components/AudioRhythmVisualizer'
import { DustyGlassModal } from '../components/DustyGlassModal'
import { TennisBallsModal } from '../components/TennisBallsModal'
import { TypewriterModal } from '../components/TypewriterModal'
import { ImageLightboxModal } from '../components/ImageLightboxModal'

interface BaseItem {
  id: number
  title: string
  desc: string
  width: number
  height: number
  visualStyle: React.CSSProperties
  caseStudyPath?: string
  renderVisual?: (width: number, height: number) => React.ReactNode
  interactive?: 'dusty-glass' | 'tennis-balls' | 'typewriter' | 'image'
  imageSrc?: string
  /** Kept near the top of the canvas instead of scattered across the whole board */
  pinned?: boolean
}

interface PlayItem extends BaseItem {
  x: number
  y: number
}

const BASE_ITEMS: BaseItem[] = [
  {
    id: 23,
    title: 'Ball Pit',
    desc: 'Camera-tracked ball pit — reach in and scatter the tennis balls',
    width: 300, height: 260,
    visualStyle: {
      background: '#1c2e08',
      backgroundImage: 'url(/images/ball-pit-cover.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    interactive: 'tennis-balls',
    pinned: true,
  },
  {
    id: 24,
    title: 'Write a Letter',
    desc: 'A cherry-red Hermes Baby — type on your keyboard and watch the keys strike home, then take your letter with you',
    width: 320, height: 260,
    visualStyle: {
      background: '#f2ece1',
      backgroundImage: 'url(/images/Typewriter.webp)',
      backgroundSize: '86%',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
    },
    interactive: 'typewriter',
    pinned: true,
  },
  {
    id: 25,
    title: 'Interior Concept — Living Room',
    desc: 'A double-height lounge render — staircase, gallery wall, and a warm brass chandelier tying the space together',
    width: 320, height: 260,
    visualStyle: {
      background: '#c9c7c2',
      backgroundImage: 'url(/images/Interior.webp)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    interactive: 'image',
    imageSrc: '/images/Interior.webp',
    pinned: true,
  },
  {
    id: 26,
    title: 'Modern Villa — Exterior Render',
    desc: 'A poolside villa concept — board-formed concrete, a glass water feature, and an infinity edge into the garden',
    width: 320, height: 260,
    visualStyle: {
      background: '#7ec8d6',
      backgroundImage: 'url(/images/Exterior.webp)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    interactive: 'image',
    imageSrc: '/images/Exterior.webp',
    pinned: true,
  },
  {
    id: 20,
    title: 'Sound Wave — Live Rhythm',
    desc: 'Open it up and speak, sing, or play a song — every beat blooms a new pixel-cluster onto a growing generative artwork.',
    width: 320, height: 260,
    visualStyle: { background: '#0a0a0a' },
    renderVisual: (w, h) => <AudioRhythmVisualizer width={w} height={h} />,
  },
  {
    id: 19,
    title: 'Draw on the Glass',
    desc: 'A frosted, snow-fogged window — drag your cursor to wipe it clear',
    width: 300, height: 220,
    visualStyle: {
      background: '#c7ced0',
      backgroundImage: 'url(/images/dusty-glass-cover.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    interactive: 'dusty-glass',
  },
  {
    id: 17,
    title: 'Human Factors & Ergonomics',
    desc: 'Hierarchical Task Analysis and cognitive ergonomic evaluation of an inhaler',
    width: 320, height: 260,
    visualStyle: {
      background: '#7a0d0d',
      backgroundImage: 'url(/images/hfe-inhaler-cover.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    caseStudyPath: '/case-study/hfe-inhaler',
  },
  {
    id: 18,
    title: 'Oh No! — A Comic Strip',
    desc: 'A comic strip where I am the protagonist',
    width: 280, height: 260,
    visualStyle: {
      background: '#ffffff',
      backgroundImage: 'url(/images/comic-strip-cover.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    caseStudyPath: '/case-study/comic-strip',
  },
]

function shuffle<T>(input: T[]): T[] {
  const arr = [...input]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

/** Randomly scatters items with a guaranteed minimum gap, keeping "pinned" items near the top. */
function scatterLayout(items: BaseItem[]): PlayItem[] {
  const GAP = 90
  const placed: { x: number; y: number; w: number; h: number }[] = []

  const overlaps = (x: number, y: number, w: number, h: number) =>
    placed.some(p =>
      x < p.x + p.w + GAP && x + w + GAP > p.x &&
      y < p.y + p.h + GAP && y + h + GAP > p.y
    )

  const place = (w: number, h: number, xMax: number, yMin: number, yMax: number) => {
    for (let attempt = 0; attempt < 600; attempt++) {
      const x = Math.round(Math.random() * (xMax - w))
      const y = Math.round(yMin + Math.random() * (yMax - yMin - h))
      if (!overlaps(x, y, w, h)) {
        placed.push({ x, y, w, h })
        return { x, y }
      }
    }
    const fallbackX = placed.reduce((max, p) => Math.max(max, p.x + p.w), 0) + GAP
    placed.push({ x: fallbackX, y: yMin, w, h })
    return { x: fallbackX, y: yMin }
  }

  const positions = new Map<number, { x: number; y: number }>()
  for (const item of shuffle(items.filter(i => i.pinned))) {
    positions.set(item.id, place(item.width, item.height, 2300, 40, 380))
  }
  for (const item of shuffle(items.filter(i => !i.pinned))) {
    positions.set(item.id, place(item.width, item.height, 2700, 40, 1300))
  }

  return items.map(item => ({ ...item, ...positions.get(item.id)! }))
}

const ITEMS: PlayItem[] = scatterLayout(BASE_ITEMS)

export function PlaygroundPage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const dragging = useRef(false)
  const lastPos = useRef({ x: 0, y: 0 })
  const velocity = useRef({ x: 0, y: 0 })
  const animFrame = useRef<number | undefined>(undefined)
  const [isDragging, setIsDragging] = useState(false)
  const [dustyGlassOpen, setDustyGlassOpen] = useState(false)
  const [tennisBallsOpen, setTennisBallsOpen] = useState(false)
  const [typewriterOpen, setTypewriterOpen] = useState(false)
  const [lightboxItem, setLightboxItem] = useState<PlayItem | null>(null)

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
          {ITEMS.map(item => {
            const content = (
              <>
                <div
                  className="play-item-visual"
                  style={{ height: item.height, ...item.visualStyle }}
                >
                  {item.renderVisual && item.renderVisual(item.width, item.height)}
                </div>
                <p className="play-item-title">{item.title}</p>
                <p className="play-item-desc">{item.desc}</p>
              </>
            )
            if (item.interactive === 'dusty-glass') {
              return (
                <div
                  key={item.id}
                  className="play-item play-item-link"
                  style={{ left: item.x, top: item.y, width: item.width }}
                  role="button"
                  tabIndex={0}
                  onClick={() => setDustyGlassOpen(true)}
                  onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && setDustyGlassOpen(true)}
                >
                  {content}
                </div>
              )
            }
            if (item.interactive === 'tennis-balls') {
              return (
                <div
                  key={item.id}
                  className="play-item play-item-link"
                  style={{ left: item.x, top: item.y, width: item.width }}
                  role="button"
                  tabIndex={0}
                  onClick={() => setTennisBallsOpen(true)}
                  onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && setTennisBallsOpen(true)}
                >
                  {content}
                </div>
              )
            }
            if (item.interactive === 'typewriter') {
              return (
                <div
                  key={item.id}
                  className="play-item play-item-link"
                  style={{ left: item.x, top: item.y, width: item.width }}
                  role="button"
                  tabIndex={0}
                  onClick={() => setTypewriterOpen(true)}
                  onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && setTypewriterOpen(true)}
                >
                  {content}
                </div>
              )
            }
            if (item.interactive === 'image') {
              return (
                <div
                  key={item.id}
                  className="play-item play-item-link"
                  style={{ left: item.x, top: item.y, width: item.width }}
                  role="button"
                  tabIndex={0}
                  onClick={() => setLightboxItem(item)}
                  onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && setLightboxItem(item)}
                >
                  {content}
                </div>
              )
            }
            return item.caseStudyPath ? (
              <Link
                key={item.id}
                to={item.caseStudyPath}
                className="play-item play-item-link"
                style={{ left: item.x, top: item.y, width: item.width }}
              >
                {content}
              </Link>
            ) : (
              <div
                key={item.id}
                className="play-item"
                style={{ left: item.x, top: item.y, width: item.width }}
              >
                {content}
              </div>
            )
          })}
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

      {dustyGlassOpen && <DustyGlassModal onClose={() => setDustyGlassOpen(false)} />}
      {tennisBallsOpen && <TennisBallsModal onClose={() => setTennisBallsOpen(false)} />}
      {typewriterOpen && <TypewriterModal onClose={() => setTypewriterOpen(false)} />}
      {lightboxItem && (
        <ImageLightboxModal
          src={lightboxItem.imageSrc!}
          alt={lightboxItem.title}
          onClose={() => setLightboxItem(null)}
        />
      )}
    </div>
  )
}
