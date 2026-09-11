import { educationMilestones } from '../../data/skills'
import { SKILLS_MOTION, railProgressAt } from '../../motion/skillsMotion'
import { useScrollReveal } from '../../hooks/useScrollReveal'

const { titleToRailMs, railMs, titleOffsetMs, dateOffsetMs, panelOffsetMs } = SKILLS_MOTION.education

/** When the drawing rail tip arrives at checkpoint `index`. */
const nodeDelayMs = (index) =>
  Math.round(titleToRailMs + railMs * railProgressAt(index, educationMilestones.length))

/**
 * Education timeline on the Skills and Credentials Page.
 *
 * The MOTION MODEL is the Home Experience timeline's (owner instruction): one
 * continuous rail draws left to right and each checkpoint is triggered by the
 * tip arriving, never by a timer of its own — nodeDelayMs() is a fraction of
 * the rail's duration, and the rail is linear so the two can't drift apart.
 * The LAYOUT is this page's, not that one's: title and date above the rail, a
 * small text panel below it, no images anywhere.
 *
 * Where it departs from ANIMATION_SPEC.md 22.2: the spec asks for the upper
 * and lower content to land as one synchronised reveal, the owner has since
 * asked for a legible node -> title -> date -> panel cascade. The offsets are
 * kept tight (140/240/340ms) so it still reads as one checkpoint lighting up
 * rather than four separate events.
 *
 * MEASURED from docs/figma-reference/skills/SkillsPage.png at the 1440px
 * reference: a 1332px band with the rail inset ~67px at each end (the 5%
 * --edu-rail-inset), three checkpoints on equal column centres 444px apart,
 * 24px bold institutions over 14px dates, and 198x62px information panels
 * 22px below the rail.
 */
export default function SkillsEducation() {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.15 })

  return (
    <section ref={ref} aria-labelledby="education-heading" className="mx-auto mt-[68px] w-full max-w-[1380px] px-6">
      <h2
        id="education-heading"
        className={`skill-wipe ${isVisible ? 'skill-wipe-visible' : ''} mx-auto w-fit text-h2 font-sans text-foreground`}
      >
        Education
      </h2>

      {/* The section's own top gap lives on this wrapper, never on the scroll
          container inside it: that one carries a negative block margin to
          cancel its glow padding, and two competing margin-tops collide. */}
      <div className="mt-[82px]">
        {/*
          Figma gives the timeline one fixed horizontal 3-column composition
          and no mobile variant. Rather than crush three columns into phone
          width it keeps its proportions and scrolls inside its own container
          below `sm` — the same conservative translation (and the same reason
          for the py/-my pair: a non-visible overflow-x forces overflow-y to
          match, which would otherwise clip the nodes' glow) already used by
          the Home Experience timeline.
        */}
        <div className="-mx-6 -my-16 overflow-x-auto px-6 py-16 sm:mx-0 sm:my-0 sm:overflow-visible sm:px-0 sm:py-0">
          <div
            className="mx-auto grid min-w-[680px] max-w-[1332px] grid-cols-3 sm:min-w-0"
            style={{ gridTemplateRows: 'auto 14px auto' }}
          >
            <div className="edu-rail-track col-span-full row-start-2 h-[2px] self-center">
              <div
                className={`edu-rail timeline-rail-glow ${isVisible ? 'edu-rail-visible' : ''} h-full bg-accent/55`}
                style={{ '--reveal-delay': `${titleToRailMs}ms` }}
              />
            </div>

            {educationMilestones.map((milestone, index) => {
              const nodeDelay = nodeDelayMs(index)
              const riseClass = `skill-rise ${isVisible ? 'skill-rise-visible' : ''}`

              return (
                <div key={milestone.id} className="contents">
                  <div className="mb-5 self-end px-3 text-center" style={{ gridColumn: index + 1, gridRow: 1 }}>
                    <h3
                      className={`${riseClass} text-[24px] font-sans font-bold leading-tight text-foreground`}
                      style={{ '--reveal-delay': `${nodeDelay + titleOffsetMs}ms`, '--rise-ms': 'var(--edu-rise-ms)' }}
                    >
                      {milestone.institution}
                    </h3>
                    <p
                      className={`${riseClass} mt-2 text-caption text-muted`}
                      style={{
                        '--reveal-delay': `${nodeDelay + dateOffsetMs}ms`,
                        '--rise-ms': 'var(--edu-rise-ms)',
                        '--rise-y': '8px',
                      }}
                    >
                      {milestone.date}
                    </p>
                  </div>

                  <span
                    aria-hidden="true"
                    className={`exp-node-reveal timeline-node ${isVisible ? 'exp-reveal-visible' : ''} relative z-10 h-[14px] w-[14px] justify-self-center`}
                    style={{ gridColumn: index + 1, gridRow: 2, '--reveal-delay': `${nodeDelay}ms` }}
                  />

                  <div className="mt-[22px] flex justify-center" style={{ gridColumn: index + 1, gridRow: 3 }}>
                    {/* Text panel, not an image — the one deliberate
                        difference from the Home timeline's lower content. It
                        rises with a whisper of scale, and its glow rides the
                        same opacity so the panel lights up as it settles. */}
                    <p
                      className={`${riseClass} flex min-h-[62px] w-[198px] items-center justify-center rounded-2xl border border-white/25 bg-[#06090e] px-3 text-center text-body text-foreground shadow-[0_0_55px_rgba(96,165,250,0.10),0_0_20px_rgba(96,165,250,0.14)]`}
                      style={{
                        '--reveal-delay': `${nodeDelay + panelOffsetMs}ms`,
                        '--rise-ms': 'var(--edu-rise-ms)',
                        '--rise-y': '14px',
                        '--rise-scale': '0.97',
                      }}
                    >
                      {milestone.detail}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
