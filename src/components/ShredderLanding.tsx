import { useEffect, useRef } from 'react'
import './ShredderLanding.css'

const STRIP_W       = 4      // strip width in px
const MAX_AMP       = 180    // max horizontal displacement at bottom (px)
const BASE_AMP      = 0.12   // fraction of max amplitude when idle (no scroll)
const ANIM_SPEED    = 2.2    // wave speed (rad/s)
const PHASE_STEP    = 0.44   // phase offset between adjacent strips
const DARK_BG       = '#000010'
const SCROLL_DIV    = 3.0

interface Props { onComplete: () => void }

export function ShredderLanding({ onComplete }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rootRef   = useRef<HTMLDivElement>(null)
  const barRef    = useRef<HTMLDivElement>(null)
  const hintRef   = useRef<HTMLDivElement>(null)

  // scroll state
  const progressRef = useRef(0)    // 0→1 (bidirectional)
  const velRef      = useRef(0)    // smoothed scroll velocity (-1..1, +ve = down)

  // animation state
  const elapsedRef  = useRef(0)
  const lastTRef    = useRef<number | null>(null)
  const rafRef      = useRef<number | undefined>(undefined)
  const doneRef     = useRef(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    canvas.width  = window.innerWidth
    canvas.height = window.innerHeight
    const ctx = canvas.getContext('2d')!

    // ── Video source ────────────────────────────────────────────────
    const video = document.createElement('video')
    video.loop        = true
    video.muted       = true
    video.playsInline = true
    video.autoplay    = true
    const s1 = document.createElement('source')
    s1.src  = '/images/hero-landing.mov'; s1.type = 'video/quicktime'
    const s2 = document.createElement('source')
    s2.src  = '/images/hero-landing.mp4'; s2.type = 'video/mp4'
    video.appendChild(s1); video.appendChild(s2)
    video.play().catch(() => {
      const resume = () => { video.play(); document.removeEventListener('click', resume) }
      document.addEventListener('click', resume)
    })

    // pre-allocate displacement array
    const maxStrips = Math.ceil(window.innerWidth / STRIP_W)
    const disp = new Float32Array(maxStrips)

    // ── Cover-fit helper: maps canvas rect → video source rect ──────
    const coverRect = (W: number, H: number) => {
      const vW = video.videoWidth  || W
      const vH = video.videoHeight || H
      const canvasAR = W / H
      const videoAR  = vW / vH
      let srcX, srcY, srcW, srcH
      if (canvasAR > videoAR) {
        // canvas wider than video → fit width, crop top/bottom
        srcW = vW; srcH = vW / canvasAR
        srcX = 0;  srcY = (vH - srcH) / 2
      } else {
        // canvas narrower → fit height, crop sides
        srcH = vH; srcW = vH * canvasAR
        srcY = 0;  srcX = (vW - srcW) / 2
      }
      return { srcX, srcY, srcW, srcH }
    }

    // ── Render loop ─────────────────────────────────────────────────
    const tick = (ts: number) => {
      if (lastTRef.current === null) lastTRef.current = ts
      const dt = Math.min((ts - lastTRef.current) / 1000, 0.05)
      lastTRef.current   = ts
      elapsedRef.current += dt

      // Decay velocity toward zero each frame (natural friction)
      velRef.current *= Math.pow(0.82, dt * 60)

      const elapsed = elapsedRef.current
      const p       = progressRef.current
      const vel     = velRef.current

      const W = canvas.width
      const H = canvas.height
      const shredY = Math.floor(H * (1 - p * 0.97))
      const shredH = H - shredY

      if (video.readyState >= video.HAVE_CURRENT_DATA) {
        const { srcX, srcY, srcW, srcH } = coverRect(W, H)
        const scaleX = srcW / W
        const scaleY = srcH / H

        // Clean video above the bar
        ctx.drawImage(video, srcX, srcY, srcW, shredY * scaleY, 0, 0, W, shredY)

        if (shredH > 0 && p > 0.003) {
          // Dark background — gaps between strips show this
          ctx.fillStyle = DARK_BG
          ctx.fillRect(0, shredY, W, shredH)

          // Velocity-reactive animation:
          //   direction of wave travel flips with scroll direction
          //   amplitude scales with |velocity| + a gentle idle floor
          const velMag  = Math.min(Math.abs(vel), 1)
          const velDir  = vel < 0 ? -1 : 1   // +1 = scrolling down, -1 = up
          const phase   = elapsed * ANIM_SPEED * velDir * (0.5 + velMag * 1.2)

          // Pre-compute per-strip sine
          const numStrips = Math.ceil(W / STRIP_W)
          for (let si = 0; si < numStrips; si++) {
            disp[si] = Math.sin(si * PHASE_STEP + phase)
          }

          // Per-strip drawImage — no pixel reads, GPU-accelerated
          const vSrcY = srcY + shredY * scaleY
          const vSrcH = shredH * scaleY

          for (let si = 0; si < numStrips; si++) {
            const dstX0 = si * STRIP_W
            const dstSW = Math.min(STRIP_W, W - dstX0)
            if (dstSW <= 0) break

            // Amplitude grows quadratically with depth below the bar
            // Floor keeps strips gently alive even when not scrolling
            const ampFloor = BASE_AMP + velMag * (1 - BASE_AMP)
            const stripAmp  = ampFloor * MAX_AMP  // flat amp per-frame (depth applied per row)

            // For a flat per-strip displacement (not per-row), apply depth at midpoint
            const midDepth = 0.5
            const amplitude = midDepth * midDepth * stripAmp * 2.5
            const dispPx    = Math.round(disp[si] * amplitude)

            const vSrcX0 = srcX + dstX0 * scaleX
            const vSrcW0 = dstSW * scaleX

            ctx.drawImage(
              video,
              vSrcX0, vSrcY, vSrcW0, vSrcH,
              dstX0 + dispPx, shredY, dstSW, shredH
            )
          }
        }
      }

      // Shredder bar tracks progress
      if (barRef.current) barRef.current.style.top = `${shredY}px`

      // Hint fades on first scroll
      if (hintRef.current) {
        hintRef.current.style.opacity = p > 0.04 ? '0' : '1'
      }

      // Completion: whole overlay slides down revealing portfolio
      if (p >= 0.99 && !doneRef.current) {
        doneRef.current = true
        const root = rootRef.current
        if (root) {
          root.style.transition = 'transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)'
          root.style.transform  = 'translateY(100vh)'
        }
        setTimeout(onComplete, 750)
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)

    // ── Input ────────────────────────────────────────────────────────
    document.body.style.overflow = 'hidden'

    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      const delta = e.deltaY / (window.innerHeight * SCROLL_DIV)
      progressRef.current = Math.min(1, Math.max(0, progressRef.current + delta))
      // velocity in normalised units/frame (×60 converts to per-second feel)
      velRef.current = Math.max(-1, Math.min(1, velRef.current + delta * 60))
    }

    let lastTY = 0
    const onTouchStart = (e: TouchEvent) => { lastTY = e.touches[0].clientY }
    const onTouchMove  = (e: TouchEvent) => {
      e.preventDefault()
      const dy    = lastTY - e.touches[0].clientY
      lastTY      = e.touches[0].clientY
      const delta = dy / (window.innerHeight * SCROLL_DIV)
      progressRef.current = Math.min(1, Math.max(0, progressRef.current + delta))
      velRef.current = Math.max(-1, Math.min(1, velRef.current + delta * 60))
    }

    window.addEventListener('wheel',      onWheel,      { passive: false })
    window.addEventListener('touchstart', onTouchStart, { passive: true  })
    window.addEventListener('touchmove',  onTouchMove,  { passive: false })

    return () => {
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

      <div ref={barRef} className="shredder-bar">
        <div className="shredder-slots">
          {Array.from({ length: 12 }).map((_, i) => <span key={i} className="shredder-tooth" />)}
        </div>
        <div className="shredder-body">
          <div className="shredder-led" />
          <span className="shredder-label">SHREDDER</span>
          <div className="shredder-dial" />
        </div>
        <div className="shredder-slots">
          {Array.from({ length: 12 }).map((_, i) => <span key={i} className="shredder-tooth" />)}
        </div>
      </div>

      <div ref={hintRef} className="shredder-hint">
        <span className="shredder-hint-text">SCROLL TO SHRED</span>
        <span className="shredder-hint-line" />
      </div>
    </div>
  )
}
