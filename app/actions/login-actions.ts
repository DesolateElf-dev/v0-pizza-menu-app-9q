'use server'

import { prisma } from '@/lib/db'
import bcrypt from 'bcrypt'
import { redirect } from 'next/navigation'

export async function authenticateUser(formData: FormData) {
  try {
    const email = formData.get('email') as string
    const senha = formData.get('senha') as string

    // Validação básica
    if (!email || !senha) {
      throw new Error('Email e senha são obrigatórios')
    }

    console.log('Tentativa de login para:', email)

    // Buscar usuário no banco
    const usuario = await prisma.usuario.findUnique({
      where: { email: email.toLowerCase().trim() }
    })

    if (!usuario) {
      console.log('Usuário não encontrado:', email)
      throw new Error('Email ou senha incorretos')
    }

    console.log('Usuário encontrado, verificando senha...')

    // Verificar senha
    const senhaValida = await bcrypt.compare(senha, usuario.senha)
    
    if (!senhaValida) {
      console.log('Senha incorreta para:', email)
      throw new Error('Email ou senha incorretos')
    }

    console.log('Login bem-sucedido para:', email)

    // Login bem-sucedido - redireciona para o menu
    redirect('/menu')
  } catch (error) {
    console.error('Erro na autenticação:', error)
    
    // Re-throw do erro para o componente tratar
    throw error
  }
}
