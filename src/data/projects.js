import Agro1 from '../assets/images/projects/ai/AgroSense1.png'
import Agro2 from '../assets/images/projects/ai/AgroSense2.png'
import EOTR1 from '../assets/images/projects/ai/EOTRNet1.png'
import EOTR2 from '../assets/images/projects/ai/EOTRNet2.png'
import Tom1 from '../assets/images/projects/game/Tom1.png'
import Tom2 from '../assets/images/projects/game/Tom2.png'

/**
 * THE project source of truth, shared by Home -> Featured Works, the AI
 * Projects page and the Game Projects page (ANIMATION_SPEC.md 16-17,
 * INTERACTION_SPEC.md 10, 12-15). A project appears in several places, so it
 * is described exactly once here — never re-typed per route.
 *
 * Title/description/key-features/tags/status text is transcribed directly
 * from the approved Figma references per CLAUDE.md Section 23 — not
 * fabricated, including their minor wording/punctuation quirks:
 *   - AgroSense / EOTRNet: docs/figma-reference/home/Home_FeaturedWorks.png
 *   - the four related AI projects: docs/figma-reference/projects/AiProjectsPage.png
 *   - TOM: supplied verbatim by the project owner
 * Where the Home and AI-page frames word the same field slightly
 * differently, the already-approved Home wording is kept (owner instruction:
 * preserve existing approved descriptions / Key Features).
 *
 * `githubUrl` / `liveUrl` are `null` wherever no real destination has been
 * supplied anywhere in the design or repo; INTERACTION_SPEC.md 7.3 forbids
 * guessing one. The cards render those buttons in a visually-faithful but
 * disabled state until they are filled in.
 *
 * `images` is ordered exactly as the dedicated category page stacks them —
 * the two screenshots already in the repo are the second view of their
 * project (AgroSense batch mode, EOTRNet tracking logs), so they sit in the
 * lower slot and the upper one is still awaiting its file. An entry whose
 * `src` is null keeps its container (and therefore the page layout) intact
 * and renders ImagePlaceholder until the file named by `requiredPath` is
 * added — see CLAUDE.md Section 11. Home shows the first entry that actually
 * has an image, so this ordering never leaves Home with a placeholder.
 *
 * Flags:
 *   `featured`   -> gets the large, detailed card on its own category page.
 *   `showOnHome` -> part of the curated Home "Selected Work" pair. Home's
 *                   set is an approved editorial choice from its own Figma
 *                   frame, not something derivable from category/featured,
 *                   so it is stated rather than inferred.
 *   `category`   -> which curtain destination ('game' | 'ai') the project
 *                   belongs to.
 */
export const projects = [
  {
    id: 'agrosense',
    title: 'AgroSense : AI-Assisted Soil Health Support for Sustainable Agriculture',
    description:
      'An AI-based soil pH classification system using ensemble learning (Random Forest, XGBoost, Multi-Layered Perceptrons) that provides fast and interpretable predictions.',
    keyFeatures: [
      'Fast and accurate Ai-based soil pH class prediction along with the confidence percentage (shown numerically).',
      'Each predicted classes are complemented with interpretations to help user understand the cause and effect of the results',
      'Includes contextual tooltips, providing useful information regarding each measurements such as ranges and units',
    ],
    images: [
      {
        src: Agro1,
        alt: 'AgroSense single-sample soil analysis screen',
      },
      { 
        src: Agro2, 
        alt: 'AgroSense batch mode classification results' 
      },
    ],
    status: 'Completed',
    category: 'ai',
    tags: ['Python', 'Flask', 'React', 'Vite', 'Scikit-learn'],
    githubUrl: 'https://github.com/utinn/AgroSense---AI-Assisted-Soil-Health-Support-for-Sustainable-Agriculture',
    liveUrl: 'https://agrosense.my.id/',
    featured: true,
    showOnHome: true,
  },
  {
    id: 'eotrnet',
    title: 'EOTRNet : Smart Traffic Security for Wrong-Way Driving Detection',
    description:
      'An AI-based traffic security using Computer Vision (YOLOv8n and ByteTrack) that detects and tracks vehicles to identify wrong-way driving and save the records for further monitoring and analysis.',
    keyFeatures: [
      'Detects multiple vehicle types and tracks their movement across surveillance footage.',
      'Identifies whether the tracked vehicles correctly follow or violates the specified traffic direction.',
      'Stores tracking results and feeds for future monitoring and analysis purpose.',
    ],
    images: [
      {
        src: EOTR1,
        alt: 'EOTRNet live traffic monitoring screen',
      },
      { 
        src: EOTR2, 
        alt: 'EOTRNet tracking logs and evidence playback screen'
      },
    ],
    status: 'Work In Progress',
    category: 'ai',
    /* SQLite is present in the AI Projects frame's tag row (and confirmed by
       the owner) but absent from the older Home frame; the union is the
       project's actual stack, so it is kept here once for both. */
    tags: ['Python', 'YOLOv8n', 'ByteTrack', 'SQLite', 'FastAPI', 'Streamlit'],
    githubUrl: 'https://github.com/utinn/EOTRNet---Smart-Traffic-Security-and-Surveillance-System',
    liveUrl: null,
    featured: true,
    showOnHome: true,
  },
  {
    id: 'luminalung',
    title: 'LuminaLung : AI-Powered Respiratory Disease Classifier',
    description:
      'An AI-based system using Computer Vision (ConvNeXt) for classifying respiratory diseases from chest X-ray images complemented with GradCam for explainability',
    keyFeatures: [],
    images: [],
    status: 'Completed',
    category: 'ai',
    tags: ['Python', 'GradCam', 'ConvNeXt'],
    githubUrl: 'https://github.com/utinn/LuminaLung---AI-Powered-Respiratory-Disease-Classifier',
    liveUrl: null,
    featured: false,
    showOnHome: false,
  },
  {
    id: 'monogrip',
    title: 'MonoGrip : Gesture Based Game Controller System',
    description:
      'A smart real-time gesture based game controller using YOLOv8n that translates hand gestures into keyboard inputs, allowing certain games to be played without conventional controllers.',
    keyFeatures: [],
    images: [],
    status: 'Completed',
    category: 'ai',
    tags: ['Python', 'YOLOv8n', 'PyAutoGUI'],
    githubUrl: 'https://github.com/utinn/MonoGrip---Gesture-Based-Game-Controller',
    liveUrl: null,
    featured: false,
    showOnHome: false,
  },
  {
    id: 'smart-waste-classifier',
    title: 'Smart Waste Classifier',
    description:
      'An AI-based waste classification system using Computer Vision (ConvNeXt) to identify different waste categories deployed with docker to ensure reproducibility.',
    keyFeatures: [],
    images: [],
    status: 'Completed',
    category: 'ai',
    tags: ['Python', 'Docker', 'ConvNeXt'],
    githubUrl: 'https://github.com/utinn/Smart-Waste-Classifier',
    liveUrl: null,
    featured: false,
    showOnHome: false,
  },
  {
    id: 'indonesia-pothole-detector',
    title: 'Indonesia Pothole Detector',
    description:
      'A smart image segmentation system designed to generate pixel-level masks for road potholes, with potential applications in automated road inspection and maintenance.',
    keyFeatures: [],
    images: [],
    status: 'Work In Progress',
    category: 'ai',
    tags: ['Python', 'U-Net'],
    githubUrl: null,
    liveUrl: null,
    featured: false,
    showOnHome: false,
  },
  {
    id: 'tom',
    title: 'TOM',
    description:
      'An endless corporate-themed game where players are required to complete workplace tasks that gets harder the higher the points.',
    keyFeatures: [
      'Different tasks have a unique mechanics and mini gameplay, reducing boredom from repetitive feeling.',
      'Power-ups are available in the game that benefits players on surviving longer and earning high points.',
      'Difficulty ramps up as players earn more points, increasing challenge in the game and prevent boredom.',
    ],
    images: [
      {
        src: Tom1,
        alt: 'TOM office floor gameplay screen',
      },
      {
        src: Tom2,
        alt: 'TOM computer workplace task screen',
      },
    ],
    status: 'Completed',
    category: 'game',
    tags: ['Godot', 'GDScript', 'Git'],
    githubUrl: 'https://github.com/Vumiho/TomDev',
    liveUrl: 'https://bgdc.itch.io/t-o-m',
    featured: true,
    showOnHome: false,
  },
]

/** The curated Home -> Featured Works pair (see `showOnHome` above). */
export const homeProjects = projects.filter((project) => project.showOnHome)

/** Large detailed cards on a category page, in design order. */
export const featuredProjectsIn = (category) =>
  projects.filter((project) => project.category === category && project.featured)

/** "Other Related Projects" — the compact cards on a category page. */
export const otherProjectsIn = (category) =>
  projects.filter((project) => project.category === category && !project.featured)

/**
 * Status -> dot/glow color used by the radar-pulse indicator
 * (ANIMATION_SPEC.md 16.1). Colors are a provisional visual approximation
 * of the Figma reference — verify against Figma MCP later.
 */
export const statusColors = {
  Completed: 'var(--color-status-completed)',
  'Work In Progress': 'var(--color-status-wip)',
}
