import { useEffect, useState } from 'react'
import SectionHeader, { SECTION_CONTENT_DELAY_MS } from '../components/common/SectionHeader'
import PageContainer from '../components/layout/PageContainer'
import CertificateFilterBar from '../components/sections/CertificateFilterBar'
import CertificateGrid from '../components/sections/CertificateGrid'
import CertificateLightbox from '../components/sections/CertificateLightbox'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { useScrollReveal } from '../hooks/useScrollReveal'

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

      <PageContainer className="mt-10">
        <CertificateGrid
          activeCategory={activeCategory}
          onOpenCertificate={setActiveCertificate}
          revealed={contentStarted}
        />
      </PageContainer>

      <CertificateLightbox
        certificate={activeCertificate}
        open={Boolean(activeCertificate)}
        onClose={() => setActiveCertificate(null)}
      />
    </div>
  )
}
