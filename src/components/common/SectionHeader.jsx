import SectionTitle from './SectionTitle'

/**
 * Delay (ms), measured from a Home section's scroll reveal, before that
 * section's own content animation may start. Sections import this so the
 * global title -> caption -> content cascade stays identical across the page.
 */
export const SECTION_CONTENT_DELAY_MS = 600

/**
 * Shared Home section header (ANIMATION_SPEC.md Section 14, "Home Section
 * Header Reveal"). The title rises into place first, the caption follows
 * shortly after, and the section's own content animation begins afterwards —
 * one stacked, progressive language reused by every Home section below the
 * Hero. `revealed` comes from the section's single useScrollReveal() call so
 * all three stages share one trigger and play once per visit.
 */
export default function SectionHeader({
  title,
  revealed = false,
  className = '',
  captionClassName = 'mt-4',
  children,
}) {
  return (
    <div className={`${revealed ? 'section-header-revealed' : ''} ${className}`.trim()}>
      <SectionTitle className="section-header-title">{title}</SectionTitle>
      {children && <p className={`section-header-caption ${captionClassName} text-body text-muted`}>{children}</p>}
    </div>
  )
}
