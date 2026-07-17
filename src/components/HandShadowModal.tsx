import { useEffect, useRef, useState } from 'react'
import type { HandLandmarkerResult } from '@mediapipe/tasks-vision'
import { useHandTracking } from '../hooks/useHandTracking'

interface HandShadowModalProps {
  onClose: () => void
}

const PALM = [0, 5, 9, 13, 17]
// each finger as one continuous joint chain — a single stroked path per
// finger keeps the knuckles smooth instead of stacking round-capped
// segments into lumpy "sausage link" bulges
const FINGER_CHAINS = [
  [0, 1, 2, 3, 4],
  [5, 6, 7, 8],
  [9, 10, 11, 12],
  [13, 14, 15, 16],
  [17, 18, 19, 20],
]

export function HandShadowModal({ onClose }: HandShadowModalProps) {
  const [handsVisible, setHandsVisible] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  const draw = (results: HandLandmarkerResult) => {
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
    ctx.filter = 'blur(3px)'
    ctx.fillStyle = 'rgba(35, 35, 38, 0.82)'
    ctx.strokeStyle = 'rgba(35, 35, 38, 0.82)'
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    setHandsVisible(results.landmarks.length)

    for (const hand of results.landmarks) {
      // mirror for a natural selfie-view shadow
      const pts = hand.map(p => ({ x: (1 - p.x) * width, y: p.y * height }))
      const palmWidth = Math.hypot(pts[5].x - pts[17].x, pts[5].y - pts[17].y)
      const fingerWidth = Math.max(11, palmWidth * 0.34)
      ctx.lineWidth = fingerWidth

      for (const chain of FINGER_CHAINS) {
        ctx.beginPath()
        ctx.moveTo(pts[chain[0]].x, pts[chain[0]].y)
        for (const i of chain.slice(1)) ctx.lineTo(pts[i].x, pts[i].y)
        ctx.stroke()
      }

      // palm: filled polygon so it reads as a hand, not a set of loose fingers
      ctx.beginPath()
      ctx.moveTo(pts[PALM[0]].x, pts[PALM[0]].y)
      for (const i of PALM.slice(1)) ctx.lineTo(pts[i].x, pts[i].y)
      ctx.closePath()
      ctx.fill()

      // the landmark model stops at the wrist — extrapolate a tapered forearm
      // beyond it so the shadow reads as an arm reaching in, not a floating hand
      const wrist = pts[0]
      const midMcp = pts[9]
      const dx = wrist.x - midMcp.x
      const dy = wrist.y - midMcp.y
      const dirLen = Math.hypot(dx, dy) || 1
      const dirX = dx / dirLen
      const dirY = dy / dirLen
      const perpX = -dirY
      const perpY = dirX

      // start the taper a little inside the palm so it overlaps rather than
      // butting against it, avoiding a visible "cuff" seam once blurred
      const nearX = wrist.x - dirX * palmWidth * 0.25
      const nearY = wrist.y - dirY * palmWidth * 0.25
      const forearmLen = palmWidth * 3.6
      const nearHalf = palmWidth * 0.62
      const farHalf = palmWidth * 0.72
      const farX = wrist.x + dirX * forearmLen
      const farY = wrist.y + dirY * forearmLen

      ctx.beginPath()
      ctx.moveTo(nearX + perpX * nearHalf, nearY + perpY * nearHalf)
      ctx.lineTo(farX + perpX * farHalf, farY + perpY * farHalf)
      ctx.lineTo(farX - perpX * farHalf, farY - perpY * farHalf)
      ctx.lineTo(nearX - perpX * nearHalf, nearY - perpY * nearHalf)
      ctx.closePath()
      ctx.fill()
    }
    ctx.filter = 'none'
  }

  const { stage, start, videoRef } = useHandTracking({ onResults: draw })

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
