'use server'

import { prisma } from '@/lib/db'
import bcrypt from 'bcrypt'
import { redirect } from 'next/navigation'

export async function authenticateUser(formData: FormData) {
  const email = formData.get('email') as string
  const senha = formData.get('senha') as string

  try {
    // Buscar usuário no banco
    const usuario = await prisma.usuario.findUnique({
      where: { email }
    })

    if (!usuario) {
      throw new Error('Usuário não encontrado')
    }

    // Verificar senha
    const senhaValida = await bcrypt.compare(senha, usuario.senha)
    
    if (!senhaValida) {
      throw new Error('Senha incorreta')
    }

    // Login bem-sucedido - aqui você implementaria a sessão
    // Por agora, apenas redireciona para o menu
    redirect('/menu')
  } catch (error) {
    // Em uma implementação real, você trataria os erros adequadamente
    console.error('Erro na autenticação:', error)
    throw error
  }
}