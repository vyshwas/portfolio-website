// Authored pixel sprites for A Field of Small Things.
// Hand-designed bitmaps (string maps) baked once into offscreen canvases.
// All actors face RIGHT in world space; the look-back frame faces LEFT.
// Pivots are feet-center in sprite pixels; the scene draws every sprite at
// integer world coordinates with smoothing disabled.
//
// Palette (centralized artwork tones + paper):
//   K ink, D dark stone, M mid gray, L light gray, P pale, E eye paper, U pupil
export const PALETTE = {
  K: '#1b1b1e',
  D: '#3c3c40',
  M: '#717176',
  L: '#ababae',
  P: '#d8d7d1',
  E: '#f7f6f3',
  U: '#1b1b1e',
}

function bake(rows, pivot) {
  const h = rows.length
  const w = Math.max(...rows.map((r) => r.length))
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  const g = c.getContext('2d')
  for (let y = 0; y < h; y++) {
    const row = rows[y]
    for (let x = 0; x < row.length; x++) {
      const ch = row[x]
      if (ch === '.' || ch === ' ') continue
      g.fillStyle = PALETTE[ch] || PALETTE.K
      g.fillRect(x, y, 1, 1)
    }
  }
  return { canvas: c, w, h, pivot }
}

// ---------------------------------------------------------------------------
// Helper ("Moru"): low rounded boulder body, shell plates, blunt snout head.
// 38x28. Feet rows y24-26, pivot (17,26).
// ---------------------------------------------------------------------------
const HELPER_BODY = [
  '......................................',
  '......................................',
  '......................................',
  '......................................',
  '......................................',
  '......................................',
  '......................................',
  '......................................',
  '..........KKKKKKKKKKKK................',
  '........KKDDDDDDDDDDDDKK..............',
  '......KDDDDDMDDDDDMDDDDDK.............',
  '.....KDDDMDLMDMDMDLMDMDDDK............',
  '....KDDMDLMDMDMDMDMDLMDMDDK...........',
  '....KDDMDLMDMDMDMDMDLMDMDDK...........',
  '...KDDMDLMDMDMDMDMDMDLMDMDDK..........',
  '...KDDMDLMDMDMDMDMDMDLMDMDDK..........',
  '...KDDMDLMDMDMDMDMDMDLMDMDDK..........',
  '...KDDDDMDMDMDMDMDMDMDMDDDDK..........',
  '...KDDDDDDDDDDDDDDDDDDDDDDDK..........',
  '...KDDDDDDDDDDDDDDDDDDDDDDK...........',
  '...KDDDDDDDDDDDDDDDDDDDDDDK...........',
  '....KDDDDDDDDDDDDDDDDDDDDK............',
  '....KKKKKKKKKKKKKKKKKKKKK.............',
  '......KKK................KKK..........',
  '......KKK................KKK..........',
  '......KKK................KKK..........',
  '.....KKKKK..............KKKKK.........',
  '......................................',
]

const HELPER_HEAD_IDLE = [
  '.............................KKKK.....',
  '...........................KKDDDDDK...',
  '..........................KDDDDDDDDDK.',
  '..........................KDDDEEUKDDK.',
  '..........................KDDDEEUKDDK.',
  '..........................KDDDDDDDDDK.',
  '...........................KDDDMMMMK..',
  '............................KKKKKK....',
  '......................................',
]

const HELPER_HEAD_UP = [
  '..............................KKKK....',
  '............................KKDDDDDK..',
  '...........................KDDDDDDDDDK',
  '...........................KDDDEEUKDDK',
  '...........................KDDDEEUKDDK',
  '...........................KDDDDDDDDDK',
  '........................KKKKDDMMMMMK.',
  '........................KDDDKKKKKK...',
  '........................KDDDK........',
]

// Small forepaw, drawn at the reed handle point during contact.
const HELPER_PAW = [
  '.KKK.',
  'KDDDK',
  'KDDDK',
  '.KKK.',
]

// ---------------------------------------------------------------------------
// Traveler ("Pip"): light biped, round head, thin legs, tail curl.
// 26x22. Feet rows y18-20, pivot (11,20).
// ---------------------------------------------------------------------------
const TRAVELER_IDLE = [
  '..........................',
  '..........................',
  '..........................',
  '..........................',
  '..............KKKKK.......',
  '.............KDDDDDK......',
  '............KDDDDDDDDK....',
  '............KDDDEEUDDK....',
  '............KDDDEEUDDKK...',
  '............KDDDDDDDDDDK..',
  '.....KK.....KDDDDDMMMMMK..',
  '......KK.....KDDDDDDDDK...',
  '.......KK....KKDDDDDDK....',
  '........KK.....KDDDDK.....',
  '......KK.......KDDDK......',
  '.....KK........KDDDK......',
  '.....K.........KDDDK......',
  '.....K........KK.KK.......',
  '.....K........KK.KK.......',
  '.....K.......KKK.KKK......',
  '............KKK...KKK.....',
  '..........................',
]

const TRAVELER_TEST = [
  '..........................',
  '..........................',
  '..........................',
  '..........................',
  '..............KKKKK.......',
  '.............KDDDDDK......',
  '............KDDDDDDDDK....',
  '............KDDDEEUDDK....',
  '............KDDDEEUDDKK...',
  '............KDDDDDDDDDDK..',
  '.....KK.....KDDDDDMMMMMK..',
  '......KK.....KDDDDDDDDK...',
  '.......KK....KKDDDDDDK....',
  '........KK.....KDDDDK.....',
  '......KK.......KDDDK......',
  '.....KK........KDDDK......',
  '.....K.........KDDDK......',
  '.....K........KK..KKK.....',
  '.....K........KK...KKK....',
  '.....K.......KKK....KK....',
  '............KKK..........',
  '..........................',
]

const TRAVELER_WALK_A = [
  '..........................',
  '..........................',
  '..........................',
  '..........................',
  '..............KKKKK.......',
  '.............KDDDDDK......',
  '............KDDDDDDDDK....',
  '............KDDDEEUDDK....',
  '............KDDDEEUDDKK...',
  '............KDDDDDDDDDDK..',
  '.....KK.....KDDDDDMMMMMK..',
  '......KK.....KDDDDDDDDK...',
  '.......KK....KKDDDDDDK....',
  '........KKK....KDDDDK.....',
  '......KK.......KDDDK......',
  '.....KK.......KDDDK.......',
  '.....K.......KK..KK.......',
  '.....K......KK....KK......',
  '.....K.....KK......KK.....',
  '.....K....KKK.......KK....',
  '..........KK................',
  '..........................',
]

const TRAVELER_WALK_B = [
  '..........................',
  '..........................',
  '..........................',
  '..........................',
  '..........................',
  '..............KKKKK.......',
  '.............KDDDDDK......',
  '............KDDDDDDDDK....',
  '............KDDDEEUDDK....',
  '............KDDDEEUDDKK...',
  '.....KK.....KDDDDDDDDDDK..',
  '......KK....KDDDDDMMMMMK..',
  '.......KK....KDDDDDDDDK...',
  '........KK...KKDDDDDDK....',
  '......KK......KDDDDDK.....',
  '.....KK.......KDDDK.......',
  '.....K.......KK.KK........',
  '.....K.......KK.KK........',
  '.....K......KKK.KKK.......',
  '.....K......KK...KK.......',
  '..........................',
  '..........................',
]

// Look-back: same body, head turned left (snout + eye on the left).
const TRAVELER_LOOKBACK = [
  '..........................',
  '..........................',
  '..........................',
  '..........................',
  '.............KKKKK........',
  '............KDDDDDK.......',
  '...........KDDDDDDDDK.....',
  '...........KDDUEEDDDK.....',
  '..........KKDDUEEDDDK.....',
  '..........KDDDDDDDDDK.....',
  '..........KMMMMDDDDDK.....',
  '...........KDDDDDDDDK.....',
  '...........KDDDDDDKK......',
  '.....KK.....KDDDDK........',
  '......KK....KDDDK.........',
  '.......KK...KDDDK.........',
  '........KK.KKDDDK.........',
  '.........KKK.KK.KK........',
  '..........KK.KK.KK........',
  '..........KKK...KKK.......',
  '..........................',
  '..........................',
]

// ---------------------------------------------------------------------------
// Incidental bird: tall wader perched far left. 20x30, pivot (10,29).
// Second frame turns its head down-left (preening/looking at the water).
// ---------------------------------------------------------------------------
const BIRD = [
  '....................',
  '....................',
  '....................',
  '................K...',
  '...............KDK..',
  '...............KDK..',
  '..............KDDDK.',
  '..............KDEUK.',
  '..............KDDDKK',
  '...............KDDDK',
  '...............KDK..',
  '..............KDK...',
  '..............KDK...',
  '.............KDK....',
  '.............KDK....',
  '............KDDK....',
  '...........KDDDK....',
  '..........KDDDDK....',
  '.........KDDDDDK....',
  '.........KDDDKK.....',
  '.........KDDK.......',
  '.........KDK........',
  '.........KDK........',
  '.........KDK........',
  '.........KDK........',
  '.........KDK........',
  '.........KDK........',
  '........KK.KK.......',
  '........KK.KK.......',
  '....................',
]

const BIRD_LOOK = [
  '....................',
  '....................',
  '....................',
  '....................',
  '....................',
  '....................',
  '....................',
  '..........KK........',
  '.........KDEK.......',
  '........KDDDK.......',
  '........KDDDKK......',
  '.........KDDDDK.....',
  '..........KDDK......',
  '...........KDK......',
  '............KDK.....',
  '............KDDK....',
  '...........KDDDK....',
  '..........KDDDDK....',
  '.........KDDDDDK....',
  '.........KDDDKK.....',
  '.........KDDK.......',
  '.........KDK........',
  '.........KDK........',
  '.........KDK........',
  '.........KDK........',
  '.........KDK........',
  '.........KDK........',
  '........KK.KK.......',
  '........KK.KK.......',
  '....................',
]

const FRAMES = {
  helperIdle: () => merge(HELPER_BODY, HELPER_HEAD_IDLE, { x: 0, y: 4 }),
  helperUp: () => merge(HELPER_BODY, HELPER_HEAD_UP, { x: 0, y: 0 }),
  helperPaw: () => bake(HELPER_PAW, { x: 2, y: 1 }),
  travelerIdle: () => bake(TRAVELER_IDLE, { x: 11, y: 20 }),
  travelerTest: () => bake(TRAVELER_TEST, { x: 11, y: 20 }),
  travelerWalkA: () => bake(TRAVELER_WALK_A, { x: 11, y: 20 }),
  travelerWalkB: () => bake(TRAVELER_WALK_B, { x: 11, y: 20 }),
  travelerLookback: () => bake(TRAVELER_LOOKBACK, { x: 11, y: 20 }),
  bird: () => bake(BIRD, { x: 10, y: 29 }),
  birdLook: () => bake(BIRD_LOOK, { x: 10, y: 29 }),
}

// Eye boxes in sprite pixels for blink overlays (feet never touched).
export const EYES = {
  helperIdle: { x: 30, y: 7, w: 3, h: 2 },
  helperUp: { x: 30, y: 3, w: 3, h: 2 },
  travelerIdle: { x: 15, y: 7, w: 3, h: 2 },
  travelerTest: { x: 15, y: 7, w: 3, h: 2 },
  travelerWalkA: { x: 15, y: 7, w: 3, h: 2 },
  travelerWalkB: { x: 15, y: 8, w: 3, h: 2 },
  travelerLookback: { x: 13, y: 7, w: 3, h: 2 },
  bird: { x: 15, y: 7, w: 2, h: 1 },
  birdLook: { x: 10, y: 8, w: 1, h: 1 },
}

// Overlay `top` rows onto `base` rows at offset, then bake.
function merge(base, top, off) {
  const rows = base.map((r) => r.split(''))
  top.forEach((row, y) => {
    const ty = y + off.y
    if (ty < 0 || ty >= rows.length) return
    for (let x = 0; x < row.length; x++) {
      const tx = x + off.x
      if (tx < 0 || tx >= rows[ty].length) continue
      const ch = row[x]
      if (ch !== '.' && ch !== ' ') rows[ty][tx] = ch
    }
  })
  return bake(
    rows.map((r) => r.join('')),
    { x: 17, y: 26 },
  )
}

const cache = {}
export function getSprite(name) {
  if (!cache[name]) cache[name] = FRAMES[name]()
  return cache[name]
}
