/**
 * Home Contact section destinations (INTERACTION_SPEC.md Section 26 & 8.3).
 *
 * Email and the GitHub username are transcribed directly from the approved
 * Figma reference (docs/figma-reference/home/Home_Contact.png) — not
 * fabricated (CLAUDE.md Section 23). The email address also matches the
 * project owner's known address, confirming it is real content.
 *
 * `instagram` was supplied directly by the project owner (replacing the
 * former phone entry) and is not part of the original Figma reference.
 *
 * `linkedin.url` is intentionally `null`: Figma and the rest of the repo
 * only show the LinkedIn display name ("Justin Christian Woeryadi"), never
 * a profile URL/slug, and LinkedIn slugs cannot be reliably derived from a
 * display name. Per INTERACTION_SPEC.md 7.3 ("do not substitute a
 * placeholder destination for a final one... do not invent a real
 * destination"), this is left unset rather than guessed. The Contact card
 * renders in a visually-faithful but inert state until the owner supplies
 * the real URL.
 */
export const contactInfo = {
  email: 'justinchristian2607@gmail.com',
  instagram: { label: '@christian0364', url: 'https://www.instagram.com/christian0364' },
  github: { label: 'utinn', url: 'https://github.com/utinn' },
  linkedin: { label: 'Justin Christian Woeryadi', url: 'https://www.linkedin.com/in/utinn' },
}
