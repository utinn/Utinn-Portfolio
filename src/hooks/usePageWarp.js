import { createContext, useContext } from 'react'

/**
 * Shared state for the global page time-warp (owner spec). Lives above the
 * router outlet in PageWarpProvider because the transition must outlive the
 * page that starts it — the warp canvas is still covering the screen while
 * the destination mounts underneath it.
 *
 * Context and hook are kept apart from the provider component so the
 * provider file stays a component-only module (same split as useTeleport).
 */
export const PageWarpContext = createContext(null)

export function usePageWarp() {
  const value = useContext(PageWarpContext)
  if (!value) throw new Error('usePageWarp must be used within a PageWarpProvider')
  return value
}
