import { useEffect, useRef, useState } from 'react'

interface KeyRect {
  cx: number
  cy: number
  w: number
  h: number
}

// Positions are percentages of the typewriter image's own box (2000×1413),
// measured against the key caps visible in /images/Typewriter.webp.
const KEY_RECTS: Record<string, KeyRect> = {
  '1': { cx: 32.75, cy: 60.5, w: 4.6, h: 7.8 },
  '2': { cx: 37.0, cy: 60.5, w: 4.6, h: 7.8 },
  '3': { cx: 41.4, cy: 60.5, w: 4.6, h: 7.8 },
  '4': { cx: 45.75, cy: 60.5, w: 4.6, h: 7.8 },
  '5': { cx: 50.5, cy: 60.5, w: 4.6, h: 7.8 },
  '6': { cx: 54.85, cy: 60.5, w: 4.6, h: 7.8 },
  '7': { cx: 59.15, cy: 60.5, w: 4.6, h: 7.8 },
  '8': { cx: 63.5, cy: 60.5, w: 4.6, h: 7.8 },
  '9': { cx: 67.9, cy: 60.5, w: 4.6, h: 7.8 },
  '0': { cx: 72.25, cy: 60.5, w: 4.6, h: 7.8 },
  backspace: { cx: 79.15, cy: 60.5, w: 5.8, h: 7.8 },

  q: { cx: 30.25, cy: 67.6, w: 4.6, h: 7.8 },
  w: { cx: 34.75, cy: 67.6, w: 4.6, h: 7.8 },
  e: { cx: 38.75, cy: 67.6, w: 4.6, h: 7.8 },
  r: { cx: 43.0, cy: 67.6, w: 4.6, h: 7.8 },
  t: { cx: 47.5, cy: 67.6, w: 4.6, h: 7.8 },
  z: { cx: 52.15, cy: 67.6, w: 4.6, h: 7.8 },
  u: { cx: 56.65, cy: 67.6, w: 4.6, h: 7.8 },
  i: { cx: 61.15, cy: 67.6, w: 4.6, h: 7.8 },
  o: { cx: 65.65, cy: 67.6, w: 4.6, h: 7.8 },
  p: { cx: 70.15, cy: 67.6, w: 4.6, h: 7.8 },

  a: { cx: 31.5, cy: 74.7, w: 4.6, h: 7.8 },
  s: { cx: 35.75, cy: 74.7, w: 4.6, h: 7.8 },
  d: { cx: 40.25, cy: 74.7, w: 4.6, h: 7.8 },
  f: { cx: 44.75, cy: 74.7, w: 4.6, h: 7.8 },
  g: { cx: 49.25, cy: 74.7, w: 4.6, h: 7.8 },
  h: { cx: 53.75, cy: 74.7, w: 4.6, h: 7.8 },
  j: { cx: 58.25, cy: 74.7, w: 4.6, h: 7.8 },
  k: { cx: 62.75, cy: 74.7, w: 4.6, h: 7.8 },
  l: { cx: 67.25, cy: 74.7, w: 4.6, h: 7.8 },

  shift: { cx: 27.25, cy: 82.3, w: 5.8, h: 8.4 },
  y: { cx: 33.75, cy: 82.3, w: 4.6, h: 7.8 },
  x: { cx: 38.15, cy: 82.3, w: 4.6, h: 7.8 },
  c: { cx: 42.5, cy: 82.3, w: 4.6, h: 7.8 },
  v: { cx: 47.0, cy: 82.3, w: 4.6, h: 7.8 },
  b: { cx: 51.5, cy: 82.3, w: 4.6, h: 7.8 },
  n: { cx: 56.0, cy: 82.3, w: 4.6, h: 7.8 },
  m: { cx: 61.0, cy: 82.3, w: 4.6, h: 7.8 },

  space: { cx: 52, cy: 87.4, w: 46, h: 5.6 },
}

function keycapStyle(rect: KeyRect): React.CSSProperties {
  const xl = (rect.cx - rect.w / 2) / 100
  const yl = (rect.cy - rect.h / 2) / 100
  const w = rect.w / 100
  const h = rect.h / 100
  const bgSizeX = (1 / w) * 100
  const bgSizeY = (1 / h) * 100
  const bgPosX = (xl / (1 - w)) * 100
  const bgPosY = (yl / (1 - h)) * 100
  return {
    position: 'absolute',
    left: `${rect.cx - rect.w / 2}%`,
    top: `${rect.cy - rect.h / 2}%`,
    width: `${rect.w}%`,
    height: `${rect.h}%`,
    backgroundImage: 'url(/images/Typewriter.webp)',
    backgroundRepeat: 'no-repeat',
    backgroundSize: `${bgSizeX}% ${bgSizeY}%`,
    backgroundPosition: `${bgPosX}% ${bgPosY}%`,
  }
}

function resolveKeyId(key: string): string | null {
  if (key === ' ') return 'space'
  if (key === 'Backspace') return 'backspace'
  if (key === 'Shift') return 'shift'
  if (key.length === 1 && /[a-zA-Z0-9]/.test(key)) return key.toLowerCase()
  return null
}

const PAPER_WIDTH = 1700
const PAPER_MARGIN_X = 150
const PAPER_MARGIN_TOP = 190
const PAPER_MARGIN_BOTTOM = 150
const PAPER_FONT_SIZE = 32
const PAPER_LINE_HEIGHT = Math.round(PAPER_FONT_SIZE * 1.75)
const PAPER_FONT = `${PAPER_FONT_SIZE}px "Courier New", Courier, monospace`

function wrapLetterText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const lines: string[] = []
  for (const paragraph of text.split('\n')) {
    if (paragraph === '') {
      lines.push('')
      continue
    }
    let current = ''
    for (const word of paragraph.split(' ')) {
      const candidate = current ? `${current} ${word}` : word
      if (current && ctx.measureText(candidate).width > maxWidth) {
        lines.push(current)
        current = word
      } else {
        current = candidate
      }
    }
    lines.push(current)
  }
  return lines
}

function renderLetterToPaper(text: string): Promise<Blob | null> {
  const measureCtx = document.createElement('canvas').getContext('2d')!
  measureCtx.font = PAPER_FONT
  const lines = wrapLetterText(measureCtx, text, PAPER_WIDTH - PAPER_MARGIN_X * 2)

  const contentHeight = lines.length * PAPER_LINE_HEIGHT
  const height = Math.max(2200, PAPER_MARGIN_TOP + PAPER_MARGIN_BOTTOM + contentHeight)

  const canvas = document.createElement('canvas')
  canvas.width = PAPER_WIDTH
  canvas.height = height
  const ctx = canvas.getContext('2d')!

  ctx.fillStyle = '#fbf6ec'
  ctx.fillRect(0, 0, PAPER_WIDTH, height)

  const vignette = ctx.createRadialGradient(
    PAPER_WIDTH / 2, height / 2, height * 0.35,
    PAPER_WIDTH / 2, height / 2, height * 0.78
  )
  vignette.addColorStop(0, 'rgba(0, 0, 0, 0)')
  vignette.addColorStop(1, 'rgba(110, 90, 60, 0.1)')
  ctx.fillStyle = vignette
  ctx.fillRect(0, 0, PAPER_WIDTH, height)

  ctx.strokeStyle = 'rgba(60, 50, 40, 0.12)'
  ctx.lineWidth = 1
  lines.forEach((_, i) => {
    const ruleY = PAPER_MARGIN_TOP + i * PAPER_LINE_HEIGHT + PAPER_FONT_SIZE * 0.3
    ctx.beginPath()
    ctx.moveTo(PAPER_MARGIN_X, ruleY)
    ctx.lineTo(PAPER_WIDTH - PAPER_MARGIN_X, ruleY)
    ctx.stroke()
  })

  ctx.fillStyle = '#2c2a25'
  ctx.font = PAPER_FONT
  ctx.textBaseline = 'alphabetic'
  lines.forEach((line, i) => {
    ctx.fillText(line, PAPER_MARGIN_X, PAPER_MARGIN_TOP + i * PAPER_LINE_HEIGHT)
  })

  return new Promise(resolve => canvas.toBlob(resolve, 'image/png'))
}

interface TypewriterModalProps {
  onClose: () => void
}

export function TypewriterModal({ onClose }: TypewriterModalProps) {
  const [text, setText] = useState('')
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set())
  const [carriageKick, setCarriageKick] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const kickTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  useEffect(() => () => clearTimeout(kickTimeout.current), [])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const id = resolveKeyId(e.key)
    if (id) {
      setPressedKeys(prev => {
        const next = new Set(prev)
        next.add(id)
        return next
      })
    }
    if (e.key === 'Enter') {
      setCarriageKick(true)
      clearTimeout(kickTimeout.current)
      kickTimeout.current = setTimeout(() => setCarriageKick(false), 260)
    }
  }

  const handleKeyUp = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const id = resolveKeyId(e.key)
    if (!id) return
    setPressedKeys(prev => {
      const next = new Set(prev)
      next.delete(id)
      return next
    })
  }

  const handleDownload = async () => {
    const blob = await renderLetterToPaper(text)
    if (!blob) return
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'letter.png'
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  const handleClear = () => {
    if (text.trim() && !window.confirm('Clear this letter and start a fresh page?')) return
    setText('')
    textareaRef.current?.focus()
  }

  const lastLine = text.split('\n').pop() ?? ''

  return (
    <div className="tw-modal-backdrop" onClick={onClose}>
      <div className="tw-modal-content" onClick={e => e.stopPropagation()}>
        <button className="tw-modal-close" onClick={onClose} aria-label="Close">✕</button>

        <textarea
          ref={textareaRef}
          className="tw-page"
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
          placeholder="Dear reader,"
          spellCheck={false}
          autoFocus
        />

        <div className="tw-machine-wrap" onClick={() => textareaRef.current?.focus()}>
          <div className={`tw-machine${carriageKick ? ' tw-carriage-kick' : ''}`}>
            <img
              src="/images/Typewriter.webp"
              alt="Hermes Baby typewriter"
              className="tw-machine-img"
              draggable={false}
            />
            <div className="tw-roller-line">{lastLine}<span className="tw-caret" /></div>
            {Object.entries(KEY_RECTS).map(([id, rect]) => (
              <div
                key={id}
                className={`tw-key${pressedKeys.has(id) ? ' tw-key-pressed' : ''}`}
                style={keycapStyle(rect)}
              />
            ))}
          </div>
        </div>

        <div className="tw-toolbar">
          <span className="tw-hint">Type your letter — every key strikes home</span>
          <div className="tw-toolbar-actions">
            <button className="tw-clear-btn" onClick={handleClear}>clear page</button>
            <button className="tw-download-btn" onClick={handleDownload} disabled={!text.trim()}>
              Download letter ↓
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
