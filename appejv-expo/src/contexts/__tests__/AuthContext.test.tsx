import React from 'react'
import { renderHook, waitFor } from '@testing-library/react-native'
import { AuthProvider, useAuth } from '../AuthContext'
import { supabase } from '../../lib/supabase'

jest.mock('../../lib/supabase')

describe('AuthContext', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <AuthProvider>{children}</AuthProvider>
  )

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should provide auth context', () => {
    const { result } = renderHook(() => useAuth(), { wrapper })
    
    expect(result.current).toBeDefined()
    expect(result.current.user).toBeNull()
    expect(result.current.loading).toBe(true)
  })

  it('should sign in successfully', async () => {
    const mockUser = {
      id: '123',
      email: 'test@example.com',
    }

    ;(supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
      data: { user: mockUser },
      error: null,
    })

    ;(supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: { role: 'sale' },
        error: null,
      }),
    })

    const { result } = renderHook(() => useAuth(), { wrapper })

    const response = await result.current.signIn('test@example.com', 'password')

    expect(response.role).toBe('sale')
    expect(response.error).toBeUndefined()
  })

  it('should handle sign in error', async () => {
    ;(supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
      data: { user: null },
      error: { message: 'Invalid credentials' },
    })

    const { result } = renderHook(() => useAuth(), { wrapper })

    const response = await result.current.signIn('test@example.com', 'wrong')

    expect(response.error).toBe('Invalid credentials')
  })

  it('should sign out successfully', async () => {
    ;(supabase.auth.signOut as jest.Mock).mockResolvedValue({})

    const { result } = renderHook(() => useAuth(), { wrapper })

    await result.current.signOut()

    expect(supabase.auth.signOut).toHaveBeenCalled()
  })
})
