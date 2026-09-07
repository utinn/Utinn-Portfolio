import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import CurtainParticles from './CurtainParticles'

/** Matches the .curtain__particles opacity transition in curtains.css. */
const PARTICLE_FADE_OUT_MS = 340

/* IDLE AMBIENT DENSITY — configured here, for every curtain region on the site.
   `particleCount` (per region, in data/projectCurtains.js) stays THE approved
   hover density and is unchanged; the idle field is derived from it so the two
   can never drift apart.

   The floor exists for the return curtains: they hover at only 36, and a
   straight tenth leaves 3-4 dots on a full-height band, which reads as the
   occasional stray dot rather than an ambient field. */
const IDLE_PARTICLE_RATIO = 0.1
const MIN_IDLE_PARTICLES = 6

/**
 * One curtain surface — the shared primitive behind both the Projects landing
 * curtains and the category return curtains (ANIMATION_SPEC.md Section 18,
 * INTERACTION_SPEC.md Sections 13-16).
 *
 * It renders a real router <Link>, so the whole surface is the interactive
 * target, the destination is a genuine href (middle-click / "open in new tab"
 * keep working), and keyboard activation comes for free. Only an unmodified
 * primary click is intercepted, to run the dimensional transition before
 * navigating.
 *
 * Hover state is set from pointer events filtered to `mouse`, so a tap on a
 * touch device never leaves a curtain stuck in its hover pose and never
 * becomes a prerequisite first tap (INTERACTION_SPEC.md Section 16). Focus
 * raises the same state, so keyboard users get the same affordance.
 *
 * `particleDirection` is required and is NOT defaulted from `edge`. It used to
 * be, and that was the direction bug: `edge` says which screen edge the
 * gradient sits against, which is not the same thing as which way the category
 * emits. Callers pass CATEGORY_DIRECTION (see data/projectCurtains.js).
 */
export default function CurtainSurface({
  to,
  tone,
  edge,
  arrowDirection,
  particleDirection,
  ariaLabel,
  isQuiet = false,
  isCharging = false,
  isLocked = false,
  particleCount = 16,
  onActivate,
  onActiveChange,
  className = '',
  children,
}) {
  const prefersReducedMotion = usePrefersReducedMotion()
  const [isActive, setIsActive] = useState(false)
  const [hasParticles, setHasParticles] = useState(false)

  /* Two fields of the SAME component rather than one field that changes size.
     The idle field is never rebuilt, so hovering only ADDS dots — the ambient
     ones keep drifting through the change instead of being re-keyed and
     restarted, which is what keeps the density shift from reading as a pop.
     Together they come to exactly `particleCount`, so the approved maximum
     hover density is unchanged. */
  const idleParticleCount = Math.max(MIN_IDLE_PARTICLES, Math.round(particleCount * IDLE_PARTICLE_RATIO))
  const hoverBoostCount = particleCount - idleParticleCount

  // The boost field mounts from the activating event itself; the effect below
  // owns only its delayed unmount, so existing dots fade naturally instead of
  // vanishing and no hover-scale animation loop is left running on an idle
  // curtain. The idle field is exempt — it is always mounted, by definition.
  const setActive = useCallback(
    (active) => {
      setIsActive(active)
      if (active) setHasParticles(true)
      onActiveChange?.(active)
    },
    [onActiveChange],
  )

  useEffect(() => {
    if (isActive || !hasParticles) return
    const timer = setTimeout(() => setHasParticles(false), PARTICLE_FADE_OUT_MS)
    return () => clearTimeout(timer)
  }, [isActive, hasParticles])

  const handleClick = (event) => {
    // Let the browser own modified clicks (new tab / new window).
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return

    event.preventDefault()
    if (isLocked) return
    onActivate()
  }

  return (
    <Link
      to={to}
      aria-label={ariaLabel}
      className={`curtain ${className}`.trim()}
      data-tone={tone}
      data-edge={edge}
      data-arrow={arrowDirection}
      data-active={isActive ? '' : undefined}
      data-quiet={isQuiet ? '' : undefined}
      data-charging={isCharging ? '' : undefined}
      onClick={handleClick}
      onPointerEnter={(event) => {
        if (event.pointerType === 'mouse') setActive(true)
      }}
      onPointerLeave={(event) => {
        if (event.pointerType === 'mouse') setActive(false)
      }}
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
    >
      <span className="curtain__plane">
        {/* The glow sits OUTSIDE the masked body on purpose: a mask clips
            everything its element paints, so a glow living on the gradient
            itself would be cut off at the very rectangle edge the mask exists
            to hide (correction C). */}
        <span aria-hidden="true" className="curtain__glow" />
        <span aria-hidden="true" className="curtain__body">
          <span className="curtain__surface" />
          <span className="curtain__sheen" />
        </span>
        {!prefersReducedMotion && (
          <>
            <CurtainParticles tone={tone} count={idleParticleCount} outward={particleDirection} isVisible />
            {hasParticles && (
              <CurtainParticles tone={tone} count={hoverBoostCount} outward={particleDirection} isVisible={isActive} />
            )}
          </>
        )}
        <span className="curtain__content">{children}</span>
      </span>
    </Link>
  )
}
