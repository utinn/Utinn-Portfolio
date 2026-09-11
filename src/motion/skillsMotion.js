/**
 * ============================================================================
 * SKILLS PAGE MOTION — the one place to tune this page's animation timing.
 * ============================================================================
 *
 * Two halves, both edited here:
 *
 *   SKILLS_MOTION       delays / staggers / sequencing (milliseconds).
 *                       Consumed by the three Skills sections, which turn
 *                       them into each element's `--reveal-delay`.
 *
 *   SKILLS_MOTION_VARS  durations and easings, published as CSS custom
 *                       properties on the page root. The rules in
 *                       animations.css ("Section 22 — Skills page") read
 *                       these, so a duration change here is a duration
 *                       change everywhere on the page.
 *
 * Nothing else hard-codes a Skills timing value. `prefers-reduced-motion`
 * still overrides all of it globally (globals.css collapses every duration
 * and delay to ~0), so these numbers never need a reduced-motion variant.
 */

/*
 * NOT here: the gap between the page header ("Skills" + its caption) and the
 * Toolkits title. That is the site-wide cascade shared by Home, Achievements
 * and this page — SECTION_CONTENT_DELAY_MS in
 * src/components/common/SectionHeader.jsx. Changing it here would silently
 * split the page away from the rest of the site.
 */
export const SKILLS_MOTION = {
  toolkits: {
    /** Section title "Toolkits" -> row 1. */
    rowsStartMs: 420,
    /** Row -> next row. This is the "2 cards + 2 cards" cadence dial. */
    rowStepMs: 560,
    /** Inside a card, measured from that row's start: */
    frameOffsetMs: 200, // category title -> frame zoom-in
    tagsOffsetMs: 430, // frame -> first (RIGHTMOST) tag
    tagStepMs: 80, // tag -> next tag, travelling right to left
  },

  education: {
    /** Section title "Education" -> the rail starts drawing. */
    titleToRailMs: 380,
    /** Full left-to-right rail draw. Node delays are fractions of this. */
    railMs: 1500,
    /**
     * How far the rail is inset from each edge of the 3-column grid, as a
     * fraction of the grid width. MUST match `--edu-rail-inset` in
     * animations.css — it is what converts a node's column position into the
     * moment the drawing rail tip actually reaches it.
     */
    railInset: 0.05,
    /** Per checkpoint, measured from that checkpoint's node: */
    titleOffsetMs: 140, // node -> institution
    dateOffsetMs: 240, // node -> date
    panelOffsetMs: 340, // node -> lower information panel
  },

  language: {
    /** Section title "Language" -> the rounded frame materialises. */
    titleToFrameMs: 380,
    /** Frame -> first chip. */
    frameToChipsMs: 320,
    /** Chip -> next chip (left to right). */
    chipStepMs: 130,
    /** Chip -> its own anchor dot on the frame's lower edge. */
    chipToDotMs: 90,
    /** Last chip -> the first line starts filling downward. */
    chipsToLinesMs: 260,
    /** Line -> next line. */
    lineStepMs: 170,
    /**
     * A line starting -> its proficiency text. Keep this >= --lang-line-ms
     * (480ms): the owner's rule is that the text arrives once its own
     * connector has finished filling, never while it is still drawing.
     */
    lineToTextMs: 500,
  },
}

/**
 * Durations + easings. Applied as an inline style on the Skills page root and
 * read by the Section 22 rules in animations.css.
 *
 * `--edu-rail-ms` and `--lang-line-ms` are derived rather than typed twice:
 * the rail duration also drives the checkpoint delays above, and the line
 * duration also drives the travelling light head's keyframe, so both have to
 * stay in lockstep.
 */
export const SKILLS_MOTION_VARS = {
  /* Shared curves — the site's existing "settle" and "decelerate" pair. */
  '--skill-ease': 'cubic-bezier(0.22, 0.9, 0.32, 1)',
  '--skill-ease-out': 'cubic-bezier(0.16, 1, 0.3, 1)',

  /* Section titles + toolkit category titles (left-to-right wipe). */
  '--skill-wipe-ms': '520ms',

  /* Toolkits */
  '--tk-title-ms': '460ms',
  '--tk-frame-ms': '520ms',
  '--tk-tag-ms': '300ms',

  /* Education */
  '--edu-rail-ms': `${SKILLS_MOTION.education.railMs}ms`,
  '--edu-rail-inset': `${SKILLS_MOTION.education.railInset * 100}%`,
  '--edu-node-ms': '360ms',
  '--edu-rise-ms': '400ms',

  /* Language */
  '--lang-frame-ms': '520ms',
  '--lang-chip-ms': '300ms',
  '--lang-line-ms': '480ms',
  '--lang-rise-ms': '340ms',
}

/**
 * Where the drawing rail tip is when it reaches checkpoint `index` of
 * `count`, expressed as a fraction of the rail's own draw. Checkpoints sit at
 * the centre of equal grid columns while the rail is inset from both edges,
 * so the two coordinate spaces have to be reconciled — otherwise the outer
 * nodes light before or after the tip visibly passes them.
 */
export function railProgressAt(index, count, inset = SKILLS_MOTION.education.railInset) {
  const columnCentre = (2 * index + 1) / (2 * count)
  return (columnCentre - inset) / (1 - 2 * inset)
}

/**
 * Delay to hand an element that is joining a sequence which started at
 * `startedAt` (a `Date.now()` stamp taken when the section was revealed).
 *
 * Sections below the fold are the reason this exists: a row that scrolls into
 * view long after its section began must not sit still waiting out a delay
 * that has already elapsed, and a row that is on screen from the start must
 * still respect the section's cadence. Returning the *remaining* time does
 * both — full stagger for whatever is already visible, an immediate play for
 * whatever the reader reaches later.
 */
export function remainingDelayMs(startedAt, offsetMs) {
  if (startedAt == null) return offsetMs
  return Math.max(0, startedAt + offsetMs - Date.now())
}
