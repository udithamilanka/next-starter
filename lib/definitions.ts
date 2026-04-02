import { z } from 'zod'

export const LoginFormSchema = z.object({
  email: z.email({ error: 'Please enter a valid email address.' }).trim(),
  password: z.string().min(1, { error: 'Password is required.' }),
})

export type LoginFormState =
  | {
      errors?: {
        email?: string[]
        password?: string[]
      }
      message?: string
    }
  | undefined

export type User = {
  id: string
  email: string
  name: string
  isActive: boolean
  clientId: string | null
}

export type Session = {
  user: User
  accessToken: string
  refreshToken: string
  expiresAt: number
}
