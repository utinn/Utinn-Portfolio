import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { primaryNavItems, projectsChildPaths } from '../../data/navigation'
import { usePageWarp } from '../../hooks/usePageWarp'
import NavFireflies from './NavFireflies'
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
 * The active indicator is a single measured box that slides to the active
 * NavLink's position (ANIMATION_SPEC.md Section 25.1) rather than every item
 * owning its own static highlight. Owner redesign: the old flat blue pill is
 * gone — the box now carries only a faint aura, and the NavFireflies cloud
 * sits beside it at the <ul> level, receiving the same measurement as its
 * chase target (motion-polish pass: each firefly springs to the new item on
 * its own, rather than riding the sliding box as a rigid group).
 */
export default function Navbar() {
  const { pathname } = useLocation()
  const { pendingPath, warp } = usePageWarp()
  const isProjectsActive = pathname === '/projects' || projectsChildPaths.includes(pathname)
  // The indicator (aura + fireflies) points at the route being warped TO
  // from the moment of the click, so the fireflies chase during pre-warp
  // and are settled around the new item when the destination arrives.
  // aria-current stays on the real route until the swap.
  const indicatorPath = pendingPath ?? pathname
  const activePath =
    indicatorPath === '/projects' || projectsChildPaths.includes(indicatorPath) ? '/projects' : indicatorPath

  const listRef = useRef(null)
  const itemRefs = useRef({})
  const [activeBox, setActiveBox] = useState(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Measures the active NavLink's box (in the <ul>'s space) to drive both the
  // sliding aura and the fireflies' chase target — an external-layout sync,
  // so setState here (not derived during render) is intentional.
  const measureGlow = useCallback(() => {
    const activeEl = itemRefs.current[activePath]
    const listEl = listRef.current
    if (!activeEl || !listEl) {
      setActiveBox(null)
      return
    }
    const listRect = listEl.getBoundingClientRect()
    const itemRect = activeEl.getBoundingClientRect()
    const next = {
      left: itemRect.left - listRect.left,
      top: itemRect.top - listRect.top,
      width: itemRect.width,
      height: itemRect.height,
    }
    // Keep the previous object when nothing moved, so observer callbacks
    // that re-measure identical geometry don't retarget the fireflies.
    setActiveBox((prev) =>
      prev &&
      Math.abs(prev.left - next.left) < 0.5 &&
      Math.abs(prev.top - next.top) < 0.5 &&
      Math.abs(prev.width - next.width) < 0.5 &&
      Math.abs(prev.height - next.height) < 0.5
        ? prev
        : next,
    )
  }, [activePath])

  const glowStyle = activeBox ? { opacity: 1, left: activeBox.left, width: activeBox.width } : { opacity: 0 }

  // Stable object per measurement so NavFireflies only retargets on a real
  // change, never on an unrelated Navbar re-render.
  const fireflyTarget = useMemo(
    () =>
      activeBox
        ? {
            x: activeBox.left + activeBox.width / 2,
            y: activeBox.top + activeBox.height / 2,
            w: activeBox.width,
            h: activeBox.height,
          }
        : null,
    [activeBox],
  )

  useLayoutEffect(() => {
    measureGlow()
  }, [measureGlow])

  // Re-measure whenever the list's geometry changes — not just on window
  // resize. The initial layout-effect measurement runs before Space Grotesk
  // has loaded, and the fallback font is narrower, so every item's left edge
  // shifts once the webfont swaps in (the old pill silently sat ~30px left of
  // its label until the next resize). ResizeObserver catches the swap and any
  // other reflow; fonts.ready covers the swap explicitly as well.
  useEffect(() => {
    window.addEventListener('resize', measureGlow)
    const listEl = listRef.current
    const observer = listEl && typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measureGlow) : null
    if (observer) {
      observer.observe(listEl)
      listEl.querySelectorAll('a').forEach((el) => observer.observe(el))
    }
    document.fonts?.ready.then(measureGlow)
    return () => {
      window.removeEventListener('resize', measureGlow)
      observer?.disconnect()
    }
  }, [measureGlow])

  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  return (
    // data-warp-phase drives the Navbar's subtle spacetime bend during the
    // global warp (animations.css "26"); the header stays visible throughout.
    <header className="site-header sticky top-4 z-50 md:top-6" data-warp-phase={warp?.phase}>
      <PageContainer>
        <nav
          aria-label="Primary"
          className="flex items-center justify-between gap-4 rounded-full border border-white/10 bg-panel/70 px-4 py-3 font-sans shadow-[0_0_30px_rgba(96,165,250,0.1)] backdrop-blur-md md:px-6"
        >
          <Link to="/" className="shrink-0 text-2xl font-bold text-foreground" aria-label="Utinn — Home">
            Utinn
          </Link>

          <ul ref={listRef} className="relative hidden items-center gap-1 lg:flex">
            <span aria-hidden="true" className="nav-active-glow absolute inset-y-0 my-1 rounded-full" style={glowStyle}>
              <span className="nav-active-aura" />
            </span>
            <NavFireflies target={fireflyTarget} />
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
