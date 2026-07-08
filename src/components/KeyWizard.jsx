import { useState } from 'react'
import { loadSettings, saveSettings } from '../lib/settings.js'

// Assistant intégré : obtenir sa clé Gemini gratuite sans quitter la plateforme.
// Google ne permet pas de créer la clé à sa place (c'est une protection de leur
// côté), donc l'assistant ouvre AI Studio dans un popup, guide pas à pas, puis
// TESTE la clé collée avant de l'enregistrer.

export default function KeyWizard({ onDone }) {
  const [open, setOpen] = useState(false)
  const [key, setKey] = useState('')
  const [status, setStatus] = useState('idle') // idle | testing | ok | error
  const [message, setMessage] = useState('')

  const openStudio = () => {
    window.open(
      'https://aistudio.google.com/apikey',
      'gemini-key',
      'popup,width=1100,height=760,noopener,noreferrer',
    )
  }

  const testAndSave = async () => {
    const trimmed = key.trim()
    if (!trimmed) { setStatus('error'); setMessage('Collez d\'abord votre clé.'); return }
    setStatus('testing'); setMessage('')
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(trimmed)}&pageSize=1`,
      )
      if (!res.ok) {
        const body = await res.text()
        throw new Error(`clé refusée par Google (${res.status}) : ${body.slice(0, 200)}`)
      }
      saveSettings({ ...loadSettings(), provider: 'gemini', geminiKey: trimmed })
      setStatus('ok')
      setMessage('Clé valide et enregistrée ! Vous pouvez créer des jeux. 🎉')
      onDone?.()
    } catch (e) {
      setStatus('error')
      setMessage(`Le test a échoué — ${e.message}`)
    }
  }

  return (
    <>
      <button className="primary" onClick={() => setOpen(true)}>🔑 Obtenir ma clé Gemini gratuite</button>
      {open && (
        <div className="modal-overlay" onClick={() => setOpen(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>🔑 Votre clé Gemini gratuite en 1 minute</h3>
            <ol className="steps">
              <li>
                Cliquez ci-dessous : Google AI Studio s'ouvre dans une petite fenêtre
                (connectez-vous avec un compte Google si demandé — aucune carte bancaire).
                <div style={{ margin: '0.5rem 0' }}>
                  <button className="primary" onClick={openStudio}>↗ Ouvrir Google AI Studio</button>
                </div>
              </li>
              <li>Dans cette fenêtre, cliquez sur <strong>« Create API key »</strong> puis copiez la clé (elle commence par <code>AIza</code>).</li>
              <li>
                Revenez ici et collez-la :
                <input
                  type="password"
                  value={key}
                  onChange={e => { setKey(e.target.value); setStatus('idle') }}
                  placeholder="AIza..."
                  style={{ marginTop: '0.4rem' }}
                />
                <div style={{ marginTop: '0.5rem' }}>
                  <button className="primary" onClick={testAndSave} disabled={status === 'testing'}>
                    {status === 'testing' ? <span className="spinner">⏳</span> : '✅'} Tester et enregistrer
                  </button>
                </div>
              </li>
            </ol>
            {status === 'ok' && <div className="notice">{message}</div>}
            {status === 'error' && <div className="error">{message}</div>}
            <p className="hint">
              Votre clé reste dans <em>votre</em> navigateur et n'est envoyée qu'à Google.
              Le quota gratuit de Gemini suffit largement pour créer des jeux au quotidien.
            </p>
            <button onClick={() => setOpen(false)}>{status === 'ok' ? 'Fermer' : 'Plus tard'}</button>
          </div>
        </div>
      )}
    </>
  )
}
