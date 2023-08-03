import APIRequest from '@/lib/api-request'
import { User } from '@/types'

class UserService extends APIRequest {
  public async me() {
    return this.get<User>('/user')
  }
}

export const userService = new UserService()
