import { useScrollReveal } from '../../hooks/useScrollReveal'

/**
 * Generic left/right scroll reveal wrapper (ANIMATION_SPEC.md Section 14).
 * The Home Experience section uses its own custom timeline animation
 * instead (Section 19) and does not use this component.
 */
export default function RevealOnScroll({ direction = 'left', className = '', as: Tag = 'div', children }) {
  const { ref, isVisible } = useScrollReveal()

  return (
    <Tag
      ref={ref}
      className={`reveal ${direction === 'right' ? 'reveal-right' : ''} ${isVisible ? 'reveal-visible' : ''} ${className}`.trim()}
    >
      {children}
    </Tag>
  )
}
