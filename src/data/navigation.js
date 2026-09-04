/**
 * Primary Navbar order and routes (INTERACTION_SPEC.md Section 5.1).
 * Game Projects / AI Projects are child views of Projects and must NOT
 * appear as additional primary Navbar items (Section 5.4).
 */
export const primaryNavItems = [
  { label: 'Home', path: '/' },
  { label: 'Projects', path: '/projects' },
  { label: 'Experiences', path: '/experiences' },
  { label: 'Achievements', path: '/achievements' },
  { label: 'Skills', path: '/skills' },
  { label: 'Certificates', path: '/certificates' },
  { label: 'Contact', path: '/contact' },
]

/** Routes considered "Projects" for Navbar active-state purposes (Section 5.4, 14.1, 15.1). */
export const projectsChildPaths = ['/projects/games', '/projects/ai']
