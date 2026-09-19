import AboutMe from '../components/sections/AboutMe'
import FeaturedWorks from '../components/sections/FeaturedWorks'
import Hero from '../components/sections/Hero'
import HomeContact from '../components/sections/HomeContact'
import HomeExperience from '../components/sections/HomeExperience'
import HomeSkills from '../components/sections/HomeSkills'

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
