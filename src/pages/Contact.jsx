import SectionHeader, { SECTION_CONTENT_DELAY_MS } from '../components/common/SectionHeader'
import ContactCards from '../components/sections/ContactCards'
import PageContainer from '../components/layout/PageContainer'
import { useScrollReveal } from '../hooks/useScrollReveal'

export default function Contact() {
  const { ref, isVisible } = useScrollReveal()

  return (
    <PageContainer className="pb-28 pt-24 md:pb-36">
      <header ref={ref}>
        <SectionHeader as="h1" title="Contact" revealed={isVisible} className="mx-auto max-w-2xl text-center">
          Open to internships, collaborations, or just a good conversation about AI, computer vision, and tech. Feel
          free to reach out for me!
        </SectionHeader>
      </header>

      <ContactCards revealed={isVisible} startDelayMs={SECTION_CONTENT_DELAY_MS} />
    </PageContainer>
  )
}
