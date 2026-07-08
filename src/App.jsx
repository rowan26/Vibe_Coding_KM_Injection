import { Routes, Route, NavLink } from 'react-router-dom'
import Gallery from './pages/Gallery.jsx'
import MyGames from './pages/MyGames.jsx'
import Create from './pages/Create.jsx'
import Play from './pages/Play.jsx'
import Settings from './pages/Settings.jsx'

export default function App() {
  return (
    <div className="app">
      <header className="topbar">
        <NavLink to="/" className="logo">🕹️ Vibe Arcade</NavLink>
        <nav>
          <NavLink to="/" end>Galerie</NavLink>
          <NavLink to="/mes-jeux">Mes jeux</NavLink>
          <NavLink to="/creer" className="cta">+ Créer un jeu</NavLink>
          <NavLink to="/reglages">⚙️ Réglages</NavLink>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Gallery />} />
          <Route path="/mes-jeux" element={<MyGames />} />
          <Route path="/creer" element={<Create />} />
          <Route path="/creer/:id" element={<Create />} />
          <Route path="/jouer/:source/:id" element={<Play />} />
          <Route path="/reglages" element={<Settings />} />
        </Routes>
      </main>
      <footer className="footer">
        Plateforme 100 % gratuite — les jeux tournent dans votre navigateur, comme les jeux Flash d'antan.
      </footer>
    </div>
  )
}
