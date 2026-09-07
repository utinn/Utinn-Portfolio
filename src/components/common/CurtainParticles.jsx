/**
 * Local hover particles for a curtain (ANIMATION_SPEC.md 18.6, revised by the
 * owner's correction pass).
 *
 * Separate from the global BackgroundParticles layer: this field belongs to
 * one curtain.
 *
 * One component, two densities. CurtainSurface renders it twice per region:
 * a small ambient field that is always present, and — only while the curtain
 * is active — a second, much larger field that brings the total up to the
 * approved hover density. Both are the same field generator at different
 * counts; the counts themselves live in CurtainSurface.jsx.
 *
 * DEPARTURE from 18.6's "sparse, gently drifting" wording, on owner
 * instruction: the field is dense and clearly directional — every particle
 * travels outward toward the curtain's own screen edge (Game left, AI right).
 * What is kept from the spec: unhurried travel, staggered spawns, varied
 * size/speed/opacity, and a fade that completes before the drift does, so the
 * effect stays elegant rather than explosive and never accumulates.
 *
 * Refinement pass: dots are smaller and their stagger tighter. The large
 * stationary dots reported on hover were not produced here — they came from a
 * missing base opacity / fill-mode on `.curtain-particle` in curtains.css,
 * which left each particle painted at full glow throughout its start delay.
 *
 * Fields are generated once per (tone, count, outward) at module scope so
 * re-renders never reshuffle the dots mid-hover. Values are a provisional
 * visual approximation — nothing here is a measured design value.
 */
const TONE_COLORS = {
  game: ['#ffffff', '#ffffff', '#e2e8f0', '#cbd5e1'],
  ai: ['#ffffff', '#93c5fd', '#60a5fa', '#bfdbfe'],
}

function createField(tone, count, outward) {
  const colors = TONE_COLORS[tone] ?? TONE_COLORS.game
  const sign = outward === 'left' ? -1 : 1

  return Array.from({ length: count }, (_, i) => {
    // Spawn biased toward the curtain's inner half, so the field visibly
    // emerges from the region and sweeps out across it toward its own edge
    // rather than hovering in place near the rim.
    const acrossBias = Math.random() ** 0.8
    const across = outward === 'left' ? 100 - acrossBias * 78 : acrossBias * 78
    const top = 4 + Math.random() * 92

    return {
      key: `${tone}-${i}`,
      left: `${across.toFixed(1)}%`,
      top: `${top.toFixed(1)}%`,
      size: Number((1.1 + Math.random() * 1.9).toFixed(2)),
      // Outward travel dominates; the small vertical component fans away from
      // the midline so the field spreads instead of marching in parallel.
      x: Math.round(sign * (70 + Math.random() * 190)),
      y: Math.round((top - 50) * (0.4 + Math.random() * 0.7)),
      duration: Number((3.2 + Math.random() * 2.8).toFixed(2)),
      // Kept well under the shortest duration so the field stays populated
      // rather than leaving long gaps where a particle is simply not there.
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
