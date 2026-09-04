import PageContainer from '../components/layout/PageContainer'

/**
 * Dedicated Experiences page shell. Uses ONE-OPEN-AT-A-TIME accordion
 * groups (owner clarification 3; resolves INTERACTION_SPEC.md 17.5 TBD).
 * Group expand/collapse state + reveal sequencing implemented once the
 * Figma frame is inspected.
 */
export default function Experiences() {
  return (
    <PageContainer>
      <h1 className="text-display font-sans">Experiences</h1>
    </PageContainer>
  )
}
