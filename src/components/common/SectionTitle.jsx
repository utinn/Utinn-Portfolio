/**
 * Reusable section heading skeleton (CLAUDE.md Section 10). Uses the
 * confirmed H2 fallback token (36px Bold); override per-section once the
 * actual Figma frame is inspected.
 */
export default function SectionTitle({ as: Tag = 'h2', className = '', children }) {
  return <Tag className={`text-h2 font-sans text-foreground ${className}`.trim()}>{children}</Tag>
}
