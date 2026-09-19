import gameCategoryVisual from '../assets/images/projects/GameLogo.png'
import aiCategoryVisual from '../assets/images/projects/AILogo.png'


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
    arrowPosition: 'before',
    arrowDirection: 'left',
    to: '/projects/game',
    edge: 'left',
    ariaLabel: 'Game Projects',
    direction: CATEGORY_DIRECTION.game,
    teleportOriginX: '20%',
    figure: { src: gameCategoryVisual },
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
    figure: { src: aiCategoryVisual },
    particleCount: 168,
  },
]

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
