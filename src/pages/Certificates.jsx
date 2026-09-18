import { useEffect, useState } from 'react'
import SectionHeader, { SECTION_CONTENT_DELAY_MS } from '../components/common/SectionHeader'
import CertificateFilterBar from '../components/sections/CertificateFilterBar'
import CertificateGrid from '../components/sections/CertificateGrid'
import CertificateLightbox from '../components/sections/CertificateLightbox'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { useScrollReveal } from '../hooks/useScrollReveal'

/**
 * Certificates page (CLAUDE.md Section 9, composed from
 * docs/figma-reference/certificates/CertificatesPage.png). The filter bar
 * (All/Courses/Programs/Competitions) is an owner-approved addition on top
 * of the Figma grid (INTERACTION_SPEC.md Section 24), built on the
 * data-driven certificate grid plus the certificate preview lightbox
 * (Section 25).
 *
 * Entrance follows the same site-wide header cascade as Achievements/Skills
 * (title rises, caption follows, then the section's own content starts) —
 * the implementation prompt's requested order is title -> subtitle -> filter
 * bar -> grid, which this reproduces: the filter bar fades in once
 * `contentStarted`, and the grid's own per-card stagger (CertificateGrid.jsx)
 * starts slightly after it.
 */
export default function Certificates() {
  const { ref, isVisible } = useScrollReveal()
  const prefersReducedMotion = usePrefersReducedMotion()
  const [contentStarted, setContentStarted] = useState(false)
  const [activeCategory, setActiveCategory] = useState('all')
  const [activeCertificate, setActiveCertificate] = useState(null)

  useEffect(() => {
    if (!isVisible || contentStarted) return undefined
    const id = setTimeout(() => setContentStarted(true), prefersReducedMotion ? 0 : SECTION_CONTENT_DELAY_MS)
    return () => clearTimeout(id)
  }, [isVisible, contentStarted, prefersReducedMotion])

  return (
    <div className="pb-28 pt-24">
      <header ref={ref} className="mx-auto w-full max-w-3xl px-6 text-center">
        <SectionHeader as="h1" title="Certificates" revealed={isVisible} className="mx-auto">
          Collection of Certificates that reflects my learning, competition, and exploration journey
        </SectionHeader>
      </header>

      <div className={`cert-filter-reveal mt-12 flex justify-center px-6 ${contentStarted ? 'cert-filter-reveal-visible' : ''}`}>
        <CertificateFilterBar activeCategory={activeCategory} onChange={setActiveCategory} />
      </div>

      <div className="mx-auto mt-10 w-full max-w-[1180px] px-6">
        <CertificateGrid
          activeCategory={activeCategory}
          onOpenCertificate={setActiveCertificate}
          revealed={contentStarted}
        />
      </div>

      <CertificateLightbox
        certificate={activeCertificate}
        open={Boolean(activeCertificate)}
        onClose={() => setActiveCertificate(null)}
      />
    </div>
  )
}
