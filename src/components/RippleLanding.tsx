import { useEffect, useRef, useCallback } from 'react'
import './RippleLanding.css'

// ── Vertex shader ──────────────────────────────────────────────────
const VERT = `
attribute vec2 aPos;
varying   vec2 vUV;
void main() {
  vUV         = aPos * 0.5 + 0.5;
  vUV.y       = 1.0 - vUV.y;          /* flip Y to match image coords */
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`

// ── Fragment shader — glass-distortion effect ─────────────────────
// uTex   = hero photo
// uRipA  = ripple image for current stage (lower intensity)
// uRipB  = ripple image for next stage   (higher intensity)
// uBlend = 0→1 blend between A and B
// uStrength = overall displacement strength (0 at p=0 → 1 at p=1)
const FRAG = `
precision highp float;

uniform sampler2D uTex;
uniform sampler2D uRipA;
uniform sampler2D uRipB;
uniform float     uBlend;
uniform float     uStrength;
uniform float     uTime;
uniform vec2      uResolution;

varying vec2 vUV;

void main() {
  /* Cover-fit: map canvas UV → photo UV preserving aspect ratio */
  vec2 canvasAR = uResolution / min(uResolution.x, uResolution.y);
  vec2 photoAR  = vec2(1500.0, 2000.0) / 1500.0;  /* photo is 3:4 */
  vec2 scale    = canvasAR / photoAR;
  vec2 photoUV  = (vUV - 0.5) * scale + 0.5;

  /* Sample displacement map — use red channel as dx, green as dy */
  vec4 ripA = texture2D(uRipA, vUV);
  vec4 ripB = texture2D(uRipB, vUV);
  vec4 rip  = mix(ripA, ripB, uBlend);

  /* Subtle animated shimmer — keeps the glass alive */
  float shimmer = sin(vUV.x * 18.0 + uTime * 1.1) * 0.004
                + sin(vUV.y * 14.0 - uTime * 0.7) * 0.003;

  /* Displacement: ripple red/green channels offset the photo sample */
  float maxDisp = 0.045;
  vec2 disp = (rip.rg - 0.5) * 2.0 * maxDisp * uStrength + shimmer * uStrength;

  vec2 sampleUV = photoUV + disp;
  /* Clamp so we don't sample outside the photo */
  sampleUV = clamp(sampleUV, 0.001, 0.999);

  vec4 photo = texture2D(uTex, sampleUV);

  /* Glass highlight — overlay ripple luminance as bright streaks */
  float ripLum = dot(rip.rgb, vec3(0.2126, 0.7152, 0.0722));
  vec3  gloss  = vec3(0.45, 0.65, 1.0) * pow(ripLum, 2.2) * uStrength * 0.55;

  /* Subtle vignette */
  float vig = 1.0 - dot(vUV - 0.5, vUV - 0.5) * 0.55;

  vec3 col = photo.rgb * vig + gloss;

  /* Colour-grade toward deep blue in shadows as effect intensifies */
  float lum = dot(col, vec3(0.2126, 0.7152, 0.0722));
  vec3  tint = mix(vec3(0.0, 0.04, 0.18), vec3(1.0), lum);
  col = mix(col, tint, uStrength * 0.25);

  gl_FragColor = vec4(col, 1.0);
}
`

// ── WebGL helpers ──────────────────────────────────────────────────
function compileShader(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!
  gl.shaderSource(s, src)
  gl.compileShader(s)
  return s
}

function makeProgram(gl: WebGLRenderingContext) {
  const prog = gl.createProgram()!
  gl.attachShader(prog, compileShader(gl, gl.VERTEX_SHADER,   VERT))
  gl.attachShader(prog, compileShader(gl, gl.FRAGMENT_SHADER, FRAG))
  gl.linkProgram(prog)
  gl.useProgram(prog)
  const buf = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buf)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    -1,-1, 1,-1, -1,1,
     1,-1, 1, 1, -1,1,
  ]), gl.STATIC_DRAW)
  const loc = gl.getAttribLocation(prog, 'aPos')
  gl.enableVertexAttribArray(loc)
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)
  return prog
}

function loadTexture(gl: WebGLRenderingContext, img: HTMLImageElement, unit: number) {
  gl.activeTexture(gl.TEXTURE0 + unit)
  const tex = gl.createTexture()!
  gl.bindTexture(gl.TEXTURE_2D, tex)
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
  return tex
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((res, rej) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload  = () => res(img)
    img.onerror = rej
    img.src = src
  })
}

// ── Component ──────────────────────────────────────────────────────
const RIPPLE_SRCS = [
  '/images/ripple-1.png',
  '/images/ripple-2.png',
  '/images/ripple-3.png',
  '/images/ripple-4.png',
  '/images/ripple-5.png',
]

interface Props { onComplete: () => void }

export function RippleLanding({ onComplete }: Props) {
  const canvasRef   = useRef<HTMLCanvasElement>(null)
  const rootRef     = useRef<HTMLDivElement>(null)
  const hintRef     = useRef<HTMLDivElement>(null)
  const progressRef = useRef(0)
  const rafRef      = useRef<number | undefined>(undefined)
  const startRef    = useRef<number | null>(null)
  const doneRef     = useRef(false)

  const startGL = useCallback(async () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const gl = canvas.getContext('webgl', { alpha: false })
    if (!gl) return

    // Load all images in parallel
    const [heroImg, ...rippleImgs] = await Promise.all([
      loadImage('/images/hero-landing.jpg'),
      ...RIPPLE_SRCS.map(loadImage),
    ])

    const prog = makeProgram(gl)

    // Upload hero to unit 0
    loadTexture(gl, heroImg, 0)
    gl.uniform1i(gl.getUniformLocation(prog, 'uTex'), 0)

    // Upload 5 ripple textures to units 1–5
    const ripTextures = rippleImgs.map((img, i) => {
      loadTexture(gl, img, i + 1)
      return i + 1
    })

    const uBlend     = gl.getUniformLocation(prog, 'uBlend')
    const uStrength  = gl.getUniformLocation(prog, 'uStrength')
    const uTime      = gl.getUniformLocation(prog, 'uTime')
    const uRes       = gl.getUniformLocation(prog, 'uResolution')
    const uRipA      = gl.getUniformLocation(prog, 'uRipA')
    const uRipB      = gl.getUniformLocation(prog, 'uRipB')

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

      // Map p (0→1) across 4 transitions between 5 images
      // pos 0 = img1, pos 1 = img2, ..., pos 4 = img5
      const pos    = p * 4
      const stageA = Math.min(Math.floor(pos), 3)   // 0–3
      const stageB = stageA + 1                      // 1–4
      const blend  = pos - stageA                    // 0→1 within this transition

      gl.uniform1i(uRipA, ripTextures[stageA])
      gl.uniform1i(uRipB, ripTextures[stageB])
      gl.uniform1f(uBlend,    blend)
      gl.uniform1f(uStrength, p)           // 0 = no distortion, 1 = full glass
      gl.uniform1f(uTime,     elapsed)
      gl.uniform2f(uRes, canvas.width, canvas.height)

      gl.drawArrays(gl.TRIANGLES, 0, 6)

      if (hintRef.current) {
        hintRef.current.style.opacity = p > 0.04 ? '0' : '1'
      }

      if (p >= 0.99 && !doneRef.current) {
        doneRef.current = true
        const root = rootRef.current
        if (root) { root.style.transition = 'opacity 0.65s ease'; root.style.opacity = '0' }
        setTimeout(onComplete, 680)
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => window.removeEventListener('resize', resize)
  }, [onComplete])

  useEffect(() => {
    document.body.style.overflow = 'hidden'

    const DIVISOR = 2.8

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

    const cleanupPromise = startGL()

    return () => {
      window.removeEventListener('wheel',      onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove',  onTouchMove)
      document.body.style.overflow = ''
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      cleanupPromise.then(fn => fn?.())
    }
  }, [startGL])

  return (
    <div ref={rootRef} className="ripple-root">
      <canvas ref={canvasRef} className="ripple-canvas" />

      {/* Name + role overlay */}
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
