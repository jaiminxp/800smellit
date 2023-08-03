import { z } from 'zod'
import { eventFormSchema, venueEventFormSchema } from '@/lib/schemas'
import { Venue } from './venue'

export enum EventOrganizerType {
  Musician = 'Musician',
  Artist = 'Artist',
}

export enum EventType {
  Music = 'Music',
  Art = 'Art',
}

export interface Event {
  _id: string
  organizerInfo: {
    organizer: string
    name: string
  }
  organizerType: EventOrganizerType
  name: string
  genre: string
  date: string
  venue: Venue
}

export type EventFormValues = z.infer<typeof eventFormSchema>
export type EventModalData = EventFormValues

export type VenueEventFormValues = z.infer<typeof venueEventFormSchema>
export type VenueEventModalData = VenueEventFormValues

export interface EventPayload extends Omit<EventFormValues, 'venue'> {
  organizerType?: EventOrganizerType
  organizerId?: string
  venue: string
}
