import SectionHeader, { SECTION_CONTENT_DELAY_MS } from '../components/common/SectionHeader'
import SkillsEducation from '../components/sections/SkillsEducation'
import SkillsLanguage from '../components/sections/SkillsLanguage'
import SkillsToolkits from '../components/sections/SkillsToolkits'
import { SKILLS_MOTION_VARS } from '../motion/skillsMotion'
import { useScrollReveal } from '../hooks/useScrollReveal'

/**
 * Skills and Credentials Page (CLAUDE.md Section 9, ANIMATION_SPEC.md
 * Section 22, INTERACTION_SPEC.md Section 23), composed from
 * docs/figma-reference/skills/SkillsPage.png.
 *
 * MEASURED from that frame at the 1440px reference: a 48px page title with a
 * 16px caption ~19px below it. The three sections do NOT share one content
 * column — Toolkits is 1148px wide, the Education band 1332px and the
 * Language frame 564px — so each owns its own width rather than inheriting a
 * page container that would be wrong for two of them.
 *
 * Entrance is the site-wide header cascade (title rises, caption follows),
 * after which Toolkits — the only section already on screen — starts. The
 * page root publishes SKILLS_MOTION_VARS so every duration and easing used
 * below comes from src/motion/skillsMotion.js.
 *
 * Everything on this page is presentation-only: tags and chips are
 * informational, never links, and the Education timeline runs itself with no
 * manual stepping (INTERACTION_SPEC.md 23.1-23.3).
 */
export default function Skills() {
  const { ref, isVisible } = useScrollReveal()

  return (
    <div className="pb-28 pt-24" style={SKILLS_MOTION_VARS}>
      <header ref={ref} className="mx-auto w-full max-w-[1196px] px-6">
        <SectionHeader as="h1" title="Skills" revealed={isVisible} className="mx-auto max-w-3xl text-center">
          A growing set of skills built through various projects, competitions, experiences.
        </SectionHeader>
      </header>

      <SkillsToolkits startDelayMs={SECTION_CONTENT_DELAY_MS} />
      <SkillsEducation />
      <SkillsLanguage />
    </div>
  )
}
