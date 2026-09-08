import Button from '../common/Button'
import Label from '../common/Label'
import ProjectStatus from '../common/ProjectStatus'
import ProjectCardSurface from './ProjectCardSurface'

/**
 * Compact project card for "Other Related Projects". Same design language as
 * the featured card — same surface, status indicator, tag chips and shared
 * directional button — but simpler: no screenshots and no Key Features list,
 * matching docs/figma-reference/projects/AiProjectsPage.png.
 *
 * The button row is pushed to the bottom so cards in a row stay visually
 * balanced whatever length their title/description runs to, without any text
 * being clipped.
 */
export default function ProjectSummaryCard({ project, revealDelayMs = 0 }) {
  return (
    <ProjectCardSurface revealDelayMs={revealDelayMs} variant="other" className="flex h-full flex-col">
      <div className="flex items-start justify-between gap-4">
        <h3 className="min-w-0 max-w-[28ch] text-2xl font-sans font-bold leading-snug text-foreground">
          {project.title}
        </h3>
        <ProjectStatus status={project.status} className="mt-1" />
      </div>

      <div className="mt-4 flex flex-wrap gap-2.5">
        {project.tags.map((tag) => (
          <Label key={tag} size="sm">
            {tag}
          </Label>
        ))}
      </div>

      <p className="mt-4 text-body text-muted">{project.description}</p>

      <div className="mt-auto flex flex-wrap items-center gap-x-10 gap-y-3 pt-6">
        <Button href={project.githubUrl} external size="sm" disabled={!project.githubUrl}>
          GitHub
        </Button>
      </div>
    </ProjectCardSurface>
  )
}
