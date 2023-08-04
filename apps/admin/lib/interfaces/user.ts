import { TProfileStatus } from './utils'

export interface IMeResponse {
  expiresIn: number
  success: boolean
  token: string
  user: ICurrentUser
}

export type ISearchUsersResponse = [IUser]

export interface IUser {
  email: string
  _id: string
  roles: [string]
  isEmailVerified: boolean
}

export interface ICurrentUser {
  email: string
  id: string
  roles: [string]
}

interface IUserProfile {
  _id: string
  name: string
  profileStatus: TProfileStatus
}

export type IGetUserByIdResponse = {
  user: {
    _id: string
    email: string
    isEmailVerified: boolean
  }
  profiles: {
    musician: IUserProfile | null
    artist: IUserProfile | null
  }
}
