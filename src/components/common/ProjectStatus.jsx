import { statusColors } from '../../data/projects'

export default function ProjectStatus({ status, className = '' }) {
  if (!status) return null

  const isInProgress = status === 'Work In Progress'

  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 font-mono text-[11px] font-medium tracking-[0.08em] uppercase ${className}`.trim()}
      style={{ color: statusColors[status] }}
    >
      <span
        aria-hidden="true"
        className={`status-dot ${isInProgress ? 'status-dot--breathing' : ''}`.trim()}
      />
      {status}
    </span>
  )
}
