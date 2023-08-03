import { z } from 'zod'
import { Event } from './event'
import { User } from './user'
import { Address, CloudAsset } from './utils'
import { memberFormSchema, musicianFormSchema } from '@/lib/schemas'

export interface Member {
  _id?: string
  name: string
  role: string
  instrument: string
}

export enum MusicianProfileStatus {
  Pending = 'pending',
  Approved = 'approved',
}

export interface BaseMusician {
  name: string
  genre: string
  bio: string
  website?: string
  phone?: string
  influences?: string
  address: Address
  fullAddress: string
  band?: string
  logo?: CloudAsset
  gallery?: CloudAsset[]
  songs?: CloudAsset[]
  members?: Member[]
}

export interface Musician extends BaseMusician {
  _id: string
  user: string
  events: Event[]
  profileStatus: MusicianProfileStatus
  revision?: BaseMusician
}

export type MemberFormValues = z.infer<typeof memberFormSchema>

export interface CreateMusicianResponse {
  success: boolean
  user: User
}

export type MusicianFormValues = z.infer<typeof musicianFormSchema>
