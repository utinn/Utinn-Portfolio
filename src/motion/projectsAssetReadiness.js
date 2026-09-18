import gameCategoryVisual from '../assets/images/projects/GameLogo.png'
import aiCategoryVisual from '../assets/images/projects/AILogo.png'

/**
 * Real asset-readiness for the Projects landing curtains (owner debugging
 * pass — root cause of the global-warp arrival pop-in).
 *
 * `<link rel="preload">` alone only guarantees the browser has fetched the
 * BYTES into cache — it does not guarantee the image has been DECODED into
 * a paintable bitmap. The first time a given image resource is actually
 * used by an `<img>`, the browser still has to decode it, and for these two
 * PNGs that decode was the remaining, un-closed gap: preloading shortened
 * the network wait but did nothing about decode time, so on a cold run the
 * artwork could still paint in a frame or two after the gradients/text
 * (which are pure CSS, already correct) were already visible.
 *
 * `HTMLImageElement.decode()` returns a promise that resolves only once the
 * image is fully decoded and ready to paint with zero additional cost — and
 * the resulting decoded bitmap is what the browser reuses when the real
 * `<img>` in CurtainSurface.jsx later renders the same URL, so decoding once
 * here removes the decode cost from the critical path entirely rather than
 * moving it around.
 *
 * Kicked off once, at module load — i.e. at app boot, long before any
 * navigation can occur — so by the time a real user actually warps to
 * /projects this has virtually always already resolved. PageWarpProvider
 * awaits it (bounded, see withReadinessTimeout) before starting a warp
 * bound for /projects, which is a genuine readiness gate, not a clock.
 */
function decodeImage(src) {
  const img = new Image()
  img.src = src
  if (typeof img.decode !== 'function') return Promise.resolve()
  // Swallow decode failures (e.g. the image 404s) — readiness must never
  // hang navigation, and the <img> tag's own onError handling (if any) is
  // unaffected by this warm-up failing.
  return img.decode().catch(() => {})
}

export const projectsAssetsReady = Promise.all([decodeImage(gameCategoryVisual), decodeImage(aiCategoryVisual)]).then(
  () => true,
)

/**
 * Resolves as soon as `projectsAssetsReady` does, or after `ms` — whichever
 * comes first. The bound exists only so a genuine decode failure can never
 * stall navigation forever; it is not the mechanism startWarp relies on in
 * the normal case, where `projectsAssetsReady` has already resolved (at app
 * boot) long before this is ever called.
 */
export function withReadinessTimeout(ms) {
  return new Promise((resolve) => {
    let settled = false
    const settle = () => {
      if (settled) return
      settled = true
      resolve()
    }
    projectsAssetsReady.then(settle)
    setTimeout(settle, ms)
  })
}

export { gameCategoryVisual, aiCategoryVisual }
