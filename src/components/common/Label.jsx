/**
 * Reusable blue tag/label chip skeleton (role chips, skill tags, project
 * tags — CLAUDE.md Section 10). Default-state appearance and the hover
 * shine/glow/scale behavior are specified in ANIMATION_SPEC.md Section 12,
 * but exact colors/spacing/radius still need Figma inspection before this
 * is styled — informational only, not a link (INTERACTION_SPEC.md 18.2, 23.2).
 */
export default function Label({ className = '', children }) {
  return <span className={`inline-flex items-center font-sans ${className}`.trim()}>{children}</span>
}
