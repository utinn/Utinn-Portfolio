import { Link } from 'react-router-dom'

const isInternal = (href) => typeof href === 'string' && href.startsWith('/')

/**
 * Reusable Button/CTA skeleton (CLAUDE.md Section 10).
 *
 * Renders a router <Link> for internal hrefs ("/projects"), an external
 * <a> for anything else, or a <button> when no href is given. Visual
 * styling (padding, radius, glow, colors) is intentionally left to the
 * caller/className until inspected from Figma — do not hardcode
 * Figma-specific values here yet (CLAUDE.md Section 3).
 */
export default function Button({ href, external, className = '', children, ...rest }) {
  const baseClassName = `inline-flex items-center justify-center font-sans ${className}`.trim()

  if (href && !external && isInternal(href)) {
    return (
      <Link to={href} className={baseClassName} {...rest}>
        {children}
      </Link>
    )
  }

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={baseClassName} {...rest}>
        {children}
      </a>
    )
  }

  return (
    <button type="button" className={baseClassName} {...rest}>
      {children}
    </button>
  )
}
