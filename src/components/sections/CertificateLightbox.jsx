import { useEffect, useRef, useState } from 'react'
import ImagePlaceholder from '../common/ImagePlaceholder'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'

const CLOSE_MS = 260

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

  const { title, issuer, issueDate, fullImage, alt } = item

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
        {fullImage ? (
          <img
            src={fullImage}
            alt={alt || `${title} — ${issuer}, ${issueDate}`}
            decoding="async"
            className="cert-lightbox-image"
          />
        ) : (
          <div className="cert-lightbox-placeholder">
            <ImagePlaceholder label={alt || `${title} certificate coming soon`} />
          </div>
        )}
      </div>
    </div>
  )
}
