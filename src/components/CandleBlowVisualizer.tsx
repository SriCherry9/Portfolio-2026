import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

interface CandleBlowVisualizerProps {
  width: number
  height: number
}

type MicStatus = 'idle' | 'requesting' | 'listening' | 'denied'

const BLOW_THRESHOLD = 0.15
const BLOW_HOLD_MS = 220
const SMOKE_DURATION_MS = 2200

function FlameGraphic({ gradId }: { gradId: string }) {
  const coreId = `${gradId}-core`
  const baseId = `${gradId}-base`
  return (
    <>
      <div className="candle-glow" />
      <svg className="candle-flame-svg" viewBox="0 0 40 64">
        <defs>
          <radialGradient id={gradId} cx="50%" cy="82%" r="72%">
            <stop offset="0%" stopColor="#fff6d0" />
            <stop offset="30%" stopColor="#ffd23f" />
            <stop offset="62%" stopColor="#ff9d2e" />
            <stop offset="88%" stopColor="#ff5a1f" />
            <stop offset="100%" stopColor="#e8431a" stopOpacity="0.75" />
          </radialGradient>
          <radialGradient id={coreId} cx="50%" cy="88%" r="55%">
            <stop offset="0%" stopColor="#fffef6" />
            <stop offset="45%" stopColor="#fff0b0" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#fff0b0" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={baseId} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#cdeaff" stopOpacity="0.9" />
            <stop offset="60%" stopColor="#8fc4ee" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#8fc4ee" stopOpacity="0" />
          </radialGradient>
        </defs>
        <path
          d="M20 2C11 16 6 27 6 38C6 51.2548 12.268 60 20 60C27.732 60 34 51.2548 34 38C34 27 29 16 20 2Z"
          fill={`url(#${gradId})`}
        />
        <ellipse cx="20" cy="55" rx="6.5" ry="8.5" fill={`url(#${baseId})`} />
        <path
          d="M20 27C15.5 34.5 13.5 40 13.5 45C13.5 50.2 16.4 54 20 54C23.6 54 26.5 50.2 26.5 45C26.5 40 24.5 34.5 20 27Z"
          fill={`url(#${coreId})`}
        />
      </svg>
    </>
  )
}

interface CandleBodyProps {
  scale: number
  lit: boolean
  igniting: boolean
  smoking: boolean
  gradId: string
  leanRef?: React.Ref<HTMLDivElement>
}

function CandleBody({ scale, lit, igniting, smoking, gradId, leanRef }: CandleBodyProps) {
  const stageStyle = { '--candle-scale': scale } as React.CSSProperties
  return (
    <div className="candle-stage" style={stageStyle}>
      <div className="candle-flame-slot">
        {lit && (
          <div ref={leanRef} className="candle-flame-lean">
            <div className={`candle-flame-wrap${igniting ? ' candle-igniting' : ''}`}>
              <FlameGraphic gradId={gradId} />
            </div>
          </div>
        )}
        {!lit && <div className="candle-ember" />}
        {smoking && (
          <div className="candle-smoke">
            <span className="candle-smoke-wisp cs-1" />
            <span className="candle-smoke-wisp cs-2" />
            <span className="candle-smoke-wisp cs-3" />
          </div>
        )}
      </div>
      <div className="candle-wick" />
      <div className="candle-wax-group">
        <div className="candle-wax">
          <span className="candle-drip cd-1" />
          <span className="candle-drip cd-2" />
          <span className="candle-drip cd-3" />
        </div>
        <span className="candle-drip-holder" />
      </div>
      <div className="candle-holder-cup" />
      <div className="candle-holder-stem" />
      <div className="candle-saucer">
        <span className="candle-saucer-ring" />
        <span className="candle-drip-saucer" />
      </div>
    </div>
  )
}

interface CandleRoomProps {
  children: React.ReactNode
  dark: boolean
  fill?: boolean
}

function CandleRoom({ children, dark, fill }: CandleRoomProps) {
  return (
    <div className={`candle-room${fill ? ' candle-room--fill' : ' candle-room--stage'}${dark ? ' candle-room-dark' : ''}`}>
      <div className="candle-rod" />
      <div className="candle-sconce candle-sconce-left" />
      <div className="candle-sconce candle-sconce-right" />
      <div className="candle-column candle-column-left" />
      <div className="candle-column candle-column-right" />
      <div className="candle-curtain candle-curtain-left" />
      <div className="candle-curtain candle-curtain-right" />
      <div className="candle-stage-floor" />
      <div className="candle-room-content">{children}</div>
    </div>
  )
}

function CandleModal({ onClose }: { onClose: () => void }) {
  const gradId = useId()
  const audioCtxRef = useRef<AudioContext | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const leanRef = useRef<HTMLDivElement>(null)
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
    if (leanRef.current) leanRef.current.style.transform = ''
    window.clearTimeout(smokeTimerRef.current)
    smokeTimerRef.current = window.setTimeout(() => setSmoking(false), SMOKE_DURATION_MS)
  }

  const relight = () => {
    blowStartRef.current = null
    litRef.current = true
    setLit(true)
    setIgniting(true)
    window.setTimeout(() => setIgniting(false), 260)
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
          if (leanRef.current) {
            leanRef.current.style.transform =
              `translateX(${lean * 15}px) rotate(${lean * 22}deg) scale(${1 - lean * 0.3}, ${1 + lean * 0.08})`
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

        <CandleRoom dark={!lit}>
          <CandleBody scale={1.4} lit={lit} igniting={igniting} smoking={smoking} gradId={gradId} leanRef={leanRef} />
        </CandleRoom>

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
  const previewGradId = useId()
  const [open, setOpen] = useState(false)

  return (
    <div className="candle-viz" style={{ width, height }}>
      <CandleRoom dark={false} fill>
        <CandleBody scale={0.62} lit igniting={false} smoking={false} gradId={previewGradId} />
      </CandleRoom>
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
