import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { listMyGames, deleteMyGame, downloadGame } from '../lib/storage.js'
import { publishGame, communityEnabled } from '../lib/community.js'
import { useAuth, displayName } from '../lib/auth.jsx'
import GameCard from '../components/GameCard.jsx'

export default function MyGames() {
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
      setError('Connectez-vous (bouton « Se connecter » en haut) pour publier vos jeux dans la galerie publique.')
      return
    }
    if (!confirm(`Publier « ${game.title} » dans la galerie publique, au nom de ${displayName(user)} ?`)) return
    try {
      await publishGame(game, user)
      setStatus(`« ${game.title} » est maintenant public dans la galerie ! 🎉`)
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <div>
      <h1>Mes jeux</h1>
      <p className="subtitle">
        Vos créations privées, stockées dans ce navigateur. Publiez-les quand vous êtes prêt.
      </p>
      {status && <div className="notice">{status}</div>}
      {error && <div className="error">{error}</div>}
      {games.length === 0 ? (
        <div className="empty">
          <p>Vous n'avez pas encore de jeu.</p>
          <Link className="btn primary" to="/creer">+ Créer mon premier jeu</Link>
        </div>
      ) : (
        <div className="grid">
          {games.map(g => (
            <GameCard key={g.id} game={g} source="local">
              <button onClick={() => navigate(`/creer/${g.id}`)}>✏️ Modifier</button>
              {communityEnabled() && <button onClick={() => publish(g)}>🌍 Publier</button>}
              <button onClick={() => downloadGame(g)}>⬇ .html</button>
              <button className="danger" onClick={() => remove(g)}>🗑</button>
            </GameCard>
          ))}
        </div>
      )}
    </div>
  )
}
