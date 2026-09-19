const ENABLE_PROJECT_TRANSITION_PARTICLES = false
const PARTICLE_COUNT = 260
const REDUCED_PARTICLE_COUNT = 26

const TONES = {
  game: {
    core: '#f4f7fb',
    mid: 'rgba(226, 232, 240, 0.92)',
    particles: ['#ffffff', '#ffffff', '#e2e8f0', '#cbd5e1'],
  },
  ai: {
    core: '#d8e8ff',
    mid: 'rgba(96, 165, 250, 0.94)',
    particles: ['#ffffff', '#bfdbfe', '#93c5fd', '#60a5fa'],
  },
}

function createField(tone, direction) {
  const sign = direction === 'left' ? -1 : 1
  const colors = TONES[tone].particles

  return Array.from({ length: PARTICLE_COUNT }, (_, i) => {
    const startY = Math.random() * 100
    const lead = Math.random() ** 1.4

    return {
      key: `${tone}-${direction}-${i}`,
      offsetX: Number((sign * lead * 34 + (Math.random() * 16 - 8)).toFixed(2)),
      top: `${startY.toFixed(1)}%`,
      size: Number((5 + Math.random() * 13).toFixed(1)),
      travelX: Number((sign * (58 + Math.random() * 76)).toFixed(1)),
      travelY: Number(((startY - 50) * (0.2 + Math.random() * 0.45)).toFixed(1)),
      duration: Math.round(280 + Math.random() * 220),
      delay: Math.round(Math.random() * 140),
      opacity: Number((0.65 + Math.random() * 0.35).toFixed(2)),
      color: colors[i % colors.length],
    }
  })
}

const FIELDS = new Map()

function getField(tone, direction) {
  const key = `${tone}:${direction}`
  if (!FIELDS.has(key)) FIELDS.set(key, createField(tone, direction))
  return FIELDS.get(key)
}

export default function TeleportOverlay({ teleport, isReduced, coverMs, revealMs, sweepDelayMs = 0 }) {
  if (!teleport || teleport.phase === 'charge') return null

  const tone = TONES[teleport.tone] ?? TONES.game
  const particles =
    ENABLE_PROJECT_TRANSITION_PARTICLES && teleport.phase === 'cover'
      ? getField(teleport.tone, teleport.sweepDirection).slice(0, isReduced ? REDUCED_PARTICLE_COUNT : PARTICLE_COUNT)
      : []

  return (
    <div
      aria-hidden="true"
      className="teleport"
      data-phase={teleport.phase}
      data-direction={teleport.sweepDirection}
      style={{
        '--teleport-core': tone.core,
        '--teleport-mid': tone.mid,
        '--teleport-sweep-delay': `${sweepDelayMs}ms`,
        '--teleport-sweep-ms': `${coverMs - sweepDelayMs}ms`,
        '--teleport-reveal-ms': `${revealMs}ms`,
      }}
    >
      <div className="teleport__sweep">
        <div className="teleport__sweep-fill" />
      </div>

      {particles.map((particle) => (
        <span
          key={particle.key}
          className="teleport-particle"
          style={{
            left: `calc(${teleport.originX} + ${particle.offsetX}vw)`,
            top: particle.top,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            '--particle-x': `${particle.travelX}vw`,
            '--particle-y': `${particle.travelY}vh`,
            '--particle-duration': `${particle.duration}ms`,
            '--particle-delay': `${particle.delay}ms`,
            '--particle-opacity': particle.opacity,
            '--particle-color': particle.color,
          }}
        />
      ))}
    </div>
  )
}
