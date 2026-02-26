'use client'

import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import { Session, User as SupabaseUser } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'

type UserRole = 'admin' | 'sale_admin' | 'sale' | 'warehouse' | 'customer'

interface User {
  id: string
  email?: string
  phone?: string
  full_name?: string
  role: UserRole
}

interface AuthContextType {
  session: Session | null
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error?: string; role?: string }>
  signOut: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const mountedRef = useRef(true)
  const supabase = createClient()

  useEffect(() => {
    mountedRef.current = true

    const timeout = setTimeout(() => {
      if (mountedRef.current && loading) {
        console.warn('[AuthProvider] Init timeout — forcing loading=false')
        setLoading(false)
      }
    }, 5000)

    const initAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()

        if (!mountedRef.current) return

        if (error) {
          console.error('Auth init error:', error)
          setLoading(false)
          return
        }

        setSession(session)

        if (session?.user) {
          await fetchUserProfile(session.user)
        } else {
          setLoading(false)
        }
      } catch (err) {
        console.error('Auth init exception:', err)
        if (mountedRef.current) setLoading(false)
      } finally {
        clearTimeout(timeout)
      }
    }

    initAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mountedRef.current) return

      setSession(session)
      if (session?.user) {
        fetchUserProfile(session.user)
      } else {
        setUser(null)
        setLoading(false)
      }
    })

    return () => {
      mountedRef.current = false
      clearTimeout(timeout)
      subscription.unsubscribe()
    }
  }, [])

  const fetchUserProfile = async (supabaseUser: SupabaseUser) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role, full_name')
        .eq('id', supabaseUser.id)
        .single()

      if (error) {
        console.error('Fetch profile error:', error)
        throw error
      }

      const userData: User = {
        id: supabaseUser.id,
        email: supabaseUser.email,
        phone: supabaseUser.phone,
        full_name: profile?.full_name ?? undefined,
        role: (profile?.role as UserRole) ?? 'customer',
      }

      if (mountedRef.current) {
        setUser(userData)
      }
    } catch (error) {
      console.error('Fetch profile exception:', error)
      if (mountedRef.current) {
        setUser({
          id: supabaseUser.id,
          email: supabaseUser.email,
          phone: supabaseUser.phone,
          role: 'customer',
        })
      }
    } finally {
      if (mountedRef.current) setLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })

      if (error) {
        return { error: error.message }
      }

      if (data.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single()

        const role = (profile?.role as UserRole) ?? 'customer'
        return { role }
      }

      return {}
    } catch (error) {
      console.error('Sign in error:', error)
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
