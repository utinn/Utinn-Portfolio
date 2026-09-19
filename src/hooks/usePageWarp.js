import { createContext, useContext } from 'react'

export const PageWarpContext = createContext(null)

export function usePageWarp() {
  const value = useContext(PageWarpContext)
  if (!value) throw new Error('usePageWarp must be used within a PageWarpProvider')
  return value
}
