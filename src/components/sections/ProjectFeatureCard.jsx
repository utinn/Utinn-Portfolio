import Button from '../common/Button'
import ImagePlaceholder from '../common/ImagePlaceholder'
import Label from '../common/Label'
import ProjectStatus from '../common/ProjectStatus'
import ProjectCardSurface from './ProjectCardSurface'

export default function ProjectFeatureCard({ project }) {
  const showLiveDemo = Boolean(project.liveUrl) || project.status === 'Completed'

  return (
    <ProjectCardSurface className="grid gap-x-7 gap-y-8 lg:grid-cols-[37%_1fr]">
      <div className="flex min-w-0 flex-col gap-6">
        {project.images.map((image) => (
          <div key={image.requiredPath ?? image.src} className="outline-shine rounded-[var(--radius-card)]">
            <div className="aspect-[16/9] overflow-hidden rounded-[var(--radius-card)] border border-white/15">
              {image.src ? (
                <img src={image.src} alt={image.alt} loading="lazy" className="h-full w-full object-cover" />
              ) : (
                <ImagePlaceholder label={`${image.alt} coming soon`} />
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex min-w-0 flex-col">
        <div className="flex items-start justify-between gap-6">
          <h3 className="min-w-0 max-w-[32ch] text-2xl font-sans font-bold leading-snug text-foreground">
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

        {project.keyFeatures?.length > 0 && (
          <div className="mt-4">
            <h4 className="text-body-lg font-sans font-bold text-foreground">Key Features :</h4>
            <ul className="mt-3 space-y-4">
              {project.keyFeatures.map((feature) => (
                <li key={feature} className="flex gap-3 text-body text-muted">
                  <span aria-hidden="true" className="feature-bullet-glow mt-2 h-1.5 w-1.5 shrink-0 rounded-full" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-8 flex flex-wrap items-center gap-x-10 gap-y-3">
          <Button href={project.githubUrl} external size="sm" disabled={!project.githubUrl}>
            GitHub
          </Button>
          {showLiveDemo && (
            <Button href={project.liveUrl} external size="sm" disabled={!project.liveUrl}>
              Live Demo
            </Button>
          )}
        </div>
      </div>
    </ProjectCardSurface>
  )
}
