import PageContainer from '../components/layout/PageContainer'

/**
 * Certificates page shell. Filter row (All/Courses/Programs/Competitions)
 * is an approved addition (owner clarification 4) built on top of the
 * data-driven grid (INTERACTION_SPEC.md Section 24) plus the certificate
 * preview overlay (Section 25).
 */
export default function Certificates() {
  return (
    <PageContainer>
      <h1 className="text-display font-sans">Certificates</h1>
    </PageContainer>
  )
}
