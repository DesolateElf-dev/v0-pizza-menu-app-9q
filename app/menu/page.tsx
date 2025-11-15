"use client"

import { useEffect, useMemo, useState } from "react"
import { Search } from "lucide-react"

import { Header } from "@/components/header"
import { PizzaCard } from "@/components/pizza-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import type { Product } from "@/types"
import { getPizzas, getPizzasDoces, getBebidas } from "@/app/actions/pizza-actions"
import { useCart } from "@/context/cart-context"
import { formatPrice } from "@/lib/price"

export default function MenuPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const { items, total } = useCart()

  useEffect(() => {
    async function loadMenu() {
      try {
        setLoading(true)
        setError("")

        const [pizzasDB, pizzasDocesDB, bebidasDB] = await Promise.all([
          getPizzas(),
          getPizzasDoces(),
          getBebidas(),
        ])

        // PIZZAS salgadas
        const pizzas: Product[] = pizzasDB.map((p: any) => {
          const imagem = p.imagem?.startsWith("/images/")
            ? p.imagem
            : p.imagem
              ? `/images/pizzas/${p.imagem}`
              : "/images/pizzas/default.jpg"

          return {
            id: p.id,
            nome: p.sabor,
            descricao: p.descricao ?? "",
            categoria: "PIZZAS",
            imagem,
            precoBase: p.precoBase,
            precoGrande: p.precoBase,
            precoMedia: p.precoBase,
            tamanhos: undefined,
          } as Product
        })

        // PIZZAS DOCES
        const pizzasDoces: Product[] = pizzasDocesDB.map((pd: any) => {
          const imagem = pd.imagem?.startsWith("/images/")
            ? pd.imagem
            : pd.imagem
              ? `/images/pizzas-doces/${pd.imagem}`
              : "/images/pizzas-doces/default.jpg"

          return {
            id: pd.id,
            nome: pd.sabor,
            descricao: pd.descricao ?? "",
            categoria: "PIZZAS_DOCE",   // ← ESSENCIAL para o mapeamento acima
            imagem,
            precoBase: pd.precoBase,
            precoGrande: pd.precoBase,
            precoMedia: pd.precoBase,
            tamanhos: undefined,
          } as Product
        })

        // BEBIDAS
        const bebidas: Product[] = bebidasDB.map((b: any) => {
          const imagem = b.imagem?.startsWith("/images/")
            ? b.imagem
            : b.imagem
              ? `/images/bebidas/${b.imagem}`
              : "/images/bebidas/default.jpg"

          const preco = b.preco ?? 0

          return {
            id: b.id,
            nome: b.nome,
            descricao: b.volume ?? "",
            categoria: "BEBIDAS",
            imagem,
            precoBase: preco,
            precoGrande: preco,
            precoMedia: preco,          // ← ESSA linha evita undefined no carrinho
            tamanhos: {
              [b.volume || ""]: preco,
            },
          } as Product
        })

        setProducts([...pizzas, ...pizzasDoces, ...bebidas])
      } catch (e) {
        console.error(e)
        setError("Erro ao carregar o cardápio. Tente novamente mais tarde.")
      } finally {
        setLoading(false)
      }
    }

    loadMenu()
  }, [])

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products
    const term = searchQuery.toLowerCase()

    return products.filter((p) =>
      [p.nome, p.descricao]
        .filter(Boolean)
        .some((field) => field!.toLowerCase().includes(term))
    )
  }, [products, searchQuery])

  if (loading) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-6xl animate-bounce">🍕</div>
          <div className="text-amber-900 font-semibold text-lg">
            Carregando cardápio...
          </div>
          <div className="text-amber-700">
            Preparando as melhores opções para você
          </div>
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
            <h2 className="text-xl font-bold text-amber-900">
              Ops! Algo deu errado
            </h2>
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

      <div className="px-4 py-4 space-y-6">
        {/* Busca */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-600 w-5 h-5" />
          <Input
            type="text"
            placeholder="Buscar no cardápio..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-amber-200 border-none rounded-2xl text-amber-800 placeholder:text-amber-600 focus:bg-amber-100"
          />
        </div>

        {/* Info de resultados */}
        <div className="flex justify-between items-center text-sm text-amber-800">
          <span>
            {products.length}{" "}
            {products.length === 1
              ? "sabor disponível"
              : "sabores disponíveis"}
          </span>
          {searchQuery && (
            <span>
              {filteredProducts.length} resultado(s) para "
              {searchQuery}"
            </span>
          )}
        </div>

        {/* Lista de produtos */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 pb-24">
            {filteredProducts.map((product) => (
              <PizzaCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-amber-800">
            {searchQuery
              ? `Não encontramos itens com "${searchQuery}"`
              : "O cardápio está sendo atualizado"}
          </div>
        )}
      </div>

      {/* Barra fixa do carrinho */}
      {items.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4">
          <button
            onClick={() => (window.location.href = "/carrinho")}
            className="w-full bg-amber-900 text-amber-50 rounded-2xl py-3 px-4 flex items-center justify-between shadow-lg"
          >
            <div className="flex flex-col text-left">
              <span className="text-sm font-semibold">
                {items.length}{" "}
                {items.length === 1
                  ? "item no carrinho"
                  : "itens no carrinho"}
              </span>
              <span className="text-xs text-amber-200">
                Total: {formatPrice(total)}
              </span>
            </div>
            <span className="text-sm font-bold">Ver carrinho →</span>
          </button>
        </div>
      )}
    </div>
  )
}