import { z } from 'zod'
import { Address } from './utils'
import { componentProductSchema, productFormSchema } from '@/lib/schemas'

export enum ProductType {
  Music = 'music',
  Art = 'art',
}

export enum ProductCategory {
  Instrument = 'instrument',
  Component = 'component',
}

export interface BaseProduct {
  _id: string
  user: string
  type: ProductType
  contact: string
  seller: string
  address: Address
  instrument: string
  fullAddress: string
}

export interface InstrumentProduct extends BaseProduct {
  category: ProductCategory.Instrument
}

export interface ComponentProduct extends BaseProduct {
  category: ProductCategory.Component
  component: string
}

export type Product = InstrumentProduct | ComponentProduct

export type ProductFormValues = z.infer<typeof productFormSchema>
export type ComponentProductFormValues = z.infer<typeof componentProductSchema>
