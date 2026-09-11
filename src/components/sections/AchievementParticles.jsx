/**
 * Celebratory particle emission around the active achievement card
 * (ANIMATION_SPEC.md 21.4).
 *
 * Distinct from both the global background layer (BackgroundParticles) and
 * the Hero profile field: the origin here is a RECTANGLE (the certificate
 * card), so particles are seeded evenly along the card's perimeter and drift
 * outward along that edge's normal rather than radiating from a centre point.
 * They reuse the shared `hero-particle-drift` keyframes — only the dot's own
 * glow is stronger (`.ach-particle` in animations.css), which is the "slightly
 * more prominent than the Hero particles" the spec asks for.
 *
 * Computed once at module load so the field never reshuffles on re-render.
 * Values are a provisional visual tuning, not measured Figma values.
 */
const PARTICLE_COUNT = 34

/**
 * Maps t ∈ [0,1) onto the card's perimeter: quarter 0 = top edge, 1 = right,
 * 2 = bottom, 3 = left. Returns the seed point in 0..1 box coordinates plus
 * that edge's outward normal, which becomes the particle's drift direction.
 */
function perimeterPoint(t) {
  const p = t * 4
  if (p < 1) return { x: p, y: 0, nx: 0, ny: -1 }
  if (p < 2) return { x: 1, y: p - 1, nx: 1, ny: 0 }
  if (p < 3) return { x: 3 - p, y: 1, nx: 0, ny: 1 }
  return { x: 0, y: 4 - p, nx: -1, ny: 0 }
}

function createParticles() {
  return Array.from({ length: PARTICLE_COUNT }, (_, i) => {
    // Even spread around the perimeter with per-particle jitter, so coverage
    // stays complete without reading as a mechanical dotted outline.
    const { x, y, nx, ny } = perimeterPoint(((i + Math.random() * 0.9) / PARTICLE_COUNT) % 1)

    // Seed just outside the stroke, then drift further out along the normal
    // with a tangential wobble so the field fans out instead of marching.
    const seedOut = 1 + Math.random() * 4
    const travel = 16 + Math.random() * 54
    const wobble = (Math.random() - 0.5) * 34

    // A few deliberately brighter/larger specks (21.4 "occasional slightly
    // brighter particles") keep the field from looking uniform.
    const isBright = Math.random() < 0.18

    return {
      top: `calc(${y * 100}% + ${(ny * seedOut).toFixed(1)}px)`,
      left: `calc(${x * 100}% + ${(nx * seedOut).toFixed(1)}px)`,
      x: Math.round(nx * travel + ny * wobble),
      y: Math.round(ny * travel + nx * wobble),
      size: Number(((isBright ? 2.6 : 1.4) + Math.random() * 2).toFixed(2)),
      duration: Number((3.6 + Math.random() * 4.4).toFixed(2)),
      delay: Number((Math.random() * 5).toFixed(2)),
      opacity: Number(((isBright ? 0.7 : 0.4) + Math.random() * 0.3).toFixed(2)),
      color: Math.random() < 0.45 ? '#60a5fa' : '#ffffff',
    }
  })
}

const PARTICLES = createParticles()

export default function AchievementParticles() {
  return (
    <div aria-hidden="true" className="ach-particles pointer-events-none absolute inset-0">
      {PARTICLES.map((particle, index) => (
        <span
          key={index}
          className="ach-particle"
          style={{
            top: particle.top,
            left: particle.left,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            '--particle-x': `${particle.x}px`,
            '--particle-y': `${particle.y}px`,
            '--particle-duration': `${particle.duration}s`,
            '--particle-delay': `${particle.delay}s`,
            '--particle-opacity': particle.opacity,
            '--particle-color': particle.color,
          }}
        />
      ))}
    </div>
  )
}
