/**
 * Certificates Page grid + filter (INTERACTION_SPEC.md 24, CLAUDE.md owner
 * clarification 4). The filter row is an approved addition even though it
 * is not present in the current Figma frame.
 */
export const certificateCategories = ['All', 'Courses', 'Programs', 'Competitions']

/**
 * Each item must carry its own category — never infer it from filename,
 * image, or order (INTERACTION_SPEC.md 24.4).
 *
 * Shape: { id, image, alt, title, issuer, date, category }
 */
export const certificates = []
