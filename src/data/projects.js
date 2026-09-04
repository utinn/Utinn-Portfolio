/**
 * Projects shown on Home -> Featured Works and the Game/AI Projects pages
 * (ANIMATION_SPEC.md 16-17, INTERACTION_SPEC.md 10, 12-15).
 *
 * `status` drives the radar-pulse status indicator; use only the Figma-
 * defined status values (e.g. 'Completed', 'Work In Progress').
 * `category` drives which curtain destination ('games' | 'ai') a project
 * belongs to.
 *
 * Shape: { id, title, description, image, status, category, tags, githubUrl, liveUrl, featured }
 */
export const projects = []
