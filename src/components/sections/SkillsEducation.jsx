import { educationMilestones } from '../../data/skills'
import { SKILLS_MOTION, railProgressAt } from '../../motion/skillsMotion'

const { titleToRailMs, railMs, titleOffsetMs, dateOffsetMs, panelOffsetMs } = SKILLS_MOTION.education

const nodeDelayMs = (index) =>
  Math.round(titleToRailMs + railMs * railProgressAt(index, educationMilestones.length))

export default function SkillsEducation({ isVisible }) {
  return (
    <section aria-labelledby="education-heading" className="w-full">
      <h2
        id="education-heading"
        className={`skill-wipe ${isVisible ? 'skill-wipe-visible' : ''} mx-auto w-fit text-h2 font-sans text-foreground`}
      >
        Education
      </h2>

      <div className="mt-[82px]">
        <div className="-mx-6 -my-16 overflow-x-auto px-6 py-16 sm:mx-0 sm:my-0 sm:overflow-visible sm:px-0 sm:py-0">
          <div
            className="mx-auto grid min-w-[460px] max-w-[520px] grid-cols-2 sm:min-w-0"
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
