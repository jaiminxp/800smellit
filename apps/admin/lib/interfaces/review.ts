import { IAddress, ICloudAsset } from './utils'
import { IBaseArtist } from './artist'
import { IBaseMusician } from './musician'

export interface IPendingStatisticsResponse {
  musicians: number
  artists: number
}

interface IPendingMusician {
  id: string
  name: string
  genre: string
  address: IAddress
  fullAddress: string
  band?: string
  logo?: ICloudAsset
  revision: IBaseMusician
}

interface IPendingArtist {
  id: string
  name: string
  genre: string
  address: IAddress
  fullAddress: string
  revision: IBaseArtist
}

export type IPendingMusiciansResponse = [IPendingMusician]

export type IPendingArtistsResponse = [IPendingArtist]

export type TStatusAction = 'approve' | 'reject'
