/**
 * The visible half of the teleport transition (owner correction pass, in place
 * of ANIMATION_SPEC.md 18.8's perspective rotation).
 *
 * Rendered once above the router outlet so a single element instance spans the
 * route change: the same sweep that starts on the departing page is still on
 * screen, mid-animation, when the destination mounts underneath it.
 *
 * Second correction pass: no bloom, no flash-ball. A dense field of luminous
 * particles surges out of the activated curtain and streams across the whole
 * viewport, with the sweep band travelling behind it in the same direction.
 * Cover fills the screen; reveal keeps going the same way and clears off the
 * far edge, uncovering the destination progressively — and the destination's
 * own return curtain already sits at that far edge, so what the sweep leaves
 * behind is exactly that thin gradient.
 *
 * PARTICLE COUNT lives here (PARTICLE_COUNT / REDUCED_PARTICLE_COUNT).
 * SWEEP DIRECTION comes from the curtain data (src/data/projectCurtains.js).
 * PHASE TIMING comes from TeleportProvider.jsx.
 * Nothing here is a measured design value.
 *
 * TEMPORARY A/B TOGGLE (owner request, 2026-09-07): set this to `true` to
 * restore the screen-filling particle field during the cover phase. Setting
 * it to `false` does NOT delete or rewrite the particle system below — it
 * only skips populating `particles`, so the sweep band, curtain gradients,
 * and phase timing are unaffected. Flip it back to re-enable.
 */
const ENABLE_PROJECT_TRANSITION_PARTICLES = false
const PARTICLE_COUNT = 260
const REDUCED_PARTICLE_COUNT = 26

/** Bright, but tone-separated: near-white for Game, blue-white for AI. */
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
    // A staggered start band rather than a single point: particles that begin
    // further along the travel axis arrive earlier, which is what makes the
    // field read as spreading and multiplying instead of marching as one wall.
    const lead = Math.random() ** 1.4

    return {
      key: `${tone}-${direction}-${i}`,
      // Offsets are relative to the origin the CSS variable supplies, so the
      // whole field re-anchors to whichever curtain was activated.
      offsetX: Number((sign * lead * 34 + (Math.random() * 16 - 8)).toFixed(2)),
      top: `${startY.toFixed(1)}%`,
      // The visible core is ~26% of the box (the rest is glow falloff), so the
      // box is much larger than the dot it draws.
      size: Number((5 + Math.random() * 13).toFixed(1)),
      // Long enough to carry the field clear across the viewport.
      travelX: Number((sign * (58 + Math.random() * 76)).toFixed(1)),
      // Fans away from the midline so the sweep spreads vertically as it goes.
      travelY: Number(((startY - 50) * (0.2 + Math.random() * 0.45)).toFixed(1)),
      // delay + duration is capped at the cover phase length, so no particle
      // is ever cut off mid-flight when the phase flips to reveal.
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
  // The charge phase belongs to the curtain alone — the overlay stays out of
  // the way until the surge actually begins.
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
