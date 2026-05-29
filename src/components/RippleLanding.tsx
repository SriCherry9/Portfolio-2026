import { useEffect, useRef } from 'react'
import './RippleLanding.css'

const IMAGES = [
  '/images/ripple-1.png',
  '/images/ripple-2.png',
  '/images/ripple-3.png',
  '/images/ripple-4.png',
  '/images/ripple-5.png',
]

interface Props { onComplete: () => void }

export function RippleLanding({ onComplete }: Props) {
  const rootRef     = useRef<HTMLDivElement>(null)
  const layerRefs   = useRef<(HTMLDivElement | null)[]>([])
  const hintRef     = useRef<HTMLDivElement>(null)
  const progressRef = useRef(0)
  const rafRef      = useRef<number | undefined>(undefined)
  const doneRef     = useRef(false)

  useEffect(() => {
    document.body.style.overflow = 'hidden'

    const DIVISOR = 2.6

    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      progressRef.current = Math.min(1, Math.max(0,
        progressRef.current + e.deltaY / (window.innerHeight * DIVISOR)
      ))
    }

    let lastY = 0
    const onTouchStart = (e: TouchEvent) => { lastY = e.touches[0].clientY }
    const onTouchMove  = (e: TouchEvent) => {
      e.preventDefault()
      const dy = lastY - e.touches[0].clientY
      lastY = e.touches[0].clientY
      progressRef.current = Math.min(1, Math.max(0,
        progressRef.current + dy / (window.innerHeight * DIVISOR)
      ))
    }

    window.addEventListener('wheel',      onWheel,      { passive: false })
    window.addEventListener('touchstart', onTouchStart, { passive: true  })
    window.addEventListener('touchmove',  onTouchMove,  { passive: false })

    // Each image occupies 1/4 of the scroll range (5 images = 4 transitions)
    // p=0: only image 1
    // p=0.25: crossfade 1→2
    // p=0.50: crossfade 2→3
    // p=0.75: crossfade 3→4
    // p=1.00: image 5
    const tick = () => {
      const p = progressRef.current
      const layers = layerRefs.current

      // Compute opacity for each layer
      for (let i = 0; i < 5; i++) {
        const el = layers[i]
        if (!el) continue
        // position on the 0–4 scale
        const pos = p * 4
        const dist = Math.abs(pos - i)
        const opacity = Math.max(0, 1 - dist)
        el.style.opacity = String(opacity)
      }

      // Hide hint once scrolling starts
      if (hintRef.current) {
        hintRef.current.style.opacity = p > 0.04 ? '0' : '1'
      }

      // Completion
      if (p >= 0.99 && !doneRef.current) {
        doneRef.current = true
        const root = rootRef.current
        if (root) { root.style.transition = 'opacity 0.6s ease'; root.style.opacity = '0' }
        setTimeout(onComplete, 620)
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('wheel',      onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove',  onTouchMove)
      document.body.style.overflow = ''
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [onComplete])

  return (
    <div ref={rootRef} className="ripple-root">
      {/* Image layers — stacked, crossfaded by scroll */}
      {IMAGES.map((src, i) => (
        <div
          key={i}
          ref={el => { layerRefs.current[i] = el }}
          className="ripple-layer"
          style={{ opacity: i === 0 ? 1 : 0 }}
        >
          <img src={src} className="ripple-img" alt="" />
        </div>
      ))}

      {/* Text overlay */}
      <div className="ripple-text">
        <p className="ripple-name-top">Sri Cherry Kotamreddy</p>
        <p className="ripple-role">Interaction Designer</p>
      </div>

      {/* Scroll hint */}
      <div ref={hintRef} className="ripple-hint">
        <span className="ripple-hint-label">SCROLL TO ENTER</span>
        <span className="ripple-hint-bar" />
      </div>
    </div>
  )
}
