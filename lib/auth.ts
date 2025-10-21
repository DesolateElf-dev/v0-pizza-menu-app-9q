import 'server-only'
import { cookies } from 'next/headers'

const SESSION_COOKIE_NAME = 'pizzaria-session'

export interface UserSession {
  id: string
  nome: string
  email: string
}

export async function createSession(usuario: UserSession) {
  const cookieStore = cookies()
  cookieStore.set(SESSION_COOKIE_NAME, JSON.stringify(usuario), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  })
  return true
}

export async function getSession(): Promise<UserSession | null> {
  const cookieStore = cookies()
  const c = cookieStore.get(SESSION_COOKIE_NAME)
  if (!c?.value) return null
  return JSON.parse(c.value) as UserSession
}

export async function destroySession() {
  const cookieStore = cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)
  return true
}

export async function isAuthenticated(): Promise<boolean> {
  return (await getSession()) !== null
}
