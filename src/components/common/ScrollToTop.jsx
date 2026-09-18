import { useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Resets scroll position to the top on every route change (owner
 * instruction) — one centralized place instead of a `window.scrollTo()` in
 * every page. `useLayoutEffect` (not `useEffect`) so the reset commits
 * synchronously with the new route's DOM, before the browser paints it —
 * the destination never flashes at the previous page's scroll offset.
 *
 * `behavior: 'auto'` is deliberate: an instant jump, never a smooth scroll,
 * per the owner's explicit instruction.
 *
 * Works unmodified with the Projects teleport transition
 * (TeleportProvider.jsx): `navigate()` there fires while the screen is fully
 * covered by the opaque flood, and React commits the new route's layout
 * effects synchronously as part of that same update — so this always runs
 * well before the `reveal` phase starts uncovering the destination.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation()

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [pathname])

  return null
}
