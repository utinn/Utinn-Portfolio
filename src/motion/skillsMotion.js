
export const SKILLS_MOTION = {
  toolkits: {
    rowsStartMs: 420,
    rowStepMs: 560,
    frameOffsetMs: 200,
    tagsOffsetMs: 430,
    tagStepMs: 80,
  },

  education: {
    titleToRailMs: 380,
    railMs: 1500,
    railInset: 0.05,
    titleOffsetMs: 140,
    dateOffsetMs: 240,
    panelOffsetMs: 340,
  },

  language: {
    titleToFrameMs: 380,
    frameToChipsMs: 320,
    chipStepMs: 130,
    chipToDotMs: 90,
    chipsToLinesMs: 260,
    lineStepMs: 170,
    lineToTextMs: 500,
  },
}

export const SKILLS_MOTION_VARS = {
  '--skill-ease': 'cubic-bezier(0.22, 0.9, 0.32, 1)',
  '--skill-ease-out': 'cubic-bezier(0.16, 1, 0.3, 1)',

  '--skill-wipe-ms': '520ms',

  '--tk-title-ms': '460ms',
  '--tk-frame-ms': '520ms',
  '--tk-tag-ms': '300ms',

  '--edu-rail-ms': `${SKILLS_MOTION.education.railMs}ms`,
  '--edu-rail-inset': `${SKILLS_MOTION.education.railInset * 100}%`,
  '--edu-node-ms': '360ms',
  '--edu-rise-ms': '400ms',

  '--lang-frame-ms': '520ms',
  '--lang-chip-ms': '300ms',
  '--lang-line-ms': '480ms',
  '--lang-rise-ms': '340ms',
}

export function railProgressAt(index, count, inset = SKILLS_MOTION.education.railInset) {
  const columnCentre = (2 * index + 1) / (2 * count)
  return (columnCentre - inset) / (1 - 2 * inset)
}

export function remainingDelayMs(startedAt, offsetMs) {
  if (startedAt == null) return offsetMs
  return Math.max(0, startedAt + offsetMs - Date.now())
}
