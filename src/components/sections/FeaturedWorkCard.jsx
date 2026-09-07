import { statusColors } from '../../data/projects'
import Button from '../common/Button'
import ImagePlaceholder from '../common/ImagePlaceholder'
import Label from '../common/Label'

/**
 * Single Featured Work card (Home -> Featured Works). Status radar pulse:
 * ANIMATION_SPEC.md 16.1. Screenshot moving outline shine: ANIMATION_SPEC.md
 * 17. GitHub/Live Demo destinations: INTERACTION_SPEC.md 10.1 — rendered
 * disabled when no real URL has been supplied yet (see projects.js).
 *
 * `revealSide`/`isVisible` drive the converging card entrance (owner
 * correction pass, animations.css `.fw-card-reveal*`) — the parent
 * FeaturedWorks section owns the single scroll trigger both cards share.
 */
export default function FeaturedWorkCard({ project, revealSide = 'left', isVisible = true, revealDelayMs = 0 }) {
  return (
    <article
      className={`fw-card-reveal fw-card-reveal-${revealSide} ${isVisible ? 'fw-card-reveal-visible' : ''} flex h-full flex-col rounded-[var(--radius-card)] border border-white/10 bg-panel/50 p-6 sm:p-8`}
      style={{ '--reveal-delay': `${revealDelayMs}ms` }}
    >
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-xl font-sans font-bold text-foreground">{project.title}</h3>
        {/* Text color is set here, once, from the shared statusColors map;
            .status-dot's own CSS already falls back to currentColor when no
            --status-color override is passed, so the dot inherits the same
            color instead of the mapping being duplicated in two places. */}
        <span
          className="mt-1 inline-flex shrink-0 items-center gap-2 text-caption font-medium"
          style={{ color: statusColors[project.status] }}
        >
          <span aria-hidden="true" className="status-dot" />
          {project.status}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <Label key={tag} size="sm">
            {tag}
          </Label>
        ))}
      </div>

      {/* outline-shine's glow ring must extend slightly outside its own box
          (ANIMATION_SPEC.md 17), so it can't share an element with the
          overflow-hidden that crops the screenshot — split into two boxes. */}
      <div className="outline-shine mt-5 rounded-[var(--radius-card)]">
        <div className="aspect-[16/10] overflow-hidden rounded-[var(--radius-card)] border border-white/15">
          {project.image ? (
            <img src={project.image} alt={`${project.title} screenshot`} className="h-full w-full object-cover" />
          ) : (
            <ImagePlaceholder label={`${project.title} screenshot coming soon`} />
          )}
        </div>
      </div>

      <p className="mt-5 text-body text-muted">{project.description}</p>

      {project.keyFeatures?.length > 0 && (
        <div className="mt-5">
          <h4 className="text-body font-sans font-bold text-foreground">Key Features :</h4>
          <ul className="mt-3 space-y-2">
            {project.keyFeatures.map((feature) => (
              <li key={feature} className="flex gap-2 text-body text-muted">
                <span aria-hidden="true" className="feature-bullet-glow mt-2 h-1.5 w-1.5 shrink-0 rounded-full" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-3">
        <Button href={project.githubUrl} external size="sm" disabled={!project.githubUrl}>
          GitHub
        </Button>
        {(project.liveUrl || project.status === 'Completed') && (
          <Button href={project.liveUrl} external size="sm" disabled={!project.liveUrl}>
            Live Demo
          </Button>
        )}
      </div>
    </article>
  )
}
