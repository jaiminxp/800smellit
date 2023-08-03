import { feedbackFormSchema } from '@/lib/schemas'
import { z } from 'zod'

export interface Address {
  address: string
  state: string
  city: string
}

export interface DelayedEvent {
  event: string
  delay: number
  callback: (...args: number[]) => void
  args?: { x: number; y: number }
}

// special omit for unions
export type UnionOmit<T, K extends string | number | symbol> = T extends unknown
  ? Omit<T, K>
  : never

export interface Geometry {
  type: 'Point'
  coordinates: [number, number]
}

export interface CloudAsset {
  _id: string
  url: string
  filepath?: string
}

export type FeedBackFormValues = z.infer<typeof feedbackFormSchema>

export interface FeedBackResponse {
  message: string
}

export interface Suggestion {
  _id: string
  name: string
}

export interface StrayArtist {
  _id: string
  name: string
}

export interface ElevatorButtonProps {
  title: string
  to?: string
  styles?: string
  onClick?: () => void
}
