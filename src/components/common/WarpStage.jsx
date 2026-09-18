import { usePageWarp } from '../../hooks/usePageWarp'

/**
 * The page-content wrapper the global warp animates (owner spec, correction
 * pass): ONE full-page zoom out before the warp, ONE full-page zoom in after
 * it. Nothing inside is animated individually — the page is treated as a
 * single spatial layer. Deliberately wraps only <main>; the Navbar is a
 * sibling with its own subtle bend and stays visible above the warp.
 *
 * `--warp-origin-y` is the viewport centre in page space (captured by
 * PageWarpProvider), so the zoom recedes around what is on screen rather
 * than the middle of a tall document. All motion is CSS keyed off
 * `data-warp-phase` (animations.css "26. Global page warp"). When idle the
 * wrapper carries no transform or filter at all, so it never becomes a
 * containing block for the pages' own fixed-position lightboxes.
 */
export default function WarpStage({ children }) {
  const { warp } = usePageWarp()

  return (
    <div
      className="warp-stage"
      data-warp-phase={warp?.phase}
      style={{ '--warp-origin-y': `${Math.round(warp?.originY ?? 0)}px` }}
    >
      {children}
    </div>
  )
}
