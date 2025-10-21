"use client"

import { useActionState, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { User, Mail, MapPin } from 'lucide-react'
import { registerUser, type RegisterResult } from '@/app/actions/register-actions'

const onlyDigits = (s: string) => s.replace(/\D/g, '')
const maskCPF = (v: string) => {
  const d = onlyDigits(v).slice(0, 11)
  if (d.length <= 3) return d
  if (d.length <= 6) return d.replace(/(\d{3})(\d{0,3})/, '$1.$2')
  if (d.length <= 9) return d.replace(/(\d{3})(\d{3})(\d{0,3})/, '$1.$2.$3')
  return d.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, '$1.$2.$3-$4')
}
const maskTelefone = (v: string) => {
  const d = onlyDigits(v).slice(0, 11)
  if (d.length <= 10) {
    return d
      .replace(/^(\d{0,2})/, '($1')
      .replace(/^(\(\d{2})(\d{0,4})/, '$1) $2')
      .replace(/(\d{4})(\d{1,4})$/, '$1-$2')
      .trim()
  }
  return d
    .replace(/^(\d{0,2})/, '($1')
    .replace(/^(\(\d{2})(\d{0,5})/, '$1) $2')
    .replace(/(\d{5})(\d{1,4})$/, '$1-$2')
    .trim()
}
const maskCEP = (v: string) => {
  const d = onlyDigits(v).slice(0, 8)
  if (d.length <= 5) return d
  return d.replace(/(\d{5})(\d{0,3})/, '$1-$2')
}

export default function CadastroPage() {
  const router = useRouter()
  const [state, formAction, isPending] = useActionState(async (_prev: RegisterResult | null, formData: FormData) => {
    const res = await registerUser(formData)
    return res
  }, null as RegisterResult | null)

  const ok = state?.ok === true

  // estados controlados com máscara
  const [cpf, setCpf] = useState('')
  const [telefone, setTelefone] = useState('')
  const [cep, setCep] = useState('')

  // Redirecionar para login com mensagem de sucesso
  useEffect(() => {
    if (ok) {
      const timer = setTimeout(() => {
        router.push('/login?success=account-created')
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [ok, router])

  return (
    <div className="min-h-screen bg-amber-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-amber-900 mb-2">🍕</h1>
          <h2 className="text-2xl font-bold text-amber-900">Criar Conta</h2>
          <p className="text-amber-700 mt-2">Junte-se à nossa pizzaria!</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <form action={formAction} className="space-y-6">
            {/* Dados Pessoais */}
            <div className="space-y-6">
              <div className="flex items-center space-x-2 mb-4">
                <User className="w-5 h-5 text-amber-600" />
                <h3 className="text-xl font-semibold text-amber-900">Dados Pessoais</h3>
              </div>

              <div>
                <label className="block text-sm font-medium text-amber-900 mb-2">Nome Completo *</label>
                <Input name="nome" type="text" required className="w-full bg-amber-50 border-amber-200 focus:border-amber-400 focus:ring-amber-400 rounded-xl" placeholder="Seu nome completo" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-amber-900 mb-2">CPF *</label>
                  <Input name="cpf" type="text" required placeholder="000.000.000-00" value={cpf} onChange={(e) => setCpf(maskCPF(e.target.value))} className="w-full bg-amber-50 border-amber-200 focus:border-amber-400 focus:ring-amber-400 rounded-xl" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-amber-900 mb-2">Telefone</label>
                  <Input name="telefone" type="tel" placeholder="(11) 99999-9999" value={telefone} onChange={(e) => setTelefone(maskTelefone(e.target.value))} className="w-full bg-amber-50 border-amber-200 focus:border-amber-400 focus:ring-amber-400 rounded-xl" />
                </div>
              </div>
            </div>

            {/* Dados de Acesso */}
            <div className="space-y-6">
              <div className="flex items-center space-x-2 mb-4">
                <Mail className="w-5 h-5 text-amber-600" />
                <h3 className="text-xl font-semibold text-amber-900">Dados de Acesso</h3>
              </div>
              <div>
                <label className="block text-sm font-medium text-amber-900 mb-2">E-mail *</label>
                <Input name="email" type="email" required className="w-full bg-amber-50 border-amber-200 focus:border-amber-400 focus:ring-amber-400 rounded-xl" placeholder="seu@email.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-amber-900 mb-2">Senha *</label>
                <div className="relative">
                  <Input name="senha" type="password" required minLength={6} className="w-full bg-amber-50 border-amber-200 focus:border-amber-400 focus:ring-amber-400 rounded-xl pr-12" placeholder="Mínimo 6 caracteres" />
                </div>
                <p className="text-xs text-amber-600 mt-1">Mínimo 6 caracteres</p>
              </div>
            </div>

            {/* Endereço de Entrega */}
            <div className="space-y-6">
              <div className="flex items-center space-x-2 mb-4">
                <MapPin className="w-5 h-5 text-amber-600" />
                <h3 className="text-xl font-semibold text-amber-900">Endereço de Entrega</h3>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-amber-900 mb-2">Rua *</label>
                  <Input name="rua" type="text" required className="w-full bg-amber-50 border-amber-200 focus:border-amber-400 focus:ring-amber-400 rounded-xl" placeholder="Nome da rua" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-amber-900 mb-2">Número *</label>
                  <Input name="numero" type="text" required className="w-full bg-amber-50 border-amber-200 focus:border-amber-400 focus:ring-amber-400 rounded-xl" placeholder="123" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-amber-900 mb-2">Complemento</label>
                <Input name="complemento" type="text" placeholder="Apto, bloco, etc" className="w-full bg-amber-50 border-amber-200 focus:border-amber-400 focus:ring-amber-400 rounded-xl" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-amber-900 mb-2">Bairro *</label>
                  <Input name="bairro" type="text" required className="w-full bg-amber-50 border-amber-200 focus:border-amber-400 focus:ring-amber-400 rounded-xl" placeholder="Nome do bairro" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-amber-900 mb-2">CEP *</label>
                  <Input name="cep" type="text" required placeholder="00000-000" value={cep} onChange={(e) => setCep(maskCEP(e.target.value))} className="w-full bg-amber-50 border-amber-200 focus:border-amber-400 focus:ring-amber-400 rounded-xl" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-amber-900 mb-2">Cidade *</label>
                  <Input name="cidade" type="text" required className="w-full bg-amber-50 border-amber-200 focus:border-amber-400 focus:ring-amber-400 rounded-xl" placeholder="Nome da cidade" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-amber-900 mb-2">Estado *</label>
                  <select name="estado" required className="w-full px-4 py-2 bg-amber-50 border border-amber-200 rounded-xl focus:border-amber-400 focus:ring-amber-400 text-amber-900">
                    <option value="">Selecione</option>
                    <option value="SP">São Paulo</option>
                    <option value="RJ">Rio de Janeiro</option>
                    <option value="MG">Minas Gerais</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Feedback Messages */}
            {state?.message && (
              <div className={`p-4 rounded-xl ${
                ok 
                  ? 'bg-green-100 border border-green-300 text-green-700' 
                  : 'bg-red-100 border border-red-300 text-red-700'
              }`}>
                <p className="font-medium">
                  {ok ? '✓ ' : '⚠ '}
                  {state.message}
                </p>
                {ok && (
                  <p className="text-sm mt-1">Redirecionando para o login...</p>
                )}
              </div>
            )}

            <div className="flex justify-between pt-6">
              <Link href="/" className="bg-amber-200 hover:bg-amber-300 text-amber-900 font-semibold py-3 px-6 rounded-xl inline-flex items-center">
                Já tem conta? Entrar
              </Link>
              <Button 
                type="submit" 
                disabled={isPending || ok} 
                className="bg-yellow-500 hover:bg-yellow-600 text-amber-900 font-bold py-3 px-6 rounded-xl disabled:opacity-50"
              >
                {isPending ? 'Criando...' : ok ? 'Conta criada! ✓' : 'Criar Conta'}
              </Button>
            </div>
          </form>
        </div>

        <div className="text-center mt-6">
          <Link href="/menu" className="text-amber-700 hover:text-amber-900 underline">← Voltar ao cardápio</Link>
        </div>
      </div>
    </div>
  )
}
