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

  const handleDownload = () => {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'letter.txt'
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
