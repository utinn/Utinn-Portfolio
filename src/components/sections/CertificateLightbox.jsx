import { useEffect, useRef, useState } from 'react'
import ImagePlaceholder from '../common/ImagePlaceholder'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'

// ANIMATION_SPEC.md 23.3 closing-animation duration (250-400ms) — kept in
// sync with the CSS keyframe durations in animations.css.
const CLOSE_MS = 260

/**
 * Certificate preview lightbox (INTERACTION_SPEC.md Section 25,
 * ANIMATION_SPEC.md Section 23.3). Only one preview is ever open at a time
 * because the page keeps a single `activeCertificate` in state (Certificates.jsx)
 * rather than per-card open flags (25.2).
 *
 * Unlike AchievementLightbox (an unspecified owner add-on that just
 * unmounts), this page's closing motion IS explicitly specified, so closing
 * runs its own short exit animation before unmounting instead of vanishing
 * instantly — `shouldRender`/`closing` track that; the last-seen certificate
 * is held in a ref so the image doesn't disappear mid-exit while `certificate`
 * itself has already gone back to null.
 */
export default function CertificateLightbox({ certificate, open, onClose }) {
  const [shouldRender, setShouldRender] = useState(open)
  const [closing, setClosing] = useState(false)
  const prefersReducedMotion = usePrefersReducedMotion()
  const closeButtonRef = useRef(null)
  const previouslyFocusedRef = useRef(null)
  const lastCertificateRef = useRef(certificate)

  if (certificate) lastCertificateRef.current = certificate

  useEffect(() => {
    if (open) {
      setShouldRender(true)
      setClosing(false)
      return undefined
    }

    if (!shouldRender) return undefined

    if (prefersReducedMotion) {
      setShouldRender(false)
      return undefined
    }

    setClosing(true)
    const id = setTimeout(() => {
      setShouldRender(false)
      setClosing(false)
    }, CLOSE_MS)
    return () => clearTimeout(id)
  }, [open, shouldRender, prefersReducedMotion])

  useEffect(() => {
    if (!shouldRender) return undefined

    previouslyFocusedRef.current = document.activeElement
    closeButtonRef.current?.focus()

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)

    // INTERACTION_SPEC.md 25.6 — prevent background scroll while open,
    // restore whatever the page had (not assumed empty) once it closes.
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
      if (previouslyFocusedRef.current instanceof HTMLElement) {
        previouslyFocusedRef.current.focus()
      }
    }
  }, [shouldRender, onClose])

  if (!shouldRender) return null

  const item = lastCertificateRef.current
  if (!item) return null

  const { title, issuer, issueDate, image, alt } = item

  return (
    <div
      className={`cert-lightbox ${closing ? 'cert-lightbox-closing' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label={`${title} — enlarged certificate`}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div className={`cert-lightbox-frame ${closing ? 'cert-lightbox-frame-closing' : ''}`}>
        <button
          type="button"
          ref={closeButtonRef}
          onClick={onClose}
          className="cert-lightbox-close"
          aria-label="Close certificate preview"
        >
          &times;
        </button>
        {image ? (
          <img src={image} alt={alt || `${title} — ${issuer}, ${issueDate}`} className="cert-lightbox-image" />
        ) : (
          <div className="cert-lightbox-placeholder">
            <ImagePlaceholder label={alt || `${title} certificate coming soon`} />
          </div>
        )}
      </div>
    </div>
  )
}
