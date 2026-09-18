import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { certificateFilters } from '../../data/certificates'

/**
 * Certificates Page category filter (owner addition on top of the Figma
 * grid — see the Certificates implementation prompt; category list and
 * default "All" state are also confirmed in INTERACTION_SPEC.md 24.2/24.3).
 * Elegant category tabs, not bulky buttons, with a single sliding underline
 * indicator that measures the active tab's DOM position and animates to it —
 * the same technique Navbar.jsx uses for its active-page glow.
 *
 * ANIMATION_SPEC.md 23.2 "Active Filter Indicator": ~200-350ms smooth
 * ease-in-out. The active/inactive/hover visual language (brighter + blue +
 * glow vs. muted, non-color-only distinction via bold weight) is the owner's
 * explicit spec in the implementation prompt.
 */
export default function CertificateFilterBar({ activeCategory, onChange }) {
  const listRef = useRef(null)
  const tabRefs = useRef({})
  const [indicatorStyle, setIndicatorStyle] = useState({ opacity: 0 })

  const measureIndicator = useCallback(() => {
    const activeEl = tabRefs.current[activeCategory]
    const listEl = listRef.current
    if (!activeEl || !listEl) {
      setIndicatorStyle({ opacity: 0 })
      return
    }
    const listRect = listEl.getBoundingClientRect()
    const tabRect = activeEl.getBoundingClientRect()
    setIndicatorStyle({
      opacity: 1,
      left: tabRect.left - listRect.left,
      width: tabRect.width,
    })
  }, [activeCategory])

  useLayoutEffect(() => {
    measureIndicator()
  }, [measureIndicator])

  useEffect(() => {
    window.addEventListener('resize', measureIndicator)
    return () => window.removeEventListener('resize', measureIndicator)
  }, [measureIndicator])

  return (
    <div className="cert-filter-bar" role="tablist" aria-label="Filter certificates by category">
      <div ref={listRef} className="relative flex items-center gap-7 overflow-x-auto sm:gap-9">
        <span aria-hidden="true" className="cert-filter-indicator" style={indicatorStyle} />
        {certificateFilters.map((filter) => {
          const isActive = filter.value === activeCategory
          return (
            <button
              key={filter.value}
              ref={(el) => {
                tabRefs.current[filter.value] = el
              }}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onChange(filter.value)}
              className={`cert-filter-tab shrink-0 whitespace-nowrap font-sans text-body ${
                isActive ? 'cert-filter-tab-active' : ''
              }`}
            >
              {filter.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
