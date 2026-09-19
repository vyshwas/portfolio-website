/* Portfolio hero diorama, built in the language of Channel 404 CH01
   (Weather Inside Your Head): a seeded miniature landscape on 2D canvas —
   layered irregular terrain, lobe clouds, reed clumps, reflecting water,
   one wader and crossing birds. Daylight bone-paper palette for the
   editorial portfolio. Self-animating (no hero controls); bounded dt;
   render(t) never mutates state; pauses offscreen/hidden/calm. */
import gsap from 'gsap'

const W = 960
const H = 600
const STILL_T = 1.6 // the composed instant reduced motion holds

const PAPER = '#f7f6f3'
const SUN = '#e9e4d7'
const CLOUD = '#dbd7ce'
const CLOUD_TOP = '#fbfaf7'
const RIDGE_FAR = '#d2d0c9'
const RIDGE_NEAR = '#b3b1aa'
const PINE = '#8a8880'
const PINE_DARK = '#4a4a4e'
const BANK = '#2e2e2c'
const BANK_RIM = '#6a6a6e'
const WATER = '#dde2df'
const WATER_DK = '#b9beb9'
const INK = '#1b1b1e'
const CYAN = '#00f0ff'

function mulberry32(a) {
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function buildLayout(seed) {
  const r = mulberry32(seed)
  const ridge = []
  const ridge2 = []
  for (let i = 0; i <= 12; i++) {
    const a = r()
    const b = r()
    ridge.push([i * (W / 12), 300 + (a - 0.42) * 95 - (a > 0.82 ? 55 : 0)])
    ridge2.push([i * (W / 12), 368 + (b - 0.5) * 60 - (b > 0.86 ? 36 : 0)])
  }
  const clouds = []
  for (let i = 0; i < 5; i++) {
    const lobes = []
    for (let k = 0; k < 8; k++)
      lobes.push([(r() - 0.5) * 70, (r() - 0.5) * 18, 10 + r() * 14])
    clouds.push({
      x: r(),
      y: 56 + r() * 104,
      s: 0.45 + r() * 0.45,
      v: 0.5 + r() * 0.8,
      lobes,
    })
  }
  const pines = []
  for (let i = 0; i < 30; i++) {
    pines.push({
      x: r() * W,
      y: 398 + r() * 34,
      h: 26 + r() * 38,
      w: 12 + r() * 10,
      dark: r() > 0.72,
    })
  }
  const bankL = []
  const bankR = []
  for (let i = 0; i <= 8; i++) {
    bankL.push([i * 55 - 20, 446 + (r() - 0.5) * 22])
    bankR.push([520 + i * 57, 449 + (r() - 0.5) * 22])
  }
  const stones = []
  for (let i = 0; i < 90; i++) {
    const left = r() > 0.45
    stones.push([
      left ? r() * 430 : 530 + r() * 420,
      440 + r() * 26,
      2 + r() * 4,
      r(),
    ])
  }
  const reeds = []
  const clumpX = [70, 210, 750, 895]
  for (let i = 0; i < clumpX.length; i++) {
    const blades = []
    const n = 5 + Math.floor(r() * 4)
    for (let b = 0; b < n; b++)
      blades.push([(r() - 0.5) * 40, 60 + r() * 70, (r() - 0.5) * 12, r() > 0.5])
    reeds.push({ x: clumpX[i] + (r() - 0.5) * 24, blades })
  }
  const ripples = []
  for (let i = 0; i < 14; i++) {
    ripples.push({
      x: 440 + r() * 120,
      y: 492 + r() * 70,
      len: 14 + r() * 30,
      ph: r() * 6.28,
      sp: 0.4 + r() * 0.8,
    })
  }
  return {
    ridge,
    ridge2,
    clouds,
    pines,
    bankL,
    bankR,
    stones,
    reeds,
    ripples,
    sun: { x: 738, y: 118, r: 30 },
    wader: { x: 380, ground: 447 },
    birds: [r(), r(), r()],
  }
}

export function createDioramaScene(container, opts = {}) {
  const calm = !!opts.calm
  // 'bottom' pins the visible band to the habitat (banks, water, wader)
  // when the stage is wider than the world aspect — for short sign-off
  // strips that would otherwise crop down to ridges and sky.
  const anchorBottom = opts.anchor === 'bottom'
  const canvas = document.createElement('canvas')
  canvas.className = 'diorama-canvas'
  canvas.setAttribute('aria-hidden', 'true')
  container.appendChild(canvas)
  const g = canvas.getContext('2d')
  if (!g) {
    // No 2D context: remove the canvas and report failure so the caller
    // keeps its poster fallback instead of an empty stage.
    canvas.remove()
    return null
  }

  const layout = buildLayout(20260911)
  let t = STILL_T
  let visible = true
  let disposed = false
  let running = false

  const fit = () => {
    const r = container.getBoundingClientRect()
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const w = Math.max(2, Math.round(r.width * dpr))
    const h = Math.max(2, Math.round(r.height * dpr))
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w
      canvas.height = h
    }
  }

  // Aspect-correct framing with one uniform scale — square pixels, never
  // stretched. Wide stages cover; tall (phone) stages fit the full world
  // width and anchor to the bottom, so both banks, the water and the
  // wader stay in frame while the sky crops under the copy.
  const frame = () => {
    const wide = canvas.width / canvas.height >= W / H
    const s = wide
      ? Math.max(canvas.width / W, canvas.height / H)
      : canvas.width / W
    const ox = (canvas.width - W * s) / 2
    const oy =
      wide && !anchorBottom
        ? (canvas.height - H * s) / 2
        : canvas.height - H * s
    g.setTransform(s, 0, 0, s, ox, oy)
    g.lineWidth = 1
  }

  const ridgePath = (points) => {
    g.beginPath()
    g.moveTo(-20, H)
    g.lineTo(-20, points[0][1])
    for (let i = 0; i < points.length - 1; i++) {
      const xc = (points[i][0] + points[i + 1][0]) / 2
      const yc = (points[i][1] + points[i + 1][1]) / 2
      g.quadraticCurveTo(points[i][0], points[i][1], xc, yc)
    }
    g.lineTo(W + 20, points[points.length - 1][1])
    g.lineTo(W + 20, H)
    g.closePath()
  }

  const drawSky = () => {
    g.fillStyle = PAPER
    g.fillRect(0, 0, W, H)
    const m = layout.sun
    g.fillStyle = SUN
    g.beginPath()
    g.arc(m.x, m.y, m.r, 0, Math.PI * 2)
    g.fill()
  }

  const drawCloud = (cl) => {
    const cx = ((cl.x * W * 1.3 + t * 9 * cl.v) % (W + 420)) - 210
    const cy = cl.y + Math.sin(t * 0.5 + cl.x * 20) * 4
    const s = cl.s
    g.fillStyle = CLOUD
    g.beginPath()
    for (const lb of cl.lobes) {
      g.moveTo(cx + (lb[0] + lb[2]) * s, cy + lb[1] * s + 8 * s)
      g.arc(cx + lb[0] * s, cy + lb[1] * s + 8 * s, lb[2] * s, 0, Math.PI * 2)
    }
    g.fill()
    g.fillStyle = CLOUD_TOP
    g.beginPath()
    for (const lb of cl.lobes) {
      g.moveTo(cx + (lb[0] + lb[2] * 0.8) * s, cy + (lb[1] - 7) * s)
      g.arc(cx + lb[0] * s, cy + (lb[1] - 7) * s, lb[2] * 0.8 * s, 0, Math.PI * 2)
    }
    g.fill()
  }

  const drawTerrain = () => {
    ridgePath(layout.ridge)
    g.fillStyle = RIDGE_FAR
    g.fill()
    ridgePath(layout.ridge2)
    g.fillStyle = RIDGE_NEAR
    g.fill()
    // pine silhouettes along the far shore
    for (const p of layout.pines) {
      g.fillStyle = p.dark ? PINE_DARK : PINE
      g.beginPath()
      g.moveTo(p.x - p.w / 2, p.y)
      g.lineTo(p.x, p.y - p.h)
      g.lineTo(p.x + p.w / 2, p.y)
      g.closePath()
      g.fill()
      g.fillRect(p.x - 1, p.y - 6, 2, 6)
    }
    // banks with pale rim light on top
    for (const [pts, top] of [
      [layout.bankL, 446],
      [layout.bankR, 449],
    ]) {
      ridgePath(pts)
      g.fillStyle = BANK
      g.fill()
      g.strokeStyle = BANK_RIM
      g.lineWidth = 2
      g.beginPath()
      g.moveTo(-20, pts[0][1])
      for (let i = 0; i < pts.length - 1; i++) {
        const xc = (pts[i][0] + pts[i + 1][0]) / 2
        const yc = (pts[i][1] + pts[i + 1][1]) / 2
        g.quadraticCurveTo(pts[i][0], pts[i][1], xc, yc)
      }
      g.stroke()
      void top
    }
    for (const st of layout.stones) {
      g.fillStyle = st[3] > 0.5 ? 'rgba(247,246,243,0.20)' : 'rgba(0,0,0,0.28)'
      g.fillRect(st[0], st[1], st[2], st[2] * 0.7)
    }
  }

  const drawWater = () => {
    g.fillStyle = WATER
    g.fillRect(0, 470, W, H - 470)
    g.fillStyle = WATER_DK
    g.fillRect(0, 470, W, 2)
    // bank reflections: dark streaks under each bank
    g.fillStyle = 'rgba(46,46,44,0.30)'
    for (let x = 0; x < 430; x += 14) {
      const h = 14 + ((x * 37) % 26)
      g.fillRect(x, 472, 6, h)
    }
    for (let x = 540; x < W; x += 16) {
      const h = 12 + ((x * 53) % 22)
      g.fillRect(x, 472, 5, h)
    }
    // drifting dashes in the open gap
    for (const r of layout.ripples) {
      const x = (((r.x + t * 7 * r.sp) % 160) + 160) % 160 + 400
      const y = r.y + Math.sin(t * 1.1 + r.ph) * 2
      g.fillStyle = Math.sin(t * r.sp + r.ph) > 0.2 ? WATER_DK : '#c9c7c0'
      g.fillRect(x, y, r.len, 1.5)
    }
    // two sparse cyan glints, the only cyan in the scene
    if (Math.sin(t * 1.7) > 0.86) {
      g.fillStyle = CYAN
      g.fillRect(492, 512, 4, 1.5)
      g.fillRect(548, 534, 3, 1.5)
    }
  }

  const drawReeds = () => {
    for (let i = 0; i < layout.reeds.length; i++) {
      const cl = layout.reeds[i]
      for (let b = 0; b < cl.blades.length; b++) {
        const bl = cl.blades[b]
        const sway = Math.sin(t * 1.0 + i * 2 + b) * 4
        const x0 = cl.x + bl[0]
        const y0 = 598
        const h = bl[1]
        const lean = bl[2] + sway
        g.strokeStyle = 'rgba(27,27,30,0.85)'
        g.lineWidth = 2.5
        g.beginPath()
        g.moveTo(x0, y0)
        g.quadraticCurveTo(x0 + lean * 0.4, y0 - h * 0.6, x0 + lean, y0 - h)
        g.stroke()
        if (bl[3]) {
          g.fillStyle = 'rgba(60,60,64,0.9)'
          g.beginPath()
          g.ellipse(x0 + lean, y0 - h, 3, 7, lean * 0.02, 0, Math.PI * 2)
          g.fill()
        }
      }
    }
  }

  const drawWader = () => {
    const wx = layout.wader.x
    const gy = layout.wader.ground
    const dip = t % 9 < 1.4 ? 5 : 0 // occasional look down at the water
    const bob = Math.sin(t * 1.2) * 1
    g.fillStyle = 'rgba(0,0,0,0.18)'
    g.fillRect(wx - 12, gy + 1, 26, 3)
    // legs
    g.strokeStyle = INK
    g.lineWidth = 2
    g.beginPath()
    g.moveTo(wx - 3, gy)
    g.lineTo(wx - 3, gy - 16)
    g.moveTo(wx + 4, gy)
    g.lineTo(wx + 4, gy - 16)
    g.stroke()
    // body
    g.fillStyle = INK
    g.beginPath()
    g.ellipse(wx, gy - 24 + bob, 13, 8, 0, 0, Math.PI * 2)
    g.fill()
    // neck + head (dips toward water on the slow gate)
    const hx = wx + 10
    const hy = gy - 34 + bob + dip
    g.lineWidth = 4
    g.beginPath()
    g.moveTo(wx + 6, gy - 28 + bob)
    g.lineTo(hx, hy + 3)
    g.stroke()
    g.beginPath()
    g.arc(hx + 1, hy, 5, 0, Math.PI * 2)
    g.fill()
    // beak
    g.lineWidth = 2
    g.beginPath()
    g.moveTo(hx + 5, hy)
    g.lineTo(hx + 11, hy + 1)
    g.stroke()
    // eye, with blink
    if ((t + 0.4) % 5.3 < 0.12) {
      g.strokeStyle = INK
      g.beginPath()
      g.moveTo(hx - 1, hy)
      g.lineTo(hx + 3, hy)
      g.stroke()
    } else {
      g.fillStyle = PAPER
      g.beginPath()
      g.arc(hx + 1, hy - 1, 1.6, 0, Math.PI * 2)
      g.fill()
    }
    // tail
    g.strokeStyle = INK
    g.lineWidth = 3
    g.beginPath()
    g.moveTo(wx - 12, gy - 26 + bob)
    g.lineTo(wx - 18, gy - 30 + bob)
    g.stroke()
  }

  const drawBirds = () => {
    g.strokeStyle = 'rgba(74,74,78,0.8)'
    g.lineWidth = 2.5
    for (let i = 0; i < layout.birds.length; i++) {
      const bs = layout.birds[i]
      const bx = ((bs * W + t * (22 + bs * 30)) % (W + 100)) - 50
      const by = 120 + bs * 110 + Math.sin(t * 1.2 + bs * 30) * 6
      const flap = Math.sin(t * 6 + bs * 10) * 5
      g.beginPath()
      g.moveTo(bx - 10, by - flap)
      g.quadraticCurveTo(bx, by + 2, bx, by)
      g.quadraticCurveTo(bx, by + 2, bx + 10, by - flap)
      g.stroke()
    }
  }

  const render = () => {
    frame()
    drawSky()
    for (const cl of layout.clouds) drawCloud(cl)
    drawTerrain()
    drawWater()
    drawReeds()
    drawWader()
    drawBirds()
  }

  const draw = (_time, delta) => {
    t += Math.min(delta / 1000, 0.05)
    render()
  }
  const sync = () => {
    if (calm || disposed) return
    const shouldRun = visible && !document.hidden
    if (shouldRun && !running) {
      gsap.ticker.add(draw)
      running = true
    } else if (!shouldRun && running) {
      gsap.ticker.remove(draw)
      running = false
    }
  }

  fit()
  render()
  if (calm) return { dispose: () => {} }
  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting
    sync()
  })
  observer.observe(container)
  const onVis = () => sync()
  document.addEventListener('visibilitychange', onVis)
  const resize = new ResizeObserver(() => {
    fit()
    if (!running) render()
  })
  resize.observe(container)
  sync()

  return {
    dispose: () => {
      disposed = true
      if (running) gsap.ticker.remove(draw)
      running = false
      observer.disconnect()
      resize.disconnect()
      document.removeEventListener('visibilitychange', onVis)
      canvas.remove()
    },
  }
}
