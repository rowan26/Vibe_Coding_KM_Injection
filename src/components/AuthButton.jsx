import { useState } from 'react'
import { useAuth, displayName } from '../lib/auth.jsx'
import { communityEnabled } from '../lib/community.js'

export default function AuthButton() {
  const { user, signIn, signOut } = useAuth()
  const [open, setOpen] = useState(false)
  const [error, setError] = useState('')

  if (!communityEnabled()) return null

  if (user) {
    const avatar = user.user_metadata?.avatar_url
    return (
      <span className="userchip">
        {avatar && <img src={avatar} alt="" className="avatar" />}
        <span className="username">{displayName(user)}</span>
        <button onClick={signOut} title="Se déconnecter">Déconnexion</button>
      </span>
    )
  }

  const login = async (provider) => {
    setError('')
    try {
      await signIn(provider)
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <>
      <button className="primary" onClick={() => setOpen(true)}>Se connecter</button>
      {open && (
        <div className="modal-overlay" onClick={() => setOpen(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Se connecter à Vibe Arcade</h3>
            <p className="hint">
              Connexion gratuite via OAuth 2.0 — nécessaire uniquement pour <strong>publier</strong> vos jeux.
              Jouer et créer restent possibles sans compte.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
              <button className="primary" onClick={() => login('github')}>🐙 Continuer avec GitHub</button>
              <button className="primary" onClick={() => login('google')}>🔵 Continuer avec Google</button>
            </div>
            {error && <div className="error">{error}</div>}
            <button style={{ marginTop: '1rem' }} onClick={() => setOpen(false)}>Annuler</button>
          </div>
        </div>
      )}
    </>
  )
}
