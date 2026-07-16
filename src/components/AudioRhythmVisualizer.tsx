import { useEffect, useRef, useState } from 'react'

interface AudioRhythmVisualizerProps {
  width: number
  height: number
}

type Status = 'idle' | 'requesting' | 'listening' | 'denied'

// Concentric meridian rings, inner → outer, tuned to echo a red/blue glowing iris.
const RINGS = [
  { pos: 0.14, hue: 8, sat: 88, light: 58 },
  { pos: 0.36, hue: 198, sat: 92, light: 68 },
  { pos: 0.6, hue: 218, sat: 85, light: 46 },
  { pos: 0.88, hue: 190, sat: 95, light: 72 },
]

export function AudioRhythmVisualizer({ width, height }: AudioRhythmVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const noiseCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const rafRef = useRef<number | undefined>(undefined)
  const [status, setStatus] = useState<Status>('idle')

  // Size the canvas backing store once for the card's fixed dimensions.
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const dpr = window.devicePixelRatio || 1
    canvas.width = width * dpr
    canvas.height = height * dpr
    canvas.getContext('2d')?.scale(dpr, dpr)

    const noise = document.createElement('canvas')
    noise.width = Math.ceil(width / 4)
    noise.height = Math.ceil(height / 4)
    noiseCanvasRef.current = noise
  }, [width, height])

  const stop = () => {
    if (rafRef.current !== undefined) cancelAnimationFrame(rafRef.current)
    rafRef.current = undefined
    streamRef.current?.getTracks().forEach(track => track.stop())
    streamRef.current = null
    if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
      audioCtxRef.current.close()
    }
    audioCtxRef.current = null
    analyserRef.current = null
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
      analyser.smoothingTimeConstant = 0.8
      source.connect(analyser)
      analyserRef.current = analyser

      setStatus('listening')

      const freqData = new Uint8Array(analyser.frequencyBinCount)
      const waveData = new Uint8Array(analyser.fftSize)
      const cx = width / 2

      const draw = () => {
        const canvas = canvasRef.current
        const ctx = canvas?.getContext('2d')
        const noiseCanvas = noiseCanvasRef.current
        if (!canvas || !ctx || !noiseCanvas || !analyserRef.current) return

        analyserRef.current.getByteFrequencyData(freqData)
        analyserRef.current.getByteTimeDomainData(waveData)

        // Trailing fade instead of a hard clear — gives the rings a glowing, painterly drift.
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)'
        ctx.fillRect(0, 0, width, height)

        // Each ring reads its own slice of the spectrum, so the bands pulse independently.
        const bandSize = Math.floor(freqData.length / (RINGS.length * 2))
        const steps = 48

        RINGS.forEach((ring, ringIndex) => {
          const bandStart = ringIndex * bandSize
          let sum = 0
          for (let i = 0; i < bandSize; i++) sum += freqData[bandStart + i]
          const energy = sum / bandSize / 255

          for (const side of [-1, 1]) {
            ctx.beginPath()
            for (let j = 0; j <= steps; j++) {
              const t = j / steps
              const y = t * height
              const shape = Math.sin(Math.PI * t) // converge to a point at top and bottom
              const waveIdx = Math.floor(t * (waveData.length - 1))
              const jitter = (waveData[waveIdx] - 128) / 128 // -1..1, traces the live waveform
              const amp = ring.pos * side * (0.82 + energy * 0.45) + jitter * 0.05 * side
              const x = cx + amp * cx * shape
              if (j === 0) ctx.moveTo(x, y)
              else ctx.lineTo(x, y)
            }
            const lightness = Math.min(ring.light + energy * 22, 88)
            const color = `hsl(${ring.hue}, ${ring.sat}%, ${lightness}%)`
            ctx.lineWidth = 2 + energy * 3.5
            ctx.shadowBlur = 6 + energy * 20
            ctx.shadowColor = color
            ctx.strokeStyle = color
            ctx.globalAlpha = 0.7 + energy * 0.3
            ctx.stroke()
          }
        })
        ctx.shadowBlur = 0
        ctx.globalAlpha = 1

        // Film grain — coarse noise scaled up (nearest-neighbour) for a blocky, analog texture.
        const nctx = noiseCanvas.getContext('2d')
        if (nctx) {
          const overallEnergy = freqData.reduce((a, b) => a + b, 0) / freqData.length / 255
          const imgData = nctx.createImageData(noiseCanvas.width, noiseCanvas.height)
          const buf = imgData.data
          for (let i = 0; i < buf.length; i += 4) {
            const v = Math.random() * 255
            buf[i] = v
            buf[i + 1] = v
            buf[i + 2] = v
            buf[i + 3] = Math.random() * 90 * (0.5 + overallEnergy)
          }
          nctx.putImageData(imgData, 0, 0)
          ctx.save()
          ctx.globalCompositeOperation = 'overlay'
          ctx.imageSmoothingEnabled = false
          ctx.drawImage(noiseCanvas, 0, 0, width, height)
          ctx.restore()
        }

        rafRef.current = requestAnimationFrame(draw)
      }

      rafRef.current = requestAnimationFrame(draw)
    } catch {
      setStatus('denied')
    }
  }

  useEffect(() => () => stop(), [])

  return (
    <div className="sound-wave-viz">
      <canvas
        ref={canvasRef}
        className="sound-wave-canvas"
        style={{ width, height }}
      />
      {status === 'listening' ? (
        <button
          className="sound-wave-stop"
          onMouseDown={e => e.stopPropagation()}
          onClick={stop}
          aria-label="Stop listening"
        >
          <span className="sound-wave-dot" />
          Listening
        </button>
      ) : (
        <div className="sound-wave-overlay">
          <button
            className="sound-wave-btn"
            onMouseDown={e => e.stopPropagation()}
            onClick={start}
            disabled={status === 'requesting'}
          >
            {status === 'requesting'
              ? 'Requesting mic…'
              : status === 'denied'
                ? 'Mic blocked — tap to retry'
                : 'Tap to speak or play music'}
          </button>
        </div>
      )}
    </div>
  )
}
