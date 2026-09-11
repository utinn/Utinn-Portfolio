/**
 * Skills and Credentials Page content (CLAUDE.md Section 9).
 *
 * Every string is transcribed verbatim from the approved Figma reference
 * (docs/figma-reference/skills/SkillsPage.png) and the spatial order of both
 * the toolkit groups and the tags inside them is Figma's own left-to-right /
 * top-to-bottom order — the reveal animation derives its sequence from these
 * arrays, so reordering them reorders the animation (ANIMATION_SPEC.md 22.1,
 * which forbids re-sorting tags by "importance").
 *
 * `toolkitGroups` is a flat list read two-per-row by the 2-column grid, so a
 * ninth group extends the sequence without any retiming.
 */
export const toolkitGroups = [
  { id: 'programming', title: 'Programming', tags: ['Python', 'C', 'C#', 'SQL'] },
  {
    id: 'ai-machine-learning',
    title: 'AI/Machine Learning',
    tags: ['Scikit-learn', 'PyTorch', 'XGBoost', 'Ensemble Learning'],
  },
  {
    id: 'computer-vision',
    title: 'Computer Vision',
    tags: ['ConvNeXt', 'YOLOv8n', 'ByteTrack', 'OpenCV', 'Ultralytics'],
  },
  { id: 'backend', title: 'Backend', tags: ['FastAPI', 'REST API', 'SQLite', 'Docker'] },
  { id: 'frontend', title: 'Frontend', tags: ['HTML', 'CSS', 'JavaScript', 'React', 'Vite'] },
  { id: 'game-development', title: 'Game Development', tags: ['Godot', 'GDScript'] },
  { id: 'tools', title: 'Tools', tags: ['GitHub', 'Git', 'Jupyter', 'VS Code', 'Google Colab'] },
  {
    id: 'softskills',
    title: 'Softskills',
    tags: ['Leadership', 'Mentoring', 'Collaboration', 'Communication'],
  },
]

/**
 * Education checkpoints in Figma's left-to-right order (ANIMATION_SPEC.md
 * 22.2 names this exact order as the reveal order). `detail` is the small
 * information panel drawn under the rail.
 */
export const educationMilestones = [
  {
    id: 'sma-vianney',
    institution: 'SMA Vianney',
    date: 'July 2021 - May 2024',
    detail: 'Final Score : 88%-89%',
  },
  {
    id: 'binus-university',
    institution: 'Binus University',
    date: 'July 2024 - July 2028',
    detail: 'GPA : 3.93',
  },
  {
    id: 'industry-corporate',
    institution: 'Industry/Corporate',
    date: 'July 2028 - N/A',
    detail: 'Not Reached',
  },
]

/**
 * Languages in Figma's left-to-right order.
 *
 * NOTE(owner): Figma renders English's proficiency as "Profesional Working
 * Proficiency"; the spelling below follows the owner's written instruction
 * for this page instead. Change this string, not the component, if the Figma
 * spelling is the intended one.
 */
export const languages = [
  { id: 'indonesian', name: 'Indonesian', proficiency: 'Native' },
  { id: 'english', name: 'English', proficiency: 'Professional Working Proficiency' },
  { id: 'chinese', name: 'Chinese', proficiency: 'Elementary Proficiency' },
]
