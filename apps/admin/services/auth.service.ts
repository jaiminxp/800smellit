'use client'

import { EXPIRY, TOKEN, ROLE_ADMIN } from '@/lib/constants'
import { APIRequest } from '@/lib/api-request'
import { ILoginPayload, ILoginResponse } from '@/lib/interfaces'

export class AuthService extends APIRequest {
  public async login(data: ILoginPayload) {
    const res = await this.post<ILoginResponse>('login', data)

    if (!res.user.roles.includes(ROLE_ADMIN)) {
      throw new Error("You don't have permission to access this page")
    }

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
