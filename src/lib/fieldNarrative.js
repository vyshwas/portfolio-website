// Pure deterministic narrative for A Field of Small Things.
// getNarrativePose(p, opts) maps normalized scroll progress to the complete
// story state. Same p => same pose, always. Ambient time NEVER enters here;
// the scene layer may add blink/breath/sway on top without moving contacts.
//
// World units are production-plate pixels (1008x567). Geometry was measured
// from plans/hero-quality-rebuild/references/environment-plate.png and is
// recorded in plans/hero-quality-rebuild/evidence/plate-geometry.json:
//   plate 1672x941, scale k=0.6029
//   left ledge top edge  y~662 -> 399 | right ledge top y~662 -> 399
//   left bank ends  x~740 -> 446     | right bank starts x~975 -> 588
//   waterline       y~665 -> 401
const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v)
const lerp = (a, b, t) => a + (b - a) * t
const smooth01 = (t) => t * t * (3 - 2 * t)
// Progress within [a,b] mapped to smooth 0..1.
const seg = (p, a, b) => smooth01(clamp01((p - a) / (b - a)))
// Linear progress within [a,b] (for distance-driven gait).
const lin = (p, a, b) => clamp01((p - a) / (b - a))

export const SCENE = {
  worldW: 1008,
  worldH: 567,
  ledgeY: 396,
  waterY: 402,
  pivot: { x: 416, y: 394 },
  land: { x: 597, y: 396 },
  reedLen: 181,
  reedStandAngle: -2.85, // stalk rests along the left bank, tip up-left;
  // fixed length; the push arc rises through vertical, by which time the
  // HTML copy has faded, so the tall sweep never crosses live text
  helperHome: { x: 372, y: 396 },
  // Traveler waits beside the helper, ahead toward the reed — no teleport:
  // the .48-.55 settle window covers its short approach to the bridge base.
  travelerHome: { x: 400, y: 396 },
  // Incidental wader, far left on the same ledge. Static position; the scene
  // swaps its head frame on an ambient cycle (never touches the story).
  birdPerch: { x: 262, y: 396 },
  // Desktop: the storyboard shot list drives the camera — wide establish,
  // push into a close event frame (~1.42x) held through the crossing and
  // look-back, then settle back toward wide as the page exits into About.
  camWide: { x: 60, y: 8, w: 880, h: 550 },
  camClose: { x: 190, y: 150, w: 620, h: 387 }, // 1.419x on the gap
  // Mobile: same move, gentler (already a close crop).
  camWideM: { x: 250, y: 287, w: 520, h: 260 },
  camCloseM: { x: 270, y: 337, w: 460, h: 230 }, // 1.13x
}

function reedAngleAt(p) {
  const land = { x: SCENE.land.x, y: SCENE.land.y - 2 }
  const dx = land.x - SCENE.pivot.x
  const dy = land.y - SCENE.pivot.y
  const landAngle = Math.atan2(dy, dx) // ~ +0.017, rests on right ledge
  const drop = seg(p, 0.28, 0.48)
  return lerp(SCENE.reedStandAngle, landAngle, drop)
}

export function getNarrativePose(pRaw, opts = {}) {
  const p = clamp01(pRaw)
  const mobile = !!opts.mobile
  const camA = mobile ? SCENE.camWideM : SCENE.camWide
  const camB = mobile ? SCENE.camCloseM : SCENE.camClose
  // Push in fast, hold the close frame through the payoff, ease partway back
  // for the exit. Pure f(p): identical forward and reverse.
  const push = seg(p, 0.08, 0.55) * (1 - 0.45 * seg(p, 0.82, 1.0))
  const cam = {
    x: lerp(camA.x, camB.x, push),
    y: lerp(camA.y, camB.y, push),
    w: lerp(camA.w, camB.w, push),
    h: lerp(camA.h, camB.h, push),
  }

  // --- Reed: fixed pivot, fixed length, tip lands at p=.48 ---
  const angle = reedAngleAt(p)
  const tip = {
    x: SCENE.pivot.x + Math.cos(angle) * SCENE.reedLen,
    y: SCENE.pivot.y + Math.sin(angle) * SCENE.reedLen,
  }
  const handle = {
    x: SCENE.pivot.x + Math.cos(angle) * 34,
    y: SCENE.pivot.y + Math.sin(angle) * 34,
  }
  const bridgeReady = p >= 0.48

  // --- Helper: anticipate (.16-.28), push (.28-.48), release+settle (.48+) ---
  const reach = seg(p, 0.16, 0.28)
  const pushK = seg(p, 0.28, 0.48)
  const effort = Math.sin(pushK * Math.PI * 2) * 1 // deterministic bob, f(p)
  const helperX = SCENE.helperHome.x + reach * 5 + pushK * 7
  const helperY = SCENE.helperHome.y + (p >= 0.28 && p < 0.48 ? Math.round(effort) : 0)
  const helperFrame = p < 0.16 ? 'idle' : p < 0.48 ? 'up' : 'settle'
  const paw =
    p >= 0.16 && p < 0.55
      ? { x: handle.x, y: handle.y }
      : null
  const helper = { x: helperX, y: helperY, frame: helperFrame, paw }

  // --- Traveler: waits, tests (.48-.515), approaches (.515-.55),
  // --- crosses (.55-.72), lands+looks back (.72-.82) ---
  const cross = lin(p, 0.55, 0.72)
  const startX = SCENE.pivot.x + 8
  const endX = tip.x - 12 // planted on the fallen reed, short of the tip
  const dist = cross * (endX - startX)
  const stride = 16
  const gaitPhase = (dist / stride) * Math.PI
  const walkFrame = Math.floor(gaitPhase / Math.PI) % 2 === 0 ? 'walkA' : 'walkB'
  // Bridge deck height under foot x (reed centerline minus half stalk).
  const deckYat = (x) => {
    const t = clamp01((x - SCENE.pivot.x) / (tip.x - SCENE.pivot.x || 1))
    return lerp(SCENE.pivot.y, tip.y, t) - 2
  }
  let traveler
  if (p < 0.48) {
    traveler = { x: SCENE.travelerHome.x, y: SCENE.travelerHome.y, frame: 'idle' }
  } else if (p < 0.515) {
    traveler = { x: SCENE.travelerHome.x, y: SCENE.travelerHome.y, frame: 'test' }
  } else if (p < 0.55) {
    // Short scurry to the bridge base, gait driven by distance covered.
    const ak = lin(p, 0.515, 0.55)
    const ax = lerp(SCENE.travelerHome.x, startX, ak)
    const agait = (Math.abs(ax - SCENE.travelerHome.x) / stride) * Math.PI
    traveler = {
      x: ax,
      y: SCENE.travelerHome.y,
      frame: Math.floor(agait / Math.PI) % 2 === 0 ? 'walkA' : 'walkB',
    }
  } else if (p < 0.72) {
    // Feet ride the reed centerline; gait reads through alternating leg
    // frames driven by traveled distance. No vertical bob: planted feet stay.
    // The first 8% blends the mounting step up from ledge to deck height.
    const x = startX + dist
    const mount = seg(cross, 0, 0.08)
    const y = lerp(SCENE.travelerHome.y, deckYat(x), mount)
    traveler = { x, y, frame: walkFrame, gaitPhase }
  } else {
    // Land: step from reed tip onto the right ledge, then hold look-back.
    const landK = seg(p, 0.72, 0.76)
    const x = lerp(endX, SCENE.land.x + 16, landK)
    const y = lerp(tip.y - 2, SCENE.ledgeY, landK)
    traveler = { x, y, frame: p >= 0.76 ? 'lookback' : 'idle' }
  }

  // --- Contact ripples: tip touchdown + footfalls, all f(p) ---
  const contacts = []
  if (p >= 0.46 && p < 0.62) {
    contacts.push({ x: tip.x, y: SCENE.waterY + 6, s: seg(p, 0.46, 0.5) * (1 - seg(p, 0.56, 0.62)) })
  }
  if (p >= 0.55 && p < 0.72) {
    contacts.push({ x: traveler.x, y: SCENE.waterY + 8, s: 0.35 + 0.3 * Math.abs(Math.sin(gaitPhase)) })
  }

  return { p, cam, reed: { angle, tip, handle }, bridgeReady, helper, traveler, contacts, bird: SCENE.birdPerch }
}
