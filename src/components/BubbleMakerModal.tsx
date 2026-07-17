import { useEffect, useRef, useState } from 'react'

interface BubbleMakerModalProps {
  onClose: () => void
}

type Stage = 'start' | 'requesting' | 'listening' | 'denied' | 'unsupported'

interface Bubble {
  x: number
  y: number
  r: number
  vx: number
  vy: number
  wobblePhase: number
  wobbleFreq: number
  wobblePhase2: number
  wobbleFreq2: number
  driftTargetVx: number
  driftChangeAt: number
  floatSpeed: number
  hue: number
  born: number
  popAt: number
  popping: boolean
  popProgress: number
}

// Roughly where the wand's loop sits above the bottle graphic, as a fraction
// of the viewport — bubbles spawn from inside that ring.
const WAND_X_FRAC = 0.5
const WAND_Y_FRAC = 0.48

// Short radial notches around the wand's loop, giving its rim a grooved,
// knurled-grip texture instead of a plain smooth ring.
const LOOP_CENTER = { x: 43, y: 30 }
const LOOP_RADIUS = { x: 25, y: 27 }
const GROOVE_COUNT = 26
const WAND_GROOVES = Array.from({ length: GROOVE_COUNT }, (_, i) => {
  const angle = (i / GROOVE_COUNT) * Math.PI * 2
  const cos = Math.cos(angle)
  const sin = Math.sin(angle)
  return {
    // Kept within the ring's 6px-wide stroke band (roughly 0.88-1.11 of the
    // path radius) so the notches read as carved into the rim, not poking
    // past its inner or outer edge.
    x1: LOOP_CENTER.x + cos * LOOP_RADIUS.x * 0.91,
    y1: LOOP_CENTER.y + sin * LOOP_RADIUS.y * 0.91,
    x2: LOOP_CENTER.x + cos * LOOP_RADIUS.x * 1.08,
    y2: LOOP_CENTER.y + sin * LOOP_RADIUS.y * 1.08,
  }
})

// Little fizz bubbles rising inside the bottle's liquid — varied position,
// size, speed and start delay so they don't read as a single repeating loop.
const LIQUID_FIZZ = [
  { cx: 23, r: 2.1, dur: 2.8, delay: 0 },
  { cx: 33, r: 1.5, dur: 2.3, delay: 0.5 },
  { cx: 45, r: 2.4, dur: 3.1, delay: 1 },
  { cx: 55, r: 1.3, dur: 2.5, delay: 1.4 },
  { cx: 62, r: 1.8, dur: 2.9, delay: 0.8 },
  { cx: 28, r: 1.2, dur: 2.4, delay: 1.8 },
]

export function BubbleMakerModal({ onClose }: BubbleMakerModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const bubblesRef = useRef<Bubble[]>([])
  const rafRef = useRef<number | undefined>(undefined)
  const energyRef = useRef(0)
  const spawnDebtRef = useRef(0)

  const audioCtxRef = useRef<AudioContext | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const [stage, setStage] = useState<Stage>(() => (
    !navigator.mediaDevices?.getUserMedia ? 'unsupported' : 'start'
  ))

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  useEffect(() => {
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prevOverflow }
  }, [])

  const stopMic = () => {
    streamRef.current?.getTracks().forEach(track => track.stop())
    streamRef.current = null
    if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
      audioCtxRef.current.close()
    }
    audioCtxRef.current = null
    energyRef.current = 0
  }

  const start = async () => {
    setStage('requesting')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream

      const audioCtx = new AudioContext()
      audioCtxRef.current = audioCtx
      const source = audioCtx.createMediaStreamSource(stream)
      const analyser = audioCtx.createAnalyser()
      analyser.fftSize = 1024
      analyser.smoothingTimeConstant = 0.6
      source.connect(analyser)

      const waveData = new Uint8Array(analyser.fftSize)

      const sample = () => {
        analyser.getByteTimeDomainData(waveData)
        let sumSq = 0
        for (let i = 0; i < waveData.length; i++) {
          const v = (waveData[i] - 128) / 128
          sumSq += v * v
        }
        const rms = Math.sqrt(sumSq / waveData.length)
        // Low threshold and a steep ramp — even a light breath should read as a strong blow,
        // while staying above typical room-noise / mic self-noise levels.
        const level = Math.max(0, Math.min(1, (rms - 0.012) * 20))
        // smooth toward the new reading so it feels like a breath, not a spike meter
        energyRef.current += (level - energyRef.current) * 0.4
        requestAnimationFrame(sample)
      }
      sample()

      setStage('listening')
    } catch {
      setStage('denied')
    }
  }

  useEffect(() => () => stopMic(), [])

  // physics + render loop — runs regardless of mic stage so the canvas is
  // always sized and ready the moment listening starts
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    let width = window.innerWidth
    let height = window.innerHeight

    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      const ctx = canvas.getContext('2d')
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    let lastTime = performance.now()

    // Two non-harmonic sine terms layered together read as a free, wandering
    // drift rather than a single mechanical back-and-forth sway. Shared by
    // drawing and click hit-testing so a bubble pops where it visibly is.
    const wobbleXFor = (b: Bubble, now: number) => {
      const age = now - b.born
      return (
        Math.sin(age * 0.001 * b.wobbleFreq * Math.PI * 2 + b.wobblePhase) * (8 + b.r * 0.3) +
        Math.sin(age * 0.001 * b.wobbleFreq2 * Math.PI * 2 + b.wobblePhase2) * (5 + b.r * 0.16)
      )
    }

    const spawnBubble = () => {
      // Spawn tightly inside the wand's loop so bubbles visibly emerge through it.
      const wandX = width * WAND_X_FRAC + (Math.random() - 0.5) * 22
      const wandY = height * WAND_Y_FRAC + (Math.random() - 0.5) * 14
      // Square-root the energy so even a light blow is treated as nearly full
      // strength — bubbles come out big from the very first breath.
      const boosted = Math.sqrt(energyRef.current)
      const r = 34 + Math.random() * (26 + boosted * 55)
      const now = performance.now()
      // Each bubble keeps rising at its own steady pace for its whole life —
      // fast enough to visibly clear the wand instead of piling up on top of
      // the bubbles spawned right after it.
      const floatSpeed = 85 + Math.random() * 95
      bubblesRef.current.push({
        x: wandX,
        y: wandY,
        r,
        vx: (Math.random() - 0.5) * 32,
        vy: -(floatSpeed + boosted * 40),
        wobblePhase: Math.random() * Math.PI * 2,
        wobbleFreq: 0.5 + Math.random() * 0.7,
        wobblePhase2: Math.random() * Math.PI * 2,
        wobbleFreq2: 0.9 + Math.random() * 1.3,
        driftTargetVx: (Math.random() - 0.5) * 260,
        driftChangeAt: now + 400 + Math.random() * 700,
        floatSpeed,
        hue: Math.random() * 360,
        born: now,
        // Long enough to comfortably rise clear across the screen before
        // either floating off the top or popping.
        popAt: 4500 + Math.random() * 4000,
        popping: false,
        popProgress: 0,
      })
    }

    const draw = (ctx: CanvasRenderingContext2D, now: number) => {
      ctx.clearRect(0, 0, width, height)

      for (const b of bubblesRef.current) {
        const age = now - b.born
        const drawX = b.x + wobbleXFor(b, now)
        const drawY = b.y
        // Grows out of the wand's loop over its first moment instead of popping
        // in at full size.
        const emerge = b.popping ? 1 : Math.min(1, age / 260)
        const scale = b.popping ? Math.max(0, 1 - b.popProgress * 1.4) : emerge
        if (scale <= 0.02) continue
        const r = b.r * (b.popping ? 1 + b.popProgress * 0.6 : 1) * scale
        const alpha = b.popping ? Math.max(0, 1 - b.popProgress) : Math.min(1, age / 220)

        ctx.save()
        ctx.globalAlpha = alpha
        ctx.translate(drawX, drawY)

        const grad = ctx.createRadialGradient(-r * 0.3, -r * 0.35, r * 0.1, 0, 0, r)
        grad.addColorStop(0, 'rgba(255,255,255,0.9)')
        grad.addColorStop(0.25, `hsla(${b.hue}, 85%, 80%, 0.35)`)
        grad.addColorStop(0.6, `hsla(${(b.hue + 80) % 360}, 90%, 70%, 0.22)`)
        grad.addColorStop(1, 'rgba(255,255,255,0.05)')
        ctx.beginPath()
        ctx.arc(0, 0, r, 0, Math.PI * 2)
        ctx.fillStyle = grad
        ctx.fill()

        ctx.lineWidth = Math.max(1, r * 0.045)
        ctx.strokeStyle = `hsla(${(b.hue + 160) % 360}, 90%, 85%, 0.55)`
        ctx.stroke()

        ctx.beginPath()
        ctx.ellipse(-r * 0.35, -r * 0.4, r * 0.22, r * 0.14, -0.6, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(255,255,255,0.85)'
        ctx.fill()

        ctx.restore()
      }
    }

    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - lastTime) / 1000)
      lastTime = now

      const energy = energyRef.current
      if (energy > 0.015) {
        const boosted = Math.sqrt(energy)
        spawnDebtRef.current += (8 + boosted * 30) * dt
        while (spawnDebtRef.current >= 1) {
          spawnBubble()
          spawnDebtRef.current -= 1
        }
      }

      const next: Bubble[] = []
      for (const b of bubblesRef.current) {
        if (!b.popping) {
          const age = now - b.born
          // Periodically re-roll a target sideways speed and ease toward it —
          // a slow random walk, like a bubble catching little gusts, so it
          // actually wanders across the screen instead of oscillating in place.
          if (now > b.driftChangeAt) {
            b.driftTargetVx = (Math.random() - 0.5) * 260
            b.driftChangeAt = now + 400 + Math.random() * 700
          }
          b.vx += (b.driftTargetVx - b.vx) * Math.min(1, dt * 1.3)
          b.vy += Math.sin(age * 0.0009 + b.wobblePhase2) * 5 * dt
          b.x += b.vx * dt
          b.y += b.vy * dt
          b.vy = Math.min(b.vy, -b.floatSpeed) * 0.994
          if (age > b.popAt || b.y < -b.r * 2) b.popping = true
        } else {
          b.popProgress += dt * 4.2
        }
        if (!(b.popping && b.popProgress >= 1)) next.push(b)
      }
      bubblesRef.current = next

      const ctx = canvas.getContext('2d')
      if (ctx) draw(ctx, now)
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)

    // Clicking/tapping a bubble bursts it early — hit-test from the topmost
    // (most recently drawn) bubble down, using its actual on-screen position.
    const handlePointerDown = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      const px = e.clientX - rect.left
      const py = e.clientY - rect.top
      const now = performance.now()
      for (let i = bubblesRef.current.length - 1; i >= 0; i--) {
        const b = bubblesRef.current[i]
        if (b.popping) continue
        const emerge = Math.min(1, (now - b.born) / 260)
        const r = b.r * emerge * 1.15
        const dx = px - (b.x + wobbleXFor(b, now))
        const dy = py - b.y
        if (dx * dx + dy * dy <= r * r) {
          b.popping = true
          break
        }
      }
    }
    canvas.addEventListener('pointerdown', handlePointerDown)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', resize)
      canvas.removeEventListener('pointerdown', handlePointerDown)
      bubblesRef.current = []
    }
  }, [])

  return (
    <div className="bm-modal-backdrop">
      <button className="bm-modal-close" onClick={onClose} aria-label="Close">✕</button>

      <canvas ref={canvasRef} className="bm-canvas" />

      <div className="bm-wand" aria-hidden="true">
        <svg viewBox="0 0 86 180" fill="none">
          <defs>
            <linearGradient id="bm-liquid-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#a8ecf7" />
              <stop offset="100%" stopColor="#2fa9cc" />
            </linearGradient>
            <clipPath id="bm-liquid-clip">
              <rect x="15" y="147" width="56" height="28" rx="9" />
            </clipPath>
          </defs>
          <ellipse cx="43" cy="30" rx="25" ry="27" stroke="#3fb6d8" strokeWidth="6" fill="rgba(255,255,255,0.06)" />
          <g>
            {WAND_GROOVES.map((g, i) => (
              <line
                key={i}
                x1={g.x1}
                y1={g.y1}
                x2={g.x2}
                y2={g.y2}
                stroke={i % 2 === 0 ? 'rgba(15,70,88,0.32)' : 'rgba(255,255,255,0.4)'}
                strokeWidth={1.1}
                strokeLinecap="round"
              />
            ))}
          </g>
          <path d="M43 57 C 40 92, 39 125, 37 155" stroke="#3fb6d8" strokeWidth="6" strokeLinecap="round" fill="none" />
          <rect x="14" y="112" width="58" height="64" rx="10" fill="rgba(255,255,255,0.14)" stroke="rgba(255,255,255,0.5)" strokeWidth="2" />
          <rect x="14" y="146" width="58" height="30" rx="10" fill="url(#bm-liquid-grad)" opacity="0.92" />
          <g clipPath="url(#bm-liquid-clip)">
            {LIQUID_FIZZ.map((f, i) => (
              <circle key={i} cx={f.cx} cy={176} r={f.r} fill="rgba(255,255,255,0.85)">
                <animate attributeName="cy" values="176;150;176" dur={`${f.dur}s`} begin={`${f.delay}s`} repeatCount="indefinite" />
                <animate attributeName="opacity" values="0;0.85;0.85;0" keyTimes="0;0.15;0.85;1" dur={`${f.dur}s`} begin={`${f.delay}s`} repeatCount="indefinite" />
              </circle>
            ))}
          </g>
          <ellipse cx="43" cy="148" rx="26" ry="2.5" fill="rgba(255,255,255,0.4)" />
          <rect x="10" y="102" width="66" height="14" rx="6" fill="#3fb6d8" />
        </svg>
      </div>

      {stage !== 'listening' && (
        <div className="bm-overlay">
          {stage === 'start' && (
            <>
              <span className="bm-overlay-icon">🫧</span>
              <p className="bm-overlay-text">Turn on your mic and blow —<br />even a light breath sends big bubbles floating up.<br />Click one to pop it.</p>
              <button className="bm-start-btn" onClick={start}>Turn on microphone</button>
            </>
          )}
          {stage === 'requesting' && (
            <p className="bm-overlay-text">Dipping the wand…</p>
          )}
          {stage === 'denied' && (
            <>
              <p className="bm-overlay-text">Couldn't reach the microphone. Check your browser's mic permission and try again.</p>
              <button className="bm-start-btn" onClick={start}>Try again</button>
            </>
          )}
          {stage === 'unsupported' && (
            <p className="bm-overlay-text">This browser doesn't support microphone access.</p>
          )}
        </div>
      )}

      <div className="bm-hint">
        {stage === 'listening' ? 'BLOW TO MAKE BUBBLES · CLICK ONE TO POP IT' : 'A BUBBLE MAKER PLAYGROUND'}
      </div>
    </div>
  )
}
