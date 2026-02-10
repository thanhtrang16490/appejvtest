import React, { createContext, useContext, useEffect, useState } from 'react'
import { Session, User as SupabaseUser } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import { User } from '../types'

interface AuthContextType {
  session: Session | null
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error?: string; role?: string }>
  signInWithPhone: (phone: string, password: string) => Promise<{ error?: string; role?: string }>
  signOut: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log('AuthProvider: Initializing...')
    let mounted = true
    
    // Set timeout to prevent infinite loading - reduced to 2 seconds
    const timeout = setTimeout(() => {
      if (mounted) {
        console.log('AuthProvider: Timeout - forcing loading to false')
        setLoading(false)
      }
    }, 2000)
    
    // Initialize auth
    const initAuth = async () => {
      try {
        console.log('AuthProvider: Getting session...')
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (!mounted) return
        
        if (error) {
          console.error('AuthProvider: Session error:', error.message)
          setLoading(false)
          return
        }
        
        console.log('AuthProvider: Session result:', session ? 'exists' : 'null')
        setSession(session)
        
        if (session?.user) {
          await fetchUserProfile(session.user)
        } else {
          setLoading(false)
        }
      } catch (err) {
        console.error('AuthProvider: Init error:', err)
        if (mounted) {
          setLoading(false)
        }
      } finally {
        clearTimeout(timeout)
      }
    }

    initAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('AuthProvider: Auth state changed:', _event, session ? 'exists' : 'null')
      if (!mounted) return
      
      setSession(session)
      if (session?.user) {
        fetchUserProfile(session.user)
      } else {
        setUser(null)
      }
    })

    return () => {
      mounted = false
      clearTimeout(timeout)
      subscription.unsubscribe()
    }
  }, [])

  const fetchUserProfile = async (supabaseUser: SupabaseUser) => {
    console.log('AuthProvider: Fetching profile for', supabaseUser.id)
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role, full_name')
        .eq('id', supabaseUser.id)
        .single()

      if (error) {
        console.error('AuthProvider: Error fetching profile', error)
        throw error
      }

      console.log('AuthProvider: Got profile', profile)
      setUser({
        id: supabaseUser.id,
        email: supabaseUser.email,
        phone: supabaseUser.phone,
        full_name: profile?.full_name,
        role: profile?.role || 'customer',
      })
    } catch (error) {
      console.error('AuthProvider: Error in fetchUserProfile', error)
      setUser({
        id: supabaseUser.id,
        email: supabaseUser.email,
        phone: supabaseUser.phone,
        role: 'customer',
      })
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) return { error: error.message }

      if (data.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single()

        return { role: profile?.role || 'customer' }
      }

      return {}
    } catch (error) {
      return { error: 'Có lỗi xảy ra khi đăng nhập' }
    }
  }

  const signInWithPhone = async (phone: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        phone,
        password,
      })

      if (error) return { error: error.message }

      if (data.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single()

        return { role: profile?.role || 'customer' }
      }

      return {}
    } catch (error) {
      return { error: 'Có lỗi xảy ra khi đăng nhập' }
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  const refreshUser = async () => {
    const { data: { user: supabaseUser } } = await supabase.auth.getUser()
    if (supabaseUser) {
      await fetchUserProfile(supabaseUser)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        loading,
        signIn,
        signInWithPhone,
        signOut,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
