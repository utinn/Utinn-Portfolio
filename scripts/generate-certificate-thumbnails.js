import { existsSync, mkdirSync, readdirSync, statSync } from 'node:fs'
import { dirname, extname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const SOURCE_DIR = join(ROOT, 'src/assets/images/certificates')
const OUTPUT_DIR = join(ROOT, 'src/assets/images/certificate-thumbnails')

const THUMBNAIL_WIDTH = 1200
const THUMBNAIL_QUALITY = 80
const IMAGE_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg'])

function listImageFiles(dir, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) listImageFiles(full, out)
    else if (IMAGE_EXTENSIONS.has(extname(entry.name).toLowerCase())) out.push(full)
  }
  return out
}

async function generateThumbnail(sourcePath) {
  const rel = relative(SOURCE_DIR, sourcePath)
  const destPath = join(OUTPUT_DIR, `${rel.slice(0, -extname(rel).length)}.jpg`)

  const sourceStat = statSync(sourcePath)
  if (existsSync(destPath) && statSync(destPath).mtimeMs >= sourceStat.mtimeMs) {
    return 'cached'
  }

  mkdirSync(dirname(destPath), { recursive: true })

  try {
    await sharp(sourcePath)
      .rotate()
      .resize({ width: THUMBNAIL_WIDTH, withoutEnlargement: true })
      .jpeg({ quality: THUMBNAIL_QUALITY, mozjpeg: true })
      .toFile(destPath)
    return 'generated'
  } catch (err) {
    console.warn(`[certificate-thumbnails] Failed to generate thumbnail for "${rel}": ${err.message}`)
    return 'failed'
  }
}

async function main() {
  if (!existsSync(SOURCE_DIR)) return

  mkdirSync(OUTPUT_DIR, { recursive: true })
  const files = listImageFiles(SOURCE_DIR)
  const results = await Promise.all(files.map(generateThumbnail))

  const counts = results.reduce((acc, status) => ({ ...acc, [status]: (acc[status] ?? 0) + 1 }), {})
  console.log(
    `[certificate-thumbnails] ${counts.generated ?? 0} generated, ${counts.cached ?? 0} cached, ${counts.failed ?? 0} failed (${files.length} total).`,
  )
}

main()
