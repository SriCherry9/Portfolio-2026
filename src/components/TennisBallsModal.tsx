import { useEffect, useRef } from 'react'
import Matter from 'matter-js'
import type { HandLandmarkerResult } from '@mediapipe/tasks-vision'
import { useHandTracking } from '../hooks/useHandTracking'

interface TennisBallsModalProps {
  onClose: () => void
}

const PALM = [0, 5, 9, 13, 17]
const BALL_RADIUS = 26
const WALL_THICK = 80

export function TennisBallsModal({ onClose }: TennisBallsModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const engineRef = useRef<Matter.Engine | null>(null)
  const ballsRef = useRef<Matter.Body[]>([])
  const wallsRef = useRef<Matter.Body[]>([])
  const rafRef = useRef<number | undefined>(undefined)
  // updated off the hand-tracking rAF loop, read from the physics rAF loop
  const handPointRef = useRef<{ x: number; y: number; reach: number } | null>(null)

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  const onHandResults = (results: HandLandmarkerResult) => {
    const canvas = canvasRef.current
    if (!canvas || results.landmarks.length === 0) {
      handPointRef.current = null
      return
    }
    const { width, height } = canvas.getBoundingClientRect()
    const hand = results.landmarks[0]
    let sx = 0, sy = 0
    for (const i of PALM) { sx += hand[i].x; sy += hand[i].y }
    const cx = (1 - sx / PALM.length) * width // mirror for a natural selfie view
    const cy = (sy / PALM.length) * height
    const palmWidth = Math.hypot(
      (1 - hand[5].x) * width - (1 - hand[17].x) * width,
      hand[5].y * height - hand[17].y * height
    )
    handPointRef.current = { x: cx, y: cy, reach: Math.max(90, palmWidth * 3.2) }
  }

  const { stage, start, videoRef } = useHandTracking({ onResults: onHandResults, numHands: 1 })

  // physics world — set up once, independent of camera/hand-tracking state
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const { Engine, Bodies, Body, Composite } = Matter
    const engine = Engine.create({ gravity: { x: 0, y: 0.55 } })
    engineRef.current = engine

    let width = window.innerWidth
    let height = window.innerHeight

    const buildWalls = (w: number, h: number) => [
      Bodies.rectangle(w / 2, h + WALL_THICK / 2, w * 3, WALL_THICK, { isStatic: true, label: 'floor', restitution: 0.4 }),
      Bodies.rectangle(w / 2, -WALL_THICK / 2, w * 3, WALL_THICK, { isStatic: true, label: 'ceiling', restitution: 0.4 }),
      Bodies.rectangle(-WALL_THICK / 2, h / 2, WALL_THICK, h * 3, { isStatic: true, label: 'wallL', restitution: 0.4 }),
      Bodies.rectangle(w + WALL_THICK / 2, h / 2, WALL_THICK, h * 3, { isStatic: true, label: 'wallR', restitution: 0.4 }),
    ]
    const walls = buildWalls(width, height)
    wallsRef.current = walls
    Composite.add(engine.world, walls)

    // pack balls edge-to-edge across the whole viewport, jittered slightly
    // so the grid doesn't look mechanically perfect
    const spacing = BALL_RADIUS * 2.05
    const cols = Math.ceil(width / spacing) + 1
    const rows = Math.ceil(height / spacing) + 1
    const balls: Matter.Body[] = []
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = col * spacing + (row % 2 === 0 ? 0 : spacing / 2) + (Math.random() - 0.5) * 4
        const y = row * spacing + (Math.random() - 0.5) * 4
        balls.push(
          Bodies.circle(x, y, BALL_RADIUS, {
            restitution: 0.55,
            friction: 0.05,
            frictionAir: 0.045,
            density: 0.0018,
          })
        )
      }
    }
    ballsRef.current = balls
    Composite.add(engine.world, balls)

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      const ctx = canvas.getContext('2d')
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resizeCanvas()

    const onResize = () => {
      width = window.innerWidth
      height = window.innerHeight
      resizeCanvas()
      const [floor, ceiling, wallL, wallR] = wallsRef.current
      Body.setPosition(floor, { x: width / 2, y: height + WALL_THICK / 2 })
      Body.setPosition(ceiling, { x: width / 2, y: -WALL_THICK / 2 })
      Body.setPosition(wallL, { x: -WALL_THICK / 2, y: height / 2 })
      Body.setPosition(wallR, { x: width + WALL_THICK / 2, y: height / 2 })
    }
    window.addEventListener('resize', onResize)

    const draw = (ctx: CanvasRenderingContext2D) => {
      ctx.clearRect(0, 0, width, height)
      for (const ball of ballsRef.current) {
        const { x, y } = ball.position
        ctx.save()
        ctx.translate(x, y)
        ctx.rotate(ball.angle)

        const grad = ctx.createRadialGradient(-BALL_RADIUS * 0.3, -BALL_RADIUS * 0.35, BALL_RADIUS * 0.15, 0, 0, BALL_RADIUS)
        grad.addColorStop(0, '#eaff7f')
        grad.addColorStop(0.55, '#cbe83f')
        grad.addColorStop(1, '#8ea822')
        ctx.beginPath()
        ctx.arc(0, 0, BALL_RADIUS, 0, Math.PI * 2)
        ctx.fillStyle = grad
        ctx.fill()

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.88)'
        ctx.lineWidth = Math.max(1.5, BALL_RADIUS * 0.1)
        ctx.lineCap = 'round'
        ctx.beginPath()
        ctx.arc(BALL_RADIUS * 0.62, 0, BALL_RADIUS * 0.88, Math.PI * 0.62, Math.PI * 1.38)
        ctx.stroke()
        ctx.beginPath()
        ctx.arc(-BALL_RADIUS * 0.62, 0, BALL_RADIUS * 0.88, -Math.PI * 0.38, Math.PI * 0.38)
        ctx.stroke()
        ctx.restore()
      }

      const hand = handPointRef.current
      if (hand) {
        const glow = ctx.createRadialGradient(hand.x, hand.y, 0, hand.x, hand.y, hand.reach)
        glow.addColorStop(0, 'rgba(255, 255, 255, 0.16)')
        glow.addColorStop(1, 'rgba(255, 255, 255, 0)')
        ctx.beginPath()
        ctx.arc(hand.x, hand.y, hand.reach, 0, Math.PI * 2)
        ctx.fillStyle = glow
        ctx.fill()
      }
    }

    const loop = () => {
      const hand = handPointRef.current
      if (hand) {
        for (const ball of ballsRef.current) {
          const dx = ball.position.x - hand.x
          const dy = ball.position.y - hand.y
          const dist = Math.hypot(dx, dy)
          if (dist > 0.001 && dist < hand.reach) {
            const falloff = 1 - dist / hand.reach
            const strength = falloff * falloff * 0.045
            Body.applyForce(ball, ball.position, { x: (dx / dist) * strength, y: (dy / dist) * strength })
          }
        }
      }
      Engine.update(engine, 1000 / 60)
      const ctx = canvas.getContext('2d')
      if (ctx) draw(ctx)
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', onResize)
      Composite.clear(engine.world, false)
      Engine.clear(engine)
    }
  }, [])

  return (
    <div className="tb-modal-backdrop">
      <button className="tb-modal-close" onClick={onClose} aria-label="Close">✕</button>

      <canvas ref={canvasRef} className="tb-canvas" />
      <video ref={videoRef} className="tb-video" playsInline muted />

      {stage !== 'active' && (
        <div className="tb-overlay">
          {stage === 'start' && (
            <>
              <span className="tb-overlay-icon">🎾</span>
              <p className="tb-overlay-text">Turn on your camera and reach in —<br />wave your hand to scatter the balls</p>
              <button className="tb-start-btn" onClick={start}>Turn on camera</button>
            </>
          )}
          {stage === 'loading' && (
            <p className="tb-overlay-text">Filling the court…</p>
          )}
          {stage === 'denied' && (
            <>
              <p className="tb-overlay-text">Couldn't reach the camera. Check your browser's camera permission and try again.</p>
              <button className="tb-start-btn" onClick={start}>Try again</button>
            </>
          )}
          {stage === 'unsupported' && (
            <p className="tb-overlay-text">This browser doesn't support camera access.</p>
          )}
        </div>
      )}

      <div className="tb-hint">
        {stage === 'active' ? 'REACH IN TO SCATTER THE BALLS' : 'A BALL PIT PLAYGROUND'}
      </div>
    </div>
  )
}
