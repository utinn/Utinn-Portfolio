import { useRef } from 'react'
import { toolkitGroups } from '../../data/skills'
import { SKILLS_MOTION, remainingDelayMs } from '../../motion/skillsMotion'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import Label from '../common/Label'

const { rowsStartMs, rowStepMs, frameOffsetMs, tagsOffsetMs, tagStepMs } = SKILLS_MOTION.toolkits

/** Figma draws two groups per row; the flat data list is chunked to match. */
const GROUPS_PER_ROW = 2

const toRows = (groups) =>
  groups.reduce((rows, group, index) => {
    if (index % GROUPS_PER_ROW === 0) rows.push([])
    rows[rows.length - 1].push(group)
    return rows
  }, [])

/**
 * One toolkit group: category title -> frame -> tags, right to left.
 *
 * All three stages share the row's single delay so the pair of cards in a row
 * moves as one unit, which is what makes the "2 cards + 2 cards + 2 cards +
 * 2 cards" cadence legible (owner instruction / 22.1 "Group Coordination").
 *
 * Tag order is the reveal's only reversed axis: `tags.length - 1 - index`
 * turns Figma's left-to-right array into a rightmost-first sequence without
 * ever reordering the markup, so the DOM, the reading order and the
 * accessibility tree all stay in Figma's order (owner instruction,
 * superseding 22.1's left-to-right stagger).
 */
/** Starts the section's shared clock once, at the moment it is first needed. */
function startClock(clock, startDelayMs) {
  if (clock.current === null) clock.current = Date.now() + startDelayMs
}

function ToolkitGroup({ group, revealed, delayMs }) {
  return (
    <div className="min-w-0">
      <h3
        className={`skill-wipe ${revealed ? 'skill-wipe-visible' : ''} text-[24px] font-sans font-bold leading-tight text-foreground`}
        style={{ '--reveal-delay': `${delayMs}ms`, '--skill-wipe-ms': 'var(--tk-title-ms)' }}
      >
        {group.title}
      </h3>

      <div
        className={`skill-frame ${revealed ? 'skill-frame-visible' : ''} mt-3.5 min-h-[78px] rounded-2xl border border-white/25 bg-[#06090e] px-5 py-[22px]`}
        style={{
          '--reveal-delay': `${delayMs + frameOffsetMs}ms`,
          '--frame-ms': 'var(--tk-frame-ms)',
          '--frame-glow': '0 0 70px rgba(96, 165, 250, 0.10), 0 0 26px rgba(96, 165, 250, 0.16)',
        }}
      >
        <ul className="flex flex-wrap gap-2">
          {group.tags.map((tag, index) => (
            <li key={tag}>
              <span
                className={`tk-tag ${revealed ? 'tk-tag-visible' : ''}`}
                style={{
                  '--reveal-delay': `${delayMs + tagsOffsetMs + (group.tags.length - 1 - index) * tagStepMs}ms`,
                }}
              >
                <Label size="toolkit">{tag}</Label>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

/**
 * One row of the 2-column grid, and the unit the whole section staggers by.
 *
 * The row owns its own scroll reveal rather than inheriting the section's:
 * the four rows are ~620px tall in total, so the lower ones are below the
 * fold on a laptop and a section-wide trigger would play them to an empty
 * screen. remainingDelayMs() keeps the intended cadence for whatever is
 * already on screen (row 2 still waits its turn behind row 1) while a row
 * the reader only reaches later plays as soon as it arrives.
 *
 * The delay is latched on the row's first reveal — it feeds a CSS
 * transition-delay, and recomputing it mid-flight would restart the row.
 * Whichever of the section or its first row is revealed first starts the
 * shared clock, so the cadence does not depend on which observer React
 * happens to flush first.
 */
function ToolkitRow({ groups, rowIndex, sectionClock, startDelayMs }) {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.25 })
  const delayRef = useRef(null)

  if (isVisible && delayRef.current === null) {
    startClock(sectionClock, startDelayMs)
    delayRef.current = remainingDelayMs(sectionClock.current, rowsStartMs + rowIndex * rowStepMs)
  }

  return (
    <div ref={ref} className="grid grid-cols-1 gap-x-14 gap-y-[34px] md:grid-cols-2">
      {groups.map((group) => (
        <ToolkitGroup key={group.id} group={group} revealed={isVisible} delayMs={delayRef.current ?? 0} />
      ))}
    </div>
  )
}

/**
 * Toolkits section of the Skills and Credentials Page.
 *
 * MEASURED from docs/figma-reference/skills/SkillsPage.png at the 1440px
 * reference: a 1148px content column split into two 546px columns 56px
 * apart, each group being a 24px bold title over a 78px frame, and 34px
 * between one row's frame and the next row's title.
 *
 * `startDelayMs` is the page header cascade — this section is on screen at
 * load, so its title has to wait for "Skills" and its caption rather than
 * racing them.
 */
export default function SkillsToolkits({ startDelayMs = 0 }) {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.05 })
  const sectionClock = useRef(null)

  if (isVisible) startClock(sectionClock, startDelayMs)

  return (
    <section ref={ref} aria-labelledby="toolkits-heading" className="mx-auto mt-[60px] w-full max-w-[1196px] px-6">
      <h2
        id="toolkits-heading"
        className={`skill-wipe ${isVisible ? 'skill-wipe-visible' : ''} mx-auto w-fit text-h2 font-sans text-foreground`}
        style={{ '--reveal-delay': `${startDelayMs}ms` }}
      >
        Toolkits
      </h2>

      <div className="mt-10 flex flex-col gap-[34px]">
        {toRows(toolkitGroups).map((groups, rowIndex) => (
          <ToolkitRow
            key={groups[0].id}
            groups={groups}
            rowIndex={rowIndex}
            sectionClock={sectionClock}
            startDelayMs={startDelayMs}
          />
        ))}
      </div>
    </section>
  )
}
