export default function PerfilPage() {
  return (
    <div className="min-h-screen bg-amber-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-amber-900 mb-2">👤</h1>
          <h2 className="text-2xl font-bold text-amber-900">Meu Perfil</h2>
          <p className="text-amber-700 mt-2">Gerencie seus dados pessoais</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <p className="text-amber-900 text-center py-8">
            🚧 Página em desenvolvimento...
          </p>
          <p className="text-amber-700 text-center text-sm">
            Em breve você poderá editar seus dados aqui!
          </p>
        </div>

        <div className="text-center mt-6">
          <a href="/menu" className="text-amber-700 hover:text-amber-900 underline">
            ← Voltar ao cardápio
          </a>
        </div>
      </div>
    </div>
  )
}
