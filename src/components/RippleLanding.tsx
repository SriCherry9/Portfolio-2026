import { useEffect, useRef, useCallback } from 'react'
import './RippleLanding.css'

// ── Vertex shader ─────────────────────────────────────────────────
const VERT = `
attribute vec2 aPos;
void main() {
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`

// ── Fragment shader — matches the 5-stage ripple reference ────────
// Stage 0 → gentle, wide diagonal waves   (image 1)
// Stage 1 → tight, dense sinusoidal bands (image 5)
const FRAG = `
precision highp float;
uniform float uTime;
uniform float uProgress;   /* 0 → 1 driven by scroll */
uniform vec2  uResolution;

/* smooth HSL → RGB */
vec3 hsl(float h, float s, float l) {
  vec3 rgb = clamp(abs(mod(h * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
  return l + s * (rgb - 0.5) * (1.0 - abs(2.0 * l - 1.0));
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;

  float p  = uProgress;
  float p2 = p * p;

  /* Wave frequency ramps from ~1.5 to ~14 across the scroll */
  float freq  = 1.5 + p2 * 12.5;
  float speed = 0.25 + p * 0.55;
  float amp   = 0.012 + p2 * 0.10;

  /* Diagonal displacement — gives the striated look */
  float t     = uTime * speed;
  float diag  = (uv.x + uv.y) * freq * 6.283;
  float diag2 = (uv.x - uv.y) * freq * 4.5;

  float d1 = sin(diag  + t)         * amp;
  float d2 = sin(diag2 + t * 0.65)  * amp * 0.55;
  float d3 = sin(uv.x  * freq * 9.0 + t * 1.2) * amp * 0.3;

  vec2 rUV = uv + vec2(d1 + d2, d3 + d1 * 0.45);

  /* Primary wave value — this becomes the brightness */
  float w = sin(
    rUV.x * freq * 8.0 +
    rUV.y * freq * 6.0 +
    t
  ) * 0.5 + 0.5;

  /* Secondary cross-wave adds depth */
  float w2 = sin(
    rUV.x * freq * 5.5 -
    rUV.y * freq * 7.2 -
    t * 0.75
  ) * 0.5 + 0.5;

  float combined = mix(w, w2, 0.35);

  /* ── Colour palette matching reference images ──
     dark navy → electric blue → bright blue → white/cyan */
  float hue  = mix(0.64, 0.60, combined);   /* 230° → 216° (blue family) */
  float sat  = 0.95 + p * 0.05;
  float lum  = mix(0.04, 0.58, pow(combined, mix(3.5, 1.1, p)));

  vec3 col = hsl(hue, sat, lum);

  /* White highlight on wave crests — stronger as intensity rises */
  float crest = pow(combined, mix(9.0, 2.2, p));
  col = mix(col, vec3(0.72, 0.88, 1.0), crest * p * 0.85);

  /* Cyan shimmer on right edge (matches reference) */
  float cyanEdge = smoothstep(0.55, 1.0, uv.x);
  vec3  cyan     = vec3(0.0, 0.75, 1.0);
  col = mix(col, cyan * (lum + 0.1), cyanEdge * 0.38 * p);

  /* Vignette */
  vec2  vd  = uv - 0.5;
  float vig = 1.0 - dot(vd, vd) * 0.6;
  col *= vig;

  gl_FragColor = vec4(col, 1.0);
}
`

// ── WebGL helpers ─────────────────────────────────────────────────
function createShader(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!
  gl.shaderSource(s, src)
  gl.compileShader(s)
  return s
}

function createProgram(gl: WebGLRenderingContext) {
  const prog = gl.createProgram()!
  gl.attachShader(prog, createShader(gl, gl.VERTEX_SHADER,   VERT))
  gl.attachShader(prog, createShader(gl, gl.FRAGMENT_SHADER, FRAG))
  gl.linkProgram(prog)
  gl.useProgram(prog)
  // Full-screen quad
  const buf = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buf)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    -1,-1,  1,-1,  -1,1,
     1,-1,  1, 1,  -1,1,
  ]), gl.STATIC_DRAW)
  const loc = gl.getAttribLocation(prog, 'aPos')
  gl.enableVertexAttribArray(loc)
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)
  return prog
}

// ── Component ─────────────────────────────────────────────────────
interface Props { onComplete: () => void }

export function RippleLanding({ onComplete }: Props) {
  const canvasRef   = useRef<HTMLCanvasElement>(null)
  const rootRef     = useRef<HTMLDivElement>(null)
  const hintRef     = useRef<HTMLDivElement>(null)
  const progressRef = useRef(0)
  const rafRef      = useRef<number>()
  const startRef    = useRef<number | null>(null)
  const doneRef     = useRef(false)

  // ── WebGL render loop ─────────────────────────────────────────
  const startGL = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const gl = canvas.getContext('webgl')
    if (!gl) return

    const prog   = createProgram(gl)
    const uTime  = gl.getUniformLocation(prog, 'uTime')
    const uProg  = gl.getUniformLocation(prog, 'uProgress')
    const uRes   = gl.getUniformLocation(prog, 'uResolution')

    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
      gl.viewport(0, 0, canvas.width, canvas.height)
    }
    resize()
    window.addEventListener('resize', resize)

    const tick = (ts: number) => {
      if (startRef.current === null) startRef.current = ts
      const elapsed = (ts - startRef.current) / 1000
      const p       = progressRef.current

      gl.uniform1f(uTime, elapsed)
      gl.uniform1f(uProg, p)
      gl.uniform2f(uRes,  canvas.width, canvas.height)
      gl.drawArrays(gl.TRIANGLES, 0, 6)

      // Hide hint once scrolling starts
      if (hintRef.current) {
        hintRef.current.style.opacity = p > 0.04 ? '0' : '1'
      }

      // Completion: fully rippled → fade out → show portfolio
      if (p >= 0.99 && !doneRef.current) {
        doneRef.current = true
        const root = rootRef.current
        if (root) { root.style.transition = 'opacity 0.6s ease'; root.style.opacity = '0' }
        setTimeout(onComplete, 620)
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => window.removeEventListener('resize', resize)
  }, [onComplete])

  // ── Input: wheel + touch ─────────────────────────────────────
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

    const cleanup = startGL()

    return () => {
      window.removeEventListener('wheel',      onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove',  onTouchMove)
      document.body.style.overflow = ''
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      cleanup?.()
    }
  }, [startGL])

  return (
    <div ref={rootRef} className="ripple-root">
      <canvas ref={canvasRef} className="ripple-canvas" />

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
