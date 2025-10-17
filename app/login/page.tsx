"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import Link from "next/link"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()

    // Mock login - in a real app, this would validate against a backend
    if (email && senha) {
      // Store user data (in a real app, this would come from the backend)
      localStorage.setItem("userName", email.split("@")[0])
      localStorage.setItem("userEmail", email)

      // Redirect to menu/cardapio
      router.push("/cardapio")
    }
  }

  return (
    <div className="min-h-screen bg-amber-50">
      <Header />

      <div className="px-4 py-12">
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-md p-8">
          <h1 className="text-3xl font-bold text-amber-900 mb-2">Bem-vindo!</h1>
          <p className="text-amber-700 mb-6">Entre com sua conta para fazer pedidos</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-amber-900 mb-1">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-amber-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-50"
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-amber-900 mb-1">Senha</label>
              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-2 border border-amber-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-50"
                placeholder="••••••"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-4 rounded-2xl transition-colors"
            >
              Entrar
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-amber-700 text-sm">
              Não tem uma conta?{" "}
              <Link href="/" className="text-amber-900 font-semibold hover:underline">
                Criar conta
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
