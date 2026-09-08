/**
 * Reusable section/page heading skeleton (CLAUDE.md Section 10). The size
 * follows the heading level: `h1` uses the confirmed 48px page-title token,
 * anything else the 36px section-title token. Both are the CLAUDE.md Section
 * 6 fallback scale — override per-section once the actual Figma frame is
 * inspected.
 */
export default function SectionTitle({ as: Tag = 'h2', className = '', children }) {
  const sizeClass = Tag === 'h1' ? 'text-h1' : 'text-h2'

  return <Tag className={`${sizeClass} font-sans text-foreground ${className}`.trim()}>{children}</Tag>
}
