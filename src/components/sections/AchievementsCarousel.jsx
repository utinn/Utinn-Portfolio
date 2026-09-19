import { useEffect, useRef, useState } from 'react'
import { achievements as items } from '../../data/achievements'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import ImagePlaceholder from '../common/ImagePlaceholder'
import AchievementLightbox from './AchievementLightbox'
import AchievementParticles from './AchievementParticles'

const TRANSITION_MS = 520

const DRAG_COMMIT_PX = 56

const AXIS_LOCK_PX = 8

const wrap = (i) => ((i % items.length) + items.length) % items.length

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
      try {
        event.currentTarget.setPointerCapture(event.pointerId)
      } catch {}
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
      <span aria-hidden="true" className="inline-block" style={isPrev ? { transform: 'scaleX(-1)' } : undefined}>
        <span className="btn-external__arrow">&gt;</span>
      </span>
    </button>
  )
}
