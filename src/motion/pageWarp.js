import { projectsChildPaths } from '../data/navigation'

export const PRE_WARP_MS = 270
export const WARP_MS = 1125
export const WARP_START = PRE_WARP_MS
export const WARP_END = WARP_START + WARP_MS
export const POST_WARP_MS = 375
export const TOTAL_MS = WARP_END + POST_WARP_MS

const SPEED_RAMP_END = 405
const SPEED_HOLD_END = 923
const SPEED_SNAP_END = 1050
const COVER_IN = [90, 420]
const COVER_OUT = [945, 1110]
export const ROUTE_SWAP_AT = WARP_START + 555
export const REVEAL_GATE_AT = WARP_START + 900
export const ARRIVE_AT = WARP_START + 975
export const ARRIVE_MS = 330

export const REDUCED = { out: 140, in: 200 }

export function speedAt(t) {
  if (t <= 0) return 0.05
  if (t < SPEED_RAMP_END) {
    const u = t / SPEED_RAMP_END
    return 0.05 + 0.95 * u * u * u
  }
  if (t < SPEED_HOLD_END) return 1
  if (t < SPEED_SNAP_END) {
    const u = (t - SPEED_HOLD_END) / (SPEED_SNAP_END - SPEED_HOLD_END)
    const e = 1 - (1 - u) * (1 - u)
    return 1 - 0.96 * e
  }
  return 0.04
}

export function coverAt(t) {
  if (t <= COVER_IN[0]) return 0
  if (t < COVER_IN[1]) return smooth((t - COVER_IN[0]) / (COVER_IN[1] - COVER_IN[0]))
  if (t <= COVER_OUT[0]) return 1
  if (t < COVER_OUT[1]) return 1 - smooth((t - COVER_OUT[0]) / (COVER_OUT[1] - COVER_OUT[0]))
  return 0
}

export function bloomAt(t) {
  const s = t < SPEED_HOLD_END ? speedAt(Math.max(0, t - 80)) : speedAt(t)
  return s * s
}

export function canvasOpacityAt(t) {
  if (t < WARP_START) return t / WARP_START
  if (t < WARP_END) return 1
  return Math.max(0, 1 - (t - WARP_END) / POST_WARP_MS)
}

function smooth(u) {
  const x = Math.min(1, Math.max(0, u))
  return x * x * (3 - 2 * x)
}

const PROJECTS_FAMILY = ['/projects', ...projectsChildPaths]

export function isProjectsInternal(fromPath, toPath) {
  return PROJECTS_FAMILY.includes(fromPath) && PROJECTS_FAMILY.includes(toPath)
}
