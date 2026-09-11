import { useEffect, useState } from 'react'
import SectionHeader, { SECTION_CONTENT_DELAY_MS } from '../components/common/SectionHeader'
import AchievementsCarousel from '../components/sections/AchievementsCarousel'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { useScrollReveal } from '../hooks/useScrollReveal'

/**
 * Dedicated Achievements page (CLAUDE.md Section 9, INTERACTION_SPEC.md
 * Section 22), composed from
 * docs/figma-reference/achievements/AchivementsPage.png.
 *
 * MEASURED from that frame at the 1440px reference: the page title's cap
 * height puts it on the 48px h1 token, its caption sits ~16px below at 16px,
 * and the carousel stage begins ~70px under the caption. The stage bounds
 * itself (1076px) rather than inheriting a page container, so the heading is
 * given the same width to keep the two optically centred on one column.
 *
 * Entrance reuses the site-wide header cascade — title rises, caption
 * follows, then the section's own content starts (ANIMATION_SPEC.md Section
 * 14) — so this page opens in the same language as Home and Experiences.
 */
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
