import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import ImagePlaceholder from '../common/ImagePlaceholder'

export default function AchievementLightbox({ item, open, onClose }) {
  const closeButtonRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    closeButtonRef.current?.focus()

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [open, onClose])

  if (!open || !item) return null

  return createPortal(
    <div
      className="ach-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={`${item.title} — enlarged image`}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div className="ach-lightbox-frame">
        <button
          type="button"
          ref={closeButtonRef}
          onClick={onClose}
          className="ach-lightbox-close"
          aria-label="Close enlarged image"
        >
          &times;
        </button>
        {item.image ? (
          <img src={item.image} alt={item.alt} className="ach-lightbox-image" />
        ) : (
          <div className="ach-lightbox-placeholder">
            <ImagePlaceholder label={item.alt || `${item.title} artwork coming soon`} />
          </div>
        )}
      </div>
    </div>,
    document.body,
  )
}
