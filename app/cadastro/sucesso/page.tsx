import Link from 'next/link'
import { CheckCircle, Pizza, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function SucessoPage() {
  return (
    <div className="min-h-screen bg-amber-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 text-center">
        {/* Success Animation */}
        <div className="relative">
          <div className="absolute inset-0 bg-yellow-500 rounded-full w-32 h-32 mx-auto animate-ping opacity-20"></div>
          <div className="relative bg-white rounded-full w-32 h-32 mx-auto flex items-center justify-center shadow-lg">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
        </div>
        
        {/* Success Message */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-amber-900">
            Conta criada com sucesso!
          </h1>
          
          <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
            <div className="flex items-center justify-center space-x-2">
              <Pizza className="w-8 h-8 text-amber-600" />
              <span className="text-xl font-semibold text-amber-900">Bem-vindo à nossa pizzaria!</span>
            </div>
            
            <p className="text-amber-700">
              Seu cadastro foi realizado com sucesso. Agora você pode fazer pedidos e acompanhar suas entregas!
            </p>
            
            <div className="bg-amber-50 rounded-xl p-4">
              <h3 className="font-semibold text-amber-900 mb-2">Próximos passos:</h3>
              <ul className="text-sm text-amber-700 space-y-1">
                <li>✅ Explore nosso cardápio completo</li>
                <li>✅ Adicione suas pizzas favoritas ao carrinho</li>
                <li>✅ Finalize seu primeiro pedido</li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="space-y-4">
          <Link href="/" className="block">
            <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-amber-900 font-bold py-4 rounded-xl text-lg group">
              Explorar Cardápio
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          
          <Link 
            href="/login" 
            className="block text-amber-700 hover:text-amber-900 underline font-medium"
          >
            Fazer Login
          </Link>
        </div>
        
        {/* Decorative Elements */}
        <div className="flex justify-center space-x-4 opacity-60">
          <span className="text-2xl">🍕</span>
          <span className="text-2xl">🧀</span>
          <span className="text-2xl">🍅</span>
        </div>
      </div>
    </div>
  )
}