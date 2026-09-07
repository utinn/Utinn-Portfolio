import Button from '../common/Button'
import Label from '../common/Label'
import PageContainer from '../layout/PageContainer'
import heroProfilePicture from '../../assets/images/home/hero/ProfilePicture.png'

/**
 * Hero profile-local particle emission (ANIMATION_SPEC.md Section 10.8).
 * This is a SEPARATE field from the global background particle layer
 * (BackgroundParticles) — it exists only inside the profile circle's own
 * wrapper, is generated independently, and every particle's origin/drift is
 * anchored to this circle's own edge, not to the page.
 *
 * Distribution: 56 particles across evenly-spaced angular sectors so
 * coverage stays full around the circumference and the nearby surrounding
 * area, each with a randomized jitter/radius/size/opacity/speed/color so the
 * result reads as organic and asymmetrical rather than a mechanical ring.
 * Each drifts outward along its own angle (radiating from the profile),
 * fades out, then the infinite CSS loop repeats it — a continuous, seamless
 * respawn rather than a one-shot burst. Each dot also carries its own glow
 * (`.hero-particle`'s box-shadow in animations.css) so this field reads as
 * visibly more luminous than the flat global background particles. Computed
 * once at module load (not per-render) so it doesn't reshuffle on re-render.
 * Values are a provisional visual approximation, not measured Figma values.
 */
const HERO_PARTICLE_COUNT = 56

function createHeroParticles() {
  const sectorAngle = (Math.PI * 2) / HERO_PARTICLE_COUNT

  return Array.from({ length: HERO_PARTICLE_COUNT }, (_, i) => {
    const jitter = (Math.random() - 0.5) * sectorAngle * 0.85
    const angle = i * sectorAngle + jitter
    const cos = Math.cos(angle)
    const sin = Math.sin(angle)
    // Origin band spans from just inside the visible edge out through the
    // nearby surrounding area (not just a thin ring right on the edge).
    const originRadiusPercent = 42 + Math.random() * 38
    const travelDistance = 14 + Math.random() * 50
    const size = 1.4 + Math.random() * 2.8
    const duration = 4 + Math.random() * 5
    const delay = Math.random() * 5.5
    const opacity = 0.4 + Math.random() * 0.55
    const color = Math.random() < 0.4 ? '#60a5fa' : '#ffffff'

    return {
      top: `${50 + sin * originRadiusPercent}%`,
      left: `${50 + cos * originRadiusPercent}%`,
      x: Math.round(cos * travelDistance),
      y: Math.round(sin * travelDistance),
      size: Number(size.toFixed(2)),
      duration: Number(duration.toFixed(2)),
      delay: Number(delay.toFixed(2)),
      opacity: Number(opacity.toFixed(2)),
      color,
    }
  })
}

const HERO_PARTICLES = createHeroParticles()

/**
 * Home Hero (CLAUDE.md Section 9). Content transcribed verbatim from the
 * approved Figma reference (docs/figma-reference/home/Home_Hero.png) — not
 * fabricated. Staged entrance per ANIMATION_SPEC.md Section 10; CTA
 * destinations per INTERACTION_SPEC.md 8.1/8.2. The Hero is the explicit
 * exception to Home's scroll-reveal behavior — it is visible immediately.
 */
export default function Hero() {
  return (
    <section aria-label="Hero">
      {/* Top/bottom padding shifted (not just increased) so the composition
          sits closer to vertical center in the first viewport without
          adding much extra section height. */}
      <PageContainer className="pt-12 pb-16 md:pt-20 md:pb-24">
        <div className="flex flex-col items-center gap-14 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
          <div className="max-w-xl text-center lg:text-left">
            <h1 className="hero-fade-up hero-delay-0 text-display font-sans font-bold text-foreground">
              Justin Christian Woeryadi
            </h1>

            <div className="hero-fade-up hero-delay-1 mt-6 flex flex-wrap justify-center gap-3 lg:justify-start">
              <Label size="md">AI Engineer</Label>
              <Label size="md">Mentor</Label>
            </div>

            <p className="hero-fade-up hero-delay-2 text-justify mt-6 text-body text-muted">
              An undergraduate AI student at BINUS who builds AI-powered solutions, mainly in Computer Vision and
              enjoys exploring organizations, roles, as well as new opportunities.
            </p>

            <div className="hero-fade-up hero-delay-3 mt-8 flex flex-wrap justify-center gap-4 lg:justify-start">
              {/* Both CTAs share the same outline variant — the Figma
                  reference shows no filled/outlined distinction between
                  them. */}
              <Button href="/projects" variant="outline">
                View Projects
              </Button>
              <Button href="/contact" variant="outline">
                Contact Me
              </Button>
            </div>
          </div>

          <div className="hero-profile-in hero-delay-4 relative flex h-64 w-64 shrink-0 items-center justify-center sm:h-80 sm:w-80 lg:h-[21rem] lg:w-[21rem]">
            {/* Soft outward diffusion — a SEPARATE element (not the photo
                itself) sized exactly to the circle, so its box-shadow glow
                is anchored to this circle's own real edge and reliably
                extends outward from there (a radial-gradient box tuned by
                inset/fade-% previously faded to transparent BEFORE reaching
                the edge, so it rendered fully hidden behind the opaque
                photo — box-shadow can't have that failure mode). Breathes
                per ANIMATION_SPEC.md 10.7; kept moderate so it stays a soft
                bloom rather than an oversized halo. */}
            <div
              className="hero-profile-glow pointer-events-none absolute inset-0 rounded-full"
              style={{ boxShadow: '0 0 46px 12px rgba(96,165,250,0.5)' }}
              aria-hidden="true"
            />

            {/* Border + concentrated edge glow, both anchored to the photo's
                real edge via box-shadow: a thin white ring (supports the
                portrait, not a visual element on its own) plus a brighter,
                tighter glow layer that stays constant while the diffusion
                layer above breathes — this is the strongest, most visible
                glow, right at the circle. */}
            <img
              src={heroProfilePicture}
              alt="Justin Christian Woeryadi"
              className="relative h-full w-full rounded-full object-cover shadow-[0_0_0_1.5px_rgba(255,255,255,0.55),0_0_24px_7px_rgba(147,197,253,0.8)]"
            />

            {/* Particle field sized exactly to the circle (not enlarged) so
                each particle's top/left percentage maps 1:1 to the visible
                photo edge; the container has no overflow-hidden, so the
                outward drift is free to render beyond it. Rendered after
                the img so particles starting near/just inside the edge
                stay visible instead of painting underneath the photo. */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0">
              {HERO_PARTICLES.map((particle, index) => (
                <span
                  key={index}
                  className="hero-particle"
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
          </div>
        </div>
      </PageContainer>
    </section>
  )
}
