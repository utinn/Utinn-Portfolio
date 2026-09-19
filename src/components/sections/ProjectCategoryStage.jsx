import { useLocation } from 'react-router-dom'
import CurtainSurface from '../common/CurtainSurface'
import DimensionStage from '../common/DimensionStage'
import { useTeleport } from '../../hooks/useTeleport'
import { returnCurtains } from '../../data/projectCurtains'

export default function ProjectCategoryStage({ category, children }) {
  const { state } = useLocation()
  const { teleport, startTeleport } = useTeleport()
  const curtain = returnCurtains[category]

  return (
    <DimensionStage isEntering={Boolean(state?.teleportEnter)} isExiting={teleport?.phase === 'cover'}>
      <div className="projects-page-body" data-curtain-edge={curtain.edge} data-warp-depth="">
        {children}
      </div>

      <CurtainSurface
        className="curtain--return"
        isWarpScene
        to="/projects"
        tone={curtain.tone}
        edge={curtain.edge}
        particleDirection={curtain.direction}
        ariaLabel="Back to Projects"
        particleCount={36}
        isCharging={teleport?.phase === 'charge'}
        isLocked={teleport !== null}
        onActivate={() =>
          startTeleport({
            id: 'return',
            to: '/projects',
            tone: curtain.tone,
            originX: curtain.teleportOriginX,
            sweepDirection: curtain.sweepDirection,
          })
        }
      />
    </DimensionStage>
  )
}
