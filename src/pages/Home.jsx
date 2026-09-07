import AboutMe from '../components/sections/AboutMe'
import FeaturedWorks from '../components/sections/FeaturedWorks'
import Hero from '../components/sections/Hero'
import HomeContact from '../components/sections/HomeContact'
import HomeExperience from '../components/sections/HomeExperience'

/**
 * Home page (CLAUDE.md Section 9). Hero is visible immediately on load; the
 * sections below it reveal on scroll (ANIMATION_SPEC.md Section 14, 19;
 * INTERACTION_SPEC.md Section 8.3-8.4).
 */
export default function Home() {
  return (
    <>
      <Hero />
      <AboutMe />
      <FeaturedWorks />
      <HomeExperience />
      <HomeContact />
    </>
  )
}
