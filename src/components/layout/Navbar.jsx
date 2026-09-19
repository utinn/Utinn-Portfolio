import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import cvFile from '../../assets/Justin Christian Woeryadi_CV.pdf'
import { primaryNavItems, projectsChildPaths } from '../../data/navigation'
import { usePageWarp } from '../../hooks/usePageWarp'
import { CV_FIREFLIES } from '../../motion/navFireflyPhysics'
import NavFireflies from './NavFireflies'
import PageContainer from './PageContainer'

const CV_DOWNLOAD_FILENAME = 'Justin-Christian-Woeryadi-CV.pdf'

function DownloadIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0">
      <path
        d="M12 3v12m0 0-4-4m4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function Navbar() {
  const { pathname } = useLocation()
  const { pendingPath, warp } = usePageWarp()
  const isProjectsActive = pathname === '/projects' || projectsChildPaths.includes(pathname)
  const indicatorPath = pendingPath ?? pathname
  const activePath =
    indicatorPath === '/projects' || projectsChildPaths.includes(indicatorPath) ? '/projects' : indicatorPath

  const listRef = useRef(null)
  const itemRefs = useRef({})
  const [activeBox, setActiveBox] = useState(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

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

  const cvRef = useRef(null)
  const [cvActive, setCvActive] = useState(false)
  const [cvBox, setCvBox] = useState(null)
  const activateCv = useCallback(() => {
    const el = cvRef.current
    if (!el) return
    setCvBox({ x: el.offsetWidth / 2, y: el.offsetHeight / 2, w: el.offsetWidth, h: el.offsetHeight })
    setCvActive(true)
  }, [])
  const deactivateCv = useCallback(() => setCvActive(false), [])
  const cvTarget = cvActive ? cvBox : null

  return (
    <header className="site-header sticky top-4 z-50 md:top-6" data-warp-phase={warp?.phase}>
      <PageContainer>
        <nav
          aria-label="Primary"
          className="flex items-center justify-between gap-4 rounded-full border border-white/10 bg-panel/70 px-4 py-3 font-sans shadow-[0_0_30px_rgba(96,165,250,0.1)] backdrop-blur-md md:px-6"
        >
          <Link to="/" className="shrink-0 text-2xl font-bold text-foreground" aria-label="Utinn — Home">
            Utinn
          </Link>

          <ul ref={listRef} className="relative hidden items-center gap-2 lg:flex xl:gap-3">
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
            ref={cvRef}
            href={cvFile}
            download={CV_DOWNLOAD_FILENAME}
            aria-label="Download CV"
            onMouseEnter={activateCv}
            onMouseLeave={deactivateCv}
            onFocus={activateCv}
            onBlur={deactivateCv}
            className="cv-btn btn-external relative hidden shrink-0 items-center gap-1.5 rounded-full border border-white/25 bg-white/5 px-5 py-2 text-body font-medium text-foreground hover:border-white/50 lg:inline-flex"
          >
            <DownloadIcon />
            CV
            <NavFireflies target={cvTarget} seed={4271} config={CV_FIREFLIES} />
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
                href={cvFile}
                download={CV_DOWNLOAD_FILENAME}
                aria-label="Download CV"
                className="flex items-center justify-center gap-1.5 rounded-2xl border border-white/20 px-4 py-3 text-body font-medium text-foreground"
              >
                <DownloadIcon />
                CV
              </a>
            </li>
          </ul>
        )}
      </PageContainer>
    </header>
  )
}
