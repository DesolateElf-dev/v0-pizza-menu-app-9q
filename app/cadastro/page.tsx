"use client"

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Eye, EyeOff, User, Mail, Phone, MapPin } from 'lucide-react'
import { cadastrarCliente } from '@/app/actions/cadastro-actions'

export default function CadastroPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const totalSteps = 3

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true)
    try {
      await cadastrarCliente(formData)
    } catch (error) {
      console.error('Erro no cadastro:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-amber-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-amber-900 mb-2">🍕</h1>
          <h2 className="text-2xl font-bold text-amber-900">Criar Conta</h2>
          <p className="text-amber-700 mt-2">Junte-se à nossa pizzaria!</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div
                key={i + 1}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  i + 1 <= currentStep
                    ? 'bg-yellow-500 text-amber-900'
                    : 'bg-amber-200 text-amber-600'
                }`}
              >
                {i + 1}
              </div>
            ))}
          </div>
          <div className="w-full bg-amber-200 rounded-full h-2">
            <div
              className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <form action={handleSubmit} className="space-y-6">
            {/* Step 1: Dados pessoais */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="flex items-center space-x-2 mb-4">
                  <User className="w-5 h-5 text-amber-600" />
                  <h3 className="text-xl font-semibold text-amber-900">Dados Pessoais</h3>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-amber-900 mb-2">
                    Nome Completo *
                  </label>
                  <Input
                    name="nome"
                    type="text"
                    required
                    className="w-full bg-amber-50 border-amber-200 focus:border-amber-400 focus:ring-amber-400 rounded-xl"
                    placeholder="Seu nome completo"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-amber-900 mb-2">
                      CPF *
                    </label>
                    <Input
                      name="cpf"
                      type="text"
                      required
                      placeholder="000.000.000-00"
                      className="w-full bg-amber-50 border-amber-200 focus:border-amber-400 focus:ring-amber-400 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-amber-900 mb-2">
                      Telefone
                    </label>
                    <Input
                      name="telefone"
                      type="tel"
                      placeholder="(11) 99999-9999"
                      className="w-full bg-amber-50 border-amber-200 focus:border-amber-400 focus:ring-amber-400 rounded-xl"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Dados de acesso */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Mail className="w-5 h-5 text-amber-600" />
                  <h3 className="text-xl font-semibold text-amber-900">Dados de Acesso</h3>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-amber-900 mb-2">
                    E-mail *
                  </label>
                  <Input
                    name="email"
                    type="email"
                    required
                    className="w-full bg-amber-50 border-amber-200 focus:border-amber-400 focus:ring-amber-400 rounded-xl"
                    placeholder="seu@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-amber-900 mb-2">
                    Senha *
                  </label>
                  <div className="relative">
                    <Input
                      name="senha"
                      type={showPassword ? "text" : "password"}
                      required
                      minLength={6}
                      className="w-full bg-amber-50 border-amber-200 focus:border-amber-400 focus:ring-amber-400 rounded-xl pr-12"
                      placeholder="Mínimo 6 caracteres"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-amber-600 hover:text-amber-800"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-amber-600 mt-1">Mínimo 6 caracteres</p>
                </div>
              </div>
            )}

            {/* Step 3: Endereço */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="flex items-center space-x-2 mb-4">
                  <MapPin className="w-5 h-5 text-amber-600" />
                  <h3 className="text-xl font-semibold text-amber-900">Endereço de Entrega</h3>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-amber-900 mb-2">
                      Rua *
                    </label>
                    <Input
                      name="rua"
                      type="text"
                      required
                      className="w-full bg-amber-50 border-amber-200 focus:border-amber-400 focus:ring-amber-400 rounded-xl"
                      placeholder="Nome da rua"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-amber-900 mb-2">
                      Número *
                    </label>
                    <Input
                      name="numero"
                      type="text"
                      required
                      className="w-full bg-amber-50 border-amber-200 focus:border-amber-400 focus:ring-amber-400 rounded-xl"
                      placeholder="123"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-amber-900 mb-2">
                    Complemento
                  </label>
                  <Input
                    name="complemento"
                    type="text"
                    placeholder="Apto, bloco, etc"
                    className="w-full bg-amber-50 border-amber-200 focus:border-amber-400 focus:ring-amber-400 rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-amber-900 mb-2">
                      Bairro *
                    </label>
                    <Input
                      name="bairro"
                      type="text"
                      required
                      className="w-full bg-amber-50 border-amber-200 focus:border-amber-400 focus:ring-amber-400 rounded-xl"
                      placeholder="Nome do bairro"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-amber-900 mb-2">
                      CEP *
                    </label>
                    <Input
                      name="cep"
                      type="text"
                      required
                      placeholder="00000-000"
                      className="w-full bg-amber-50 border-amber-200 focus:border-amber-400 focus:ring-amber-400 rounded-xl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-amber-900 mb-2">
                      Cidade *
                    </label>
                    <Input
                      name="cidade"
                      type="text"
                      required
                      className="w-full bg-amber-50 border-amber-200 focus:border-amber-400 focus:ring-amber-400 rounded-xl"
                      placeholder="Nome da cidade"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-amber-900 mb-2">
                      Estado *
                    </label>
                    <select
                      name="estado"
                      required
                      className="w-full px-4 py-2 bg-amber-50 border border-amber-200 rounded-xl focus:border-amber-400 focus:ring-amber-400 text-amber-900"
                    >
                      <option value="">Selecione</option>
                      <option value="SP">São Paulo</option>
                      <option value="RJ">Rio de Janeiro</option>
                      <option value="MG">Minas Gerais</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
              {currentStep > 1 ? (
                <Button
                  type="button"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="bg-amber-200 hover:bg-amber-300 text-amber-900 font-semibold py-3 px-6 rounded-xl"
                >
                  Voltar
                </Button>
              ) : (
                <Link
                  href="/"
                  className="bg-amber-200 hover:bg-amber-300 text-amber-900 font-semibold py-3 px-6 rounded-xl inline-flex items-center"
                >
                  Já tem conta? Entrar
                </Link>
              )}

              {currentStep < totalSteps ? (
                <Button
                  type="button"
                  onClick={() => setCurrentStep(currentStep + 1)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-amber-900 font-bold py-3 px-6 rounded-xl"
                >
                  Próximo
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-yellow-500 hover:bg-yellow-600 text-amber-900 font-bold py-3 px-6 rounded-xl disabled:opacity-50"
                >
                  {isSubmitting ? "Criando..." : "Criar Conta"}
                </Button>
              )}
            </div>
          </form>
        </div>

        {/* Back to menu link */}
        <div className="text-center mt-6">
          <Link
            href="/menu"
            className="text-amber-700 hover:text-amber-900 underline"
          >
            ← Voltar ao cardápio
          </Link>
        </div>
      </div>
    </div>
  )
}