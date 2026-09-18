import { Outlet } from 'react-router-dom'
import BackgroundParticles from '../common/BackgroundParticles'
import PageWarpProvider from '../common/PageWarpProvider'
import ScrollToTop from '../common/ScrollToTop'
import TeleportProvider from '../common/TeleportProvider'
import WarpStage from '../common/WarpStage'
import Navbar from './Navbar'

/**
 * Shared shell rendered around every route.
 *
 * PageWarpProvider (global page time-warp, owner spec) wraps everything: it
 * intercepts primary-page link clicks anywhere in the shell, drives the
 * route swap itself under full cover, and renders the warp canvas at the
 * viewport level. WarpStage wraps only <main>, so the engage/arrival motion
 * applies to page content while the Navbar stays put beneath the canvas.
 *
 * TeleportProvider wraps the outlet because the Projects teleport transition
 * has to survive its own route change — the wash must still cover the screen
 * while the destination mounts. It renders nothing at all when idle, so no
 * other page is affected. The warp never runs for Projects-internal hops
 * (see PageWarpProvider), so the two systems never stack.
 *
 * ScrollToTop is the single global reset for every route change (owner
 * instruction). Both transition systems call navigate() while the screen is
 * covered, and its layout effect runs in that same commit — the destination
 * is at the top before it is ever visible.
 */
export default function RootLayout() {
  return (
    <PageWarpProvider>
      <div className="relative min-h-screen overflow-x-clip bg-background text-foreground">
        <ScrollToTop />
        <BackgroundParticles />
        <Navbar />
        <TeleportProvider>
          <WarpStage>
            <main className="relative">
              <Outlet />
            </main>
          </WarpStage>
        </TeleportProvider>
      </div>
    </PageWarpProvider>
  )
}
