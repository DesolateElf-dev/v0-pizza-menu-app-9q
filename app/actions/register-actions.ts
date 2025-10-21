'use server'
import { prisma } from '@/lib/db'
import bcrypt from 'bcrypt'

export type RegisterResult =
  | { ok: true; userId: string }
  | { ok: false; field?: 'email' | 'password' | 'cpf'; message: string }

function onlyDigits(s: string) {
  return s.replace(/\D/g, '')
}

export async function registerUser(formData: FormData): Promise<RegisterResult> {
  try {
    const nome = (formData.get('nome') || '').toString().trim()
    const email = (formData.get('email') || '').toString().trim().toLowerCase()
    const senha = (formData.get('senha') || '').toString()
    const cpfRaw = (formData.get('cpf') || '').toString()
    const cpf = onlyDigits(cpfRaw)

    if (!nome || !email || !senha || !cpf) {
      return { ok: false, message: 'Preencha todos os campos' }
    }
    if (!/^[^@]+@[^@]+\.[^@]+$/.test(email)) {
      return { ok: false, field: 'email', message: 'E-mail inválido' }
    }
    if (senha.length < 6) {
      return { ok: false, field: 'password', message: 'Senha muito curta' }
    }
    if (cpf.length !== 11) {
      return { ok: false, field: 'cpf', message: 'CPF inválido' }
    }

    // Duplicidades (email e CPF, se houver unique)
    const [byEmail, byCpf] = await Promise.all([
      prisma.usuario.findUnique({ where: { email } }),
      prisma.usuario.findUnique({ where: { cpf } }).catch(() => null),
    ])
    if (byEmail) return { ok: false, field: 'email', message: 'E-mail já cadastrado' }
    if (byCpf) return { ok: false, field: 'cpf', message: 'CPF já cadastrado' }

    const senhaHash = await bcrypt.hash(senha, 10)

    const created = await prisma.usuario.create({
      data: {
        nome,
        email,
        senhaHash,
        cpf, // obrigatório no seu schema
      },
      select: { id: true },
    })

    return { ok: true, userId: created.id }
  } catch (e) {
    console.error('Erro ao cadastrar usuário:', e)
    return { ok: false, message: 'Erro ao cadastrar. Tente novamente.' }
  }
}
