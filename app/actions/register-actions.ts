'use server'

import { prisma } from '@/lib/db'
import bcrypt from 'bcrypt'

export type RegisterResult =
  | { ok: true; userId: string }
  | { ok: false; field?: 'email' | 'password'; message: string }

export async function registerUser(formData: FormData): Promise<RegisterResult> {
  try {
    const nome = (formData.get('nome') || '').toString().trim()
    const email = (formData.get('email') || '').toString().trim().toLowerCase()
    const senha = (formData.get('senha') || '').toString()

    if (!nome || !email || !senha) {
      return { ok: false, message: 'Preencha todos os campos' }
    }

    if (!/^[^@]+@[^@]+\.[^@]+$/.test(email)) {
      return { ok: false, field: 'email', message: 'E-mail inválido' }
    }

    if (senha.length < 6) {
      return { ok: false, field: 'password', message: 'Senha muito curta' }
    }

    const existing = await prisma.usuario.findUnique({ where: { email } })
    if (existing) {
      return { ok: false, field: 'email', message: 'E-mail já cadastrado' }
    }

    const senhaHash = await bcrypt.hash(senha, 10)
    const created = await prisma.usuario.create({
      data: { nome, email, senhaHash },
      select: { id: true },
    })

    return { ok: true, userId: created.id }
  } catch (e) {
    console.error('Erro ao cadastrar usuário:', e)
    return { ok: false, message: 'Erro ao cadastrar. Tente novamente.' }
  }
}
