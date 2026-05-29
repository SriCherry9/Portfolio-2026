import { useEffect, useRef, useCallback } from 'react'
import './ShredderLanding.css'

// ── Tuning constants ──────────────────────────────────────────────
const STRIP_W        = 3      // vertical strip width in px
const MAX_AMPLITUDE  = 150    // max horizontal displacement at bottom (px)
const ANIM_SPEED     = 2.4    // wave animation speed (rad/s)
const PHASE_PER_STRIP= 0.46   // phase difference between adjacent strips
const DARK_BG        = '#060320' // colour revealed between shredded strips
const SCROLL_DIVISOR = 2.8    // lower = faster shred on scroll

// ─────────────────────────────────────────────────────────────────

interface Props {
  onComplete: () => void
}

export function ShredderLanding({ onComplete }: Props) {
  const canvasRef    = useRef<HTMLCanvasElement>(null)
  const rootRef      = useRef<HTMLDivElement>(null)
  const barRef       = useRef<HTMLDivElement>(null)
  const hintRef      = useRef<HTMLDivElement>(null)

  // Offscreen paper canvas + its raw pixel data (captured once)
  const offscreenRef = useRef<HTMLCanvasElement | null>(null)
  const paperDataRef = useRef<Uint8ClampedArray | null>(null)

  // Animation state (all in refs — no re-renders needed)
  const progressRef  = useRef(0)
  const elapsedRef   = useRef(0)
  const lastTRef     = useRef<number | null>(null)
  const rafRef       = useRef<number>()
  const doneRef      = useRef(false)

  // Pre-allocated typed-array buffers (avoids per-frame GC)
  const dstBufRef    = useRef<Uint8ClampedArray | null>(null)
  const dispRef      = useRef<Float32Array | null>(null)

  // ── Draw the "paper" content onto an offscreen canvas ────────────
  const drawPaper = useCallback(async (W: number, H: number) => {
    const off = document.createElement('canvas')
    off.width  = W
    off.height = H
    const c = off.getContext('2d')!

    // Paint cream immediately so canvas is never blank
    c.fillStyle = '#F4EADE'
    c.fillRect(0, 0, W, H)
    offscreenRef.current = off  // show plain cream while fonts load

    // Wait for web fonts then repaint with text
    await document.fonts.ready

    // Cream background
    c.fillStyle = '#F4EADE'
    c.fillRect(0, 0, W, H)

    // Rainbow stripe (matches reference exactly)
    const g = c.createLinearGradient(0, 0, W, 0)
    const rc: [number, string][] = [
      [0,    '#E8524A'], [0.14, '#F48C3C'], [0.28, '#F5C842'],
      [0.42, '#6DC46A'], [0.56, '#4ABDE8'], [0.70, '#5B8BD6'],
      [0.84, '#9B6BCB'], [1.0,  '#E05BA0'],
    ]
    rc.forEach(([s, col]) => g.addColorStop(s, col))
    c.fillStyle = g
    c.fillRect(0, 0, W, 5)

    // ── Nav bar ───────────────────────────────────────────────────
    const NAV_Y = 44
    c.textBaseline = 'middle'

    // Cherry logo emoji
    c.font = '26px serif'
    c.fillText('🍒', 48, NAV_Y)

    // Brand name
    c.fillStyle = '#131313'
    c.font = '600 14px AvantGarde, "Century Gothic", sans-serif'
    c.fillText('Sri Cherry', 84, NAV_Y)

    // Nav links (centered)
    c.font = '400 13px AvantGarde, "Century Gothic", sans-serif'
    c.fillStyle = '#131313'
    const links  = ['Work', 'Playground', 'About', 'Resume']
    const spacing = W > 1100 ? 68 : 52
    const lx0    = W / 2 - ((links.length - 1) * spacing) / 2
    links.forEach((l, i) => c.fillText(l, lx0 + i * spacing, NAV_Y))

    // Nav divider
    c.strokeStyle = 'rgba(0,0,0,0.07)'
    c.lineWidth   = 1
    c.beginPath(); c.moveTo(0, 68); c.lineTo(W, 68); c.stroke()

    // ── Hero name ─────────────────────────────────────────────────
    const nameSz = Math.min(88, W * 0.065)
    const nameX  = Math.min(80, W * 0.055)
    c.textBaseline = 'top'
    c.fillStyle    = '#131313'
    c.font = `normal ${nameSz}px Golte, Georgia, serif`
    c.fillText('Sri Cherry',  nameX, 118)
    c.fillText('Kotamreddy',  nameX, 118 + nameSz + 4)

    // Role
    const roleY = 118 + nameSz * 2 + 30
    c.font = '400 17px AvantGarde, "Century Gothic", sans-serif'
    c.fillStyle = '#767676'
    c.fillText("I'm a ", nameX, roleY)
    const labelW = c.measureText("I'm a ").width
    c.font = '600 17px AvantGarde, "Century Gothic", sans-serif'
    c.fillStyle = '#131313'
    c.fillText('Interaction Designer', nameX + labelW, roleY)

    // Bio
    c.font = '400 15px AvantGarde, "Century Gothic", sans-serif'
    c.fillStyle = '#999'
    const bio = [
      'Designing thoughtful product experiences at the intersection of',
      'interaction, research, and AI — crafting interfaces that feel intuitive',
      'and work for everyone.',
    ]
    bio.forEach((line, i) => c.fillText(line, nameX, roleY + 40 + i * 26))

    // Hero image (right side) — best-effort
    try {
      const img = await new Promise<HTMLImageElement>((res, rej) => {
        const el = new Image(); el.onload = () => res(el); el.onerror = rej
        el.src = '/images/hero-content.png'
      })
      const imgW = Math.min(W * 0.38, 440)
      const imgH = img.height * (imgW / img.width)
      c.globalAlpha = 0.88
      c.drawImage(img, W - imgW - nameX, 90, imgW, imgH)
      c.globalAlpha = 1
    } catch { /* no image — fine */ }

    offscreenRef.current = off
    paperDataRef.current = c.getImageData(0, 0, W, H).data

    // Pre-allocate pixel buffers
    const numStrips = Math.ceil(W / STRIP_W)
    dispRef.current   = new Float32Array(numStrips)
    dstBufRef.current = new Uint8ClampedArray(W * H * 4)
  }, [])

  // ── Main render loop ─────────────────────────────────────────────
  const renderFrame = useCallback((ts: number) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')!
    const W   = canvas.width
    const H   = canvas.height

    // Advance time
    if (lastTRef.current === null) lastTRef.current = ts
    const dt = Math.min((ts - lastTRef.current) / 1000, 0.05)
    lastTRef.current   = ts
    elapsedRef.current += dt
    const elapsed = elapsedRef.current

    const p       = progressRef.current
    const shredY  = Math.floor(H * (1 - p * 0.97))   // px from top
    const shredH  = H - shredY

    const off   = offscreenRef.current
    const paper = paperDataRef.current

    if (off && paper) {
      // ── Clean paper above the shredder ───────────────────────
      ctx.drawImage(off, 0, 0, W, shredY, 0, 0, W, shredY)

      // ── Shredded area below ───────────────────────────────────
      if (shredH > 0 && p > 0.004) {
        // Dark background that shows through the strip gaps
        ctx.fillStyle = DARK_BG
        ctx.fillRect(0, shredY, W, shredH)

        const numStrips = Math.ceil(W / STRIP_W)
        const disp      = dispRef.current!
        const dst       = dstBufRef.current!

        // Precompute per-strip sine factor (avoids sin() inside inner loop)
        for (let si = 0; si < numStrips; si++) {
          disp[si] = Math.sin(si * PHASE_PER_STRIP + elapsed * ANIM_SPEED)
        }

        // Zero out destination for this shred region
        dst.fill(0, 0, shredH * W * 4)

        // ── Per-row displacement using typed-array bulk copies ──
        for (let ry = 0; ry < shredH; ry++) {
          const y         = shredY + ry
          const t         = ry / shredH
          const amplitude = t * t * MAX_AMPLITUDE   // quadratic growth
          const dstRow    = ry * W * 4

          for (let si = 0; si < numStrips; si++) {
            const x0   = si * STRIP_W                         // dest x start
            const x1   = Math.min(x0 + STRIP_W, W)           // dest x end (excl.)
            const sw   = x1 - x0                              // strip width (px)
            const disp_px = Math.round(disp[si] * amplitude)
            const sx0  = x0 + disp_px                        // source x start

            // Clamp source to canvas bounds
            const csx0 = Math.max(0, sx0)
            const csx1 = Math.min(W, sx0 + sw)
            if (csx0 >= csx1) continue

            const skip   = csx0 - sx0          // left-edge clamp offset (px)
            const copyW  = csx1 - csx0          // px to copy
            const srcOff = (y * W + csx0) * 4
            const dstOff = dstRow + (x0 + skip) * 4

            dst.set(paper.subarray(srcOff, srcOff + copyW * 4), dstOff)
          }
        }

        // Push pixel data to the canvas
        const view    = new Uint8ClampedArray(dst.buffer, 0, shredH * W * 4)
        const imgData = new ImageData(view, W, shredH)
        ctx.putImageData(imgData, 0, shredY)
      }
    }

    // ── Update shredder bar position (direct DOM — no re-render) ──
    if (barRef.current) {
      barRef.current.style.top = `${shredY}px`
    }

    // ── Fade out scroll hint once shredding starts ────────────────
    if (hintRef.current) {
      hintRef.current.style.opacity = p > 0.04 ? '0' : '1'
    }

    // ── Completion ───────────────────────────────────────────────
    if (p >= 0.99 && !doneRef.current) {
      doneRef.current = true
      const root = rootRef.current
      if (root) { root.style.transition = 'opacity 0.55s ease'; root.style.opacity = '0' }
      setTimeout(onComplete, 570)
    }

    rafRef.current = requestAnimationFrame(renderFrame)
  }, [onComplete])

  // ── Setup / teardown ─────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    canvas.width  = window.innerWidth
    canvas.height = window.innerHeight

    drawPaper(window.innerWidth, window.innerHeight).then(() => {
      rafRef.current = requestAnimationFrame(renderFrame)
    })

    // Lock page scroll while landing is active
    document.body.style.overflow = 'hidden'

    // ── Wheel ────────────────────────────────────────────────────
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      progressRef.current = Math.min(
        1,
        Math.max(0, progressRef.current + e.deltaY / (window.innerHeight * SCROLL_DIVISOR))
      )
    }

    // ── Touch ─────────────────────────────────────────────────────
    let lastTY = 0
    const onTouchStart = (e: TouchEvent) => { lastTY = e.touches[0].clientY }
    const onTouchMove  = (e: TouchEvent) => {
      e.preventDefault()
      const dy = lastTY - e.touches[0].clientY
      lastTY   = e.touches[0].clientY
      progressRef.current = Math.min(
        1,
        Math.max(0, progressRef.current + dy / (window.innerHeight * SCROLL_DIVISOR))
      )
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
    }
  }, [drawPaper, renderFrame])

  // ── JSX ──────────────────────────────────────────────────────────
  return (
    <div ref={rootRef} className="shredder-root">
      <canvas ref={canvasRef} className="shredder-canvas" />

      {/* Metallic shredder bar — HTML overlay for easy styling */}
      <div ref={barRef} className="shredder-bar">
        <div className="shredder-slots">
          {Array.from({ length: 10 }).map((_, i) => (
            <span key={i} className="shredder-tooth" />
          ))}
        </div>

        <div className="shredder-body">
          <div className="shredder-led" />
          <span className="shredder-label">SHREDDER</span>
          <div className="shredder-dial" />
        </div>

        <div className="shredder-slots">
          {Array.from({ length: 10 }).map((_, i) => (
            <span key={i} className="shredder-tooth" />
          ))}
        </div>
      </div>

      {/* Scroll hint */}
      <div ref={hintRef} className="shredder-hint">
        <span className="shredder-hint-text">SCROLL TO SHRED</span>
        <span className="shredder-hint-line" />
      </div>
    </div>
  )
}
