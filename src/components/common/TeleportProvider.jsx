import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { TeleportContext } from '../../hooks/useTeleport'
import TeleportOverlay from './TeleportOverlay'

const CHARGE_MS = 140
const COVER_MS = 560
const REVEAL_MS = 440
const SWEEP_DELAY_MS = 120

const REDUCED = { charge: 0, cover: 220, reveal: 200 }

export default function TeleportProvider({ children }) {
  const navigate = useNavigate()
  const prefersReducedMotion = usePrefersReducedMotion()
  const [teleport, setTeleport] = useState(null)
  const lockRef = useRef(false)
  const timersRef = useRef([])

  useEffect(() => {
    const timers = timersRef.current
    return () => timers.forEach(clearTimeout)
  }, [])

  const startTeleport = useCallback(
    ({ id, to, tone, originX, sweepDirection }) => {
      if (lockRef.current) return
      lockRef.current = true

      const chargeMs = prefersReducedMotion ? REDUCED.charge : CHARGE_MS
      const coverMs = prefersReducedMotion ? REDUCED.cover : COVER_MS
      const revealMs = prefersReducedMotion ? REDUCED.reveal : REVEAL_MS
      const push = (fn, ms) => timersRef.current.push(setTimeout(fn, ms))
      const base = { id, tone, originX, sweepDirection }

      setTeleport({ ...base, phase: 'charge' })

      push(() => {
        setTeleport({ ...base, phase: 'cover' })

        push(() => {
          navigate(to, { state: { teleportEnter: true } })
          setTeleport({ ...base, phase: 'reveal' })

          push(() => {
            lockRef.current = false
            setTeleport(null)
          }, revealMs)
        }, coverMs)
      }, chargeMs)
    },
    [navigate, prefersReducedMotion],
  )

  const value = useMemo(
    () => ({ teleport, isTeleporting: teleport !== null, startTeleport }),
    [teleport, startTeleport],
  )

  return (
    <TeleportContext.Provider value={value}>
      {children}
      <TeleportOverlay
        teleport={teleport}
        isReduced={prefersReducedMotion}
        coverMs={prefersReducedMotion ? REDUCED.cover : COVER_MS}
        revealMs={prefersReducedMotion ? REDUCED.reveal : REVEAL_MS}
        sweepDelayMs={prefersReducedMotion ? 0 : SWEEP_DELAY_MS}
      />
    </TeleportContext.Provider>
  )
}
