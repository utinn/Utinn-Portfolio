export default function SectionTitle({ as: Tag = 'h2', className = '', children }) {
  const sizeClass = Tag === 'h1' ? 'text-h1' : 'text-h2'

  return <Tag className={`${sizeClass} font-sans text-foreground ${className}`.trim()}>{children}</Tag>
}
