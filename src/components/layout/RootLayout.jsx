import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'

/** Shared shell rendered around every route. */
export default function RootLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  )
}
