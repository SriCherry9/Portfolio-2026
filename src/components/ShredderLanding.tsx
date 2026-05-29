import { useEffect, useRef } from 'react'
import './ShredderLanding.css'

const STRIP_W    = 3      // px per strip
const MAX_AMP    = 240    // max horizontal throw at the bottom (px)
const IDLE_AMP   = 0.07   // fraction of MAX_AMP when idle
const WAVE_SPEED = 2.4    // wave rad/s
const PHASE_STEP = 0.40   // phase shift between strips

// What fraction of total scroll is spent scrolling through the newspaper
// before shredding begins (0.4 = 40% scroll, 60% shred)
const SCROLL_FRAC = 0.40

interface Props { onComplete: () => void }

export function ShredderLanding({ onComplete }: Props) {
  const rootRef   = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const barRef    = useRef<HTMLDivElement>(null)
  const hintRef   = useRef<HTMLDivElement>(null)

  const rawRef      = useRef(0)   // 0 → 1 total progress
  const velRef      = useRef(0)   // smoothed velocity
  const elapsedRef  = useRef(0)
  const lastTsRef   = useRef<number | null>(null)
  const rafRef      = useRef<number | undefined>(undefined)
  const doneRef     = useRef(false)

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx    = canvas.getContext('2d')!

    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // ── Load newspaper image ─────────────────────────────────────────
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

      if (!img.complete || img.naturalWidth === 0) {
        rafRef.current = requestAnimationFrame(tick)
        return
      }

      const raw = rawRef.current
      const vel = velRef.current
      const t   = elapsedRef.current
      const W   = canvas.width
      const H   = canvas.height

      // Image source dimensions (fit width)
      const iW   = img.naturalWidth
      const iH   = img.naturalHeight
      const srcW = iW                            // full width
      const srcH = iW * (H / W)                 // how many source px tall one viewport is
      const maxSrcY = Math.max(0, iH - srcH)    // max scroll offset in source px

      if (raw <= SCROLL_FRAC) {
        // ── Phase 1: scroll through the newspaper ──────────────────
        const scrollFrac = raw / SCROLL_FRAC          // 0 → 1
        const srcY = scrollFrac * maxSrcY

        ctx.drawImage(img, 0, srcY, srcW, srcH, 0, 0, W, H)

        // Hide bar during scroll phase
        if (barRef.current) barRef.current.style.display = 'none'

        // Hint fades once scrolling begins
        if (hintRef.current) {
          hintRef.current.style.opacity = raw > 0.02 ? '0' : '1'
        }

      } else {
        // ── Phase 2: shred from bottom upward ────────────────────
        if (barRef.current) barRef.current.style.display = 'flex'

        const shredFrac = (raw - SCROLL_FRAC) / (1 - SCROLL_FRAC)  // 0 → 1
        const srcY      = maxSrcY                                    // locked at bottom view

        // Bar moves from H (bottom) up to 0 (top) as shredFrac 0→1
        const barY  = Math.round(H * (1 - shredFrac))
        const below = H - barY                                       // shredded zone height

        // Intact paper above the bar
        if (barY > 0) {
          ctx.drawImage(img, 0, srcY, srcW, barY * (srcH / H), 0, 0, W, barY)
        }

        if (below > 0) {
          // Clear to transparent — portfolio beneath shows through the gaps
          ctx.clearRect(0, barY, W, below)

          // Velocity-reactive strip oscillation
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

          // Strips fade out as shredding nears completion — paper dissolves
          const stripAlpha = Math.max(0, 1 - shredFrac * 1.1)
          ctx.globalAlpha  = stripAlpha

          for (let i = 0; i < numStrips; i++) {
            const dstX0 = i * STRIP_W
            const dstW  = Math.min(STRIP_W, W - dstX0)
            if (dstW <= 0) break

            // Amplitude grows quadratically with depth below bar
            const depth = 0.55
            const amp   = depth * depth * MAX_AMP * ampFrac * 2.4
            const shift = Math.round(disp[i] * amp)

            ctx.drawImage(
              img,
              dstX0 * scaleX, belowSrcY, dstW * scaleX, belowSrcH,
              dstX0 + shift, barY, dstW, below
            )
          }

          ctx.globalAlpha = 1  // restore
        }

        if (barRef.current) barRef.current.style.top = `${barY}px`
        if (hintRef.current) hintRef.current.style.opacity = '0'

        // ── Done: strips are fully faded, just unmount the overlay ──
        if (shredFrac >= 0.99 && !doneRef.current) {
          doneRef.current = true
          const root = rootRef.current!
          root.style.transition = 'opacity 0.4s ease'
          root.style.opacity    = '0'
          setTimeout(onComplete, 450)
        }
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    const start = () => { rafRef.current = requestAnimationFrame(tick) }
    if (img.complete) start()
    else img.onload = start

    // ── Scroll input ─────────────────────────────────────────────────
    document.body.style.overflow = 'hidden'

    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      const d = e.deltaY / (window.innerHeight * 2.8)
      rawRef.current = Math.min(1, Math.max(0, rawRef.current + d))
      velRef.current = Math.max(-1, Math.min(1, velRef.current + d * 55))
    }

    let touchY = 0
    const onTouchStart = (e: TouchEvent) => { touchY = e.touches[0].clientY }
    const onTouchMove  = (e: TouchEvent) => {
      e.preventDefault()
      const d = (touchY - e.touches[0].clientY) / (window.innerHeight * 2.8)
      touchY  = e.touches[0].clientY
      rawRef.current = Math.min(1, Math.max(0, rawRef.current + d))
      velRef.current = Math.max(-1, Math.min(1, velRef.current + d * 55))
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

      {/* Bar starts hidden (shown only in shred phase) */}
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

      {/* Scroll hint */}
      <div ref={hintRef} className="shredder-hint">
        <span className="shredder-hint-text">Scroll to read</span>
        <span className="shredder-hint-line" />
      </div>
    </div>
  )
}
