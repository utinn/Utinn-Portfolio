import SectionHeader from '../components/common/SectionHeader'
import ExperienceTimeline from '../components/sections/ExperienceTimeline'
import { useScrollReveal } from '../hooks/useScrollReveal'

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
