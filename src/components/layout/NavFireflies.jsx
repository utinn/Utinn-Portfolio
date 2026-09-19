import { useEffect, useMemo, useRef } from 'react'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { NAV_FIREFLIES, createFireflies, desiredPoint, retarget, step } from '../../motion/navFireflyPhysics'

const MAX_DT = 1 / 30

export default function NavFireflies({ target, seed = 1978, config = NAV_FIREFLIES }) {
  const prefersReducedMotion = usePrefersReducedMotion()
  const flies = useMemo(() => createFireflies(seed, config), [seed, config])
  const elsRef = useRef([])
  const hasTickedRef = useRef(false)

  useEffect(() => {
    if (!target) return
    const now = performance.now() / 1000
    const snap = prefersReducedMotion || document.hidden || !hasTickedRef.current

    flies.forEach((p, i) => {
      retarget(p, target, now, config)
      if (snap) {
        p.target = target
        p.pendingTarget = null
        const want = desiredPoint(p, target, now, config)
        p.x = want.x
        p.y = want.y
        p.vx = 0
        p.vy = 0
      }
      const el = elsRef.current[i]
      if (el) el.style.transform = `translate3d(${p.x}px, ${p.y}px, 0)`
    })
  }, [target, flies, prefersReducedMotion, config])

  useEffect(() => {
    if (prefersReducedMotion) return undefined

    let frame = 0
    let last = performance.now()

    const tick = (nowMs) => {
      hasTickedRef.current = true
      const dt = Math.min((nowMs - last) / 1000, MAX_DT)
      last = nowMs
      const now = nowMs / 1000
      for (let i = 0; i < flies.length; i += 1) {
        const p = flies[i]
        step(p, now, dt, config)
        const el = elsRef.current[i]
        if (el && p.placed) el.style.transform = `translate3d(${p.x}px, ${p.y}px, 0)`
      }
      frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [flies, prefersReducedMotion, config])

  return (
    <span aria-hidden="true" className="nav-fireflies" style={{ opacity: target ? 1 : 0 }}>
      {flies.map((p, i) => (
        <span
          key={p.key}
          ref={(el) => {
            elsRef.current[i] = el
          }}
          className={`nav-firefly ${prefersReducedMotion ? 'nav-firefly--static' : ''}`}
          style={{
            width: `${p.size.toFixed(2)}px`,
            height: `${p.size.toFixed(2)}px`,
            '--ff-color': p.color,
            '--ff-glow': p.glow.toFixed(2),
            '--ff-o-min': config.opacity[0],
            '--ff-o-max': p.opacityMax.toFixed(2),
            '--ff-shimmer': `${p.shimmerSec.toFixed(2)}s`,
            '--ff-shimmer-delay': `${p.shimmerDelay.toFixed(2)}s`,
            '--ff-static-ms': `${config.reducedMotionMs}ms`,
          }}
        />
      ))}
    </span>
  )
}
