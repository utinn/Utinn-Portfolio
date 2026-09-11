import { languages } from '../../data/skills'
import { SKILLS_MOTION } from '../../motion/skillsMotion'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import Label from '../common/Label'

const { titleToFrameMs, frameToChipsMs, chipStepMs, chipToDotMs, chipsToLinesMs, lineStepMs, lineToTextMs } =
  SKILLS_MOTION.language

/** MEASURED: the connector runs 102px from the chip's lower edge down to the
 *  proficiency text. Declared once — the fixed-height wrapper, the fill's
 *  travel and the light head's keyframe distance all read this. */
const LINE_HEIGHT_PX = 102

const chipDelayMs = (index) => titleToFrameMs + frameToChipsMs + index * chipStepMs
const lineDelayMs = (index) =>
  titleToFrameMs + frameToChipsMs + (languages.length - 1) * chipStepMs + chipsToLinesMs + index * lineStepMs

/**
 * Language section of the Skills and Credentials Page.
 *
 * Sequence (owner instruction, refining ANIMATION_SPEC.md 22.3): section
 * title -> the rounded frame materialises -> the three chips land left to
 * right -> each chip's connector fills downward -> each proficiency label
 * arrives as its own line lands. Per language the 22.3 hierarchy still holds
 * exactly — chip, then line, then proficiency, never a label before its line
 * — the chips simply read as one group rather than three separate entries.
 *
 * MEASURED from docs/figma-reference/skills/SkillsPage.png at the 1440px
 * reference: a 564px frame, ~91px tall with 26px above the chips, the
 * connectors dropping 102px from each chip's lower edge and the proficiency
 * text 16px below them.
 *
 * The frame is drawn as an absolutely positioned backdrop behind the chip row
 * rather than as a wrapper, because the connectors have to start inside it
 * and cross its lower edge — a bordered wrapper would have to clip them or
 * fight z-index for it.
 */
export default function SkillsLanguage() {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.2 })

  return (
    <section ref={ref} aria-labelledby="language-heading" className="mx-auto mt-24 w-full max-w-[612px] px-6">
      <h2
        id="language-heading"
        className={`skill-wipe ${isVisible ? 'skill-wipe-visible' : ''} mx-auto w-fit text-h2 font-sans text-foreground`}
      >
        Language
      </h2>

      <div className="relative mx-auto mt-9 w-full max-w-[564px]" style={{ '--lang-line-h': `${LINE_HEIGHT_PX}px` }}>
        <div
          aria-hidden="true"
          className={`skill-frame ${isVisible ? 'skill-frame-visible' : ''} absolute inset-x-0 top-0 h-[91px] rounded-[28px] border border-white/25 bg-[#06090e]`}
          style={{
            '--reveal-delay': `${titleToFrameMs}ms`,
            '--frame-ms': 'var(--lang-frame-ms)',
            '--frame-from': '0.96',
            '--frame-glow': '0 0 70px rgba(96, 165, 250, 0.10), 0 0 26px rgba(96, 165, 250, 0.16)',
          }}
        />

        <ul className="relative grid grid-cols-3">
          {languages.map((language, index) => (
            <li key={language.id} className="flex flex-col items-center pt-[26px]">
              <span
                className={`tk-tag ${isVisible ? 'tk-tag-visible' : ''}`}
                style={{ '--reveal-delay': `${chipDelayMs(index)}ms`, '--tk-tag-ms': 'var(--lang-chip-ms)' }}
              >
                <Label size="language">{language.name}</Label>
              </span>

              {/* Anchor dot on the chip's lower edge — the point the connector
                  grows out of, so it lands with the chip, half overlapping it. */}
              <span
                aria-hidden="true"
                className={`exp-node-reveal timeline-node ${isVisible ? 'exp-reveal-visible' : ''} -mt-[5px] h-[10px] w-[10px]`}
                style={{ '--reveal-delay': `${chipDelayMs(index) + chipToDotMs}ms` }}
              />

              {/* Fixed-height track: the fill and its light head are pure
                  transforms inside it, so the proficiency text below never
                  moves while the connector draws. */}
              <div aria-hidden="true" className="relative w-[2px]" style={{ height: `${LINE_HEIGHT_PX}px` }}>
                <span
                  className={`lang-line ${isVisible ? 'lang-line-visible' : ''} absolute inset-0`}
                  style={{ '--reveal-delay': `${lineDelayMs(index)}ms` }}
                />
                <span
                  className={`lang-line-head ${isVisible ? 'lang-line-head-visible' : ''} h-[7px] w-[7px]`}
                  style={{ '--reveal-delay': `${lineDelayMs(index)}ms` }}
                />
              </div>

              {/* Bounded so the two long proficiencies wrap onto two lines
                  the way Figma draws them instead of crowding their
                  neighbours' columns. */}
              <p
                className={`skill-rise ${isVisible ? 'skill-rise-visible' : ''} mt-4 max-w-[170px] text-center text-body text-foreground`}
                style={{
                  '--reveal-delay': `${lineDelayMs(index) + lineToTextMs}ms`,
                  '--rise-ms': 'var(--lang-rise-ms)',
                  '--rise-y': '10px',
                }}
              >
                {language.proficiency}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
