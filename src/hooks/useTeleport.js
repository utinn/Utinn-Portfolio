import { createContext, useContext } from 'react'

/**
 * Shared state for the Projects teleport navigation (ANIMATION_SPEC.md 18.7 /
 * 18.14, as revised by the owner's correction pass).
 *
 * The transition has to outlive the page that starts it — the bright wash must
 * still be covering the screen while the destination mounts underneath it — so
 * the state lives above the router outlet in TeleportProvider rather than in
 * the departing page.
 *
 * Context and hook live here, apart from the provider component, so the
 * provider file stays a component-only module.
 */
export const TeleportContext = createContext(null)

export function useTeleport() {
  const value = useContext(TeleportContext)
  if (!value) throw new Error('useTeleport must be used within a TeleportProvider')
  return value
}
