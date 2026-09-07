import { Link } from 'react-router-dom'

const isInternal = (href) => typeof href === 'string' && href.startsWith('/')

/**
 * Visual variants approximated from the Figma reference PNGs (CLAUDE.md
 * Section 3) — exact padding/border values are provisional pending Figma
 * MCP verification.
 */
const VARIANT_CLASSES = {
  solid: 'bg-foreground text-background hover:bg-white/90',
  outline:
    'border border-white/60 text-foreground bg-transparent hover:border-white hover:shadow-[0_0_22px_rgba(255,255,255,0.18)]',
}

const SIZE_CLASSES = {
  md: 'gap-2.5 rounded-2xl px-6 py-3 text-body',
  sm: 'gap-1.5 rounded-lg px-4 py-2 text-caption',
}

/**
 * Reusable Button/CTA (CLAUDE.md Section 10). Renders a router <Link> for
 * internal hrefs, an external <a> for anything else, or a <button> when no
 * href is given.
 *
 * Every directional (arrow-bearing) button shares the same hover
 * interaction — scale ~1.04 + a repeated rightward arrow nudge — regardless
 * of whether it navigates internally or externally. This is a single
 * site-wide interaction, not something scoped to external links; the CSS
 * class is still named `.btn-external` (see animations.css) for historical
 * reasons, but it now triggers off `arrow`, not `external`. `external` only
 * controls anchor semantics (target="_blank"/rel) below.
 *
 * `disabled` renders the same shared button appearance (same border, text
 * color, background, radius, and arrow — never a separate gray variant),
 * only slightly dimmed and non-interactive — used where INTERACTION_SPEC.md
 * 7.3 / CLAUDE.md Section 23 forbid guessing a real destination (e.g. an
 * unconfirmed project URL) so the control stays visually faithful without
 * navigating anywhere wrong. Dimming is kept light (opacity-70, not -50) so
 * it still reads as "the same button, temporarily inactive" rather than a
 * distinct gray design.
 */
export default function Button({
  href,
  external = false,
  variant = 'outline',
  size = 'md',
  arrow = true,
  disabled = false,
  className = '',
  children,
  ...rest
}) {
  const baseClassName =
    `inline-flex items-center justify-center whitespace-nowrap font-sans font-bold transition duration-200 ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${arrow ? 'btn-external' : ''} ${className}`.trim()

  const content = (
    <>
      <span>{children}</span>
      {arrow && (
        <span className="btn-external__arrow" aria-hidden="true">
          &gt;
        </span>
      )}
    </>
  )

  if (disabled) {
    return (
      <span className={`${baseClassName} cursor-not-allowed opacity-70`.trim()} aria-disabled="true" {...rest}>
        {content}
      </span>
    )
  }

  if (href && !external && isInternal(href)) {
    return (
      <Link to={href} className={baseClassName} {...rest}>
        {content}
      </Link>
    )
  }

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={baseClassName} {...rest}>
        {content}
      </a>
    )
  }

  return (
    <button type="button" className={baseClassName} {...rest}>
      {content}
    </button>
  )
}
