import React, { createContext, useContext, useEffect, useState } from 'react'
import { Session, User as SupabaseUser } from '@supabase/supabase-js'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { supabase } from '../lib/supabase'
import { User } from '../types'
import { errorTracker } from '../lib/error-tracking'
import { Analytics, AnalyticsEvents } from '../lib/analytics'

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
          errorTracker.logError(error, { action: 'AuthProvider.initAuth' })
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
        errorTracker.logError(err as Error, { action: 'AuthProvider.initAuth' })
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
        errorTracker.logError(error, { action: 'AuthProvider.fetchUserProfile' })
        throw error
      }

      console.log('AuthProvider: Got profile', profile)
      const userData = {
        id: supabaseUser.id,
        email: supabaseUser.email,
        phone: supabaseUser.phone,
        full_name: profile?.full_name,
        role: profile?.role || 'customer',
      }
      setUser(userData)
      
      // Track user properties in analytics
      Analytics.setUserProperties({
        userId: userData.id,
        email: userData.email || undefined,
        phone: userData.phone || undefined,
        role: userData.role,
        name: userData.full_name || undefined,
      })
    } catch (error) {
      console.error('AuthProvider: Error in fetchUserProfile', error)
      errorTracker.logError(error as Error, { action: 'AuthProvider.fetchUserProfile' })
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

      if (error) {
        errorTracker.logWarning(error.message, { action: 'AuthProvider.signIn' })
        return { error: error.message }
      }

      if (data.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single()

        errorTracker.setUser(data.user.id, data.user.email || undefined, profile?.role || 'customer')
        
        // Track login event
        Analytics.trackEvent(AnalyticsEvents.LOGIN, {
          method: 'email',
          role: profile?.role || 'customer',
        })
        
        return { role: profile?.role || 'customer' }
      }

      return {}
    } catch (error) {
      errorTracker.logError(error as Error, { action: 'AuthProvider.signIn' })
      return { error: 'Có lỗi xảy ra khi đăng nhập' }
    }
  }

  const signInWithPhone = async (phone: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        phone,
        password,
      })

      if (error) {
        errorTracker.logWarning(error.message, { action: 'AuthProvider.signInWithPhone' })
        return { error: error.message }
      }

      if (data.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single()

        errorTracker.setUser(data.user.id, data.user.phone || undefined, profile?.role || 'customer')
        
        // Track login event
        Analytics.trackEvent(AnalyticsEvents.LOGIN, {
          method: 'phone',
          role: profile?.role || 'customer',
        })
        
        return { role: profile?.role || 'customer' }
      }

      return {}
    } catch (error) {
      errorTracker.logError(error as Error, { action: 'AuthProvider.signInWithPhone' })
      return { error: 'Có lỗi xảy ra khi đăng nhập' }
    }
  }

  const signOut = async () => {
    // Track logout event
    Analytics.trackEvent(AnalyticsEvents.LOGOUT, {
      role: user?.role,
    })
    
    // Save email to AsyncStorage before signing out
    if (user?.email) {
      try {
        await AsyncStorage.setItem('rememberedEmail', user.email)
      } catch (error) {
        console.error('Error saving email:', error)
        errorTracker.logWarning('Failed to save email to AsyncStorage', { action: 'AuthProvider.signOut' })
      }
    }
    errorTracker.clearUser()
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
