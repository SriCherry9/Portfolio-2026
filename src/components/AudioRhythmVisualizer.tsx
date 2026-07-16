import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

interface AudioRhythmVisualizerProps {
  width: number
  height: number
}

type Status = 'idle' | 'requesting' | 'listening' | 'denied'

const PALETTE = ['#ff6a3d', '#ffd23f', '#ff4fd8', '#3ec5ff', '#7ed321', '#ffb199', '#c084fc']
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5))
const MAX_CLUSTERS = 42

interface Pixel { dx: number; dy: number; size: number; color: string }
interface Cluster { pixels: Pixel[]; bornAt: number }

// Small deterministic PRNG so a cluster's shape is stable once spawned, without stashing raw randoms.
function mulberry32(seed: number) {
  let a = seed
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function pickColors(rand: () => number, n: number) {
  const pool = [...PALETTE]
  const picked: string[] = []
  for (let i = 0; i < n; i++) {
    const idx = Math.floor(rand() * pool.length)
    picked.push(pool.splice(idx, 1)[0] ?? PALETTE[0])
  }
  return picked
}

// Bends a shape's pixels outward unevenly — 0 keeps it clean and symmetric,
// higher values fray it into a spiky, irregular burst. Driven by pitch + speed.
function applyJagged(pixels: Pixel[], amt: number, rand: () => number): Pixel[] {
  if (amt <= 0.02) return pixels
  return pixels.map(p => {
    const dist = Math.hypot(p.dx, p.dy)
    const angle = Math.atan2(p.dy, p.dx)
    const radialJitter = 1 + (rand() - 0.5) * 2 * amt
    const sizeJitter = 1 + (rand() - 0.5) * amt * 1.2
    return {
      dx: Math.cos(angle) * dist * radialJitter,
      dy: Math.sin(angle) * dist * radialJitter,
      size: Math.max(2, p.size * sizeJitter),
      color: p.color,
    }
  })
}

// Four candy-pixel shape recipes echoing the flower/cross/ring/scatter motifs from the reference.
// `unit` already carries loudness (bigger burst → bigger cluster); `jaggedAmt` carries
// pitch + speed (higher/faster voice → spikier, more irregular pixels).
function buildCluster(unit: number, seed: number, band: number, jaggedAmt: number): Pixel[] {
  const rand = mulberry32(seed)
  const shape = ((band % 4) + 4) % 4
  let pixels: Pixel[]

  if (shape === 0) {
    const [c0, c1, c2] = pickColors(rand, 3)
    const arms = [[0, -2], [0, 2], [-2, 0], [2, 0], [-1, -1], [1, -1], [-1, 1], [1, 1]]
    pixels = [
      { dx: 0, dy: 0, size: unit * 0.9, color: c0 },
      ...arms.map((a, i) => ({ dx: a[0] * unit, dy: a[1] * unit, size: unit * 0.8, color: i % 2 === 0 ? c1 : c2 })),
    ]
  } else if (shape === 1) {
    const [c0, c1, c2] = pickColors(rand, 3)
    pixels = []
    for (const d of [-2, -1, 1, 2]) pixels.push({ dx: 0, dy: d * unit, size: unit, color: c0 })
    pixels.push({ dx: 0, dy: 0, size: unit, color: c2 })
    for (const d of [-2, -1, 1, 2]) pixels.push({ dx: d * unit, dy: 0, size: unit, color: c1 })
    for (const [dx, dy] of [[-2, -2], [2, -2], [-2, 2], [2, 2]]) {
      pixels.push({ dx: dx * unit, dy: dy * unit, size: unit * 0.7, color: c2 })
    }
  } else if (shape === 2) {
    const colors = pickColors(rand, 3)
    const n = 9
    const r = unit * 2.3
    pixels = []
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2
      pixels.push({ dx: Math.cos(a) * r, dy: Math.sin(a) * r, size: unit * 0.75, color: colors[i % colors.length] })
    }
  } else {
    const colors = pickColors(rand, 4)
    const n = 6 + Math.floor(rand() * 4)
    pixels = []
    for (let i = 0; i < n; i++) {
      pixels.push({
        dx: (rand() - 0.5) * unit * 5,
        dy: (rand() - 0.5) * unit * 5,
        size: unit * (0.45 + rand() * 0.55),
        color: colors[Math.floor(rand() * colors.length)],
      })
    }
  }

  return applyJagged(pixels, jaggedAmt, rand)
}

function mixHex(c1: string, c2: string, t: number): string {
  const clampT = Math.max(0, Math.min(1, t))
  const a = parseInt(c1.slice(1), 16)
  const b = parseInt(c2.slice(1), 16)
  const ar = (a >> 16) & 255, ag = (a >> 8) & 255, ab = a & 255
  const br = (b >> 16) & 255, bg = (b >> 8) & 255, bb = b & 255
  const r = Math.round(ar + (br - ar) * clampT)
  const g = Math.round(ag + (bg - ag) * clampT)
  const bl = Math.round(ab + (bb - ab) * clampT)
  return `rgb(${r}, ${g}, ${bl})`
}

function roundPixel(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string) {
  ctx.fillStyle = color
  ctx.beginPath()
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(x - size / 2, y - size / 2, size, size, size * 0.32)
  } else {
    ctx.rect(x - size / 2, y - size / 2, size, size)
  }
  ctx.fill()
}

interface BloomState {
  clusters: Cluster[]
  avgEnergy: number
  lastSpawn: number
  seedCounter: number
  startTime: number
}

function createBloomState(): BloomState {
  return { clusters: [], avgEnergy: 0, lastSpawn: 0, seedCounter: 0, startTime: performance.now() }
}

// One accumulating frame of the "bloom": spawns a new pixel-cluster whenever the
// incoming energy spikes above its own rolling average — a lightweight onset/beat
// detector — then lays every living cluster out on a sunflower spiral around a
// pulsing hub, so rhythm literally keeps adding to the artwork rather than redrawing it.
// Loudness sizes each new cluster up or down; pitch + how fast the hits are coming
// in fray its pixels into something spikier and more jagged.
function stepBloom(
  state: BloomState,
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  energy: number,
  band: number,
  pitch: number,
) {
  const now = performance.now()
  state.avgEnergy = state.avgEnergy * 0.95 + energy * 0.05
  const threshold = state.avgEnergy * 1.6 + 0.018
  if (energy > threshold && now - state.lastSpawn > 240) {
    const interval = now - state.lastSpawn
    state.lastSpawn = now
    state.seedCounter += 1

    const speedNorm = Math.max(0, Math.min(1, 1 - interval / 700))
    const energyNorm = Math.max(0, Math.min(1, energy))
    const jaggedAmt = Math.max(0, Math.min(1.1, 0.1 + pitch * 0.55 + speedNorm * 0.5))
    const sizeScale = 0.55 + energyNorm * 1.5

    const baseUnit = Math.max(4, Math.min(width, height) * 0.026)
    const unit = baseUnit * sizeScale
    state.clusters.push({ pixels: buildCluster(unit, state.seedCounter * 977 + 13, band, jaggedAmt), bornAt: now })
    if (state.clusters.length > MAX_CLUSTERS) state.clusters.shift()
  }

  ctx.fillStyle = '#0a0a0a'
  ctx.fillRect(0, 0, width, height)

  const cx = width / 2
  const cy = height / 2
  const maxR = Math.min(width, height) * 0.44
  const spacing = maxR / Math.sqrt(MAX_CLUSTERS)
  const rotation = (now - state.startTime) * 0.00004

  ctx.globalAlpha = 0.35
  for (let y = 8; y < height - 8; y += 10) {
    ctx.fillStyle = Math.floor(y / 10) % 2 === 0 ? '#ff4fd8' : '#ff6a3d'
    ctx.beginPath()
    ctx.arc(cx, y, 1.6, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.globalAlpha = 1

  state.clusters.forEach((cluster, i) => {
    const r = Math.min(spacing * Math.sqrt(i), maxR)
    const theta = i * GOLDEN_ANGLE + rotation
    const x = cx + r * Math.cos(theta)
    const y = cy + r * Math.sin(theta)
    const age = now - cluster.bornAt
    const pop = Math.min(1, age / 320)
    const scale = 0.4 + pop * 0.6

    ctx.globalAlpha = 0.22
    ctx.strokeStyle = cluster.pixels[0]?.color ?? '#ffffff'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(cx, cy)
    ctx.lineTo(x, y)
    ctx.stroke()

    ctx.globalAlpha = pop
    cluster.pixels.forEach(p => {
      roundPixel(ctx, x + p.dx * scale, y + p.dy * scale, p.size * scale, p.color)
    })
  })
  ctx.globalAlpha = 1

  const hubR = 5 + energy * 26
  const hubColor = mixHex('#ff4fd8', '#3ec5ff', pitch)
  ctx.save()
  ctx.shadowBlur = 14 + energy * 24
  ctx.shadowColor = hubColor
  ctx.fillStyle = hubColor
  ctx.beginPath()
  ctx.arc(cx, cy, hubR, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()
}

interface BloomInput { energy: number; band: number; pitch: number }

// A gentle simulated pulse so a bloom canvas never sits dead before real audio takes over.
function makeAmbientInput(): () => BloomInput {
  const start = performance.now()
  return () => {
    const t = (performance.now() - start) / 1000
    const cycle = t % 1.1
    const energy = 0.02 + (cycle < 0.18 ? (1 - cycle / 0.18) * 0.35 : 0.015)
    const band = Math.floor(t / 1.3)
    const pitch = 0.3 + 0.5 * Math.abs(Math.sin(t * 0.7))
    return { energy, band, pitch }
  }
}

// Runs one continuous draw loop against whatever input source is currently referenced,
// so switching from the ambient idle pulse to live mic data never restarts the canvas.
function useBloomLoop(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  width: number,
  height: number,
  inputRef: React.RefObject<() => BloomInput>,
) {
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const dpr = window.devicePixelRatio || 1
    canvas.width = width * dpr
    canvas.height = height * dpr
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.scale(dpr, dpr)

    const state = createBloomState()
    let raf: number
    const loop = () => {
      const { energy, band, pitch } = inputRef.current()
      stepBloom(state, ctx, width, height, energy, band, pitch)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [canvasRef, width, height, inputRef])
}

function BloomModal({ onClose }: { onClose: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const inputRef = useRef<() => BloomInput>(makeAmbientInput())
  const [status, setStatus] = useState<Status>('idle')
  const [size, setSize] = useState({ width: 800, height: 520 })

  useEffect(() => {
    const compute = () => {
      const w = Math.min(900, window.innerWidth * 0.86)
      const h = Math.min(560, window.innerHeight * 0.7)
      setSize({ width: w, height: h })
    }
    compute()
    window.addEventListener('resize', compute)
    return () => window.removeEventListener('resize', compute)
  }, [])

  useEffect(() => {
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  useBloomLoop(canvasRef, size.width, size.height, inputRef)

  const stop = () => {
    streamRef.current?.getTracks().forEach(track => track.stop())
    streamRef.current = null
    if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
      audioCtxRef.current.close()
    }
    audioCtxRef.current = null
    analyserRef.current = null
    inputRef.current = makeAmbientInput()
    setStatus('idle')
  }

  const start = async () => {
    setStatus('requesting')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream

      const audioCtx = new AudioContext()
      audioCtxRef.current = audioCtx
      const source = audioCtx.createMediaStreamSource(stream)
      const analyser = audioCtx.createAnalyser()
      analyser.fftSize = 1024
      analyser.smoothingTimeConstant = 0.75
      source.connect(analyser)
      analyserRef.current = analyser

      const freqData = new Uint8Array(analyser.frequencyBinCount)
      const waveData = new Uint8Array(analyser.fftSize)
      const quarter = Math.floor(freqData.length / 4)

      inputRef.current = () => {
        analyser.getByteFrequencyData(freqData)
        analyser.getByteTimeDomainData(waveData)

        let sumSq = 0
        for (let i = 0; i < waveData.length; i++) {
          const v = (waveData[i] - 128) / 128
          sumSq += v * v
        }
        const energy = Math.min(1, Math.sqrt(sumSq / waveData.length) * 2.6)

        let bestBand = 0
        let bestSum = -1
        for (let b = 0; b < 4; b++) {
          let sum = 0
          for (let i = 0; i < quarter; i++) sum += freqData[b * quarter + i]
          if (sum > bestSum) {
            bestSum = sum
            bestBand = b
          }
        }

        // Spectral centroid as a cheap pitch/tone proxy — brighter, higher-pitched
        // sounds skew the weighted average toward the higher frequency bins.
        let weightedSum = 0
        let magSum = 0
        for (let i = 0; i < freqData.length; i++) {
          weightedSum += i * freqData[i]
          magSum += freqData[i]
        }
        const centroid = magSum > 0 ? weightedSum / magSum : 0
        const pitch = Math.min(1, centroid / (freqData.length * 0.4))

        return { energy, band: bestBand, pitch }
      }

      setStatus('listening')
    } catch {
      setStatus('denied')
    }
  }

  useEffect(() => () => stop(), [])

  return createPortal(
    <div className="bloom-backdrop" onClick={onClose}>
      <div className="bloom-modal" onClick={e => e.stopPropagation()}>
        <button className="bloom-close-btn" onClick={onClose} aria-label="Close">
          ×
        </button>
        <canvas
          ref={canvasRef}
          className="bloom-canvas"
          style={{ width: size.width, height: size.height }}
        />
        {status === 'listening' ? (
          <button className="sound-wave-stop bloom-stop" onClick={stop} aria-label="Stop listening">
            <span className="sound-wave-dot" />
            Listening
          </button>
        ) : (
          <div className="bloom-overlay">
            <button className="sound-wave-btn" onClick={start} disabled={status === 'requesting'}>
              {status === 'requesting'
                ? 'Requesting mic…'
                : status === 'denied'
                  ? 'Mic blocked — tap to retry'
                  : 'Tap to speak or play music'}
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body,
  )
}

export function AudioRhythmVisualizer({ width, height }: AudioRhythmVisualizerProps) {
  const previewCanvasRef = useRef<HTMLCanvasElement>(null)
  const [open, setOpen] = useState(false)
  const ambientInputRef = useRef<() => BloomInput>(makeAmbientInput())
  useBloomLoop(previewCanvasRef, width, height, ambientInputRef)

  return (
    <div className="sound-wave-viz">
      <canvas ref={previewCanvasRef} className="sound-wave-canvas" style={{ width, height }} />
      <button
        className="sound-wave-open-btn"
        onMouseDown={e => e.stopPropagation()}
        onClick={e => {
          e.stopPropagation()
          setOpen(true)
        }}
      >
        Open to speak ↗
      </button>
      {open && <BloomModal onClose={() => setOpen(false)} />}
    </div>
  )
}
