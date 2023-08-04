import { ICurrentUser } from './user'

export interface ILoginPayload {
  email: string
  password: string
}

export interface ILoginResponse {
  expiresIn: number
  success: boolean
  token: string
  user: ICurrentUser
}
