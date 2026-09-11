import { contactInfo } from '../../data/contact'

// Slight per-quadrant stagger on top of the shared header lead, so the four
// cards feel like they converge together rather than snapping in as one.
const QUADRANT_STAGGER_MS = { nw: 0, ne: 70, sw: 70, se: 140 }

/**
 * The four contact destination cards (email/Instagram/GitHub/LinkedIn),
 * extracted from the Home Contact section so the Home preview and the
 * dedicated Contact page (src/pages/Contact.jsx) render the exact same card
 * design, data, and quadrant reveal animation instead of duplicating either
 * (CLAUDE.md Section 10).
 *
 * `revealed`/`startDelayMs` mirror the SkillsToolkits `startDelayMs`
 * convention: the caller owns its own useScrollReveal() and tells this
 * component when its entrance clock starts, so the header -> cards cascade
 * (ANIMATION_SPEC.md Section 21) works identically regardless of which page
 * hosts it.
 */
export default function ContactCards({ revealed, startDelayMs = 0 }) {
  const quadrant = (corner) => ({
    className: `contact-card-reveal contact-card-reveal-${corner} ${revealed ? 'contact-card-reveal-visible' : ''}`,
    style: { '--reveal-delay': `${startDelayMs + QUADRANT_STAGGER_MS[corner]}ms` },
  })

  return (
    <div className="mx-auto mt-12 grid max-w-3xl gap-4 sm:grid-cols-2">
      <div {...quadrant('nw')}>
        <ContactLink href={`mailto:${contactInfo.email}`} icon={<MailIcon />} label={contactInfo.email} />
      </div>
      <div {...quadrant('ne')}>
        <ContactLink
          href={contactInfo.instagram.url}
          icon={<InstagramIcon />}
          label={contactInfo.instagram.label}
          external
        />
      </div>
      <div {...quadrant('sw')}>
        <ContactLink href={contactInfo.github.url} icon={<GitHubIcon />} label={contactInfo.github.label} external />
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

function InstagramIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0 text-accent">
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" />
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
