import { usePageWarp } from '../../hooks/usePageWarp'

export default function WarpStage({ children }) {
  const { warp } = usePageWarp()

  return (
    <div
      className="warp-stage"
      data-warp-phase={warp?.phase}
      style={{ '--warp-origin-y': `${Math.round(warp?.originY ?? 0)}px` }}
    >
      {children}
    </div>
  )
}
