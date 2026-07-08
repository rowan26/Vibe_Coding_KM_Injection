import { createClient } from '@supabase/supabase-js'
import { PLATFORM_SUPABASE } from '../config.js'
import { loadSettings } from './settings.js'

let client = null
let clientKey = ''

/**
 * Client Supabase partagé, ou null si rien n'est configuré.
 * Priorité à la config plateforme (src/config.js), sinon aux Réglages de
 * l'utilisateur (utile pour tester avec son propre projet Supabase).
 */
export function getSupabase() {
  const s = loadSettings()
  const url = PLATFORM_SUPABASE.url || s.supabaseUrl
  const anonKey = PLATFORM_SUPABASE.anonKey || s.supabaseAnonKey
  if (!url || !anonKey) return null
  const key = url + '|' + anonKey
  if (!client || clientKey !== key) {
    client = createClient(url.replace(/\/$/, ''), anonKey)
    clientKey = key
  }
  return client
}
