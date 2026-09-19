const SIZE_CLASSES = {
  sm: 'rounded-md border px-3 py-1 text-caption',
  md: 'rounded-lg border px-4 py-2 text-body',
  toolkit: 'rounded-lg border px-3.5 py-[6px] text-caption',
  language: 'rounded-[4px] border px-4 py-[7px] text-caption',
}

export default function Label({ size = 'sm', className = '', children }) {
  return (
    <span
      className={`tag-chip inline-flex items-center border-accent/60 font-sans font-medium text-accent ${SIZE_CLASSES[size]} ${className}`.trim()}
    >
      {children}
    </span>
  )
}
