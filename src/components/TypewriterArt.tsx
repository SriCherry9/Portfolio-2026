import { useEffect, useMemo, useRef, useState } from 'react'
import { COLS, ROWS, THEMES, generateGrid, type Grid } from '../utils/typewriterArt'

const CELL_W = 11
const CELL_H = 16
const TOTAL_CELLS = COLS * ROWS
const CHARS_PER_KEY = Math.ceil(TOTAL_CELLS / 140)
const WINDOW_H = 300
const FULL_H = ROWS * CELL_H

const DEMO_PHRASES: Record<string, string> = {
  tennis: 'love all, new balls please, deuce, advantage, championship point... ',
  basketball: 'swish, and the crowd goes wild, buzzer beater, nothing but net... ',
  swimming: 'take your marks, false start, personal best, new world record... ',
  fashion: 'lights up, house lights down, next look, front row, encore... ',
  scuba: 'clear mask, equalise, descend slowly, thirty metres, air check... ',
}

const KEY_ROWS = [
  ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
]

const RULER_MARKS = Array.from({ length: 9 }, (_, i) => i * 10)

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
    activeKeyTimeout.current = setTimeout(() => setActiveKey(null), 130)
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

  const revealedRows = Math.min(ROWS, Math.ceil(revealCount / COLS))
  const revealedBottomPx = revealedRows * CELL_H
  const scrollY = -Math.max(0, Math.min(FULL_H - WINDOW_H, revealedBottomPx - WINDOW_H))

  const typeChar = (ch: string) => {
    setTyped(t => t + ch)
    flashKey(ch === ' ' ? ' ' : ch.toUpperCase())
    inputRef.current?.focus()
  }

  return (
    <div className="tw-modal">
      <div className="tw-modal-header">
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

      <div className="tw-machine" onClick={() => inputRef.current?.focus()}>
        <div className="tw-machine-inner">
          <div className="tw-bail tw-bail-left" />
          <div className="tw-bail tw-bail-right" />
          <div className="tw-ruler">
            {RULER_MARKS.map(m => <span key={m}>{m}</span>)}
          </div>
          <div className="tw-paper-window" style={{ background: theme.paper }}>
            <div className="tw-paper-scroll" style={{ transform: `translateY(${scrollY}px)` }}>
              <canvas ref={canvasRef} className="tw-canvas" />
            </div>
            {complete && (
              <div className="tw-complete-badge">{theme.name} — complete</div>
            )}
          </div>
          <div className="tw-roller" />
          <div className="tw-plaque">
            <span className="tw-plaque-dot" />
            TYPEWRITER STUDIO
            <span className="tw-plaque-progress">{Math.round((revealCount / TOTAL_CELLS) * 100)}% TYPED</span>
          </div>
        </div>

        <div className="tw-keyboard">
          {KEY_ROWS.map((row, i) => (
            <div className="tw-key-row" key={i}>
              {row.map(k => (
                <button
                  key={k}
                  className={`tw-key${activeKey === k ? ' tw-key-active' : ''}`}
                  onClick={() => typeChar(k.toLowerCase())}
                  tabIndex={-1}
                >
                  {k}
                </button>
              ))}
            </div>
          ))}
          <div className="tw-key-row">
            <button
              className={`tw-key tw-key-space${activeKey === ' ' ? ' tw-key-active' : ''}`}
              onClick={() => typeChar(' ')}
              tabIndex={-1}
              aria-label="Space"
            />
          </div>
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
        <button className="tw-statusbar-btn" onClick={() => setAutoPlay(a => !a)}>
          {autoPlay ? 'Stop' : 'Auto-type'}
        </button>
        <button className="tw-statusbar-btn" onClick={() => setTyped('')}>Clear</button>
      </div>
    </div>
  )
}
