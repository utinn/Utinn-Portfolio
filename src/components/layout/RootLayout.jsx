import { Outlet } from 'react-router-dom'
import BackgroundParticles from '../common/BackgroundParticles'
import TeleportProvider from '../common/TeleportProvider'
import Navbar from './Navbar'

/**
 * Shared shell rendered around every route.
 *
 * TeleportProvider wraps the outlet because the Projects teleport transition
 * has to survive its own route change — the wash must still cover the screen
 * while the destination mounts. It renders nothing at all when idle, so no
 * other page is affected.
 */
export default function RootLayout() {
  return (
    <div className="relative min-h-screen overflow-x-clip bg-background text-foreground">
      <BackgroundParticles />
      <Navbar />
      <TeleportProvider>
        <main className="relative">
          <Outlet />
        </main>
      </TeleportProvider>
    </div>
  )
}
