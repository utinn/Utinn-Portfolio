import { useEffect, useRef, useState } from 'react'
import { certificates } from '../../data/certificates'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import CertificateCard from './CertificateCard'

const FADE_OUT_MS = 160

const STAGGER_MS = 80
const MAX_STAGGER_ITEMS = 6

const INITIAL_BATCH_SIZE = 9
const BATCH_SIZE = 9
const BATCH_ROOT_MARGIN = '600px'

export default function CertificateGrid({ activeCategory, onOpenCertificate, revealed = true }) {
  const prefersReducedMotion = usePrefersReducedMotion()
  const [displayCategory, setDisplayCategory] = useState(activeCategory)
  const [isFading, setIsFading] = useState(false)
  const [visibleCount, setVisibleCount] = useState(INITIAL_BATCH_SIZE)
  const timeoutRef = useRef(null)
  const sentinelRef = useRef(null)

  useEffect(() => {
    if (activeCategory === displayCategory) return undefined

    if (prefersReducedMotion) {
      setDisplayCategory(activeCategory)
      setVisibleCount(INITIAL_BATCH_SIZE)
      return undefined
    }

    setIsFading(true)
    timeoutRef.current = setTimeout(() => {
      setDisplayCategory(activeCategory)
      setVisibleCount(INITIAL_BATCH_SIZE)
      setIsFading(false)
    }, FADE_OUT_MS)

    return () => clearTimeout(timeoutRef.current)
  }, [activeCategory, displayCategory, prefersReducedMotion])

  const items = displayCategory === 'all' ? certificates : certificates.filter((cert) => cert.category === displayCategory)
  const visibleItems = items.slice(0, visibleCount)
  const hasMore = visibleCount < items.length

  useEffect(() => {
    if (!hasMore) return undefined
    const sentinel = sentinelRef.current
    if (!sentinel) return undefined

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisibleCount((count) => Math.min(count + BATCH_SIZE, items.length))
        }
      },
      { rootMargin: BATCH_ROOT_MARGIN },
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [hasMore, items.length, visibleCount])

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
    <>
      <div
        className={`cert-grid-transition grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 sm:gap-x-10 lg:grid-cols-3 lg:gap-x-14 ${
          isFading ? 'cert-grid-transition-hidden' : ''
        }`}
      >
        {visibleItems.map((certificate, index) => (
          <CertificateCard
            key={certificate.id}
            certificate={certificate}
            onOpen={onOpenCertificate}
            isVisible={revealed}
            revealDelayMs={Math.min(index, MAX_STAGGER_ITEMS) * STAGGER_MS}
          />
        ))}
      </div>
      {hasMore && <div ref={sentinelRef} aria-hidden="true" className="h-px w-full" />}
    </>
  )
}
