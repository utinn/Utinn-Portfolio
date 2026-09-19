export const NAV_FIREFLIES = {
  count: 9,

  padX: 4,
  overflowY: 12,
  radius: [0.45, 1],

  driftPx: [6, 9],
  driftHz: [0.07, 0.19],

  stiffness: [55, 75],
  damping: [2.2, 3.0],
  settleDamping: [12, 15],
  settleRadius: 80,
  maxAccel: [2600, 4200],
  maxSpeed: [880, 1250],

  reaction: [0, 0.24],

  sizePx: [2, 3.4],
  glow: [0.8, 1.3],
  opacity: [0.3, 1],
  shimmerSec: [2.6, 4.8],

  reducedMotionMs: 300,
}

export const CV_FIREFLIES = {
  ...NAV_FIREFLIES,
  count: 4,
  padX: 3,
  overflowY: 6,
  driftPx: [3, 5],
  sizePx: [1.6, 2.6],
  glow: [0.6, 0.9],
  opacity: [0.25, 0.85],
}

const COLORS = ['#ffffff', '#ffffff', '#eff6ff', '#dbeafe', '#bfdbfe', '#93c5fd', '#60a5fa']

export function mulberry32(seed) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const between = (rand, [min, max]) => min + rand() * (max - min)

export function createFireflies(seed, config = NAV_FIREFLIES) {
  const rand = mulberry32(seed)
  return Array.from({ length: config.count }, (_, i) => {
    const angle = rand() * Math.PI * 2
    const r = between(rand, config.radius)
    return {
      key: i,
      ux: Math.cos(angle) * r,
      uy: Math.sin(angle) * r,
      drift: between(rand, config.driftPx),
      f1: between(rand, config.driftHz) * Math.PI * 2,
      f2: between(rand, config.driftHz) * Math.PI * 2,
      f3: between(rand, config.driftHz) * Math.PI * 2,
      f4: between(rand, config.driftHz) * Math.PI * 2,
      p1: rand() * Math.PI * 2,
      p2: rand() * Math.PI * 2,
      p3: rand() * Math.PI * 2,
      p4: rand() * Math.PI * 2,
      stiffness: between(rand, config.stiffness),
      damping: between(rand, config.damping),
      settleDamping: between(rand, config.settleDamping),
      maxAccel: between(rand, config.maxAccel),
      maxSpeed: between(rand, config.maxSpeed),
      reaction: between(rand, config.reaction),
      size: between(rand, config.sizePx),
      color: COLORS[Math.floor(rand() * COLORS.length)],
      glow: between(rand, config.glow),
      opacityMax: config.opacity[1] - rand() * 0.2,
      shimmerSec: between(rand, config.shimmerSec),
      shimmerDelay: -rand() * 4,
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      target: null,
      pendingTarget: null,
      noticeAt: 0,
      placed: false,
    }
  })
}

export function desiredPoint(p, target, t, config = NAV_FIREFLIES) {
  const rx = target.w / 2 + config.padX
  const ry = target.h / 2 + config.overflowY
  const dx = p.drift * (Math.sin(t * p.f1 + p.p1) * 0.65 + Math.sin(t * p.f2 + p.p2) * 0.35)
  const dy = p.drift * (Math.cos(t * p.f3 + p.p3) * 0.65 + Math.sin(t * p.f4 + p.p4) * 0.35)
  return { x: target.x + p.ux * rx + dx, y: target.y + p.uy * ry + dy }
}

export function retarget(p, target, now, config = NAV_FIREFLIES) {
  if (!p.placed) {
    p.target = target
    const want = desiredPoint(p, target, now, config)
    p.x = want.x
    p.y = want.y
    p.placed = true
    return
  }
  p.pendingTarget = target
  p.noticeAt = now + p.reaction
}

export function step(p, now, dt, config = NAV_FIREFLIES) {
  if (p.pendingTarget && now >= p.noticeAt) {
    p.target = p.pendingTarget
    p.pendingTarget = null
  }
  if (!p.target) return

  const want = desiredPoint(p, p.target, now, config)
  const dx = want.x - p.x
  const dy = want.y - p.y
  const dist = Math.hypot(dx, dy)

  let ax = dx * p.stiffness
  let ay = dy * p.stiffness
  const accel = Math.hypot(ax, ay)
  if (accel > p.maxAccel) {
    ax *= p.maxAccel / accel
    ay *= p.maxAccel / accel
  }

  p.vx += ax * dt
  p.vy += ay * dt

  const speed = Math.hypot(p.vx, p.vy)
  if (speed > p.maxSpeed) {
    p.vx *= p.maxSpeed / speed
    p.vy *= p.maxSpeed / speed
  }

  const damping = dist < config.settleRadius ? p.settleDamping : p.damping
  const decay = Math.exp(-damping * dt)
  p.vx *= decay
  p.vy *= decay

  p.x += p.vx * dt
  p.y += p.vy * dt
}
