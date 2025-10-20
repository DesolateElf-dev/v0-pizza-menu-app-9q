"use client"

import type React from "react"

import { useState } from "react"
import { Header } from "@/components/header"
import { BrandIcons } from "@/components/brand-icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useCart } from "@/context/cart-context"
import { formatPrice } from "@/lib/price"
import { useRouter } from "next/navigation"
import { criarPedido } from "@/app/actions/pedido-actions"

export default function CheckoutPage() {
  const { items, total, clear } = useCart()
  const router = useRouter()
  const [showSuccess, setShowSuccess] = useState(false)
  const [orderNumber, setOrderNumber] = useState("")
  const [saveCard, setSaveCard] = useState(false)

  const [formData, setFormData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardName: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const formatCardNumber = (value: string) => {
    // Remove all non-digits and add spaces every 4 digits
    const digits = value.replace(/\D/g, "")
    const formatted = digits.replace(/(\d{4})(?=\d)/g, "$1 ")
    return formatted.substring(0, 19) // Max 16 digits + 3 spaces
  }

  const formatExpiryDate = (value: string) => {
    // Remove all non-digits and add slash after 2 digits
    const digits = value.replace(/\D/g, "")
    if (digits.length >= 2) {
      return digits.substring(0, 2) + "/" + digits.substring(2, 4)
    }
    return digits
  }

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()

  try {
    console.log('Processando pedido...')
    
    // TODO: ID do usuário logado (temporariamente fixo)
    // Depois vamos integrar com a sessão do login
    const usuarioEmail = "maria.santos@email.com" // Use um email que existe no banco

    // Mapear itens do carrinho para o formato do banco
    const itensPedido = items.map((item) => ({
      id: item.id,                  // pizzaId (string cuid da pizza)
      quantidade: item.quantidade   // quantidade do item
    }))

    console.log('Itens do pedido:', itensPedido)
    console.log('Valor total:', total)

    // Criar pedido no banco de dados
    const pedidoCriado = await criarPedido(usuarioEmail, itensPedido, total)
    
    // Número de pedido para mostrar ao usuário
    const orderNum = pedidoCriado.id.slice(0, 6).toUpperCase()
    setOrderNumber(orderNum)

    console.log('✅ Pedido criado com sucesso:', pedidoCriado.id)

    // Limpar carrinho e mostrar popup de sucesso
    clear()
    setShowSuccess(true)

  } catch (error) {
    console.error('❌ Erro ao processar pedido:', error)
    // TODO: Mostrar mensagem de erro para o usuário
    alert('Erro ao processar pedido. Tente novamente.')
  }
}

  const handleSuccessClose = () => {
    setShowSuccess(false)
    // ALTERAÇÃO: Redireciona para o menu em vez da página inicial
    router.push("/menu")
  }

  return (
    <div className="min-h-screen bg-amber-50">
      <Header showBackButton />

      <div className="px-4 py-4 space-y-6">
        <h2 className="text-xl font-bold text-amber-900">Pagamento:</h2>

        {/* Payment Method Icons */}
        <BrandIcons />

        {/* Total */}
        <div className="text-center">
          <span className="text-lg font-semibold text-amber-900">Total: {formatPrice(total)}</span>
        </div>

        {/* Payment Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Card Number */}
          <div className="space-y-2">
            <Label htmlFor="cardNumber" className="text-amber-900 font-semibold">
              nº cartão:
            </Label>
            <div className="relative">
              <Input
                id="cardNumber"
                type="text"
                placeholder="**** **** **** ****"
                value={formData.cardNumber}
                onChange={(e) => handleInputChange("cardNumber", formatCardNumber(e.target.value))}
                className="bg-gray-200 border-none rounded-2xl text-amber-900 placeholder:text-gray-500"
                required
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <span className="text-blue-600 font-bold text-sm">VISA</span>
              </div>
            </div>
          </div>

          {/* Expiry and CVV */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiryDate" className="text-amber-900 font-semibold">
                validade:
              </Label>
              <Input
                id="expiryDate"
                type="text"
                placeholder="mes/ano"
                value={formData.expiryDate}
                onChange={(e) => handleInputChange("expiryDate", formatExpiryDate(e.target.value))}
                className="bg-gray-200 border-none rounded-2xl text-amber-900 placeholder:text-gray-500"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cvv" className="text-amber-900 font-semibold">
                CVV
              </Label>
              <Input
                id="cvv"
                type="text"
                placeholder="***"
                value={formData.cvv}
                onChange={(e) => handleInputChange("cvv", e.target.value.replace(/\D/g, "").substring(0, 3))}
                className="bg-gray-200 border-none rounded-2xl text-amber-900 placeholder:text-gray-500"
                required
              />
            </div>
          </div>

          {/* Card Name */}
          <div className="space-y-2">
            <Label htmlFor="cardName" className="text-amber-900 font-semibold">
              Nome no cartão:
            </Label>
            <Input
              id="cardName"
              type="text"
              placeholder="Seu nome..."
              value={formData.cardName}
              onChange={(e) => handleInputChange("cardName", e.target.value)}
              className="bg-gray-200 border-none rounded-2xl text-amber-900 placeholder:text-gray-500"
              required
            />
          </div>

          {/* Save Card Switch */}
          <div className="flex items-center justify-between py-4">
            <Label htmlFor="saveCard" className="text-amber-900 font-semibold">
              Salvar cartão:
            </Label>
            <div className="flex items-center gap-2">
              <Switch id="saveCard" checked={saveCard} onCheckedChange={setSaveCard} />
              <div className="w-6 h-6 bg-yellow-500 rounded flex items-center justify-center">
                <span className="text-black text-xs">🔒</span>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-8">
            <Button
              type="submit"
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-4 rounded-2xl text-lg"
            >
              Confirmar
            </Button>
          </div>
        </form>
      </div>

      {/* Success Dialog */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="bg-amber-50 border-2 border-yellow-500 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-center text-amber-900 text-xl font-bold">Pedido Recebido!</DialogTitle>
          </DialogHeader>
          <div className="text-center py-4">
            <p className="text-amber-800 mb-4">Seu pedido foi confirmado com sucesso!</p>
            <p className="text-lg font-semibold text-amber-900">Número do pedido: #{orderNumber}</p>
          </div>
          <Button
            onClick={handleSuccessClose}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 rounded-2xl"
          >
            Continuar
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}