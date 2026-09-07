const SIZE_CLASSES = {
  sm: 'rounded-md border px-3 py-1 text-caption',
  md: 'rounded-lg border px-4 py-2 text-body',
}

/**
 * Reusable blue tag/label chip (role chips, skill tags, project tags —
 * CLAUDE.md Section 10). Default-state colors/border/radius are visually
 * approximated from the Figma reference PNGs and provisional pending Figma
 * MCP verification. Hover shine/glow/scale is defined in ANIMATION_SPEC.md
 * Section 12 via the shared `.tag-chip` class. Informational only — not a
 * link (INTERACTION_SPEC.md 18.2, 23.2).
 */
export default function Label({ size = 'sm', className = '', children }) {
  return (
    <span
      className={`tag-chip inline-flex items-center border-accent/60 font-sans font-medium text-accent ${SIZE_CLASSES[size]} ${className}`.trim()}
    >
      {children}
    </span>
  )
}
