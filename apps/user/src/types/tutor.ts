import { z } from 'zod'
import { Address } from './utils'
import { tutorFormSchema } from '@/lib/schemas'

export enum TutorSubject {
  Music = 'music',
  Art = 'art',
}

export enum TutorAvalibility {
  'In Person' = 'in-person',
  Online = 'online',
}

export interface Tutor {
  user: string
  name: string
  subject: TutorSubject
  availability: TutorAvalibility
  instrument: string
  contact: string
  address: Address
  fullAddress: string
}

export type TutorFormValues = z.infer<typeof tutorFormSchema>
