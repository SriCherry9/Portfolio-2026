import { useEffect, useMemo, useRef, useState } from 'react'
import { COLS, ROWS, THEMES, generateGrid, type Grid } from '../utils/typewriterArt'

const CELL_W = 11
const CELL_H = 16
const TOTAL_CELLS = COLS * ROWS
const CHARS_PER_KEY = Math.ceil(TOTAL_CELLS / 140)

const DEMO_PHRASES: Record<string, string> = {
  tennis: 'love all, new balls please, deuce, advantage, championship point... ',
  basketball: 'swish, and the crowd goes wild, buzzer beater, nothing but net... ',
  swimming: 'take your marks, false start, personal best, new world record... ',
  fashion: 'lights up, house lights down, next look, front row, encore... ',
  scuba: 'clear mask, equalise, descend slowly, thirty metres, air check... ',
}

// Hotspot positions as % of the Hermes Baby photo's own width/height,
// mapped by hand to where each physical key sits in the image (it's a
// QWERTZ keyboard, so Y and Z swap rows versus a QWERTY layout).
const KEY_POSITIONS: Record<string, { x: number; y: number }> = {
  '1': { x: 32.8, y: 59.8 }, '2': { x: 37.3, y: 59.8 }, '3': { x: 41.8, y: 59.8 },
  '4': { x: 46.3, y: 59.8 }, '5': { x: 50.8, y: 59.8 }, '6': { x: 55.0, y: 59.8 },
  '7': { x: 59.5, y: 59.8 }, '8': { x: 64.0, y: 59.8 }, '9': { x: 68.3, y: 59.8 },
  '0': { x: 72.8, y: 59.8 },
  Q: { x: 30.5, y: 67.6 }, W: { x: 35.0, y: 67.6 }, E: { x: 39.5, y: 67.6 },
  R: { x: 44.0, y: 67.6 }, T: { x: 48.25, y: 67.6 }, Z: { x: 52.75, y: 67.6 },
  U: { x: 57.25, y: 67.6 }, I: { x: 61.5, y: 67.6 }, O: { x: 66.0, y: 67.6 },
  P: { x: 70.5, y: 67.6 },
  A: { x: 31.75, y: 74.7 }, S: { x: 36.25, y: 74.7 }, D: { x: 40.75, y: 74.7 },
  F: { x: 45.25, y: 74.7 }, G: { x: 49.75, y: 74.7 }, H: { x: 54.0, y: 74.7 },
  J: { x: 58.5, y: 74.7 }, K: { x: 63.0, y: 74.7 }, L: { x: 67.5, y: 74.7 },
  Y: { x: 32.5, y: 82.1 }, X: { x: 37.0, y: 82.1 }, C: { x: 41.5, y: 82.1 },
  V: { x: 46.0, y: 82.1 }, B: { x: 50.5, y: 82.1 }, N: { x: 55.0, y: 82.1 },
  M: { x: 59.5, y: 82.1 },
  ' ': { x: 52.25, y: 88.1 },
}

// Rendered in QWERTZ order so clicking a hotspot always types the letter
// actually printed on the key at that spot in the photo.
const KEY_ROWS = [
  ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
  ['Q', 'W', 'E', 'R', 'T', 'Z', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Y', 'X', 'C', 'V', 'B', 'N', 'M'],
]
const ALL_KEYS = [...KEY_ROWS.flat(), ' ']

export function TypewriterArt({ onClose }: { onClose: () => void }) {
  const [themeIndex, setThemeIndex] = useState(0)
  const [typed, setTyped] = useState('')
  const [autoPlay, setAutoPlay] = useState(false)
  const [activeKey, setActiveKey] = useState<string | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const activeKeyTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const theme = THEMES[themeIndex]

  const grid: Grid = useMemo(() => generateGrid(theme), [theme])
  const revealCount = Math.min(typed.length * CHARS_PER_KEY, TOTAL_CELLS)
  const complete = revealCount >= TOTAL_CELLS

  const flashKey = (key: string) => {
    setActiveKey(key)
    clearTimeout(activeKeyTimeout.current)
    activeKeyTimeout.current = setTimeout(() => setActiveKey(null), 150)
  }

  useEffect(() => {
    setTyped('')
    setAutoPlay(false)
  }, [themeIndex])

  useEffect(() => {
    inputRef.current?.focus()
    return () => clearTimeout(activeKeyTimeout.current)
  }, [])

  useEffect(() => {
    if (!autoPlay) return
    const phrase = DEMO_PHRASES[theme.id].repeat(4)
    let i = typed.length
    if (i >= phrase.length) {
      setAutoPlay(false)
      return
    }
    const t = setInterval(() => {
      i += 1
      setTyped(phrase.slice(0, i))
      flashKey(phrase[i - 1]?.toUpperCase() ?? ' ')
      if (i >= phrase.length || i * CHARS_PER_KEY >= TOTAL_CELLS) {
        clearInterval(t)
        setAutoPlay(false)
      }
    }, 55)
    return () => clearInterval(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoPlay, theme.id])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const dpr = window.devicePixelRatio || 1
    canvas.width = COLS * CELL_W * dpr
    canvas.height = ROWS * CELL_H * dpr
    canvas.style.width = `${COLS * CELL_W}px`
    canvas.style.height = `${ROWS * CELL_H}px`
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.fillStyle = theme.paper
    ctx.fillRect(0, 0, COLS * CELL_W, ROWS * CELL_H)
    ctx.font = '13px "Courier New", monospace'
    ctx.textBaseline = 'middle'
    ctx.textAlign = 'center'

    let count = 0
    outer:
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        if (count >= revealCount) break outer
        count++
        const cell = grid[y][x]
        if (!cell) continue
        ctx.fillStyle = cell.color
        ctx.fillText(cell.ch, x * CELL_W + CELL_W / 2, y * CELL_H + CELL_H / 2)
      }
    }
  }, [grid, revealCount, theme.paper])

  // Paper feeds upward out of the roller: the strip grows from the print
  // point (bottom, pinned to the roller) as more rows get typed.
  const revealedRows = Math.min(ROWS, Math.ceil(revealCount / COLS))
  const paperHeight = Math.max(CELL_H, revealedRows * CELL_H)

  const typeChar = (ch: string) => {
    setTyped(t => t + ch)
    flashKey(ch === ' ' ? ' ' : ch.toUpperCase())
    inputRef.current?.focus()
  }

  return (
    <div className="tw-modal">
      <div className="tw-toolbar">
        <div className="tw-tabs">
          {THEMES.map((t, i) => (
            <button
              key={t.id}
              className={`tw-tab${i === themeIndex ? ' tw-tab-active' : ''}`}
              onClick={() => setThemeIndex(i)}
            >
              {t.name}
            </button>
          ))}
        </div>
        <button className="tw-close" onClick={onClose} aria-label="Close">✕</button>
      </div>

      <div className="tw-object" onClick={() => inputRef.current?.focus()}>
        <div className="tw-paper-clip" style={{ background: theme.paper }}>
          <div className="tw-paper-scroll" style={{ height: paperHeight }}>
            <canvas ref={canvasRef} className="tw-canvas" />
          </div>
          {complete && (
            <div className="tw-complete-badge">{theme.name} — complete</div>
          )}
        </div>

        <div className="tw-typewriter-body">
          <img src="/images/Typewriter.webp" alt="Hermes Baby typewriter" className="tw-photo" draggable={false} />
          {ALL_KEYS.map(k => {
            const pos = KEY_POSITIONS[k]
            const isSpace = k === ' '
            return (
              <button
                key={k}
                className={`tw-hotspot${isSpace ? ' tw-hotspot-space' : ''}${activeKey === k ? ' tw-hotspot-active' : ''}`}
                style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                onClick={() => typeChar(isSpace ? ' ' : k.toLowerCase())}
                tabIndex={-1}
                aria-label={isSpace ? 'Space' : k}
              />
            )
          })}
        </div>
      </div>

      <div className="tw-statusbar">
        <input
          ref={inputRef}
          className="tw-hidden-input"
          value={typed}
          onChange={e => setTyped(e.target.value)}
          onKeyDown={e => {
            if (e.key.length === 1) flashKey(e.key.toUpperCase())
          }}
          spellCheck={false}
          autoComplete="off"
          aria-label="Type to reveal the artwork"
        />
        <span className="tw-statusbar-hint">
          {typed.length === 0 ? 'Click here and start typing to reveal the artwork...' : typed.slice(-60)}
        </span>
        <span className="tw-statusbar-progress">{Math.round((revealCount / TOTAL_CELLS) * 100)}%</span>
        <button className="tw-statusbar-btn" onClick={() => setAutoPlay(a => !a)}>
          {autoPlay ? 'Stop' : 'Auto-type'}
        </button>
        <button className="tw-statusbar-btn" onClick={() => setTyped('')}>Clear</button>
      </div>
    </div>
  )
}
