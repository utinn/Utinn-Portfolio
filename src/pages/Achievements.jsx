import { useEffect, useState } from 'react'
import SectionHeader, { SECTION_CONTENT_DELAY_MS } from '../components/common/SectionHeader'
import AchievementsCarousel from '../components/sections/AchievementsCarousel'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { useScrollReveal } from '../hooks/useScrollReveal'

export default function Achievements() {
  const { ref, isVisible } = useScrollReveal()
  const prefersReducedMotion = usePrefersReducedMotion()
  const [contentStarted, setContentStarted] = useState(false)

  useEffect(() => {
    if (!isVisible || contentStarted) return undefined
    const id = setTimeout(() => setContentStarted(true), prefersReducedMotion ? 0 : SECTION_CONTENT_DELAY_MS)
    return () => clearTimeout(id)
  }, [isVisible, contentStarted, prefersReducedMotion])

  return (
    <div className="pb-28 pt-24">
      <header ref={ref} className="mx-auto w-full max-w-[1076px] px-6">
        <SectionHeader as="h1" title="Achievements" revealed={isVisible} className="text-center">
          Few Milestones that reflect the work, growth, and challenges along my amazing journey
        </SectionHeader>
      </header>

      <div className="mt-[70px] px-6">
        <AchievementsCarousel revealed={contentStarted} />
      </div>
    </div>
  )
}
