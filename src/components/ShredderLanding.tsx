import { useEffect, useRef } from 'react'
import './ShredderLanding.css'

const STRIP_W    = 4      // px wide per strip
const MAX_AMP    = 200    // max horizontal displacement (px) at bottom
const IDLE_AMP   = 0.08   // strip oscillation when not scrolling (fraction of MAX_AMP)
const WAVE_SPEED = 2.0    // rad/s
const PHASE_STEP = 0.42   // phase shift between adjacent strips

interface Props { onComplete: () => void }

export function ShredderLanding({ onComplete }: Props) {
  const rootRef   = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const barRef    = useRef<HTMLDivElement>(null)
  const hintRef   = useRef<HTMLDivElement>(null)

  const progressRef = useRef(0)   // 0 = bar at top, 1 = fully shredded
  const velRef      = useRef(0)   // scroll velocity, + = down, − = up
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

    // ── Video ────────────────────────────────────────────────────────
    const video = document.createElement('video')
    video.loop = true; video.muted = true; video.playsInline = true
    ;[
      ['/images/hero-landing.mov', 'video/quicktime'],
      ['/images/hero-landing.mp4', 'video/mp4'],
    ].forEach(([src, type]) => {
      const s = document.createElement('source')
      s.src = src; s.type = type; video.appendChild(s)
    })
    video.play().catch(() => {
      const f = () => { video.play(); document.removeEventListener('pointerdown', f) }
      document.addEventListener('pointerdown', f)
    })

    // Strip displacement array (reused every frame)
    const disp = new Float32Array(Math.ceil(window.innerWidth / STRIP_W) + 1)

    // ── Cover-fit: map canvas viewport → video source rectangle ─────
    const cover = (W: number, H: number) => {
      const vW = video.videoWidth  || W
      const vH = video.videoHeight || H
      const cr = W / H
      const vr = vW / vH
      if (cr > vr) {                        // canvas wider → crop height
        const h = vW / cr
        return { sx: 0, sy: (vH - h) / 2, sw: vW, sh: h }
      } else {                              // canvas taller/narrower → crop sides
        const w = vH * cr
        return { sx: (vW - w) / 2, sy: 0, sw: w, sh: vH }
      }
    }

    // ── Render loop ──────────────────────────────────────────────────
    const tick = (ts: number) => {
      if (lastTsRef.current === null) lastTsRef.current = ts
      const dt = Math.min((ts - lastTsRef.current) / 1000, 0.05)
      lastTsRef.current   = ts
      elapsedRef.current += dt

      // Friction — velocity decays naturally when user stops scrolling
      velRef.current *= Math.pow(0.80, dt * 60)

      const p      = progressRef.current
      const vel    = velRef.current
      const t      = elapsedRef.current
      const W      = canvas.width
      const H      = canvas.height

      // Shredder bar Y: starts at top (0), descends to ~97% of screen
      const barY  = Math.round(H * p * 0.97)
      const below = H - barY             // height of shredded zone

      if (video.readyState >= video.HAVE_CURRENT_DATA) {
        const { sx, sy, sw, sh } = cover(W, H)

        // ── Intact video above the bar ───────────────────────────────
        const aboveSH = barY * (sh / H)
        if (barY > 0) {
          ctx.drawImage(video, sx, sy, sw, aboveSH, 0, 0, W, barY)
        }

        if (below > 0 && p > 0.002) {
          // Dark gap filler
          ctx.fillStyle = '#000'
          ctx.fillRect(0, barY, W, below)

          // Velocity-reactive strip animation
          const velMag  = Math.min(Math.abs(vel), 1)
          const velDir  = vel >= 0 ? 1 : -1
          const speed   = WAVE_SPEED * (0.4 + velMag * 1.4) * velDir
          const ampFrac = IDLE_AMP + (1 - IDLE_AMP) * velMag

          const numStrips = Math.ceil(W / STRIP_W)
          for (let i = 0; i < numStrips; i++) {
            disp[i] = Math.sin(i * PHASE_STEP + t * speed)
          }

          // Displacement grows quadratically with depth below bar
          const belowSY = sy + barY * (sh / H)
          const belowSH = below * (sh / H)
          const scaleX  = sw / W

          for (let i = 0; i < numStrips; i++) {
            const dstX0 = i * STRIP_W
            const dstW  = Math.min(STRIP_W, W - dstX0)
            if (dstW <= 0) break

            // Amplitude at midpoint of this strip's shredded zone
            const depth  = 0.55                          // use midpoint depth
            const amp    = depth * depth * MAX_AMP * ampFrac
            const shift  = Math.round(disp[i] * amp)

            const vSrcX  = sx + dstX0 * scaleX
            const vSrcW  = dstW * scaleX

            ctx.drawImage(video,
              vSrcX,   belowSY, vSrcW, belowSH,
              dstX0 + shift, barY,  dstW,  below
            )
          }
        } else if (barY === 0) {
          // Nothing shredded yet — draw full video
          ctx.drawImage(video, sx, sy, sw, sh, 0, 0, W, H)
        }
      }

      // Sync bar position
      if (barRef.current) barRef.current.style.top = `${barY}px`

      // Hide hint after first scroll
      if (hintRef.current) {
        hintRef.current.style.opacity = p > 0.03 ? '0' : '1'
      }

      // ── Done: slide entire page down to reveal portfolio ─────────
      if (p >= 0.99 && !doneRef.current) {
        doneRef.current = true
        const root = rootRef.current!
        root.style.transition = 'transform 0.75s cubic-bezier(0.76, 0, 0.24, 1)'
        root.style.transform  = 'translateY(100vh)'
        setTimeout(onComplete, 780)
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)

    // ── Scroll input ─────────────────────────────────────────────────
    document.body.style.overflow = 'hidden'

    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      const d = e.deltaY / (window.innerHeight * 3.2)
      progressRef.current = Math.min(1, Math.max(0, progressRef.current + d))
      velRef.current = Math.max(-1, Math.min(1, velRef.current + d * 55))
    }

    let touchY = 0
    const onTouchStart = (e: TouchEvent) => { touchY = e.touches[0].clientY }
    const onTouchMove  = (e: TouchEvent) => {
      e.preventDefault()
      const d = (touchY - e.touches[0].clientY) / (window.innerHeight * 3.2)
      touchY  = e.touches[0].clientY
      progressRef.current = Math.min(1, Math.max(0, progressRef.current + d))
      velRef.current = Math.max(-1, Math.min(1, velRef.current + d * 55))
    }

    window.addEventListener('wheel',      onWheel,      { passive: false })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove',  onTouchMove,  { passive: false })

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('wheel',      onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove',  onTouchMove)
      document.body.style.overflow = ''
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      video.pause(); video.src = ''
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

      {/* Name + role */}
      <div className="shredder-text">
        <p className="shredder-name">Sri Cherry Kotamreddy</p>
        <p className="shredder-role">Interaction Designer</p>
      </div>

      {/* Hint */}
      <div ref={hintRef} className="shredder-hint">
        <span className="shredder-hint-text">Scroll to enter</span>
        <span className="shredder-hint-line" />
      </div>
    </div>
  )
}
