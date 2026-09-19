import { useScrollReveal } from '../../hooks/useScrollReveal'
import SectionHeader, { SECTION_CONTENT_DELAY_MS } from '../common/SectionHeader'
import PageContainer from '../layout/PageContainer'
import ContactCards from './ContactCards'

export default function HomeContact() {
  const { ref, isVisible } = useScrollReveal()

  return (
    <section ref={ref}>
      <PageContainer className="pt-20 pb-28 md:pt-32 md:pb-36 lg:pb-70">
        <SectionHeader
          title="Let's Build Something Together"
          revealed={isVisible}
          className="mx-auto max-w-2xl text-center"
        >
          Open to internships, collaborations, or just a good conversation about AI, computer vision, and tech. Feel
          free to reach out for me!
        </SectionHeader>

        <ContactCards revealed={isVisible} startDelayMs={SECTION_CONTENT_DELAY_MS} />
      </PageContainer>
    </section>
  )
}
