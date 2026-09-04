import { Link } from 'react-router-dom'
import PageContainer from '../components/layout/PageContainer'

/** Fallback for unmatched routes. */
export default function NotFound() {
  return (
    <PageContainer>
      <h1 className="text-h1 font-sans">Page not found</h1>
      <Link to="/">Return home</Link>
    </PageContainer>
  )
}
