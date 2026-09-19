import ProjectsPageLayout from '../components/layout/ProjectsPageLayout'
import ProjectCategoryStage from '../components/sections/ProjectCategoryStage'
import ProjectFeatureCard from '../components/sections/ProjectFeatureCard'
import ProjectsSection from '../components/sections/ProjectsSection'
import { featuredProjectsIn } from '../data/projects'

const featuredProjects = featuredProjectsIn('game')

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
