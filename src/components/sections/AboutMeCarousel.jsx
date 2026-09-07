import { useEffect, useRef, useState } from 'react'
import { aboutCarouselItems as items } from '../../data/aboutCarousel'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import ImagePlaceholder from '../common/ImagePlaceholder'

const TRANSITION_MS = 450
const SWIPE_THRESHOLD_PX = 40

const wrap = (i) => ((i % items.length) + items.length) % items.length

// Entrance reel: a whole number of revolutions, so the reel mathematically
// cannot land anywhere but slide 1 regardless of how many slides exist.
const SPIN_STEPS = items.length * 2
const SPIN_FAST_MS = 70
const SPIN_SLOW_MS = 250
const SPIN_EASE = 2.2

/**
 * Per-step durations for the entrance reel: each step both animates for and
 * waits this long, so the reel visibly decelerates (70ms -> 250ms) before a
 * final full-length settle onto slide 1. Total ≈ 1.5s.
 */
const spinDurations = Array.from({ length: SPIN_STEPS }, (_, step) =>
  step === SPIN_STEPS - 1
    ? TRANSITION_MS
    : Math.round(SPIN_FAST_MS + (SPIN_SLOW_MS - SPIN_FAST_MS) * (step / (SPIN_STEPS - 1)) ** SPIN_EASE),
)

/**
 * Signed, shortest-path distance of item `i` from `activeIndex` (0 = active,
 * ±1 = side preview, ±2 = off-stage). With 5 items this covers every item
 * exactly once, so the whole carousel can be rendered as one continuously
 * positioned stage instead of three fixed slots with swapped content.
 */
const getOffset = (i, activeIndex, length) => {
  const half = Math.floor(length / 2)
  const raw = ((i - activeIndex) % length + length) % length
  return raw > half ? raw - length : raw
}

/**
 * About Me image carousel (ANIMATION_SPEC.md 15, INTERACTION_SPEC.md 9).
 * Manual-only, no autoplay, previous/next arrows + indicator dots + keyboard
 * + mandatory mobile swipe, infinite looping, captions synchronized to the
 * active image. A short transition lock prevents rapid input from
 * corrupting state (15.6/9.11).
 *
 * Spatial handoff (owner correction pass): every slide is rendered at once
 * as an absolutely-positioned "card" whose transform/opacity is driven
 * purely by its offset from the active index (see .carousel-card in
 * animations.css). Navigating only changes `index` — each card's offset
 * (and therefore its CSS transition target) updates accordingly, so the
 * browser animates every card between its old and new position in one
 * continuous motion: the outgoing active card shrinks into the side-preview
 * slot while the incoming preview grows into center, rather than swapping
 * content in place.
 */
export default function AboutMeCarousel({ startEntrance = true }) {
  const [index, setIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [captionVisible, setCaptionVisible] = useState(true)
  const [entranceDone, setEntranceDone] = useState(false)
  const [spinMs, setSpinMs] = useState(null)
  const prefersReducedMotion = usePrefersReducedMotion()
  const lockTimeoutRef = useRef(null)
  const touchStartRef = useRef(null)

  const hasSettledRef = useRef(false)

  // Quick fade-out/in for the caption text only (the image handoff animates
  // itself via the offset-driven CSS above). Two-step class flip so the
  // browser registers the hidden state before transitioning back to visible.
  // Guarded by hasSettledRef so this ordinary crossfade never runs during the
  // entrance reel or its one-time settle reveal (see below) — only for real
  // manual navigation afterwards.
  useEffect(() => {
    if (prefersReducedMotion || !hasSettledRef.current) return undefined
    setCaptionVisible(false)
    const raf = requestAnimationFrame(() => setCaptionVisible(true))
    return () => cancelAnimationFrame(raf)
  }, [index, prefersReducedMotion])

  useEffect(() => () => clearTimeout(lockTimeoutRef.current), [])

  // Entrance reel (owner correction pass): once the section header cascade
  // has played, cycle rapidly through the slides and decelerate onto slide 1,
  // then hand control back to normal manual navigation. Runs at most once —
  // there is no autoplay after it settles. Reduced motion skips straight to
  // slide 1 with no cycling.
  useEffect(() => {
    if (!startEntrance || entranceDone) return undefined
    if (prefersReducedMotion) {
      hasSettledRef.current = true
      setEntranceDone(true)
      return undefined
    }

    let step = 0
    let timeoutId

    // The index is set absolutely from the step counter rather than
    // incremented from the previous value, so the reel replays identically if
    // this effect is ever re-run (React StrictMode double-invokes it in dev)
    // and always lands on wrap(SPIN_STEPS) === slide 1.
    const advance = () => {
      const duration = spinDurations[step]
      step += 1
      setIndex(wrap(step))
      setSpinMs(duration)
      timeoutId = setTimeout(
        step < SPIN_STEPS
          ? advance
          : () => {
              setSpinMs(null)
              hasSettledRef.current = true
              setEntranceDone(true)
            },
        duration,
      )
    }

    advance()
    return () => clearTimeout(timeoutId)
  }, [startEntrance, entranceDone, prefersReducedMotion])

  const goTo = (nextIndex) => {
    if (isAnimating || !entranceDone) return
    setIndex(wrap(nextIndex))
    if (!prefersReducedMotion) {
      setIsAnimating(true)
      clearTimeout(lockTimeoutRef.current)
      lockTimeoutRef.current = setTimeout(() => setIsAnimating(false), TRANSITION_MS)
    }
  }

  const goNext = () => goTo(index + 1)
  const goPrev = () => goTo(index - 1)
  const goToIndex = (target) => goTo(target)

  const handleArrowKeyDown = (event) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      goNext()
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      goPrev()
    }
  }

  const handleTouchStart = (event) => {
    touchStartRef.current = { x: event.touches[0].clientX, y: event.touches[0].clientY }
  }

  const handleTouchEnd = (event) => {
    const start = touchStartRef.current
    if (!start) return
    const dx = event.changedTouches[0].clientX - start.x
    const dy = event.changedTouches[0].clientY - start.y
    touchStartRef.current = null
    if (Math.abs(dx) < SWIPE_THRESHOLD_PX || Math.abs(dx) < Math.abs(dy)) return
    if (dx < 0) goNext()
    else goPrev()
  }

  const activeItem = items[index]

  return (
    <div className={`carousel-entrance ${startEntrance ? 'carousel-entrance-visible' : ''} w-full`}>
      <div className="flex items-center justify-center gap-3 sm:gap-4 md:gap-6">
        <button
          type="button"
          onClick={goPrev}
          onKeyDown={handleArrowKeyDown}
          className="btn-external flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/25 text-foreground hover:border-white/50 sm:h-12 sm:w-12"
          aria-label="Previous About Me image"
        >
          {/* Flip lives on this wrapper, not the animated arrow span itself —
              the hover nudge animation also sets `transform`, so putting
              both on one element would fight over it. */}
          <span aria-hidden="true" className="inline-block" style={{ transform: 'scaleX(-1)' }}>
            <span className="btn-external__arrow">&gt;</span>
          </span>
        </button>

        <div
          className="relative flex-1"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="carousel-stage relative mx-auto aspect-[16/10] w-full max-w-2xl"
            style={spinMs ? { '--carousel-card-ms': `${spinMs}ms` } : undefined}
          >
            {items.map((item, i) => {
              const offset = getOffset(i, index, items.length)
              const isActive = offset === 0
              return (
                <div
                  key={item.id}
                  data-offset={offset}
                  aria-hidden={isActive ? undefined : 'true'}
                  className={`carousel-card ${isActive ? 'carousel-active-image' : ''} absolute inset-0 rounded-[var(--radius-card)] border-2`}
                >
                  <div className="h-full w-full overflow-hidden rounded-[var(--radius-card)]">
                    <CarouselImage item={item} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <button
          type="button"
          onClick={goNext}
          onKeyDown={handleArrowKeyDown}
          className="btn-external flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/25 text-foreground hover:border-white/50 sm:h-12 sm:w-12"
          aria-label="Next About Me image"
        >
          <span className="btn-external__arrow" aria-hidden="true">
            &gt;
          </span>
        </button>
      </div>

      {/* Nested reveal: the outer .carousel-caption crossfade (opacity only)
          runs the ordinary per-navigation transition; the inner
          .carousel-text-reveal wrappers play once, when the entrance reel
          settles, adding the translateY "rises into place" motion. Until the
          reel settles the inner wrappers stay at opacity 0, so title/caption
          are fully hidden during the rapid spin regardless of the outer
          crossfade's (irrelevant, guarded-off) state. */}
      {(activeItem.title || activeItem.caption) && (
        <div
          className={`carousel-caption ${captionVisible ? 'carousel-caption-visible' : 'carousel-caption-hidden'} mx-auto mt-6 max-w-2xl text-center`}
        >
          {activeItem.title && (
            <div className={`carousel-text-reveal carousel-text-reveal-title ${entranceDone ? 'carousel-text-reveal-visible' : ''}`}>
              <h3 className="text-2xl font-sans font-bold text-foreground">{activeItem.title}</h3>
            </div>
          )}
          {activeItem.caption && (
            <div className={`carousel-text-reveal carousel-text-reveal-caption ${entranceDone ? 'carousel-text-reveal-visible' : ''}`}>
              <p className="mt-3 text-body text-muted">{activeItem.caption}</p>
            </div>
          )}
        </div>
      )}

      <div className="mt-6 flex items-center justify-center gap-2" role="group" aria-label="About Me images">
        {items.map((item, i) => (
          <button
            key={item.id}
            type="button"
            aria-current={i === index ? 'true' : undefined}
            aria-label={`Go to About Me image ${i + 1}`}
            onClick={() => goToIndex(i)}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              i === index ? 'w-6 bg-accent' : 'w-2.5 bg-white/30 hover:bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

function CarouselImage({ item }) {
  if (item.image) {
    return <img src={item.image} alt={item.alt} className="h-full w-full object-cover" />
  }
  return <ImagePlaceholder label={item.alt || 'About Me photo coming soon'} />
}
