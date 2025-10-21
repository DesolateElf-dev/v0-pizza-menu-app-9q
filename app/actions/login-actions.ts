'use server'

import { prisma } from '@/lib/db'
import bcrypt from 'bcrypt'
import { redirect } from 'next/navigation'
import { createSession } from '@/lib/auth'

export async function authenticateUser(formData: FormData) {
  try {
    const emailRaw = formData.get('email')
    const senhaRaw = formData.get('senha')

    const email = typeof emailRaw === 'string' ? emailRaw.toLowerCase().trim() : ''
    const senha = typeof senhaRaw === 'string' ? senhaRaw : ''

    if (!email || !senha) {
      throw new Error('Email e senha são obrigatórios')
    }

    const usuario = await prisma.usuario.findUnique({
      where: { email },
    })

    if (!usuario || !usuario.senha) {
      throw new Error('Email ou senha incorretos')
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha)
    if (!senhaValida) {
      throw new Error('Email ou senha incorretos')
    }

    const ok = await createSession({
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email || email,
    })
    if (!ok) {
      throw new Error('Não foi possível criar a sessão')
    }

    redirect('/menu')
  } catch (error) {
    console.error('Erro na autenticação:', error)
    throw error
  }
}
