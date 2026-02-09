import { apiClient, ApiResponse } from './client'

export interface Profile {
  id: string
  full_name?: string
  role: string
  phone?: string
  manager_id?: string
  avatar_url?: string
  deleted_at?: string
  created_at: string
}

export interface LoginData {
  email: string
  password: string
}

export interface LoginResponse {
  access_token: string
  refresh_token: string
  user: Profile
}

export interface RefreshTokenData {
  refresh_token: string
}

export const authApi = {
  // Login
  async login(data: LoginData): Promise<ApiResponse<LoginResponse>> {
    return apiClient.post<LoginResponse>('/auth/login', data)
  },

  // Logout
  async logout(token: string): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post<{ message: string }>('/auth/logout', {}, token)
  },

  // Refresh token
  async refresh(
    data: RefreshTokenData
  ): Promise<ApiResponse<{ access_token: string; refresh_token: string }>> {
    return apiClient.post<{ access_token: string; refresh_token: string }>(
      '/auth/refresh',
      data
    )
  },

  // Get current user
  async me(token: string): Promise<ApiResponse<Profile>> {
    return apiClient.get<Profile>('/auth/me', token)
  },
}
