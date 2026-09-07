import img1 from '../assets/images/home/featured_experiences/Exp1.jpg'
import img2 from '../assets/images/home/featured_experiences/Exp2.jpg'
import img3 from '../assets/images/home/featured_experiences/Exp3.jpg'

/**
 * Experience entries shared by the Home timeline (ANIMATION_SPEC.md 19) and
 * the dedicated Experiences Page groups (ANIMATION_SPEC.md 20).
 *
 * Order matches Figma's left-to-right spatial order: Coordinator of Educator
 * Division -> Scholarship Academic Mentor -> Game Programmer — do not
 * reorder by assumed chronology (ANIMATION_SPEC.md 19.4, which names this
 * exact experience as its ordering example). Title/organization/date text
 * is transcribed directly from the approved Figma reference
 * (docs/figma-reference/home/Home_Experience.png).
 *
 * `image` is left `null` for all three — no local photo asset has been
 * supplied yet. The Home timeline renders a placeholder frame until real
 * photos are added; do not substitute the docs/figma-reference PNG or an
 * unrelated stock photo for a specific real event (CLAUDE.md Section 23).
 *
 * `images` (dedicated Experiences Page supporting-image rotation,
 * ANIMATION_SPEC.md 20.12) and `tags`/`description` (dedicated page detail
 * content) are intentionally left unset — out of scope for this Home-page
 * pass (see CLAUDE.md Section 2 scope control).
 *
 * Shape: { id, title, organization, date, image, images, tags, description }
 */
export const experiences = [
  {
    id: 'coordinator-educator-division',
    title: 'Coordinator of Educator Division',
    organization: 'HIMTI Binus University',
    date: 'July 2025 - October 2026',
    // TODO(owner): add src/assets/images/Experience_CoordinatorEducatorDivision.png
    image: img1,
  },
  {
    id: 'scholarship-academic-mentor',
    title: 'Scholarship Academic Mentor',
    organization: 'Binus University',
    date: 'October 2025 - January 2026',
    // TODO(owner): add src/assets/images/Experience_ScholarshipAcademicMentor.png
    image: img2,
  },
  {
    id: 'game-programmer',
    title: 'Game Programmer',
    organization: 'Binus Game Development Club',
    date: 'October 2025 - June 2026',
    // TODO(owner): add src/assets/images/Experience_GameProgrammer.png
    image: img3,
  },
]
