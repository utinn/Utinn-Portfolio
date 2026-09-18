import { projectsChildPaths } from '../data/navigation'

/**
 * ============================================================================
 * GLOBAL PAGE TIME-WARP — timeline and envelopes (owner spec, correction pass).
 * ============================================================================
 *
 * Reverse-engineered from docs/page_animation_frames/ (one continuous
 * hyperspace clip): dot field -> edge dots elongate radially first ->
 * full radial streaks -> streaks lengthen and bloom at the RIM while a dark
 * "tunnel mouth" persists at the vanishing point -> sustained peak -> a hard
 * collapse from streaks back to dots -> calm starfield. Compressed here to
 * the owner's ~1.5s core.
 *
 * Mental model (correction pass): ONE centred warp + full-page zoom out +
 * full-page zoom in + a visible, subtly distorted Navbar. The tunnel always
 * converges on the viewport centre — there is no navigation-direction
 * geometry anywhere in this system any more.
 *
 * All times are milliseconds from the moment navigation is requested.
 *
 *   0 ......... PRE_WARP_MS    engage: whole page zooms out a hair, Navbar
 *                              begins its bend, canvas fades in
 *   WARP_START  +WARP_MS       the warp proper
 *     ROUTE_SWAP_AT            route + scroll reset, under full cover; the
 *                              destination mounts and its top-of-page
 *                              content settles while still hidden
 *     ARRIVE_AT                destination zooms in from slightly receded
 *                              while the cover clears; Navbar unbends
 *   WARP_END ... TOTAL_MS      post-warp: leftover dots fade
 *
 * Speed pass #2 (owner correction): the previous pass made the core warp
 * ~2x faster (1500 -> 750) but landed slightly too fast to read comfortably.
 * This pass takes those current values and multiplies the three coarse
 * phases — pre-warp, core warp, post-warp — by 1.5x (180 -> 270,
 * 750 -> 1125, 250 -> 375), and scales every internal core-warp sub-phase
 * offset (ramp, hold, snap, cover in/out, swap, arrive) by that identical
 * 1.5x factor, so the reference's temporal structure and every internal
 * ratio (e.g. how long the destination sits under a fully opaque cover
 * before it starts to clear) is preserved exactly, just stretched. This is
 * NOT a revert to the original 1500ms warp — the total (1770ms) stays well
 * under the original 1950ms.
 */
export const PRE_WARP_MS = 270
export const WARP_MS = 1125
export const WARP_START = PRE_WARP_MS
export const WARP_END = WARP_START + WARP_MS
export const POST_WARP_MS = 375
export const TOTAL_MS = WARP_END + POST_WARP_MS // 1770

/* Inside the warp (0..WARP_MS): */
const SPEED_RAMP_END = 405 // ease-in to full speed (reference: onset is fast)
const SPEED_HOLD_END = 923 // sustained peak
const SPEED_SNAP_END = 1050 // the hard collapse back to dots
const COVER_IN = [90, 420] // dark backdrop reaches full opacity (t=690)
const COVER_OUT = [945, 1110] // ...and clears as we drop out (t=1215-1380)
/* Swap as soon as the cover is fully opaque: that gives the destination the
   longest possible run under cover (~420ms before the cover starts to
   clear, ~555ms before it is gone) for its own mount-time entrances to
   settle, so it is revealed as one already-formed page. */
export const ROUTE_SWAP_AT = WARP_START + 555 // = 825, cover 1.0 from 690
export const ARRIVE_AT = WARP_START + 975 // = 1245, cover ~0.9
export const ARRIVE_MS = 330

/* Reduced motion: no canvas, no depth, no Navbar bend — a quick crossfade. */
export const REDUCED = { out: 140, in: 200 }

/* Speed the particles fly at, 0..1. Unit-less; WarpCanvas scales it. */
export function speedAt(t) {
  if (t <= 0) return 0.05
  if (t < SPEED_RAMP_END) {
    const u = t / SPEED_RAMP_END
    return 0.05 + 0.95 * u * u * u // cubic ease-in: creeps, then slams
  }
  if (t < SPEED_HOLD_END) return 1
  if (t < SPEED_SNAP_END) {
    const u = (t - SPEED_HOLD_END) / (SPEED_SNAP_END - SPEED_HOLD_END)
    const e = 1 - (1 - u) * (1 - u) // ease-out snap
    return 1 - 0.96 * e
  }
  return 0.04 // drifting dots after we drop out
}

/* Opacity of the dark backdrop that guarantees full coverage at the swap. */
export function coverAt(t) {
  if (t <= COVER_IN[0]) return 0
  if (t < COVER_IN[1]) return smooth((t - COVER_IN[0]) / (COVER_IN[1] - COVER_IN[0]))
  if (t <= COVER_OUT[0]) return 1
  if (t < COVER_OUT[1]) return 1 - smooth((t - COVER_OUT[0]) / (COVER_OUT[1] - COVER_OUT[0]))
  return 0
}

/* Rim bloom (the reference's white-out): lags speed a little on the way up
   (the glow builds after the streaks form) but drops WITH it on the snap —
   the reference's brightness collapses in the same instant as the streaks. */
export function bloomAt(t) {
  const s = t < SPEED_HOLD_END ? speedAt(Math.max(0, t - 80)) : speedAt(t)
  return s * s
}

/* Canvas layer opacity across the WHOLE transition (t from request). */
export function canvasOpacityAt(t) {
  if (t < WARP_START) return t / WARP_START // fades in during engage
  if (t < WARP_END) return 1
  return Math.max(0, 1 - (t - WARP_END) / POST_WARP_MS) // dots fade after
}

function smooth(u) {
  const x = Math.min(1, Math.max(0, u))
  return x * x * (3 - 2 * x)
}

const PROJECTS_FAMILY = ['/projects', ...projectsChildPaths]

/* The Projects curtain system owns every hop inside its own family
   (ANIMATION_SPEC.md 18.14) — the global warp must never run for those. */
export function isProjectsInternal(fromPath, toPath) {
  return PROJECTS_FAMILY.includes(fromPath) && PROJECTS_FAMILY.includes(toPath)
}
