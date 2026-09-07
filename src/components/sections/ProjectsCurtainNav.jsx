import { useState } from 'react'
import BackgroundParticles from '../common/BackgroundParticles'
import CurtainSurface from '../common/CurtainSurface'
import ImagePlaceholder from '../common/ImagePlaceholder'
import { projectCurtains } from '../../data/projectCurtains'

/**
 * Projects landing curtain navigation (INTERACTION_SPEC.md Section 13,
 * ANIMATION_SPEC.md Section 18).
 *
 * The 42/58 split is structural and never changes on hover — hierarchy and
 * hover response are carried entirely by transform, glow and brightness, so no
 * interaction can reflow the grid.
 *
 * The grid is a fixed, viewport-filling layer (see .projects-curtains in
 * curtains.css): the regions must read as full-height atmospheric zones, and a
 * block in the document flow always ends somewhere visible. The landing page
 * has no scrolling content of its own, so nothing is lost by taking it out of
 * flow.
 *
 * Both curtains are the same component with different data; only the hover
 * cross-talk (the inactive curtain quieting slightly) lives here, because it
 * is the one piece of state neither curtain owns alone.
 *
 * `playEntrance` is decided by the page before the first render (see
 * Projects.jsx) and is constant for the life of the mount, so the entrance
 * class is either present from the very first paint or never present at all.
 */
export default function ProjectsCurtainNav({ teleport, playEntrance, onSelect }) {
  const [activeId, setActiveId] = useState(null)

  return (
    <section aria-label="Project categories" className="projects-curtains">
      {projectCurtains.map((curtain) => (
        <CurtainSurface
          key={curtain.id}
          className={playEntrance ? 'curtain--panel curtain--panel-enter' : 'curtain--panel'}
          to={curtain.to}
          tone={curtain.tone}
          edge={curtain.edge}
          arrowDirection={curtain.arrowDirection}
          particleDirection={curtain.direction}
          ariaLabel={curtain.ariaLabel}
          particleCount={curtain.particleCount}
          isQuiet={activeId !== null && activeId !== curtain.id}
          isCharging={teleport?.id === curtain.id && teleport.phase === 'charge'}
          isLocked={teleport !== null}
          onActiveChange={(active) =>
            // Guarded so a pointer moving between the two curtains (whose
            // enter/leave order is not guaranteed) can't clear the new active id.
            setActiveId((current) => (active ? curtain.id : current === curtain.id ? null : current))
          }
          onActivate={() => onSelect(curtain)}
        >
          <span className="curtain__label">
            {curtain.arrowPosition === 'before' && <span className="curtain__arrows">{curtain.arrows}</span>}
            {curtain.label}
            {curtain.arrowPosition === 'after' && <span className="curtain__arrows">{curtain.arrows}</span>}
          </span>

          {/* Supporting category visual. The production artwork has not been
              supplied, so the slot is reserved at its measured size rather
              than filled with invented art — see data/projectCurtains.js for
              the exact file each curtain expects. */}
          <span className={`curtain__figure ${curtain.figure.src ? '' : 'curtain__figure--placeholder'}`.trim()}>
            {curtain.figure.src ? <img src={curtain.figure.src} alt="" /> : <ImagePlaceholder />}
          </span>
        </CurtainSurface>
      ))}

      <span aria-hidden="true" className="curtain-seam" />

      {/* The global star field, re-rendered above the opaque curtain regions so
          it stays visible across both of them exactly as the approved sketch
          shows it. Reuses the site-wide component rather than a second system. */}
      <BackgroundParticles className="curtain-stars" />
    </section>
  )
}
