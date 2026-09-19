import { useState } from 'react'
import { contactInfo } from '../../data/contact'
import { experienceTimeline } from '../../data/experiences'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import Button from '../common/Button'
import ExperienceTimelineItem from './ExperienceTimelineItem'
import MoreExperiencesConveyor from './MoreExperiencesConveyor'

const RAIL_DURATION_MS = 2400
const TAIL_CTA_GAP_MS = 220
const TAIL_CONVEYOR_GAP_MS = 260

const STOP_COUNT = experienceTimeline.length + 1

const stopDelayMs = (index) => Math.round((index / (STOP_COUNT - 1)) * RAIL_DURATION_MS)

const TAIL_DELAY_MS = stopDelayMs(STOP_COUNT - 1)
const CTA_DELAY_MS = TAIL_DELAY_MS + TAIL_CTA_GAP_MS
const CONVEYOR_DELAY_MS = CTA_DELAY_MS + TAIL_CONVEYOR_GAP_MS

export default function ExperienceTimeline() {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.05 })
  const [openId, setOpenId] = useState(null)

  return (
    <section ref={ref} aria-label="Experience timeline" className="mt-16">
      <div className="relative">
        <span
          aria-hidden="true"
          className={`exp-rail timeline-rail-glow ${isVisible ? 'exp-rail-visible' : ''} absolute left-[5px] top-3.5 bottom-[25px] w-[2px] bg-accent/55 sm:top-4`}
          style={{ '--exp-rail-ms': `${RAIL_DURATION_MS}ms` }}
        />

        <div className="space-y-11">
          {experienceTimeline.map((experience, index) => (
            <ExperienceTimelineItem
              key={experience.id}
              experience={experience}
              revealed={isVisible}
              nodeDelayMs={stopDelayMs(index)}
              isOpen={openId === experience.id}
              onToggle={() => setOpenId((current) => (current === experience.id ? null : experience.id))}
            />
          ))}
        </div>

        <div className="relative mt-14">
          <span
            aria-hidden="true"
            className={`exp-node-reveal timeline-node ${isVisible ? 'exp-reveal-visible' : ''} absolute left-0 top-1/2 h-3 w-3 -translate-y-1/2`}
            style={{ '--reveal-delay': `${TAIL_DELAY_MS}ms` }}
          />

          <div className="flex flex-wrap items-center gap-x-6 gap-y-4 pl-8 sm:pl-[38px]">
            <h2
              className={`exp-slide-reveal ${isVisible ? 'exp-reveal-visible' : ''} text-xl font-sans font-bold text-foreground sm:text-2xl`}
              style={{ '--reveal-delay': `${TAIL_DELAY_MS}ms` }}
            >
              More Experiences
            </h2>

            <div className={`exp-cta ${isVisible ? 'exp-reveal-visible' : ''}`} style={{ '--reveal-delay': `${CTA_DELAY_MS}ms` }}>
              <Button href={contactInfo.linkedin.url} external disabled={!contactInfo.linkedin.url}>
                View Via LinkedIn
              </Button>
            </div>
          </div>
        </div>
      </div>

      <MoreExperiencesConveyor revealed={isVisible} revealDelayMs={CONVEYOR_DELAY_MS} />
    </section>
  )
}
