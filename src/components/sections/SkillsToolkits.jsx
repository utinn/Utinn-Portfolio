import { useRef } from 'react'
import { toolkitGroups } from '../../data/skills'
import { SKILLS_MOTION, remainingDelayMs } from '../../motion/skillsMotion'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import Label from '../common/Label'

const { rowsStartMs, rowStepMs, frameOffsetMs, tagsOffsetMs, tagStepMs } = SKILLS_MOTION.toolkits

const GROUPS_PER_ROW = 2

const toRows = (groups) =>
  groups.reduce((rows, group, index) => {
    if (index % GROUPS_PER_ROW === 0) rows.push([])
    rows[rows.length - 1].push(group)
    return rows
  }, [])

function startClock(clock, startDelayMs) {
  if (clock.current === null) clock.current = Date.now() + startDelayMs
}

function ToolkitGroup({ group, revealed, delayMs, onTagAnimationEnd }) {
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
                  '--reveal-delay': `${delayMs + tagsOffsetMs + index * tagStepMs}ms`,
                }}
                onAnimationEnd={onTagAnimationEnd}
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

function ToolkitRow({ groups, rowIndex, sectionClock, startDelayMs, isLastRow, onRowComplete }) {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.25 })
  const delayRef = useRef(null)
  const completedTagCountRef = useRef(0)
  const rowCompleteRef = useRef(false)

  if (isVisible && delayRef.current === null) {
    startClock(sectionClock, startDelayMs)
    delayRef.current = remainingDelayMs(sectionClock.current, rowsStartMs + rowIndex * rowStepMs)
  }

  const totalTagCount = isLastRow ? groups.reduce((count, group) => count + group.tags.length, 0) : 0

  const handleTagAnimationEnd = isLastRow
    ? () => {
        completedTagCountRef.current += 1
        if (!rowCompleteRef.current && completedTagCountRef.current >= totalTagCount) {
          rowCompleteRef.current = true
          onRowComplete?.()
        }
      }
    : undefined

  return (
    <div ref={ref} className="grid grid-cols-1 gap-x-14 gap-y-[34px] md:grid-cols-2">
      {groups.map((group) => (
        <ToolkitGroup
          key={group.id}
          group={group}
          revealed={isVisible}
          delayMs={delayRef.current ?? 0}
          onTagAnimationEnd={handleTagAnimationEnd}
        />
      ))}
    </div>
  )
}

export default function SkillsToolkits({ startDelayMs = 0, onComplete }) {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.05 })
  const sectionClock = useRef(null)
  const rows = toRows(toolkitGroups)
  const lastRowIndex = rows.length - 1

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
        {rows.map((groups, rowIndex) => (
          <ToolkitRow
            key={groups[0].id}
            groups={groups}
            rowIndex={rowIndex}
            sectionClock={sectionClock}
            startDelayMs={startDelayMs}
            isLastRow={rowIndex === lastRowIndex}
            onRowComplete={onComplete}
          />
        ))}
      </div>
    </section>
  )
}
