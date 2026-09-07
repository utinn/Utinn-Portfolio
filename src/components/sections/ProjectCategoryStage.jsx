import { useLocation } from 'react-router-dom'
import CurtainSurface from '../common/CurtainSurface'
import DimensionStage from '../common/DimensionStage'
import { useTeleport } from '../../hooks/useTeleport'
import { returnCurtains } from '../../data/projectCurtains'

/**
 * Shared shell for the two category pages (INTERACTION_SPEC.md Sections 14 &
 * 15). Game and AI differ only in which edge their return curtain sits on and
 * which tone it carries, so the wiring lives here once instead of being
 * duplicated across both pages.
 *
 * DEPARTURE (owner correction pass): the return curtain carries no arrow glyph
 * and no label, where ANIMATION_SPEC.md 18.12 and INTERACTION_SPEC.md 14.2 /
 * 15.2 call for a directional arrow. The gradient region is now the whole
 * affordance — it still glows, leans and emits particles on hover, and it is
 * still a real link with an accessible name, so neither the navigation nor its
 * discoverability by assistive tech depended on the removed glyph.
 *
 * ASSUMPTION (not specified): the return curtain wears the tone of the world
 * it sits in (neutral on Game, blue on AI) rather than a shared neutral, so it
 * reads as part of the current category rather than pasted on.
 */
export default function ProjectCategoryStage({ category, children }) {
  const { state } = useLocation()
  const { teleport, startTeleport } = useTeleport()
  const curtain = returnCurtains[category]

  return (
    <DimensionStage isEntering={Boolean(state?.teleportEnter)} isExiting={teleport?.phase === 'cover'}>
      {/* Keeps page content clear of the fixed return curtain. Reads the same
          --return-curtain-hit token the link's own width comes from (the hit
          area, not the narrower visible band), so resizing either can never
          leave the padding stale. */}
      <div
        style={{
          [curtain.edge === 'right' ? 'paddingRight' : 'paddingLeft']:
            'calc(var(--return-curtain-hit) + 1.5rem)',
        }}
      >
        {children}
      </div>

      <CurtainSurface
        className="curtain--return"
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
