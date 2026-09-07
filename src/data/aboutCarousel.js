/**
 * About Me image carousel (ANIMATION_SPEC.md 15.1, INTERACTION_SPEC.md 9).
 * Manual-only, 5 images. Data-driven so content can change without touching
 * the carousel component.
 *
 * Edit the `title` and `caption` values below to update carousel copy.
 * Current values are temporary placeholders provided by the project owner.
 *
 * Shape: { id, image, alt, title, caption }
 */
import img1 from '../assets/images/home/about_me/img1.png'
import img2 from '../assets/images/home/about_me/img2.jpeg'
import img3 from '../assets/images/home/about_me/img3.jpg'
import img4 from '../assets/images/home/about_me/img4.png'
import img5 from '../assets/images/home/about_me/img5.jpg'

export const aboutCarouselItems = [
  { id: 1, image: img1, alt: '', title: 'Turning Ideas into Reality', caption: 'Enjoy taking ideas into experimentation, iteration, and development until they become something that people can use' },
  { id: 2, image: img2, alt: '', title: 'Learning to Lead', caption: 'Learn to take responsibility, support others, and keep a team moving forward together' },
  { id: 3, image: img3, alt: '', title: 'Sharing through Mentoring', caption: 'Taught me not only in teaching, but also in communication, patience, and understanding different perspectives.' },
  { id: 4, image: img4, alt: '', title: 'Growing Under Pressure', caption: 'Working through troubles and deadlines taught me how to adapt, prioritize, manage and keep up with the pace under pressure.' },
  { id: 5, image: img5, alt: '', title: 'Staying Curious and Always Learn', caption: 'Exploring different roles and experiences as well as learning continuously helped me grow and adapt in the future' },
]
