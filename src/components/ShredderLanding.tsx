import { useEffect, useRef } from 'react'
import './ShredderLanding.css'

const STRIP_W      = 18
const MAX_AMP      = 55
const IDLE_AMP     = 0.25
const PHASE_STEP   = 0.40
const NOODLE_BANDS = 28
const NOODLE_BEND  = 4.0
const NOODLE_SPEED = 0.25
const PULL_START   = 0.82
const SCROLL_FRAC  = 0.40

export function ShredderLanding() {
  const rootRef   = useRef<HTMLDivElement>(null)
  const stickyRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const barRef    = useRef<HTMLDivElement>(null)
  const hintRef   = useRef<HTMLDivElement>(null)

  const elapsedRef      = useRef(0)
  const lastTsRef       = useRef<number | null>(null)
  const prevRawRef      = useRef(0)
  const audioRef        = useRef<HTMLAudioElement | null>(null)
  const scrollTimerRef  = useRef<ReturnType<typeof setTimeout> | null>(null)
  const audioPlayingRef = useRef(false)
  const rafRef          = useRef<number | undefined>(undefined)
  const firstDrawRef    = useRef(false)

  useEffect(() => {
    const root   = rootRef.current!
    const canvas = canvasRef.current!
    const ctx    = canvas.getContext('2d')!
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'

    root.style.opacity = '0'
    firstDrawRef.current = false

    // Lock canvas dimensions to viewport — only update on width change (orientation)
    let lockedW = window.innerWidth
    let lockedH = window.innerHeight
    canvas.width  = lockedW
    canvas.height = lockedH

    const resize = () => {
      const newW = window.innerWidth
      if (newW === lockedW) return
      lockedW = newW
      lockedH = window.innerHeight
      canvas.width  = lockedW
      canvas.height = lockedH
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'
    }
    window.addEventListener('resize', resize)

    // ── Audio ────────────────────────────────────────────────────────
    const audio = new Audio('/shredder.mp3')
    audio.loop    = true
    audio.volume  = 0.3
    audio.preload = 'auto'
    audioRef.current = audio

    let unlocked = false
    const unlock = () => {
      if (unlocked) return
      unlocked = true
      audio.play().then(() => { audio.pause(); audio.currentTime = 0 }).catch(() => {})
    }
    window.addEventListener('wheel',      unlock, { once: true })
    window.addEventListener('touchstart', unlock, { once: true })

    const startAudio = () => {
      if (audioPlayingRef.current) return
      audio.play().then(() => { audioPlayingRef.current = true }).catch(() => {})
    }
    const stopAudio = () => {
      if (!audioPlayingRef.current) return
      audio.pause()
      audioPlayingRef.current = false
    }
    const scheduleStop = () => {
      if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current)
      scrollTimerRef.current = setTimeout(stopAudio, 220)
    }

    const img = new Image()
    img.src = '/images/newspaper.webp'

    // ── Render loop ──────────────────────────────────────────────────
    const tick = (ts: number) => {
      if (lastTsRef.current === null) lastTsRef.current = ts
      const dt = Math.min((ts - lastTsRef.current) / 1000, 0.05)
      lastTsRef.current   = ts
      elapsedRef.current += dt

      // Derive raw from scroll position within the tall container
      const rect           = root.getBoundingClientRect()
      const totalScrollable = root.offsetHeight - window.innerHeight
      const raw = totalScrollable > 0
        ? Math.max(0, Math.min(1, -rect.top / totalScrollable))
        : 0

      // Velocity from scroll delta (for strip sway amplitude)
      const prevRaw = prevRawRef.current
      const rawDelta = raw - prevRaw
      prevRawRef.current = raw
      const vel = Math.max(-1, Math.min(1, rawDelta * 60))

      const t = elapsedRef.current
      const W = canvas.width
      const H = canvas.height

      // ── Audio: play while scrolling forward through shred phase ──
      if (rawDelta > 0.0002 && raw > SCROLL_FRAC && raw < 0.99) {
        startAudio()
        scheduleStop()
      }

      // ── Draw ─────────────────────────────────────────────────────
      if (!img.complete || img.naturalWidth === 0) {
        rafRef.current = requestAnimationFrame(tick)
        return
      }

      if (!firstDrawRef.current) {
        firstDrawRef.current = true
        root.style.transition = 'opacity 0.15s ease'
        root.style.opacity = '1'
      }

      const iW      = img.naturalWidth
      const iH      = img.naturalHeight
      const srcW    = iW
      const srcH    = iW * (H / W)
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

        if (barY > 0) {
          ctx.drawImage(img, 0, srcY, srcW, barY * (srcH / H), 0, 0, W, barY)
        }

        if (below > 0) {
          ctx.clearRect(0, barY, W, below)

          const velMag  = Math.min(Math.abs(vel), 1)
          const ampFrac = IDLE_AMP + (1 - IDLE_AMP) * velMag

          const numStrips = Math.ceil(W / STRIP_W)
          const scaleX    = srcW / W
          const belowSrcY = srcY + barY * (srcH / H)

          const pullFrac  = shredFrac < PULL_START
            ? 0
            : (shredFrac - PULL_START) / (1 - PULL_START)
          const easedPull = pullFrac * pullFrac * (3 - 2 * pullFrac)
          const stripH    = below * (1 - easedPull)
          const stripSrcH = stripH * (srcH / H)
          const bandH     = stripH > 0 ? stripH / NOODLE_BANDS : 0
          const bandSrcH  = stripSrcH > 0 ? stripSrcH / NOODLE_BANDS : 0
          const pullSpeedBoost = 1 + easedPull * 5

          ctx.globalAlpha = 1

          for (let i = 0; i < numStrips; i++) {
            const dstX0 = i * STRIP_W
            const dstW  = Math.min(STRIP_W, W - dstX0)
            if (dstW <= 0) break

            const stripSpeed = NOODLE_SPEED * (0.7 + 0.6 * ((i * 13 + 5) % 10) / 10) * pullSpeedBoost
            const stripPhase = i * PHASE_STEP + i * 0.19

            const shifts: number[] = []
            for (let b = 0; b < NOODLE_BANDS; b++) {
              const norm = b / NOODLE_BANDS
              const amp  = norm * norm * MAX_AMP * ampFrac
              shifts[b]  = Math.sin(stripPhase + norm * NOODLE_BEND + t * stripSpeed) * amp
            }

            ctx.save()
            ctx.shadowColor   = 'rgba(0,0,0,0.38)'
            ctx.shadowBlur    = 5
            ctx.shadowOffsetX = 3
            ctx.shadowOffsetY = 2
            for (let b = 0; b < NOODLE_BANDS; b++) {
              ctx.drawImage(
                img,
                dstX0 * scaleX, belowSrcY + b * bandSrcH, dstW * scaleX, bandSrcH,
                dstX0 + shifts[b], barY + b * bandH, dstW, bandH
              )
            }
            ctx.restore()

            for (let b = 0; b < NOODLE_BANDS; b++) {
              ctx.drawImage(
                img,
                dstX0 * scaleX, belowSrcY + b * bandSrcH, dstW * scaleX, bandSrcH,
                dstX0 + shifts[b], barY + b * bandH, dstW, bandH
              )
            }

            for (let b = 0; b < NOODLE_BANDS; b++) {
              const x  = dstX0 + shifts[b]
              const y  = barY + b * bandH
              const bh = bandH + 0.5
              ctx.fillStyle = 'rgba(255,252,240,0.55)'
              ctx.fillRect(x, y, 1.5, bh)
              ctx.fillStyle = 'rgba(0,0,0,0.18)'
              ctx.fillRect(x + dstW - 1, y, 1, bh)
            }

            const tipBands = 3
            const tipStart = NOODLE_BANDS - tipBands
            for (let b = tipStart; b < NOODLE_BANDS; b++) {
              const norm     = (b - tipStart) / tipBands
              const tipAlpha = (1 - norm) * 0.85
              const x = dstX0 + shifts[b]
              const y = barY  + b * bandH
              const grad = ctx.createLinearGradient(x, y, x, y + bandH)
              grad.addColorStop(0, `rgba(255,255,255,0)`)
              grad.addColorStop(1, `rgba(255,255,255,${1 - tipAlpha})`)
              ctx.fillStyle = grad
              ctx.fillRect(x, y, dstW, bandH + 0.5)
            }
          }
        }

        if (barRef.current) barRef.current.style.top = `${barY}px`
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    const start = () => { rafRef.current = requestAnimationFrame(tick) }
    if (img.complete) start(); else img.onload = start

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('wheel',      unlock)
      window.removeEventListener('touchstart', unlock)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current)
      audio.pause()
      audioRef.current = null
    }
  }, [])

  return (
    <div ref={rootRef} className="shredder-root">
      <div ref={stickyRef} className="shredder-sticky">
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
    </div>
  )
}
