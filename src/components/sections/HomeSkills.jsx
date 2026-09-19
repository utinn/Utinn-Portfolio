import { useState } from 'react'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { SKILLS_MOTION_VARS } from '../../motion/skillsMotion'
import SectionHeader, { SECTION_CONTENT_DELAY_MS } from '../common/SectionHeader'
import SkillsEducationLanguage from './SkillsEducationLanguage'
import SkillsToolkits from './SkillsToolkits'

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
