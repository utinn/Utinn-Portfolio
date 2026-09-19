import ProjectsPageHeader from '../sections/ProjectsPageHeader'

export default function ProjectsPageLayout({ children }) {
  return (
    <div className="mx-auto w-full max-w-[1248px] px-6 pb-28 pt-18">
      <ProjectsPageHeader />
      {children}
    </div>
  )
}
