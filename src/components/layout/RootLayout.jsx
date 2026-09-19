import { Outlet } from 'react-router-dom'
import BackgroundParticles from '../common/BackgroundParticles'
import PageWarpProvider from '../common/PageWarpProvider'
import ScrollToTop from '../common/ScrollToTop'
import TeleportProvider from '../common/TeleportProvider'
import WarpStage from '../common/WarpStage'
import Navbar from './Navbar'

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
