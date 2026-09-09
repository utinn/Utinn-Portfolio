import { useEffect, useRef, useState } from 'react'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import ImagePlaceholder from '../common/ImagePlaceholder'
import { moreExperiencesConveyorItems } from '../../data/moreExperiencesConveyor'

/** Slow and comfortable — images must stay readable while they travel. */
const BASE_SPEED_PX_S = 46
/** A pointer must move this far before a gesture counts as a drag rather
    than a stationary press (owner instruction 9) — small mouse jitter while
    simply hovering an item must never nudge the belt. */
const DRAG_THRESHOLD_PX = 6
/** Release inertia is a small nudge, not a physics simulation (owner
    instruction 6/7): the raw release velocity is damped before becoming
    momentum, capped, and decays quickly. */
const MOMENTUM_RELEASE_FACTOR = 0.6
const MAX_MOMENTUM_PX_S = 900
const MOMENTUM_DECAY_PER_S = 4.5
const MOMENTUM_EPSILON_PX_S = 2
/** Release velocity is measured from samples within this trailing window so
    a brief pause right before lifting the pointer doesn't read as "released
    at zero speed". */
const VELOCITY_SAMPLE_WINDOW_MS = 100

/**
 * "More Experiences" conveyor (ANIMATION_SPEC.md 20.13, INTERACTION_SPEC.md
 * Sections 20.3 & 21) — a continuously looping stream, never a grid, a manual
 * carousel or an autoplay slideshow.
 *
 * Motion is driven by one requestAnimationFrame accumulator rather than a CSS
 * marquee. Autoplay, hover pause, direct drag and release momentum all share
 * a single `offset` value — retiming a CSS animation mid-run would visibly
 * jump the strip, which 20.13 forbids ("teleport images visibly from one
 * side to the other"). Pausing and resuming therefore continue from the
 * current position instead of restarting the sequence (21.5).
 *
 * The loop is seamless because the items are rendered twice and `offset`
 * wraps at the measured distance between copy 1 and copy 2 — measured from
 * the rendered boxes rather than assumed from scrollWidth, so it stays exact
 * whatever the gap resolves to at the current breakpoint. Wrapping happens on
 * every write to `offset`, including during an active drag, so a long drag
 * in either direction can never run off the duplicated set.
 *
 * Drag model (owner correction pass — replaces an earlier wheel-acceleration
 * design entirely, not just supersedes it): while a drag is confirmed (past
 * DRAG_THRESHOLD_PX), `offset` is written directly from pointer position in
 * the pointermove handler itself, one-to-one, independent of rAF timing — it
 * has to work even when the rAF loop is skipped under reduced motion.
 * `tick()` only ever advances `offset` on its own (autoplay or momentum
 * decay) while a drag is NOT active, so there is exactly one writer of
 * `offset` at any instant and no competing transform sources.
 */
export default function MoreExperiencesConveyor({ revealed, revealDelayMs }) {
  const viewportRef = useRef(null)
  const trackRef = useRef(null)
  const [items] = useState(moreExperiencesConveyorItems)
  const prefersReducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    const viewport = viewportRef.current
    const track = trackRef.current
    if (!viewport || !track || items.length === 0) return

    let offset = 0
    let momentum = 0
    let period = 0
    let last = performance.now()
    let frame = 0
    let isDragging = false

    const wrap = (value) => (period > 0 ? ((value % period) + period) % period : value)

    const measure = () => {
      const first = track.children[0]
      const secondCopy = track.children[items.length]
      if (!first || !secondCopy) return
      period = secondCopy.getBoundingClientRect().left - first.getBoundingClientRect().left
    }

    const applyTransform = () => {
      track.style.transform = `translate3d(${-offset}px, 0, 0)`
    }

    // Read the pause straight off CSS :hover rather than mirroring it into
    // React state: the hover presentation (scale, glow, caption) is pure CSS,
    // and a separate JS mouseenter/mouseleave pair can fall out of step with
    // it — notably when the pointer ends up over an item because the PAGE
    // scrolled rather than because the pointer moved. One source of truth.
    const isPaused = () => viewport.matches(':hover')

    // --- Direct drag (mouse / pointer / touch) ---------------------------
    let activePointerId = null
    let dragConfirmed = false
    let pointerDownX = 0
    let baseX = 0
    let baseOffset = 0
    let rawOffset = 0
    /** Recent (time, rawOffset) samples, unwrapped, for a stable release-
        velocity estimate that isn't corrupted by a loop wrap mid-drag. */
    const samples = []

    const onPointerDown = (event) => {
      if (activePointerId !== null) return
      if (event.pointerType === 'mouse' && event.button !== 0) return
      activePointerId = event.pointerId
      pointerDownX = event.clientX
      dragConfirmed = false
      viewport.setPointerCapture(event.pointerId)
    }

    const onPointerMove = (event) => {
      if (event.pointerId !== activePointerId) return

      if (!dragConfirmed) {
        if (Math.abs(event.clientX - pointerDownX) < DRAG_THRESHOLD_PX) return
        dragConfirmed = true
        isDragging = true
        momentum = 0
        baseX = event.clientX
        baseOffset = offset
        rawOffset = offset
        samples.length = 0
        samples.push({ t: performance.now(), rawOffset })
      }

      rawOffset = baseOffset - (event.clientX - baseX)
      offset = wrap(rawOffset)
      applyTransform()

      const now = performance.now()
      samples.push({ t: now, rawOffset })
      while (samples.length > 2 && now - samples[0].t > VELOCITY_SAMPLE_WINDOW_MS) samples.shift()
    }

    const endDrag = (event) => {
      if (event.pointerId !== activePointerId) return
      activePointerId = null
      try {
        viewport.releasePointerCapture(event.pointerId)
      } catch {
        // Already released (e.g. pointercancel) — nothing to clean up.
      }

      if (dragConfirmed && !prefersReducedMotion && samples.length >= 2) {
        const first = samples[0]
        const latest = samples[samples.length - 1]
        const dt = (latest.t - first.t) / 1000
        if (dt > 0) {
          const releaseVelocity = (latest.rawOffset - first.rawOffset) / dt
          momentum = Math.max(
            -MAX_MOMENTUM_PX_S,
            Math.min(MAX_MOMENTUM_PX_S, releaseVelocity * MOMENTUM_RELEASE_FACTOR),
          )
        }
      }

      isDragging = false
      dragConfirmed = false
    }

    const tick = (now) => {
      const elapsed = Math.min((now - last) / 1000, 0.05)
      last = now

      if (!isDragging) {
        const usingMomentum = Math.abs(momentum) > MOMENTUM_EPSILON_PX_S
        const velocity = usingMomentum ? momentum : isPaused() ? 0 : BASE_SPEED_PX_S
        offset = wrap(offset + velocity * elapsed)
        momentum = usingMomentum ? momentum - momentum * MOMENTUM_DECAY_PER_S * elapsed : 0
        applyTransform()
      }

      frame = requestAnimationFrame(tick)
    }

    measure()
    const resizeObserver = new ResizeObserver(measure)
    resizeObserver.observe(viewport)
    applyTransform()

    viewport.addEventListener('pointerdown', onPointerDown)
    viewport.addEventListener('pointermove', onPointerMove)
    viewport.addEventListener('pointerup', endDrag)
    viewport.addEventListener('pointercancel', endDrag)

    // Autoplay + momentum decay is real animation, so it's the one part
    // reduced-motion turns off entirely (20.13 / owner instruction 14);
    // direct dragging above works unconditionally either way.
    if (!prefersReducedMotion) {
      frame = requestAnimationFrame(tick)
    }

    return () => {
      if (frame) cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      viewport.removeEventListener('pointerdown', onPointerDown)
      viewport.removeEventListener('pointermove', onPointerMove)
      viewport.removeEventListener('pointerup', endDrag)
      viewport.removeEventListener('pointercancel', endDrag)
    }
  }, [items.length, prefersReducedMotion])

  return (
    <div
      className={`exp-conveyor-rise ${revealed ? 'exp-reveal-visible' : ''} mt-12`}
      style={{ '--reveal-delay': `${revealDelayMs}ms` }}
    >
      {/* overflow-hidden is required here for the horizontal marquee window,
          and by itself would clip the glow's vertical bleed flush against the
          card edges. -my-8/py-8 gives it real headroom on that axis instead —
          the negative margin keeps the visible cards sitting at the same Y
          position they'd be at without the padding (no layout shift), it just
          can't also cancel the padding's contribution to this element's own
          height the way a matching horizontal -mx/px pair can for a
          shrink-to-fit width (auto BLOCK HEIGHT is measured from the child's
          full margin box, not net of its own negative margins, confirmed
          in-browser — width and height aren't symmetric here). The result is
          an honest, modest trade: the hover-pause/drag hit region grows by
          ~32px above and below the visible cards, which reads as part of the
          same interactive belt rather than as unrelated empty page space.

          touch-pan-y reserves vertical panning for the browser's native page
          scroll while ceding horizontal gesture handling to the pointer
          listeners above — that's what lets a horizontal drag and normal
          vertical scrolling coexist without either one fighting the other or
          needing preventDefault. cursor-grab/active:cursor-grabbing is pure
          CSS: :active already covers exactly "pointer pressed on this
          element", so it needs no JS-driven class toggling. select-none stops
          a drag from also selecting the titles/captions it passes over. */}
      <div
        ref={viewportRef}
        className="-my-8 touch-pan-y cursor-grab overflow-hidden py-8 select-none active:cursor-grabbing"
      >
        {/* The list role belongs on the track, not the clipping viewport: the
            items are its direct children, and an intervening generic element
            would break the list/listitem ownership. */}
        <div
          ref={trackRef}
          role="list"
          aria-label="More experiences"
          className="flex w-max gap-12 will-change-transform md:gap-[84px]"
        >
          {[...items, ...items].map((item, index) => {
            const isDuplicate = index >= items.length
            return (
              <div
                key={`${item.id}-${isDuplicate ? 'loop' : 'lead'}`}
                role={isDuplicate ? undefined : 'listitem'}
                aria-hidden={isDuplicate ? 'true' : undefined}
                className="conveyor-item w-[clamp(260px,46vw,626px)] shrink-0 text-center"
              >
                <p className="conveyor-text text-lg font-sans font-bold text-foreground sm:text-xl">{item.title}</p>
                <p className="conveyor-text conveyor-text--meta mt-0.5 text-caption text-muted">
                  {item.organization} <span aria-hidden="true">·</span> {item.date}
                </p>

                {/* Glow lives on this outer frame (overflow: visible) so it can
                    bleed naturally; the inner wrapper alone clips the image to
                    the rounded corners — same split used for the timeline and
                    carousel image glows elsewhere on the site. */}
                <div className="conveyor-frame mx-auto mt-4 aspect-[16/9] w-[82%] rounded-xl border-2">
                  <div className="h-full w-full overflow-hidden rounded-xl">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.alt}
                        loading="lazy"
                        draggable={false}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <ImagePlaceholder />
                    )}
                  </div>
                </div>

                <p className="conveyor-text conveyor-text--caption mt-8 text-body text-muted">{item.caption}</p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
