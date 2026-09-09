import img1 from '../assets/images/experiences/others/img1.jpg'
import img2 from '../assets/images/experiences/others/img2.jpg'
import img3 from '../assets/images/experiences/others/img3.jpg'
import img4 from '../assets/images/experiences/others/img4.jpg'
import img5 from '../assets/images/experiences/others/img5.jpg'
import img6 from '../assets/images/experiences/others/img6.jpg'
import img7 from '../assets/images/experiences/others/img7.png'

/**
 * "More Experiences" conveyor images on the dedicated Experiences Page
 * (ANIMATION_SPEC.md 20.13, INTERACTION_SPEC.md 21). Captions must come from
 * this data, never inferred from filenames at runtime (INTERACTION_SPEC.md 21.6).
 *
 * PLACEHOLDER CONTENT (owner instruction): seven items carrying the agreed
 * Title1/Org1/Date1/Capt1 … Title7/Org7/Date7/Capt7 stand-ins so layout, motion
 * and hover behaviour can be built and reviewed before the real entries exist.
 * The approved frame shows a title, a smaller "organization · date" metadata
 * line, the image, then a longer caption below it, so all four fields stay
 * here and only their values need replacing.
 *
 * To finish an item later: set `title`/`organization`/`date`/`caption` to the
 * real text, drop the photo in src/assets/images/experiences/ and import it as
 * `image`, then write a real `alt`. `image: null` renders the shared
 * ImagePlaceholder frame, so no unrelated stock photo ever stands in for a
 * real event (CLAUDE.md Section 23).
 *
 * Shape: { id, image, alt, title, organization, date, caption }
 */
// export const moreExperiencesConveyorItems = Array.from({ length: 7 }, (_, i) => ({
//   id: `more-experience-${i + 1}`,
//   image: null,
//   alt: '',
//   title: `Title${i + 1}`,
//   organization: `Org${i + 1}`,
//   date: `Date${i + 1}`,
//   caption: `Capt${i + 1}`,
// }))

export const moreExperiencesConveyorItems = [
  {
    id: 'more-experience-1',
    image: img1,
    alt: 'Group photo with the school principal and teachers',
    title: 'Project Leader',
    organization: 'Teach For Indonesia',
    date: 'June 2025',
    caption: 'Led a community project that taught elementary school students about environmental awareness through interactive activities.',
  },
  {
    id: 'more-experience-2',
    image: img2,
    alt: 'Group photo with the school teachers and students',
    title: 'Preschool Teacher',
    organization: 'Teach For Indonesia',
    date: 'April 2025 - May 2025',
    caption: 'Collaborated in a team to design and deliver an engaging learning program for kindergarten students.',
  },
  {
    id: 'more-experience-3',
    image: img3,
    alt: 'Promotion Teams photo',
    title: 'Promotions Team',
    organization: 'Binus University',
    date: 'July 2025',
    caption: 'Supported an interactive AI showcase by maintaining demonstration devices and AI-based minigames, helping the program engage more than 100 prospective students throughout the event.',
  },
  {
    id: 'more-experience-4',
    image: img4,
    alt: 'Group photo of mentors and future activists',
    title: 'Mentor of SESVENT 2024',
    organization: 'HIMTI Binus University',
    date: 'October 2025',
    caption: 'Guided future HIMTI activists through a seven-day selection program by providing resources, tracking progress, and supporting their preparation for key organizational requirements and evaluations.',
  },
  {
    id: 'more-experience-5',
    image: img5,
    alt: 'HILET26 Zoom documentation',
    title: 'Mentor of HILET 2026',
    organization: 'HIMTI Binus University',
    date: 'Descember 2025',
    caption: 'Mentored and supervised a simulated committee division by structuring responsibilities, assigning roles based on members’ strengths, and guiding the team toward completing all deliverables for the final presentation.',
  },
  {
    id: 'more-experience-6',
    image: img6,
    alt: 'Teaching an Algorithm and Programming midterm exam preparation',
    title: 'HIMTI Responsi Activist',
    organization: 'HIMTI Responsi Activist',
    date: 'March 2024 - January 2026',
    caption: 'Contributed to academic support programs by developing and delivering learning resources for Computer Science students, mostly on teaching/mentoring',
  },
  {
    id: 'more-experience-7',
    image: img7,
    alt: 'Group photo with the facilitators and freshmen',
    title: 'Student Led Learning Facilitator',
    organization: 'Binus University',
    date: 'March 2026 - June 2026',
    caption: 'Designed and delivered a multi-track Data Structures curriculum for participants from different academic backgrounds, then supported them in applying their knowledge through a five-session community program reaching 100+ students.',
  }
]