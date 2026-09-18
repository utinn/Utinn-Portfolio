import { useEffect, useRef, useState } from 'react'
import { certificates } from '../../data/certificates'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import CertificateCard from './CertificateCard'

// ANIMATION_SPEC.md 23.2 "Grid Filtering Transition" recommends a fast,
// restrained fade — certificates that no longer match fade out briefly, the
// grid updates, then matching certificates fade in. Implemented as one
// whole-grid crossfade rather than per-card enter/exit bookkeeping, which
// keeps the swap simple while still reading as "fade out -> update -> fade
// in" (CLAUDE.md Section 19 anti-over-engineering).
const FADE_OUT_MS = 160

// Initial-entrance stagger (ANIMATION_SPEC.md Section 8: ~60-120ms between
// items, capped so large collections don't chain indefinitely).
const STAGGER_MS = 80
const MAX_STAGGER_ITEMS = 6

export default function CertificateGrid({ activeCategory, onOpenCertificate, revealed = true }) {
  const prefersReducedMotion = usePrefersReducedMotion()
  const [displayCategory, setDisplayCategory] = useState(activeCategory)
  const [isFading, setIsFading] = useState(false)
  const timeoutRef = useRef(null)

  useEffect(() => {
    if (activeCategory === displayCategory) return undefined

    if (prefersReducedMotion) {
      setDisplayCategory(activeCategory)
      return undefined
    }

    setIsFading(true)
    timeoutRef.current = setTimeout(() => {
      setDisplayCategory(activeCategory)
      setIsFading(false)
    }, FADE_OUT_MS)

    return () => clearTimeout(timeoutRef.current)
  }, [activeCategory, displayCategory, prefersReducedMotion])

  const items = displayCategory === 'all' ? certificates : certificates.filter((cert) => cert.category === displayCategory)

  if (items.length === 0) {
    return (
      <div
        className={`cert-grid-transition py-20 text-center text-body text-muted ${isFading ? 'cert-grid-transition-hidden' : ''}`}
      >
        No certificates in this category yet.
      </div>
    )
  }

  return (
    <div
      className={`cert-grid-transition grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 ${
        isFading ? 'cert-grid-transition-hidden' : ''
      }`}
    >
      {items.map((certificate, index) => (
        <CertificateCard
          key={certificate.id}
          certificate={certificate}
          onOpen={onOpenCertificate}
          isVisible={revealed}
          revealDelayMs={Math.min(index, MAX_STAGGER_ITEMS) * STAGGER_MS}
        />
      ))}
    </div>
  )
}
