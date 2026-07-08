import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { listCommunityGames, communityEnabled, unpublishGame } from '../lib/community.js'
import { useAuth } from '../lib/auth.jsx'
import GameCard from '../components/GameCard.jsx'

export default function Gallery() {
  const [games, setGames] = useState(null)
  const [error, setError] = useState('')
  const { user } = useAuth()

  const refresh = () => {
    listCommunityGames()
      .then(setGames)
      .catch(e => { setError(e.message); setGames([]) })
  }

  useEffect(refresh, [])

  const unpublish = async (game) => {
    if (!confirm(`Retirer « ${game.title} » de la galerie publique ?`)) return
    try {
      await unpublishGame(game.id)
      refresh()
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <div>
      <h1>Galerie publique</h1>
      <p className="subtitle">
        Des jeux gratuits créés par la communauté, jouables instantanément dans le navigateur.
      </p>
      {!communityEnabled() && (
        <div className="notice">
          La galerie communautaire partagée n'est pas encore branchée : voici les jeux d'exemple intégrés.
          Pour activer le partage entre utilisateurs, configurez Supabase (gratuit) — la marche à suivre
          est dans le README, ou en local via les <Link to="/reglages">Réglages</Link>.
        </div>
      )}
      {error && <div className="error">{error}</div>}
      {games === null && <p className="subtitle">Chargement…</p>}
      {games && (
        <div className="grid">
          {games.map(g => (
            <GameCard key={g.id} game={g} source="public">
              {user && g.user_id === user.id && (
                <button className="danger" onClick={() => unpublish(g)} title="Retirer de la galerie">🗑 Dépublier</button>
              )}
            </GameCard>
          ))}
        </div>
      )}
    </div>
  )
}
