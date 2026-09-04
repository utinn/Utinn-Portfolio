/**
 * Shared content container bounding width to the confirmed 1440px desktop
 * design reference (CLAUDE.md Section 5). Horizontal padding is a
 * conservative placeholder pending per-page Figma inspection — do not
 * treat it as final (CLAUDE.md Section 3).
 */
export default function PageContainer({ className = '', children }) {
  return (
    <div className={`mx-auto w-full px-6 ${className}`.trim()} style={{ maxWidth: 'var(--desktop-width)' }}>
      {children}
    </div>
  )
}
