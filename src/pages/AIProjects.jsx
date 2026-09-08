import ProjectsPageLayout from '../components/layout/ProjectsPageLayout'
import ProjectCategoryStage from '../components/sections/ProjectCategoryStage'
import ProjectFeatureCard from '../components/sections/ProjectFeatureCard'
import ProjectSummaryCard from '../components/sections/ProjectSummaryCard'
import ProjectsSection from '../components/sections/ProjectsSection'
import { featuredProjectsIn, otherProjectsIn } from '../data/projects'

/** Stagger between related-project cards (ANIMATION_SPEC.md Section 8). */
const GRID_STAGGER_MS = 90

const featuredProjects = featuredProjectsIn('ai')
const relatedProjects = otherProjectsIn('ai')

/**
 * AI Projects page (child view of Projects — INTERACTION_SPEC.md Section 15),
 * composed from docs/figma-reference/projects/AiProjectsPage.png: shared page
 * header, two large featured cards, then a 2-column grid of related projects.
 * The return curtain on the left and the page's clearance from it are supplied
 * by ProjectCategoryStage.
 */
export default function AIProjects() {
  return (
    <ProjectCategoryStage category="ai">
      <ProjectsPageLayout>
        <ProjectsSection title="Featured Artificial Intelligence Projects" className="mt-16">
          <div className="grid gap-12">
            {featuredProjects.map((project) => (
              <ProjectFeatureCard key={project.id} project={project} />
            ))}
          </div>
        </ProjectsSection>

        <ProjectsSection title="Other Related Projects" className="mt-12">
          <div className="grid gap-8 md:grid-cols-2 lg:gap-24">
            {relatedProjects.map((project, i) => (
              <ProjectSummaryCard key={project.id} project={project} revealDelayMs={(i % 2) * GRID_STAGGER_MS} />
            ))}
          </div>
        </ProjectsSection>
      </ProjectsPageLayout>
    </ProjectCategoryStage>
  )
}
