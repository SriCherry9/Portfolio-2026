import { useState, useCallback } from 'react'

interface PlantInstance {
  id: number
  x: number
  y: number
  type: number
  isNew: boolean
}

const PLANT_TYPES = [
  { art: ['(*)', '> /'],       color: '#b8d96e' },  // daisy
  { art: ['ʌʌ', ' | '],       color: '#a8cc60' },  // sprout
  { art: [' v', ' Y', 'ʌʌʌ'], color: '#b8dc68' },  // medium plant
  { art: ['üüü', '(·)', 'WW'], color: '#e89070' },  // berry (salmon)
  { art: ["' '", '-Y-', 'ww'], color: '#c8d858' },  // bushy
  { art: ['\\|', 'ʌʌ'],       color: '#90cc48' },  // tall thin
  { art: ['\\c,-'],            color: '#a8e048' },  // vine
  { art: [' · ', '\\ /'],     color: '#b0d860' },  // micro sprout
  { art: ['(o)', '\\|/'],     color: '#e89060' },  // orange flower
  { art: ['(*)', ' / '],      color: '#e890b0' },  // pink daisy
]

const INITIAL_PLANTS: PlantInstance[] = [
  { id: 1,  x: 5.5,  y: 28,  type: 3, isNew: false },
  { id: 2,  x: 9,    y: 50,  type: 0, isNew: false },
  { id: 3,  x: 13,   y: 68,  type: 4, isNew: false },
  { id: 4,  x: 20,   y: 38,  type: 3, isNew: false },
  { id: 5,  x: 26,   y: 22,  type: 1, isNew: false },
  { id: 6,  x: 30,   y: 55,  type: 4, isNew: false },
  { id: 7,  x: 35,   y: 34,  type: 2, isNew: false },
  { id: 8,  x: 40,   y: 16,  type: 0, isNew: false },
  { id: 9,  x: 43,   y: 48,  type: 6, isNew: false },
  { id: 10, x: 48,   y: 30,  type: 3, isNew: false },
  { id: 11, x: 52,   y: 62,  type: 7, isNew: false },
  { id: 12, x: 57,   y: 20,  type: 1, isNew: false },
  { id: 13, x: 61,   y: 42,  type: 3, isNew: false },
  { id: 14, x: 64,   y: 70,  type: 2, isNew: false },
  { id: 15, x: 68,   y: 28,  type: 0, isNew: false },
  { id: 16, x: 72,   y: 52,  type: 4, isNew: false },
  { id: 17, x: 76,   y: 18,  type: 5, isNew: false },
  { id: 18, x: 80,   y: 40,  type: 2, isNew: false },
  { id: 19, x: 84,   y: 64,  type: 6, isNew: false },
  { id: 20, x: 87,   y: 28,  type: 3, isNew: false },
  { id: 21, x: 91,   y: 46,  type: 4, isNew: false },
  { id: 22, x: 95,   y: 22,  type: 0, isNew: false },
  { id: 23, x: 3,    y: 70,  type: 9, isNew: false },
  { id: 24, x: 16,   y: 80,  type: 8, isNew: false },
  { id: 25, x: 38,   y: 78,  type: 9, isNew: false },
  { id: 26, x: 58,   y: 82,  type: 8, isNew: false },
  { id: 27, x: 77,   y: 76,  type: 9, isNew: false },
  { id: 28, x: 97,   y: 60,  type: 1, isNew: false },
  { id: 29, x: 2,    y: 44,  type: 0, isNew: false },
  { id: 30, x: 47,   y: 72,  type: 5, isNew: false },
]

export function GardenFooter() {
  const [plants, setPlants] = useState<PlantInstance[]>(INITIAL_PLANTS)
  const [nextId, setNextId] = useState(200)
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 })
  const [inGarden, setInGarden] = useState(false)

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setCursorPos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }, [])

  const handlePlant = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setPlants(prev => [
      ...prev,
      {
        id: nextId,
        x,
        y,
        type: Math.floor(Math.random() * PLANT_TYPES.length),
        isNew: true,
      },
    ])
    setNextId(n => n + 1)
  }, [nextId])

  return (
    <footer className="garden-footer">
      {/* Info bar */}
      <div className="garden-info">
        <div className="garden-quote-block">
          <p className="garden-quote-text">To plant a garden, is to<br />believe in the future.</p>
          <p className="garden-made-with">MADE WITH &lt;3 AND LOTS OF COFFEE</p>
        </div>
        <div className="garden-links-wrap">
          <div className="garden-links-col">
            <p className="garden-links-label">SAY HI</p>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="garden-link">LINKEDIN</a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="garden-link">TWITTER</a>
            <a href="/resume" className="garden-link">RESUME</a>
          </div>
          <div className="garden-links-col">
            <p className="garden-links-label">PAGE</p>
            <a href="/" className="garden-link">HOME</a>
            <a href="#playground" className="garden-link">PLAYGROUND</a>
            <a href="#about" className="garden-link">ABOUT</a>
          </div>
        </div>
      </div>

      {/* Interactive garden */}
      <div
        className="garden-area"
        onClick={handlePlant}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setInGarden(true)}
        onMouseLeave={() => { setInGarden(false); setCursorPos({ x: -100, y: -100 }) }}
      >
        {/* Custom cursor */}
        <div
          className="garden-cursor"
          style={{ left: cursorPos.x, top: cursorPos.y, opacity: inGarden ? 1 : 0 }}
          aria-hidden="true"
        >
          🌱
        </div>

        {/* Plants */}
        {plants.map(p => (
          <div
            key={p.id}
            className={`garden-plant${p.isNew ? ' garden-plant-new' : ''}`}
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
          >
            {PLANT_TYPES[p.type].art.map((line, i) => (
              <span key={i} style={{ color: PLANT_TYPES[p.type].color }}>{line}</span>
            ))}
          </div>
        ))}
      </div>
    </footer>
  )
}
