import { useEffect, useRef } from 'react'
import './ShredderLanding.css'

const STRIP_W    = 3      // px per strip — thin for fine shred
const MAX_AMP    = 220    // max horizontal throw at the bottom (px)
const IDLE_AMP   = 0.06   // fraction of MAX_AMP when not scrolling
const WAVE_SPEED = 2.6    // base wave animation speed (rad/s)
const PHASE_STEP = 0.40   // phase shift between adjacent strips

interface Props { onComplete: () => void }

export function ShredderLanding({ onComplete }: Props) {
  const rootRef   = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const barRef    = useRef<HTMLDivElement>(null)
  const hintRef   = useRef<HTMLDivElement>(null)

  const progressRef = useRef(0)   // 0 → 1 scroll progress
  const velRef      = useRef(0)   // smoothed scroll velocity (+ = down)
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

    // Pre-allocated strip displacement array
    const disp = new Float32Array(Math.ceil(window.innerWidth / STRIP_W) + 2)

    // Cover-fit: maps canvas rect onto image source rect
    const cover = (W: number, H: number) => {
      const iW = img.naturalWidth  || W
      const iH = img.naturalHeight || H
      const cr = W / H
      const ir = iW / iH
      if (cr > ir) {                        // canvas wider → crop height
        const h = iW / cr
        return { sx: 0, sy: (iH - h) / 2, sw: iW, sh: h }
      } else {                              // canvas narrower → crop sides
        const w = iH * cr
        return { sx: (iW - w) / 2, sy: 0, sw: w, sh: iH }
      }
    }

    // ── Render loop ──────────────────────────────────────────────────
    const tick = (ts: number) => {
      if (lastTsRef.current === null) lastTsRef.current = ts
      const dt = Math.min((ts - lastTsRef.current) / 1000, 0.05)
      lastTsRef.current    = ts
      elapsedRef.current  += dt

      // Velocity decays naturally (friction)
      velRef.current *= Math.pow(0.78, dt * 60)

      const p   = progressRef.current
      const vel = velRef.current
      const t   = elapsedRef.current
      const W   = canvas.width
      const H   = canvas.height

      // Bar descends from top as progress increases
      const barY  = Math.round(H * p * 0.97)
      const below = H - barY

      if (img.complete && img.naturalWidth > 0) {
        const { sx, sy, sw, sh } = cover(W, H)

        // ── Intact paper above the bar ───────────────────────────────
        if (barY > 0) {
          const aboveSH = barY * (sh / H)
          ctx.drawImage(img, sx, sy, sw, aboveSH, 0, 0, W, barY)
        } else {
          // No shredding yet — draw full image
          ctx.drawImage(img, sx, sy, sw, sh, 0, 0, W, H)
        }

        if (below > 0 && p > 0.002) {
          // Dark background shows through gaps between displaced strips
          ctx.fillStyle = '#0a0a0a'
          ctx.fillRect(0, barY, W, below)

          // Velocity-reactive animation
          const velMag = Math.min(Math.abs(vel), 1)
          const velDir = vel >= 0 ? 1 : -1
          // Speed increases with velocity; direction flips with scroll direction
          const speed  = WAVE_SPEED * (0.5 + velMag * 2.0) * velDir
          // Amplitude: idle floor + velocity bonus
          const ampFrac = IDLE_AMP + (1 - IDLE_AMP) * velMag

          const numStrips = Math.ceil(W / STRIP_W)
          for (let i = 0; i < numStrips; i++) {
            disp[i] = Math.sin(i * PHASE_STEP + t * speed)
          }

          // Map the shredded zone in source image coords
          const scaleX  = sw / W
          const belowSY = sy + barY * (sh / H)
          const belowSH = below * (sh / H)

          // Each strip drawn at its displaced X position
          for (let i = 0; i < numStrips; i++) {
            const dstX0 = i * STRIP_W
            const dstW  = Math.min(STRIP_W, W - dstX0)
            if (dstW <= 0) break

            // Amplitude grows quadratically with depth into the shredded zone
            // Use strip midpoint depth for a single representative value
            const depth = 0.55
            const amp   = depth * depth * MAX_AMP * ampFrac * 2.2
            const shift = Math.round(disp[i] * amp)

            ctx.drawImage(
              img,
              sx + dstX0 * scaleX, belowSY, dstW * scaleX, belowSH,
              dstX0 + shift, barY, dstW, below
            )
          }
        }
      }

      // Move bar DOM element
      if (barRef.current) barRef.current.style.top = `${barY}px`

      // Fade hint on first scroll
      if (hintRef.current) {
        hintRef.current.style.opacity = p > 0.03 ? '0' : '1'
      }

      // ── Completion — slide entire overlay down, reveal portfolio ──
      if (p >= 0.99 && !doneRef.current) {
        doneRef.current = true
        const root = rootRef.current!
        root.style.transition = 'transform 0.8s cubic-bezier(0.76, 0, 0.24, 1)'
        root.style.transform  = 'translateY(100vh)'
        setTimeout(onComplete, 850)
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    // Start once image has loaded (or immediately if cached)
    const startLoop = () => { rafRef.current = requestAnimationFrame(tick) }
    if (img.complete) startLoop()
    else img.onload = startLoop

    // ── Scroll input ─────────────────────────────────────────────────
    document.body.style.overflow = 'hidden'

    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      const d = e.deltaY / (window.innerHeight * 3.0)
      progressRef.current = Math.min(1, Math.max(0, progressRef.current + d))
      // Velocity proportional to scroll speed (capped at ±1)
      velRef.current = Math.max(-1, Math.min(1, velRef.current + d * 60))
    }

    let touchY = 0
    const onTouchStart = (e: TouchEvent) => { touchY = e.touches[0].clientY }
    const onTouchMove  = (e: TouchEvent) => {
      e.preventDefault()
      const d = (touchY - e.touches[0].clientY) / (window.innerHeight * 3.0)
      touchY  = e.touches[0].clientY
      progressRef.current = Math.min(1, Math.max(0, progressRef.current + d))
      velRef.current = Math.max(-1, Math.min(1, velRef.current + d * 60))
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

      {/* Shredder bar */}
      <div ref={barRef} className="shredder-bar">
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
        <span className="shredder-hint-text">Scroll to shred</span>
        <span className="shredder-hint-line" />
      </div>
    </div>
  )
}
