/**
 * Wraps a Projects-ecosystem page so it can dissolve into, and resolve out of,
 * the teleport transition (owner correction pass; replaces the perspective
 * rotation of ANIMATION_SPEC.md 18.8).
 *
 * Only opacity and brightness change here — no transform. That is deliberate,
 * not an omission: the landing curtains are `position: fixed`, and a transform
 * on any ancestor would make them stage-relative boxes for the length of the
 * transition, collapsing the very full-height regions correction B asks for.
 * The directional feel now comes from where the teleport wash originates, not
 * from moving the page.
 *
 * `isEntering` is read once from route state when the page mounts and never
 * changes while it lives, so the resolve-in cannot replay on re-render.
 *
 * This is the only page transition that runs on these routes — the global
 * Navbar page warp must not be stacked on top of it (ANIMATION_SPEC.md 18.14).
 */
export default function DimensionStage({ isEntering = false, isExiting = false, className = '', children }) {
  // An exit always wins over a still-running entrance, so leaving early (a
  // return click within the resolve window) cannot animate against itself.
  const stateClass = isExiting ? 'dimension-stage--exiting' : isEntering ? 'dimension-stage--entering' : ''

  return <div className={`dimension-stage ${stateClass} ${className}`.trim()}>{children}</div>
}
