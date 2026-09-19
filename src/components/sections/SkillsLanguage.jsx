import { languages } from '../../data/skills'
import { SKILLS_MOTION } from '../../motion/skillsMotion'
import Label from '../common/Label'

const { titleToFrameMs, frameToChipsMs, chipStepMs, chipToDotMs, chipsToLinesMs, lineStepMs, lineToTextMs } =
  SKILLS_MOTION.language

const LINE_HEIGHT_PX = 102

const chipDelayMs = (index) => titleToFrameMs + frameToChipsMs + index * chipStepMs
const lineDelayMs = (index) =>
  titleToFrameMs + frameToChipsMs + (languages.length - 1) * chipStepMs + chipsToLinesMs + index * lineStepMs

export default function SkillsLanguage({ isVisible }) {
  return (
    <section aria-labelledby="language-heading" className="mx-auto w-full max-w-[612px] px-6">
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

        <ul className="relative grid grid-cols-2">
          {languages.map((language, index) => (
            <li key={language.id} className="flex flex-col items-center pt-[26px]">
              <span
                className={`tk-tag ${isVisible ? 'tk-tag-visible' : ''}`}
                style={{ '--reveal-delay': `${chipDelayMs(index)}ms`, '--tk-tag-ms': 'var(--lang-chip-ms)' }}
              >
                <Label size="language">{language.name}</Label>
              </span>

              <span
                aria-hidden="true"
                className={`exp-node-reveal timeline-node ${isVisible ? 'exp-reveal-visible' : ''} -mt-[5px] h-[10px] w-[10px]`}
                style={{ '--reveal-delay': `${chipDelayMs(index) + chipToDotMs}ms` }}
              />

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
