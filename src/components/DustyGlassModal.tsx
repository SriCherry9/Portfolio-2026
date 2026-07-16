import { useEffect, useMemo, useRef } from 'react'

const BRUSH_RADIUS = 30

interface DustyGlassModalProps {
  onClose: () => void
}

export function DustyGlassModal({ onClose }: DustyGlassModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const isDrawing = useRef(false)
  const lastPoint = useRef<{ x: number; y: number } | null>(null)

  const snowflakes = useMemo(
    () =>
      Array.from({ length: 28 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: Math.random() * 3 + 2,
        duration: Math.random() * 8 + 7,
        delay: -Math.random() * 15,
        opacity: Math.random() * 0.5 + 0.4,
      })),
    []
  )

  const fogUp = () => {
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !wrap || !ctx) return

    const { width, height } = wrap.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1
    canvas.width = width * dpr
    canvas.height = height * dpr
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    // cold, pale frost base
    ctx.globalCompositeOperation = 'source-over'
    const base = ctx.createLinearGradient(0, 0, width, height)
    base.addColorStop(0, 'rgba(255, 255, 255, 0.95)')
    base.addColorStop(1, 'rgba(213, 224, 230, 0.92)')
    ctx.fillStyle = base
    ctx.fillRect(0, 0, width, height)

    // soft breath-fog clouds — uneven patches of thicker frost
    for (let i = 0; i < 14; i++) {
      const x = Math.random() * width
      const y = Math.random() * height
      const r = 50 + Math.random() * 130
      const grad = ctx.createRadialGradient(x, y, 0, x, y, r)
      grad.addColorStop(0, `rgba(255, 255, 255, ${(0.10 + Math.random() * 0.12).toFixed(2)})`)
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)')
      ctx.fillStyle = grad
      ctx.beginPath()
      ctx.arc(x, y, r, 0, Math.PI * 2)
      ctx.fill()
    }

    // fine ice-crystal grain sitting on the pane
    const speckles = Math.floor((width * height) / 500)
    for (let i = 0; i < speckles; i++) {
      const x = Math.random() * width
      const y = Math.random() * height
      const r = Math.random() * 1.5 + 0.2
      const bright = Math.random() > 0.6
      ctx.fillStyle = `rgba(${bright ? '255,255,255' : '198,210,216'}, ${(Math.random() * 0.35 + 0.08).toFixed(2)})`
      ctx.beginPath()
      ctx.arc(x, y, r, 0, Math.PI * 2)
      ctx.fill()
    }

    // a few faint pre-existing smudges near the bottom, for realism
    ctx.globalCompositeOperation = 'destination-out'
    for (let i = 0; i < 3; i++) {
      const x = Math.random() * width
      const y = height - 20 - Math.random() * 60
      const r = 30 + Math.random() * 30
      const grad = ctx.createRadialGradient(x, y, 0, x, y, r)
      grad.addColorStop(0, 'rgba(0,0,0,0.3)')
      grad.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = grad
      ctx.beginPath()
      ctx.arc(x, y, r, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.globalCompositeOperation = 'source-over'
  }

  useEffect(() => {
    fogUp()
    const onResize = () => fogUp()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  const wipeSegment = (x1: number, y1: number, x2: number, y2: number) => {
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return
    const dist = Math.hypot(x2 - x1, y2 - y1)
    const steps = Math.max(1, Math.floor(dist / 6))
    ctx.globalCompositeOperation = 'destination-out'
    for (let i = 0; i <= steps; i++) {
      const t = i / steps
      const x = x1 + (x2 - x1) * t
      const y = y1 + (y2 - y1) * t
      const grad = ctx.createRadialGradient(x, y, 0, x, y, BRUSH_RADIUS)
      grad.addColorStop(0, 'rgba(0,0,0,0.9)')
      grad.addColorStop(0.7, 'rgba(0,0,0,0.55)')
      grad.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = grad
      ctx.beginPath()
      ctx.arc(x, y, BRUSH_RADIUS, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.globalCompositeOperation = 'source-over'
  }

  const getPoint = (e: React.PointerEvent) => {
    const rect = canvasRef.current!.getBoundingClientRect()
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  const onPointerDown = (e: React.PointerEvent) => {
    isDrawing.current = true
    const p = getPoint(e)
    lastPoint.current = p
    wipeSegment(p.x, p.y, p.x, p.y)
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDrawing.current || !lastPoint.current) return
    const p = getPoint(e)
    wipeSegment(lastPoint.current.x, lastPoint.current.y, p.x, p.y)
    lastPoint.current = p
  }

  const onPointerUp = () => {
    isDrawing.current = false
    lastPoint.current = null
  }

  return (
    <div className="dg-modal-backdrop" onClick={onClose}>
      <div className="dg-modal-content" onClick={e => e.stopPropagation()}>
        <button className="dg-modal-close" onClick={onClose} aria-label="Close">✕</button>

        <div className="dg-window" ref={wrapRef}>
          <div className="dg-scene">
            <div className="dg-scene-photo" />
            <div className="dg-snowfall">
              {snowflakes.map(flake => (
                <span
                  key={flake.id}
                  className="dg-snowflake"
                  style={{
                    left: `${flake.left}%`,
                    width: flake.size,
                    height: flake.size,
                    opacity: flake.opacity,
                    animationDuration: `${flake.duration}s`,
                    animationDelay: `${flake.delay}s`,
                  }}
                />
              ))}
            </div>
          </div>

          <canvas
            ref={canvasRef}
            className="dg-canvas"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerLeave={onPointerUp}
          />
        </div>

        <div className="dg-controls">
          <div className="dg-hint">DRAG TO WIPE THE GLASS</div>
          <button className="dg-refog" onClick={fogUp}>fog it up again ↻</button>
        </div>
      </div>
    </div>
  )
}
