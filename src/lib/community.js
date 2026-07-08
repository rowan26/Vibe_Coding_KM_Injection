// Galerie communautaire partagée via Supabase (offre gratuite).
// Si Supabase n'est pas configuré (ni dans src/config.js ni dans les Réglages),
// la galerie affiche uniquement les jeux d'exemple intégrés.
//
// Table + politiques RLS attendues : voir le SQL dans le README.

import { getSupabase } from './supabaseClient.js'
import { displayName } from './auth.jsx'
import { SAMPLE_GAMES } from './samples.js'

export function communityEnabled() {
  return getSupabase() !== null
}

const sampleMetas = () => SAMPLE_GAMES.map(({ html, ...meta }) => meta)

/** Liste les jeux publics (sans le HTML, pour rester léger). */
export async function listCommunityGames() {
  const sb = getSupabase()
  if (!sb) return sampleMetas()
  const { data, error } = await sb
    .from('games')
    .select('id,title,prompt,emoji,author,user_id,created_at')
    .order('created_at', { ascending: false })
    .limit(100)
  if (error) throw new Error(`Erreur galerie : ${error.message}`)
  const rows = data.map(r => ({ ...r, createdAt: new Date(r.created_at).getTime() }))
  return [...rows, ...sampleMetas()]
}

/** Récupère un jeu public complet (avec son HTML). */
export async function getCommunityGame(id) {
  const sample = SAMPLE_GAMES.find(g => g.id === id)
  if (sample) return sample
  const sb = getSupabase()
  if (!sb) return null
  const { data, error } = await sb.from('games').select('*').eq('id', id).maybeSingle()
  if (error) throw new Error(`Erreur galerie : ${error.message}`)
  return data
}

/** Publie un jeu dans la galerie publique, au nom de l'utilisateur connecté. */
export async function publishGame(game, user) {
  const sb = getSupabase()
  if (!sb) {
    throw new Error("La galerie communautaire n'est pas configurée (voir README).")
  }
  if (!user) {
    throw new Error('Connectez-vous (bouton en haut à droite) pour publier un jeu.')
  }
  const { data, error } = await sb
    .from('games')
    .insert({
      title: game.title,
      prompt: game.prompt,
      html: game.html,
      emoji: game.emoji || '🎮',
      author: displayName(user),
      user_id: user.id,
    })
    .select()
    .single()
  if (error) throw new Error(`Publication impossible : ${error.message}`)
  return data
}

/** Retire de la galerie un jeu dont on est l'auteur. */
export async function unpublishGame(id) {
  const sb = getSupabase()
  if (!sb) return
  const { error } = await sb.from('games').delete().eq('id', id)
  if (error) throw new Error(`Dépublication impossible : ${error.message}`)
}
