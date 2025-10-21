'use server'

import { getSession } from '@/lib/auth'

export async function getCurrentSession() {
  return await getSession()
}
