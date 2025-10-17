import Link from 'next/link'

export default function SucessoPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <div className="mb-4">
          <svg
            className="mx-auto h-16 w-16 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Conta criada com sucesso!
        </h1>
        
        <p className="text-gray-600 mb-6">
          Seu cadastro foi realizado. Agora você já pode fazer pedidos na nossa pizzaria!
        </p>
        
        <Link
          href="/"
          className="inline-block bg-blue-600 text-white py-2 px-6 rounded-md font-semibold hover:bg-blue-700 transition-colors"
        >
          Voltar para o cardápio
        </Link>
      </div>
    </div>
  )
}
