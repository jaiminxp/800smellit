import { z } from 'zod'
import { User } from './user'
import { authFormSchema } from '@/lib/schemas'

export type AuthFormValues = z.infer<typeof authFormSchema>

export interface AuthResponse {
  success: boolean
  user: User
  token: string
  expiresIn: number
}

export enum AuthActionType {
  Set = 'set',
  Delete = 'delete',
}
