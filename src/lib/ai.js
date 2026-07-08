import { loadSettings } from './settings.js'

const SYSTEM_PROMPT = `Tu es un générateur de jeux vidéo web experts. Tu produis des jeux complets, beaux et jouables.

RÈGLES ABSOLUES :
- Réponds UNIQUEMENT avec un fichier HTML complet (<!DOCTYPE html> ... </html>), sans aucune explication avant ou après.
- Tout doit être autonome dans ce seul fichier : CSS dans <style>, JavaScript dans <script>. AUCUNE ressource externe (pas de CDN, pas d'image distante, pas de police externe).
- Le jeu doit être immédiatement jouable : contrôles clavier (flèches/WASD/espace) ET tactiles quand c'est pertinent.
- Affiche les instructions de jeu à l'écran (titre, comment jouer, score).
- Le jeu doit être joli : utilise canvas ou DOM avec un vrai soin visuel (couleurs, animations, effets).
- Gère la fin de partie et le redémarrage sans recharger la page.
- Le jeu doit s'adapter à la taille de la fenêtre (responsive).
- N'utilise jamais localStorage, cookies, fetch, ni aucune API réseau.`

const ITERATE_PROMPT = `Voici le code HTML actuel d'un jeu. Applique la modification demandée par l'utilisateur et renvoie le fichier HTML complet mis à jour. Réponds UNIQUEMENT avec le HTML complet, sans explication.`

// Extrait le document HTML de la réponse du modèle (retire les balises markdown éventuelles)
function extractHtml(text) {
  if (!text) throw new Error("Le modèle a renvoyé une réponse vide.")
  const fenced = text.match(/```(?:html)?\s*([\s\S]*?)```/i)
  let html = fenced ? fenced[1] : text
  const start = html.search(/<!DOCTYPE html>/i)
  if (start >= 0) html = html.slice(start)
  const end = html.lastIndexOf('</html>')
  if (end >= 0) html = html.slice(0, end + '</html>'.length)
  html = html.trim()
  if (!/<html[\s>]/i.test(html)) {
    throw new Error("La réponse du modèle ne contient pas de document HTML valide. Réessayez.")
  }
  return html
}

async function callGemini(settings, userText) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${settings.geminiModel}:generateContent?key=${encodeURIComponent(settings.geminiKey)}`
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents: [{ role: 'user', parts: [{ text: userText }] }],
      generationConfig: { maxOutputTokens: 65536, temperature: 0.8 },
    }),
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Erreur Gemini (${res.status}) : ${body.slice(0, 400)}`)
  }
  const data = await res.json()
  const text = data.candidates?.[0]?.content?.parts?.map(p => p.text).join('') ?? ''
  return text
}

async function callGroq(settings, userText) {
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${settings.groqKey}`,
    },
    body: JSON.stringify({
      model: settings.groqModel,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userText },
      ],
      max_tokens: 32768,
      temperature: 0.8,
    }),
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Erreur Groq (${res.status}) : ${body.slice(0, 400)}`)
  }
  const data = await res.json()
  return data.choices?.[0]?.message?.content ?? ''
}

async function call(userText) {
  const settings = loadSettings()
  if (settings.provider === 'gemini') {
    if (!settings.geminiKey) throw new Error("Aucune clé API Gemini configurée. Allez dans Réglages pour en ajouter une (gratuit).")
    return extractHtml(await callGemini(settings, userText))
  }
  if (!settings.groqKey) throw new Error("Aucune clé API Groq configurée. Allez dans Réglages pour en ajouter une (gratuit).")
  return extractHtml(await callGroq(settings, userText))
}

/** Génère un nouveau jeu à partir d'une description. Renvoie le HTML complet. */
export function generateGame(prompt) {
  return call(`Crée le jeu suivant : ${prompt}`)
}

/** Modifie un jeu existant selon une instruction. Renvoie le HTML complet mis à jour. */
export function iterateGame(currentHtml, instruction) {
  return call(`${ITERATE_PROMPT}\n\nModification demandée : ${instruction}\n\nCode actuel :\n${currentHtml}`)
}
