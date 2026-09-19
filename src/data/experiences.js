import img1 from '../assets/images/home/featured_experiences/Exp1.jpg'
import img2 from '../assets/images/home/featured_experiences/Exp2.jpg'
import img3 from '../assets/images/home/featured_experiences/Exp3.jpg'

export const experiences = [
  {
    id: 'coordinator-educator-division',
    title: 'Coordinator of Educator Division',
    organization: 'HIMTI Binus University',
    date: 'July 2025 - October 2026',
    image: img1,
  },
  {
    id: 'scholarship-academic-mentor',
    title: 'Scholarship Academic Mentor',
    organization: 'Binus University',
    date: 'October 2025 - January 2026',
    image: img2,
  },
  {
    id: 'game-programmer',
    title: 'Game Programmer',
    organization: 'Binus Game Development Club',
    date: 'October 2025 - June 2026',
    image: img3,
  },
]

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
