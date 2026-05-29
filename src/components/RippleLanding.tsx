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
// Idle  : domain-warped flow noise — organic, water-like waves always moving
// Scroll: ripple images drive strong glass-pane distortion on top
const FRAG = `
precision highp float;

uniform sampler2D uTex;    /* hero photo         — unit 0 */
uniform sampler2D uRipA;   /* ripple stage A     — unit 1–5 */
uniform sampler2D uRipB;   /* ripple stage B     — unit 1–5 */
uniform float     uBlend;  /* 0→1 between A & B  */
uniform float     uScroll; /* 0→1 scroll progress (lerped) */
uniform float     uTime;
uniform vec2      uResolution;

varying vec2 vUV;

/* ── smooth noise helpers ─────────────────────────────────────── */
vec2 hash2(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)),
           dot(p, vec2(269.5, 183.3)));
  return fract(sin(p) * 43758.5453);
}

/* value noise, returns 0→1 */
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);  /* smoothstep */
  float a = dot(hash2(i + vec2(0,0)), f - vec2(0,0));
  float b = dot(hash2(i + vec2(1,0)), f - vec2(1,0));
  float c = dot(hash2(i + vec2(0,1)), f - vec2(0,1));
  float d = dot(hash2(i + vec2(1,1)), f - vec2(1,1));
  return 0.5 + 0.5 * mix(mix(a,b,u.x), mix(c,d,u.x), u.y);
}

/* 3-octave fBm */
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 3; i++) {
    v += a * noise(p);
    p  = p * 2.1 + vec2(1.7, 9.2);
    a *= 0.5;
  }
  return v;
}

void main() {
  /* ── Cover-fit: map canvas UV → photo UV ─────────────────────── */
  float photoAR  = 1500.0 / 2000.0;   /* portrait 3:4 = 0.75 */
  float canvasAR = uResolution.x / uResolution.y;
  vec2 photoUV = vUV;
  if (canvasAR > photoAR) {
    float s = canvasAR / photoAR;
    photoUV.y = (vUV.y - 0.5) * s + 0.5;
  } else {
    float s = photoAR / canvasAR;
    photoUV.x = (vUV.x - 0.5) * s + 0.5;
  }

  /* ── Idle wave: domain-warped fBm (always animating) ─────────── */
  /* First warp pass */
  float t   = uTime * 0.28;
  vec2  q   = vec2(fbm(vUV * 3.2 + vec2(t,       t * 0.9)),
                   fbm(vUV * 3.2 + vec2(t * 1.1,  t * 0.7 + 5.2)));

  /* Second warp pass — richer, more organic */
  vec2  r   = vec2(fbm(vUV * 2.8 + 4.0 * q + vec2(1.7, 9.2) + t * 0.6),
                   fbm(vUV * 2.8 + 4.0 * q + vec2(8.3, 2.8) + t * 0.5));

  /* Final displacement from fBm (centred around 0) */
  vec2 idleDisp = (r - 0.5) * 0.032;   /* ±0.032 UV units at rest */

  /* ── Scroll: ripple image glass distortion ────────────────────── */
  vec4 ripA = texture2D(uRipA, vUV);
  vec4 ripB = texture2D(uRipB, vUV);
  vec4 rip  = mix(ripA, ripB, uBlend);

  /* Use all channels for rich directional displacement */
  vec2 ripDisp  = vec2(rip.r - rip.b, rip.g - rip.r) * 0.5;  /* directional */
  ripDisp      += (rip.rg - 0.5) * 2.0;                        /* radial push */
  ripDisp      *= 0.055 * uScroll;                              /* scaled by scroll */

  /* ── Combine: idle waves always run; glass adds on scroll ─────── */
  vec2 totalDisp = idleDisp + ripDisp;
  vec2 sampleUV  = clamp(photoUV + totalDisp, 0.001, 0.999);

  vec4 photo = texture2D(uTex, sampleUV);

  /* ── Glass highlights from ripple bright areas ────────────────── */
  float ripLum = dot(rip.rgb, vec3(0.299, 0.587, 0.114));
  float crest  = pow(max(ripLum - 0.3, 0.0) / 0.7, 1.6);
  vec3  gloss  = vec3(0.35, 0.58, 1.0) * crest * uScroll * 0.65;

  /* Idle shimmer — faint streak even at rest */
  float idleLum = fbm(vUV * 5.0 + t * 0.8);
  vec3  shimmer = vec3(0.2, 0.35, 0.7) * pow(idleLum, 4.0) * 0.18;

  /* ── Vignette ─────────────────────────────────────────────────── */
  vec2  vd  = vUV - 0.5;
  float vig = smoothstep(0.85, 0.2, length(vd));

  vec3 col = photo.rgb * vig + gloss + shimmer;

  /* Deepen into blue-black at the edges and on scroll */
  float lum  = dot(col, vec3(0.2126, 0.7152, 0.0722));
  vec3  blue = mix(vec3(0.0, 0.02, 0.12), vec3(1.0), lum);
  col = mix(col, blue, uScroll * 0.28 + (1.0 - vig) * 0.3);

  gl_FragColor = vec4(col, 1.0);
}
`

// ── WebGL helpers ──────────────────────────────────────────────────
function compileShader(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!
  gl.shaderSource(s, src)
  gl.compileShader(s)
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    console.error('Shader error:', gl.getShaderInfoLog(s))
  }
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
  const aPos = gl.getAttribLocation(prog, 'aPos')
  gl.enableVertexAttribArray(aPos)
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)
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
    img.src     = src
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
  const canvasRef  = useRef<HTMLCanvasElement>(null)
  const rootRef    = useRef<HTMLDivElement>(null)
  const hintRef    = useRef<HTMLDivElement>(null)
  const targetRef  = useRef(0)   // raw scroll accumulator
  const smoothRef  = useRef(0)   // lerped value fed to GL
  const rafRef     = useRef<number | undefined>(undefined)
  const startRef   = useRef<number | null>(null)
  const prevTsRef  = useRef<number | null>(null)
  const doneRef    = useRef(false)

  const startGL = useCallback(async () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const gl = canvas.getContext('webgl', { alpha: false })
    if (!gl) return

    const [heroImg, ...ripImgs] = await Promise.all([
      loadImage('/images/hero-landing.jpg'),
      ...RIPPLE_SRCS.map(loadImage),
    ])

    const prog = makeProgram(gl)

    uploadTexture(gl, heroImg, 0)
    gl.uniform1i(gl.getUniformLocation(prog, 'uTex'), 0)

    const ripUnits = ripImgs.map((img, i) => {
      uploadTexture(gl, img, i + 1)
      return i + 1
    })

    const uRipA    = gl.getUniformLocation(prog, 'uRipA')
    const uRipB    = gl.getUniformLocation(prog, 'uRipB')
    const uBlend   = gl.getUniformLocation(prog, 'uBlend')
    const uScroll  = gl.getUniformLocation(prog, 'uScroll')
    const uTime    = gl.getUniformLocation(prog, 'uTime')
    const uRes     = gl.getUniformLocation(prog, 'uResolution')

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
      const elapsed = (ts - startRef.current) / 1000
      const dt      = Math.min((ts - prevTsRef.current) / 1000, 0.05)
      prevTsRef.current = ts

      // Exponential-decay lerp — scroll feels fluid, not snappy
      smoothRef.current += (targetRef.current - smoothRef.current) * (1 - Math.pow(0.008, dt))
      const p = smoothRef.current

      // Map smooth p across 4 transitions between 5 ripple images
      const pos    = Math.min(p * 4, 3.9999)
      const stageA = Math.floor(pos)          // 0–3
      const stageB = stageA + 1               // 1–4
      const blend  = pos - stageA             // 0→1

      gl.uniform1i(uRipA,   ripUnits[stageA])
      gl.uniform1i(uRipB,   ripUnits[stageB])
      gl.uniform1f(uBlend,  blend)
      gl.uniform1f(uScroll, p)
      gl.uniform1f(uTime,   elapsed)
      gl.uniform2f(uRes,    canvas.width, canvas.height)
      gl.drawArrays(gl.TRIANGLES, 0, 6)

      if (hintRef.current) {
        hintRef.current.style.opacity = p > 0.05 ? '0' : '1'
      }

      if (p >= 0.98 && !doneRef.current) {
        doneRef.current = true
        const root = rootRef.current
        if (root) {
          root.style.transition = 'opacity 0.8s ease'
          root.style.opacity    = '0'
        }
        setTimeout(onComplete, 850)
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => window.removeEventListener('resize', resize)
  }, [onComplete])

  useEffect(() => {
    document.body.style.overflow = 'hidden'

    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      targetRef.current = Math.min(1, Math.max(0,
        targetRef.current + e.deltaY / (window.innerHeight * 2.8)
      ))
    }

    let lastY = 0
    const onTouchStart = (e: TouchEvent) => { lastY = e.touches[0].clientY }
    const onTouchMove  = (e: TouchEvent) => {
      e.preventDefault()
      const dy = lastY - e.touches[0].clientY
      lastY    = e.touches[0].clientY
      targetRef.current = Math.min(1, Math.max(0,
        targetRef.current + dy / (window.innerHeight * 2.8)
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
      cleanup.then(fn => fn?.())
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
