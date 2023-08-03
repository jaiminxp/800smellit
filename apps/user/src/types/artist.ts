import { artistFormSchema } from '@/lib/schemas'
import { Event } from './event'
import { User } from './user'
import { Address, CloudAsset } from './utils'
import { z } from 'zod'

export enum ArtistProfileStatus {
  Pending = 'pending',
  Approved = 'approved',
}

export interface BaseArtist {
  name: string
  genre: string
  bio: string
  website?: string
  phone?: string
  influences?: string
  address: Address
  fullAddress: string
  gallery?: CloudAsset[]
}

export interface Artist extends BaseArtist {
  _id: string
  user: string
  events: Event[]
  profileStatus: ArtistProfileStatus
  revision?: BaseArtist
}

export interface CreateArtistResponse {
  success: boolean
  user: User
}

export type ArtistFormValues = z.infer<typeof artistFormSchema>
