const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

export type AuthUser = {
  id: string
  firstName: string
  lastName: string
  email: string
  role: 'customer' | 'provider' | 'admin'
}

export type AuthResponse = {
  message: string
  user: AuthUser
  accessToken: string
  refreshToken: string
}

async function request<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.message || 'The request failed')
  }

  return data as T
}

export function signup(payload: {
  firstName: string
  lastName: string
  dateOfBirth: string
  email: string
  phone: string
  password: string
  confirmPassword: string
  role: 'customer' | 'provider'
  provider?: {
    businessName: string
    serviceCategory: string
    customServiceCategory?: string
    teamSize: number
  }
}) {
  return request<AuthResponse>('/auth/signup', payload)
}

export function login(payload: { email: string; password: string }) {
  return request<AuthResponse>('/auth/login', payload)
}

export function sendLoginOtp(payload: { destination: string; channel: 'email' | 'phone' }) {
  return request<{ message: string; demoCode?: string }>('/auth/login/otp/send', payload)
}

export function loginOtp(payload: { destination: string; channel: 'email' | 'phone'; code: string }) {
  return request<AuthResponse>('/auth/login/otp/verify', payload)
}

export function saveSession(response: AuthResponse) {
  localStorage.setItem('cleanpro_user', JSON.stringify(response.user))
  localStorage.setItem('cleanpro_access_token', response.accessToken)
  localStorage.setItem('cleanpro_refresh_token', response.refreshToken)
}

export function clearSession() {
  const refreshToken = localStorage.getItem('cleanpro_refresh_token')

  if (refreshToken) {
    fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    }).catch(() => {})
  }

  localStorage.removeItem('cleanpro_user')
  localStorage.removeItem('cleanpro_access_token')
  localStorage.removeItem('cleanpro_refresh_token')
}

export function getStoredUser(): AuthUser | null {
  const value = localStorage.getItem('cleanpro_user')
  if (!value) return null

  try {
    return JSON.parse(value) as AuthUser
  } catch {
    return null
  }
}

export function forgotPassword(email: string) {
  return request<{ message: string; resetUrl?: string }>('/auth/forgot-password', { email })
}

export function resetPassword(payload: { token: string; password: string; confirmPassword: string }) {
  return request<{ message: string }>('/auth/reset-password', payload)
}
