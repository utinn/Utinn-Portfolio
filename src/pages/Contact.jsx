import SectionHeader, { SECTION_CONTENT_DELAY_MS } from '../components/common/SectionHeader'
import ContactCards from '../components/sections/ContactCards'
import PageContainer from '../components/layout/PageContainer'
import { useScrollReveal } from '../hooks/useScrollReveal'

/**
 * Dedicated Contact page (CLAUDE.md Section 9). No dedicated Figma frame
 * exists for this page — only docs/figma-reference/home/Home_Contact.png —
 * so per the project owner's explicit instruction this page reuses the Home
 * Contact section's card design, data, and reveal animation verbatim via
 * ContactCards, wrapped in its own page-level title/caption (the same
 * "page title + reused section" composition already used by
 * src/pages/Experiences.jsx, Achievements.jsx, and Skills.jsx). The caption
 * copy is reused from Home Contact rather than invented, since no dedicated
 * wording exists for this page (CLAUDE.md Section 23).
 */
export default function Contact() {
  const { ref, isVisible } = useScrollReveal()

  return (
    <PageContainer className="pb-28 pt-24 md:pb-36">
      <header ref={ref}>
        <SectionHeader as="h1" title="Contact" revealed={isVisible} className="mx-auto max-w-2xl text-center">
          Open to internships, collaborations, or just a good conversation about AI, computer vision, and tech. Feel
          free to reach out for me!
        </SectionHeader>
      </header>

      <ContactCards revealed={isVisible} startDelayMs={SECTION_CONTENT_DELAY_MS} />
    </PageContainer>
  )
}
