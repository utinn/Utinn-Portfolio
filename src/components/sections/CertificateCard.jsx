import ImagePlaceholder from '../common/ImagePlaceholder'

/**
 * Single Certificate Page grid card (CLAUDE.md Section 9, ANIMATION_SPEC.md
 * 23.1, INTERACTION_SPEC.md 24/25). The certificate image is the click
 * target that opens the enlarged preview (25.1) — title/issuer/date stay
 * plain text below it, matching docs/figma-reference/certificates/CertificatesPage.png.
 *
 * The image box is a fixed aspect-ratio frame using object-fit: contain so a
 * certificate of any source aspect ratio is never cropped or stretched
 * (CLAUDE.md Section 8 / the implementation prompt's Image Treatment
 * section) — dimensions are controlled by the frame, not the source image.
 *
 * `isVisible`/`revealDelayMs` drive the one-time initial-entrance stagger via
 * the shared `.project-reveal` class (ANIMATION_SPEC.md Section 8); the
 * per-filter-switch transition instead lives one level up on the whole grid
 * (CertificateGrid.jsx), so cards mounted by a filter change don't replay
 * this entrance.
 */
export default function CertificateCard({ certificate, onOpen, isVisible = true, revealDelayMs = 0 }) {
  const { title, issuer, issueDate, image, alt } = certificate

  return (
    <article
      className={`project-reveal flex flex-col ${isVisible ? 'project-reveal-visible' : ''}`}
      style={{ '--reveal-delay': `${revealDelayMs}ms` }}
    >
      <button
        type="button"
        onClick={() => onOpen(certificate)}
        aria-label={`Open certificate preview: ${title}`}
        className="cert-card-media relative block aspect-[4/3] w-full overflow-hidden rounded-[var(--radius-card)] border-2 border-white/25 bg-panel/50"
      >
        {image ? (
          <img src={image} alt={alt || title} className="h-full w-full object-contain p-3" />
        ) : (
          <ImagePlaceholder label={alt || `${title} certificate coming soon`} />
        )}
      </button>

      <h3 className="mt-4 text-lg font-sans font-bold text-foreground">{title}</h3>
      <p className="mt-1 text-caption text-muted">
        Issued by {issuer} · {issueDate}
      </p>
    </article>
  )
}
