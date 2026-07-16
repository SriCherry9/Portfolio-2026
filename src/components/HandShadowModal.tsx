import { useEffect, useRef, useState } from 'react'
import type { HandLandmarker as HandLandmarkerType } from '@mediapipe/tasks-vision'

interface HandShadowModalProps {
  onClose: () => void
}

type Stage = 'start' | 'loading' | 'active' | 'denied' | 'unsupported'

const FINGERTIPS = [4, 8, 12, 16, 20]
const PALM = [0, 5, 9, 13, 17]
// finger bones only — palm-boundary segments are covered by the palm fill instead,
// so fingers stay thin and separated rather than fusing into one blobby mass
const FINGER_BONES: Array<[number, number]> = [
  [0, 1], [1, 2], [2, 3], [3, 4],
  [5, 6], [6, 7], [7, 8],
  [9, 10], [10, 11], [11, 12],
  [13, 14], [14, 15], [15, 16],
  [17, 18], [18, 19], [19, 20],
]

export function HandShadowModal({ onClose }: HandShadowModalProps) {
  const [stage, setStage] = useState<Stage>('start')
  const [handsVisible, setHandsVisible] = useState(0)

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const landmarkerRef = useRef<HandLandmarkerType | null>(null)
  const rafRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      streamRef.current?.getTracks().forEach(track => track.stop())
      landmarkerRef.current?.close()
    }
  }, [])

  const draw = (results: { landmarks: Array<Array<{ x: number; y: number }>> }) => {
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !wrap || !ctx) return

    const { width, height } = wrap.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1
    if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, width, height)
    ctx.filter = 'blur(1.6px)'
    ctx.fillStyle = 'rgba(40, 40, 43, 0.85)'
    ctx.strokeStyle = 'rgba(40, 40, 43, 0.85)'
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    setHandsVisible(results.landmarks.length)

    for (const hand of results.landmarks) {
      // mirror for a natural selfie-view shadow
      const pts = hand.map(p => ({ x: (1 - p.x) * width, y: p.y * height }))
      const palmWidth = Math.hypot(pts[5].x - pts[17].x, pts[5].y - pts[17].y)
      const fingerWidth = Math.max(11, palmWidth * 0.34)
      ctx.lineWidth = fingerWidth

      ctx.beginPath()
      for (const [a, b] of FINGER_BONES) {
        ctx.moveTo(pts[a].x, pts[a].y)
        ctx.lineTo(pts[b].x, pts[b].y)
      }
      ctx.stroke()

      // palm: filled polygon plus a wrist taper so it reads as a hand, not a mitten
      ctx.beginPath()
      ctx.moveTo(pts[PALM[0]].x, pts[PALM[0]].y)
      for (const i of PALM.slice(1)) ctx.lineTo(pts[i].x, pts[i].y)
      ctx.closePath()
      ctx.fill()

      for (const i of FINGERTIPS) {
        ctx.beginPath()
        ctx.arc(pts[i].x, pts[i].y, fingerWidth * 0.52, 0, Math.PI * 2)
        ctx.fill()
      }
    }
    ctx.filter = 'none'
  }

  useEffect(() => {
    if (stage !== 'active') return

    const loop = () => {
      const video = videoRef.current
      const landmarker = landmarkerRef.current
      if (video && landmarker && video.readyState >= 2) {
        const results = landmarker.detectForVideo(video, performance.now())
        draw(results)
      }
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [stage])

  const start = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setStage('unsupported')
      return
    }
    setStage('loading')
    try {
      const [{ HandLandmarker, FilesetResolver }, stream] = await Promise.all([
        import('@mediapipe/tasks-vision'),
        navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false }),
      ])

      const vision = await FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.35/wasm'
      )
      const landmarker = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
          delegate: 'GPU',
        },
        runningMode: 'VIDEO',
        numHands: 2,
      })
      landmarkerRef.current = landmarker

      streamRef.current = stream
      const video = videoRef.current
      if (!video) return
      video.srcObject = stream
      await video.play()

      setStage('active')
    } catch (err) {
      console.error('Hand shadow setup failed:', err)
      setStage('denied')
    }
  }

  return (
    <div className="hs-modal-backdrop" onClick={onClose}>
      <div className="hs-modal-content" onClick={e => e.stopPropagation()}>
        <button className="hs-modal-close" onClick={onClose} aria-label="Close">✕</button>

        <div className="hs-window" ref={wrapRef}>
          <div className="hs-scene">
            <div className="hs-light-shaft" />
          </div>

          <video ref={videoRef} className="hs-video" playsInline muted />
          <canvas ref={canvasRef} className="hs-canvas" />

          {stage !== 'active' && (
            <div className="hs-overlay">
              {stage === 'start' && (
                <>
                  <span className="hs-overlay-icon">🖐</span>
                  <p className="hs-overlay-text">Turn on your camera and hold your hand up<br />to cast its shadow on the wall</p>
                  <button className="hs-start-btn" onClick={start}>Turn on camera</button>
                </>
              )}
              {stage === 'loading' && (
                <p className="hs-overlay-text">Warming up the light…</p>
              )}
              {stage === 'denied' && (
                <>
                  <p className="hs-overlay-text">Couldn't reach the camera. Check your browser's camera permission and try again.</p>
                  <button className="hs-start-btn" onClick={start}>Try again</button>
                </>
              )}
              {stage === 'unsupported' && (
                <p className="hs-overlay-text">This browser doesn't support camera access.</p>
              )}
            </div>
          )}
        </div>

        <div className="hs-controls">
          <div className="hs-hint">
            {stage === 'active'
              ? handsVisible > 0
                ? 'MAKE SHAPES WITH YOUR HANDS'
                : 'SHOW YOUR HAND TO THE CAMERA'
              : 'A SHADOW PUPPET PLAYGROUND'}
          </div>
        </div>
      </div>
    </div>
  )
}
