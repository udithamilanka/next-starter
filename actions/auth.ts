'use server'

import { redirect } from 'next/navigation'
import { LoginFormSchema, type LoginFormState } from '@/lib/definitions'
import { createSession, deleteSession } from '@/lib/session'

export async function login(
  state: LoginFormState,
  formData: FormData
): Promise<LoginFormState> {
  const validatedFields = LoginFormSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { email, password } = validatedFields.data

  let response: Response
  try {
    response = await fetch(`${process.env.API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
  } catch {
    return { message: 'Unable to reach the server. Please try again.' }
  }

  if (!response.ok) {
    if (response.status === 401) {
      return { message: 'Invalid email or password.' }
    }
    return { message: 'Something went wrong. Please try again.' }
  }

  const data = await response.json()

  await createSession({
    user: data.user,
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
    expiresAt: Date.now() + data.expiresIn * 1000,
  })

  redirect('/')
}

export async function logout() {
  await deleteSession()
  redirect('/login')
}
