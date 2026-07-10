import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getMyGame } from '../lib/storage.js'
import { getCommunityGame } from '../lib/community.js'
import GameFrame from '../components/GameFrame.jsx'

export default function Play() {
  const { source, id } = useParams()
  const [game, setGame] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    setGame(null); setError('')
    if (source === 'local') {
      const g = getMyGame(id)
      if (g) setGame(g)
      else setError('Jeu introuvable dans ton Studio.')
    } else {
      getCommunityGame(id)
        .then(g => (g ? setGame(g) : setError('Jeu introuvable dans le Monde.')))
        .catch(e => setError(e.message))
    }
  }, [source, id])

  if (error) return <div><div className="error">{error}</div><Link className="btn" to="/">← Retour au Monde</Link></div>
  if (!game) return <p className="subtitle">Chargement du jeu…</p>

  return (
    <div>
      <Link className="btn" to={source === 'local' ? '/studio' : '/'} style={{ marginBottom: '1rem' }}>
        ← {source === 'local' ? 'Studio' : 'Monde'}
      </Link>
      <h1 style={{ marginTop: '0.8rem' }}>{game.emoji || '🎮'} {game.title}</h1>
      <p className="subtitle">{game.author ? `par ${game.author}` : 'création privée · Studio'}</p>
      <GameFrame html={game.html} title={game.title} />
    </div>
  )
}
