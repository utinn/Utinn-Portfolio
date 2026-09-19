import { useEffect, useRef, useState } from 'react'
import { aboutCarouselItems as items } from '../../data/aboutCarousel'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import ImagePlaceholder from '../common/ImagePlaceholder'

const TRANSITION_MS = 450
const SWIPE_THRESHOLD_PX = 40

const wrap = (i) => ((i % items.length) + items.length) % items.length

const SPIN_STEPS = items.length * 2
const SPIN_FAST_MS = 70
const SPIN_SLOW_MS = 250
const SPIN_EASE = 2.2

const spinDurations = Array.from({ length: SPIN_STEPS }, (_, step) =>
  step === SPIN_STEPS - 1
    ? TRANSITION_MS
    : Math.round(SPIN_FAST_MS + (SPIN_SLOW_MS - SPIN_FAST_MS) * (step / (SPIN_STEPS - 1)) ** SPIN_EASE),
)

const getOffset = (i, activeIndex, length) => {
  const half = Math.floor(length / 2)
  const raw = ((i - activeIndex) % length + length) % length
  return raw > half ? raw - length : raw
}

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

  useEffect(() => {
    if (prefersReducedMotion || !hasSettledRef.current) return undefined
    setCaptionVisible(false)
    const raf = requestAnimationFrame(() => setCaptionVisible(true))
    return () => cancelAnimationFrame(raf)
  }, [index, prefersReducedMotion])

  useEffect(() => () => clearTimeout(lockTimeoutRef.current), [])

  useEffect(() => {
    if (!startEntrance || entranceDone) return undefined
    if (prefersReducedMotion) {
      hasSettledRef.current = true
      setEntranceDone(true)
      return undefined
    }

    let step = 0
    let timeoutId

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
