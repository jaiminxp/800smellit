import { APIRequest } from '@/lib/api-request'
import {
  ISearchUsersResponse,
  IMeResponse,
  IGetUserByIdResponse,
} from '@/lib/interfaces'

export class UserService extends APIRequest {
  public async me() {
    return await this.get<IMeResponse>('user')
  }

  public async search(query?: string) {
    let url = 'admin/users'

    if (query) {
      url += '?' + query
    }

    return await this.get<ISearchUsersResponse>(url)
  }

  public async getById(id: string) {
    return this.get<IGetUserByIdResponse>(`admin/users/${id}`)
  }
}

export const userService = new UserService()
