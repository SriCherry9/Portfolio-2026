import { useEffect, useRef } from 'react'
import './ShredderLanding.css'

const STRIP_W    = 18
const MAX_AMP    = 55    // max horizontal throw kept subtle
const IDLE_AMP   = 0.25  // gentle idle oscillation
const WAVE_SPEED = 1.4   // slower, calmer wave
const PHASE_STEP = 0.40
const SCROLL_FRAC = 0.40   // fraction of total scroll spent panning the newspaper

interface Props { onComplete: () => void }

export function ShredderLanding({ onComplete }: Props) {
  const rootRef   = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const barRef    = useRef<HTMLDivElement>(null)
  const hintRef   = useRef<HTMLDivElement>(null)

  const rawRef          = useRef(0)    // 0 → 1 total progress (bidirectional)
  const velRef          = useRef(0)    // scroll velocity
  const elapsedRef      = useRef(0)
  const lastTsRef       = useRef<number | null>(null)
  const rafRef          = useRef<number | undefined>(undefined)
  // true once we've handed off to portfolio; false when shredder is active
  const portfolioRef    = useRef(false)
  const completeFiredRef = useRef(false)

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx    = canvas.getContext('2d')!
    const root   = rootRef.current!

    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const img = new Image()
    img.src = '/images/newspaper.webp'
    const disp = new Float32Array(Math.ceil(window.innerWidth / STRIP_W) + 2)

    // ── Render loop ──────────────────────────────────────────────────
    const tick = (ts: number) => {
      if (lastTsRef.current === null) lastTsRef.current = ts
      const dt = Math.min((ts - lastTsRef.current) / 1000, 0.05)
      lastTsRef.current   = ts
      elapsedRef.current += dt
      velRef.current *= Math.pow(0.80, dt * 60)

      const raw = rawRef.current
      const vel = velRef.current
      const t   = elapsedRef.current
      const W   = canvas.width
      const H   = canvas.height

      // ── Portfolio hand-off ────────────────────────────────────────
      if (raw >= 0.99 && !portfolioRef.current) {
        portfolioRef.current = true
        root.style.opacity       = '0'
        root.style.pointerEvents = 'none'
        document.body.style.overflow = ''
        if (!completeFiredRef.current) {
          completeFiredRef.current = true
          onComplete()
        }
        rafRef.current = requestAnimationFrame(tick)
        return
      }

      // ── Reverse: shredder wakes back up ──────────────────────────
      if (portfolioRef.current && raw < 0.99) {
        portfolioRef.current = false
        completeFiredRef.current = false
        root.style.opacity       = '1'
        root.style.pointerEvents = 'all'
        document.body.style.overflow = 'hidden'
      }

      if (portfolioRef.current) {
        rafRef.current = requestAnimationFrame(tick)
        return
      }

      // ── Draw ─────────────────────────────────────────────────────
      if (!img.complete || img.naturalWidth === 0) {
        rafRef.current = requestAnimationFrame(tick)
        return
      }

      const iW     = img.naturalWidth
      const iH     = img.naturalHeight
      const srcW   = iW
      const srcH   = iW * (H / W)
      const maxSrcY = Math.max(0, iH - srcH)

      if (raw <= SCROLL_FRAC) {
        // Phase 1: pan newspaper top → bottom
        const srcY = (raw / SCROLL_FRAC) * maxSrcY
        ctx.clearRect(0, 0, W, H)
        ctx.drawImage(img, 0, srcY, srcW, srcH, 0, 0, W, H)
        if (barRef.current)  barRef.current.style.display = 'none'
        if (hintRef.current) hintRef.current.style.opacity = raw > 0.02 ? '0' : '1'

      } else {
        // Phase 2: shred from bottom upward
        if (barRef.current) barRef.current.style.display = 'flex'
        if (hintRef.current) hintRef.current.style.opacity = '0'

        const shredFrac = (raw - SCROLL_FRAC) / (1 - SCROLL_FRAC)
        const srcY      = maxSrcY
        const barY      = Math.round(H * (1 - shredFrac))
        const below     = H - barY

        ctx.clearRect(0, 0, W, H)

        // Intact paper above bar
        if (barY > 0) {
          ctx.drawImage(img, 0, srcY, srcW, barY * (srcH / H), 0, 0, W, barY)
        }

        if (below > 0) {
          // Transparent gaps → portfolio beneath shows through
          ctx.clearRect(0, barY, W, below)

          const velMag  = Math.min(Math.abs(vel), 1)
          const velDir  = vel >= 0 ? 1 : -1
          const speed   = WAVE_SPEED * (0.4 + velMag * 2.0) * velDir
          const ampFrac = IDLE_AMP + (1 - IDLE_AMP) * velMag

          const numStrips = Math.ceil(W / STRIP_W)
          for (let i = 0; i < numStrips; i++) {
            disp[i] = Math.sin(i * PHASE_STEP + t * speed)
          }

          const scaleX    = srcW / W
          const belowSrcY = srcY + barY * (srcH / H)
          const belowSrcH = below * (srcH / H)

          // Strips dissolve as bar nears the top
          ctx.globalAlpha = Math.max(0, 1 - shredFrac * 1.1)

          for (let i = 0; i < numStrips; i++) {
            const dstX0 = i * STRIP_W
            const dstW  = Math.min(STRIP_W, W - dstX0)
            if (dstW <= 0) break
            const depth = 0.55
            const amp   = depth * depth * MAX_AMP * ampFrac
            const shift = Math.round(disp[i] * amp)
            ctx.drawImage(
              img,
              dstX0 * scaleX, belowSrcY, dstW * scaleX, belowSrcH,
              dstX0 + shift, barY, dstW, below
            )
          }
          ctx.globalAlpha = 1
        }

        if (barRef.current) barRef.current.style.top = `${barY}px`
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    const start = () => { rafRef.current = requestAnimationFrame(tick) }
    if (img.complete) start(); else img.onload = start

    // ── Scroll input ─────────────────────────────────────────────────
    document.body.style.overflow = 'hidden'

    const onWheel = (e: WheelEvent) => {
      if (portfolioRef.current) {
        // Portfolio is active — only intercept a scroll-up at page top
        if (e.deltaY < 0 && window.scrollY === 0) {
          e.preventDefault()
          const d = e.deltaY / (window.innerHeight * 2.8)
          rawRef.current = Math.min(1, Math.max(0, rawRef.current + d))
          velRef.current = Math.max(-1, Math.min(1, velRef.current + d * 18))
        }
        return
      }
      e.preventDefault()
      const d = e.deltaY / (window.innerHeight * 2.8)
      rawRef.current = Math.min(1, Math.max(0, rawRef.current + d))
      velRef.current = Math.max(-1, Math.min(1, velRef.current + d * 18))
    }

    let touchY = 0
    const onTouchStart = (e: TouchEvent) => { touchY = e.touches[0].clientY }
    const onTouchMove  = (e: TouchEvent) => {
      if (portfolioRef.current) {
        const dy = touchY - e.touches[0].clientY
        touchY = e.touches[0].clientY
        // Only intercept upward swipe at page top
        if (dy < 0 && window.scrollY === 0) {
          e.preventDefault()
          const d = dy / (window.innerHeight * 2.8)
          rawRef.current = Math.min(1, Math.max(0, rawRef.current + d))
          velRef.current = Math.max(-1, Math.min(1, velRef.current + d * 18))
        }
        return
      }
      e.preventDefault()
      const d = (touchY - e.touches[0].clientY) / (window.innerHeight * 2.8)
      touchY = e.touches[0].clientY
      rawRef.current = Math.min(1, Math.max(0, rawRef.current + d))
      velRef.current = Math.max(-1, Math.min(1, velRef.current + d * 18))
    }

    window.addEventListener('wheel',      onWheel,      { passive: false })
    window.addEventListener('touchstart', onTouchStart, { passive: true  })
    window.addEventListener('touchmove',  onTouchMove,  { passive: false })

    return () => {
      window.removeEventListener('resize',     resize)
      window.removeEventListener('wheel',      onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove',  onTouchMove)
      document.body.style.overflow = ''
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [onComplete])

  return (
    <div ref={rootRef} className="shredder-root">
      <canvas ref={canvasRef} className="shredder-canvas" />

      <div ref={barRef} className="shredder-bar" style={{ display: 'none' }}>
        <div className="shredder-slots">
          {Array.from({ length: 14 }).map((_, i) => <span key={i} className="shredder-tooth" />)}
        </div>
        <div className="shredder-body">
          <div className="shredder-led" />
          <span className="shredder-label">SHREDDER</span>
          <div className="shredder-dial" />
        </div>
        <div className="shredder-slots">
          {Array.from({ length: 14 }).map((_, i) => <span key={i} className="shredder-tooth" />)}
        </div>
      </div>

      <div ref={hintRef} className="shredder-hint">
        <span className="shredder-hint-text">Scroll to read</span>
        <span className="shredder-hint-line" />
      </div>
    </div>
  )
}
