import { homeProjects } from '../../data/projects'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import Button from '../common/Button'
import SectionHeader, { SECTION_CONTENT_DELAY_MS } from '../common/SectionHeader'
import PageContainer from '../layout/PageContainer'
import FeaturedWorkCard from './FeaturedWorkCard'

/**
 * Home Featured Works section (CLAUDE.md Section 9). Heading/subtitle
 * transcribed verbatim from the approved Figma reference
 * (docs/figma-reference/home/Home_FeaturedWorks.png).
 *
 * Entrance (owner correction pass): the shared Home header cascade (title
 * rises -> caption rises) runs first, then the two project cards converge
 * inward from opposite sides. One useScrollReveal() call drives every stage
 * so they share a trigger and only play once per visit.
 */
export default function FeaturedWorks() {
  const { ref, isVisible } = useScrollReveal()

  return (
    <section ref={ref}>
      <PageContainer className="py-20 md:py-28">
        <SectionHeader title="Selected Work" revealed={isVisible} className="mx-auto max-w-2xl text-center">
          Some of my best works that reflects my technical AI skills
        </SectionHeader>

        <div className="mt-14 grid gap-8 lg:grid-cols-2">
          {homeProjects.map((project, i) => (
            <FeaturedWorkCard
              key={project.id}
              project={project}
              isVisible={isVisible}
              revealSide={i === 0 ? 'left' : 'right'}
              revealDelayMs={SECTION_CONTENT_DELAY_MS}
            />
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <Button href="/projects" variant="outline">
            View All Projects
          </Button>
        </div>
      </PageContainer>
    </section>
  )
}
