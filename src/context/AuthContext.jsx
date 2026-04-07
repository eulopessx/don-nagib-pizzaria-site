import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext()

const ADMIN_EMAILS = [
  'jeannagibb@gmail.com',
  'joao.motoe4@gmail.com',
]

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    async function loadSession() {
      const { data, error } = await supabase.auth.getSession()

      if (!mounted) return

      if (error) {
        console.error('Erro ao carregar sessão:', error.message)
      }

      const currentSession = data?.session ?? null
      setSession(currentSession)
      setUser(currentSession?.user ?? null)
      setAuthLoading(false)
    }

    loadSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
      setUser(newSession?.user ?? null)
      setAuthLoading(false)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  async function signUp({ email, password }) {
    return supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
      },
    })
  }

  async function signIn({ email, password }) {
    return supabase.auth.signInWithPassword({
      email,
      password,
    })
  }

  async function signInWithGoogle() {
    return supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    })
  }

  async function signOut() {
    return supabase.auth.signOut()
  }

  const isAdmin = ADMIN_EMAILS.includes(user?.email?.toLowerCase())

  const value = useMemo(
    () => ({
      session,
      user,
      authLoading,
      isAuthenticated: !!user,
      isAdmin,
      signUp,
      signIn,
      signInWithGoogle,
      signOut,
    }),
    [session, user, authLoading, isAdmin]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}