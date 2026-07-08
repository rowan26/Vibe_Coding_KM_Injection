// Réglages utilisateur stockés en local (jamais envoyés ailleurs
// que vers le fournisseur d'IA choisi).

const KEY = 'vibe-arcade.settings'

export const DEFAULT_SETTINGS = {
  provider: 'gemini', // 'gemini' | 'groq'
  geminiKey: '',
  groqKey: '',
  geminiModel: 'gemini-2.5-flash',
  groqModel: 'llama-3.3-70b-versatile',
  // Optionnel : galerie communautaire partagée via Supabase (offre gratuite)
  supabaseUrl: '',
  supabaseAnonKey: '',
}

export function loadSettings() {
  try {
    return { ...DEFAULT_SETTINGS, ...JSON.parse(localStorage.getItem(KEY) || '{}') }
  } catch {
    return { ...DEFAULT_SETTINGS }
  }
}

export function saveSettings(settings) {
  localStorage.setItem(KEY, JSON.stringify(settings))
}
