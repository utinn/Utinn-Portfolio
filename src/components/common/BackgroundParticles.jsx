/**
 * Reusable ambient background particle layer (CLAUDE.md Section 5 & 10).
 * Implemented as a single tiled radial-gradient layer rather than dozens of
 * individual dot elements (CLAUDE.md Section 18 performance guidance).
 *
 * The tile's dot positions/opacities are a provisional visual approximation
 * of the scattered field seen in the Figma reference PNGs (exact density
 * and composition were not measurable without Figma MCP — verify later).
 *
 * Continuous top-left -> bottom-right drift is defined in
 * ANIMATION_SPEC.md Section 11; the drift distance below matches the tile
 * size exactly so the loop is seamless.
 */
const TILE_SIZE = 260

const DOT_LAYERS = [
  'radial-gradient(1.6px 1.6px at 20px 30px, rgba(255,255,255,0.9), transparent 100%)',
  'radial-gradient(1.2px 1.2px at 90px 80px, rgba(255,255,255,0.55), transparent 100%)',
  'radial-gradient(1.8px 1.8px at 150px 40px, rgba(96,165,250,0.85), transparent 100%)',
  'radial-gradient(1.2px 1.2px at 200px 120px, rgba(255,255,255,0.5), transparent 100%)',
  'radial-gradient(1.4px 1.4px at 60px 170px, rgba(255,255,255,0.7), transparent 100%)',
  'radial-gradient(1.6px 1.6px at 230px 200px, rgba(96,165,250,0.6), transparent 100%)',
  'radial-gradient(1.1px 1.1px at 130px 230px, rgba(255,255,255,0.45), transparent 100%)',
  'radial-gradient(1.3px 1.3px at 10px 220px, rgba(255,255,255,0.6), transparent 100%)',
].join(', ')

export default function BackgroundParticles({ className = '' }) {
  return (
    <div aria-hidden="true" className={`pointer-events-none fixed inset-0 overflow-hidden ${className}`.trim()}>
      <div
        className="bg-particles-layer"
        style={{
          backgroundImage: DOT_LAYERS,
          backgroundSize: `${TILE_SIZE}px ${TILE_SIZE}px`,
          backgroundRepeat: 'repeat',
        }}
      />
    </div>
  )
}
