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
      <svg className="candle-flame-svg" viewBox="0 0 30 70">
        <defs>
          <radialGradient id={gradId} cx="50%" cy="88%" r="78%">
            <stop offset="0%" stopColor="#fffdf2" />
            <stop offset="26%" stopColor="#ffe27a" />
            <stop offset="55%" stopColor="#ffa93f" />
            <stop offset="82%" stopColor="#ff6a1f" />
            <stop offset="100%" stopColor="#e8431a" stopOpacity="0.8" />
          </radialGradient>
          <radialGradient id={coreId} cx="50%" cy="90%" r="48%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="55%" stopColor="#fff6d0" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#fff6d0" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={baseId} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#cdeaff" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#8fc4ee" stopOpacity="0" />
          </radialGradient>
        </defs>
        <path
          d="M15 2C9 14 5 26 5 37C5 52.5 9.5 65 15 68C20.5 65 25 52.5 25 37C25 26 21 14 15 2Z"
          fill={`url(#${gradId})`}
        />
        <ellipse cx="15" cy="58" rx="4" ry="6" fill={`url(#${baseId})`} />
        <path
          d="M15 30C11 38 9 45 9 51C9 57.5 11.7 62 15 62C18.3 62 21 57.5 21 51C21 45 19 38 15 30Z"
          fill={`url(#${coreId})`}
        />
      </svg>
    </>
  )
}

function CandleWaxGraphic({ gradId }: { gradId: string }) {
  const bodyId = `${gradId}-wax-body`
  const paleId = `${gradId}-wax-pale`
  const ambId = `${gradId}-wax-amber`
  return (
    <svg className="candle-wax-svg" viewBox="0 0 64 136" preserveAspectRatio="none">
      <defs>
        <linearGradient id={bodyId} x1="15%" y1="0%" x2="85%" y2="100%">
          <stop offset="0%" stopColor="#fffaee" />
          <stop offset="32%" stopColor="#f8dea3" />
          <stop offset="62%" stopColor="#eda75e" />
          <stop offset="100%" stopColor="#cf6a37" />
        </linearGradient>
        <linearGradient id={paleId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fffdf6" stopOpacity="0.92" />
          <stop offset="100%" stopColor="#ffe6b0" stopOpacity="0.35" />
        </linearGradient>
        <linearGradient id={ambId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f2ba72" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#c04f27" stopOpacity="0.8" />
        </linearGradient>
      </defs>
      <path
        d="M15,17 C10,11 14,4 21,6 C23,1 30,-1 33,4 C38,-1 45,2 45,8
           C51,5 57,10 53,17 C59,24 60,36 53,44 C60,54 58,68 50,76
           C57,86 55,100 46,108 C52,114 49,121 42,125
           L19,125 C12,121 10,114 16,108
           C8,100 6,86 13,76 C5,68 3,54 10,44 C4,36 5,24 11,17
           C6,10 9,4 15,10 Z"
        fill={`url(#${bodyId})`}
      />
      <path
        d="M17,9 C14,28 17,48 13,68 C10,88 14,106 18,122 L24,122 C22,104 24,86 22,68 C21,48 24,28 25,9 Z"
        fill={`url(#${paleId})`}
      />
      <path
        d="M29,6 C26,26 30,46 27,64 C25,84 29,102 31,120 L37,120 C36,102 34,84 37,64 C40,44 38,24 37,6 Z"
        fill={`url(#${ambId})`}
      />
      <path
        d="M41,13 C39,28 42,42 39,54 C37,68 41,80 42,90 L47,88 C46,76 47,64 48,52 C50,38 48,26 47,12 Z"
        fill={`url(#${paleId})`}
        opacity="0.75"
      />
      <path
        d="M18,110 C15,119 14,128 19,133 C24,128 23,119 25,110 Z"
        fill={`url(#${ambId})`}
      />
    </svg>
  )
}

function CandleStemGraphic({ gradId }: { gradId: string }) {
  const metalId = `${gradId}-stem-metal`
  return (
    <svg className="candle-stem-svg" viewBox="0 0 90 50" preserveAspectRatio="none">
      <defs>
        <linearGradient id={metalId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#111318" />
          <stop offset="9%" stopColor="#3a3d42" />
          <stop offset="20%" stopColor="#8b8f96" />
          <stop offset="32%" stopColor="#f2f5f8" />
          <stop offset="42%" stopColor="#b6bac1" />
          <stop offset="52%" stopColor="#e4e8ec" />
          <stop offset="66%" stopColor="#6e7178" />
          <stop offset="84%" stopColor="#34363b" />
          <stop offset="100%" stopColor="#141518" />
        </linearGradient>
      </defs>
      <path
        d="M32,0 L58,0 C58,9 65,13 73,21 C82,29 84,39 77,45 C69,49 21,49 13,45 C6,39 8,29 17,21 C25,13 32,9 32,0 Z"
        fill={`url(#${metalId})`}
      />
    </svg>
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
        <CandleWaxGraphic gradId={gradId} />
      </div>
      <div className="candle-holder-cup" />
      <CandleStemGraphic gradId={gradId} />
      <div className="candle-saucer">
        <span className="candle-saucer-ring-mount" />
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
