const modules = import.meta.glob('../assets/images/certificates/**/*.{png,jpg,jpeg,PNG,JPG,JPEG}', {
  eager: true,
  import: 'default',
})

const thumbnailModules = import.meta.glob('../assets/images/certificate-thumbnails/**/*.jpg', {
  eager: true,
  import: 'default',
})

const stripExtension = (path) => path.replace(/\.[^./]+$/, '')

const thumbnailsByKey = new Map(
  Object.entries(thumbnailModules).map(([path, url]) => [
    stripExtension(path.replace('/certificate-thumbnails/', '/certificates/')),
    url,
  ]),
)

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

const FILENAME_PATTERN = /^(.+)__(.+)__(\d{4})-(\d{2})$/

function formatCategoryLabel(folder) {
  return folder
    .replace(/[_-]+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean)
    .map((word) => (word.toLowerCase() === 'and' ? '&' : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()))
    .join(' ')
}

function warnMalformed(path, reason) {
  if (import.meta.env.DEV) {
    console.warn(`[certificates] Skipping "${path}" — ${reason}.`)
  }
}

function parseCertificate(path, originalImage) {
  const segments = path.split('/')
  const filename = segments[segments.length - 1]
  const category = segments[segments.length - 2]
  const dotIndex = filename.lastIndexOf('.')
  const base = dotIndex === -1 ? filename : filename.slice(0, dotIndex)
  const thumbnailImage = thumbnailsByKey.get(stripExtension(path)) ?? originalImage

  const match = FILENAME_PATTERN.exec(base)
  if (!match) {
    warnMalformed(path, 'filename does not follow the "Title__Issuer__YYYY-MM" convention')
    return null
  }

  const [, rawTitle, rawIssuer, rawYear, rawMonth] = match
  const title = rawTitle.trim()
  const issuer = rawIssuer.trim()
  const year = Number(rawYear)
  const month = Number(rawMonth)

  if (!title) {
    warnMalformed(path, 'title is empty')
    return null
  }
  if (!issuer) {
    warnMalformed(path, 'issuer is empty')
    return null
  }
  if (month < 1 || month > 12) {
    warnMalformed(path, `month "${rawMonth}" is not between 01 and 12`)
    return null
  }

  return {
    id: path,
    title,
    issuer,
    issueDate: `${MONTH_NAMES[month - 1]} ${year}`,
    category,
    image: thumbnailImage,
    fullImage: originalImage,
    alt: `${title} certificate, issued by ${issuer}`,
    credentialUrl: null,
    sortKey: year * 12 + month,
  }
}

export const certificates = Object.entries(modules)
  .map(([path, image]) => parseCertificate(path, image))
  .filter(Boolean)
  .sort((a, b) => b.sortKey - a.sortKey)

const discoveredCategories = [...new Set(certificates.map((cert) => cert.category))].sort((a, b) =>
  formatCategoryLabel(a).localeCompare(formatCategoryLabel(b)),
)

export const certificateFilters = [
  { value: 'all', label: 'All' },
  ...discoveredCategories.map((category) => ({ value: category, label: formatCategoryLabel(category) })),
]
