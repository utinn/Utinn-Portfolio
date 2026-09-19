import { useScrollReveal } from '../../hooks/useScrollReveal'

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
