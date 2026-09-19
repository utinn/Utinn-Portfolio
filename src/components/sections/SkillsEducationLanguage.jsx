import SkillsEducation from './SkillsEducation'
import SkillsLanguage from './SkillsLanguage'
import { useScrollReveal } from '../../hooks/useScrollReveal'

export default function SkillsEducationLanguage({ toolkitsComplete }) {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.15 })
  const revealed = isVisible && toolkitsComplete

  return (
    <div
      ref={ref}
      className="mx-auto mt-24 grid w-full max-w-[1380px] grid-cols-1 gap-x-10 gap-y-24 px-6 md:grid-cols-2 md:items-start"
    >
      <SkillsEducation isVisible={revealed} />
      <SkillsLanguage isVisible={revealed} />
    </div>
  )
}
