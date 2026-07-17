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
  hue: number
  born: number
  popAt: number
  popping: boolean
  popProgress: number
}

// Roughly where the wand's loop sits above the bottle graphic, as a fraction
// of the viewport — bubbles spawn from this point.
const WAND_X_FRAC = 0.5
const WAND_Y_FRAC = 0.7

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

    const spawnBubble = () => {
      const wandX = width * WAND_X_FRAC + (Math.random() - 0.5) * 40
      const wandY = height * WAND_Y_FRAC
      // Square-root the energy so even a light blow is treated as nearly full
      // strength — bubbles come out big from the very first breath.
      const boosted = Math.sqrt(energyRef.current)
      const r = 34 + Math.random() * (26 + boosted * 55)
      bubblesRef.current.push({
        x: wandX,
        y: wandY,
        r,
        vx: (Math.random() - 0.5) * 18,
        vy: -(40 + Math.random() * 50 + boosted * 60),
        wobblePhase: Math.random() * Math.PI * 2,
        wobbleFreq: 0.6 + Math.random() * 0.9,
        hue: Math.random() * 360,
        born: performance.now(),
        popAt: 3200 + Math.random() * 3800,
        popping: false,
        popProgress: 0,
      })
    }

    const draw = (ctx: CanvasRenderingContext2D, now: number) => {
      ctx.clearRect(0, 0, width, height)

      for (const b of bubblesRef.current) {
        const age = now - b.born
        const wobbleX = Math.sin(age * 0.001 * b.wobbleFreq * Math.PI * 2 + b.wobblePhase) * (10 + b.r * 0.4)
        const drawX = b.x + wobbleX
        const drawY = b.y
        const scale = b.popping ? Math.max(0, 1 - b.popProgress * 1.4) : 1
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
          b.x += b.vx * dt
          b.y += b.vy * dt
          b.vy *= 0.985
          b.vx *= 0.99
          const age = now - b.born
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

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', resize)
      bubblesRef.current = []
    }
  }, [])

  return (
    <div className="bm-modal-backdrop">
      <button className="bm-modal-close" onClick={onClose} aria-label="Close">✕</button>

      <canvas ref={canvasRef} className="bm-canvas" />

      <div className="bm-wand" aria-hidden="true">
        <svg viewBox="0 0 86 180" fill="none">
          <ellipse cx="43" cy="30" rx="25" ry="27" stroke="#3fb6d8" strokeWidth="6" fill="rgba(255,255,255,0.06)" />
          <path d="M43 57 C 40 90, 40 100, 36 118" stroke="#3fb6d8" strokeWidth="6" strokeLinecap="round" fill="none" />
          <rect x="14" y="112" width="58" height="64" rx="10" fill="rgba(255,255,255,0.14)" stroke="rgba(255,255,255,0.5)" strokeWidth="2" />
          <rect x="14" y="146" width="58" height="30" rx="10" fill="#ffcf3f" opacity="0.9" />
          <rect x="10" y="102" width="66" height="14" rx="6" fill="#3fb6d8" />
        </svg>
      </div>

      {stage !== 'listening' && (
        <div className="bm-overlay">
          {stage === 'start' && (
            <>
              <span className="bm-overlay-icon">🫧</span>
              <p className="bm-overlay-text">Turn on your mic and blow —<br />even a light breath sends big bubbles floating up</p>
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
        {stage === 'listening' ? 'BLOW INTO YOUR MIC TO MAKE BUBBLES' : 'A BUBBLE MAKER PLAYGROUND'}
      </div>
    </div>
  )
}
