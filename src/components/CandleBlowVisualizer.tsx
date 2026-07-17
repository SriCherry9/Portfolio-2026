import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

interface CandleBlowVisualizerProps {
  width: number
  height: number
}

type MicStatus = 'idle' | 'requesting' | 'listening' | 'denied'

const BLOW_THRESHOLD = 0.15
const BLOW_HOLD_MS = 220
const SMOKE_DURATION_MS = 2200
const CANDLE_IMG = '/images/candle-holder.gif'

interface CandleSceneProps {
  lit: boolean
  smoking: boolean
  igniting: boolean
  fill?: boolean
  photoRef?: React.Ref<HTMLImageElement>
}

function CandleScene({ lit, smoking, igniting, fill, photoRef }: CandleSceneProps) {
  return (
    <div className={`candle-photo-wrap${fill ? ' candle-photo-wrap--fill' : ' candle-photo-wrap--modal'}`}>
      <img
        ref={photoRef}
        src={CANDLE_IMG}
        alt="A lit dripping candle in a ceramic holder"
        className={`candle-photo${igniting ? ' candle-igniting' : ''}`}
        draggable={false}
      />
      <div className="candle-wick-marker">
        {!lit && <div className="candle-ember" />}
        {smoking && (
          <div className="candle-smoke">
            <span className="candle-smoke-wisp cs-1" />
            <span className="candle-smoke-wisp cs-2" />
            <span className="candle-smoke-wisp cs-3" />
          </div>
        )}
      </div>
    </div>
  )
}

function CandleModal({ onClose }: { onClose: () => void }) {
  const audioCtxRef = useRef<AudioContext | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const photoRef = useRef<HTMLImageElement>(null)
  const litRef = useRef(true)
  const blowStartRef = useRef<number | null>(null)
  const rafRef = useRef<number | undefined>(undefined)
  const smokeTimerRef = useRef<number | undefined>(undefined)

  const [micStatus, setMicStatus] = useState<MicStatus>('idle')
  const [lit, setLit] = useState(true)
  const [smoking, setSmoking] = useState(false)
  const [igniting, setIgniting] = useState(false)

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

  const extinguish = () => {
    litRef.current = false
    setLit(false)
    setSmoking(true)
    blowStartRef.current = null
    if (photoRef.current) photoRef.current.style.filter = ''
    window.clearTimeout(smokeTimerRef.current)
    smokeTimerRef.current = window.setTimeout(() => setSmoking(false), SMOKE_DURATION_MS)
  }

  const relight = () => {
    blowStartRef.current = null
    litRef.current = true
    setLit(true)
    setIgniting(true)
    window.setTimeout(() => setIgniting(false), 300)
  }

  const stop = () => {
    if (rafRef.current !== undefined) cancelAnimationFrame(rafRef.current)
    window.clearTimeout(smokeTimerRef.current)
    streamRef.current?.getTracks().forEach(track => track.stop())
    streamRef.current = null
    if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
      audioCtxRef.current.close()
    }
    audioCtxRef.current = null
    setMicStatus('idle')
  }

  const start = async () => {
    setMicStatus('requesting')
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
      let smoothed = 0

      const loop = () => {
        analyser.getByteTimeDomainData(waveData)
        let sumSq = 0
        for (let i = 0; i < waveData.length; i++) {
          const v = (waveData[i] - 128) / 128
          sumSq += v * v
        }
        const energy = Math.sqrt(sumSq / waveData.length) * 2.6
        smoothed = smoothed * 0.75 + energy * 0.25

        if (litRef.current) {
          const lean = Math.max(0, Math.min(1, smoothed / (BLOW_THRESHOLD * 2.2)))
          if (photoRef.current) {
            photoRef.current.style.filter = `brightness(${1 - lean * 0.3})`
          }
          if (smoothed > BLOW_THRESHOLD) {
            const now = performance.now()
            if (blowStartRef.current === null) blowStartRef.current = now
            else if (now - blowStartRef.current > BLOW_HOLD_MS) extinguish()
          } else {
            blowStartRef.current = null
          }
        }

        rafRef.current = requestAnimationFrame(loop)
      }
      rafRef.current = requestAnimationFrame(loop)
      setMicStatus('listening')
    } catch {
      setMicStatus('denied')
    }
  }

  useEffect(() => () => stop(), [])

  return createPortal(
    <div className="bloom-backdrop" onClick={onClose}>
      <div className="candle-modal" onClick={e => e.stopPropagation()}>
        <button className="bloom-close-btn" onClick={onClose} aria-label="Close">
          ×
        </button>

        <div className={`candle-room${!lit ? ' candle-room-dark' : ''}`}>
          <CandleScene lit={lit} smoking={smoking} igniting={igniting} photoRef={photoRef} />
        </div>

        {!lit && (
          <button className="dg-refog candle-relight" onClick={relight}>
            relight it ↻
          </button>
        )}

        {micStatus !== 'listening' ? (
          <button className="sound-wave-btn" onClick={start} disabled={micStatus === 'requesting'}>
            {micStatus === 'requesting'
              ? 'Requesting mic…'
              : micStatus === 'denied'
                ? 'Mic blocked — tap to retry'
                : 'Tap to enable mic, then blow'}
          </button>
        ) : (
          <div className="candle-hint">{lit ? 'Blow into your mic to snuff the flame' : 'Tap relight to try again'}</div>
        )}
      </div>
    </div>,
    document.body,
  )
}

export function CandleBlowVisualizer({ width, height }: CandleBlowVisualizerProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="candle-viz" style={{ width, height }}>
      <CandleScene lit smoking={false} igniting={false} fill />
      <button
        className="sound-wave-open-btn"
        onMouseDown={e => e.stopPropagation()}
        onClick={e => {
          e.stopPropagation()
          setOpen(true)
        }}
      >
        Open to blow ↗
      </button>
      {open && <CandleModal onClose={() => setOpen(false)} />}
    </div>
  )
}
