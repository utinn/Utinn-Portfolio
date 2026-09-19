import gameCategoryVisual from '../assets/images/projects/GameLogo.png'
import aiCategoryVisual from '../assets/images/projects/AILogo.png'

function decodeImage(src) {
  const img = new Image()
  img.src = src
  return decodeElement(img)
}

function decodeElement(img) {
  if (typeof img.decode !== 'function') return Promise.resolve()
  return img.decode().catch(() => {})
}

export const projectsAssetsReady = Promise.all([decodeImage(gameCategoryVisual), decodeImage(aiCategoryVisual)]).then(
  () => true,
)

export function whenImagesDecoded(root) {
  if (!root) return Promise.resolve()
  return Promise.all(Array.from(root.querySelectorAll('img'), decodeElement))
}

export { gameCategoryVisual, aiCategoryVisual }
