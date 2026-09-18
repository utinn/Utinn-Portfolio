/**
 * Certificates Page data (INTERACTION_SPEC.md Section 24, ANIMATION_SPEC.md
 * Section 23). The filter categories are explicit owner requirements (see
 * the Certificates implementation prompt), applied on top of the Figma grid.
 *
 * Shape: { id, title, issuer, issueDate, category, image, alt, credentialUrl }
 *
 * `category` must be one of `certificateFilters`' non-"all" values and is
 * read directly from this field — never inferred from filename, image, or
 * order (INTERACTION_SPEC.md 24.4). `credentialUrl` is carried for a future
 * "view credential" link but nothing currently renders it — no such control
 * was requested.
 */

import certFortex6 from '../assets/images/certificates/Certificate_Fortex6Top10Finalist.png'

export const certificateFilters = [
  { value: 'all', label: 'All' },
  { value: 'courses', label: 'Courses' },
  { value: 'programs', label: 'Programs' },
  { value: 'competitions', label: 'Competitions' },
]

/**
 * Clearly-labeled placeholder factory, matching the pattern already
 * established in src/data/achievements.js — never a fabricated real
 * credential (CLAUDE.md Section 23), just an explicit stand-in so the
 * Courses/Programs filters have something real to filter until the owner
 * supplies the actual certificates. `image: null` renders the shared
 * ImagePlaceholder at the same card dimensions, so dropping in a real file
 * later never shifts layout.
 */
const placeholderCertificate = (id, category) => ({
  id,
  title: `Certificate Title ${id}`,
  issuer: 'Issuing Organization',
  issueDate: 'Month Year',
  category,
  image: null,
  alt: '',
  credentialUrl: null,
})

export const certificates = [
  {
    id: 1,
    title: 'Top 10 Finalist - Fortex 6.0',
    issuer: 'Al Azhar Indonesia University',
    issueDate: 'January 2026',
    category: 'competitions',
    image: certFortex6,
    alt: 'Top 10 Finalist - Fortex 6.0 certificate, issued by Al Azhar Indonesia University',
    credentialUrl: null,
  },
  placeholderCertificate(2, 'courses'),
  placeholderCertificate(3, 'programs'),
]
