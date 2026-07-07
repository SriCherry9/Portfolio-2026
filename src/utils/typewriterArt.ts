// Procedural "typewriter art" grids — each theme is a scene built entirely from
// monospace characters, in the spirit of typewriter-illustration pieces where
// dense typed symbols form shading, lines and silhouettes.

export interface ArtCell {
  ch: string
  color: string
}

export type Grid = (ArtCell | null)[][]

export const COLS = 76
export const ROWS = 38

export interface ThemeDef {
  id: string
  name: string
  paper: string
  build: (rand: () => number) => Grid
}

function makeGrid(): Grid {
  return Array.from({ length: ROWS }, () => Array<ArtCell | null>(COLS).fill(null))
}

function set(grid: Grid, x: number, y: number, ch: string, color: string) {
  const xi = Math.round(x)
  const yi = Math.round(y)
  if (yi < 0 || yi >= grid.length || xi < 0 || xi >= grid[0].length) return
  grid[yi][xi] = { ch, color }
}

function hLine(grid: Grid, x0: number, x1: number, y: number, ch: string, color: string) {
  const a = Math.min(x0, x1), b = Math.max(x0, x1)
  for (let x = a; x <= b; x++) set(grid, x, y, ch, color)
}

function vLine(grid: Grid, y0: number, y1: number, x: number, ch: string, color: string) {
  const a = Math.min(y0, y1), b = Math.max(y0, y1)
  for (let y = a; y <= b; y++) set(grid, x, y, ch, color)
}

function rectOutline(grid: Grid, x0: number, y0: number, x1: number, y1: number, ch: string, color: string) {
  hLine(grid, x0, x1, y0, ch, color)
  hLine(grid, x0, x1, y1, ch, color)
  vLine(grid, y0, y1, x0, ch, color)
  vLine(grid, y0, y1, x1, ch, color)
}

function rectFill(
  grid: Grid, x0: number, y0: number, x1: number, y1: number,
  chars: string, color: string, density: number, rand: () => number,
) {
  const ax = Math.min(x0, x1), bx = Math.max(x0, x1)
  const ay = Math.min(y0, y1), by = Math.max(y0, y1)
  for (let y = ay; y <= by; y++) {
    for (let x = ax; x <= bx; x++) {
      if (rand() < density) {
        set(grid, x, y, chars[Math.floor(rand() * chars.length)], color)
      }
    }
  }
}

function text(grid: Grid, x: number, y: number, str: string, color: string) {
  for (let i = 0; i < str.length; i++) {
    if (str[i] !== ' ') set(grid, x + i, y, str[i], color)
  }
}

function circleOutline(
  grid: Grid, cx: number, cy: number, rx: number, ry: number,
  ch: string, color: string, steps = 160,
) {
  for (let i = 0; i < steps; i++) {
    const a = (i / steps) * Math.PI * 2
    set(grid, cx + Math.cos(a) * rx, cy + Math.sin(a) * ry, ch, color)
  }
}

function arc(
  grid: Grid, cx: number, cy: number, rx: number, ry: number,
  a0: number, a1: number, ch: string, color: string, steps = 60,
) {
  for (let i = 0; i <= steps; i++) {
    const a = a0 + (a1 - a0) * (i / steps)
    set(grid, cx + Math.cos(a) * rx, cy + Math.sin(a) * ry, ch, color)
  }
}

function titleBox(grid: Grid, right: number, y0: number, label: string, color: string) {
  const x0 = right - (label.length + 3)
  rectOutline(grid, x0, y0, right, y0 + 2, '=', color)
  text(grid, x0 + 2, y0 + 1, label, color)
}

function crowd(
  grid: Grid, x0: number, x1: number, y0: number, y1: number,
  color: string, rand: () => number,
) {
  const chars = 'noo%wm'
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      if (rand() < 0.85) set(grid, x, y, chars[Math.floor(rand() * chars.length)], color)
    }
  }
}

function background(grid: Grid, color: string, rand: () => number) {
  rectFill(grid, 0, 0, COLS - 1, ROWS - 1, '%+=.@', color, 0.045, rand)
}

// ───────────────────────── Tennis ─────────────────────────
function buildTennis(rand: () => number): Grid {
  const grid = makeGrid()
  background(grid, 'rgba(60,50,40,0.16)', rand)
  crowd(grid, 2, 73, 1, 5, 'rgba(60,50,40,0.35)', rand)

  rectFill(grid, 9, 9, 66, 33, 'v', '#6f9c5c', 1, rand)
  rectOutline(grid, 14, 12, 61, 31, '=', '#f6f2ea')
  vLine(grid, 12, 31, 37, '|', '#f6f2ea')
  hLine(grid, 14, 61, 21, 'E', '#333333')
  set(grid, 14, 20, '|', '#333333')
  set(grid, 61, 20, '|', '#333333')
  hLine(grid, 14, 61, 15, '-', 'rgba(246,242,234,0.6)')
  hLine(grid, 14, 61, 28, '-', 'rgba(246,242,234,0.6)')

  // scoreboard
  rectOutline(grid, 2, 1, 26, 6, '=', '#1c1c1c')
  text(grid, 4, 2, 'S FEDERER   3  7', '#1c1c1c')
  text(grid, 4, 4, 'N DJOKOVIC  2  5', '#1c1c1c')

  // umpire chair
  vLine(grid, 8, 11, 66, '/', '#3a3a3a')
  vLine(grid, 8, 11, 69, '\\', '#3a3a3a')
  set(grid, 67, 8, '=', '#3a3a3a')
  set(grid, 68, 8, '=', '#3a3a3a')

  // player figure
  set(grid, 30, 24, 'O', '#1c1c1c')
  vLine(grid, 25, 27, 30, '|', '#1c1c1c')
  set(grid, 29, 26, '/', '#1c1c1c')
  set(grid, 32, 25, '\\', '#1c1c1c')
  set(grid, 29, 28, '/', '#1c1c1c')
  set(grid, 31, 28, '\\', '#1c1c1c')
  set(grid, 33, 24, 'o', '#c4d92e')

  titleBox(grid, 73, 1, 'CHAMPIONSHIPS', '#6f9c5c')
  return grid
}

// ───────────────────────── Basketball ─────────────────────────
function buildBasketball(rand: () => number): Grid {
  const grid = makeGrid()
  background(grid, 'rgba(60,40,20,0.16)', rand)
  crowd(grid, 2, 73, 1, 5, 'rgba(60,40,20,0.35)', rand)

  rectFill(grid, 9, 9, 66, 34, 'n', '#c98a4b', 1, rand)
  rectOutline(grid, 9, 9, 66, 34, '=', '#f6f2ea')
  circleOutline(grid, 37, 34, 7, 4, '=', '#f6f2ea')
  arc(grid, 37, 9, 16, 9, 0.15, Math.PI - 0.15, '=', '#f6f2ea')

  rectOutline(grid, 33, 7, 41, 10, '#', '#f6f2ea')
  circleOutline(grid, 37, 11, 3, 1.2, 'o', '#e2571a')
  vLine(grid, 11, 15, 35, 'V', '#f6f2ea')
  vLine(grid, 11, 15, 37, 'V', '#f6f2ea')
  vLine(grid, 11, 15, 39, 'V', '#f6f2ea')

  // jumping player + ball
  set(grid, 37, 18, 'O', '#1c1c1c')
  vLine(grid, 19, 21, 37, '|', '#1c1c1c')
  set(grid, 35, 19, '\\', '#1c1c1c')
  set(grid, 39, 18, '/', '#1c1c1c')
  set(grid, 36, 22, '/', '#1c1c1c')
  set(grid, 38, 22, '\\', '#1c1c1c')
  set(grid, 40, 17, 'o', '#e2571a')

  rectOutline(grid, 2, 1, 28, 6, '=', '#1c1c1c')
  text(grid, 4, 2, 'HOME   82', '#1c1c1c')
  text(grid, 4, 4, 'GUEST  79', '#1c1c1c')

  titleBox(grid, 73, 1, 'CHAMPIONSHIP', '#e2571a')
  return grid
}

// ───────────────────────── Swimming ─────────────────────────
function buildSwimming(rand: () => number): Grid {
  const grid = makeGrid()
  background(grid, 'rgba(20,60,90,0.14)', rand)
  crowd(grid, 2, 73, 1, 5, 'rgba(20,60,90,0.3)', rand)

  rectFill(grid, 8, 11, 68, 34, '~', '#5aa9d6', 1, rand)
  hLine(grid, 8, 68, 10, '~', '#bfe3f5')

  const lanes = [8, 18, 28, 38, 48, 58, 68]
  lanes.forEach((x, i) => {
    vLine(grid, 11, 34, x, '|', '#f6f2ea')
    for (let y = 12; y < 34; y += 2) {
      set(grid, x, y, 'o', i % 2 === 0 ? '#e2571a' : '#f6f2ea')
    }
  })

  rectOutline(grid, 5, 8, 8, 10, '#', '#3a3a3a')
  rectOutline(grid, 22, 8, 25, 10, '#', '#3a3a3a')
  rectOutline(grid, 42, 8, 45, 10, '#', '#3a3a3a')

  // swimmer mid-stroke
  set(grid, 33, 20, 'O', '#1c1c1c')
  hLine(grid, 30, 36, 21, '-', '#1c1c1c')
  set(grid, 30, 19, 'Y', '#1c1c1c')
  set(grid, 36, 22, 'Y', '#1c1c1c')
  set(grid, 33, 22, '~', '#f6f2ea')

  rectOutline(grid, 2, 1, 22, 6, '=', '#1c1c1c')
  text(grid, 4, 2, 'LANE  4', '#1c1c1c')
  text(grid, 4, 4, '50.12 s', '#1c1c1c')

  titleBox(grid, 73, 1, 'FINAL', '#5aa9d6')
  return grid
}

// ───────────────────────── Fashion Show ─────────────────────────
function buildFashion(rand: () => number): Grid {
  const grid = makeGrid()
  background(grid, 'rgba(0,0,0,0.14)', rand)

  const topY = 12, botY = 34
  for (let y = topY; y <= botY; y++) {
    const t = (y - topY) / (botY - topY)
    const lx = 34 + (18 - 34) * t
    const rx = 42 + (58 - 42) * t
    set(grid, lx, y, '|', '#1c1c1c')
    set(grid, rx, y, '|', '#1c1c1c')
    for (let x = Math.ceil(lx) + 1; x < rx; x++) {
      if (rand() < 0.12) set(grid, x, y, '.', 'rgba(0,0,0,0.3)')
    }
    crowd(grid, 2, Math.floor(lx) - 2, y, y, 'rgba(0,0,0,0.4)', rand)
    crowd(grid, Math.ceil(rx) + 2, 73, y, y, 'rgba(0,0,0,0.4)', rand)
  }

  circleOutline(grid, 6, 4, 3, 2, '*', '#e8c547', 24)
  circleOutline(grid, 68, 4, 3, 2, '*', '#e8c547', 24)

  // model silhouette
  set(grid, 30, 18, 'O', '#1c1c1c')
  vLine(grid, 19, 23, 30, 'I', '#1c1c1c')
  for (let y = 24; y <= 29; y++) {
    const w = (y - 24) + 1
    hLine(grid, 30 - w, 30 + w, y, '#', '#d6336c')
  }
  set(grid, 29, 30, '/', '#1c1c1c')
  set(grid, 31, 30, '\\', '#1c1c1c')

  text(grid, 4, 2, 'FASHION WEEK', '#1c1c1c')
  titleBox(grid, 73, 1, 'RUNWAY COLLECTION', '#d6336c')
  return grid
}

// ───────────────────────── Scuba Diving ─────────────────────────
function buildScuba(rand: () => number): Grid {
  const grid = makeGrid()
  for (let y = 0; y < ROWS; y++) {
    const t = y / ROWS
    const r = Math.round(30 + (12 - 30) * t)
    const g = Math.round(95 + (55 - 95) * t)
    const b = Math.round(140 + (95 - 140) * t)
    rectFill(grid, 0, y, COLS - 1, y, '.·~', `rgba(${r},${g},${b},0.9)`, 0.55, rand)
  }
  rectFill(grid, 0, 0, COLS - 1, ROWS - 1, '.·', 'rgba(210,235,250,0.35)', 0.05, rand)

  // bubble trails
  for (let i = 0; i < 6; i++) {
    const bx = 6 + i * 12 + Math.floor(rand() * 4)
    for (let y = ROWS - 2; y > 2; y -= 2 + Math.floor(rand() * 2)) {
      set(grid, bx + Math.sin(y) * 1.5, y, 'o', 'rgba(235,248,255,0.95)')
    }
  }

  // seaweed
  for (const bx of [10, 62]) {
    for (let y = ROWS - 2; y > ROWS - 12; y--) {
      set(grid, bx + Math.sin(y * 0.8) * 2, y, 'w', '#3fae72')
    }
  }

  // coral bottom
  rectFill(grid, 0, ROWS - 3, COLS - 1, ROWS - 1, '^n', '#e2571a', 0.5, rand)

  // fish
  for (let i = 0; i < 5; i++) {
    const fx = 10 + Math.floor(rand() * 55)
    const fy = 6 + Math.floor(rand() * 18)
    text(grid, fx, fy, '<><', '#f5c518')
  }

  // diver — mask, tank, wetsuit body, fins
  set(grid, 37, 15, 'O', '#f0f0f0')
  set(grid, 36, 16, '=', '#f0f0f0')
  set(grid, 38, 16, '=', '#f0f0f0')
  rectOutline(grid, 34, 17, 40, 24, '#', '#f5c518')
  vLine(grid, 18, 23, 37, '|', '#f0f0f0')
  set(grid, 33, 19, '\\', '#f0f0f0')
  set(grid, 41, 18, '/', '#f0f0f0')
  set(grid, 32, 21, 'o', '#eaf6ff')
  vLine(grid, 25, 28, 35, '\\', '#f0f0f0')
  vLine(grid, 25, 28, 39, '/', '#f0f0f0')
  set(grid, 33, 29, 'V', '#f0f0f0')
  set(grid, 41, 29, 'V', '#f0f0f0')

  text(grid, 4, 2, 'DEPTH  18 m', '#eaf6ff')
  titleBox(grid, 73, 1, 'REEF DIVE', '#f5c518')
  return grid
}

export const THEMES: ThemeDef[] = [
  { id: 'tennis', name: 'Tennis', paper: '#f3ead9', build: buildTennis },
  { id: 'basketball', name: 'Basketball', paper: '#f3ead9', build: buildBasketball },
  { id: 'swimming', name: 'Swimming', paper: '#eef3f6', build: buildSwimming },
  { id: 'fashion', name: 'Fashion Show', paper: '#f3ead9', build: buildFashion },
  { id: 'scuba', name: 'Scuba Diving', paper: '#0d2a3d', build: buildScuba },
]

function mulberry32(seed: number) {
  return function rand() {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function generateGrid(theme: ThemeDef): Grid {
  return theme.build(mulberry32(42))
}
