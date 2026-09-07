import agroSenseImage from '../assets/images/home/selected_works/AgroSense.png'
import eotrnetImage from '../assets/images/home/selected_works/EOTRNet.png'

/**
 * Projects shown on Home -> Featured Works and the Game/AI Projects pages
 * (ANIMATION_SPEC.md 16-17, INTERACTION_SPEC.md 10, 12-15).
 *
 * Title/description/key-features/tags/status text is transcribed directly
 * from the approved Figma reference
 * (docs/figma-reference/home/Home_FeaturedWorks.png) per CLAUDE.md Section
 * 23 — not fabricated, including its minor wording/punctuation quirks.
 *
 * `githubUrl` / `liveUrl` are left `null`: no real destination is given
 * anywhere in the design or repo, and this task's Content Safety section /
 * INTERACTION_SPEC.md 7.3 forbid guessing one. FeaturedWorkCard renders
 * those buttons in a visually-faithful but disabled state until supplied.
 *
 * `status` drives the radar-pulse status indicator; use only the Figma-
 * defined status values (e.g. 'Completed', 'Work In Progress').
 * `category` drives which curtain destination ('game' | 'ai') a project
 * belongs to — inferred here from the visible AI/Computer-Vision subject
 * matter of both entries (not stated as a literal label in Figma).
 *
 * Shape: { id, title, description, keyFeatures, image, status, category, tags, githubUrl, liveUrl, featured }
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
    image: agroSenseImage,
    status: 'Completed',
    category: 'ai',
    tags: ['Python', 'Flask', 'React', 'Vite', 'Scikit-learn'],
    githubUrl: "https://github.com/utinn/AgroSense---AI-Assisted-Soil-Health-Support-for-Sustainable-Agriculture",
    liveUrl: "https://agrosense.my.id/",
    featured: true,
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
    image: eotrnetImage,
    status: 'Work In Progress',
    category: 'ai',
    tags: ['Python', 'YOLOv8n', 'ByteTrack', 'FastAPI', 'Streamlit'],
    githubUrl: "https://github.com/utinn/EOTRNet---Smart-Traffic-Security-and-Surveillance-System",
    liveUrl: null,
    featured: true,
  },
]

/**
 * Status -> dot/glow color used by the radar-pulse indicator
 * (ANIMATION_SPEC.md 16.1). Colors are a provisional visual approximation
 * of the Figma reference — verify against Figma MCP later.
 */
export const statusColors = {
  Completed: 'var(--color-status-completed)',
  'Work In Progress': 'var(--color-status-wip)',
}
