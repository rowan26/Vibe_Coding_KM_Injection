// Authentification OAuth 2.0 (GitHub / Google) via Supabase Auth — gratuit.
// Le flux PKCE de supabase-js redirige vers le fournisseur puis revient sur
// le site avec un paramètre ?code=..., échangé automatiquement contre une session.

import { createContext, useContext, useEffect, useState } from 'react'
import { getSupabase } from './supabaseClient.js'

const AuthContext = createContext({ user: null, signIn: () => {}, signOut: () => {} })

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const sb = getSupabase()
    if (!sb) return
    sb.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null))
    const { data: sub } = sb.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => sub.subscription.unsubscribe()
  }, [])

  const signIn = async (provider) => {
    const sb = getSupabase()
    if (!sb) throw new Error("La connexion n'est pas encore activée : le propriétaire du site doit configurer Supabase (voir README).")
    const { error } = await sb.auth.signInWithOAuth({
      provider,
      options: { redirectTo: window.location.origin + window.location.pathname },
    })
    if (error) throw new Error(`Connexion ${provider} impossible : ${error.message}`)
  }

  const signOut = async () => {
    const sb = getSupabase()
    if (sb) await sb.auth.signOut()
  }

  return <AuthContext.Provider value={{ user, signIn, signOut }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}

/** Pseudo lisible d'un utilisateur connecté (pseudo GitHub, nom Google, ou e-mail). */
export function displayName(user) {
  if (!user) return 'anonyme'
  const m = user.user_metadata || {}
  return m.user_name || m.preferred_username || m.full_name || m.name || user.email || 'anonyme'
}
