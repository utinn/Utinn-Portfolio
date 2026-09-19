export default function DimensionStage({ isEntering = false, isExiting = false, className = '', children }) {
  const stateClass = isExiting ? 'dimension-stage--exiting' : isEntering ? 'dimension-stage--entering' : ''

  return <div className={`dimension-stage ${stateClass} ${className}`.trim()}>{children}</div>
}
