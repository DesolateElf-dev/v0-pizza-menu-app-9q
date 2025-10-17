import { prisma } from '@/lib/db'
import bcrypt from 'bcrypt'
import { redirect } from 'next/navigation'

export default function CadastroPage() {
  async function cadastrarCliente(formData: FormData) {
    'use server'
    
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

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Abrir Conta
        </h1>
        
        <form action={cadastrarCliente} className="space-y-6">
          {/* Dados pessoais */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Dados Pessoais</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome Completo *
              </label>
              <input
                name="nome"
                type="text"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CPF *
                </label>
                <input
                  name="cpf"
                  type="text"
                  required
                  placeholder="000.000.000-00"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telefone
                </label>
                <input
                  name="telefone"
                  type="tel"
                  placeholder="(11) 99999-9999"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Dados de acesso */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Dados de Acesso</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                E-mail *
              </label>
              <input
                name="email"
                type="email"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Senha *
              </label>
              <input
                name="senha"
                type="password"
                required
                minLength={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">Mínimo 6 caracteres</p>
            </div>
          </div>

          {/* Endereço */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Endereço de Entrega</h2>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rua *
                </label>
                <input
                  name="rua"
                  type="text"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Número *
                </label>
                <input
                  name="numero"
                  type="text"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Complemento
              </label>
              <input
                name="complemento"
                type="text"
                placeholder="Apto, bloco, etc"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bairro *
                </label>
                <input
                  name="bairro"
                  type="text"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CEP *
                </label>
                <input
                  name="cep"
                  type="text"
                  required
                  placeholder="00000-000"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cidade *
                </label>
                <input
                  name="cidade"
                  type="text"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estado *
                </label>
                <select
                  name="estado"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Selecione</option>
                  <option value="SP">São Paulo</option>
                  <option value="RJ">Rio de Janeiro</option>
                  <option value="MG">Minas Gerais</option>
                  {/* Adicione outros estados conforme necessário */}
                </select>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-semibold hover:bg-blue-700 transition-colors"
          >
            Criar Conta
          </button>
        </form>
      </div>
    </div>
  )
}
