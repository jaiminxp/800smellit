import { z } from 'zod'
import { Address, CloudAsset, Geometry } from './utils'
import { strayVenueFormSchema, venueFormSchema } from '@/lib/schemas'
import { LngLatLike } from 'mapbox-gl'
import { Event } from './event'

export interface BaseVenue {
  _id: string
  name: string
  address: Address
  fullAddress: string
  geometry: Geometry
  events: Event[]
}

export type StrayVenue = BaseVenue

export interface Venue extends BaseVenue {
  user: string
  phone: string
  email: string
  contact: {
    name: string
    phone: string
    email: string
  }
  website: string
  theme: string
  details: string
  gallery: CloudAsset[]
}

export type VenueFormValues = z.infer<typeof venueFormSchema>

export type StrayVenueFormValues = z.infer<typeof strayVenueFormSchema>

export interface StrayVenuePayload extends StrayVenueFormValues {
  coordinates: LngLatLike
}
