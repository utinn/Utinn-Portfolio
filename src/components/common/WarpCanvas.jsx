import { useEffect, useRef } from 'react'
import { WARP_START, TOTAL_MS, speedAt, coverAt, bloomAt, canvasOpacityAt } from '../../motion/pageWarp'

const PARTICLES_PER_PX = 1 / 1150
const PARTICLE_MIN = 420
const PARTICLE_MAX = 1400
const Z_NEAR = 0.06
const SPREAD = 1.35
const FLY_SPEED = 1.7
const TAIL = 0.2
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
const BACKGROUND = [8, 11, 18]

function createField(count, rand) {
  const field = new Array(count)
  for (let i = 0; i < count; i += 1) field[i] = spawn({}, rand, true)
  return field
}

function spawn(p, rand, initial) {
  p.x = (rand() * 2 - 1) * SPREAD
  p.y = (rand() * 2 - 1) * SPREAD
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

export default function WarpCanvas({ clock }) {
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
      const t = clock.elapsed(nowMs)
      const tw = t - WARP_START

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

        if ((sx < -40 && tx < -40) || (sx > width + 40 && tx > width + 40)) continue
        if ((sy < -40 && ty < -40) || (sy > height + 40 && ty > height + 40)) continue

        const depth = 1 - p.z
        const twinkle = 0.85 + 0.15 * Math.sin(nowMs * 0.006 + p.twinkle)
        const alpha = Math.min(1, (0.22 + depth * 1.0) * twinkle) * (0.55 + 0.45 * Math.min(1, speed + 0.3))
        const lineWidth = p.size * (CORE_BASE + depth * CORE_DEPTH) * (1 + speed * CORE_SPEED_GAIN)
        const [r, g, b] = p.tint

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
  }, [clock])

  return <canvas ref={canvasRef} aria-hidden="true" className="page-warp-canvas" />
}
