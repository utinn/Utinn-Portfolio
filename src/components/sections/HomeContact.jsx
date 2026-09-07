import { contactInfo } from '../../data/contact'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import SectionHeader, { SECTION_CONTENT_DELAY_MS } from '../common/SectionHeader'
import PageContainer from '../layout/PageContainer'

// Slight per-quadrant stagger on top of the shared header lead, so the four
// cards feel like they converge together rather than snapping in as one.
const QUADRANT_STAGGER_MS = { nw: 0, ne: 70, sw: 70, se: 140 }

/**
 * Home Contact section (CLAUDE.md Section 9). Heading/subtitle/destinations
 * transcribed verbatim from the approved Figma reference
 * (docs/figma-reference/home/Home_Contact.png) — see src/data/contact.js
 * for sourcing notes, including why LinkedIn has no real destination yet.
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

  const quadrant = (corner) => ({
    className: `contact-card-reveal contact-card-reveal-${corner} ${isVisible ? 'contact-card-reveal-visible' : ''}`,
    style: { '--reveal-delay': `${SECTION_CONTENT_DELAY_MS + QUADRANT_STAGGER_MS[corner]}ms` },
  })

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

        <div className="mx-auto mt-12 grid max-w-3xl gap-4 sm:grid-cols-2">
          <div {...quadrant('nw')}>
            <ContactLink href={`mailto:${contactInfo.email}`} icon={<MailIcon />} label={contactInfo.email} />
          </div>
          <div {...quadrant('ne')}>
            <ContactLink href={contactInfo.phoneHref} icon={<PhoneIcon />} label={contactInfo.phone} />
          </div>
          <div {...quadrant('sw')}>
            <ContactLink
              href={contactInfo.github.url}
              icon={<GitHubIcon />}
              label={contactInfo.github.label}
              external
            />
          </div>
          <div {...quadrant('se')}>
            {contactInfo.linkedin.url ? (
              <ContactLink
                href={contactInfo.linkedin.url}
                icon={<LinkedInIcon />}
                label={contactInfo.linkedin.label}
                external
              />
            ) : (
              <button
                type="button"
                disabled
                aria-disabled="true"
                title="LinkedIn link pending"
                className="flex h-full w-full cursor-not-allowed items-center gap-4 rounded-2xl border border-white/15 bg-panel/40 px-5 py-4 text-left opacity-50"
              >
                <LinkedInIcon />
                <span className="text-body font-medium text-foreground">{contactInfo.linkedin.label}</span>
              </button>
            )}
          </div>
        </div>
      </PageContainer>
    </section>
  )
}

function ContactLink({ href, icon, label, external = false }) {
  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className="btn-external flex h-full items-center gap-4 rounded-2xl border border-white/15 bg-panel/40 px-5 py-4 text-left transition-colors hover:border-accent/50"
    >
      {icon}
      <span className="truncate text-body font-medium text-foreground">{label}</span>
    </a>
  )
}

function MailIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0 text-accent">
      <rect x="3.5" y="5.5" width="17" height="13" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="m4.5 7 7.5 6 7.5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function PhoneIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0 text-accent">
      <path
        d="M6.6 10.8a15.9 15.9 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 9 9 0 0 0 2.8.45 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 9 9 0 0 0 .45 2.8 1 1 0 0 1-.25 1L6.6 10.8Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function GitHubIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="shrink-0 text-accent">
      <path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49v-1.7c-2.78.62-3.37-1.36-3.37-1.36-.46-1.2-1.11-1.52-1.11-1.52-.9-.64.07-.63.07-.63 1 .07 1.53 1.05 1.53 1.05.9 1.57 2.34 1.12 2.91.86.09-.67.35-1.12.64-1.38-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05a9.3 9.3 0 0 1 5 0c1.9-1.33 2.74-1.05 2.74-1.05.56 1.4.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.93-2.34 4.8-4.57 5.05.36.32.68.94.68 1.9v2.82c0 .27.18.6.69.49A10.26 10.26 0 0 0 22 12.25C22 6.58 17.52 2 12 2Z" />
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0 text-accent">
      <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M8 10.5V16M8 7.75v.01M12 16v-3.5c0-1.1.9-2 2-2s2 .9 2 2V16"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}
