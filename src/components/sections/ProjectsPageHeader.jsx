import { contactInfo } from '../../data/contact'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import Button from '../common/Button'
import SectionHeader, { SECTION_CONTENT_DELAY_MS } from '../common/SectionHeader'

export default function ProjectsPageHeader() {
  const { ref, isVisible } = useScrollReveal()

  return (
    <header ref={ref}>
      <SectionHeader as="h1" title="Projects" revealed={isVisible} className="mx-auto max-w-2xl text-center">
        Things i&apos;ve built that reflected my hardskills
      </SectionHeader>

      <div
        className={`project-reveal mt-7 flex justify-center ${isVisible ? 'project-reveal-visible' : ''}`}
        style={{ '--reveal-delay': `${SECTION_CONTENT_DELAY_MS}ms` }}
      >
        <Button href={contactInfo.github.url} external disabled={!contactInfo.github.url}>
          View All Repositories
        </Button>
      </div>
    </header>
  )
}
