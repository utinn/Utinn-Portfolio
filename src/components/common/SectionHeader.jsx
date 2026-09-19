import SectionTitle from './SectionTitle'

export const SECTION_CONTENT_DELAY_MS = 600

export default function SectionHeader({
  title,
  as = 'h2',
  revealed = false,
  className = '',
  captionClassName = 'mt-4',
  children,
}) {
  return (
    <div className={`${revealed ? 'section-header-revealed' : ''} ${className}`.trim()}>
      <SectionTitle as={as} className="section-header-title">
        {title}
      </SectionTitle>
      {children && <p className={`section-header-caption ${captionClassName} text-body text-muted`}>{children}</p>}
    </div>
  )
}
