import { useEffect, useRef, useCallback } from 'react'
import './RippleLanding.css'

// ── Vertex shader ──────────────────────────────────────────────────
const VERT = `
attribute vec2 aPos;
varying   vec2 vUV;
void main() {
  vUV         = aPos * 0.5 + 0.5;
  vUV.y       = 1.0 - vUV.y;
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`

// ── Fragment shader ────────────────────────────────────────────────
// The displacement has two components:
//   1. A time-driven sinusoidal wave field — always animating
//   2. The ripple image channels — shape + modulate the wave pattern
// uStrength ramps 0→1 with scroll, controlling overall intensity.
// At strength=0 the waves are very gentle (idle state), at 1 = full glass.
const FRAG = `
precision highp float;

uniform sampler2D uTex;
uniform sampler2D uRipA;
uniform sampler2D uRipB;
uniform float     uBlend;
uniform float     uStrength;   /* 0 = idle, 1 = full intensity */
uniform float     uTime;
uniform vec2      uResolution;

varying vec2 vUV;

void main() {
  /* ── Cover-fit photo onto canvas ─────────────────────────────── */
  /* Photo is portrait 3:4, canvas may be landscape */
  float canvasW = uResolution.x;
  float canvasH = uResolution.y;
  float photoAR = 1500.0 / 2000.0;   /* 0.75 */
  float canvasAR = canvasW / canvasH;

  vec2 photoUV;
  if (canvasAR > photoAR) {
    /* canvas is wider — fit width, crop height */
    float scale = canvasAR / photoAR;
    photoUV = vec2(vUV.x, (vUV.y - 0.5) * scale + 0.5);
  } else {
    /* canvas is taller — fit height, crop width */
    float scale = photoAR / canvasAR;
    photoUV = vec2((vUV.x - 0.5) * scale + 0.5, vUV.y);
  }

  /* ── Ripple displacement maps ─────────────────────────────────── */
  vec4 ripA = texture2D(uRipA, vUV);
  vec4 ripB = texture2D(uRipB, vUV);
  vec4 rip  = mix(ripA, ripB, uBlend);

  /* Ripple luminance drives local wave amplitude */
  float ripLum = dot(rip.rgb, vec3(0.299, 0.587, 0.114));

  /* ── Time-driven wave field — always alive ────────────────────── */
  /* Multiple overlapping sine waves travelling in different directions */
  float t   = uTime;
  float u   = vUV.x;
  float v   = vUV.y;

  /* Wave 1: diagonal, slow */
  float w1x = sin((u * 6.0 + v * 4.0) + t * 0.55) * 0.5 + 0.5;
  float w1y = cos((u * 5.0 - v * 7.0) + t * 0.40) * 0.5 + 0.5;

  /* Wave 2: tighter, faster — shaped by ripple image */
  float w2x = sin((u * 12.0 + v * 9.0) * ripLum + t * 0.85) * 0.5 + 0.5;
  float w2y = cos((u * 10.0 - v * 11.0) * ripLum - t * 0.70) * 0.5 + 0.5;

  /* Wave 3: very fine shimmer */
  float w3x = sin(u * 22.0 + v * 18.0 + t * 1.3) * 0.5 + 0.5;
  float w3y = cos(u * 19.0 - v * 21.0 - t * 1.1) * 0.5 + 0.5;

  /* Mix waves — ripple lum blends from coarse→fine */
  vec2 wave = mix(
    vec2(w1x, w1y),
    mix(vec2(w2x, w2y), vec2(w3x, w3y), ripLum),
    ripLum
  );

  /* ── Compute displacement ─────────────────────────────────────── */
  /* Idle floor: very subtle waves always present (0.008 max offset) */
  /* At full strength: up to 0.052 offset — strong glass distortion */
  float idleAmp  = 0.008;
  float maxAmp   = 0.052;
  float amp      = idleAmp + (maxAmp - idleAmp) * uStrength;

  vec2 disp = (wave - 0.5) * 2.0 * amp;

  /* Extra: use ripple R/G channels as an additional directional push */
  disp += (rip.rg - 0.5) * maxAmp * uStrength * 0.6;

  vec2 sampleUV = clamp(photoUV + disp, 0.001, 0.999);
  vec4 photo    = texture2D(uTex, sampleUV);

  /* ── Glass highlight streaks from ripple bright areas ─────────── */
  float crest = pow(ripLum, 2.0 - uStrength);
  vec3  gloss = vec3(0.4, 0.6, 1.0) * crest * (0.08 + uStrength * 0.45);

  /* ── Vignette ─────────────────────────────────────────────────── */
  vec2  vd  = vUV - 0.5;
  float vig = 1.0 - dot(vd, vd) * 0.5;

  vec3 col = photo.rgb * vig + gloss;

  /* ── Subtle blue shadow tint deepens with scroll ──────────────── */
  float lum = dot(col, vec3(0.2126, 0.7152, 0.0722));
  col = mix(col, mix(vec3(0.0, 0.03, 0.15), col, lum), uStrength * 0.22);

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
    -1,-1,  1,-1, -1, 1,
     1,-1,  1, 1, -1, 1,
  ]), gl.STATIC_DRAW)
  const loc = gl.getAttribLocation(prog, 'aPos')
  gl.enableVertexAttribArray(loc)
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)
  return prog
}

function uploadTexture(gl: WebGLRenderingContext, img: HTMLImageElement, unit: number) {
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
  const canvasRef      = useRef<HTMLCanvasElement>(null)
  const rootRef        = useRef<HTMLDivElement>(null)
  const hintRef        = useRef<HTMLDivElement>(null)
  const targetRef      = useRef(0)          // raw scroll target
  const displayRef     = useRef(0)          // smoothly lerped value used for rendering
  const rafRef         = useRef<number | undefined>(undefined)
  const startRef       = useRef<number | null>(null)
  const prevTsRef      = useRef<number | null>(null)
  const doneRef        = useRef(false)

  const startGL = useCallback(async () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const gl = canvas.getContext('webgl', { alpha: false })
    if (!gl) return

    const [heroImg, ...rippleImgs] = await Promise.all([
      loadImage('/images/hero-landing.jpg'),
      ...RIPPLE_SRCS.map(loadImage),
    ])

    const prog = makeProgram(gl)

    // Unit 0 = hero photo
    uploadTexture(gl, heroImg, 0)
    gl.uniform1i(gl.getUniformLocation(prog, 'uTex'), 0)

    // Units 1–5 = ripple stages
    const ripUnits = rippleImgs.map((img, i) => {
      uploadTexture(gl, img, i + 1)
      return i + 1
    })

    const uBlend    = gl.getUniformLocation(prog, 'uBlend')
    const uStrength = gl.getUniformLocation(prog, 'uStrength')
    const uTime     = gl.getUniformLocation(prog, 'uTime')
    const uRes      = gl.getUniformLocation(prog, 'uResolution')
    const uRipA     = gl.getUniformLocation(prog, 'uRipA')
    const uRipB     = gl.getUniformLocation(prog, 'uRipB')

    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
      gl.viewport(0, 0, canvas.width, canvas.height)
    }
    resize()
    window.addEventListener('resize', resize)

    const tick = (ts: number) => {
      if (startRef.current  === null) startRef.current  = ts
      if (prevTsRef.current === null) prevTsRef.current = ts

      const elapsed = (ts - startRef.current)  / 1000
      const dt      = Math.min((ts - prevTsRef.current) / 1000, 0.05)
      prevTsRef.current = ts

      // Smooth lerp: display progress chases target at ~4× per second
      const LERP = 1 - Math.pow(0.012, dt)   // ~exp decay, frame-rate independent
      displayRef.current += (targetRef.current - displayRef.current) * LERP
      const p = displayRef.current

      // Map smooth p across 4 transitions between 5 ripple images
      const pos    = p * 4
      const stageA = Math.min(Math.floor(pos), 3)
      const stageB = stageA + 1
      const blend  = pos - stageA   // 0→1 within each transition

      gl.uniform1i(uRipA, ripUnits[stageA])
      gl.uniform1i(uRipB, ripUnits[stageB])
      gl.uniform1f(uBlend,    blend)
      gl.uniform1f(uStrength, p)
      gl.uniform1f(uTime,     elapsed)
      gl.uniform2f(uRes, canvas.width, canvas.height)
      gl.drawArrays(gl.TRIANGLES, 0, 6)

      if (hintRef.current) {
        hintRef.current.style.opacity = p > 0.04 ? '0' : '1'
      }

      if (p >= 0.985 && !doneRef.current) {
        doneRef.current = true
        const root = rootRef.current
        if (root) { root.style.transition = 'opacity 0.7s ease'; root.style.opacity = '0' }
        setTimeout(onComplete, 720)
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => window.removeEventListener('resize', resize)
  }, [onComplete])

  useEffect(() => {
    document.body.style.overflow = 'hidden'

    const DIVISOR = 3.0

    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      targetRef.current = Math.min(1, Math.max(0,
        targetRef.current + e.deltaY / (window.innerHeight * DIVISOR)
      ))
    }

    let lastY = 0
    const onTouchStart = (e: TouchEvent) => { lastY = e.touches[0].clientY }
    const onTouchMove  = (e: TouchEvent) => {
      e.preventDefault()
      const dy = lastY - e.touches[0].clientY
      lastY    = e.touches[0].clientY
      targetRef.current = Math.min(1, Math.max(0,
        targetRef.current + dy / (window.innerHeight * DIVISOR)
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

      <div className="ripple-text">
        <p className="ripple-name-top">Sri Cherry Kotamreddy</p>
        <p className="ripple-role">Interaction Designer</p>
      </div>

      <div ref={hintRef} className="ripple-hint">
        <span className="ripple-hint-label">Scroll to enter</span>
        <span className="ripple-hint-bar" />
      </div>
    </div>
  )
}
