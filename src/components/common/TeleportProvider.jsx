import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { TeleportContext } from '../../hooks/useTeleport'
import TeleportOverlay from './TeleportOverlay'

/**
 * Owns the Projects teleport transition and its interaction lock
 * (INTERACTION_SPEC.md 13.5 / 28).
 *
 * Phases, in order:
 *   charge — the activated curtain intensifies in place; nothing else moves.
 *   cover  — particles surge out of that curtain and a bright wash floods the
 *            screen. The departing page dims into the light beneath it.
 *   (navigate happens at the end of cover, while the flood is opaque, so the
 *    swap itself is never visible)
 *   reveal — the flood fades and the destination resolves out of the light.
 *
 * The lock is a ref, not state, so two clicks in one frame cannot both pass.
 * It is released when the transition completes, which is also what unmounts
 * the overlay.
 */
/* PHASE TIMING — the single place the transition's tempo is configured.
   Cover and reveal are also handed to the overlay as CSS variables so the
   sweep band's two animations stay locked to these numbers.

   REVEAL_MS deliberately equals the band's own cover run (COVER_MS minus
   SWEEP_DELAY_MS). The band travels the same distance in each phase, so equal
   durations plus the matched easing pair in curtains.css give it continuous
   velocity across the handoff instead of a stop and restart. Changing one of
   these three without the others will reintroduce that discontinuity. */
const CHARGE_MS = 140
const COVER_MS = 560
const REVEAL_MS = 440
/* The sweep band enters late inside the cover phase so the particle field
   crosses the dark page ahead of it; it still finishes exactly on the phase
   boundary, so navigation always happens under a fully covered screen. */
const SWEEP_DELAY_MS = 120

/* 18.15 / section 10 reduced motion: a short, dim directional sweep with only
   a token particle field (count in TeleportOverlay.jsx). The reveal stays
   directional — only its scale and richness are cut. */
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
          // Navigated under an opaque flood: the destination mounts and plays
          // its own resolve-in while the light is still covering it.
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
