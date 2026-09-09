import { useEffect, useState } from 'react'
import ImagePlaceholder from '../common/ImagePlaceholder'

/** ANIMATION_SPEC.md 20.12 / INTERACTION_SPEC.md 19.2 — a fixed 2s cadence. */
const ROTATION_INTERVAL_MS = 2000

/**
 * Supporting image beside an open experience's key points: ONE fixed frame
 * whose contents change on a timer, never a carousel — no arrows, no dots, no
 * swipe (INTERACTION_SPEC.md 19.1). Every image is rendered stacked and
 * crossfaded by opacity alone, so the frame's dimensions come from CSS and
 * changing image can't move anything around it (ANIMATION_SPEC.md 20.12
 * "Layout Stability").
 *
 * The timer runs only while `isOpen` (19.3): a collapsed group must not keep
 * doing hidden visual work. A set of one image (or none) never starts a timer
 * at all — the frame just holds, which is what the entries still awaiting
 * photos do.
 *
 * The caller (ExperienceTimelineItem) mounts this only while its panel is
 * open/closing and keys that block per open cycle, so this component is
 * always freshly created on open — reopening always starts from the first
 * image (19.3's "clean valid image state") without this component having to
 * reset its own state.
 */
export default function ExperienceSupportingImage({ images, title, isOpen }) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (!isOpen || images.length < 2) return

    const id = setInterval(() => setIndex((current) => (current + 1) % images.length), ROTATION_INTERVAL_MS)
    return () => clearInterval(id)
  }, [isOpen, images.length])

  return (
    <div className="timeline-image-glow relative aspect-[16/9] w-full overflow-hidden rounded-xl border-2">
      {images.length === 0 ? (
        <ImagePlaceholder label={`${title} photo coming soon`} />
      ) : (
        images.map((image, i) => (
          <img
            key={image}
            src={image}
            alt={i === index ? `${title} — supporting photo` : ''}
            aria-hidden={i === index ? undefined : 'true'}
            loading="lazy"
            className={`exp-slide ${i === index ? 'exp-slide-active' : ''} absolute inset-0 h-full w-full object-cover`}
          />
        ))
      )}
    </div>
  )
}
