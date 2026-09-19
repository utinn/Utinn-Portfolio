import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import CurtainParticles from './CurtainParticles'

const PARTICLE_FADE_OUT_MS = 340

const IDLE_PARTICLE_RATIO = 0.1
const MIN_IDLE_PARTICLES = 6

export default function CurtainSurface({
  to,
  tone,
  edge,
  arrowDirection,
  particleDirection,
  ariaLabel,
  isWarpScene = false,
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

  const idleParticleCount = Math.max(MIN_IDLE_PARTICLES, Math.round(particleCount * IDLE_PARTICLE_RATIO))
  const hoverBoostCount = particleCount - idleParticleCount

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
      data-warp-scene={isWarpScene ? '' : undefined}
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
        <span className="curtain__content" data-warp-depth="">
          {children}
        </span>
      </span>
    </Link>
  )
}
