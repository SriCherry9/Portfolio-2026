import { useEffect, useRef, useState } from 'react'

interface AudioRhythmVisualizerProps {
  width: number
  height: number
}

type Status = 'idle' | 'requesting' | 'listening' | 'denied'

export function AudioRhythmVisualizer({ width, height }: AudioRhythmVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
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

      const draw = () => {
        const canvas = canvasRef.current
        const ctx = canvas?.getContext('2d')
        if (!canvas || !ctx || !analyserRef.current) return

        analyserRef.current.getByteFrequencyData(freqData)
        analyserRef.current.getByteTimeDomainData(waveData)

        ctx.fillStyle = '#0b0f14'
        ctx.fillRect(0, 0, width, height)

        // Rhythm — frequency bars pulsing with volume
        const barCount = 40
        const step = Math.floor(freqData.length / barCount)
        const barWidth = width / barCount
        for (let i = 0; i < barCount; i++) {
          const value = freqData[i * step] / 255
          const barHeight = value * height * 0.85
          const hue = 190 + value * 100
          ctx.fillStyle = `hsla(${hue}, 85%, 60%, 0.55)`
          ctx.fillRect(i * barWidth, height - barHeight, barWidth * 0.7, barHeight)
        }

        // Ups and downs — live waveform
        ctx.lineWidth = 2
        ctx.strokeStyle = '#7cffcb'
        ctx.beginPath()
        const slice = width / waveData.length
        let x = 0
        for (let i = 0; i < waveData.length; i++) {
          const v = waveData[i] / 128
          const y = (v * height) / 2
          if (i === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
          x += slice
        }
        ctx.stroke()

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
