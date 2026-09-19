export default function ImagePlaceholder({ label, className = '' }) {
  return (
    <div
      role={label ? 'img' : undefined}
      aria-label={label || undefined}
      aria-hidden={label ? undefined : 'true'}
      className={`flex h-full w-full items-center justify-center bg-gradient-to-br from-white/[0.06] to-accent/10 ${className}`.trim()}
    >
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-white/25" aria-hidden="true">
        <path
          d="M4 5.5A1.5 1.5 0 0 1 5.5 4h13A1.5 1.5 0 0 1 20 5.5v13a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 18.5v-13Z"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path d="m5 17 4.5-5 3 3 2.5-3L19 17" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    </div>
  )
}
