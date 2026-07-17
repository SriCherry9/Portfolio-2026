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
const WAVE_POINTS = 48

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
  wave: number[],
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

  // A literal trace of the live waveform, wrapped into a ring around the hub — the
  // raw ups and downs of the sound, animating every frame rather than only on beats.
  const ringR = hubR + 12
  const waveAmp = 8 + energy * 22
  ctx.save()
  ctx.globalAlpha = 0.6
  ctx.strokeStyle = hubColor
  ctx.lineWidth = 1.5
  ctx.beginPath()
  wave.forEach((s, i) => {
    const angle = (i / wave.length) * Math.PI * 2
    const r = ringR + s * waveAmp
    const x = cx + Math.cos(angle) * r
    const y = cy + Math.sin(angle) * r
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  })
  ctx.closePath()
  ctx.stroke()
  ctx.restore()
}

interface Streak { angle: number; length: number; bornAt: number; color: string; wobble: number }
interface BurstState { streaks: Streak[]; avgEnergy: number; lastSpawn: number; seedCounter: number }

function createBurstState(): BurstState {
  return { streaks: [], avgEnergy: 0, lastSpawn: 0, seedCounter: 0 }
}

const MAX_STREAKS = 90

// Starburst style (inspired by the inference kite/firework reference) — every
// detected beat fires a new streak outward from the center line. Streaks closer
// to vertical run longer, giving the kite silhouette; louder hits reach further;
// pitch + speed add wobble to the streak's path.
function stepBurst(
  state: BurstState,
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  energy: number,
  band: number,
  pitch: number,
  wave: number[],
) {
  const now = performance.now()
  state.avgEnergy = state.avgEnergy * 0.95 + energy * 0.05
  const threshold = state.avgEnergy * 1.6 + 0.018
  if (energy > threshold && now - state.lastSpawn > 180) {
    const interval = now - state.lastSpawn
    state.lastSpawn = now
    state.seedCounter += 1
    const rand = mulberry32(state.seedCounter * 733 + 41 + band)

    const speedNorm = Math.max(0, Math.min(1, 1 - interval / 700))
    const energyNorm = Math.max(0, Math.min(1, energy))
    const angle = (rand() * 2 - 1) * Math.PI
    const verticalBias = Math.abs(Math.sin(angle))
    const length = Math.min(width, height) * (0.15 + verticalBias * 0.55) * (0.5 + energyNorm * 1.1)
    const wobble = 0.1 + pitch * 0.4 + speedNorm * 0.3
    const color = PALETTE[Math.floor(rand() * PALETTE.length)]

    state.streaks.push({ angle, length, bornAt: now, color, wobble })
    if (state.streaks.length > MAX_STREAKS) state.streaks.shift()
  }

  ctx.fillStyle = '#0a0a0a'
  ctx.fillRect(0, 0, width, height)

  const cx = width / 2
  const cy = height / 2
  const waveEnergy = wave.reduce((a, b) => a + Math.abs(b), 0) / wave.length
  const hubColor = mixHex('#ff4fd8', '#3ec5ff', pitch)

  ctx.globalAlpha = 0.4
  ctx.strokeStyle = hubColor
  ctx.lineWidth = 1.5 + waveEnergy * 5
  ctx.beginPath()
  ctx.moveTo(0, cy)
  ctx.lineTo(width, cy)
  ctx.stroke()
  ctx.globalAlpha = 1

  state.streaks.forEach(streak => {
    const age = now - streak.bornAt
    const pop = Math.min(1, age / 260)
    const len = streak.length * pop
    const segs = 8
    const perpAngle = streak.angle + Math.PI / 2

    ctx.globalAlpha = 0.5 + pop * 0.4
    ctx.strokeStyle = streak.color
    ctx.lineWidth = 1.6
    ctx.beginPath()
    for (let s = 0; s <= segs; s++) {
      const t = s / segs
      const wob = Math.sin(t * Math.PI * 4 + streak.bornAt * 0.01) * streak.wobble * 10 * t
      const baseX = cx + Math.cos(streak.angle) * len * t
      const baseY = cy + Math.sin(streak.angle) * len * t
      const x = baseX + Math.cos(perpAngle) * wob
      const y = baseY + Math.sin(perpAngle) * wob
      if (s === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.stroke()
  })
  ctx.globalAlpha = 1

  const hubR = 4 + energy * 16
  ctx.save()
  ctx.shadowBlur = 12 + energy * 20
  ctx.shadowColor = hubColor
  ctx.fillStyle = hubColor
  ctx.beginPath()
  ctx.arc(cx, cy, hubR, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()
}

// Draws a smoothed curve through evenly-spaced points using quadratic segments,
// giving the ribbon lanes a flowing look instead of a jagged polyline.
function traceSmoothPath(ctx: CanvasRenderingContext2D, points: { x: number; y: number }[]) {
  ctx.beginPath()
  ctx.moveTo(points[0].x, points[0].y)
  for (let i = 1; i < points.length - 1; i++) {
    const mx = (points[i].x + points[i + 1].x) / 2
    const my = (points[i].y + points[i + 1].y) / 2
    ctx.quadraticCurveTo(points[i].x, points[i].y, mx, my)
  }
  const last = points[points.length - 1]
  ctx.lineTo(last.x, last.y)
}

interface ChipPoint { gx: number; gy: number; purple: boolean }

// Fixed tiled layout of tiny paired chip/component outlines, computed once per
// size — echoes the circuit-grid texture in the inference.NET ribbon reference.
// Positions are recomputed with a per-frame displacement (see stepRibbon) rather
// than baked into a static bitmap, so the grid can part around the ribbons.
function buildChipGrid(width: number, height: number): ChipPoint[] {
  const points: ChipPoint[] = []
  const gapX = 34
  const gapY = 30
  let row = 0
  for (let gy = 14; gy < height; gy += gapY, row++) {
    for (let gx = 14; gx < width; gx += gapX) {
      points.push({ gx, gy, purple: (row + Math.floor(gx / gapX)) % 3 !== 0 })
    }
  }
  return points
}

function drawChipIcon(ctx: CanvasRenderingContext2D, x: number, y: number, purple: boolean, alpha: number) {
  ctx.strokeStyle = purple ? `rgba(200,140,255,${0.32 * alpha})` : `rgba(180,255,120,${0.22 * alpha})`
  ctx.lineWidth = 1
  const w = 9
  const h = 6
  ctx.strokeRect(x - w, y - h / 2, w * 0.85, h)
  ctx.strokeRect(x + w * 0.05, y - h / 2, w * 0.85, h)
}

const RIBBON_HISTORY = 200
const RIBBON_LANE_COLORS = ['#ff4fd8', '#ff4fd8', '#7ed321', '#7ed321', '#ff8a3d', '#ff8a3d']
const RIBBON_LANES = RIBBON_LANE_COLORS.length
const CHIP_INFLUENCE = 34
const CHIP_MAX_PUSH = 30

interface RibbonState { lanes: number[][]; grid: ChipPoint[] | null; gridW: number; gridH: number }

function createRibbonState(): RibbonState {
  return {
    lanes: Array.from({ length: RIBBON_LANES }, () => new Array(RIBBON_HISTORY).fill(0)),
    grid: null,
    gridW: 0,
    gridH: 0,
  }
}

// Ribbon style (inspired by the inference.NET chip-grid reference) — thicker,
// glossy double-stroke streams over a tiled circuit-icon backdrop, annotated with
// scattered "20,20" data-point labels like the reference's chart markers. Each
// strand still scrolls forward with a literal slice of the live waveform. As a
// ribbon emerges near a chip icon, the icon is pushed away from the line rather
// than simply being drawn over.
function stepRibbon(
  state: RibbonState,
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  energy: number,
  band: number,
  pitch: number,
  wave: number[],
) {
  if (!state.grid || state.gridW !== width || state.gridH !== height) {
    state.grid = buildChipGrid(width, height)
    state.gridW = width
    state.gridH = height
  }

  state.lanes.forEach((lane, i) => {
    lane.shift()
    const offset = (i % 2) * (wave.length / 6)
    const sampleIdx = Math.floor((Math.floor(i / 2) / 3) * wave.length + offset) % wave.length
    lane.push(wave[sampleIdx] ?? 0)
  })

  ctx.fillStyle = '#050505'
  ctx.fillRect(0, 0, width, height)

  const ampScale = height * (0.16 + energy * 0.2)
  const step = width / (RIBBON_HISTORY - 1)
  const laneInfos = state.lanes.map((lane, i) => ({
    lane,
    baseY: height * (0.4 + Math.floor(i / 2) * 0.15) + (i % 2) * 10,
  }))

  // Push every chip icon away from whichever ribbon lines currently pass near it —
  // the closer a line, the harder it shoves the icon outward, parting the grid
  // rather than just being drawn over. Icons stay fully visible as they relocate.
  state.grid.forEach(point => {
    let pushY = 0
    for (const { lane, baseY } of laneInfos) {
      const j = Math.min(lane.length - 1, Math.max(0, Math.round(point.gx / step)))
      const lineY = baseY + lane[j] * ampScale
      const dy = point.gy - lineY
      const dist = Math.abs(dy)
      if (dist < CHIP_INFLUENCE) {
        pushY += Math.sign(dy || 1) * (1 - dist / CHIP_INFLUENCE) * CHIP_MAX_PUSH
      }
    }
    const sway = (point.gx * 7 + point.gy * 13) % 5 < 2 ? -1 : 1
    const pushX = pushY * 0.35 * sway
    drawChipIcon(ctx, point.gx + pushX, point.gy + pushY, point.purple, 1)
  })

  ctx.lineJoin = 'round'
  ctx.lineCap = 'round'

  laneInfos.forEach(({ lane, baseY }, i) => {
    const family = Math.floor(i / 2)
    const isActive = family === band % 3
    const color = mixHex(RIBBON_LANE_COLORS[i], '#ffffff', pitch * 0.15)
    const points = lane.map((v, j) => ({ x: j * step, y: baseY + v * ampScale }))

    ctx.globalAlpha = isActive ? 0.95 : 0.7
    ctx.strokeStyle = color
    ctx.lineWidth = isActive ? 5.5 : 4.5
    traceSmoothPath(ctx, points)
    ctx.stroke()

    ctx.globalAlpha = 0.85
    ctx.strokeStyle = 'rgba(255,255,255,0.5)'
    ctx.lineWidth = 1.2
    traceSmoothPath(ctx, points)
    ctx.stroke()
  })
  ctx.globalAlpha = 1

  ctx.font = '11px "Courier New", monospace'
  ctx.fillStyle = 'rgba(255,255,255,0.55)'
  laneInfos.forEach(({ lane, baseY }, i) => {
    for (let x = 30 + i * 22; x < width; x += 150) {
      const j = Math.min(lane.length - 1, Math.round(x / step))
      const y = baseY + lane[j] * ampScale
      ctx.fillText('20,20', x, y - 10)
    }
  })

  const hubColor = mixHex('#ff4fd8', '#3ec5ff', pitch)
  const hubR = 4 + energy * 14
  ctx.save()
  ctx.shadowBlur = 10 + energy * 18
  ctx.shadowColor = hubColor
  ctx.fillStyle = hubColor
  ctx.beginPath()
  ctx.arc(width - 22, height - 22, hubR, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()
}

type StyleState =
  | { kind: 'bloom'; s: BloomState }
  | { kind: 'burst'; s: BurstState }
  | { kind: 'ribbon'; s: RibbonState }

const STYLE_KINDS: StyleState['kind'][] = ['bloom', 'burst', 'ribbon']

function pickRandomStyleKind(): StyleState['kind'] {
  return STYLE_KINDS[Math.floor(Math.random() * STYLE_KINDS.length)]
}

function createStyleState(kind: StyleState['kind']): StyleState {
  if (kind === 'burst') return { kind, s: createBurstState() }
  if (kind === 'ribbon') return { kind, s: createRibbonState() }
  return { kind: 'bloom', s: createBloomState() }
}

function stepStyle(
  style: StyleState,
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  energy: number,
  band: number,
  pitch: number,
  wave: number[],
) {
  if (style.kind === 'burst') stepBurst(style.s, ctx, width, height, energy, band, pitch, wave)
  else if (style.kind === 'ribbon') stepRibbon(style.s, ctx, width, height, energy, band, pitch, wave)
  else stepBloom(style.s, ctx, width, height, energy, band, pitch, wave)
}

interface BloomInput { energy: number; band: number; pitch: number; wave: number[] }

// Deliberately inert — no fabricated energy, so nothing gets added to the bloom
// until real sound actually arrives. Just a small, still hub until you speak.
function makeIdleInput(): () => BloomInput {
  const wave = new Array(WAVE_POINTS).fill(0)
  return () => ({ energy: 0, band: 0, pitch: 0.4, wave })
}

// Runs one continuous draw loop against whatever input source and style state are
// currently referenced, so switching from the idle state to live mic data — or
// rolling a fresh style for a new listening session — never restarts the canvas.
function useVisualizerLoop(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  width: number,
  height: number,
  inputRef: React.RefObject<() => BloomInput>,
  styleRef: React.RefObject<StyleState>,
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

    let raf: number
    const loop = () => {
      const { energy, band, pitch, wave } = inputRef.current()
      stepStyle(styleRef.current, ctx, width, height, energy, band, pitch, wave)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [canvasRef, width, height, inputRef, styleRef])
}

function BloomModal({ onClose }: { onClose: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const inputRef = useRef<() => BloomInput>(makeIdleInput())
  const styleRef = useRef<StyleState>(createStyleState(pickRandomStyleKind()))
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

  useVisualizerLoop(canvasRef, size.width, size.height, inputRef, styleRef)

  const stop = () => {
    streamRef.current?.getTracks().forEach(track => track.stop())
    streamRef.current = null
    if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
      audioCtxRef.current.close()
    }
    audioCtxRef.current = null
    analyserRef.current = null
    inputRef.current = makeIdleInput()
    setStatus('idle')
  }

  const start = async () => {
    setStatus('requesting')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream

      // Fresh artwork for this session — a new random style, blank canvas.
      styleRef.current = createStyleState(pickRandomStyleKind())

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

        // Downsample the raw waveform so the live "ups and downs" can be traced directly.
        const wave = new Array(WAVE_POINTS)
        const waveStride = waveData.length / WAVE_POINTS
        for (let i = 0; i < WAVE_POINTS; i++) {
          wave[i] = (waveData[Math.floor(i * waveStride)] - 128) / 128
        }

        return { energy, band: bestBand, pitch, wave }
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
  const idleInputRef = useRef<() => BloomInput>(makeIdleInput())
  const previewStyleRef = useRef<StyleState>(createStyleState('bloom'))
  useVisualizerLoop(previewCanvasRef, width, height, idleInputRef, previewStyleRef)

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
