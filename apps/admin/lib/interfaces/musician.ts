import { IEvent } from './event'
import { IUser } from './user'
import { IAddress, ICloudAsset, TProfileStatus } from './utils'

export interface IBaseMusician {
  name: string
  genre: string
  bio: string
  address: IAddress
  fullAddress: string
  website?: string
  phone?: string
  influences?: string
  band?: string
  logo?: ICloudAsset
  gallery?: [ICloudAsset]
  songs?: [ICloudAsset]
  members?: [
    {
      _id: string
      name: string
      role: string
      instrument: string
    }
  ]
}

export interface IMusician extends IBaseMusician {
  id: string
  user: IUser
  profileStatus: TProfileStatus
  events: [IEvent]
  revision?: IBaseMusician
}
