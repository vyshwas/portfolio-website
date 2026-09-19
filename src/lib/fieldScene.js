// A Field of Small Things — scene renderer (rebuild).
// Base illustration: public/assets/hero-field-plate.jpg (flattened plate).
// Original sprites, registered crossing, foreground reeds and water response
// are composed in code on top. ONE world-to-screen transform is shared by
// terrain, bridge, feet and paws. No vignette, no glow, no gradients.
//
// createFieldScene(container, opts) -> { setProgress, dispose, snapshot, getPose }
//   opts: { initialProgress, mobile, onFirstFrame, ambient }
import gsap from 'gsap'
import { SCENE, getNarrativePose } from './fieldNarrative.js'
import { getSprite, EYES } from './fieldSprites.js'

const PLATE_URL = './assets/hero-field-plate.jpg'

function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.decoding = 'async'
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('plate decode failed: ' + url))
    img.src = url
  })
}

export function createFieldScene(container, opts = {}) {
  const canvas = document.createElement('canvas')
  canvas.className = 'field-canvas'
  canvas.setAttribute('aria-hidden', 'true')
  container.appendChild(canvas)
  const g = canvas.getContext('2d')
  if (!g) {
    canvas.remove()
    container.dispatchEvent(new Event('sceneerror'))
    const stub = () => {}
    return { setProgress: stub, dispose: stub, snapshot: stub, getPose: () => null }
  }
  g.imageSmoothingEnabled = false

  let progress = opts.initialProgress ?? 0
  let elapsed = 0
  let visible = true
  let disposed = false
  let running = false
  let firstFrameFired = false
  let mobile = opts.mobile ?? container.clientWidth < 700
  let plate = null
  let failed = false

  const fail = () => {
    if (failed) return
    failed = true
    teardown()
    container.dispatchEvent(new Event('sceneerror'))
  }
  loadImage(PLATE_URL).then(
    (img) => {
      if (disposed) return
      plate = img
      fit()
      render()
      if (!firstFrameFired) {
        firstFrameFired = true
        opts.onFirstFrame?.(progress)
      }
      sync()
    },
    () => fail(),
  )

  // Backing store follows CSS size; camera aspect follows the canvas exactly.
  const fit = () => {
    const r = container.getBoundingClientRect()
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const w = Math.max(2, Math.round(r.width * dpr))
    const h = Math.max(2, Math.round(r.height * dpr))
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w
      canvas.height = h
    }
    mobile = container.clientWidth < 700
  }

  // World -> screen with ONE shared transform. Returns scale + mapper.
  const view = (pose) => {
    const aspect = canvas.width / canvas.height
    const w = pose.cam.w
    const h = w / aspect
    // Vertically anchor: desktop keeps narrative y; mobile crop sits on the
    // lower world (narrative cam already targets it) — clamp inside world.
    let x = pose.cam.x
    let y = pose.cam.y
    if (mobile) y = Math.min(Math.max(y, SCENE.worldH - h - 4), SCENE.worldH - h + 0)
    x = Math.min(Math.max(Math.round(x * 2) / 2, 0), SCENE.worldW - w)
    y = Math.min(Math.max(Math.round(y * 2) / 2, 0), Math.max(0, SCENE.worldH - h))
    const s = canvas.width / w
    return { x, y, w, h, s, X: (wx) => Math.round((wx - x) * s), Y: (wy) => Math.round((wy - y) * s) }
  }

  // Ambient blink never touches feet: it paints a 1-frame ink lid over the
  // authored eye box only. Periods/offsets differ per actor.
  const BLINKS = [
    { match: /^helper/, period: 4.6, off: 1.0 },
    { match: /^traveler/, period: 3.8, off: 2.2 },
    { match: /^bird/, period: 5.3, off: 0.4 },
  ]
  const drawSprite = (v, name, wx, wy, scale = 1, t = -1, breathPhase = null) => {
    const f = getSprite(name)
    // breathe adds up to 1 world-px of height anchored at the feet edge:
    // bottomEdge = Y(wy) + (h-pivot.y)*s is independent of b, so planted
    // feet never move while the body subtly rises and falls.
    const b = t >= 0 && breathPhase !== null && Math.sin(t * 1.5 + breathPhase) > 0.55 ? 1 : 0
    const dx = Math.round((wx - v.x) * v.s - f.pivot.x * v.s * scale)
    const dy = Math.round((wy - v.y) * v.s - (f.pivot.y + b) * v.s * scale)
    g.drawImage(
      f.canvas,
      dx,
      dy,
      Math.max(1, Math.round(f.w * v.s * scale)),
      Math.max(1, Math.round((f.h + b) * v.s * scale)),
    )
    if (t >= 0) {
      const rule = BLINKS.find((b) => b.match.test(name))
      if (rule && (t + rule.off) % rule.period < 0.12 && EYES[name]) {
        const e = EYES[name]
        g.fillStyle = '#1b1b1e'
        g.fillRect(
          Math.round(dx + e.x * v.s * scale),
          Math.round(dy + e.y * v.s * scale),
          Math.max(1, Math.round(e.w * v.s * scale)),
          Math.max(1, Math.round(e.h * v.s * scale)),
        )
      }
    }
  }

  // Reed beds: clustered stalks with cattail heads at the view edges,
  // bottom-anchored, layered heights/tones. Never near faces or text core.
  const FOREGROUND = [
    { x: 66, h: 168, w: 4, tone: '#1b1b1e' }, { x: 76, h: 120, w: 3, tone: '#3c3c40' },
    { x: 86, h: 182, w: 4, tone: '#1b1b1e' }, { x: 96, h: 104, w: 2, tone: '#3c3c40' },
    { x: 106, h: 148, w: 3, tone: '#1b1b1e' }, { x: 118, h: 88, w: 2, tone: '#3c3c40' },
    { x: 128, h: 132, w: 3, tone: '#1b1b1e' },
    { x: 200, h: 184, w: 3, tone: '#3c3c40' }, { x: 220, h: 148, w: 2, tone: '#3c3c40' },
    { x: 892, h: 150, w: 4, tone: '#1b1b1e' }, { x: 902, h: 108, w: 2, tone: '#3c3c40' },
    { x: 912, h: 176, w: 4, tone: '#1b1b1e' }, { x: 922, h: 96, w: 3, tone: '#3c3c40' },
    { x: 934, h: 140, w: 3, tone: '#1b1b1e' }, { x: 946, h: 112, w: 2, tone: '#3c3c40' },
    { x: 956, h: 160, w: 4, tone: '#1b1b1e' },
  ]
  const drawForeground = (v, t, baseCamX) => {
    const shift = (v.x - baseCamX) * 0.16
    for (let i = 0; i < FOREGROUND.length; i++) {
      const b = FOREGROUND[i]
      const sway = Math.round(Math.sin(t * 0.8 + i * 1.7) * 2 * v.s) / v.s
      const x = b.x - shift + sway
      const sx = v.X(x)
      if (sx < -30 || sx > canvas.width + 30) continue
      const topWorld = SCENE.worldH - b.h
      const syTop = v.Y(topWorld)
      const hPx = canvas.height - syTop
      const wPx = Math.max(1, Math.round(b.w * v.s))
      g.fillStyle = b.tone || '#1b1b1e'
      g.fillRect(sx, syTop, wPx, hPx)
      // seed head
      const hwPx = Math.max(2, Math.round((b.w + 2) * v.s))
      const hhPx = Math.max(4, Math.round(11 * v.s))
      g.fillRect(sx - Math.round(hwPx / 4), syTop - Math.round(2 * v.s), Math.round(wPx * 0.9), Math.round(6 * v.s))
      g.fillRect(sx - Math.round(hwPx / 4), syTop - Math.round(2 * v.s), hwPx, hhPx)
    }
  }

  // Foreground pond dashes: painted open water right of the gap only.
  const POND_RIPPLES = [
    { x: 640, y: 452, len: 26, ph: 0.6 }, { x: 710, y: 472, len: 32, ph: 2.4 },
    { x: 780, y: 448, len: 22, ph: 4.1 }, { x: 830, y: 478, len: 28, ph: 1.2 },
    { x: 670, y: 496, len: 20, ph: 3.3 }, { x: 805, y: 500, len: 24, ph: 5.0 },
  ]
  // Ambient idle dashes live ONLY in the open gap water (never over rock).
  const IDLE_RIPPLES = [
    { x: 460, y: 428, len: 22, ph: 0.0 }, { x: 500, y: 452, len: 30, ph: 1.7 },
    { x: 540, y: 436, len: 18, ph: 3.1 }, { x: 575, y: 460, len: 26, ph: 4.4 },
    { x: 480, y: 478, len: 20, ph: 2.2 }, { x: 555, y: 488, len: 24, ph: 5.3 },
  ]
  const drawWater = (v, t, pose) => {
    // bank-face cascade right of the landing: narrow seep falls over the
    // rock face into the pool. Semi-transparent; judged against the plate.
    {
      const fx = [646, 652, 658]
      const topY = 398, botY = 432
      for (let i = 0; i < fx.length; i++) {
        const sx = v.X(fx[i])
        if (sx < -20 || sx > canvas.width + 20) continue
        const sy0 = v.Y(topY), sy1 = v.Y(botY)
        g.fillStyle = i === 1 ? '#d8d7d1' : '#ababae'
        g.globalAlpha = 0.75
        const off = (elapsed * 34 + i * 7) % 9
        for (let y = sy0 + off; y < sy1; y += 9) {
          g.fillRect(sx, Math.round(y), Math.max(1, Math.round(1.6 * v.s)), Math.max(2, Math.round(4 * v.s)))
        }
        g.globalAlpha = 1
      }
      const foamx = v.X(652), foamy = v.Y(434)
      if (foamx > -40 && foamx < canvas.width + 40) {
        const pulse = 0.6 + 0.4 * Math.sin(elapsed * 3.1)
        g.globalAlpha = 0.55 * pulse + 0.2
        g.fillStyle = '#e9e7e1'
        g.beginPath()
        g.ellipse(foamx, foamy, 11 * v.s * pulse, 2.4 * v.s, 0, 0, Math.PI * 2)
        g.fill()
        g.globalAlpha = 1
        if (Math.sin(elapsed * 1.7) > 0.9) {
          g.fillStyle = '#00f0ff'
          g.fillRect(foamx + Math.round(4 * v.s), foamy, 2, 1)
        }
      }
    }
    // story contacts: expanding rings, alpha from narrative strength
    for (const c of pose.contacts) {
      const cx = v.X(c.x)
      const cy = v.Y(c.y)
      if (cx < -40 || cx > canvas.width + 40) continue
      for (let i = 0; i < 2; i++) {
        const ph = (t * 0.7 + i * 0.5 + c.x * 0.01) % 1
        const rw = (3 + ph * 13) * v.s
        g.globalAlpha = Math.max(0, 0.55 * c.s * (1 - ph))
        g.strokeStyle = i === 0 ? '#00f0ff' : '#717176'
        g.lineWidth = Math.max(1, Math.round(v.s))
        g.beginPath()
        g.ellipse(cx, cy, rw, rw * 0.22, 0, 0, Math.PI * 2)
        g.stroke()
      }
      g.globalAlpha = 1
    }
    // ambient idles (gap + pond)
    g.fillStyle = '#ababae'
    for (const r of IDLE_RIPPLES) {
      const drift = Math.sin(t * 0.5 + r.ph) * 4
      const sx = v.X(r.x + drift)
      const sy = v.Y(r.y)
      if (sx < -40 || sx > canvas.width + 40) continue
      g.globalAlpha = 0.35 + 0.2 * Math.sin(t * 0.9 + r.ph)
      g.fillRect(sx, sy, Math.round(r.len * v.s), Math.max(1, Math.round(v.s)))
    }
    g.fillStyle = '#c9c7c0'
    for (const r of POND_RIPPLES) {
      const drift = Math.sin(t * 0.35 + r.ph) * 6
      const sx = v.X(r.x + drift)
      const sy = v.Y(r.y)
      if (sx < -40 || sx > canvas.width + 40 || sy < 0 || sy > canvas.height) continue
      g.globalAlpha = 0.22 + 0.12 * Math.sin(t * 0.6 + r.ph)
      g.fillRect(sx, sy, Math.round(r.len * v.s), Math.max(1, Math.round(v.s)))
    }
    // slow ambient rings breathing on the gap water (faint; story rings differ)
    for (let i = 0; i < 2; i++) {
      const ph = (t * 0.12 + i * 0.5) % 1
      const cx = v.X(500 + i * 60 + Math.sin(t * 0.2 + i) * 6)
      const cy = v.Y(SCENE.waterY + 14)
      if (cx < -40 || cx > canvas.width + 40) continue
      g.globalAlpha = 0.14 * (1 - ph)
      g.strokeStyle = '#717176'
      g.lineWidth = Math.max(1, Math.round(v.s))
      g.beginPath()
      g.ellipse(cx, cy, (4 + ph * 16) * v.s, (1 + ph * 3) * v.s, 0, 0, Math.PI * 2)
      g.stroke()
    }
    g.globalAlpha = 1
  }

  const drawBridge = (v, pose) => {
    const { pivot } = SCENE
    const { tip } = pose.reed
    const x0 = v.X(pivot.x), y0 = v.Y(pivot.y)
    const x1 = v.X(tip.x), y1 = v.Y(tip.y)
    // socket shadow on the bank
    g.fillStyle = '#1b1b1e'
    g.fillRect(x0 - Math.round(3 * v.s), y0 - Math.round(2 * v.s), Math.round(7 * v.s), Math.round(3 * v.s))
    // stalk behind actors
    g.strokeStyle = '#1b1b1e'
    g.lineWidth = Math.max(2, Math.round(3 * v.s))
    g.lineCap = 'round'
    g.beginPath()
    g.moveTo(x0, y0)
    g.lineTo(x1, y1)
    g.stroke()
    g.strokeStyle = '#3c3c40'
    g.lineWidth = Math.max(1, Math.round(v.s))
    g.beginPath()
    g.moveTo(x0, y0)
    g.lineTo(x1, y1)
    g.stroke()
  }

  const render = () => {
    if (!plate || failed) return
    const pose = getNarrativePose(progress, { mobile })
    const v = view(pose)
    // base plate crop — aspect-locked, no independent x/y scaling
    g.drawImage(plate, v.x, v.y, v.w, v.h, 0, 0, canvas.width, canvas.height)
    // pale sun disc, upper right of the wide frame (cropped out in close-up)
    if (!mobile) {
      const sunx = v.X(770), suny = v.Y(120)
      if (sunx > -60 && sunx < canvas.width + 60 && suny > -60) {
        g.fillStyle = '#e6e3d9'
        g.beginPath()
        g.arc(sunx, suny, Math.max(2, 26 * v.s), 0, Math.PI * 2)
        g.fill()
      }
    }
    drawWater(v, elapsed, pose)
    drawBridge(v, pose)
    // helper + paw contact (slow breath, phase 0.0)
    const helperFrame = pose.helper.frame === 'up' ? 'helperUp' : pose.helper.frame === 'settle' ? 'helperIdle' : 'helperIdle'
    drawSprite(v, helperFrame, pose.helper.x, pose.helper.y, 1, elapsed, 0.0)
    if (pose.helper.paw) drawSprite(v, 'helperPaw', pose.helper.paw.x, pose.helper.paw.y)
    // traveler (drawn slightly larger about its feet pivot; breath phase 2.1)
    const tf = { idle: 'travelerIdle', test: 'travelerTest', walkA: 'travelerWalkA', walkB: 'travelerWalkB', lookback: 'travelerLookback' }[pose.traveler.frame]
    drawSprite(v, tf, pose.traveler.x, pose.traveler.y, 1.25, elapsed, 2.1)
    // incidental wader: slow head-turn cycle, feet planted on the ledge
    drawSprite(v, elapsed % 7 < 5.6 ? 'bird' : 'birdLook', pose.bird.x, pose.bird.y, 1, elapsed, 4.2)
    drawForeground(v, elapsed, mobile ? SCENE.camWideM.x : SCENE.camWide.x)
  }

  const draw = (_time, delta) => {
    elapsed += Math.min(delta / 1000, 0.05)
    render()
  }
  const sync = () => {
    const shouldRun = visible && !document.hidden && !disposed && !failed && !!plate
    if (shouldRun && !running) {
      gsap.ticker.add(draw)
      running = true
    } else if (!shouldRun && running) {
      gsap.ticker.remove(draw)
      running = false
    }
  }

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

  fit()
  sync()

  const teardown = () => {
    disposed = true
    sync()
    observer.disconnect()
    resize.disconnect()
    document.removeEventListener('visibilitychange', onVis)
    canvas.remove()
  }

  const api = {
    setProgress: (val) => {
      progress = Math.min(1, Math.max(0, val))
      if (!running) render()
    },
    // Deterministic single-frame render for tests and poster export.
    snapshot: (p, t = 0) => {
      progress = Math.min(1, Math.max(0, p))
      elapsed = t
      render()
    },
    getPose: () => getNarrativePose(progress, { mobile }),
    dispose: () => {
      teardown()
    },
  }
  // Deterministic-frame handle for verification captures (not user-facing).
  canvas._api = api
  return api
}
