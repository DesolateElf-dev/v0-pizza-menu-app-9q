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
    console.log('Adicionar ao carrinho:', product)
    addItem(product)
  }

  const isBebida = product.categoria === "BEBIDAS"

  return (
    <Card className="relative flex flex-col p-4 space-y-3 rounded-2xl border border-amber-300 shadow-sm hover:shadow-md transition-shadow">
      {product.imagem && (
        <div className="relative w-full h-44">
          <Image
            src={product.imagem}
            alt={product.nome}
            fill
            className="object-contain rounded-xl"
            sizes="(max-width: 640px) 100vw, 320px"
            priority
          />
        </div>
      )}

      <CardContent className="p-0">
        <h3 className="text-lg font-semibold text-amber-900">{product.nome}</h3>
        <p className="text-sm text-amber-700">{product.descricao}</p>

        {isBebida && product.tamanhos ? (
          <div className="mt-2 flex flex-col space-y-1 text-amber-800 font-semibold text-sm">
            {Object.entries(product.tamanhos).map(([size, price]) => (
              <span key={size}>
                {size} = {formatPrice(price as number)}
              </span>
            ))}
          </div>
        ) : (
          <div className="mt-2 flex flex-col space-y-1 text-amber-800 font-semibold text-sm">
            <span>GRANDE = {formatPrice(product.precoGrande ?? product.precoBase ?? 0)}</span>
            <span>MÉDIA = {formatPrice(product.precoMedia ?? product.precoBase ?? 0)}</span>
          </div>
        )}

        <Button
          className="mt-4 w-full"
          onClick={handleAddToCart}
          aria-label={`Adicionar ${product.nome} ao carrinho`}
        >
          Adicionar
        </Button>
      </CardContent>
    </Card>
  )
}
