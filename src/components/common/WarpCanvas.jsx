import { useEffect, useRef } from 'react'
import { WARP_START, TOTAL_MS, speedAt, coverAt, bloomAt, canvasOpacityAt } from '../../motion/pageWarp'

/* ---------- Field tuning ----------
   The reference's field: many small blue-white points that become radial
   streaks — shortest at the vanishing point, longest and brightest at the
   edges — with a dark tunnel mouth at the centre and bloom at the rim. */
const PARTICLES_PER_PX = 1 / 1150 // 1440x900 -> ~1100 particles
const PARTICLE_MIN = 420
const PARTICLE_MAX = 1400
const Z_NEAR = 0.06 // respawn threshold (the particle has flown past us)
const SPREAD = 1.35 // field extent at z=1, in half-viewports (>1 keeps edges dense)
const FLY_SPEED = 1.7 // z units per second at full speed
const TAIL = 0.2 // streak tail, in z units at full speed (length ∝ speed)
/* Streak weight (correction pass: "fast thin light trails, not glowing
   bars"). Core width is size × (CORE_BASE + depth × CORE_DEPTH), barely
   widened by speed; the halo is a faint wider pass on the near streaks. */
const CORE_BASE = 0.45
const CORE_DEPTH = 0.85
const CORE_SPEED_GAIN = 0.2
const HALO_SCALE = 2.4
const HALO_ALPHA = 0.18
const MAX_DPR = 1.5
const TINTS = [
  [255, 255, 255],
  [239, 246, 255],
  [219, 234, 254],
  [191, 219, 254],
  [147, 197, 253],
]
const BACKGROUND = [8, 11, 18] // site background, so cover reads as "space"

function createField(count, rand) {
  const field = new Array(count)
  for (let i = 0; i < count; i += 1) field[i] = spawn({}, rand, true)
  return field
}

function spawn(p, rand, initial) {
  p.x = (rand() * 2 - 1) * SPREAD
  p.y = (rand() * 2 - 1) * SPREAD
  // Fresh spawns start far away; the initial field fills the whole depth so
  // there is no empty band when the warp engages.
  p.z = initial ? Z_NEAR + rand() * (1 - Z_NEAR) : 0.85 + rand() * 0.15
  p.size = 0.5 + rand() ** 2 * 1.4
  p.tint = TINTS[Math.floor(rand() * TINTS.length)]
  p.twinkle = rand() * Math.PI * 2
  return p
}

function mulberry32(seed) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/**
 * Full-viewport Canvas 2D renderer for the global page warp (owner spec,
 * reproduced natively from docs/page_animation_frames/ — no reference asset
 * is used). Mounted by PageWarpProvider only while a transition runs, and it
 * tears its rAF loop down on unmount, so nothing renders between
 * navigations.
 *
 * Model: a 3D point field flown through along z. Each particle is projected
 * with a pinhole (screen = vanishing point + xy / z), so displacement per
 * frame — and therefore streak length — grows with 1/z and with distance
 * from the vanishing point, which is exactly the reference's geometry:
 * dots at the tunnel mouth, long streaks at the rim. The streak tail is
 * the particle's own position a moment ago (z + speed·TAIL), so tails are
 * radial by construction and collapse to dots the instant speed drops —
 * the reference's hard exit.
 *
 * The vanishing point is ALWAYS the viewport centre (owner correction pass):
 * every route transition, in either direction, uses this one geometry.
 *
 * Layering: the canvas sits above page content but BELOW the sticky Navbar,
 * so the Navbar stays visible and readable through the whole warp (its
 * translucent, blurred panel shows the streaks passing behind it).
 */
export default function WarpCanvas({ startedAt }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined
    const ctx = canvas.getContext('2d', { alpha: true })
    const rand = mulberry32(2026)
    let field = []
    let width = 0
    let height = 0
    let dpr = 1
    let frame = 0
    let last = performance.now()

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR)
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const count = Math.round(Math.min(PARTICLE_MAX, Math.max(PARTICLE_MIN, width * height * PARTICLES_PER_PX)))
      if (field.length !== count) field = createField(count, rand)
    }
    resize()
    window.addEventListener('resize', resize)

    const draw = (nowMs) => {
      const dt = Math.min((nowMs - last) / 1000, 1 / 30)
      last = nowMs
      const t = nowMs - startedAt
      const tw = t - WARP_START // time inside the warp (negative during engage)

      const speed = speedAt(tw)
      const cover = coverAt(tw)
      const bloom = bloomAt(tw)
      canvas.style.opacity = canvasOpacityAt(t).toFixed(3)

      const cx = width / 2
      const cy = height / 2
      const fx = width / 2
      const fy = height / 2

      ctx.globalCompositeOperation = 'source-over'
      ctx.clearRect(0, 0, width, height)
      if (cover > 0) {
        ctx.fillStyle = `rgba(${BACKGROUND[0]}, ${BACKGROUND[1]}, ${BACKGROUND[2]}, ${cover})`
        ctx.fillRect(0, 0, width, height)
      }

      // Streaks are additive so overlapping rim streaks bloom like the
      // reference instead of stacking as opaque lines.
      ctx.globalCompositeOperation = 'lighter'
      ctx.lineCap = 'round'

      const dz = speed * FLY_SPEED * dt
      const tail = speed * TAIL

      for (let i = 0; i < field.length; i += 1) {
        const p = field[i]
        p.z -= dz
        if (p.z <= Z_NEAR) spawn(p, rand, false)

        const invZ = 1 / p.z
        const sx = cx + p.x * fx * invZ
        const sy = cy + p.y * fy * invZ
        const zTail = Math.min(1, p.z + tail)
        const invTail = 1 / zTail
        const tx = cx + p.x * fx * invTail
        const ty = cy + p.y * fy * invTail

        // Cull anything fully off-screen (both ends).
        if ((sx < -40 && tx < -40) || (sx > width + 40 && tx > width + 40)) continue
        if ((sy < -40 && ty < -40) || (sy > height + 40 && ty > height + 40)) continue

        const depth = 1 - p.z // 0 far .. 1 near
        const twinkle = 0.85 + 0.15 * Math.sin(nowMs * 0.006 + p.twinkle)
        const alpha = Math.min(1, (0.22 + depth * 1.0) * twinkle) * (0.55 + 0.45 * Math.min(1, speed + 0.3))
        const lineWidth = p.size * (CORE_BASE + depth * CORE_DEPTH) * (1 + speed * CORE_SPEED_GAIN)
        const [r, g, b] = p.tint

        // Faint halo pass on the nearer (brighter, longer) streaks, then the
        // thin bright core for everything. Far dots get no halo — cheaper,
        // and it keeps the tunnel mouth crisp like the reference.
        if (depth > 0.3) {
          ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${(alpha * HALO_ALPHA).toFixed(3)})`
          ctx.lineWidth = lineWidth * HALO_SCALE
          ctx.beginPath()
          ctx.moveTo(tx, ty)
          ctx.lineTo(sx, sy)
          ctx.stroke()
        }

        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(3)})`
        ctx.lineWidth = lineWidth
        ctx.beginPath()
        ctx.moveTo(tx, ty)
        ctx.lineTo(sx, sy)
        ctx.stroke()
      }

      // Rim bloom (the reference's edge white-out): bright at the rim, clear
      // at the tunnel mouth. Follows speed².
      if (bloom > 0.02) {
        const inner = Math.min(width, height) * 0.14
        const outer = Math.hypot(width, height) * 0.5
        const grad = ctx.createRadialGradient(cx, cy, inner, cx, cy, outer)
        grad.addColorStop(0, 'rgba(219, 234, 254, 0)')
        grad.addColorStop(0.5, `rgba(219, 234, 254, ${(bloom * 0.26).toFixed(3)})`)
        grad.addColorStop(1, `rgba(239, 246, 255, ${(bloom * 0.7).toFixed(3)})`)
        ctx.fillStyle = grad
        ctx.fillRect(0, 0, width, height)
      }

      if (t < TOTAL_MS) frame = requestAnimationFrame(draw)
    }

    frame = requestAnimationFrame(draw)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', resize)
    }
  }, [startedAt])

  return <canvas ref={canvasRef} aria-hidden="true" className="page-warp-canvas" />
}
