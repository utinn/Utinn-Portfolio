import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { PageWarpContext } from '../../hooks/usePageWarp'
import {
  ARRIVE_AT,
  REDUCED,
  REVEAL_GATE_AT,
  ROUTE_SWAP_AT,
  TOTAL_MS,
  WARP_START,
  isProjectsInternal,
} from '../../motion/pageWarp'
import { gameCategoryVisual, aiCategoryVisual } from '../../motion/projectsAssetReadiness'
import WarpCanvas from './WarpCanvas'

const MAX_HOLD_MS = 1500

const afterNextPaint = () =>
  new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())))

function createClock(startedAt) {
  return {
    startedAt,
    releasedAt: null,
    elapsed(now) {
      const raw = now - this.startedAt
      if (raw <= REVEAL_GATE_AT) return raw
      if (this.releasedAt === null) return REVEAL_GATE_AT
      return REVEAL_GATE_AT + Math.max(0, now - this.releasedAt)
    },
  }
}

export default function PageWarpProvider({ children }) {
  const navigate = useNavigate()
  const location = useLocation()
  const prefersReducedMotion = usePrefersReducedMotion()
  const [warp, setWarp] = useState(null)
  const lockRef = useRef(false)
  const timersRef = useRef([])
  const arrivalRef = useRef(null)

  useEffect(() => {
    const timers = timersRef.current
    return () => timers.forEach(clearTimeout)
  }, [])

  useLayoutEffect(() => {
    const arrival = arrivalRef.current
    if (arrival && location.pathname === arrival.pathname) arrival.commit()
  }, [location.key, location.pathname])

  const holdArrivalUntil = useCallback((promise) => {
    const arrival = arrivalRef.current
    if (arrival && !arrival.committed) arrival.gates.push(promise)
  }, [])

  const startWarp = useCallback(
    (to) => {
      if (lockRef.current) return
      lockRef.current = true

      const startedAt = performance.now()
      const originY = window.scrollY + window.innerHeight / 2
      const push = (fn, ms) => timersRef.current.push(setTimeout(fn, ms))
      const finish = () => {
        lockRef.current = false
        arrivalRef.current = null
        setWarp(null)
      }

      const navigateState = { state: { fromPageWarp: true } }
      const pathname = new URL(to, window.location.origin).pathname

      if (prefersReducedMotion) {
        setWarp({ to, startedAt, originY, phase: 'reduced-out' })
        push(() => {
          navigate(to, navigateState)
          setWarp({ to, startedAt, originY: window.innerHeight / 2, phase: 'reduced-in' })
          push(finish, REDUCED.in)
        }, REDUCED.out)
        return
      }

      const clock = createClock(startedAt)
      setWarp({ to, startedAt, originY, clock, phase: 'engage' })
      push(() => setWarp((w) => (w ? { ...w, phase: 'warp' } : w)), WARP_START)

      push(() => {
        let resolveCommitted
        const committed = new Promise((resolve) => {
          resolveCommitted = resolve
        })
        const arrival = {
          pathname,
          gates: [],
          committed: false,
          commit: () => {
            arrival.committed = true
            resolveCommitted()
          },
        }
        arrivalRef.current = arrival

        const sceneReady = committed.then(() => Promise.all(arrival.gates)).then(afterNextPaint)
        const ceiling = new Promise((resolve) =>
          push(resolve, startedAt + REVEAL_GATE_AT + MAX_HOLD_MS - performance.now()),
        )

        navigate(to, navigateState)

        Promise.race([sceneReady, ceiling]).then(() => {
          if (arrivalRef.current !== arrival) return
          const now = performance.now()
          const releasedAt = Math.max(now, startedAt + REVEAL_GATE_AT)
          clock.releasedAt = releasedAt
          const at = (ms) => releasedAt + (ms - REVEAL_GATE_AT) - now
          push(
            () => setWarp((w) => (w ? { ...w, phase: 'arrive', originY: window.innerHeight / 2 } : w)),
            at(ARRIVE_AT),
          )
          push(finish, at(TOTAL_MS))
        })
      }, ROUTE_SWAP_AT)
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
      pendingPath: warp?.to ? new URL(warp.to, window.location.origin).pathname : null,
      holdArrivalUntil,
    }),
    [warp, holdArrivalUntil],
  )

  return (
    <PageWarpContext.Provider value={value}>
      <link rel="preload" as="image" href={gameCategoryVisual} />
      <link rel="preload" as="image" href={aiCategoryVisual} />
      {children}
      {warp?.clock && <WarpCanvas clock={warp.clock} />}
    </PageWarpContext.Provider>
  )
}
