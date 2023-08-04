import { IEvent } from './event'
import { IUser } from './user'
import { IAddress, ICloudAsset, TProfileStatus } from './utils'

export interface IBaseArtist {
  name: string
  genre: string
  bio: string
  address: IAddress
  fullAddress: string
  website?: string
  phone?: string
  influences?: string
  gallery?: [ICloudAsset]
}

export interface IArtist extends IBaseArtist {
  id: string
  user: IUser
  profileStatus: TProfileStatus
  events: [IEvent]
  revision?: IBaseArtist
}
