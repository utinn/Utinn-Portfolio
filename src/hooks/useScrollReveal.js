import { useEffect, useRef, useState } from 'react'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

/**
 * Drives the Home Page Section Reveal Behavior (ANIMATION_SPEC.md Section
 * 14): fires once, ~15-25% into the viewport, and never re-hides once shown
 * so scrolling up/down doesn't replay it.
 */
export function useScrollReveal({ threshold = 0.2 } = {}) {
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(false)
  const prefersReducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    if (prefersReducedMotion) return
    const node = ref.current
    if (!node || typeof IntersectionObserver === 'undefined') return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold, rootMargin: '0px 0px -10% 0px' },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [prefersReducedMotion, threshold])

  return { ref, isVisible: prefersReducedMotion ? true : isVisible }
}
