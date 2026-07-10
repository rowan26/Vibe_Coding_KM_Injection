import { Link } from 'react-router-dom'

export default function GameCard({ game, source, children }) {
  return (
    <div className="card">
      <div className="thumb">{game.emoji || '🎮'}</div>
      <div className="body">
        <h3>{game.title}</h3>
        <div className="meta">
          {game.author ? `par ${game.author}` : game.prompt?.slice(0, 70)}
        </div>
        <div className="actions">
          <Link className="btn primary" to={`/jouer/${source}/${game.id}`}>▶ Jouer</Link>
          {children}
        </div>
      </div>
    </div>
  )
}
