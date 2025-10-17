import { cadastrarCliente } from "@/app/actions/cadastro-actions"
import { Header } from "@/components/header"

export default function CadastroPage() {
  return (
    <div className="min-h-screen bg-amber-50">
      <Header />

      <div className="px-4 py-6">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-md p-6">
          <h1 className="text-3xl font-bold text-amber-900 mb-6">Abrir Conta</h1>
          {/* @ts-expect-error Server Action */}
          <form action={cadastrarCliente} className="space-y-6">
            {/* Dados pessoais */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-amber-800">Dados Pessoais</h2>

              <div>
                <label className="block text-sm font-medium text-amber-900 mb-1">Nome Completo *</label>
                <input
                  name="nome"
                  type="text"
                  required
                  className="w-full px-4 py-2 border border-amber-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-50"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-amber-900 mb-1">CPF *</label>
                  <input
                    name="cpf"
                    type="text"
                    required
                    placeholder="000.000.000-00"
                    className="w-full px-4 py-2 border border-amber-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-amber-900 mb-1">Telefone</label>
                  <input
                    name="telefone"
                    type="tel"
                    placeholder="(11) 99999-9999"
                    className="w-full px-4 py-2 border border-amber-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-50"
                  />
                </div>
              </div>
            </div>

            {/* Dados de acesso */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-amber-800">Dados de Acesso</h2>

              <div>
                <label className="block text-sm font-medium text-amber-900 mb-1">E-mail *</label>
                <input
                  name="email"
                  type="email"
                  required
                  className="w-full px-4 py-2 border border-amber-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-amber-900 mb-1">Senha *</label>
                <input
                  name="senha"
                  type="password"
                  required
                  minLength={6}
                  className="w-full px-4 py-2 border border-amber-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-50"
                />
                <p className="text-xs text-amber-600 mt-1">Mínimo 6 caracteres</p>
              </div>
            </div>

            {/* Endereço */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-amber-800">Endereço de Entrega</h2>

              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-amber-900 mb-1">Rua *</label>
                  <input
                    name="rua"
                    type="text"
                    required
                    className="w-full px-4 py-2 border border-amber-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-amber-900 mb-1">Número *</label>
                  <input
                    name="numero"
                    type="text"
                    required
                    className="w-full px-4 py-2 border border-amber-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-amber-900 mb-1">Complemento</label>
                <input
                  name="complemento"
                  type="text"
                  placeholder="Apto, bloco, etc"
                  className="w-full px-4 py-2 border border-amber-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-50"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-amber-900 mb-1">Bairro *</label>
                  <input
                    name="bairro"
                    type="text"
                    required
                    className="w-full px-4 py-2 border border-amber-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-amber-900 mb-1">CEP *</label>
                  <input
                    name="cep"
                    type="text"
                    required
                    placeholder="00000-000"
                    className="w-full px-4 py-2 border border-amber-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-amber-900 mb-1">Cidade *</label>
                  <input
                    name="cidade"
                    type="text"
                    required
                    className="w-full px-4 py-2 border border-amber-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-amber-900 mb-1">Estado *</label>
                  <select
                    name="estado"
                    required
                    className="w-full px-4 py-2 border border-amber-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-50"
                  >
                    <option value="">Selecione</option>
                    <option value="SP">São Paulo</option>
                    <option value="RJ">Rio de Janeiro</option>
                    <option value="MG">Minas Gerais</option>
                  </select>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-4 rounded-2xl transition-colors"
            >
              Criar Conta
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
