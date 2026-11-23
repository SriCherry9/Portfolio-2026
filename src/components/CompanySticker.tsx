import { useRef, useState, useCallback } from 'react'

interface CompanyStickerProps {
  company: string
  color: string
}

function initials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean)
  if (words.length === 0) return '?'
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase()
  return (words[0][0] + words[1][0]).toUpperCase()
}

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v))
}

/** A random, stable-per-mount starting tilt so stickers don't all look identical. */
function randomTilt() {
  return Math.round(Math.random() * 14 - 7)
}

const EDGE_PAD = 6

/**
 * A circular "sticker" bearing the company's initials, sitting next to the
 * project title like a physical sticker — drag it anywhere within the card
 * and it stays put, with a little tilt while it moves.
 */
export function CompanySticker({ company, color }: CompanyStickerProps) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const draggingRef = useRef(false)
  const startRef = useRef({ px: 0, py: 0, x: 0, y: 0 })
  const boundsRef = useRef({ minX: -9999, maxX: 9999, minY: -9999, maxY: 9999 })
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [baseTilt] = useState(randomTilt)
  const [dragTilt, setDragTilt] = useState(0)
  const [dragging, setDragging] = useState(false)

  const onPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation()
    e.preventDefault()
    draggingRef.current = true
    setDragging(true)
    startRef.current = { px: e.clientX, py: e.clientY, x: pos.x, y: pos.y }

    // Let it roam over the whole card (title, cover, description — none of which
    // clip their contents), not just the narrow row it starts in next to the title.
    const el = wrapRef.current
    const card = el?.closest('.tl-card') as HTMLElement | null
    if (el && card) {
      const elRect  = el.getBoundingClientRect()
      const cardRect = card.getBoundingClientRect()
      const size = el.offsetWidth
      // elRect already reflects the current translate(pos.x, pos.y), so subtracting
      // it back out gives the sticker's untransformed position to bound pos against.
      const naturalLeft = elRect.left - pos.x
      const naturalTop  = elRect.top - pos.y
      boundsRef.current = {
        minX: cardRect.left + EDGE_PAD - naturalLeft,
        maxX: cardRect.right - EDGE_PAD - size - naturalLeft,
        minY: cardRect.top + EDGE_PAD - naturalTop,
        maxY: cardRect.bottom - EDGE_PAD - size - naturalTop,
      }
    }
    wrapRef.current?.setPointerCapture(e.pointerId)
  }, [pos])

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return
    e.stopPropagation()
    const dx = e.clientX - startRef.current.px
    const dy = e.clientY - startRef.current.py
    const b = boundsRef.current
    setPos({
      x: clamp(startRef.current.x + dx, b.minX, b.maxX),
      y: clamp(startRef.current.y + dy, b.minY, b.maxY),
    })
    setDragTilt(clamp(dx * 0.18, -22, 22))
  }, [])

  const endDrag = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return
    e.stopPropagation()
    draggingRef.current = false
    setDragging(false)
    setDragTilt(0)
    try { wrapRef.current?.releasePointerCapture(e.pointerId) } catch { /* no-op */ }
  }, [])

  return (
    <div
      ref={wrapRef}
      className={`company-sticker${dragging ? ' company-sticker--dragging' : ''}`}
      style={{
        '--sticker-color': color,
        transform: `translate(${pos.x}px, ${pos.y}px) rotate(${baseTilt + dragTilt}deg)`,
      } as React.CSSProperties}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onClick={e => e.stopPropagation()}
      role="img"
      aria-label={`${company} sticker — drag to move`}
      title={`${company} — drag me`}
    >
      <span className="company-sticker-ring" aria-hidden="true" />
      <span className="company-sticker-initials">{initials(company)}</span>
    </div>
  )
}
