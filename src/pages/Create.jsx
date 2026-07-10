import { useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { generateGame, iterateGame } from '../lib/ai.js'
import { getMyGame, saveMyGame } from '../lib/storage.js'
import { loadSettings } from '../lib/settings.js'
import GameFrame from '../components/GameFrame.jsx'
import KeyWizard from '../components/KeyWizard.jsx'

const EMOJIS = ['🎮', '🐍', '🚀', '🧱', '👾', '🏎️', '⚔️', '🧩', '🏀', '🐦', '💣', '🌟']

export default function Create() {
  const { id } = useParams()
  const existing = id ? getMyGame(id) : null
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [keyVersion, setKeyVersion] = useState(0)

  const [title, setTitle] = useState(existing?.title || '')
  const [emoji, setEmoji] = useState(existing?.emoji || '🎮')
  // Prérempli depuis la barre de prompt du Monde (?prompt=...)
  const [prompt, setPrompt] = useState(existing?.prompt || searchParams.get('prompt') || '')
  const [instruction, setInstruction] = useState('')
  const [html, setHtml] = useState(existing?.html || '')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)
  const [frameKey, setFrameKey] = useState(0)

  const settings = loadSettings()
  const hasKey = settings.provider === 'gemini' ? !!settings.geminiKey : !!settings.groqKey

  const run = async (fn) => {
    setBusy(true); setError(''); setSaved(false)
    try {
      const result = await fn()
      setHtml(result)
      setFrameKey(k => k + 1)
    } catch (e) {
      setError(e.message)
    } finally {
      setBusy(false)
    }
  }

  const create = () => {
    if (!prompt.trim()) { setError('Décrivez d\'abord votre jeu.'); return }
    run(() => generateGame(prompt))
  }

  const improve = () => {
    if (!instruction.trim()) { setError('Décrivez la modification souhaitée.'); return }
    run(async () => {
      const result = await iterateGame(html, instruction)
      setInstruction('')
      return result
    })
  }

  const save = () => {
    if (!html) return
    const name = title.trim() || prompt.slice(0, 40) || 'Jeu sans titre'
    const game = saveMyGame({ id: existing?.id, title: name, prompt, html, emoji })
    setSaved(true)
    if (!existing) navigate(`/creer/${game.id}`, { replace: true })
  }

  return (
    <div>
      <h1 className="gradient">{existing ? `Modifier « ${existing.title} »` : '✨ Atelier de création'}</h1>
      <p className="subtitle">
        Décris le jeu de tes rêves, l'IA écrit le code. Itère jusqu'à ce qu'il soit parfait, sauvegarde-le dans ton Studio, puis partage-le avec le Monde.
      </p>

      {!hasKey && (
        <div className="notice">
          <p style={{ marginTop: 0 }}>
            Il vous manque juste une clé API gratuite pour générer des jeux (1 minute, sans carte bancaire) :
          </p>
          <KeyWizard onDone={() => setKeyVersion(v => v + 1)} />
          <p className="hint" style={{ marginBottom: 0 }}>
            Vous préférez Groq ? Configurez-le dans les <Link to="/reglages">Réglages</Link>.
          </p>
        </div>
      )}

      <div className="create-layout">
        <div className="panel">
          <label htmlFor="title">Titre du jeu</label>
          <input id="title" value={title} onChange={e => setTitle(e.target.value)} placeholder="Mon super jeu" />

          <label>Icône</label>
          <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
            {EMOJIS.map(e => (
              <button
                key={e}
                onClick={() => setEmoji(e)}
                style={{ fontSize: '1.3rem', background: e === emoji ? 'var(--accent)' : 'var(--panel-2)' }}
              >
                {e}
              </button>
            ))}
          </div>

          <label htmlFor="prompt">Description du jeu</label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            placeholder="Ex : un jeu de plateforme où un robot saute entre des nuages pour attraper des étoiles, avec un score et de plus en plus de vent…"
          />
          <div style={{ marginTop: '0.6rem' }}>
            <button className="primary" onClick={create} disabled={busy}>
              {busy ? <span className="spinner">⏳</span> : '✨'} {html ? 'Tout regénérer' : 'Générer le jeu'}
            </button>
          </div>

          {html && (
            <>
              <label htmlFor="instruction">Améliorer le jeu</label>
              <textarea
                id="instruction"
                value={instruction}
                onChange={e => setInstruction(e.target.value)}
                placeholder="Ex : rends le personnage plus rapide et ajoute des ennemis"
                style={{ minHeight: 60 }}
              />
              <div style={{ marginTop: '0.6rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button onClick={improve} disabled={busy}>
                  {busy ? <span className="spinner">⏳</span> : '🔧'} Appliquer la modification
                </button>
                <button className="primary" onClick={save} disabled={busy}>💾 Sauvegarder</button>
              </div>
            </>
          )}

          {error && <div className="error">{error}</div>}
          {saved && <div className="notice">Jeu sauvegardé dans ton <Link to="/studio">Studio</Link> (privé). Partage-le avec le Monde depuis là quand tu veux.</div>}
        </div>

        <div>
          {html ? (
            <>
              <GameFrame key={frameKey} html={html} className="preview-frame" title="Aperçu du jeu" />
              <p className="hint">
                Aperçu en direct — cliquez dans le jeu pour lui donner le focus clavier.{' '}
                <button onClick={() => setFrameKey(k => k + 1)}>↺ Relancer</button>
              </p>
            </>
          ) : (
            <div className="empty" style={{ aspectRatio: '4 / 3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <p>L'aperçu de votre jeu apparaîtra ici 👾</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
