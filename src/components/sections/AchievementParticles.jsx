const PARTICLE_COUNT = 34

function perimeterPoint(t) {
  const p = t * 4
  if (p < 1) return { x: p, y: 0, nx: 0, ny: -1 }
  if (p < 2) return { x: 1, y: p - 1, nx: 1, ny: 0 }
  if (p < 3) return { x: 3 - p, y: 1, nx: 0, ny: 1 }
  return { x: 0, y: 4 - p, nx: -1, ny: 0 }
}

function createParticles() {
  return Array.from({ length: PARTICLE_COUNT }, (_, i) => {
    const { x, y, nx, ny } = perimeterPoint(((i + Math.random() * 0.9) / PARTICLE_COUNT) % 1)

    const seedOut = 1 + Math.random() * 4
    const travel = 16 + Math.random() * 54
    const wobble = (Math.random() - 0.5) * 34

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
