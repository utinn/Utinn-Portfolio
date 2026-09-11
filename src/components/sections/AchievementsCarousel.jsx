import { useEffect, useRef, useState } from 'react'
import { achievements as items } from '../../data/achievements'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import ImagePlaceholder from '../common/ImagePlaceholder'
import AchievementLightbox from './AchievementLightbox'
import AchievementParticles from './AchievementParticles'

/** Within ANIMATION_SPEC.md 21.2's recommended 400-550ms slide transition. */
const TRANSITION_MS = 520

/** Horizontal travel (px) that commits a drag/swipe to the next slide. */
const DRAG_COMMIT_PX = 56

/**
 * Travel before a gesture is locked to an axis, so a vertical page scroll that
 * happens to start on the carousel is never stolen by the drag handler.
 */
const AXIS_LOCK_PX = 8

const wrap = (i) => ((i % items.length) + items.length) % items.length

/**
 * Signed, shortest-path distance of item `i` from `activeIndex` — the same
 * offset model the About Me carousel uses (0 = active, ±1 = near, ±2 = far,
 * anything further = hidden). Driving every card off one continuously
 * updated offset is what makes the outgoing card travel back and out while
 * the incoming one travels forward into focus, instead of swapping content
 * in place.
 */
const getOffset = (i, activeIndex, length) => {
  const half = Math.floor(length / 2)
  const raw = (((i - activeIndex) % length) + length) % length
  return raw > half ? raw - length : raw
}

const stateFor = (offset) => {
  const distance = Math.abs(offset)
  if (distance === 0) return 'active'
  if (distance === 1) return 'near'
  if (distance === 2) return 'far'
  return 'hidden'
}

/**
 * Achievements Page carousel (ANIMATION_SPEC.md 21, INTERACTION_SPEC.md 22),
 * refined per an explicit owner pass (2026-09-10) into a rotating, depth-based
 * showcase — an owner instruction outranks the written spec (CLAUDE.md
 * Section 26), so this deviates from both docs' original "peeking neighbour"
 * composition on purpose.
 *
 * The interaction model is still inherited wholesale from the About Me
 * carousel (22.1): manual-only, no autoplay, prev/next arrows + indicator
 * dots + keyboard + swipe, continuous looping, and a transition lock so rapid
 * input cannot desynchronise image, text, metadata and dot state (22.7).
 *
 * What changed in this pass:
 * - Only the active card shows title/issuer/date/description. Non-active
 *   achievements are bare images stacked behind it — smaller, dimmer, and
 *   offset per their distance from active — so the carousel reads as a
 *   depth/rotation illusion instead of clipped neighbouring content.
 * - The active card is markedly larger and its own glow is a touch stronger.
 * - The active card is clickable and opens `AchievementLightbox`.
 * - Prev/Next arrows flank the stage instead of sitting under the dots.
 *
 * Layout stability (21.2 / 22.1) is still guaranteed: every card occupies the
 * same transform-only box (a fixed aspect-ratio reference sized by
 * --ach-card-w), and both text blocks render every achievement's copy at once
 * in a CSS grid stack (only the active cell is opaque) so the reserved height
 * is always the tallest achievement's — switching cards can never shift the
 * page.
 */
export default function AchievementsCarousel({ revealed = false }) {
  const [index, setIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [drag, setDrag] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [textVisible, setTextVisible] = useState(true)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const prefersReducedMotion = usePrefersReducedMotion()
  const lockTimeoutRef = useRef(null)
  const gestureRef = useRef(null)

  useEffect(() => () => clearTimeout(lockTimeoutRef.current), [])

  // Quick crossfade for the title/meta/description text only — the card
  // handoff animates itself via the offset-driven CSS below.
  useEffect(() => {
    if (prefersReducedMotion) return undefined
    setTextVisible(false)
    const raf = requestAnimationFrame(() => setTextVisible(true))
    return () => cancelAnimationFrame(raf)
  }, [index, prefersReducedMotion])

  const goTo = (nextIndex) => {
    if (isAnimating) return
    setIndex(wrap(nextIndex))
    if (prefersReducedMotion) return
    setIsAnimating(true)
    clearTimeout(lockTimeoutRef.current)
    lockTimeoutRef.current = setTimeout(() => setIsAnimating(false), TRANSITION_MS)
  }

  const goNext = () => goTo(index + 1)
  const goPrev = () => goTo(index - 1)

  const handleArrowKeyDown = (event) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      goNext()
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      goPrev()
    }
  }

  // Pointer Events cover mouse drag and the mandatory mobile swipe
  // (INTERACTION_SPEC.md 22.5) through one code path. The stage sets
  // `touch-action: pan-y`, so the browser keeps vertical scrolling for itself;
  // the axis lock below additionally drops gestures that turn out vertical.
  const handlePointerDown = (event) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return
    gestureRef.current = { x: event.clientX, y: event.clientY, axis: null }
  }

  const handlePointerMove = (event) => {
    const gesture = gestureRef.current
    if (!gesture) return
    const dx = event.clientX - gesture.x
    const dy = event.clientY - gesture.y

    if (!gesture.axis) {
      if (Math.abs(dx) < AXIS_LOCK_PX && Math.abs(dy) < AXIS_LOCK_PX) return
      if (Math.abs(dy) >= Math.abs(dx)) {
        gestureRef.current = null
        return
      }
      gesture.axis = 'x'
      // Capture keeps the gesture alive if the pointer leaves the stage
      // mid-drag. It throws when the pointer is no longer active (a release
      // that raced this handler), which is harmless — the drag simply ends
      // on the following pointerup.
      try {
        event.currentTarget.setPointerCapture(event.pointerId)
      } catch {
        /* pointer already released */
      }
      setIsDragging(true)
    }

    setDrag(dx)
  }

  const endGesture = (event) => {
    const gesture = gestureRef.current
    gestureRef.current = null
    setDrag(0)
    setIsDragging(false)
    if (!gesture || gesture.axis !== 'x') return
    const dx = event.clientX - gesture.x
    if (Math.abs(dx) < DRAG_COMMIT_PX) return
    if (dx < 0) goNext()
    else goPrev()
  }

  const activeItem = items[index]

  return (
    <div className={`ach-carousel ${revealed ? 'ach-carousel-revealed' : ''}`.trim()}>
      <div
        className={`carousel-caption ${textVisible ? 'carousel-caption-visible' : 'carousel-caption-hidden'} ach-caption-top`}
      >
        <div className="ach-caption-grid">
          {items.map((item, i) => (
            <div key={item.id} className="ach-caption-cell" data-active={i === index} aria-hidden={i === index ? undefined : 'true'}>
              <h2 className="ach-slide-title">{item.title}</h2>
              <p className="ach-slide-meta">
                Issued by {item.issuer} · {item.date}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="ach-stage-row">
        <CarouselArrow direction="prev" onClick={goPrev} onKeyDown={handleArrowKeyDown} />

        <div
          className={`ach-viewport ${isDragging ? 'ach-viewport-dragging' : ''}`.trim()}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={endGesture}
          onPointerCancel={endGesture}
        >
          <div className="ach-track" style={{ '--ach-drag': `${drag}px` }}>
            {items.map((item, i) => {
              const offset = getOffset(i, index, items.length)
              const state = stateFor(offset)
              return (
                <AchievementCard
                  key={item.id}
                  item={item}
                  offset={offset}
                  state={state}
                  withParticles={state === 'active' && !prefersReducedMotion}
                  onOpenLightbox={() => setLightboxOpen(true)}
                />
              )
            })}
          </div>
        </div>

        <CarouselArrow direction="next" onClick={goNext} onKeyDown={handleArrowKeyDown} />
      </div>

      <div
        className={`carousel-caption ${textVisible ? 'carousel-caption-visible' : 'carousel-caption-hidden'} ach-caption-bottom`}
      >
        <div className="ach-caption-grid">
          {items.map((item, i) => (
            <div key={item.id} className="ach-caption-cell" data-active={i === index} aria-hidden={i === index ? undefined : 'true'}>
              <p className="ach-slide-description">{item.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 flex items-center justify-center gap-2.5 sm:mt-10" role="group" aria-label="Achievements">
        {items.map((item, i) => (
          <button
            key={item.id}
            type="button"
            aria-current={i === index ? 'true' : undefined}
            aria-label={`Go to achievement ${i + 1}: ${item.title}`}
            onClick={() => goTo(i)}
            className={`ach-dot ${i === index ? 'ach-dot-active' : ''}`.trim()}
          />
        ))}
      </div>

      <AchievementLightbox item={activeItem} open={lightboxOpen} onClose={() => setLightboxOpen(false)} />
    </div>
  )
}

/**
 * One achievement's image, positioned purely from its offset from the active
 * index (`data-state` drives scale/opacity/depth in animations.css). Only
 * the active card renders its media inside a button, so it alone is
 * clickable into the lightbox; non-active cards are `pointer-events: none`
 * and carry no interactive semantics.
 */
function AchievementCard({ item, offset, state, withParticles, onOpenLightbox }) {
  const isActive = state === 'active'

  return (
    <div className="ach-card-item" data-state={state} style={{ '--ach-offset': String(offset) }} aria-hidden={isActive ? undefined : 'true'}>
      <div className="ach-card-wrap">
        <div className="ach-card">
          <div className="ach-card-media">
            {isActive ? (
              <button type="button" className="ach-card-media-btn" onClick={onOpenLightbox} aria-label={`View ${item.title} image larger`}>
                <CardImage item={item} />
              </button>
            ) : (
              <CardImage item={item} />
            )}
          </div>
          <span aria-hidden="true" className="ach-card-sheen" />
        </div>
        {withParticles && <AchievementParticles />}
      </div>
    </div>
  )
}

function CardImage({ item }) {
  if (item.image) {
    return <img src={item.image} alt={item.alt} className="h-full w-full object-cover" loading="lazy" draggable="false" />
  }
  return <ImagePlaceholder label={item.alt || `${item.title} artwork coming soon`} />
}

/**
 * Same arrow language as the About Me carousel and every other directional
 * control on the site (shared `.btn-external` hover nudge + scale), now
 * flanking the stage instead of sitting under the dots.
 */
function CarouselArrow({ direction, onClick, onKeyDown }) {
  const isPrev = direction === 'prev'

  return (
    <button
      type="button"
      onClick={onClick}
      onKeyDown={onKeyDown}
      className="ach-arrow btn-external flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/25 text-foreground hover:border-white/60 sm:h-12 sm:w-12"
      aria-label={isPrev ? 'Previous achievement' : 'Next achievement'}
    >
      {/* The flip lives on a wrapper, not on the animated arrow span itself —
          the shared hover nudge also writes `transform`. */}
      <span aria-hidden="true" className="inline-block" style={isPrev ? { transform: 'scaleX(-1)' } : undefined}>
        <span className="btn-external__arrow">&gt;</span>
      </span>
    </button>
  )
}
