import { useState } from 'react'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { SKILLS_MOTION_VARS } from '../../motion/skillsMotion'
import SectionHeader, { SECTION_CONTENT_DELAY_MS } from '../common/SectionHeader'
import SkillsEducationLanguage from './SkillsEducationLanguage'
import SkillsToolkits from './SkillsToolkits'

/**
 * Home Skills section (owner instruction: the standalone Skills page is
 * retired and its content now lives on Home, between Home Experience and
 * Home Contact). Reuses the same Toolkits / Education / Language components
 * and data as before, so there is exactly one implementation of Skills
 * content (CLAUDE.md Section 11 "Remove Duplication").
 *
 * Structurally this now follows the other Home sections' convention
 * (HomeExperience.jsx, HomeContact.jsx): its own `<section ref={ref}>` +
 * `useScrollReveal()` pair, `py-20 md:py-28` opening rhythm, and the shared
 * `SectionHeader` at its default `h2` level (the old page's `as="h1"`
 * override no longer applies — Home's own `h1` lives in Hero). Because this
 * reveal is scroll-triggered like every other Home section, the Toolkits /
 * Education / Language cascade does NOT start at Home's mount just because
 * the section exists further down the page — it only begins once the
 * section actually scrolls into view.
 *
 * SkillsToolkits and SkillsEducationLanguage keep their own internal
 * max-widths (1148px / 1380px, both wider than Home's other sections) and
 * their own `onComplete` / `toolkitsComplete` gate exactly as they did on the
 * standalone page — Toolkits must fully finish its row-by-row reveal before
 * Education + Language become eligible, and that dependency travels with the
 * components unchanged.
 */
export default function HomeSkills() {
  const { ref, isVisible } = useScrollReveal()
  const [toolkitsComplete, setToolkitsComplete] = useState(false)

  return (
    <section ref={ref} className="py-20 md:py-28" style={SKILLS_MOTION_VARS}>
      <header className="mx-auto w-full max-w-[1196px] px-6">
        <SectionHeader title="Skills" revealed={isVisible} className="mx-auto max-w-3xl text-center">
          A growing set of skills built through various projects, competitions, experiences.
        </SectionHeader>
      </header>

      <SkillsToolkits startDelayMs={SECTION_CONTENT_DELAY_MS} onComplete={() => setToolkitsComplete(true)} />
      <SkillsEducationLanguage toolkitsComplete={toolkitsComplete} />
    </section>
  )
}
