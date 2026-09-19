import { Link } from 'react-router-dom'

const isInternal = (href) => typeof href === 'string' && href.startsWith('/')

const VARIANT_CLASSES = {
  solid: 'bg-foreground text-background hover:bg-white/90',
  outline:
    'border border-white/60 text-foreground bg-transparent hover:border-white hover:shadow-[0_0_22px_rgba(255,255,255,0.18)]',
}

const SIZE_CLASSES = {
  md: 'gap-2.5 rounded-2xl px-6 py-3 text-body',
  sm: 'gap-1.5 rounded-lg px-4 py-2 text-caption',
}

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
