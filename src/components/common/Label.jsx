const SIZE_CLASSES = {
  sm: 'rounded-md border px-3 py-1 text-caption',
  md: 'rounded-lg border px-4 py-2 text-body',
  // Skills page. MEASURED from docs/figma-reference/skills/SkillsPage.png:
  // the toolkit tags are drawn one step larger than the `sm` chip (34px tall
  // on 14px inline padding, 8px radius) and the language chips larger still
  // and squarer (36px tall, 16px padding, 4px radius) — two distinct Figma
  // variants, not a per-page restyle of `sm`. The toolkit padding is exact,
  // not rounded: Computer Vision fits five tags on one line inside a 546px
  // card with only a few pixels to spare, so widening it wraps that row.
  toolkit: 'rounded-lg border px-3.5 py-[6px] text-caption',
  language: 'rounded-[4px] border px-4 py-[7px] text-caption',
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
