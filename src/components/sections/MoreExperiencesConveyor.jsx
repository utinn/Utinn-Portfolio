import { useEffect, useRef, useState } from 'react'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import ImagePlaceholder from '../common/ImagePlaceholder'
import { moreExperiencesConveyorItems } from '../../data/moreExperiencesConveyor'

const BASE_SPEED_PX_S = 46
const DRAG_THRESHOLD_PX = 6
const MOMENTUM_RELEASE_FACTOR = 0.6
const MAX_MOMENTUM_PX_S = 900
const MOMENTUM_DECAY_PER_S = 4.5
const MOMENTUM_EPSILON_PX_S = 2
const VELOCITY_SAMPLE_WINDOW_MS = 100

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

    const isPaused = () => viewport.matches(':hover')

    let activePointerId = null
    let dragConfirmed = false
    let pointerDownX = 0
    let baseX = 0
    let baseOffset = 0
    let rawOffset = 0
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
      } catch {}

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
      <div
        ref={viewportRef}
        className="-my-8 touch-pan-y cursor-grab overflow-hidden py-8 select-none active:cursor-grabbing"
      >
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
