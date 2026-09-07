/**
 * Projects landing curtain configuration (INTERACTION_SPEC.md Section 13,
 * ANIMATION_SPEC.md Section 18).
 *
 * Game and AI are the same curtain system with different parameters, so the
 * left/right difference lives here as data rather than as two components.
 *
 * MEASURED from docs/figma-reference/projects/CurtainSketch.png (1440x720):
 * the seam sits at x~605 (42% / 58% split) and the supporting figure boxes are
 * 220x155 (Game) and 200x284 (AI) — AI is the taller, more present visual.
 * Gradient stops for each tone live in src/styles/curtains.css.
 */

/**
 * THE directional identity of each project category — the single source of
 * truth for which way particles travel anywhere in the Projects system.
 *
 *   Game  ->  right       AI  ->  left
 *
 * Every emitter reads this: landing hover, child-page return hover, and the
 * teleport sweep. Do not re-derive direction from anything else.
 *
 * This exists because the direction bug it fixes came from exactly that: hover
 * particles were taking their direction from `edge`, which is a LAYOUT fact
 * (which screen edge a gradient sits against), while the teleport took its
 * direction from a separate field. The two happened to agree on the child
 * pages and disagree on the landing page, so the landing hover ran backwards.
 * Direction is a property of the CATEGORY, not of where its gradient is
 * parked, and it now has one home.
 */
export const CATEGORY_DIRECTION = {
  game: 'right',
  ai: 'left',
}

export const projectCurtains = [
  {
    id: 'game',
    tone: 'game',
    label: 'Game Projects',
    arrows: '<<<',
    /**
     * Arrows lead the label on the left curtain and trail it on the right.
     * This is the NAVIGATION arrow — it points at the side the destination
     * lives on, and is unrelated to CATEGORY_DIRECTION above (which is where
     * particles travel). They deliberately differ for Game.
     */
    arrowPosition: 'before',
    arrowDirection: 'left',
    to: '/projects/game',
    /** Screen edge the curtain's identity color sits against (layout only). */
    edge: 'left',
    ariaLabel: 'Game Projects',
    direction: CATEGORY_DIRECTION.game,
    teleportOriginX: '20%',
    figure: { src: null, requiredPath: 'src/assets/images/projects/Projects_GameCategoryVisual.png' },
    /**
     * Local hover particles — THE hover particle count for this curtain, and
     * the number the field reaches at full density. Only one curtain carries
     * it at a time. The much sparser idle field is derived from this value
     * (IDLE_PARTICLE_RATIO in components/common/CurtainSurface.jsx).
     */
    particleCount: 128,
  },
  {
    id: 'ai',
    tone: 'ai',
    label: 'AI Projects',
    arrows: '>>>',
    arrowPosition: 'after',
    arrowDirection: 'right',
    to: '/projects/ai',
    edge: 'right',
    ariaLabel: 'AI Projects',
    direction: CATEGORY_DIRECTION.ai,
    teleportOriginX: '80%',
    figure: { src: null, requiredPath: 'src/assets/images/projects/Projects_AICategoryVisual.png' },
    /* Denser than Game: AI is the portfolio's primary category and reads as
       the more luminous of the two. */
    particleCount: 168,
  },
]

/**
 * Return-curtain configuration for each category page (ANIMATION_SPEC.md
 * 18.12). No arrow glyph — the gradient region itself is the affordance.
 *
 * `direction` (hover particles) follows CATEGORY_DIRECTION, so a Game region
 * emits rightward and an AI region leftward no matter which screen edge it is
 * parked on.
 *
 * `sweepDirection` (the teleport band) is deliberately the COMPLEMENT of the
 * entry sweep instead, so the band still enters from the edge the user just
 * clicked. Setting it to CATEGORY_DIRECTION here would make the surge erupt
 * from the far side of the screen from the curtain they pressed. Flip these
 * two values if that trade is not wanted — nothing else needs to change.
 */
export const returnCurtains = {
  game: {
    tone: 'game',
    edge: 'right',
    direction: CATEGORY_DIRECTION.game,
    teleportOriginX: '88%',
    sweepDirection: 'left',
  },
  ai: {
    tone: 'ai',
    edge: 'left',
    direction: CATEGORY_DIRECTION.ai,
    teleportOriginX: '12%',
    sweepDirection: 'right',
  },
}
