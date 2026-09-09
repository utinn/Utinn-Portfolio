import SectionHeader from '../components/common/SectionHeader'
import ExperienceTimeline from '../components/sections/ExperienceTimeline'
import { useScrollReveal } from '../hooks/useScrollReveal'

/**
 * Dedicated Experiences page (CLAUDE.md Section 9, INTERACTION_SPEC.md
 * Sections 17-21), composed from
 * docs/figma-reference/experiences/ExperiencesPage.png.
 *
 * MEASURED from that frame: the rail sits at x165 and the supporting images
 * end at x1265 on the 1440px reference, i.e. a centred 1100px content column
 * — narrower than both the site-wide PageContainer and the Projects pages'
 * 1200px column, so it is stated here. The 1148px bound is that column plus
 * the px-6 gutter.
 *
 * The frame draws all five entries expanded at once; that is the composition
 * reference for the OPEN state, not the runtime state. Progressive disclosure
 * (17.1) means every entry loads collapsed.
 */
export default function Experiences() {
  const { ref, isVisible } = useScrollReveal()

  return (
    <div className="mx-auto w-full max-w-[1148px] px-6 pb-28 pt-24">
      <header ref={ref}>
        <SectionHeader as="h1" title="Experiences" revealed={isVisible} className="mx-auto max-w-3xl text-center">
          Exploration beyond building that shaped how i work, communicate, and grow with others
        </SectionHeader>
      </header>

      <ExperienceTimeline />
    </div>
  )
}
