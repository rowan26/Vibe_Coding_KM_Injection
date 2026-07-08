import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { listCommunityGames, communityEnabled } from '../lib/community.js'
import GameCard from '../components/GameCard.jsx'

export default function Gallery() {
  const [games, setGames] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    listCommunityGames()
      .then(setGames)
      .catch(e => { setError(e.message); setGames([]) })
  }, [])

  return (
    <div>
      <h1>Galerie publique</h1>
      <p className="subtitle">
        Des jeux gratuits créés par la communauté, jouables instantanément dans le navigateur.
      </p>
      {!communityEnabled() && (
        <div className="notice">
          La galerie communautaire partagée n'est pas encore branchée : voici les jeux d'exemple intégrés.
          Pour activer le partage entre utilisateurs, configurez Supabase (gratuit) dans les{' '}
          <Link to="/reglages">Réglages</Link> — la marche à suivre est dans le README.
        </div>
      )}
      {error && <div className="error">{error}</div>}
      {games === null && <p className="subtitle">Chargement…</p>}
      {games && (
        <div className="grid">
          {games.map(g => <GameCard key={g.id} game={g} source="public" />)}
        </div>
      )}
    </div>
  )
}
