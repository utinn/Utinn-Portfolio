import { useScrollReveal } from '../../hooks/useScrollReveal'
import SectionHeader from '../common/SectionHeader'

export default function ProjectsSection({ title, className = '', children }) {
  const { ref, isVisible } = useScrollReveal()

  return (
    <section ref={ref} className={className}>
      <SectionHeader title={title} revealed={isVisible} className="text-center" />
      <div className="mt-12">{children}</div>
    </section>
  )
}
