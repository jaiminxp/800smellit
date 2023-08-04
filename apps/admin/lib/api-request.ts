/* eslint-disable @typescript-eslint/no-explicit-any */
import { TOKEN } from './constants/auth'

const BASE_URL = process.env.NEXT_PUBLIC_API_ENDPOINT

export abstract class APIRequest {
  protected token: string | null = null

  setAuthHeaderToken(token: string) {
    this.token = token
  }

  async request<ResponseType>(
    url: string,
    method?: string,
    body?: any,
    headers?: { [key: string]: string }
  ): Promise<ResponseType> {
    const verb = (method || 'get').toUpperCase()
    const requestHeaders = Object.assign(
      {
        'Content-Type': 'application/json',
        Authorization: this.token || localStorage.getItem(TOKEN) || '',
      },
      headers || {}
    )

    const res = await fetch(`${BASE_URL}${url}`, {
      method: verb,
      headers: requestHeaders,
      body: body ? JSON.stringify(body) : null,
    })

    const data = await res.json()
    return data
  }

  get<ResponseType>(url: string, headers?: { [key: string]: string }) {
    return this.request<ResponseType>(url, 'get', null, headers)
  }

  post<ResponseType>(
    url: string,
    data?: any,
    headers?: { [key: string]: string }
  ) {
    return this.request<ResponseType>(url, 'post', data, headers)
  }

  put<ResponseType>(
    url: string,
    data?: any,
    headers?: { [key: string]: string }
  ) {
    return this.request<ResponseType>(url, 'put', data, headers)
  }

  del<ResponseType>(
    url: string,
    data?: any,
    headers?: { [key: string]: string }
  ) {
    return this.request<ResponseType>(url, 'delete', data, headers)
  }
}
