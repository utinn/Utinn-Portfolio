import { useLocation } from 'react-router-dom'
import DimensionStage from '../components/common/DimensionStage'
import ProjectsCurtainNav from '../components/sections/ProjectsCurtainNav'
import { useTeleport } from '../hooks/useTeleport'

/**
 * Projects landing page — the central category-selection view
 * (INTERACTION_SPEC.md 12.1). Its whole content is the curtain navigation
 * system (ANIMATION_SPEC.md Section 18); the page itself only reads the
 * teleport state so the curtains stay presentational.
 *
 * The heading is visually hidden: the approved composition shows no page
 * title, but the document still needs an h1 (CLAUDE.md Section 15) and no
 * visible copy is invented to supply one (Section 23).
 */
export default function Projects() {
  const { state } = useLocation()
  const { teleport, startTeleport } = useTeleport()

  /* THE entrance decision, made during the first render and constant for the
     life of this mount. A landing reached by teleport is revealed by the
     curtain already settled, so it must never play the entrance; a direct or
     cold visit still gets it. Route state is the only signal that is readable
     before the first paint — anything derived from `teleport` would be
     transient, and a transient signal is what caused the replay bug this
     replaces (see curtains.css, .curtain--panel-enter). */
  const isTeleportEntry = Boolean(state?.teleportEnter)

  return (
    <DimensionStage isEntering={isTeleportEntry} isExiting={teleport?.phase === 'cover'}>
      <h1 className="sr-only">Projects</h1>
      <ProjectsCurtainNav
        teleport={teleport}
        playEntrance={!isTeleportEntry}
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
