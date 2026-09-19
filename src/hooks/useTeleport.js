import { createContext, useContext } from 'react'

export const TeleportContext = createContext(null)

export function useTeleport() {
  const value = useContext(TeleportContext)
  if (!value) throw new Error('useTeleport must be used within a TeleportProvider')
  return value
}
