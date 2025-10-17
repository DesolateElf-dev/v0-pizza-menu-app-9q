"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Product } from "@/types"
import { useCart } from "@/context/cart-context"
import { formatPrice } from "@/lib/price"
import Image from "next/image"

interface PizzaCardProps {
  product: Product
}

export function PizzaCard({ product }: PizzaCardProps) {
  const { addItem } = useCart()

  const handleAddToCart = () => {
    if (product.categoria === "BEBIDAS") {
      // For drinks, default to 1 litro
      addItem(product, "1 litros")
    } else {
      // For pizzas and desserts, default to MÉDIA
      addItem(product, "MÉDIA")
    }
  }

  return (
    <Card className="bg-amber-100 border-none shadow-md rounded-2xl overflow-hidden hover:shadow-lg transition-shadow">
      <CardContent className="p-0">
        <div className="relative h-32 bg-amber-200">
          <Image
            src={product.imagem || "/placeholder.svg"}
            alt={product.nome}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        </div>

        <div className="p-4 space-y-2">
          <h3 className="font-bold text-sm text-amber-900">{product.nome}</h3>
          <p className="text-xs text-amber-800 line-clamp-2">{product.descricao}</p>

          <div className="space-y-1 text-xs">
            {product.categoria === "BEBIDAS" && product.tamanhos ? (
              Object.entries(product.tamanhos).map(([size, price]) => (
                <div key={size} className="text-yellow-600 font-semibold">
                  {size} = {formatPrice(price)}
                </div>
              ))
            ) : (
              <>
                <div className="text-yellow-600 font-semibold">GRANDE = {formatPrice(product.precoGrande)}</div>
                <div className="text-yellow-600 font-semibold">MÉDIA = {formatPrice(product.precoMedia)}</div>
              </>
            )}
          </div>

          <Button
            onClick={handleAddToCart}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold text-xs py-2 rounded-lg transition-colors"
          >
            Adicionar
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
