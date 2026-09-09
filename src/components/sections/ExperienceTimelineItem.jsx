import { useEffect, useRef, useState } from 'react'
import Label from '../common/Label'
import ExperienceSupportingImage from './ExperienceSupportingImage'

/**
 * Expand sequence (ANIMATION_SPEC.md 20.3 / 20.6-20.8, reordered by the
 * owner: organisation and date now live in the collapsed header, so opening a
 * group starts at the tags).
 *
 *   tags, one by one  ->  branch lines draw  ->  key points slide in, each
 *   after its own branch  ->  supporting image last
 *
 * 20.7 is the hard constraint in there: a key point may never appear before
 * the branch line that connects it to the rail, so each point's delay is
 * derived from its branch rather than set independently.
 */
const TAG_BASE_MS = 40
const TAG_STEP_MS = 70
const BRANCH_BASE_MS = 260
const BRANCH_STEP_MS = 140
const BRANCH_TO_POINT_MS = 110
/** Small overlap once the last point has started, not after it finishes — 20.9 allows overlap for smoothness. */
const POINT_TO_FIGURE_GAP_MS = 90

/** Node -> title -> organisation + date, once the rail reaches this entry. */
const NODE_TO_TITLE_MS = 130
const TITLE_TO_META_MS = 130

/** Must match .exp-panel-content-closing's animation-duration in animations.css. */
const PANEL_CONTENT_CLOSE_MS = 160
/**
 * How long the staged tags/branches/points/image stay mounted after closing.
 * Must be >= .exp-panel's own close grid-template-rows duration (280ms) so
 * the collapse keeps sizing against real content the whole way down instead
 * of snapping to zero the instant the content unmounts.
 */
const DETAIL_CONTENT_UNMOUNT_MS = 300

/**
 * One collapsible experience on the dedicated Experiences Page.
 *
 * Collapsed it shows only the node, title and organisation • date
 * (INTERACTION_SPEC.md 17.1); the tags, key points and supporting image stay
 * hidden until the user opens it. Opening/closing is owned by the parent so
 * only one entry can be open at a time.
 *
 * Layout note: the article has no left padding of its own. Each block sets
 * its own offset from the rail instead, because the branch lines have to
 * start ~10px from the rail while the header and tags start ~38px from it —
 * a single shared padding could not do both, and negative offsets would be
 * cut off by the panel's overflow clip.
 */
export default function ExperienceTimelineItem({ experience, isOpen, onToggle, revealed, nodeDelayMs }) {
  const panelId = `experience-panel-${experience.id}`
  const revealClass = revealed ? 'exp-reveal-visible' : ''

  // Drives the panel content's brief "compression" keyframe on close (a plain
  // CSS transition can't pick this up on its own here — removing the open
  // keyframe animation snaps the transform straight to its resting value
  // instead of transitioning to it, verified in-browser), keeps the staged
  // tags/branches/points/image mounted a little past close so the panel's
  // collapse still has real content to size against, and bumps cycleKey on
  // every open so that block always remounts from a true initial state even
  // if a rapid reopen lands before the unmount timer below ever fires.
  const [isClosing, setIsClosing] = useState(false)
  const [showDetail, setShowDetail] = useState(isOpen)
  const [cycleKey, setCycleKey] = useState(0)
  const wasOpenRef = useRef(isOpen)
  useEffect(() => {
    if (isOpen) {
      wasOpenRef.current = true
      setIsClosing(false)
      setShowDetail(true)
      setCycleKey((key) => key + 1)
      return
    }
    if (wasOpenRef.current) {
      wasOpenRef.current = false
      setIsClosing(true)
      const closeTimer = setTimeout(() => setIsClosing(false), PANEL_CONTENT_CLOSE_MS)
      const unmountTimer = setTimeout(() => setShowDetail(false), DETAIL_CONTENT_UNMOUNT_MS)
      return () => {
        clearTimeout(closeTimer)
        clearTimeout(unmountTimer)
      }
    }
  }, [isOpen])

  const lastPointIndex = experience.keyPoints.length - 1
  const figureDelayMs =
    BRANCH_BASE_MS + Math.max(lastPointIndex, 0) * BRANCH_STEP_MS + BRANCH_TO_POINT_MS + POINT_TO_FIGURE_GAP_MS

  return (
    <article className="relative">
      <span
        aria-hidden="true"
        className={`exp-node-reveal timeline-node ${revealClass} absolute left-0 top-4 h-3 w-3 -translate-y-1/2`}
        style={{ '--reveal-delay': `${nodeDelayMs}ms` }}
      />

      <div className="pl-8 sm:pl-[38px]">
        <h2>
          <button
            type="button"
            className="exp-head block max-w-full cursor-pointer text-left"
            aria-expanded={isOpen}
            aria-controls={panelId}
            onClick={onToggle}
          >
            <span
              className={`exp-slide-reveal ${revealClass} block`}
              style={{ '--reveal-delay': `${nodeDelayMs + NODE_TO_TITLE_MS}ms` }}
            >
              <span className="exp-title text-xl font-sans font-bold text-foreground sm:text-2xl">
                {experience.title}
              </span>
            </span>
          </button>
        </h2>

        <p
          className={`exp-slide-reveal ${revealClass} mt-0.5 text-caption text-muted`}
          style={{ '--reveal-delay': `${nodeDelayMs + NODE_TO_TITLE_MS + TITLE_TO_META_MS}ms` }}
        >
          {experience.organization} <span aria-hidden="true">·</span> {experience.date}
        </p>
      </div>

      {/* The panel is widened by -mx-12 and the padding put back on the inner
          content, so the clipping box (overflow-hidden, unavoidable — it is
          what makes the 0fr -> 1fr animation clip its content) sits 48px
          outside the column and the supporting image's glow has somewhere to
          bloom instead of ending on a hard vertical edge. */}
      <div id={panelId} inert={!isOpen} className={`exp-panel -mx-12 ${isOpen ? 'exp-panel-open' : ''}`}>
        <div className={`exp-panel-content ${isClosing ? 'exp-panel-content-closing' : ''}`}>
          <div className="px-12">
            {/* Mounted only while open (plus a short unmount grace so the panel's
                own collapse still has real content to size against) and keyed
                per open cycle — see the reset-lifecycle note on .exp-tag etc. in
                animations.css. A freshly mounted element can't already be sitting
                at its revealed state, so every open replays this from scratch. */}
            {showDetail && (
              <div key={cycleKey}>
                <div className="flex flex-wrap gap-2.5 pt-3.5 pl-8 sm:pl-[38px]">
                  {experience.tags.map((tag, i) => (
                    <span key={tag} className="exp-tag" style={{ '--reveal-delay': `${TAG_BASE_MS + i * TAG_STEP_MS}ms` }}>
                      <Label size="sm">{tag}</Label>
                    </span>
                  ))}
                </div>

                <div className="mt-6 grid gap-8 pb-12 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start lg:gap-x-7">
                  <ul className="space-y-7">
                    {experience.keyPoints.map((point, i) => {
                      const branchDelay = BRANCH_BASE_MS + i * BRANCH_STEP_MS
                      return (
                        <li key={point} className="flex gap-4 pl-2.5">
                          <span
                            aria-hidden="true"
                            className="exp-branch mt-[9px] h-[2px] w-9 shrink-0 bg-accent/40"
                            style={{ '--reveal-delay': `${branchDelay}ms` }}
                          />
                          <p
                            className="exp-point text-body leading-[1.3] text-white/90"
                            style={{ '--reveal-delay': `${branchDelay + BRANCH_TO_POINT_MS}ms` }}
                          >
                            {point}
                          </p>
                        </li>
                      )
                    })}
                  </ul>

                  <div className="exp-figure" style={{ '--reveal-delay': `${figureDelayMs}ms` }}>
                    <ExperienceSupportingImage images={experience.images} title={experience.title} isOpen={isOpen} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}
