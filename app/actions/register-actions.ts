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
    const senhaPlain = (formData.get('senha') || '').toString()
    const cpfRaw = (formData.get('cpf') || '').toString()
    const cpf = onlyDigits(cpfRaw)

    // Endereço (opcionais no schema)
    const telefone = (formData.get('telefone') || '').toString().trim() || null
    const rua = (formData.get('rua') || '').toString().trim() || null
    const numero = (formData.get('numero') || '').toString().trim() || null
    const complemento = (formData.get('complemento') || '').toString().trim() || null
    const bairro = (formData.get('bairro') || '').toString().trim() || null
    const cidade = (formData.get('cidade') || '').toString().trim() || null
    const estado = (formData.get('estado') || '').toString().trim() || null
    const cep = onlyDigits((formData.get('cep') || '').toString()) || null

    // Regras mínimas
    if (!nome || !email || !senhaPlain || !cpf) {
      return { ok: false, message: 'Preencha todos os campos obrigatórios' }
    }
    if (!/^[^@]+@[^@]+\.[^@]+$/.test(email)) {
      return { ok: false, field: 'email', message: 'E-mail inválido' }
    }
    if (senhaPlain.length < 6) {
      return { ok: false, field: 'password', message: 'Senha muito curta' }
    }
    if (cpf.length !== 11) {
      return { ok: false, field: 'cpf', message: 'CPF inválido' }
    }

    // Duplicidades (email é opcional no schema, mas se fornecido é unique)
    const [byEmail, byCpf] = await Promise.all([
      prisma.usuario.findUnique({ where: { email } }).catch(() => null),
      prisma.usuario.findUnique({ where: { cpf } }).catch(() => null),
    ])
    if (byEmail) return { ok: false, field: 'email', message: 'E-mail já cadastrado' }
    if (byCpf) return { ok: false, field: 'cpf', message: 'CPF já cadastrado' }

    // Hash e criação (salvar em "senha", conforme schema)
    const senhaHash = await bcrypt.hash(senhaPlain, 10)

    const created = await prisma.usuario.create({
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
      select: { id: true },
    })

    return { ok: true, userId: created.id }
  } catch (e) {
    console.error('Erro ao cadastrar usuário:', e)
    return { ok: false, message: 'Erro ao cadastrar. Tente novamente.' }
  }
}
