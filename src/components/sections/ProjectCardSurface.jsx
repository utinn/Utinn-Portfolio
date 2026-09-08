import { useScrollReveal } from '../../hooks/useScrollReveal'

/**
 * The card surface shared by both Projects-page card sizes: dark glass panel,
 * subtle border, subtle blue atmospheric glow — the same language as the Home
 * Featured Works card, never a bright blue panel.
 *
 * `min-w-0` is required, not cosmetic: every card is laid out as a grid item,
 * and a grid item's automatic minimum size would otherwise let a card stay
 * wider than its track on narrow screens and be clipped by the page's
 * overflow-x-clip.
 *
 * It also owns the card's own scroll reveal (a restrained opacity + rise,
 * ANIMATION_SPEC.md Section 7) so each card animates when it is actually
 * reached, and `revealDelayMs` carries the Section 8 stagger for grids.
 *
 * `variant` picks the two-layer glow: `featured` (the wide 80px/10% bloom
 * plus a tighter 20px/20% edge) for the large Featured Project cards, `other`
 * (the same 80px/10% bloom plus a softer, wider 40px/15% edge) for the
 * intentionally more restrained Other Related Projects cards. Both share the
 * same 2px white/30% stroke.
 */
const CARD_GLOW = {
  featured: 'shadow-[0_0_80px_rgba(96,165,250,0.10),0_0_20px_rgba(96,165,250,0.20)]',
  other: 'shadow-[0_0_80px_rgba(96,165,250,0.10),0_0_40px_rgba(96,165,250,0.15)]',
}

export default function ProjectCardSurface({ revealDelayMs = 0, variant = 'featured', className = '', children }) {
  const { ref, isVisible } = useScrollReveal()

  return (
    <article
      ref={ref}
      style={{ '--reveal-delay': `${revealDelayMs}ms` }}
      className={`project-reveal ${isVisible ? 'project-reveal-visible' : ''} min-w-0 rounded-[var(--radius-card)] border-2 border-white/30 bg-panel/50 p-6 ${CARD_GLOW[variant]} sm:p-8 ${className}`.trim()}
    >
      {children}
    </article>
  )
}
