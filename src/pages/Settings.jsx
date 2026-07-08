import { useState } from 'react'
import { loadSettings, saveSettings } from '../lib/settings.js'
import KeyWizard from '../components/KeyWizard.jsx'

export default function Settings() {
  const [s, setS] = useState(loadSettings)
  const [saved, setSaved] = useState(false)

  const set = (key) => (e) => { setS({ ...s, [key]: e.target.value }); setSaved(false) }

  const save = () => {
    saveSettings(s)
    setSaved(true)
  }

  return (
    <div style={{ maxWidth: 640 }}>
      <h1>Réglages</h1>
      <p className="subtitle">
        Tout reste stocké dans votre navigateur. Votre clé API n'est envoyée qu'au fournisseur d'IA que vous choisissez.
      </p>

      <div className="panel">
        <h3 style={{ marginTop: 0 }}>🧠 Modèle IA (gratuit)</h3>
        <label htmlFor="provider">Fournisseur</label>
        <select id="provider" value={s.provider} onChange={set('provider')}>
          <option value="gemini">Google Gemini (recommandé — quota gratuit généreux)</option>
          <option value="groq">Groq (Llama — très rapide, quota gratuit)</option>
        </select>

        {s.provider === 'gemini' ? (
          <>
            <div style={{ margin: '0.8rem 0' }}>
              <KeyWizard onDone={() => { setS(loadSettings()); setSaved(false) }} />
            </div>
            <label htmlFor="geminiKey">Clé API Gemini</label>
            <input id="geminiKey" type="password" value={s.geminiKey} onChange={set('geminiKey')} placeholder="AIza..." />
            <p className="hint">
              L'assistant ci-dessus la génère et la teste pour vous ; vous pouvez aussi la coller
              manuellement depuis{' '}
              <a href="https://aistudio.google.com/apikey" target="_blank" rel="noreferrer">aistudio.google.com/apikey</a>
              {' '}(compte Google requis, aucune carte bancaire).
            </p>
            <label htmlFor="geminiModel">Modèle</label>
            <input id="geminiModel" value={s.geminiModel} onChange={set('geminiModel')} />
          </>
        ) : (
          <>
            <label htmlFor="groqKey">Clé API Groq</label>
            <input id="groqKey" type="password" value={s.groqKey} onChange={set('groqKey')} placeholder="gsk_..." />
            <p className="hint">
              Obtenez une clé gratuite sur{' '}
              <a href="https://console.groq.com/keys" target="_blank" rel="noreferrer">console.groq.com/keys</a>
              {' '}(aucune carte bancaire).
            </p>
            <label htmlFor="groqModel">Modèle</label>
            <input id="groqModel" value={s.groqModel} onChange={set('groqModel')} />
          </>
        )}
      </div>

      <div className="panel">
        <h3 style={{ marginTop: 0 }}>🌍 Galerie communautaire (avancé)</h3>
        <p className="hint">
          Normalement, le propriétaire du site configure Supabase une fois pour tous dans{' '}
          <code>src/config.js</code> (galerie partagée + connexion OAuth GitHub/Google — voir README).
          Les champs ci-dessous servent uniquement à brancher <em>votre propre</em> projet Supabase,
          par exemple pour tester en local.
        </p>
        <label htmlFor="supabaseUrl">URL du projet Supabase</label>
        <input id="supabaseUrl" value={s.supabaseUrl} onChange={set('supabaseUrl')} placeholder="https://xxxx.supabase.co" />
        <label htmlFor="supabaseAnonKey">Clé anon (publique)</label>
        <input id="supabaseAnonKey" value={s.supabaseAnonKey} onChange={set('supabaseAnonKey')} placeholder="eyJ..." />
      </div>

      <button className="primary" onClick={save}>💾 Enregistrer les réglages</button>
      {saved && <div className="notice">Réglages enregistrés ✔</div>}
    </div>
  )
}
