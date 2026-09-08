import { useScrollReveal } from '../../hooks/useScrollReveal'
import SectionHeader from '../common/SectionHeader'

/**
 * One titled block on a Projects child page ("Featured … Projects", "Other
 * Related Projects"). Owns only its centred heading and its reveal; the
 * cards inside reveal themselves as they are scrolled to, so a card far below
 * the fold never animates while it is off-screen (ANIMATION_SPEC.md Section
 * 6).
 */
export default function ProjectsSection({ title, className = '', children }) {
  const { ref, isVisible } = useScrollReveal()

  return (
    <section ref={ref} className={className}>
      <SectionHeader title={title} revealed={isVisible} className="text-center" />
      <div className="mt-12">{children}</div>
    </section>
  )
}
