import { useScrollReveal } from '../../hooks/useScrollReveal'

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
