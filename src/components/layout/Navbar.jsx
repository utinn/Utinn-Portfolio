import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { primaryNavItems, projectsChildPaths } from '../../data/navigation'
import PageContainer from './PageContainer'

// TODO: place the real CV file at public/Navbar_CV.pdf (CLAUDE.md owner
// clarification 6 — semantic navigation filename, not Certificate_CV.pdf).
const CV_HREF = '/Navbar_CV.pdf'

/**
 * Reusable floating/pill-style primary navigation (CLAUDE.md Section 10).
 * Order + active-state rules: INTERACTION_SPEC.md Section 5. Visual shape,
 * spacing, and colors are approximated from the Figma reference PNGs and
 * provisional pending Figma MCP verification.
 *
 * The active item's glow is a single indicator that measures the active
 * NavLink's position and animates to it (ANIMATION_SPEC.md Section 25.1)
 * rather than every item owning its own static highlight.
 */
export default function Navbar() {
  const { pathname } = useLocation()
  const isProjectsActive = pathname === '/projects' || projectsChildPaths.includes(pathname)
  const activePath = isProjectsActive ? '/projects' : pathname

  const listRef = useRef(null)
  const itemRefs = useRef({})
  const [glowStyle, setGlowStyle] = useState({ opacity: 0 })
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Measures the active NavLink's DOM position to drive the sliding glow
  // indicator — an external-layout sync, so setState here (not derived
  // during render) is intentional.
  const measureGlow = useCallback(() => {
    const activeEl = itemRefs.current[activePath]
    const listEl = listRef.current
    if (!activeEl || !listEl) {
      setGlowStyle({ opacity: 0 })
      return
    }
    const listRect = listEl.getBoundingClientRect()
    const itemRect = activeEl.getBoundingClientRect()
    setGlowStyle({ opacity: 1, left: itemRect.left - listRect.left, width: itemRect.width })
  }, [activePath])

  useLayoutEffect(() => {
    measureGlow()
  }, [measureGlow])

  useEffect(() => {
    window.addEventListener('resize', measureGlow)
    return () => window.removeEventListener('resize', measureGlow)
  }, [measureGlow])

  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  return (
    <header className="sticky top-4 z-50 md:top-6">
      <PageContainer>
        <nav
          aria-label="Primary"
          className="flex items-center justify-between gap-4 rounded-full border border-white/10 bg-panel/70 px-4 py-3 font-sans shadow-[0_0_30px_rgba(96,165,250,0.1)] backdrop-blur-md md:px-6"
        >
          <Link to="/" className="shrink-0 text-2xl font-bold text-foreground" aria-label="Utinn — Home">
            Utinn
          </Link>

          <ul ref={listRef} className="relative hidden items-center gap-1 lg:flex">
            <span
              aria-hidden="true"
              className="nav-active-glow absolute inset-y-0 my-1 rounded-full bg-accent/15 ring-1 ring-accent/40"
              style={glowStyle}
            />
            {primaryNavItems.map((item) => {
              const isActive = item.path === '/projects' ? isProjectsActive : pathname === item.path
              return (
                <li key={item.path} className="relative">
                  <NavLink
                    ref={(el) => {
                      itemRefs.current[item.path] = el
                    }}
                    to={item.path}
                    end
                    aria-current={isActive ? 'page' : undefined}
                    className={`relative z-10 block rounded-full px-4 py-2 text-body transition-colors ${
                      isActive ? 'text-accent' : 'text-foreground/85 hover:text-foreground'
                    }`}
                  >
                    {item.label}
                  </NavLink>
                </li>
              )
            })}
          </ul>

          <a
            href={CV_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-external hidden shrink-0 rounded-full border border-white/25 bg-white/5 px-5 py-2 text-body font-medium text-foreground transition-colors hover:border-white/50 lg:inline-flex"
          >
            CV
          </a>

          <button
            type="button"
            className="flex items-center justify-center rounded-full border border-white/15 p-2 text-foreground lg:hidden"
            aria-expanded={isMenuOpen}
            aria-controls="primary-nav-menu"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              {isMenuOpen ? (
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </nav>

        {isMenuOpen && (
          <ul
            id="primary-nav-menu"
            className="mt-3 flex flex-col gap-1 rounded-3xl border border-white/10 bg-panel/90 p-3 font-sans backdrop-blur-md lg:hidden"
          >
            {primaryNavItems.map((item) => {
              const isActive = item.path === '/projects' ? isProjectsActive : pathname === item.path
              return (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    end
                    aria-current={isActive ? 'page' : undefined}
                    className={`block rounded-2xl px-4 py-3 text-body ${
                      isActive ? 'bg-accent/15 text-accent' : 'text-foreground/85'
                    }`}
                  >
                    {item.label}
                  </NavLink>
                </li>
              )
            })}
            <li>
              <a
                href={CV_HREF}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-2xl border border-white/20 px-4 py-3 text-center text-body font-medium text-foreground"
              >
                CV
              </a>
            </li>
          </ul>
        )}
      </PageContainer>
    </header>
  )
}
