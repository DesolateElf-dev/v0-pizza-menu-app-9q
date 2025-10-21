"use client"

import { useState, useMemo, useEffect } from "react"
import { Search } from "lucide-react"
import { Header } from "@/components/header"
import { PizzaCard } from "@/components/pizza-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCart } from "@/context/cart-context"
import Link from "next/link"
// COMENTAR TEMPORARIAMENTE:
import { getPizzas } from "@/app/actions/pizza-actions"

// Tipo para Pizza do banco (após conversão)
type PizzaDB = {
  id: string
  sabor: string
  descricao: string | null
  precoBase: number  // ← Agora é number, não Decimal
  imagem: string | null
  criadoEm: Date
}

export default function MenuPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const { total, items } = useCart()

// Carregar pizzas do banco de dados
useEffect(() => {
  async function loadPizzas() {
    try {
      setLoading(true)
      setError("")
      
      // CARREGAR PIZZAS REAIS DO BANCO
      const pizzasDB = await getPizzas()
      
      if (pizzasDB.length === 0) {
        setError("Nenhuma pizza encontrada no cardápio. Adicione pizzas pelo Prisma Studio.")
        return
      }
      
      console.log('Pizzas do banco:', pizzasDB)
      
      // Converter para o formato esperado pelo componente
      const productsConverted: Product[] = pizzasDB.map((pizza: PizzaDB) => ({
        id: pizza.id,          // ID real do banco (cuid)
        nome: pizza.sabor,     // Campo 'sabor' da tabela
        descricao: pizza.descricao || 'Deliciosa pizza artesanal',
        precoMedia: pizza.precoBase,    // Já é number agora
        precoGrande: pizza.precoBase,   // Mesmo preço
        imagem: pizza.imagem 
          ? `/images/pizzas/${pizza.imagem}` 
          : '/images/pizzas/default.jpg',
        categoria: 'PIZZAS'
      }))

      
      setProducts(productsConverted)
      console.log(`✅ ${productsConverted.length} pizzas carregadas do banco`)
      
    } catch (error) {
      console.error('❌ Erro ao carregar produtos:', error)
      setError("Erro ao carregar o cardápio. Verifique a conexão com o banco.")
    } finally {
      setLoading(false)
    }
  }

  loadPizzas()
}, [])


  // Resto do código permanece igual...
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products
    
    return products.filter((product) => {
      const searchTerm = searchQuery.toLowerCase()
      return (
        product.nome.toLowerCase().includes(searchTerm) ||
        product.descricao.toLowerCase().includes(searchTerm)
      )
    })
  }, [products, searchQuery])

  // Estados de loading e error permanecem iguais...
  if (loading) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-6xl animate-bounce">🍕</div>
          <div className="text-amber-900 font-semibold text-lg">Carregando cardápio...</div>
          <div className="text-amber-700">Preparando as melhores pizzas para você</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-amber-50">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-center space-y-4 max-w-md mx-auto px-4">
            <div className="text-4xl">😞</div>
            <h2 className="text-xl font-bold text-amber-900">Ops! Algo deu errado</h2>
            <p className="text-amber-700">{error}</p>
            <Button 
              onClick={() => window.location.reload()} 
              className="bg-yellow-500 hover:bg-yellow-600 text-amber-900 font-semibold"
            >
              Tentar novamente
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-amber-50">
      <Header />

      <div className="px-4 py-4 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-600 w-5 h-5" />
          <Input
            type="text"
            placeholder="Buscar pizza por sabor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-amber-200 border-none rounded-2xl text-amber-800 placeholder:text-amber-600 focus:bg-amber-100"
          />
        </div>

        {/* Header */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-amber-900">Nosso Cardápio</h2>
          <p className="text-amber-700">
            {products.length} {products.length === 1 ? 'sabor disponível' : 'sabores disponíveis'}
          </p>
          {searchQuery && (
            <p className="text-amber-600 text-sm">
              {filteredProducts.length} resultado(s) para "{searchQuery}"
            </p>
          )}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 gap-4 pb-24">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <PizzaCard key={product.id} product={product} />
            ))
          ) : (
            <div className="col-span-2 text-center py-12 space-y-4">
              <div className="text-4xl">🔍</div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-amber-900">
                  {searchQuery ? 'Nenhuma pizza encontrada' : 'Nenhuma pizza disponível'}
                </h3>
                <p className="text-amber-700">
                  {searchQuery 
                    ? `Não encontramos pizzas com "${searchQuery}"`
                    : 'O cardápio está sendo atualizado'
                  }
                </p>
              </div>
              {searchQuery && (
                <Button 
                  onClick={() => setSearchQuery('')}
                  className="bg-amber-200 hover:bg-amber-300 text-amber-900 font-semibold"
                >
                  Ver todas as pizzas
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Empty cart message */}
        {products.length > 0 && items.length === 0 && (
          <div className="fixed bottom-20 left-4 right-4 bg-amber-100 border border-amber-300 rounded-xl p-3">
            <div className="text-center text-amber-800">
              <span className="text-sm">👆 Escolha suas pizzas favoritas e adicione ao carrinho</span>
            </div>
          </div>
        )}
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-amber-50 border-t border-amber-200">
        <Link href="/carrinho">
          <Button 
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-amber-900 font-bold py-4 rounded-2xl text-lg shadow-lg transition-all duration-200 hover:shadow-xl"
            disabled={items.length === 0}
          >
            {items.length === 0 
              ? 'Carrinho vazio'
              : `Ver carrinho (${items.length} ${items.length === 1 ? 'item' : 'itens'})`
            }
          </Button>
        </Link>
      </div>
    </div>
  )
}
