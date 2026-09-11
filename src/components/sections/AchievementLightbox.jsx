import { useEffect, useRef } from 'react'
import ImagePlaceholder from '../common/ImagePlaceholder'

/**
 * Click-to-enlarge lightbox for the active Achievements carousel image
 * (owner refinement pass, 2026-09-10). Not covered by ANIMATION_SPEC.md /
 * INTERACTION_SPEC.md — an explicit owner instruction takes priority over an
 * unwritten spec (CLAUDE.md Section 26), so this stays intentionally simple:
 * a centered enlargement with the same blue-glow card language as the
 * carousel, closable via backdrop click, the close button, or Escape.
 */
export default function AchievementLightbox({ item, open, onClose }) {
  const closeButtonRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    closeButtonRef.current?.focus()

    // Locks page scroll while the lightbox is open; restored to whatever the
    // page had on close rather than assumed empty.
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [open, onClose])

  if (!open || !item) return null

  return (
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
    </div>
  )
}
