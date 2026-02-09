/**
 * Auth Token Helper
 * Handles JWT token retrieval from Supabase session
 */

import { createClient } from '@/lib/supabase/client'

/**
 * Get current access token from Supabase session
 * @returns JWT access token or null if not authenticated
 */
export async function getAccessToken(): Promise<string | null> {
  try {
    const supabase = createClient()
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) {
      console.error('Error getting session:', error)
      return null
    }
    
    return session?.access_token || null
  } catch (error) {
    console.error('Error in getAccessToken:', error)
    return null
  }
}

/**
 * Get current user from Supabase session
 */
export async function getCurrentUser() {
  try {
    const supabase = createClient()
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error) {
      console.error('Error getting user:', error)
      return null
    }
    
    return user
  } catch (error) {
    console.error('Error in getCurrentUser:', error)
    return null
  }
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const token = await getAccessToken()
  return token !== null
}
