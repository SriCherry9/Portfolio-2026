import { useEffect, useRef, useCallback } from 'react'
import './RippleLanding.css'

const VERT = `
attribute vec2 aPos;
varying   vec2 vUV;
void main() {
  vUV         = aPos * 0.5 + 0.5;
  vUV.y       = 1.0 - vUV.y;
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`

// Idle  : the video already animates — no extra wave math needed
// Scroll: ripple images drive glass-pane distortion on top of the video
const FRAG = `
precision highp float;

uniform sampler2D uTex;    /* video frame    — unit 0 */
uniform sampler2D uRipA;   /* ripple stage A — unit 1-5 */
uniform sampler2D uRipB;   /* ripple stage B — unit 1-5 */
uniform float     uBlend;
uniform float     uScroll; /* 0→1 lerped scroll */
uniform vec2      uResolution;

varying vec2 vUV;

void main() {
  /* ── Cover-fit video onto canvas ─────────────────────────────── */
  /* Video aspect ratio is determined at runtime via uVideoAR */
  /* We use a fixed 9:16 portrait guess; cover logic handles the rest */
  vec2 photoUV = vUV;
  /* no crop needed — let object-fit cover handle it via UV */

  /* ── Ripple displacement maps ─────────────────────────────────── */
  vec4 ripA = texture2D(uRipA, vUV);
  vec4 ripB = texture2D(uRipB, vUV);
  vec4 rip  = mix(ripA, ripB, uBlend);

  float ripLum = dot(rip.rgb, vec3(0.299, 0.587, 0.114));

  /* Glass displacement — zero at rest, strong at full scroll */
  vec2 glassDisp  = vec2(rip.r - rip.b, rip.g - rip.r) * 0.4;
  glassDisp      += (rip.rg - 0.5) * 2.0;
  glassDisp      *= 0.06 * uScroll;

  vec2 sampleUV = clamp(photoUV + glassDisp, 0.001, 0.999);

  vec4 video = texture2D(uTex, sampleUV);

  /* ── Glass highlights on crests ───────────────────────────────── */
  float crest = pow(max(ripLum - 0.25, 0.0) / 0.75, 1.8);
  vec3  gloss = vec3(0.38, 0.60, 1.0) * crest * uScroll * 0.70;

  /* ── Vignette darkens edges ───────────────────────────────────── */
  float vig = smoothstep(0.9, 0.15, length(vUV - 0.5));

  vec3 col = video.rgb * vig + gloss;

  /* Deepen edges + scroll into blue-black */
  float lum = dot(col, vec3(0.2126, 0.7152, 0.0722));
  col = mix(col, mix(vec3(0.0, 0.02, 0.14), col, lum),
            uScroll * 0.22 + (1.0 - vig) * 0.25);

  gl_FragColor = vec4(col, 1.0);
}
`

function compileShader(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!
  gl.shaderSource(s, src)
  gl.compileShader(s)
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS))
    console.error('Shader error:', gl.getShaderInfoLog(s))
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

function makeVideoTexture(gl: WebGLRenderingContext, unit: number) {
  gl.activeTexture(gl.TEXTURE0 + unit)
  const tex = gl.createTexture()!
  gl.bindTexture(gl.TEXTURE_2D, tex)
  // placeholder 1×1 pixel while video loads
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
    new Uint8Array([0, 0, 0, 255]))
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
  return tex
}

function uploadImageTexture(gl: WebGLRenderingContext, img: HTMLImageElement, unit: number) {
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

const RIPPLE_SRCS = [
  '/images/ripple-1.png',
  '/images/ripple-2.png',
  '/images/ripple-3.png',
  '/images/ripple-4.png',
  '/images/ripple-5.png',
]

interface Props { onComplete: () => void }

export function RippleLanding({ onComplete }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rootRef   = useRef<HTMLDivElement>(null)
  const hintRef   = useRef<HTMLDivElement>(null)
  const targetRef = useRef(0)
  const smoothRef = useRef(0)
  const rafRef    = useRef<number | undefined>(undefined)
  const prevTsRef = useRef<number | null>(null)
  const doneRef   = useRef(false)

  const startGL = useCallback(async () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const gl = canvas.getContext('webgl', { alpha: false })
    if (!gl) return

    // ── Set up video element ────────────────────────────────────────
    const video = document.createElement('video')
    video.src      = '/images/hero-landing.mp4'
    video.loop     = true
    video.muted    = true
    video.playsInline = true
    video.autoplay = true

    // WebGL texture that we'll update every frame from the video
    const videoTex = makeVideoTexture(gl, 0)

    // Load ripple images
    const ripImgs = await Promise.all(RIPPLE_SRCS.map(loadImage))

    const prog = makeProgram(gl)

    gl.uniform1i(gl.getUniformLocation(prog, 'uTex'), 0)

    const ripUnits = ripImgs.map((img, i) => {
      uploadImageTexture(gl, img, i + 1)
      return i + 1
    })

    const uRipA   = gl.getUniformLocation(prog, 'uRipA')
    const uRipB   = gl.getUniformLocation(prog, 'uRipB')
    const uBlend  = gl.getUniformLocation(prog, 'uBlend')
    const uScroll = gl.getUniformLocation(prog, 'uScroll')
    const uRes    = gl.getUniformLocation(prog, 'uResolution')

    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
      gl.viewport(0, 0, canvas.width, canvas.height)
    }
    resize()
    window.addEventListener('resize', resize)

    // Start video playback
    video.play().catch(() => {
      // autoplay blocked — click to play
      const resume = () => { video.play(); document.removeEventListener('click', resume) }
      document.addEventListener('click', resume)
    })

    let videoReady = false

    const tick = (ts: number) => {
      if (prevTsRef.current === null) prevTsRef.current = ts
      const dt = Math.min((ts - prevTsRef.current) / 1000, 0.05)
      prevTsRef.current = ts

      // Smooth lerp scroll
      smoothRef.current += (targetRef.current - smoothRef.current) * (1 - Math.pow(0.008, dt))
      const p = smoothRef.current

      // Upload latest video frame to GPU every tick
      if (video.readyState >= video.HAVE_CURRENT_DATA) {
        if (!videoReady) videoReady = true
        gl.activeTexture(gl.TEXTURE0)
        gl.bindTexture(gl.TEXTURE_2D, videoTex)
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video)
      }

      // Map p across 4 transitions between 5 ripple images
      const pos    = Math.min(p * 4, 3.9999)
      const stageA = Math.floor(pos)
      const stageB = stageA + 1
      const blend  = pos - stageA

      gl.uniform1i(uRipA,   ripUnits[stageA])
      gl.uniform1i(uRipB,   ripUnits[stageB])
      gl.uniform1f(uBlend,  blend)
      gl.uniform1f(uScroll, p)
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

    return () => {
      window.removeEventListener('resize', resize)
      video.pause()
      video.src = ''
    }
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
