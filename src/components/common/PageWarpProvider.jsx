import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { PageWarpContext } from '../../hooks/usePageWarp'
import {
  ARRIVE_AT,
  REDUCED,
  ROUTE_SWAP_AT,
  TOTAL_MS,
  WARP_START,
  isProjectsInternal,
} from '../../motion/pageWarp'
import { gameCategoryVisual, aiCategoryVisual, withReadinessTimeout } from '../../motion/projectsAssetReadiness'
import WarpCanvas from './WarpCanvas'

/* Real asset-readiness bound (see projectsAssetReadiness.js) — not a delay
   the warp always pays, a ceiling on how long it will ever wait for a
   decode that should already be finished. */
const PROJECTS_READY_TIMEOUT_MS = 400

/**
 * Owns the global page time-warp (owner spec) and its interaction lock.
 *
 * Trigger: one document-level capture listener on internal link clicks.
 * Running before React Router's own Link handler lets it `preventDefault()`
 * (which Link honours) and drive the navigation itself at the right moment —
 * so every primary-page link (Navbar, Hero CTAs, "View All …") warps without
 * each call site knowing about it. Explicitly NOT intercepted:
 *   - `.curtain` links (the approved Projects teleport owns those), and any
 *     hop that stays inside the Projects family (ANIMATION_SPEC.md 18.14) —
 *     one transition system per navigation event;
 *   - modified clicks, other buttons, external / new-tab / download links;
 *   - clicks on the current route (no-op).
 *
 * Phases (times in src/motion/pageWarp.js):
 *   engage  -> the whole page zooms out a hair, canvas fades in, Navbar
 *              begins its bend
 *   warp    -> the canvas runs the centred, reference-derived warp
 *     navigate() at ROUTE_SWAP_AT, under full cover — ScrollToTop's layout
 *     effect resets scroll in that same commit, so the destination is
 *     already at the top before the cover clears
 *   arrive  -> the whole destination zooms in from slightly receded while
 *              the cover clears; Navbar unbends
 *   (null)  -> everything unmounted; no renderer left running
 *
 * `originY` is the viewport centre in page space at click time, so the
 * pre-warp zoom recedes around what the user is actually looking at rather
 * than the middle of a tall document. The destination is at scrollTop 0,
 * so its zoom-in origin is simply half the viewport height.
 *
 * Lock: a ref, so two clicks in one frame cannot both pass; further link
 * clicks while a warp runs are swallowed (safest UX — no stacked warps, no
 * mid-flight destination changes).
 *
 * Reduced motion: no canvas, no depth — a quick crossfade around the same
 * route swap, with scroll reset and Navbar state unchanged.
 */
export default function PageWarpProvider({ children }) {
  const navigate = useNavigate()
  const prefersReducedMotion = usePrefersReducedMotion()
  const [warp, setWarp] = useState(null)
  const lockRef = useRef(false)
  const timersRef = useRef([])

  useEffect(() => {
    const timers = timersRef.current
    return () => timers.forEach(clearTimeout)
  }, [])

  const startWarp = useCallback(
    async (to) => {
      if (lockRef.current) return
      lockRef.current = true

      // Real asset-readiness gate (root cause fix, not a guess): the
      // Projects curtain artwork is decoded once at app boot
      // (projectsAssetReadiness.js), so this resolves essentially
      // instantly in the overwhelming, realistic case — it is here only to
      // guarantee the decode is actually finished before the destination
      // can ever be revealed, for the edge case of navigating to /projects
      // within the first instant of a cold app load. Bounded so a decode
      // failure can never hang navigation. Every other destination pays
      // nothing here.
      if (to === '/projects' || to.startsWith('/projects?')) {
        await withReadinessTimeout(PROJECTS_READY_TIMEOUT_MS)
      }

      const startedAt = performance.now()
      const originY = window.scrollY + window.innerHeight / 2
      const push = (fn, ms) => timersRef.current.push(setTimeout(fn, ms))
      const finish = () => {
        lockRef.current = false
        setWarp(null)
      }

      // Route state, not a prop or transient ref: it must be readable by the
      // destination's very first render, before first paint, the same way
      // the Projects teleport's `teleportEnter` flag works (Projects.jsx) —
      // so a global-warp arrival never plays a page's local mount entrance
      // (that entrance is for a genuine direct/cold visit only).
      const navigateState = { state: { fromPageWarp: true } }

      if (prefersReducedMotion) {
        setWarp({ to, startedAt, originY, phase: 'reduced-out' })
        push(() => {
          navigate(to, navigateState)
          setWarp({ to, startedAt, originY: window.innerHeight / 2, phase: 'reduced-in' })
          push(finish, REDUCED.in)
        }, REDUCED.out)
        return
      }

      setWarp({ to, startedAt, originY, phase: 'engage' })
      push(() => setWarp((w) => (w ? { ...w, phase: 'warp' } : w)), WARP_START)
      push(() => navigate(to, navigateState), ROUTE_SWAP_AT)
      push(() => setWarp((w) => (w ? { ...w, phase: 'arrive', originY: window.innerHeight / 2 } : w)), ARRIVE_AT)
      push(finish, TOTAL_MS)
    },
    [navigate, prefersReducedMotion],
  )

  useEffect(() => {
    const onClick = (event) => {
      if (event.defaultPrevented || event.button !== 0) return
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      const anchor = event.target.closest?.('a[href]')
      if (!anchor || anchor.closest('.curtain')) return
      if (anchor.target === '_blank' || anchor.hasAttribute('download')) return

      const url = new URL(anchor.href, window.location.href)
      if (url.origin !== window.location.origin) return
      // The browser URL is already current after any pushState, unlike a
      // React-rendered pathname, which can trail a transition-priority
      // router update by a frame.
      const current = window.location.pathname
      if (url.pathname === current) {
        event.preventDefault()
        return
      }
      if (isProjectsInternal(current, url.pathname)) return

      event.preventDefault()
      if (lockRef.current) return
      startWarp(url.pathname + url.search)
    }
    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [startWarp])

  const value = useMemo(
    () => ({
      warp,
      isWarping: warp !== null,
      // The route the indicator should already point at (the fireflies
      // start chasing at click time, not at the swap).
      pendingPath: warp?.to ? new URL(warp.to, window.location.origin).pathname : null,
    }),
    [warp],
  )

  return (
    <PageWarpContext.Provider value={value}>
      {/* Half of the Projects-arrival asset-readiness fix (the other half is
          the decode warm-up in projectsAssetReadiness.js, awaited in
          startWarp above). These <img> sources are otherwise not requested
          by the browser until ProjectsCurtainNav actually mounts — hidden
          behind the cover, well into the transition. This preload hint
          gives the network fetch the earliest possible start (app-shell
          mount, before any click); the decode() warm-up then closes the
          rest of the gap — fetched bytes alone don't guarantee a decoded,
          paintable bitmap. */}
      <link rel="preload" as="image" href={gameCategoryVisual} />
      <link rel="preload" as="image" href={aiCategoryVisual} />
      {children}
      {warp && !prefersReducedMotion && <WarpCanvas startedAt={warp.startedAt} />}
    </PageWarpContext.Provider>
  )
}
