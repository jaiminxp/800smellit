/* eslint-disable @typescript-eslint/no-explicit-any */
import { TOKEN } from '@/constants/auth'

const BASE_URL = import.meta.env.VITE_API_URL

export default abstract class APIRequest {
  protected token: string | null = null

  setAuthHeaderToken(token: string) {
    this.token = token
  }

  private async parseResponse(res: Response) {
    if (res.headers.get('content-type')?.includes('application/json')) {
      return await res.json()
    } else if (res.headers.get('content-type')?.includes('text/html')) {
      return (await res.text()) as ResponseType
    } else {
      throw new Error('Cannot parse response')
    }
  }

  private async checkStatus(response: Response) {
    if (response.status >= 200 && response.status < 300) {
      return response
    }

    throw await this.parseResponse(response)
  }

  async request<ResponseType>(
    url: string,
    method?: string,
    body?: any,
    headers?: { [key: string]: string }
  ): Promise<ResponseType> {
    const verb = (method || 'get').toUpperCase()
    const requestHeaders: any = Object.assign(
      {
        'Content-Type': 'application/json',
        Authorization: this.token || localStorage.getItem(TOKEN) || '',
      },
      headers || {}
    )

    if (body) {
      // omit stringifying FormData that might contain files
      if (!(body instanceof FormData)) {
        body = JSON.stringify(body)
      } else {
        // let browser add Content-Type header
        delete requestHeaders['Content-Type']
      }
    }

    const res = await fetch(`${BASE_URL}${url}`, {
      method: verb,
      headers: requestHeaders,
      body: body || null,
    })

    await this.checkStatus(res)
    return this.parseResponse(res)
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
