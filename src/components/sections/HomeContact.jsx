import { useScrollReveal } from '../../hooks/useScrollReveal'
import SectionHeader, { SECTION_CONTENT_DELAY_MS } from '../common/SectionHeader'
import PageContainer from '../layout/PageContainer'
import ContactCards from './ContactCards'

/**
 * Home Contact section (CLAUDE.md Section 9). Heading/subtitle/destinations
 * transcribed verbatim from the approved Figma reference
 * (docs/figma-reference/home/Home_Contact.png) — see src/data/contact.js
 * for sourcing notes, including why LinkedIn has no real destination yet.
 *
 * The card grid itself lives in ContactCards (shared with the dedicated
 * Contact page at src/pages/Contact.jsx) so both surfaces render the exact
 * same card design and reveal animation instead of duplicating it.
 *
 * Entrance (owner correction pass): the shared Home header cascade runs
 * first, then each contact card converges in from the compass direction of
 * its own 2x2 quadrant (ANIMATION_SPEC.md Section 21).
 *
 * Closing spacing (owner correction pass): Contact is the Home page's last
 * section, so its bottom padding grows beyond the shared pt-20/pt-28 opening
 * rhythm across breakpoints instead of mirroring it symmetrically — a
 * deliberate closing gap rather than the page simply stopping at the grid.
 */
export default function HomeContact() {
  const { ref, isVisible } = useScrollReveal()

  return (
    <section ref={ref}>
      <PageContainer className="pt-20 pb-28 md:pt-32 md:pb-36 lg:pb-70">
        <SectionHeader
          title="Let's Build Something Together"
          revealed={isVisible}
          className="mx-auto max-w-2xl text-center"
        >
          Open to internships, collaborations, or just a good conversation about AI, computer vision, and tech. Feel
          free to reach out for me!
        </SectionHeader>

        <ContactCards revealed={isVisible} startDelayMs={SECTION_CONTENT_DELAY_MS} />
      </PageContainer>
    </section>
  )
}
