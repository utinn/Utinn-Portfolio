import { useState } from 'react'
import BackgroundParticles from '../common/BackgroundParticles'
import CurtainSurface from '../common/CurtainSurface'
import ImagePlaceholder from '../common/ImagePlaceholder'
import { projectCurtains } from '../../data/projectCurtains'

export default function ProjectsCurtainNav({ ref, teleport, playEntrance, onSelect }) {
  const [activeId, setActiveId] = useState(null)

  return (
    <section ref={ref} aria-label="Project categories" className="projects-curtains" data-warp-scene="">
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
            setActiveId((current) => (active ? curtain.id : current === curtain.id ? null : current))
          }
          onActivate={() => onSelect(curtain)}
        >
          <span className="curtain__label">
            {curtain.arrowPosition === 'before' && <span className="curtain__arrows">{curtain.arrows}</span>}
            {curtain.label}
            {curtain.arrowPosition === 'after' && <span className="curtain__arrows">{curtain.arrows}</span>}
          </span>

          <span className={`curtain__figure ${curtain.figure.src ? '' : 'curtain__figure--placeholder'}`.trim()}>
            {curtain.figure.src ? <img src={curtain.figure.src} alt="" /> : <ImagePlaceholder />}
          </span>
        </CurtainSurface>
      ))}

      <span aria-hidden="true" className="curtain-seam" />

      <BackgroundParticles className="curtain-stars" />
    </section>
  )
}
