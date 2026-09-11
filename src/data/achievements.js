/**
 * Achievements Page carousel content (ANIMATION_SPEC.md 21,
 * INTERACTION_SPEC.md 22).
 *
 * Shape: { id, title, issuer, date, description, image, alt }
 *
 * `image` is the achievement's certificate/award artwork. Drop the real file
 * into `src/assets/images/achievements/` using the CLAUDE.md Section 11
 * naming convention (e.g. `Achievement_Fortex6.png`), import it here, and
 * assign it — nothing else has to change. Until then `image: null` renders the
 * shared ImagePlaceholder at the exact same container size, so swapping the
 * real asset in never shifts the layout.
 *
 * CONTENT STATUS
 * - Item 1 is transcribed verbatim from the approved Figma frame
 *   (docs/figma-reference/achievements/AchivementsPage.png).
 * - Items 2-5 are PLACEHOLDERS. The Figma frame shows two further
 *   achievements, but both are clipped by the frame edge and only partially
 *   legible, so their copy is deliberately NOT reconstructed here
 *   (CLAUDE.md Section 23 — never fabricate credentials). Replace the title /
 *   issuer / date / description strings below with the real content.
 */

import img1 from '../assets/images/achievements/img1.png'
import img2 from '../assets/images/achievements/img2.png'
import img3 from '../assets/images/achievements/img3.png'

const placeholder = (id) => ({
  id,
  title: `Achievement Title ${id}`,
  issuer: 'Issuing Organization',
  date: 'Month Year',
  description: 'Placeholder — replace with the achievement summary in src/data/achievements.js.',
  image: null,
  alt: '',
})

export const achievements = [
  {
    id: 1,
    title: 'Top 10 Finalist - Fortex 6.0',
    issuer: 'Al Azhar Indonesia University',
    date: 'January 2026',
    description:
      'Developed an ensemble learning model combining XGBoost, Random Forest, and MLP to classify soil pH categories, achieving a Macro F1-Score of 89%.',
    image: img1,
    alt: 'Finalist certificate',
  },
  {
    id: 2,
    title: 'Finalist - Srifoton 2025 [Machine Learning Competition]',
    issuer: 'Himpunan Mahasiswa Informatika (Sriwijaya University)',
    date: 'Oct 2025',
    description:
      'Developed a deep learning model (ConvNeXt) that classifies respiratory disease from chest X-rays and achieved a Macro F1-Score of 97–98%.',
    image: img2,
    alt: 'Finalist certificate',
  },
  {
    id: 3,
    title: 'Dean\'s List 2025 -  School of Computer Science',
    issuer: 'Bina Nusantara University',
    date: 'March 2026',
    description:
      'Recognized for outstanding academic performance in the Artificial Intelligence program.',
    image: img3,
    alt: 'Dean\'s List certificate',
  }
]
