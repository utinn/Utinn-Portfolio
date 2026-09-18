import AboutMe from '../components/sections/AboutMe'
import FeaturedWorks from '../components/sections/FeaturedWorks'
import Hero from '../components/sections/Hero'
import HomeContact from '../components/sections/HomeContact'
import HomeExperience from '../components/sections/HomeExperience'
import HomeSkills from '../components/sections/HomeSkills'

/**
 * Home page (CLAUDE.md Section 9). Hero is visible immediately on load; the
 * sections below it reveal on scroll (ANIMATION_SPEC.md Section 14, 19;
 * INTERACTION_SPEC.md Section 8.3-8.4).
 *
 * Skills (owner instruction: the standalone Skills page is retired) sits
 * between Experience and Contact — Toolkits / Education / Language reused
 * from the former Skills page via HomeSkills.jsx, not rebuilt.
 */
export default function Home() {
  return (
    <>
      <Hero />
      <AboutMe />
      <FeaturedWorks />
      <HomeExperience />
      <HomeSkills />
      <HomeContact />
    </>
  )
}
