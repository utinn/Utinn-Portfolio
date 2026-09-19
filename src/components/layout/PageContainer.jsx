export default function PageContainer({ className = '', children }) {
  return (
    <div className={`mx-auto w-full px-6 ${className}`.trim()} style={{ maxWidth: 'var(--desktop-width)' }}>
      {children}
    </div>
  )
}
