'use server'

import { prisma } from '@/lib/db'
import bcrypt from 'bcrypt'
import { redirect } from 'next/navigation'

export async function cadastrarCliente(formData: FormData) {
  // Pegar os dados do formulário
  const nome = formData.get('nome') as string
  const cpf = formData.get('cpf') as string
  const email = formData.get('email') as string
  const senha = formData.get('senha') as string
  const telefone = formData.get('telefone') as string || null
  const rua = formData.get('rua') as string
  const numero = formData.get('numero') as string
  const complemento = formData.get('complemento') as string || null
  const bairro = formData.get('bairro') as string
  const cidade = formData.get('cidade') as string
  const estado = formData.get('estado') as string
  const cep = formData.get('cep') as string

  // Fazer hash da senha (segurança)
  const senhaHash = await bcrypt.hash(senha, 10)

  // Salvar no banco
  await prisma.usuario.create({
    data: {
      nome,
      cpf,
      email,
      senha: senhaHash,
      telefone,
      rua,
      numero,
      complemento,
      bairro,
      cidade,
      estado,
      cep,
    },
  })

  // Redirecionar para página de sucesso
  redirect('/cadastro/sucesso')
}
