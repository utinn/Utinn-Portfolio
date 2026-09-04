/**
 * Reusable background particle layer skeleton (CLAUDE.md Section 5 & 10).
 * The actual particle composition/density must be inspected from Figma;
 * the diagonal ambient drift behavior is specified in ANIMATION_SPEC.md
 * Section 11. Left empty and non-visual until those are implemented so it
 * does not invent a look that hasn't been verified.
 */
export default function BackgroundParticles({ className = '' }) {
  return <div aria-hidden="true" className={`pointer-events-none absolute inset-0 ${className}`.trim()} />
}
