import { useEffect, useState } from 'react'
import ImagePlaceholder from '../common/ImagePlaceholder'

const ROTATION_INTERVAL_MS = 2000

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
