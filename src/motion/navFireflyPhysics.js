/**
 * ============================================================================
 * NAVBAR FIREFLY MOTION — the one place to tune the active-route particles.
 * ============================================================================
 *
 * Owner motion-polish pass: the fireflies are no longer CSS keyframes riding
 * inside the sliding indicator (which moved them as one rigid group with one
 * easing). Each firefly is now its own tiny damped spring chasing a target
 * point, integrated per frame in NavFireflies.jsx. This file holds the
 * tuning, the per-particle trait generator, and the pure `step()` integrator
 * so the maths can be exercised outside the browser.
 *
 * Units: px, seconds. All ranges are [min, max]; each firefly rolls its own
 * value once, at creation, so variation is stable and never re-randomised.
 */
export const NAV_FIREFLIES = {
  /** How many fireflies orbit the active item. */
  count: 9,

  /* ---------- Resting cloud (where they settle around the label) ----------
     Each firefly owns a fixed offset from the active item's centre, drawn on a
     loose ellipse that follows the label's own proportions, so the cloud
     surrounds the text rather than sitting on it. `padX` extends the ellipse
     past the label box sideways (kept small so neighbouring labels stay
     clear); `overflowY` extends it past the box vertically, which is where
     there is only the navbar edge to cross. `radius` is how far along that
     ellipse a firefly may rest (1 = the rim). */
  padX: 4,
  overflowY: 12,
  radius: [0.45, 1],

  /* ---------- Ambient drift (idle motion once settled) ----------
     Two incommensurate sines per axis give irregular arcs instead of ellipses.
     The SAME amplitude is used on both axes — the owner's "horizontal ≈
     vertical" requirement — so the cloud breathes evenly in 2D. */
  driftPx: [6, 9],
  driftHz: [0.07, 0.19],

  /* ---------- Chase (route change) ----------
     Each firefly is a damped spring: acceleration toward its target scaled by
     `stiffness`, velocity bled by `damping` (exponential, frame-rate safe).
     The two caps are what shape the "creature" feel:
       maxAccel  limits how hard it can push off, so a chase always BEGINS
                 slower and visibly winds up (a raw spring over 700px would
                 hit top speed on the first frame).
       maxSpeed  the cruise ceiling on long jumps (Home -> Contact).
     `settleRadius` is where the chase hands over to the orbit: inside it the
     damping rises to `settleDamping`, so arrival decelerates and the small
     overshoot dies within a couple of oscillations instead of ringing. */
  stiffness: [55, 75],
  damping: [2.2, 3.0],
  settleDamping: [12, 15],
  settleRadius: 80,
  maxAccel: [2600, 4200],
  maxSpeed: [880, 1250],

  /** Reaction lag before a firefly "notices" the new target, seconds. */
  reaction: [0, 0.24],

  /* ---------- Look ---------- */
  sizePx: [2, 3.4],
  /** Per-firefly halo multiplier (read by animations.css as --ff-glow). */
  glow: [0.8, 1.3],
  /** Opacity shimmer range and per-cycle duration (CSS keyframe, seconds). */
  opacity: [0.3, 1],
  shimmerSec: [2.6, 4.8],

  /** Reduced motion: no springs, no drift — just a short CSS ease to the offset. */
  reducedMotionMs: 300,
}

/* Blue-white palette, weighted toward the pale end: white-hot cores with blue
   haloes rather than a flat blue smear. */
const COLORS = ['#ffffff', '#ffffff', '#eff6ff', '#dbeafe', '#bfdbfe', '#93c5fd', '#60a5fa']

/* Small seeded PRNG (mulberry32): identical cloud on every mount, no
   Math.random() in render. */
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

/**
 * Rolls every firefly's fixed traits. Rest offsets are drawn evenly around
 * the full circle (angle uniform, radius in `radius`) so left/right/above/
 * below/diagonal are all represented, then stretched to the label's aspect
 * at step time — asymmetric and organic, but balanced.
 */
export function createFireflies(seed, config = NAV_FIREFLIES) {
  const rand = mulberry32(seed)
  return Array.from({ length: config.count }, (_, i) => {
    const angle = rand() * Math.PI * 2
    const r = between(rand, config.radius)
    return {
      key: i,
      // Rest offset as unit-ellipse coordinates; scaled by the live label
      // size in step(), so the cloud follows each item's width.
      ux: Math.cos(angle) * r,
      uy: Math.sin(angle) * r,
      // Ambient drift: same amplitude both axes, four independent sines.
      drift: between(rand, config.driftPx),
      f1: between(rand, config.driftHz) * Math.PI * 2,
      f2: between(rand, config.driftHz) * Math.PI * 2,
      f3: between(rand, config.driftHz) * Math.PI * 2,
      f4: between(rand, config.driftHz) * Math.PI * 2,
      p1: rand() * Math.PI * 2,
      p2: rand() * Math.PI * 2,
      p3: rand() * Math.PI * 2,
      p4: rand() * Math.PI * 2,
      // Chase character.
      stiffness: between(rand, config.stiffness),
      damping: between(rand, config.damping),
      settleDamping: between(rand, config.settleDamping),
      maxAccel: between(rand, config.maxAccel),
      maxSpeed: between(rand, config.maxSpeed),
      reaction: between(rand, config.reaction),
      // Look.
      size: between(rand, config.sizePx),
      color: COLORS[Math.floor(rand() * COLORS.length)],
      glow: between(rand, config.glow),
      opacityMax: config.opacity[1] - rand() * 0.2,
      shimmerSec: between(rand, config.shimmerSec),
      shimmerDelay: -rand() * 4,
      // Live state (mutated by step()).
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

/**
 * Where a firefly wants to be right now: the active item's centre plus its
 * own rest offset (stretched to the label's aspect) plus ambient drift.
 */
export function desiredPoint(p, target, t, config = NAV_FIREFLIES) {
  const rx = target.w / 2 + config.padX
  const ry = target.h / 2 + config.overflowY
  const dx = p.drift * (Math.sin(t * p.f1 + p.p1) * 0.65 + Math.sin(t * p.f2 + p.p2) * 0.35)
  const dy = p.drift * (Math.cos(t * p.f3 + p.p3) * 0.65 + Math.sin(t * p.f4 + p.p4) * 0.35)
  return { x: target.x + p.ux * rx + dx, y: target.y + p.uy * ry + dy }
}

/**
 * Hands a firefly a new target. It keeps chasing its previous one until its
 * own reaction lag elapses, which is what staggers departures.
 */
export function retarget(p, target, now, config = NAV_FIREFLIES) {
  if (!p.placed) {
    // First placement: materialise in the cloud, no chase from (0,0).
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

/**
 * Advances one firefly by `dt` seconds. Pure integrator — mutates `p` only.
 *
 *   v += clamp(k * (desired - pos), maxAccel) * dt
 *   v  = clamp(v, maxSpeed)
 *   v *= exp(-damping * dt)          (damping rises inside settleRadius)
 *   pos += v * dt
 */
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
