import PageContainer from '../components/layout/PageContainer'
import ProjectCategoryStage from '../components/sections/ProjectCategoryStage'

/**
 * Game Projects page (child view of Projects — INTERACTION_SPEC.md Section
 * 14). The return curtain on the right is supplied by ProjectCategoryStage;
 * the page body itself is still a shell awaiting its own Figma frame.
 */
export default function GameProjects() {
  return (
    <ProjectCategoryStage category="game">
      {/* pt-10 clears the sticky Navbar, which the untouched placeholder
          shell used to render underneath. */}
      <PageContainer className="pt-10">
        <h1 className="text-display font-sans">Game Projects</h1>
      </PageContainer>
    </ProjectCategoryStage>
  )
}
