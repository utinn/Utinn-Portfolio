import { statusColors } from '../../data/projects'

/**
 * Project status indicator — dot + label with the radar pulse of
 * ANIMATION_SPEC.md 16.1. Shared by every project card on the site (Home
 * Featured Works and both category pages) so the status language is defined
 * once.
 *
 * The color is set here, once, from the shared statusColors map;
 * `.status-dot` already falls back to currentColor when no --status-color
 * override is passed, so the dot inherits the same color instead of the
 * mapping being duplicated in two places.
 *
 * The status text is always rendered next to the dot, so the state never
 * depends on color alone (CLAUDE.md Section 15).
 */
export default function ProjectStatus({ status, className = '' }) {
  if (!status) return null

  return (
    <span
      className={`inline-flex shrink-0 items-center gap-2 text-caption font-medium ${className}`.trim()}
      style={{ color: statusColors[status] }}
    >
      <span aria-hidden="true" className="status-dot" />
      {status}
    </span>
  )
}
