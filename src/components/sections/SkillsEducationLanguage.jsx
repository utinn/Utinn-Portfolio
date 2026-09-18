import SkillsEducation from './SkillsEducation'
import SkillsLanguage from './SkillsLanguage'
import { useScrollReveal } from '../../hooks/useScrollReveal'

/**
 * Education + Language, side by side, on the Skills and Credentials Page
 * (owner instruction). Each section keeps its own internal design language
 * (Education's horizontal timeline, Language's chip frame) and its own
 * internal reveal cascade — what changes is that both now start from the
 * SAME viewport trigger instead of two independent `useScrollReveal` calls,
 * so the single IntersectionObserver lives here and `isVisible` is handed
 * down as a prop to each section.
 *
 * `toolkitsComplete` (owner instruction) is the second half of the gate: this
 * row must never start before Toolkits' own reveal has actually finished
 * (SkillsToolkits.jsx's `onComplete`), so `revealed` is the AND of "in
 * viewport" and "Toolkits done" rather than viewport alone. This never blocks
 * scrolling — the user can scroll straight past this row while it's still
 * ineligible, `isVisible` still latches true the moment it's in view, and
 * `revealed` simply flips true (starting the animation) on whichever happens
 * last: the row entering view, or the parent re-rendering with
 * `toolkitsComplete` now true. Once true, both stay true (`useScrollReveal`
 * never re-hides and `toolkitsComplete` never resets), so this never replays
 * on scroll-away/scroll-back.
 *
 * BREAKPOINT: `md` (768px). Above it the two columns sit side by side;
 * below it they stack (Education above Language, unchanged reading order)
 * rather than forcing two columns too narrow to stay readable.
 */
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
