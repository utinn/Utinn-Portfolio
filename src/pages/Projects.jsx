import { useLayoutEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import DimensionStage from '../components/common/DimensionStage'
import ProjectsCurtainNav from '../components/sections/ProjectsCurtainNav'
import { usePageWarp } from '../hooks/usePageWarp'
import { useTeleport } from '../hooks/useTeleport'
import { whenImagesDecoded } from '../motion/projectsAssetReadiness'

export default function Projects() {
  const { state } = useLocation()
  const { teleport, startTeleport } = useTeleport()
  const { holdArrivalUntil } = usePageWarp()
  const sceneRef = useRef(null)

  useLayoutEffect(() => {
    holdArrivalUntil(whenImagesDecoded(sceneRef.current))
  }, [holdArrivalUntil])

  const isTeleportEntry = Boolean(state?.teleportEnter)
  const isWarpEntry = Boolean(state?.fromPageWarp)
  const skipLocalEntrance = isTeleportEntry || isWarpEntry

  return (
    <DimensionStage isEntering={isTeleportEntry} isExiting={teleport?.phase === 'cover'}>
      <h1 className="sr-only">Projects</h1>
      <ProjectsCurtainNav
        ref={sceneRef}
        teleport={teleport}
        playEntrance={!skipLocalEntrance}
        onSelect={(curtain) =>
          startTeleport({
            id: curtain.id,
            to: curtain.to,
            tone: curtain.tone,
            originX: curtain.teleportOriginX,
            sweepDirection: curtain.direction,
          })
        }
      />
    </DimensionStage>
  )
}
