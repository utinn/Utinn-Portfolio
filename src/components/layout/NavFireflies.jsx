import { useEffect, useMemo, useRef } from 'react'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { NAV_FIREFLIES, createFireflies, desiredPoint, retarget, step } from '../../motion/navFireflyPhysics'

/* Frame clamp: a backgrounded tab pauses rAF, and the first frame back would
   otherwise integrate seconds of motion in one go. */
const MAX_DT = 1 / 30

/**
 * The glowing blue-white "fireflies" surrounding the active Navbar item.
 *
 * Owner motion-polish pass: each firefly is its own damped spring (see
 * src/motion/navFireflyPhysics.js) chasing a target point relative to the
 * active item — so on a route change they notice the new item on their own
 * schedules, wind up, cruise, decelerate into the new cloud and hand over to
 * ambient 2D drift, instead of sliding across as one rigid group. Positions
 * are written straight to each dot's `transform` from one rAF loop; the only
 * CSS animation left is the per-dot opacity shimmer.
 *
 * `target` is the active item's box in the <ul>'s coordinate space
 * ({ x, y } = centre). It is measured by Navbar.jsx, which already tracks the
 * active NavLink for the aura, so this component never touches the DOM to
 * find items.
 */
// Seed chosen for a balanced cloud: 4 above / 5 below, 4 left / 5 right of
// the label centre, mean offset ~0 on both axes, well spaced. Change it to
// reshuffle the arrangement without touching the tuning in
// navFireflyPhysics.js.
export default function NavFireflies({ target, seed = 1978 }) {
  const prefersReducedMotion = usePrefersReducedMotion()
  const flies = useMemo(() => createFireflies(seed), [seed])
  const elsRef = useRef([])
  const hasTickedRef = useRef(false)

  // Hand every firefly the new target. Each one keeps its own reaction lag,
  // so departures stagger without any scheduling here.
  useEffect(() => {
    if (!target) return
    const now = performance.now() / 1000
    // No frames are running (background tab, or the loop hasn't started):
    // nothing could animate a chase, so place directly. This is also what
    // keeps a tab opened in the background correct the moment it's shown.
    const snap = prefersReducedMotion || document.hidden || !hasTickedRef.current

    flies.forEach((p, i) => {
      retarget(p, target, now)
      if (snap) {
        p.target = target
        p.pendingTarget = null
        const want = desiredPoint(p, target, now)
        p.x = want.x
        p.y = want.y
        p.vx = 0
        p.vy = 0
      }
      // Under reduced motion this is the whole placement: no spring loop
      // runs, and the short CSS transition (nav-firefly--static) carries the
      // dot to its rest offset.
      const el = elsRef.current[i]
      if (el) el.style.transform = `translate3d(${p.x}px, ${p.y}px, 0)`
    })
  }, [target, flies, prefersReducedMotion])

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
        step(p, now, dt)
        const el = elsRef.current[i]
        if (el && p.placed) el.style.transform = `translate3d(${p.x}px, ${p.y}px, 0)`
      }
      frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [flies, prefersReducedMotion])

  return (
    // Hidden until the first target is measured so the dots never flash at
    // the list's origin before they are placed.
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
            '--ff-o-min': NAV_FIREFLIES.opacity[0],
            '--ff-o-max': p.opacityMax.toFixed(2),
            '--ff-shimmer': `${p.shimmerSec.toFixed(2)}s`,
            '--ff-shimmer-delay': `${p.shimmerDelay.toFixed(2)}s`,
            '--ff-static-ms': `${NAV_FIREFLIES.reducedMotionMs}ms`,
          }}
        />
      ))}
    </span>
  )
}
