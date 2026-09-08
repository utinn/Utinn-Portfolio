import ProjectsPageLayout from '../components/layout/ProjectsPageLayout'
import ProjectCategoryStage from '../components/sections/ProjectCategoryStage'
import ProjectFeatureCard from '../components/sections/ProjectFeatureCard'
import ProjectsSection from '../components/sections/ProjectsSection'
import { featuredProjectsIn } from '../data/projects'

const featuredProjects = featuredProjectsIn('game')

/**
 * Game Projects page (child view of Projects — INTERACTION_SPEC.md Section
 * 14), composed from docs/figma-reference/projects/GameProjectsPage.png:
 * shared page header, then a single featured card. That frame shows no "Other
 * Projects" block and no second game project exists in the data, so none is
 * invented (CLAUDE.md Section 22). The return curtain on the right and the
 * page's clearance from it are supplied by ProjectCategoryStage.
 */
export default function GameProjects() {
  return (
    <ProjectCategoryStage category="game">
      <ProjectsPageLayout>
        <ProjectsSection title="Featured Game Projects" className="mt-16">
          <div className="grid gap-12">
            {featuredProjects.map((project) => (
              <ProjectFeatureCard key={project.id} project={project} />
            ))}
          </div>
        </ProjectsSection>
      </ProjectsPageLayout>
    </ProjectCategoryStage>
  )
}
