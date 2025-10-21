"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff } from "lucide-react"
import { authenticateUser } from "@/app/actions/login-actions"

export default function LoginPage() {
  const searchParams = useSearchParams()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({ email: "", senha: "" })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Mostrar mensagem de sucesso se veio do cadastro
  useEffect(() => {
    if (searchParams.get('success') === 'account-created') {
      setSuccessMessage('Conta criada com sucesso! Faça login para continuar.')
      // Remover mensagem após 5s
      const timer = setTimeout(() => setSuccessMessage(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const fd = new FormData()
      fd.set('email', formData.email)
      fd.set('senha', formData.senha)
      await authenticateUser(fd)
    } catch (err: any) {
      setError(err?.message || 'Falha ao autenticar')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <div className="min-h-screen bg-amber-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-amber-900 mb-2">🍕</h1>
          <h2 className="text-2xl font-bold text-amber-900">Bem-vindo de volta!</h2>
          <p className="text-amber-700 mt-2">Entre na sua conta para fazer pedidos</p>
        </div>

        {/* Success message from cadastro */}
        {successMessage && (
          <div className="bg-green-100 border border-green-300 text-green-700 p-4 rounded-xl">
            <p className="font-medium">✓ {successMessage}</p>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-amber-900 mb-2">E-mail</label>
              <Input
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="w-full bg-amber-50 border-amber-200 focus:border-amber-400 focus:ring-amber-400 rounded-xl"
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-amber-900 mb-2">Senha</label>
              <div className="relative">
                <Input
                  name="senha"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.senha}
                  onChange={handleInputChange}
                  className="w-full bg-amber-50 border-amber-200 focus:border-amber-400 focus:ring-amber-400 rounded-xl pr-12"
                  placeholder="Digite sua senha"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-amber-600 hover:text-amber-800"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && <div className="text-red-600 text-sm">{error}</div>}

            <Button type="submit" disabled={loading} className="w-full bg-yellow-500 hover:bg-yellow-600 text-amber-900 font-bold py-4 rounded-xl text-lg">
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>

          <div className="mt-6 flex items-center justify-center">
            <div className="border-t border-amber-200 flex-1"></div>
            <span className="px-4 text-sm text-amber-600">ou</span>
            <div className="border-t border-amber-200 flex-1"></div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-amber-700">
              Não tem uma conta?{" "}
              <Link href="/cadastro" className="font-semibold text-amber-900 hover:text-yellow-600 underline">
                Criar conta
              </Link>
            </p>
          </div>
        </div>

        <div className="text-center">
          <Link href="/menu" className="text-amber-700 hover:text-amber-900 underline">← Voltar ao cardápio</Link>
        </div>
      </div>
    </div>
  )
}
