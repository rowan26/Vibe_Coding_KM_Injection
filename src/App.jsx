import { Routes, Route, NavLink, Navigate } from 'react-router-dom'
import Explore from './pages/Explore.jsx'
import Studio from './pages/Studio.jsx'
import Create from './pages/Create.jsx'
import Play from './pages/Play.jsx'
import Settings from './pages/Settings.jsx'
import AuthButton from './components/AuthButton.jsx'
import { AuthProvider } from './lib/auth.jsx'

export default function App() {
  return (
    <AuthProvider>
      <div className="app">
        <header className="topbar">
          <NavLink to="/" className="logo">
            <span className="logo-mark">🎮</span> Vibe Arcade
          </NavLink>
          <nav>
            <NavLink to="/" end>🌍 Monde</NavLink>
            <NavLink to="/studio">🧪 Studio</NavLink>
            <NavLink to="/creer" className="cta">✨ Créer</NavLink>
            <NavLink to="/reglages">⚙️</NavLink>
            <AuthButton />
          </nav>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<Explore />} />
            <Route path="/studio" element={<Studio />} />
            <Route path="/creer" element={<Create />} />
            <Route path="/creer/:id" element={<Create />} />
            <Route path="/jouer/:source/:id" element={<Play />} />
            <Route path="/reglages" element={<Settings />} />
            {/* Anciennes routes → redirigées vers les nouveaux environnements */}
            <Route path="/mes-jeux" element={<Navigate to="/studio" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <footer className="footer">
          Plateforme 100 % gratuite — tes jeux tournent dans le navigateur. Crée en privé dans ton Studio, partage-les au Monde quand tu veux.
        </footer>
      </div>
    </AuthProvider>
  )
}
