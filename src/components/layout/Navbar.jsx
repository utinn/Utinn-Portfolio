import { NavLink, useLocation } from 'react-router-dom'
import { primaryNavItems, projectsChildPaths } from '../../data/navigation'

// TODO: place the real CV file at public/Navbar_CV.pdf (CLAUDE.md owner
// clarification 6 — semantic navigation filename, not Certificate_CV.pdf).
const CV_HREF = '/Navbar_CV.pdf'

/**
 * Reusable floating/pill-style primary navigation (CLAUDE.md Section 10;
 * order + active-state rules from INTERACTION_SPEC.md Section 5).
 * Visual treatment (shape, spacing, floating position, glow) is
 * intentionally unstyled pending Figma inspection.
 */
export default function Navbar() {
  const { pathname } = useLocation()
  const isProjectsActive = pathname === '/projects' || projectsChildPaths.includes(pathname)

  return (
    <nav aria-label="Primary" className="font-sans">
      <ul className="flex list-none items-center gap-4">
        {primaryNavItems.map((item) => (
          <li key={item.path}>
            {item.path === '/projects' ? (
              <NavLink to={item.path} className={isProjectsActive ? 'active' : undefined} end>
                {item.label}
              </NavLink>
            ) : (
              <NavLink to={item.path} end>
                {item.label}
              </NavLink>
            )}
          </li>
        ))}
      </ul>

      {/* CV is a separate action, not a primary nav page (INTERACTION_SPEC.md 5.10). */}
      <a href={CV_HREF} target="_blank" rel="noopener noreferrer">
        CV
      </a>
    </nav>
  )
}
