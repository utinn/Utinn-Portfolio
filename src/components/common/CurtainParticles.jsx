const TONE_COLORS = {
  game: ['#ffffff', '#ffffff', '#e2e8f0', '#cbd5e1'],
  ai: ['#ffffff', '#93c5fd', '#60a5fa', '#bfdbfe'],
}

function createField(tone, count, outward) {
  const colors = TONE_COLORS[tone] ?? TONE_COLORS.game
  const sign = outward === 'left' ? -1 : 1

  return Array.from({ length: count }, (_, i) => {
    const acrossBias = Math.random() ** 0.8
    const across = outward === 'left' ? 100 - acrossBias * 78 : acrossBias * 78
    const top = 4 + Math.random() * 92

    return {
      key: `${tone}-${i}`,
      left: `${across.toFixed(1)}%`,
      top: `${top.toFixed(1)}%`,
      size: Number((1.1 + Math.random() * 1.9).toFixed(2)),
      x: Math.round(sign * (70 + Math.random() * 190)),
      y: Math.round((top - 50) * (0.4 + Math.random() * 0.7)),
      duration: Number((3.2 + Math.random() * 2.8).toFixed(2)),
      delay: Number((Math.random() * 2.4).toFixed(2)),
      opacity: Number((0.4 + Math.random() * 0.5).toFixed(2)),
      color: colors[i % colors.length],
    }
  })
}

const FIELDS = new Map()

function getField(tone, count, outward) {
  const key = `${tone}:${count}:${outward}`
  if (!FIELDS.has(key)) FIELDS.set(key, createField(tone, count, outward))
  return FIELDS.get(key)
}

export default function CurtainParticles({ tone, count, outward, isVisible }) {
  return (
    <span aria-hidden="true" className="curtain__particles" data-visible={isVisible ? '' : undefined}>
      {getField(tone, count, outward).map((particle) => (
        <span
          key={particle.key}
          className="curtain-particle"
          style={{
            left: particle.left,
            top: particle.top,
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
    </span>
  )
}
