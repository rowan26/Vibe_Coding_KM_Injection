import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { listMyGames, deleteMyGame, downloadGame } from '../lib/storage.js'
import { publishGame, communityEnabled } from '../lib/community.js'
import { useAuth, displayName } from '../lib/auth.jsx'
import GameCard from '../components/GameCard.jsx'

export default function Studio() {
  const [games, setGames] = useState(listMyGames)
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { user } = useAuth()

  const remove = (game) => {
    if (!confirm(`Supprimer « ${game.title} » ? Cette action est définitive.`)) return
    deleteMyGame(game.id)
    setGames(listMyGames())
  }

  const publish = async (game) => {
    setError(''); setStatus('')
    if (!user) {
      setError('Connecte-toi (bouton « Se connecter » en haut) pour partager tes jeux avec le Monde.')
      return
    }
    if (!confirm(`Partager « ${game.title} » avec le Monde, au nom de ${displayName(user)} ?`)) return
    try {
      await publishGame(game, user)
      setStatus(`« ${game.title} » est maintenant dans le Monde ! 🎉`)
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <div>
      <div className="env-head">
        <div className="env-title">
          <span className="dot perso" />
          <div>
            <h1 style={{ fontSize: '1.6rem' }}>Ton Studio</h1>
            <span className="hint">Ton environnement de développement personnel — privé, visible de toi seul.</span>
          </div>
        </div>
        <Link className="btn primary" to="/creer">✨ Nouveau jeu</Link>
      </div>

      {status && <div className="notice">{status}</div>}
      {error && <div className="error">{error}</div>}

      <div className="grid">
        <Link to="/creer" className="create-card">
          <span className="plus">✨</span>
          <strong>Créer un nouveau jeu</strong>
          <span className="hint">Décris-le, l'IA le code.</span>
        </Link>

        {games.map(g => (
          <GameCard key={g.id} game={g} source="local">
            <button onClick={() => navigate(`/creer/${g.id}`)} title="Modifier">✏️</button>
            {communityEnabled() && <button onClick={() => publish(g)} title="Partager avec le Monde">🌍</button>}
            <button onClick={() => downloadGame(g)} title="Télécharger en .html">⬇</button>
            <button className="danger" onClick={() => remove(g)} title="Supprimer">🗑</button>
          </GameCard>
        ))}
      </div>

      {games.length === 0 && (
        <p className="subtitle" style={{ marginTop: '1.2rem' }}>
          Ton Studio est vide pour l'instant. Lance-toi avec la carte ci-dessus ✨
        </p>
      )}
    </div>
  )
}
