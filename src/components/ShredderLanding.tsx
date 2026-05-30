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

const NP_W = 1200
const NP_H = 3400

interface Props { onComplete: () => void }

// ── Justified text helper ──────────────────────────────────────────────────
function drawJustified(
  ctx: CanvasRenderingContext2D,
  text: string, x: number, startY: number, colW: number, lineH: number
): number {
  const words = text.split(' ')
  const lines: string[][] = []
  let line: string[] = []

  for (const w of words) {
    const test = [...line, w].join(' ')
    if (ctx.measureText(test).width > colW && line.length > 0) {
      lines.push(line)
      line = [w]
    } else {
      line.push(w)
    }
  }
  if (line.length) lines.push(line)

  let cy = startY
  for (let i = 0; i < lines.length; i++) {
    const row = lines[i]
    if (i === lines.length - 1 || row.length === 1) {
      // Last line or single word: left-align
      ctx.fillText(row.join(' '), x, cy)
    } else {
      const totalWordW = row.reduce((s, w) => s + ctx.measureText(w).width, 0)
      const gap = (colW - totalWordW) / (row.length - 1)
      let cx = x
      for (const w of row) {
        ctx.fillText(w, cx, cy)
        cx += ctx.measureText(w).width + gap
      }
    }
    cy += lineH
  }
  return cy
}

// ── Newspaper canvas builder (async — waits for photo) ─────────────────────
function buildNewspaper(photo: HTMLImageElement): HTMLCanvasElement {
  const c   = document.createElement('canvas')
  c.width   = NP_W
  c.height  = NP_H
  const ctx = c.getContext('2d')!
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'
  const W   = NP_W
  const M   = 52   // margin

  // ── Background: aged paper ──────────────────────────────────────────
  ctx.fillStyle = '#E8DFC8'
  ctx.fillRect(0, 0, W, NP_H)

  // Paper grain
  for (let i = 0; i < 22000; i++) {
    ctx.fillStyle = `rgba(0,0,0,${Math.random() * 0.022})`
    ctx.fillRect(Math.random() * W, Math.random() * NP_H, 1, 1)
  }
  // Subtle vignette edges
  const vig = ctx.createRadialGradient(W/2, NP_H/2, NP_H*0.3, W/2, NP_H/2, NP_H*0.9)
  vig.addColorStop(0, 'rgba(0,0,0,0)')
  vig.addColorStop(1, 'rgba(0,0,0,0.10)')
  ctx.fillStyle = vig
  ctx.fillRect(0, 0, W, NP_H)

  const INK   = '#1A1410'
  const INK2  = '#2E2820'
  const MUTED = '#6B5F52'
  let y = M

  // ── Top thin rule ───────────────────────────────────────────────────
  ctx.fillStyle = INK
  ctx.fillRect(M, y, W - M*2, 1)
  y += 14

  // ── Kicker: TALES OF THE BEST STORIES ───────────────────────────────
  ctx.font = '500 13px "AvantGarde","Century Gothic",sans-serif'
  ctx.fillStyle = INK2
  ctx.textAlign = 'center'
  ctx.letterSpacing = '4px'
  ctx.fillText('TALES OF THE BEST STORIES', W/2, y + 13)
  ctx.letterSpacing = '0px'
  y += 24

  // ── Double rule ─────────────────────────────────────────────────────
  ctx.fillStyle = INK
  ctx.fillRect(M, y, W - M*2, 3)
  ctx.fillRect(M, y + 7, W - M*2, 1)
  y += 18

  // ── MASTHEAD: CREATIVE TIMES ─────────────────────────────────────────
  ctx.font = 'bold 148px Georgia,"Times New Roman",serif'
  ctx.fillStyle = INK
  ctx.textAlign = 'center'
  ctx.fillText('CREATIVE TIMES', W/2, y + 140)
  y += 158

  // ── Sub-masthead ─────────────────────────────────────────────────────
  ctx.font = '500 15px "AvantGarde","Century Gothic",sans-serif'
  ctx.fillStyle = INK2
  ctx.textAlign = 'center'
  ctx.letterSpacing = '5px'
  ctx.fillText('ARCHIVAL FINDS  –  DESIGN  –  ADVENTURE', W/2, y + 15)
  ctx.letterSpacing = '0px'
  y += 30

  // ── Dark issue bar ───────────────────────────────────────────────────
  ctx.fillStyle = '#1A1410'
  ctx.fillRect(M, y, W - M*2, 38)
  ctx.font = '500 14px "AvantGarde","Century Gothic",sans-serif'
  ctx.fillStyle = '#E8DFC8'
  ctx.textAlign = 'left'
  ctx.fillText('Issue No. 32', M + 16, y + 24)
  ctx.textAlign = 'center'
  ctx.fillText('23 December 2027', W/2, y + 24)
  ctx.textAlign = 'right'
  ctx.fillText('Price: $1.99', W - M - 16, y + 24)
  y += 52

  // ── Thin rule ────────────────────────────────────────────────────────
  ctx.fillStyle = INK
  ctx.fillRect(M, y, W - M*2, 1)
  y += 20

  // ── Main content: photo LEFT (60%) + text RIGHT (38%) ────────────────
  const photoColW = Math.round((W - M*2) * 0.60)
  const textColX  = M + photoColW + 24
  const textColW  = W - M - textColX

  // Draw photo
  const photoH = Math.round(photoColW * (photo.naturalHeight / photo.naturalWidth))
  ctx.drawImage(photo, M, y, photoColW, photoH)

  // Right column: 3 paragraphs of intro text
  const introParagraphs = [
    'Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.',
    'Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.',
    'Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.',
  ]

  ctx.font = '15.5px Georgia,"Times New Roman",serif'
  ctx.fillStyle = INK
  ctx.textAlign = 'left'
  let ry = y
  for (const para of introParagraphs) {
    ry = drawJustified(ctx, para, textColX, ry, textColW, 23)
    ry += 12
  }

  // Advance y past photo
  y += photoH + 24

  // ── Headline: A GLIMPSE INTO THE PAST ────────────────────────────────
  ctx.font = 'bold 88px Georgia,"Times New Roman",serif'
  ctx.fillStyle = INK
  ctx.textAlign = 'left'
  ctx.fillText('A GLIMPSE INTO THE PAST', M, y + 82)
  y += 98

  // Sub-headline
  ctx.font = '700 18px "AvantGarde","Century Gothic",sans-serif'
  ctx.fillStyle = INK2
  ctx.textAlign = 'center'
  ctx.letterSpacing = '3px'
  ctx.fillText('PAST, PRESENT AND THE FUTURE', W/2, y + 18)
  ctx.letterSpacing = '0px'
  y += 36

  // Rule below headline
  ctx.fillStyle = INK
  ctx.fillRect(M, y, W - M*2, 1)
  y += 20

  // ── Three-column body ─────────────────────────────────────────────────
  const colGap = 28
  const cw     = Math.round((W - M*2 - colGap*2) / 3)
  const c1x    = M
  const c2x    = M + cw + colGap
  const c3x    = M + (cw + colGap)*2

  ctx.font = '15.5px Georgia,"Times New Roman",serif'
  ctx.fillStyle = INK
  ctx.textAlign = 'left'

  // Column 1
  const col1paras = [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet velit nisi. Sed non enim felis. Nunc et aliquet turpis. In non bibendum odio. Mauris porttitor laoreet aliquet. Vivamus sit amet ligula ut nisl congue porta. Integer auctor nisl massa, quis consectetur ex rutrum ac. Sed faucibus consequat dapibus. Morbi orci sem, blandit ut consectetur vel, condimentum a enim. Vivamus vitae accumsan erat. Duis dictum justo nec libero egestas, vel mollis purus venenatis. Ut semper ex non lorem commodo iaculis. Sed ornare sed lacus vitae hendrerit.',
    'Morbi rhoncus ultrices lectus, aliquam blandit lacus. Ut vel volutpat lectus. Etiam pretium tempus diam ut semper. Nam quis malesuada purus, sed volutpat lacus. Nulla at ligula tristique eros tempor feugiat. Mauris eu ex varius, commodo neque at, laoreet dui. Aenean interdum mollis libero. Sed ut justo vel sapienat',
  ]
  let cy1 = y
  for (const p of col1paras) {
    cy1 = drawJustified(ctx, p, c1x, cy1, cw, 23)
    cy1 += 14
  }

  // Column 2
  const col2paras = [
    'Integer vel dui dolor. Sed nibh nibh, consectetur at dui sapien ultrices lorem, in fermentum ipsum nisl sit amet mauris. Maecenas accumsan nibh eget sapien lacinia, at finibus lorem bibendum. Integer vel diam magna. Nulla facilisi. Mauris luctus sem vel consectetur rhoncus. Aenean interdum mollis libero. Sed ut justo vel sapien vestibulum iaculis a sed est.',
    'Nullam vehicula leo vel lorem suscipit, id mollis sapien ornare. In ex urna, finibus nec luctus non, maximus scelerisque massa. Cras lacinia quam ac nisl ornare, et imperdiet elit consequat. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. In et blandit erat. Vivamus non nisi facilisis, posuere est at, hendrerit elit. consectetur vel, condimentum a enim. Aliquam nec, lobortis in mi. Curabitur tincidunt, tortor a molestie venenatis,',
  ]
  let cy2 = y
  for (const p of col2paras) {
    cy2 = drawJustified(ctx, p, c2x, cy2, cw, 23)
    cy2 += 14
  }

  // Column 3: text + pull quote + small image
  const col3paras = [
    'Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.',
    'Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis.',
    'Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor.',
  ]
  let cy3 = y
  for (const p of col3paras) {
    cy3 = drawJustified(ctx, p, c3x, cy3, cw, 23)
    cy3 += 14
  }

  // Pull quote
  ctx.font = 'italic bold 22px Georgia,"Times New Roman",serif'
  ctx.fillStyle = INK
  const pullQuote = 'History is a relentless master. It has no present, only the past rushing into the future'
  cy3 = drawJustified(ctx, pullQuote, c3x, cy3 + 8, cw, 30)
  cy3 += 18

  // Small dark image block (simulated)
  const smallImgH = 130
  const smGrad = ctx.createLinearGradient(c3x, cy3, c3x + cw, cy3 + smallImgH)
  smGrad.addColorStop(0,   '#1A1410')
  smGrad.addColorStop(0.5, '#2B1F18')
  smGrad.addColorStop(1,   '#0D0A08')
  ctx.fillStyle = smGrad
  ctx.fillRect(c3x, cy3, cw, smallImgH)
  // Grid lines on small image
  ctx.strokeStyle = 'rgba(255,255,255,0.06)'
  ctx.lineWidth = 1
  for (let gx = c3x + 20; gx < c3x + cw; gx += 20) {
    ctx.beginPath(); ctx.moveTo(gx, cy3); ctx.lineTo(gx, cy3 + smallImgH); ctx.stroke()
  }
  for (let gy = cy3 + 20; gy < cy3 + smallImgH; gy += 20) {
    ctx.beginPath(); ctx.moveTo(c3x, gy); ctx.lineTo(c3x + cw, gy); ctx.stroke()
  }
  cy3 += smallImgH + 16

  // Column dividers
  ctx.fillStyle = '#B0A48C'
  const colBottomY = Math.max(cy1, cy2, cy3)
  ctx.fillRect(c2x - colGap/2, y, 1, colBottomY - y)
  ctx.fillRect(c3x - colGap/2, y, 1, colBottomY - y)

  y = colBottomY + 40

  // ── Footer rule ───────────────────────────────────────────────────────
  ctx.fillStyle = INK
  ctx.fillRect(M, y, W - M*2, 2)
  y += 18

  ctx.font = '500 13px "AvantGarde","Century Gothic",sans-serif'
  ctx.fillStyle = MUTED
  ctx.textAlign = 'left'
  ctx.fillText('WWW.CHERRY.COM', M, y + 13)
  ctx.textAlign = 'right'
  ctx.fillText('PAGE 1', W - M, y + 13)

  return c
}

// ─────────────────────────────────────────────────────────────────────────────

export function ShredderLanding({ onComplete }: Props) {
  const rootRef          = useRef<HTMLDivElement>(null)
  const canvasRef        = useRef<HTMLCanvasElement>(null)
  const barRef           = useRef<HTMLDivElement>(null)
  const hintRef          = useRef<HTMLDivElement>(null)
  const rawRef           = useRef(0)
  const velRef           = useRef(0)
  const elapsedRef       = useRef(0)
  const lastTsRef        = useRef<number | null>(null)
  const audioRef         = useRef<HTMLAudioElement | null>(null)
  const scrollTimerRef   = useRef<ReturnType<typeof setTimeout> | null>(null)
  const audioPlayingRef  = useRef(false)
  const rafRef           = useRef<number | undefined>(undefined)
  const portfolioRef     = useRef(false)
  const completeFiredRef = useRef(false)
  const npRef            = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx    = canvas.getContext('2d')!
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'
    const root = rootRef.current!

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

    // ── Audio ─────────────────────────────────────────────────────────
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
      if (scrollTimerRef.current) { clearTimeout(scrollTimerRef.current); scrollTimerRef.current = null }
      if (audioPlayingRef.current) return
      audio.play().then(() => { audioPlayingRef.current = true }).catch(() => {})
    }
    const stopAudio = () => {
      scrollTimerRef.current = null
      if (!audioPlayingRef.current) return
      audio.pause()
      audioPlayingRef.current = false
    }
    const scheduleStop = () => {
      if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current)
      scrollTimerRef.current = setTimeout(stopAudio, 220)
    }

    // ── Load photo then build newspaper ──────────────────────────────
    const photo = new Image()
    photo.src = '/images/hero-landing.jpg'

    const startLoop = () => {
      npRef.current = buildNewspaper(photo)
      rafRef.current = requestAnimationFrame(tick)
    }

    if (photo.complete && photo.naturalWidth > 0) {
      startLoop()
    } else {
      photo.onload = startLoop
      // Fallback: if photo fails just build without it
      photo.onerror = () => {
        const blank = document.createElement('canvas')
        blank.width = 1; blank.height = 1
        photo.onload = null
        npRef.current = buildNewspaper(blank as unknown as HTMLImageElement)
        rafRef.current = requestAnimationFrame(tick)
      }
    }

    // ── Render loop ───────────────────────────────────────────────────
    const tick = (ts: number) => {
      if (!npRef.current) { rafRef.current = requestAnimationFrame(tick); return }

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
      const np  = npRef.current

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

      if (portfolioRef.current) {
        rafRef.current = requestAnimationFrame(tick)
        return
      }

      const iW      = np.width
      const iH      = np.height
      const srcW    = iW
      const srcH    = iW * (H / W)
      const maxSrcY = Math.max(0, iH - srcH)

      if (raw <= SCROLL_FRAC) {
        const srcY = (raw / SCROLL_FRAC) * maxSrcY
        ctx.clearRect(0, 0, W, H)
        ctx.drawImage(np, 0, srcY, srcW, srcH, 0, 0, W, H)
        if (barRef.current)  barRef.current.style.display = 'none'
        if (hintRef.current) hintRef.current.style.opacity = raw > 0.02 ? '0' : '1'
      } else {
        if (barRef.current) barRef.current.style.display = 'flex'
        if (hintRef.current) hintRef.current.style.opacity = '0'

        const shredFrac = (raw - SCROLL_FRAC) / (1 - SCROLL_FRAC)
        const srcY      = maxSrcY
        const barY      = Math.round(H * (1 - shredFrac))
        const below     = H - barY

        ctx.clearRect(0, 0, W, H)
        if (barY > 0) {
          ctx.drawImage(np, 0, srcY, srcW, barY * (srcH / H), 0, 0, W, barY)
        }

        if (below > 0) {
          ctx.clearRect(0, barY, W, below)

          const velMag  = Math.min(Math.abs(vel), 1)
          const ampFrac = IDLE_AMP + (1 - IDLE_AMP) * velMag
          const numStrips = Math.ceil(W / STRIP_W)
          const scaleX    = srcW / W
          const belowSrcY = srcY + barY * (srcH / H)

          const pullFrac  = shredFrac < PULL_START ? 0 : (shredFrac - PULL_START) / (1 - PULL_START)
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
            ctx.shadowColor = 'rgba(0,0,0,0.38)'; ctx.shadowBlur = 5
            ctx.shadowOffsetX = 3; ctx.shadowOffsetY = 2
            for (let b = 0; b < NOODLE_BANDS; b++) {
              ctx.drawImage(np, dstX0*scaleX, belowSrcY+b*bandSrcH, dstW*scaleX, bandSrcH,
                            dstX0+shifts[b], barY+b*bandH, dstW, bandH)
            }
            ctx.restore()

            for (let b = 0; b < NOODLE_BANDS; b++) {
              ctx.drawImage(np, dstX0*scaleX, belowSrcY+b*bandSrcH, dstW*scaleX, bandSrcH,
                            dstX0+shifts[b], barY+b*bandH, dstW, bandH)
            }

            for (let b = 0; b < NOODLE_BANDS; b++) {
              const x  = dstX0 + shifts[b]
              const by = barY + b * bandH
              const bh = bandH + 0.5
              ctx.fillStyle = 'rgba(255,252,240,0.55)'
              ctx.fillRect(x, by, 1.5, bh)
              ctx.fillStyle = 'rgba(0,0,0,0.18)'
              ctx.fillRect(x + dstW - 1, by, 1, bh)
            }

            const tipBands = 3
            const tipStart = NOODLE_BANDS - tipBands
            for (let b = tipStart; b < NOODLE_BANDS; b++) {
              const norm     = (b - tipStart) / tipBands
              const tipAlpha = (1 - norm) * 0.85
              const x  = dstX0 + shifts[b]
              const by = barY + b * bandH
              const grad = ctx.createLinearGradient(x, by, x, by + bandH)
              grad.addColorStop(0, 'rgba(255,255,255,0)')
              grad.addColorStop(1, `rgba(255,255,255,${1 - tipAlpha})`)
              ctx.fillStyle = grad
              ctx.fillRect(x, by, dstW, bandH + 0.5)
            }
          }
        }
        if (barRef.current) barRef.current.style.top = `${barY}px`
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    // ── Scroll input ──────────────────────────────────────────────────
    document.body.style.overflow = 'hidden'

    const onWheel = (e: WheelEvent) => {
      if (portfolioRef.current) return
      e.preventDefault()
      const d = e.deltaY / (window.innerHeight * 2.8)
      rawRef.current = Math.min(1, Math.max(0, rawRef.current + d))
      velRef.current = Math.max(-1, Math.min(1, velRef.current + d * 18))
      if (e.deltaY > 0 && rawRef.current > SCROLL_FRAC && rawRef.current < 0.99) startAudio()
      scheduleStop()
    }

    const TOUCH_DIV = 1.4
    let touchY = 0, lastTouchTime = 0, touchVelY = 0

    const onTouchStart = (e: TouchEvent) => {
      touchY = e.touches[0].clientY; lastTouchTime = e.timeStamp; touchVelY = 0
    }
    const onTouchMove = (e: TouchEvent) => {
      if (portfolioRef.current) return
      const currentY = e.touches[0].clientY
      const dy = touchY - currentY
      touchVelY = dy / (e.timeStamp - lastTouchTime || 1)
      touchY = currentY; lastTouchTime = e.timeStamp
      e.preventDefault()
      const d = dy / (window.innerHeight * TOUCH_DIV)
      rawRef.current = Math.min(1, Math.max(0, rawRef.current + d))
      velRef.current = Math.max(-1, Math.min(1, velRef.current + d * 18))
      if (d > 0 && rawRef.current > SCROLL_FRAC && rawRef.current < 0.99) startAudio()
      scheduleStop()
    }
    const onTouchEnd = () => {
      if (portfolioRef.current) return
      const d = (touchVelY * 80) / (window.innerHeight * TOUCH_DIV)
      rawRef.current = Math.min(1, Math.max(0, rawRef.current + d))
      velRef.current = Math.max(-1, Math.min(1, velRef.current + d * 18))
      scheduleStop()
    }

    window.addEventListener('wheel',      onWheel,      { passive: false })
    window.addEventListener('touchstart', onTouchStart, { passive: true  })
    window.addEventListener('touchmove',  onTouchMove,  { passive: false })
    window.addEventListener('touchend',   onTouchEnd,   { passive: true  })

    return () => {
      window.removeEventListener('resize',     resize)
      window.removeEventListener('wheel',      onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove',  onTouchMove)
      window.removeEventListener('touchend',   onTouchEnd)
      window.removeEventListener('wheel',      unlock)
      window.removeEventListener('touchstart', unlock)
      document.body.style.overflow = ''
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current)
      audio.pause()
      audioRef.current = null
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
