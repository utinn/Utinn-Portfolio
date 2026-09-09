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

/**
 * Dedicated Experiences Page timeline — a SEPARATE set from `experiences`
 * above, not a superset of it. The two Figma frames disagree on both
 * membership and wording: Home shows three entries left-to-right, this page
 * shows five top-to-bottom, and two of the shared entries are titled
 * differently here ("Talent Group Participant - Programmer" vs Home's "Game
 * Programmer", "(PKM)" suffixed on the Coordinator entry). Merging them would
 * force one frame to render the other's text, so each frame keeps its own
 * transcription and they share only the photo assets.
 *
 * Every title, organization, date, tag and key point is transcribed verbatim
 * from docs/figma-reference/experiences/ExperiencesPage.png (CLAUDE.md
 * Section 23 — nothing here is authored or summarised). Top-to-bottom order
 * matches that frame exactly; do not re-sort by chronology.
 *
 * `images` is the supporting-image rotation set (ANIMATION_SPEC.md 20.12,
 * INTERACTION_SPEC.md 19): the frame beside the key points cycles through it
 * every 2s while the entry is open. Only the three experiences that already
 * have a local photo carry one, so those rotate through a single frame (i.e.
 * hold still) until more are supplied; the two without any asset render the
 * shared placeholder rather than borrowing an unrelated photo.
 *
 * Shape: { id, title, organization, date, tags, keyPoints, images }
 */


import manager1 from '../assets/images/experiences/manager_responsi/img1.jpeg'

import fl1 from '../assets/images/experiences/freshmen_leader/img1.jpeg' 
import fl2 from '../assets/images/experiences/freshmen_leader/img2.jpeg' 
import fl3 from '../assets/images/experiences/freshmen_leader/img3.jpeg' 

import tg1 from '../assets/images/experiences/talent_group/img1.jpeg' 
import tg2 from '../assets/images/experiences/talent_group/img2.png' 

import mentor1 from '../assets/images/experiences/mentor/img1.jpg' 
import mentor2 from '../assets/images/experiences/mentor/img2.jpg' 
import mentor3 from '../assets/images/experiences/mentor/img3.jpg' 

import ce1 from '../assets/images/experiences/coordinator_educator/img1.jpg' 
import ce2 from '../assets/images/experiences/coordinator_educator/img2.jpg' 

export const experienceTimeline = [
  {
    id: 'manager-of-responsi',
    title: 'Manager of Responsi',
    organization: 'HIMTI Binus University',
    date: 'February 2026 - Present',
    tags: ['Leadership', 'Communication', 'Collaboration', 'Management'],
    keyPoints: [
      'Managed a 50+ member Responsi Division by coordinating role allocation and class planning during pre-program followed by monitoring team performance and providing solution-oriented guidance during the program’s active period.',
      'Redesigned the master sheet system into a more structured and organized workspace, improving visibility across initiated programs, clarity of task ownership, and resource access simplicity, reducing overall complexity.',
      'Conducted regular evaluation and quality improvement to enhance program effectiveness, program quality, and students engagement in the future.',
    ],
    // TODO(owner): add photos for this experience, then list them here.
    images: [manager1],
  },
  {
    id: 'freshmen-leader-b30',
    title: 'Freshmen Leader B30',
    organization: 'Binus University',
    date: 'August 2026',
    tags: ['Leadership', 'Mentoring', 'Facilitating', 'Collaboration'],
    keyPoints: [
      'Collaborated with fellow Freshmen Leaders to coordinate activities, student mobilization, and session execution, maintaining clear communication, participation, and program flow across different orientation activities.',
      'Guided freshmen through their orientation program by providing updated information and assignment reminders as well as helping them adapt to university life by sharing academic insights and personal experiences.',
      'Facilitated an engaging and supportive freshmen experience through active discussions, bonding, interactive games, developing a comfortable environment where they could connect with friends and Freshmen Leaders',
    ],
    // TODO(owner): add photos for this experience, then list them here.
    images: [fl1, fl2, fl3],
  },
  {
    id: 'talent-group-participant-programmer',
    title: 'Talent Group Participant - Programmer',
    organization: 'Binus Game Development Club',
    date: 'October 2025 - June 2026',
    tags: ['Game Programming', 'Collaboration', 'Communication', 'Adaptability'],
    keyPoints: [
      'Collaborated in a team of programmers, artists, game designers, and a sound engineer from initial concept to a playable project, setting a clear direction for gameplay mechanics, progression, art, and overall player experience.',
      'Developed multiple core gameplay systems in Godot Engine, including core mechanics, adaptive difficulty, scoring system, sidekick functionality, and game tutorial, turning initialized concepts into functional in-game systems.',
      'Maintained consistent and aligned development progress through rapid adaptation to Godot and weekly progress reporting, priorities review, and coordination with the team over several months of development',
    ],
    images: [tg1, tg2],
  },
  {
    id: 'scholarship-academic-mentor',
    title: 'Scholarship Academic Mentor',
    organization: 'Binus University',
    date: 'October 2025 - January 2026',
    tags: ['Mentoring', 'Communication', 'Adaptability', 'Academic Coaching'],
    keyPoints: [
      'Managed and mentored 10 students by providing structured academic support with multiple students reported significant academic boost throughout the semester, including grade increase and passed exams.',
      'Delivered 10+ structured 100-minute mentoring sessions, mostly focused on midterm and final exam preparation alongside concept reinforcement and quiz preparation, maximizing overall academic improvement.',
      'Maintained a supportive and adaptive mentoring environment, ensuring consistent student engagement and excellent learning experience throughout the semester.',
    ],
    images: [mentor1, mentor2, mentor3],
  },
  {
    id: 'coordinator-educator-division-pkm',
    title: 'Coordinator of Educator Division (PKM)',
    organization: 'HIMTI Binus University',
    date: 'July 2025 - October 2025',
    tags: ['Leadership', 'Mentoring', 'Communication', 'Coordination'],
    keyPoints: [
      'Coordinated session schedules and learning materials (C programming) for Tarsisius II students, ensuring sessions were well-prepared and delivered smoothly.',
      'Acted as a bridge between educators and supporting divisions to facilitate cross-division communication, ensuring clear information flow and smooth program execution',
      'Supported and supervised the educator division to maintain effective teamwork and ensure teaching quality so that students understand the materials while also engaged during the sessions.',
    ],
    images: [ce1, ce2],
  },
]
