import { Route, Routes } from 'react-router-dom'
import RootLayout from './components/layout/RootLayout'
import Home from './pages/Home'
import Projects from './pages/Projects'
import GameProjects from './pages/GameProjects'
import AIProjects from './pages/AIProjects'
import Experiences from './pages/Experiences'
import Achievements from './pages/Achievements'
import Certificates from './pages/Certificates'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'

function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/game" element={<GameProjects />} />
        <Route path="/projects/ai" element={<AIProjects />} />
        <Route path="/experiences" element={<Experiences />} />
        <Route path="/achievements" element={<Achievements />} />
        <Route path="/certificates" element={<Certificates />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default App
