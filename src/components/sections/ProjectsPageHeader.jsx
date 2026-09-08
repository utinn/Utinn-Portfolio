import { contactInfo } from '../../data/contact'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import Button from '../common/Button'
import SectionHeader, { SECTION_CONTENT_DELAY_MS } from '../common/SectionHeader'

/**
 * Shared header of both Projects child pages (Game and AI) — title, caption
 * and the repositories CTA, transcribed from
 * docs/figma-reference/projects/{Game,Ai}ProjectsPage.png, which show it
 * identically on both.
 *
 * It carries the document's h1: the Projects landing page keeps the visually
 * hidden one, these pages show it.
 *
 * The CTA destination is the GitHub profile already recorded in
 * data/contact.js (transcribed from the approved Home Contact frame) — the
 * only real "all repositories" destination the project has. Nothing is
 * invented; if it were ever unset the shared Button falls back to its
 * disabled-but-faithful state (INTERACTION_SPEC.md 7.3).
 *
 * Reveal: the same header cascade every other section uses (title rises,
 * caption follows), with the CTA arriving on the shared content delay. The
 * curtain transition is the page's major entrance — this only has to let the
 * content settle in gracefully on a direct load (owner instruction).
 */
export default function ProjectsPageHeader() {
  const { ref, isVisible } = useScrollReveal()

  return (
    <header ref={ref}>
      <SectionHeader as="h1" title="Projects" revealed={isVisible} className="mx-auto max-w-2xl text-center">
        Things i&apos;ve built that reflected my hardskills
      </SectionHeader>

      <div
        className={`project-reveal mt-7 flex justify-center ${isVisible ? 'project-reveal-visible' : ''}`}
        style={{ '--reveal-delay': `${SECTION_CONTENT_DELAY_MS}ms` }}
      >
        <Button href={contactInfo.github.url} external disabled={!contactInfo.github.url}>
          View All Repositories
        </Button>
      </div>
    </header>
  )
}
