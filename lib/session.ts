import { cookies } from 'next/headers'
import type { Session, User } from '@/lib/definitions'

const ACCESS_TOKEN_COOKIE = 'access_token'
const REFRESH_TOKEN_COOKIE = 'refresh_token'
const USER_COOKIE = 'user_info'

export async function createSession(session: Session) {
  const cookieStore = await cookies()
  const expiresAt = new Date(session.expiresAt)

  cookieStore.set(ACCESS_TOKEN_COOKIE, session.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  })

  // Refresh token lives longer — use its own expiry (parsed from the JWT exp claim)
  cookieStore.set(REFRESH_TOKEN_COOKIE, session.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    // 7 days fallback; the real expiry is embedded in the JWT
    maxAge: 60 * 60 * 24 * 7,
    sameSite: 'lax',
    path: '/',
  })

  cookieStore.set(USER_COOKIE, JSON.stringify(session.user), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7,
    sameSite: 'lax',
    path: '/',
  })
}

export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value
  const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE)?.value
  const userRaw = cookieStore.get(USER_COOKIE)?.value

  if (!accessToken || !refreshToken || !userRaw) return null

  try {
    const user: User = JSON.parse(userRaw)
    return { user, accessToken, refreshToken, expiresAt: 0 }
  } catch {
    return null
  }
}

export async function deleteSession() {
  const cookieStore = await cookies()
  cookieStore.delete(ACCESS_TOKEN_COOKIE)
  cookieStore.delete(REFRESH_TOKEN_COOKIE)
  cookieStore.delete(USER_COOKIE)
}
