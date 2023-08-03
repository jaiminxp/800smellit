import { EXPIRY, TOKEN } from '@/constants/auth'
import APIRequest from '@/lib/api-request'
import { AuthFormValues, AuthResponse } from '@/types'

class AuthService extends APIRequest {
  public async signup(data: AuthFormValues) {
    return this.post<{ success: true }>('/signup', data)
  }

  public async login(data: AuthFormValues) {
    const res = await this.post<AuthResponse>('/login', data)

    this.setToken(res.token)
    this.setExpiry(res.expiresIn)

    return res
  }

  public logout() {
    localStorage.removeItem(TOKEN)
    localStorage.removeItem(EXPIRY)
  }

  public isLoggedIn() {
    if (typeof window !== 'undefined' && window.localStorage) {
      return this.getToken() && new Date() < this.getExpiration()
    }
  }

  getExpiration() {
    const tokenExpiry = localStorage.getItem(EXPIRY)

    if (tokenExpiry) {
      return new Date(tokenExpiry)
    }

    return new Date()
  }

  setToken(token: string) {
    localStorage.setItem(TOKEN, token)
    this.setAuthHeaderToken(token)
  }

  setExpiry(expiry: number) {
    localStorage.setItem(EXPIRY, new Date(expiry).toString())
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN)
  }
}

export const authService = new AuthService()
