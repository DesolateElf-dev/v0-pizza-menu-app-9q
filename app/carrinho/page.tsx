"use client"

import { Header } from "@/components/header"
import { QtyStepper } from "@/components/qty-stepper"
import { Button } from "@/components/ui/button"
import { useCart } from "@/context/cart-context"
import { formatPrice } from "@/lib/price"
import Image from "next/image"
import Link from "next/link"

export default function CarrinhoPage() {
  const { items, total, updateQty } = useCart()

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-amber-50">
        <Header showBackButton />

        <div className="px-4 py-8 text-center">
          <h2 className="text-xl font-bold text-amber-900 mb-4">Pedidos:</h2>
          <p className="text-amber-700 mb-8">Seu carrinho está vazio</p>

          <Link href="/">
            <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8 py-3 rounded-2xl">
              Ver cardápio
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-amber-50">
      <Header showBackButton />

      <div className="px-4 py-4">
        <h2 className="text-xl font-bold text-amber-900 mb-6">Pedidos:</h2>

        <div className="space-y-4 pb-32">
          {items.map((item) => (
            <div key={item.id} className="bg-amber-100 rounded-2xl p-4 flex items-center gap-4 shadow-sm">
              {/* Product Image */}
              <div className="w-16 h-16 bg-amber-200 rounded-xl overflow-hidden flex-shrink-0">
                <Image
                  src={item.imagem || "/placeholder.svg"}
                  alt={item.nome}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-amber-900 text-sm">{item.nome}</h3>
                <p className="text-amber-700 text-sm">{formatPrice(item.precoUnit)}</p>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center gap-3">
                <QtyStepper
                  quantity={item.quantidade}
                  onDecrease={() => updateQty(item.id, item.quantidade - 1)}
                  onIncrease={() => updateQty(item.id, item.quantidade + 1)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Total Bar */}
      <div className="fixed bottom-20 left-0 right-0 mx-4">
        <div className="bg-amber-800 text-white px-6 py-4 rounded-2xl flex justify-between items-center">
          <span className="font-semibold">Valor=</span>
          <span className="font-bold text-lg">{formatPrice(total)}</span>
        </div>
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-amber-50">
        <Link href="/checkout">
          <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-4 rounded-2xl text-lg">
            Pagar
          </Button>
        </Link>
      </div>
    </div>
  )
}
