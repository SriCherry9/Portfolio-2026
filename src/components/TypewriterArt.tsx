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

export function TypewriterArt({ onClose }: { onClose: () => void }) {
  const [themeIndex, setThemeIndex] = useState(0)
  const [typed, setTyped] = useState('')
  const [autoPlay, setAutoPlay] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const theme = THEMES[themeIndex]

  const grid: Grid = useMemo(() => generateGrid(theme), [theme])
  const revealCount = Math.min(typed.length * CHARS_PER_KEY, TOTAL_CELLS)
  const complete = revealCount >= TOTAL_CELLS

  useEffect(() => {
    setTyped('')
    setAutoPlay(false)
  }, [themeIndex])

  useEffect(() => {
    inputRef.current?.focus()
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
      if (i >= phrase.length || i * CHARS_PER_KEY >= TOTAL_CELLS) {
        clearInterval(t)
        setAutoPlay(false)
      }
    }, 18)
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

      <div className="tw-canvas-wrap" style={{ background: theme.paper }}>
        <canvas ref={canvasRef} className="tw-canvas" />
        {complete && (
          <div className="tw-complete-badge">{theme.name} — complete</div>
        )}
      </div>

      <div className="tw-typebar">
        <span className="tw-typebar-progress">{Math.round((revealCount / TOTAL_CELLS) * 100)}%</span>
        <input
          ref={inputRef}
          className="tw-typebar-input"
          value={typed}
          onChange={e => setTyped(e.target.value)}
          placeholder="Start typing on the typewriter to reveal the artwork..."
          spellCheck={false}
          autoComplete="off"
        />
        <button className="tw-typebar-btn" onClick={() => setAutoPlay(a => !a)}>
          {autoPlay ? 'Stop' : 'Auto-type'}
        </button>
        <button className="tw-typebar-btn" onClick={() => setTyped('')}>Clear</button>
      </div>
    </div>
  )
}
