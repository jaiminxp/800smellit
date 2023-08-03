import { z } from 'zod'
import { Address } from './utils'
import { serviceFormSchema } from '@/lib/schemas'

export enum ServiceDomain {
  Music = 'music',
  Art = 'art',
}

export interface Service {
  _id: string
  user: string
  name: string
  expert: string
  domain: ServiceDomain
  contact: string
  website?: string
  address: Address
  fullAddress: string
}

export type ServiceFormValues = z.infer<typeof serviceFormSchema>
