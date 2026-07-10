import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { listCommunityGames, communityEnabled, unpublishGame } from '../lib/community.js'
import { useAuth } from '../lib/auth.jsx'
import GameCard from '../components/GameCard.jsx'

const SUGGESTIONS = [
  'un snake néon avec des power-ups',
  'un jeu de plateforme spatial',
  'un casse-briques avec des boss',
  'un shoot\'em up rétro',
  'un puzzle de blocs qui tombent',
]

export default function Explore() {
  const [games, setGames] = useState(null)
  const [error, setError] = useState('')
  const [idea, setIdea] = useState('')
  const { user } = useAuth()
  const navigate = useNavigate()

  const refresh = () => {
    listCommunityGames()
      .then(setGames)
      .catch(e => { setError(e.message); setGames([]) })
  }

  useEffect(refresh, [])

  const launch = (text) => {
    const q = (text ?? idea).trim()
    navigate(q ? `/creer?prompt=${encodeURIComponent(q)}` : '/creer')
  }

  const unpublish = async (game) => {
    if (!confirm(`Retirer « ${game.title} » du Monde public ?`)) return
    try {
      await unpublishGame(game.id)
      refresh()
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <div>
      {/* Hero façon plateforme de génération */}
      <section className="hero">
        <span className="eyebrow">🌍 Environnement international</span>
        <h1 className="gradient">Imagine un jeu. L'IA le code. Le monde y joue.</h1>
        <p className="subtitle">
          Décris ton idée, génère un vrai jeu jouable en quelques secondes, et partage-le gratuitement avec toute la communauté.
        </p>
        <form className="prompt-hero" onSubmit={e => { e.preventDefault(); launch() }}>
          <input
            value={idea}
            onChange={e => setIdea(e.target.value)}
            placeholder="Décris ton jeu : un robot ninja qui saute de toit en toit…"
            aria-label="Décris ton jeu"
          />
          <button type="submit" className="primary">✨ Créer</button>
        </form>
        <div className="suggestions">
          {SUGGESTIONS.map(s => (
            <span key={s} className="chip" onClick={() => launch(s)}>{s}</span>
          ))}
        </div>
      </section>

      {/* Flux communautaire */}
      <div className="env-head">
        <div className="env-title">
          <span className="dot public" />
          <div>
            <h1 style={{ fontSize: '1.4rem' }}>Le Monde</h1>
            <span className="hint">Les jeux que la communauté a choisi de partager.</span>
          </div>
        </div>
        <Link className="btn" to="/studio">🧪 Mon Studio →</Link>
      </div>

      {!communityEnabled() && (
        <div className="notice">
          Le Monde partagé n'est pas encore branché : voici des jeux d'exemple.
          Pour activer le partage entre tous les joueurs, configure Supabase (gratuit) — voir le README, ou les{' '}
          <Link to="/reglages">Réglages</Link>.
        </div>
      )}
      {error && <div className="error">{error}</div>}
      {games === null && <p className="subtitle">Chargement du Monde…</p>}
      {games && (
        <div className="grid">
          {games.map(g => (
            <GameCard key={g.id} game={g} source="public">
              {user && g.user_id === user.id && (
                <button className="danger" onClick={() => unpublish(g)} title="Retirer du Monde">🗑</button>
              )}
            </GameCard>
          ))}
        </div>
      )}
    </div>
  )
}
