import { useEffect, useRef, useState } from 'react'

interface CourtStudyModalProps {
  onClose: () => void
}

interface GlyphSpec {
  x: number
  y: number
  rot: number
  ch: string
  size: number
  cls: string
}

// ---- seeded RNG so the plate looks identical on every load ----
function mulberry32(seed: number) {
  let s = seed
  return function () {
    s |= 0
    s = (s + 0x6d2b79f5) | 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// ---- court projection: (u,v) court-space -> canvas pixels ----
// u: 0 (near baseline) .. 1 (far baseline)
// v: -1 (left doubles sideline) .. 1 (right doubles sideline)
const TILT = -0.3
const BASE_X = 430
const BASE_Y = 536
const LEN_PX = 430
const WID_PX = 300
const CA = Math.cos(TILT)
const SA = Math.sin(TILT)

function project(u: number, v: number): [number, number] {
  const persp = 1 - 0.42 * u
  const rawX = v * (WID_PX / 2) * persp
  const rawY = -u * LEN_PX
  return [BASE_X + rawX * CA - rawY * SA, BASE_Y + rawX * SA + rawY * CA]
}

function buildGlyphs(): GlyphSpec[] {
  const rand = mulberry32(12321)
  const glyphs: GlyphSpec[] = []
  const push = (x: number, y: number, rot: number, ch: string, size: number, cls: string) =>
    glyphs.push({ x, y, rot, ch, size, cls })

  const lineCharsXY = (x1: number, y1: number, x2: number, y2: number, ch: string, spacing: number, size: number, cls: string) => {
    const dx = x2 - x1, dy = y2 - y1
    const dist = Math.hypot(dx, dy)
    const steps = Math.max(1, Math.round(dist / spacing))
    const angle = (Math.atan2(dy, dx) * 180) / Math.PI
    for (let i = 0; i <= steps; i++) {
      const t = i / steps
      push(x1 + dx * t, y1 + dy * t, angle, ch, size, cls)
    }
  }

  const lineCharsUV = (u1: number, v1: number, u2: number, v2: number, ch: string, spacing: number, size: number, cls: string) => {
    const p1 = project(u1, v1), p2 = project(u2, v2)
    const approxLen = Math.hypot(p2[0] - p1[0], p2[1] - p1[1])
    const steps = Math.max(2, Math.round(approxLen / spacing))
    for (let i = 0; i <= steps; i++) {
      const t = i / steps
      const u = u1 + (u2 - u1) * t, v = v1 + (v2 - v1) * t
      const p = project(u, v)
      const pAhead = project(u + (u2 - u1) * 0.001, v + (v2 - v1) * 0.001)
      const angle = (Math.atan2(pAhead[1] - p[1], pAhead[0] - p[0]) * 180) / Math.PI
      push(p[0], p[1], angle, ch, size, cls)
    }
  }

  const fillRegionUV = (u0: number, u1: number, v0: number, v1: number, ch: string, stepU: number, stepV: number, keepProb: number, size: number, cls: string, jitter: number) => {
    for (let u = u0; u <= u1; u += stepU) {
      for (let v = v0; v <= v1; v += stepV) {
        if (rand() > keepProb) continue
        const ju = u + (rand() - 0.5) * stepU * 0.7
        const jv = v + (rand() - 0.5) * stepV * 0.7
        const p = project(ju, jv)
        const pAhead = project(ju + 0.01, jv)
        const baseAngle = (Math.atan2(pAhead[1] - p[1], pAhead[0] - p[0]) * 180) / Math.PI
        const rot = baseAngle + (rand() - 0.5) * jitter
        push(p[0], p[1], rot, ch, size, cls)
      }
    }
  }

  // surrounds / apron, framing the court on all four sides
  fillRegionUV(-0.1, 1.14, -1.3, -1.04, '+', 0.05, 0.1, 0.65, 8, 'tone2', 16)
  fillRegionUV(-0.1, 1.14, 1.04, 1.3, '+', 0.05, 0.1, 0.65, 8, 'tone2', 16)
  fillRegionUV(-0.1, -0.01, -1.3, 1.3, '+', 0.045, 0.1, 0.6, 8, 'tone2', 16)
  fillRegionUV(1.01, 1.14, -1.3, 1.3, '+', 0.04, 0.1, 0.65, 8, 'tone2', 16)

  // gallery band, tiered beyond the far baseline
  fillRegionUV(1.16, 1.44, -1.4, 1.4, '=', 0.038, 0.09, 0.76, 8.5, 'tone3', 13)

  // court surface, inside the lines — light turf texture
  fillRegionUV(0.02, 0.98, -0.98, 0.98, '.', 0.05, 0.1, 0.5, 7, 'tone1', 12)

  // net mesh
  fillRegionUV(0.485, 0.515, -1.07, 1.07, 'x', 0.014, 0.045, 0.88, 8.5, 'tone5', 10)

  // court lines, typed as dashes so they read as struck strokes
  const LS = 11, SZ = 13
  lineCharsUV(0, -1, 1, -1, '-', LS, SZ, 'ink-line')
  lineCharsUV(0, 1, 1, 1, '-', LS, SZ, 'ink-line')
  lineCharsUV(0, -0.78, 1, -0.78, '-', LS, SZ, 'ink-line')
  lineCharsUV(0, 0.78, 1, 0.78, '-', LS, SZ, 'ink-line')
  lineCharsUV(0, -1, 0, 1, '-', LS, SZ, 'ink-line')
  lineCharsUV(1, -1, 1, 1, '-', LS, SZ, 'ink-line')
  lineCharsUV(0.23, -0.78, 0.23, 0.78, '-', LS, SZ, 'ink-line')
  lineCharsUV(0.77, -0.78, 0.77, 0.78, '-', LS, SZ, 'ink-line')
  lineCharsUV(0.23, 0, 0.77, 0, '-', LS, SZ, 'ink-line')
  lineCharsUV(-0.02, 0, 0.02, 0, "'", 10, 9, 'ink-line')
  lineCharsUV(0.98, 0, 1.02, 0, "'", 10, 9, 'ink-line')

  // net posts
  const netL = project(0.5, -1.06), netR = project(0.5, 1.06)
  lineCharsXY(netL[0], netL[1] - 24, netL[0], netL[1] + 24, '|', 9, 11, 'ink-line')
  lineCharsXY(netR[0], netR[1] - 24, netR[0], netR[1] + 24, '|', 9, 11, 'ink-line')

  // umpire's chair, hand-placed just off the doubles line
  const chairBase = project(0.5, 1.32)
  const cx = chairBase[0], cy = chairBase[1]
  lineCharsXY(cx - 14, cy + 34, cx - 6, cy - 30, '|', 9, 9, 'ink-line')
  lineCharsXY(cx + 14, cy + 34, cx + 6, cy - 30, '|', 9, 9, 'ink-line')
  lineCharsXY(cx - 13, cy + 20, cx + 13, cy + 20, '-', 8, 9, 'ink-line')
  lineCharsXY(cx - 10, cy + 4, cx + 10, cy + 4, '-', 8, 9, 'ink-line')
  lineCharsXY(cx - 8, cy - 10, cx + 8, cy - 10, '-', 8, 9, 'ink-line')
  lineCharsXY(cx - 9, cy - 24, cx + 9, cy - 24, '=', 8, 10, 'ink-line')

  // the ball — a single struck zero
  const ballP = project(0.4, -0.18)
  push(ballP[0], ballP[1], -14, '0', 24, 'ball-char')

  return glyphs
}

const GLYPHS = buildGlyphs()

const NEAR_L = project(0, -1)
const NEAR_R = project(0, 1)
const FAR_L = project(1, -1)
const FAR_R = project(1, 1)
const CORNERS: [string, [number, number]][] = [
  ['01', NEAR_L],
  ['02', NEAR_R],
  ['03', FAR_L],
  ['04', FAR_R],
]

interface GlyphRef {
  el: SVGTextElement
  cx: number
  cy: number
  fdx: number
  fdy: number
  frot: number
}

export function CourtStudyModal({ onClose }: CourtStudyModalProps) {
  const artRef = useRef<SVGSVGElement>(null)
  const glyphRefs = useRef<GlyphRef[]>([])
  const [struck, setStruck] = useState(false)

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  useEffect(() => {
    const svgNS = 'http://www.w3.org/2000/svg'
    const art = artRef.current
    if (!art) return

    art.replaceChildren()
    const rand = mulberry32(90210)
    const frag = document.createDocumentFragment()
    const refs: GlyphRef[] = []

    GLYPHS.forEach(g => {
      const wrap = document.createElementNS(svgNS, 'g')
      wrap.setAttribute('transform', `translate(${g.x.toFixed(2)},${g.y.toFixed(2)}) rotate(${g.rot.toFixed(1)})`)

      const text = document.createElementNS(svgNS, 'text')
      text.setAttribute('class', `ct-glyph ct-${g.cls}`)
      text.setAttribute('text-anchor', 'middle')
      text.setAttribute('dominant-baseline', 'middle')
      text.setAttribute('font-size', String(g.size))
      text.textContent = g.ch

      wrap.appendChild(text)
      frag.appendChild(wrap)

      refs.push({
        el: text,
        cx: g.x,
        cy: g.y,
        fdx: (rand() - 0.5) * 90,
        fdy: 260 + rand() * 260,
        frot: (rand() - 0.5) * 640,
      })
    })

    const guideLine = (x1: number, y1: number, x2: number, y2: number) => {
      const l = document.createElementNS(svgNS, 'line')
      l.setAttribute('class', 'ct-guide')
      l.setAttribute('x1', String(x1)); l.setAttribute('y1', String(y1))
      l.setAttribute('x2', String(x2)); l.setAttribute('y2', String(y2))
      frag.appendChild(l)
    }
    guideLine(NEAR_L[0], NEAR_L[1] - 30, FAR_L[0], FAR_L[1] - 30)
    guideLine(NEAR_R[0], NEAR_R[1] + 30, FAR_R[0], FAR_R[1] + 30)

    CORNERS.forEach(([label, pt]) => {
      const circ = document.createElementNS(svgNS, 'circle')
      circ.setAttribute('class', 'ct-dot')
      circ.setAttribute('cx', String(pt[0])); circ.setAttribute('cy', String(pt[1])); circ.setAttribute('r', '3.2')
      frag.appendChild(circ)

      const text = document.createElementNS(svgNS, 'text')
      text.setAttribute('class', 'ct-coord')
      text.setAttribute('x', String(pt[0] + 7))
      text.setAttribute('y', String(pt[1] - 6))
      text.textContent = `${label}·${Math.round(pt[0])},${Math.round(pt[1])}`
      frag.appendChild(text)
    })

    art.appendChild(frag)
    glyphRefs.current = refs

    return () => {
      art.replaceChildren()
      glyphRefs.current = []
    }
  }, [])

  const toSvgPoint = (evt: React.MouseEvent<SVGSVGElement>) => {
    const art = artRef.current!
    const pt = art.createSVGPoint()
    pt.x = evt.clientX
    pt.y = evt.clientY
    return pt.matrixTransform(art.getScreenCTM()!.inverse())
  }

  const handleStrike = (evt: React.MouseEvent<SVGSVGElement>) => {
    if (struck) return
    const p = toSvgPoint(evt)
    setStruck(true)
    glyphRefs.current.forEach(ref => {
      const dist = Math.hypot(ref.cx - p.x, ref.cy - p.y)
      ref.el.style.transitionDelay = `${Math.min(dist * 1.05, 1500)}ms`
      ref.el.style.transform = `translate(${ref.fdx}px,${ref.fdy}px) rotate(${ref.frot}deg)`
      ref.el.style.opacity = '0'
    })
  }

  const handleRetype = () => {
    if (!struck) return
    setStruck(false)
    glyphRefs.current.forEach((ref, i) => {
      ref.el.style.transitionDelay = `${(i % 40) * 4}ms`
      ref.el.style.transform = 'translate(0px,0px) rotate(0deg)'
      ref.el.style.opacity = '1'
    })
  }

  return (
    <div className="ct-modal-backdrop" onClick={onClose}>
      <div className="ct-modal-content" onClick={e => e.stopPropagation()}>
        <button className="ct-modal-close" onClick={onClose} aria-label="Close">✕</button>

        <div className="ct-sheet">
          <div className="ct-masthead">
            <div className="ct-mark">
              <span className="ct-glyph-mark" aria-hidden="true">&#10021;</span>
              <span className="ct-word">Field&nbsp;Plates</span>
            </div>
            <div className="ct-index">FIG.&nbsp;12<br />REV.&nbsp;001</div>
          </div>

          <h2 className="ct-h1">A court struck flat, one line at a time</h2>
          <p className="ct-dek">
            Every line, every blade of turf, every seat in the stand is a typed character —
            nothing here was drawn. Strike the plate with the ball and the whole court comes apart.
          </p>

          <figure className="ct-plate">
            <div className="ct-plate-inner">
              <svg
                ref={artRef}
                className="ct-art"
                viewBox="0 0 900 620"
                role="img"
                aria-label="A tennis court illustration built entirely from typed characters. Click to watch it fall apart; use Retype to restore it."
                onClick={handleStrike}
              />

              <div className="ct-readout">
                <span className="ct-state">{struck ? 'Struck — dismantled' : 'Struck once, holding'}</span>
                <span>Click the court to dismantle it</span>
              </div>
            </div>
          </figure>

          <p className="ct-caption">
            Court 12 of the same field series — surveyed courtside rather than portraitside.{' '}
            <b>.</b> marks turf, <b>+</b> the surrounds, <b>=</b> the gallery, <b>x</b> the net,{' '}
            <b>0</b> the ball. Click anywhere on the plate to strike it; the fall radiates outward
            from wherever the ball lands.
          </p>

          <div className="ct-controls">
            <span className="ct-footer-meta">Study&nbsp;/&nbsp;Court&nbsp;12</span>
            <button className="ct-retype" onClick={handleRetype} disabled={!struck} type="button">
              &#8635;&nbsp;Retype the plate
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
