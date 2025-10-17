"use client"

import { useState, useMemo } from "react"
import { Search } from "lucide-react"
import { Header } from "@/components/header"
import { PizzaCard } from "@/components/pizza-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCart } from "@/context/cart-context"
import type { Product, TabType } from "@/types"
import Link from "next/link"

// Mock data - in a real app, this would come from an API
const pizzas: Product[] = [
  {
    id: "calabresa",
    nome: "CALABRESA",
    descricao: "Mussarela, Calabresa e Cebola.",
    precoGrande: 50.0,
    precoMedia: 40.0,
    imagem: "/calabresa-pizza-with-pepperoni-and-cheese.jpg",
    categoria: "PIZZAS",
  },
  {
    id: "margherita",
    nome: "MARGHERITA",
    descricao: "Mussarela, Tomate e Manjericão.",
    precoGrande: 45.0,
    precoMedia: 35.0,
    imagem: "/margherita-pizza-with-tomato-and-basil.jpg",
    categoria: "PIZZAS",
  },
  {
    id: "portuguesa",
    nome: "PORTUGUESA",
    descricao: "Mussarela, Presunto, Ovos e Cebola.",
    precoGrande: 55.0,
    precoMedia: 45.0,
    imagem: "/portuguese-pizza.png",
    categoria: "PIZZAS",
  },
]

const doces: Product[] = [
  {
    id: "morango",
    nome: "MORANGO",
    descricao: "Mussarela, Calabresa e Cebola.",
    precoGrande: 50.0,
    precoMedia: 40.0,
    imagem: "/strawberry-dessert-pizza-with-chocolate.jpg",
    categoria: "DOCES",
  },
  {
    id: "chocolate",
    nome: "CHOCOLATE",
    descricao: "Chocolate ao Leite e Granulado.",
    precoGrande: 48.0,
    precoMedia: 38.0,
    imagem: "/chocolate-dessert-pizza.png",
    categoria: "DOCES",
  },
]

const bebidas: Product[] = [
  {
    id: "coca-cola",
    nome: "REFRIGERANTE",
    descricao: "COCA-COLA.",
    precoGrande: 15.0,
    precoMedia: 10.0,
    imagem: "/classic-coca-cola.png",
    categoria: "BEBIDAS",
    tamanhos: {
      "1 litros": 10.0,
      "2 litros": 15.0,
    },
  },
  {
    id: "guarana",
    nome: "GUARANÁ",
    descricao: "GUARANÁ ANTARCTICA.",
    precoGrande: 15.0,
    precoMedia: 10.0,
    imagem: "/guarana-soda-bottle.jpg",
    categoria: "BEBIDAS",
    tamanhos: {
      "1 litros": 10.0,
      "2 litros": 15.0,
    },
  },
]

const allProducts = [...pizzas, ...doces, ...bebidas]

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<TabType>("PIZZAS")
  const [searchQuery, setSearchQuery] = useState("")
  const { total, items } = useCart()

  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) => {
      const matchesTab = product.categoria === activeTab
      const matchesSearch = product.nome.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesTab && matchesSearch
    })
  }, [activeTab, searchQuery])

  const tabs: TabType[] = ["PIZZAS", "DOCES", "BEBIDAS"]

  return (
    <div className="min-h-screen bg-amber-50">
      <Header />

      <div className="px-4 py-4 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-600 w-5 h-5" />
          <Input
            type="text"
            placeholder="buscar..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-amber-200 border-none rounded-2xl text-amber-800 placeholder:text-amber-600"
          />
        </div>

        {/* Tabs */}
        <div className="flex justify-center space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-sm font-semibold pb-2 ${
                activeTab === tab ? "text-amber-900 border-b-2 border-amber-900" : "text-amber-600"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 gap-4 pb-24">
          {filteredProducts.map((product) => (
            <PizzaCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-amber-50">
        <Link href="/carrinho">
          <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-4 rounded-2xl text-lg">
            Ver pedidos {items.length > 0 && `(${items.length})`}
          </Button>
        </Link>
      </div>
    </div>
  )
}
