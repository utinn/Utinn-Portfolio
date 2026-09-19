import ImagePlaceholder from '../common/ImagePlaceholder'

export default function CertificateCard({ certificate, onOpen, isVisible = true, revealDelayMs = 0 }) {
  const { title, issuer, issueDate, image, alt } = certificate

  return (
    <article
      className={`project-reveal flex flex-col items-center text-center lg:mx-auto lg:w-[336px] ${isVisible ? 'project-reveal-visible' : ''}`}
      style={{ '--reveal-delay': `${revealDelayMs}ms` }}
    >
      <button
        type="button"
        onClick={() => onOpen(certificate)}
        aria-label={`Open certificate preview: ${title}`}
        className="cert-card-media relative block aspect-[4/3] w-full overflow-hidden rounded-[var(--radius-card)] border-2 border-white/25 bg-panel/50"
      >
        {image ? (
          <img
            src={image}
            alt={alt || title}
            loading="lazy"
            decoding="async"
            fetchPriority="low"
            className="h-full w-full object-cover"
          />
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
