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

// Offscreen newspaper dimensions — tall so there's room to pan
const NP_W = 1200
const NP_H = 3200

interface Props { onComplete: () => void }

// ─── Newspaper renderer ────────────────────────────────────────────────────
function buildNewspaper(): HTMLCanvasElement {
  const c   = document.createElement('canvas')
  c.width   = NP_W
  c.height  = NP_H
  const ctx = c.getContext('2d')!
  const W   = NP_W
  const pad = 56  // outer margin

  const BG      = '#F2ECD8'
  const INK     = '#1A1410'
  const INK2    = '#3A3028'
  const RULE    = '#1A1410'
  const MUTED   = '#6B5F52'

  // ── Background ──────────────────────────────────────────────────────
  ctx.fillStyle = BG
  ctx.fillRect(0, 0, W, NP_H)

  // Subtle paper grain overlay
  for (let i = 0; i < 18000; i++) {
    const gx = Math.random() * W
    const gy = Math.random() * NP_H
    const ga = Math.random() * 0.025
    ctx.fillStyle = `rgba(0,0,0,${ga})`
    ctx.fillRect(gx, gy, 1, 1)
  }

  let y = pad

  // ── Top rule ────────────────────────────────────────────────────────
  ctx.fillStyle = RULE
  ctx.fillRect(pad, y, W - pad * 2, 3)
  y += 10

  // ── Dateline strip ──────────────────────────────────────────────────
  ctx.font = '500 22px "AvantGarde", "Century Gothic", sans-serif'
  ctx.fillStyle = INK2
  ctx.textAlign = 'left'
  ctx.fillText('VOL. CXLII . . . No. 49,284', pad, y + 22)
  ctx.textAlign = 'center'
  ctx.fillText('THE DESIGN OBSERVER', W / 2, y + 22)
  ctx.textAlign = 'right'
  ctx.fillText('SATURDAY, MAY 30, 2026', W - pad, y + 22)
  y += 34

  // Thin rule below dateline
  ctx.fillStyle = RULE
  ctx.fillRect(pad, y, W - pad * 2, 1)
  y += 6

  ctx.font = 'italic 18px Georgia, serif'
  ctx.fillStyle = MUTED
  ctx.textAlign = 'center'
  ctx.fillText('"All the design that\'s fit to ship"', W / 2, y + 18)
  y += 30

  // ── Double masthead rule ─────────────────────────────────────────────
  ctx.fillStyle = RULE
  ctx.fillRect(pad, y, W - pad * 2, 4)
  ctx.fillRect(pad, y + 7, W - pad * 2, 1.5)
  y += 22

  // ── MASTHEAD ─────────────────────────────────────────────────────────
  ctx.font = 'bold 128px Georgia, "Times New Roman", serif'
  ctx.fillStyle = INK
  ctx.textAlign = 'center'
  ctx.fillText('SRI CHERRY', W / 2, y + 120)
  y += 136

  // Masthead sub-rule
  ctx.fillStyle = RULE
  ctx.fillRect(pad, y, W - pad * 2, 1.5)
  ctx.fillRect(pad, y + 5, W - pad * 2, 4)
  y += 26

  // ── Section flags row ───────────────────────────────────────────────
  const flags = ['INTERACTION DESIGN', 'PRODUCT', 'RESEARCH', 'AI', 'ACCESSIBILITY']
  const flagW = (W - pad * 2) / flags.length
  ctx.font = '600 17px "AvantGarde","Century Gothic",sans-serif'
  ctx.fillStyle = INK
  flags.forEach((f, i) => {
    const fx = pad + i * flagW
    ctx.textAlign = 'center'
    ctx.fillText(f, fx + flagW / 2, y + 20)
    if (i > 0) {
      ctx.fillStyle = RULE
      ctx.fillRect(fx, y, 1, 26)
      ctx.fillStyle = INK
    }
  })
  y += 32

  ctx.fillStyle = RULE
  ctx.fillRect(pad, y, W - pad * 2, 2)
  y += 20

  // ── TODAY'S EDITION kicker ───────────────────────────────────────────
  ctx.font = '600 15px "AvantGarde","Century Gothic",sans-serif'
  ctx.fillStyle = MUTED
  ctx.textAlign = 'left'
  ctx.fillText('TODAY\'S EDITION', pad, y + 14)
  y += 32

  // ── MAIN HEADLINE ────────────────────────────────────────────────────
  ctx.font = 'bold 74px Georgia,"Times New Roman",serif'
  ctx.fillStyle = INK
  ctx.textAlign = 'left'
  const hl1 = 'Designing at the Edge'
  const hl2 = 'of What\'s Possible'
  ctx.fillText(hl1, pad, y + 74)
  y += 84
  ctx.fillText(hl2, pad, y + 74)
  y += 92

  // Deck / subheadline
  ctx.font = 'italic 26px Georgia,"Times New Roman",serif'
  ctx.fillStyle = INK2
  ctx.fillText('A portfolio spanning interaction, AI, and the frontier of emerging', pad, y + 26)
  y += 32
  ctx.fillText('technology — built to endure, designed to delight.', pad, y + 26)
  y += 46

  // Byline rule
  ctx.fillStyle = RULE
  ctx.fillRect(pad, y, W - pad * 2, 1)
  y += 8

  // Byline
  ctx.font = '600 18px "AvantGarde","Century Gothic",sans-serif'
  ctx.fillStyle = MUTED
  ctx.textAlign = 'left'
  ctx.fillText('By SRI CHERRY KOTAMREDDY  ·  Lead Interaction Designer  ·  Qapita, Gaian Solutions', pad, y + 18)
  y += 30

  ctx.fillStyle = RULE
  ctx.fillRect(pad, y, W - pad * 2, 1)
  y += 24

  // ── THREE-COLUMN BODY ────────────────────────────────────────────────
  const colGap  = 32
  const colW    = (W - pad * 2 - colGap * 2) / 3
  const col2X   = pad + colW + colGap
  const col3X   = col2X + colW + colGap

  // Helper: draw wrapped body text, returns final y
  function drawBody(
    text: string, x: number, startY: number, width: number, lineH: number, maxLines?: number
  ): number {
    ctx.textAlign = 'left'
    const words = text.split(' ')
    let line = ''
    let cy = startY
    let count = 0
    for (const w of words) {
      const test = line ? line + ' ' + w : w
      if (ctx.measureText(test).width > width) {
        if (maxLines && count >= maxLines) { ctx.fillText(line + '…', x, cy); return cy + lineH }
        ctx.fillText(line, x, cy)
        cy += lineH
        count++
        line = w
      } else {
        line = test
      }
    }
    if (line) { ctx.fillText(line, x, cy); cy += lineH }
    return cy
  }

  // Column 1 — intro
  ctx.font = '18px Georgia,"Times New Roman",serif'
  ctx.fillStyle = INK
  const col1Text = `Sri Cherry Kotamreddy is an interaction designer operating at the intersection of research, systems thinking, and emerging technology. With a career spanning fintech, broadcast media, civic technology, and healthcare, she has built a reputation for transforming complexity into clarity.\n\nHer work on the Cashless Equity platform at Qapita brought financial participation to thousands of employees across India and global markets, simplifying regulatory-heavy workflows into seamless digital experiences. The platform is now live in over a dozen countries.\n\nAt Gaian Solutions, she led the design of Museo, a broadcast auction platform powered by next-generation ATSC 3.0 television standards. Showcased at CES 2024, the product earned a CES Innovation Award and demonstrated what happens when interaction design meets broadcast infrastructure.`

  let col1Y = y
  const col1Lines = col1Text.split('\n\n')
  for (const para of col1Lines) {
    col1Y = drawBody(para, pad, col1Y, colW, 28)
    col1Y += 12
  }

  // Column 2 — quote block + continued body
  let col2Y = y

  // Pull quote box
  ctx.fillStyle = INK
  ctx.fillRect(col2X, col2Y, colW, 3)
  col2Y += 18
  ctx.font = 'italic bold 28px Georgia,"Times New Roman",serif'
  ctx.fillStyle = INK
  col2Y = drawBody('"The hand is the window on the mind — every era of innovation reflects how our hands think."', col2X, col2Y, colW, 38)
  col2Y += 6
  ctx.fillStyle = RULE
  ctx.fillRect(col2X, col2Y, colW, 3)
  col2Y += 14
  ctx.font = '600 16px "AvantGarde","Century Gothic",sans-serif'
  ctx.fillStyle = MUTED
  ctx.fillText('— Immanuel Kant', col2X, col2Y)
  col2Y += 32

  ctx.font = '18px Georgia,"Times New Roman",serif'
  ctx.fillStyle = INK
  const col2Text = `The philosophy driving Sri's practice comes from Kant: the belief that how we use our hands reveals how we think. Applied to design, it means every interaction — every gesture, tap, or voice command — is a window into the minds of both user and designer.\n\nFrom embodied interfaces and social robots to equity workflows and government digital services, the throughline is empathy at scale. Sri's process blends contextual inquiry, usability testing, and data analysis into a method that is as rigorous as it is human.`
  for (const para of col2Text.split('\n\n')) {
    col2Y = drawBody(para, col2X, col2Y, colW, 28)
    col2Y += 12
  }

  // Column 3 — career highlights sidebar
  let col3Y = y

  // Sidebar label
  ctx.fillStyle = INK
  ctx.fillRect(col3X, col3Y, colW, 2)
  col3Y += 10
  ctx.font = '700 14px "AvantGarde","Century Gothic",sans-serif'
  ctx.fillStyle = MUTED
  ctx.textAlign = 'left'
  ctx.fillText('SELECTED WORK', col3X, col3Y + 14)
  col3Y += 28
  ctx.fillStyle = RULE
  ctx.fillRect(col3X, col3Y, colW, 1)
  col3Y += 14

  const works = [
    { year: '2024', title: 'Cashless Equity Ownership', co: 'Qapita', tag: 'Fintech · B2B SaaS' },
    { year: '2024', title: 'Museo Broadcast Auction', co: 'Gaian Solutions', tag: 'CES Innovation Award' },
    { year: '2023', title: 'Onboarding Redesign', co: 'Independent', tag: '+40% 7-day retention' },
    { year: '2022', title: 'Inclusive Search & Discovery', co: 'Civic Tech', tag: 'WCAG 2.2 AA' },
    { year: '2021', title: 'Zero-to-One Health Platform', co: 'Stealth', tag: '0→1 in 16 weeks' },
  ]
  for (const w of works) {
    ctx.font = '700 16px "AvantGarde","Century Gothic",sans-serif'
    ctx.fillStyle = INK
    ctx.fillText(w.year + '  ' + w.title, col3X, col3Y + 16)
    col3Y += 20
    ctx.font = '15px Georgia,"Times New Roman",serif'
    ctx.fillStyle = INK2
    ctx.fillText(w.co, col3X, col3Y + 14)
    col3Y += 18
    ctx.font = 'italic 14px Georgia,"Times New Roman",serif'
    ctx.fillStyle = MUTED
    ctx.fillText(w.tag, col3X, col3Y + 14)
    col3Y += 28
    ctx.fillStyle = '#C8BEA8'
    ctx.fillRect(col3X, col3Y, colW, 0.5)
    col3Y += 14
  }

  // Column dividers
  ctx.fillStyle = '#C0B49A'
  ctx.fillRect(col2X - colGap / 2, y, 1, Math.max(col1Y, col2Y, col3Y) - y)
  ctx.fillRect(col3X - colGap / 2, y, 1, Math.max(col1Y, col2Y, col3Y) - y)

  y = Math.max(col1Y, col2Y, col3Y) + 36

  // ── Full-width rule ──────────────────────────────────────────────────
  ctx.fillStyle = RULE
  ctx.fillRect(pad, y, W - pad * 2, 2)
  y += 2
  ctx.fillRect(pad, y + 4, W - pad * 2, 1)
  y += 24

  // ── FULL-WIDTH FEATURE SECTION ───────────────────────────────────────
  ctx.font = '700 14px "AvantGarde","Century Gothic",sans-serif'
  ctx.fillStyle = MUTED
  ctx.textAlign = 'left'
  ctx.fillText('FEATURED · SPATIAL & EMBODIED INTERACTION', pad, y + 14)
  y += 30

  ctx.font = 'bold 58px Georgia,"Times New Roman",serif'
  ctx.fillStyle = INK
  ctx.fillText('The Next Era of Human–Technology Interaction', pad, y + 58)
  y += 74

  ctx.font = 'italic 22px Georgia,"Times New Roman",serif'
  ctx.fillStyle = INK2
  ctx.fillText('Spatial, embodied, and multimodal systems are rewriting the rules. Sri is building toward it.', pad, y + 22)
  y += 44

  // ── Photo / graphic block ────────────────────────────────────────────
  const photoH = 320
  // Gradient fill simulating a photo
  const grad = ctx.createLinearGradient(pad, y, W - pad, y + photoH)
  grad.addColorStop(0,   '#1B3A3A')
  grad.addColorStop(0.3, '#2B5252')
  grad.addColorStop(0.6, '#1B4040')
  grad.addColorStop(1,   '#0D2828')
  ctx.fillStyle = grad
  ctx.fillRect(pad, y, W - pad * 2, photoH)

  // Caption overlay
  ctx.fillStyle = 'rgba(0,0,0,0.38)'
  ctx.fillRect(pad, y + photoH - 52, W - pad * 2, 52)

  // Grid lines — suggest a UI wireframe
  ctx.strokeStyle = 'rgba(255,255,255,0.07)'
  ctx.lineWidth = 1
  for (let gx = pad + 80; gx < W - pad; gx += 80) {
    ctx.beginPath(); ctx.moveTo(gx, y); ctx.lineTo(gx, y + photoH); ctx.stroke()
  }
  for (let gy = y + 60; gy < y + photoH - 52; gy += 60) {
    ctx.beginPath(); ctx.moveTo(pad, gy); ctx.lineTo(W - pad, gy); ctx.stroke()
  }

  // Central label in photo
  ctx.font = 'bold 36px Georgia,"Times New Roman",serif'
  ctx.fillStyle = 'rgba(255,255,255,0.85)'
  ctx.textAlign = 'center'
  ctx.fillText('Interaction Design · AI · Spatial Computing', W / 2, y + photoH / 2 + 12)

  ctx.font = '600 15px "AvantGarde","Century Gothic",sans-serif'
  ctx.fillStyle = 'rgba(255,255,255,0.55)'
  ctx.fillText('Selected works 2019 – 2026', W / 2, y + photoH - 22)

  y += photoH + 20

  // ── TWO-COLUMN LOWER SECTION ─────────────────────────────────────────
  const wideColW = (W - pad * 2 - colGap) / 2
  const col4X    = pad
  const col5X    = pad + wideColW + colGap

  ctx.fillStyle = RULE
  ctx.fillRect(pad, y, W - pad * 2, 1)
  y += 20

  ctx.font = '700 14px "AvantGarde","Century Gothic",sans-serif'
  ctx.fillStyle = MUTED
  ctx.textAlign = 'left'
  ctx.fillText('ON PROCESS', col4X, y + 14)
  ctx.fillText('ON THE FUTURE', col5X, y + 14)
  y += 26

  ctx.fillStyle = RULE
  ctx.fillRect(pad, y, W - pad * 2, 1)
  y += 18

  ctx.font = 'bold 34px Georgia,"Times New Roman",serif'
  ctx.fillStyle = INK
  ctx.fillText('Research-first,', col4X, y + 34)
  y += 42
  ctx.fillText('always.', col4X, y + 34)
  y += 46

  ctx.font = '18px Georgia,"Times New Roman",serif'
  ctx.fillStyle = INK
  const col4Body = `Every project Sri takes on begins with a question rather than an answer. Whether conducting contextual inquiry in a hospital ward or running usability tests with screen-reader users, the commitment is the same: understand before you design.\n\nThis approach led to a 40% improvement in 7-day retention on a mobile onboarding redesign and drove the accessibility overhaul of a government digital service to full WCAG 2.2 AA compliance.`
  let col4Y = y
  for (const para of col4Body.split('\n\n')) {
    col4Y = drawBody(para, col4X, col4Y, wideColW, 28)
    col4Y += 12
  }

  // Right column (col5) — starts at original y before left col body
  ctx.font = 'bold 34px Georgia,"Times New Roman",serif'
  ctx.fillStyle = INK
  let col5Y = y - 46 - 42 + 2  // align with left col headline start
  ctx.fillText('Spatial. Embodied.', col5X, col5Y + 34)
  col5Y += 42
  ctx.fillText('Multimodal.', col5X, col5Y + 34)
  col5Y += 46

  ctx.font = '18px Georgia,"Times New Roman",serif'
  ctx.fillStyle = INK
  const col5Body = `The canvas is open again. Spatial computing, voice-first interfaces, and gesture-driven systems are creating new vocabulary for interaction — one that Sri is actively shaping.\n\nFrom social robots designed to ease loneliness to gesture-based TV bidding showcased at CES, her portfolio demonstrates a consistent drive to push beyond the screen and ask what interaction can mean when it becomes truly physical, ambient, and intelligent.`
  for (const para of col5Body.split('\n\n')) {
    col5Y = drawBody(para, col5X, col5Y, wideColW, 28)
    col5Y += 12
  }

  // Divider between two lower columns
  ctx.fillStyle = '#C0B49A'
  ctx.fillRect(col5X - colGap / 2, y - 88, 1, Math.max(col4Y, col5Y) - (y - 88))

  y = Math.max(col4Y, col5Y) + 40

  // ── BOTTOM RULE + AD STRIP ───────────────────────────────────────────
  ctx.fillStyle = RULE
  ctx.fillRect(pad, y, W - pad * 2, 4)
  ctx.fillRect(pad, y + 8, W - pad * 2, 1)
  y += 24

  // "Ad" strip — actually a note to the reader
  const adGrad = ctx.createLinearGradient(pad, y, W - pad, y + 90)
  adGrad.addColorStop(0, '#E8694A')
  adGrad.addColorStop(1, '#C41C1C')
  ctx.fillStyle = adGrad
  ctx.fillRect(pad, y, W - pad * 2, 90)

  ctx.font = 'bold 32px Georgia,"Times New Roman",serif'
  ctx.fillStyle = '#fff'
  ctx.textAlign = 'center'
  ctx.fillText('Scroll further to see the portfolio →', W / 2, y + 38)
  ctx.font = 'italic 20px Georgia,"Times New Roman",serif'
  ctx.fillStyle = 'rgba(255,255,255,0.75)'
  ctx.fillText('cherryy.vercel.app  ·  sricherry.tweety@gmail.com', W / 2, y + 66)
  y += 106

  ctx.fillStyle = RULE
  ctx.fillRect(pad, y, W - pad * 2, 1)
  y += 20

  // ── PAGE FOOTER ──────────────────────────────────────────────────────
  ctx.font = '15px "AvantGarde","Century Gothic",sans-serif'
  ctx.fillStyle = MUTED
  ctx.textAlign = 'left'
  ctx.fillText('© 2026 The Design Observer. All rights reserved.', pad, y + 15)
  ctx.textAlign = 'right'
  ctx.fillText('Page A1', W - pad, y + 15)

  return c
}

// ──────────────────────────────────────────────────────────────────────────────

export function ShredderLanding({ onComplete }: Props) {
  const rootRef   = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const barRef    = useRef<HTMLDivElement>(null)
  const hintRef   = useRef<HTMLDivElement>(null)

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

    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'
    }
    resize()
    window.addEventListener('resize', resize)

    // Build newspaper offscreen canvas once
    npRef.current = buildNewspaper()
    const np = npRef.current

    // ── Shredder audio ────────────────────────────────────────────────
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

    // ── Render loop ───────────────────────────────────────────────────
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

      // Newspaper source dimensions — scale to fill screen width
      const iW      = np.width
      const iH      = np.height
      const srcW    = iW
      const srcH    = iW * (H / W)
      const maxSrcY = Math.max(0, iH - srcH)

      if (raw <= SCROLL_FRAC) {
        // Phase 1: pan newspaper top → bottom
        const srcY = (raw / SCROLL_FRAC) * maxSrcY
        ctx.clearRect(0, 0, W, H)
        ctx.drawImage(np, 0, srcY, srcW, srcH, 0, 0, W, H)
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
          ctx.drawImage(np, 0, srcY, srcW, barY * (srcH / H), 0, 0, W, barY)
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
                np,
                dstX0 * scaleX,  belowSrcY + b * bandSrcH,  dstW * scaleX,  bandSrcH,
                dstX0 + shifts[b], barY + b * bandH, dstW, bandH
              )
            }
            ctx.restore()

            for (let b = 0; b < NOODLE_BANDS; b++) {
              ctx.drawImage(
                np,
                dstX0 * scaleX,  belowSrcY + b * bandSrcH,  dstW * scaleX,  bandSrcH,
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

    rafRef.current = requestAnimationFrame(tick)

    // ── Scroll input ──────────────────────────────────────────────────
    document.body.style.overflow = 'hidden'

    const onWheel = (e: WheelEvent) => {
      if (portfolioRef.current) {
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
      if (e.deltaY > 0 && rawRef.current > SCROLL_FRAC && rawRef.current < 0.99) {
        startAudio()
      }
      scheduleStop()
    }

    const TOUCH_DIV = 1.4
    let touchY = 0
    let lastTouchTime = 0
    let touchVelY = 0

    const onTouchStart = (e: TouchEvent) => {
      touchY = e.touches[0].clientY
      lastTouchTime = e.timeStamp
      touchVelY = 0
    }
    const onTouchMove = (e: TouchEvent) => {
      const currentY = e.touches[0].clientY
      const dy = touchY - currentY
      const dt = e.timeStamp - lastTouchTime || 1
      touchVelY = dy / dt
      touchY = currentY
      lastTouchTime = e.timeStamp

      if (portfolioRef.current) {
        if (dy < 0 && window.scrollY === 0) {
          e.preventDefault()
          const d = dy / (window.innerHeight * TOUCH_DIV)
          rawRef.current = Math.min(1, Math.max(0, rawRef.current + d))
          velRef.current = Math.max(-1, Math.min(1, velRef.current + d * 18))
        }
        return
      }
      e.preventDefault()
      const d = dy / (window.innerHeight * TOUCH_DIV)
      rawRef.current = Math.min(1, Math.max(0, rawRef.current + d))
      velRef.current = Math.max(-1, Math.min(1, velRef.current + d * 18))
      if (d > 0 && rawRef.current > SCROLL_FRAC && rawRef.current < 0.99) {
        startAudio()
      }
      scheduleStop()
    }
    const onTouchEnd = () => {
      if (portfolioRef.current) return
      const momentum = touchVelY * 80
      const d = momentum / (window.innerHeight * TOUCH_DIV)
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
