import { useEffect, useState } from 'react'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import SectionHeader, { SECTION_CONTENT_DELAY_MS } from '../common/SectionHeader'
import PageContainer from '../layout/PageContainer'
import AboutMeCarousel from './AboutMeCarousel'

/**
 * Home About Me section (CLAUDE.md Section 9). Heading and body copy are
 * transcribed verbatim, including its small grammatical quirks, from the
 * approved Figma reference (docs/figma-reference/home/Home_AboutMe.png) —
 * not rewritten (CLAUDE.md Section 23).
 *
 * Entrance (owner correction pass): title rises -> caption rises -> the
 * carousel runs its entrance reel (ANIMATION_SPEC.md Section 14/15).
 */
export default function AboutMe() {
  const { ref, isVisible } = useScrollReveal()
  const prefersReducedMotion = usePrefersReducedMotion()
  const [contentStarted, setContentStarted] = useState(false)

  useEffect(() => {
    if (!isVisible || contentStarted) return undefined
    const id = setTimeout(() => setContentStarted(true), prefersReducedMotion ? 0 : SECTION_CONTENT_DELAY_MS)
    return () => clearTimeout(id)
  }, [isVisible, contentStarted, prefersReducedMotion])

  return (
    <section ref={ref}>
      <PageContainer className="py-20 md:py-28">
        <SectionHeader
          title="Behind the Work"
          revealed={isVisible}
          className="mx-auto max-w-5xl text-center"
          captionClassName="mt-6"
        >
          I&apos;m an Artificial Intelligence student focused on building AI-based solutions, especially involving
          Computer Vision. I always start by defining real world problems while considering whether AI is a suitable
          approach before brainstorming about the best AI techniques to solve the problem. Finally, i move through
          data preparation, experimentation, model development, and eventually turning the result into something
          people can actually use. Beyond technical work, I enjoy exploring various experiences through projects,
          organizations, competitions, and mentoring. These have shaped how I collaborate, communicate, and approach
          problems from different point of views. Right now, I&apos;m continuing to strengthen my AI engineering
          skills while looking for opportunities to apply them in real-world environments.
        </SectionHeader>

        <div className="mt-14">
          <AboutMeCarousel startEntrance={contentStarted} />
        </div>
      </PageContainer>
    </section>
  )
}
