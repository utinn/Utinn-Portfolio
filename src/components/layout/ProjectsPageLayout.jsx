import ProjectsPageHeader from '../sections/ProjectsPageHeader'

/**
 * Content column shared by both Projects child pages.
 *
 * MEASURED from docs/figma-reference/projects/{Game,Ai}ProjectsPage.png: on
 * the 1440px desktop reference the page content spans x121-x1320, i.e. a
 * centred 1200px column. That is narrower than the site-wide PageContainer
 * (which bounds to the full 1440px design width for the Navbar), so it is
 * stated here rather than borrowed. The 1248px bound is that column plus the
 * px-6 gutter, which only starts eating into it on narrow screens.
 *
 * Horizontal centring inside the return-curtain clearance is handled by
 * `.projects-page-body` (curtains.css) on the wrapper ProjectCategoryStage
 * supplies.
 */
export default function ProjectsPageLayout({ children }) {
  return (
    <div className="mx-auto w-full max-w-[1248px] px-6 pb-28 pt-18">
      <ProjectsPageHeader />
      {children}
    </div>
  )
}
