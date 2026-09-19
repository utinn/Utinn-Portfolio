import { experiences } from '../../data/experiences'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import Button from '../common/Button'
import ImagePlaceholder from '../common/ImagePlaceholder'
import SectionHeader, { SECTION_CONTENT_DELAY_MS } from '../common/SectionHeader'
import PageContainer from '../layout/PageContainer'

const CHECKPOINT_BASE_DELAY_MS = 150
const CHECKPOINT_STEP_MS = 900
const IMAGE_DELAY_OFFSET_MS = 120
const INFO_DELAY_OFFSET_MS = 220
const RAIL_DURATION_MS = 3000
const ITEM_DURATION_MS = 350
const CTA_GAP_MS = 120

const RAIL_END_MS = SECTION_CONTENT_DELAY_MS + RAIL_DURATION_MS
const LAST_CHECKPOINT_END_MS =
  SECTION_CONTENT_DELAY_MS +
  CHECKPOINT_BASE_DELAY_MS +
  (experiences.length - 1) * CHECKPOINT_STEP_MS +
  INFO_DELAY_OFFSET_MS +
  ITEM_DURATION_MS
const CTA_DELAY_MS = Math.max(RAIL_END_MS, LAST_CHECKPOINT_END_MS) + CTA_GAP_MS

export default function HomeExperience() {
  const { ref, isVisible: hasRevealed } = useScrollReveal({ threshold: 0.2 })

  return (
    <section ref={ref}>
      <PageContainer className="py-20 md:py-28">
        <SectionHeader
          title="Growing Through Experience"
          revealed={hasRevealed}
          className="mx-auto max-w-2xl text-center"
        >
          Beyond building projects, i also enjoy exploring new things. These are a few experiences that shaped how i
          work, communicate, and grow with others
        </SectionHeader>

        <div className="mt-16 flex flex-col gap-10 lg:flex-row lg:items-center lg:gap-8">
          <div className="-mx-6 flex-1 overflow-x-auto px-6 py-20 -my-20 sm:mx-0 sm:overflow-visible sm:px-0 sm:py-0 sm:my-0">
            <div
              className="grid min-w-[640px] items-center gap-x-6 gap-y-0 sm:min-w-0"
              style={{ gridTemplateColumns: `repeat(${experiences.length}, minmax(0, 1fr))` }}
            >
              <div className="col-span-full row-start-2 h-[2px] self-center bg-white/15">
                <div
                  className={`timeline-rail timeline-rail-glow h-full bg-accent/55 ${hasRevealed ? 'timeline-rail-visible' : ''}`}
                  style={{ '--reveal-delay': `${SECTION_CONTENT_DELAY_MS}ms` }}
                />
              </div>

              {experiences.map((experience, index) => {
                const isTextTop = index % 2 === 1
                const dotDelay = SECTION_CONTENT_DELAY_MS + CHECKPOINT_BASE_DELAY_MS + index * CHECKPOINT_STEP_MS
                const imageDelay = dotDelay + IMAGE_DELAY_OFFSET_MS
                const infoDelay = dotDelay + INFO_DELAY_OFFSET_MS
                const revealedClass = hasRevealed ? 'timeline-item-visible' : ''
                const imageGapClass = isTextTop ? 'mt-10' : 'mb-10'
                const infoGapClass = isTextTop ? 'mb-1' : 'mt-1'

                const imageBlock = (
                  <div
                    className={`timeline-item timeline-item--image timeline-image-glow ${revealedClass} ${imageGapClass} aspect-[4/3] w-full rounded-[var(--radius-card)] border-2`}
                    style={{ '--reveal-delay': `${imageDelay}ms` }}
                  >
                    <div className="h-full w-full overflow-hidden rounded-[var(--radius-card)]">
                      {experience.image ? (
                        <img src={experience.image} alt={experience.title} className="h-full w-full object-cover" />
                      ) : (
                        <ImagePlaceholder label={`${experience.title} photo coming soon`} />
                      )}
                    </div>
                  </div>
                )

                const infoBlock = (
                  <div
                    className={`timeline-item timeline-item--info ${revealedClass} ${infoGapClass} text-center`}
                    style={{ '--reveal-delay': `${infoDelay}ms` }}
                  >
                    <h3 className="text-lg font-sans font-bold text-foreground sm:text-xl">{experience.title}</h3>
                    <p className="mt-2 text-caption text-muted">
                      {experience.organization}
                      <br />
                      {experience.date}
                    </p>
                  </div>
                )

                return (
                  <div key={experience.id} className="contents">
                    <div style={{ gridColumn: index + 1, gridRow: 1 }}>{isTextTop ? infoBlock : imageBlock}</div>
                    <span
                      className={`timeline-item timeline-item--dot timeline-node ${revealedClass} relative z-10 h-5 w-5 justify-self-center`}
                      style={{ gridColumn: index + 1, gridRow: 2, '--reveal-delay': `${dotDelay}ms` }}
                      aria-hidden="true"
                    />
                    <div style={{ gridColumn: index + 1, gridRow: 3 }}>{isTextTop ? imageBlock : infoBlock}</div>
                  </div>
                )
              })}
            </div>
          </div>

          <div
            className={`timeline-cta ${hasRevealed ? 'timeline-cta-visible' : ''} flex justify-center lg:justify-end`}
            style={{ '--reveal-delay': `${CTA_DELAY_MS}ms` }}
          >
            <Button href="/experiences" variant="outline">
              View All Experiences
            </Button>
          </div>
        </div>
      </PageContainer>
    </section>
  )
}
