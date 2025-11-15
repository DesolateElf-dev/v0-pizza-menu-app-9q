"use client"

export const dynamic = "force-dynamic"

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
import { getCurrentSession } from "@/app/actions/session-actions"

export default function CheckoutPage() {
  const { items, total, clear } = useCart()
  const router = useRouter()
  const [showSuccess, setShowSuccess] = useState(false)
  const [orderNumber, setOrderNumber] = useState("")
  const [saveCard, setSaveCard] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

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
    const digits = value.replace(/\D/g, "")
    const formatted = digits.replace(/(\d{4})(?=\d)/g, "$1 ")
    return formatted.substring(0, 19)
  }

  const formatExpiryDate = (value: string) => {
    const digits = value.replace(/\D/g, "")
    if (digits.length >= 2) {
      return digits.substring(0, 2) + "/" + digits.substring(2, 4)
    }
    return digits
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    try {
      const session = await getCurrentSession()
      if (!session) {
        alert('Você precisa estar logado para fazer um pedido')
        router.push('/login')
        return
      }

      // Mapear itens do carrinho com o tipo correto
      const itensPedido = items.map((item) => ({
        id: item.id,
        type: item.type,
        quantidade: item.quantidade,
      }))

      const pedidoCriado = await criarPedido(session.email, itensPedido, total)
      const orderNum = pedidoCriado.id.slice(0, 6).toUpperCase()
      
      // Não limpar carrinho aqui! Só setar estados do modal
      setOrderNumber(orderNum)
      setShowSuccess(true)
      
    } catch (error) {
      console.error('❌ Erro ao processar pedido:', error)
      alert('Erro ao processar pedido. Tente novamente.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleSuccessClose = () => {
    setShowSuccess(false)
    clear() // Limpar carrinho só quando fechar o modal
    router.push("/pedidos")
  }

  // Verificar se há itens no carrinho
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-amber-50">
        <Header showBackButton />
        <div className="flex items-center justify-center py-20">
          <div className="text-center space-y-4">
            <div className="text-4xl">🛒</div>
            <h2 className="text-xl font-bold text-amber-900">Carrinho vazio</h2>
            <p className="text-amber-700">Adicione itens ao carrinho para finalizar o pedido</p>
            <Button 
              onClick={() => router.push('/menu')} 
              className="bg-yellow-500 hover:bg-yellow-600 text-amber-900 font-semibold"
            >
              Ver cardápio
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-amber-50">
      <Header showBackButton />

      <div className="px-4 py-4 space-y-6">
        {/* Resumo do pedido */}
        <div className="bg-amber-100 rounded-2xl p-4 space-y-2">
          <h3 className="font-bold text-amber-900">Resumo do pedido:</h3>
          {items.map((item) => (
            <div key={`${item.type}-${item.id}`} className="flex justify-between text-sm text-amber-800">
              <span>{item.quantidade}x {item.nome}</span>
              <span>{formatPrice(item.subtotal)}</span>
            </div>
          ))}
          <div className="border-t border-amber-300 pt-2 flex justify-between font-bold text-amber-900">
            <span>Total:</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>

        <h2 className="text-xl font-bold text-amber-900">Pagamento:</h2>
        <BrandIcons />

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cardNumber" className="text-amber-900 font-semibold">nº cartão:</Label>
            <div className="relative">
              <Input 
                id="cardNumber" 
                type="text" 
                placeholder="**** **** **** ****" 
                value={formData.cardNumber} 
                onChange={(e) => handleInputChange("cardNumber", formatCardNumber(e.target.value))} 
                className="bg-gray-200 border-none rounded-2xl text-amber-900 placeholder:text-gray-500" 
                required 
                disabled={isProcessing}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <span className="text-blue-600 font-bold text-sm">VISA</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiryDate" className="text-amber-900 font-semibold">validade:</Label>
              <Input 
                id="expiryDate" 
                type="text" 
                placeholder="mes/ano" 
                value={formData.expiryDate} 
                onChange={(e) => handleInputChange("expiryDate", formatExpiryDate(e.target.value))} 
                className="bg-gray-200 border-none rounded-2xl text-amber-900 placeholder:text-gray-500" 
                required 
                disabled={isProcessing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cvv" className="text-amber-900 font-semibold">CVV</Label>
              <Input 
                id="cvv" 
                type="text" 
                placeholder="***" 
                value={formData.cvv} 
                onChange={(e) => handleInputChange("cvv", e.target.value.replace(/\D/g, "").substring(0, 3))} 
                className="bg-gray-200 border-none rounded-2xl text-amber-900 placeholder:text-gray-500" 
                required 
                disabled={isProcessing}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cardName" className="text-amber-900 font-semibold">Nome no cartão:</Label>
            <Input 
              id="cardName" 
              type="text" 
              placeholder="Seu nome..." 
              value={formData.cardName} 
              onChange={(e) => handleInputChange("cardName", e.target.value)} 
              className="bg-gray-200 border-none rounded-2xl text-amber-900 placeholder:text-gray-500" 
              required 
              disabled={isProcessing}
            />
          </div>

          <div className="flex items-center justify-between py-4">
            <Label htmlFor="saveCard" className="text-amber-900 font-semibold">Salvar cartão:</Label>
            <div className="flex items-center gap-2">
              <Switch 
                id="saveCard" 
                checked={saveCard} 
                onCheckedChange={setSaveCard} 
                disabled={isProcessing}
              />
              <div className="w-6 h-6 bg-yellow-500 rounded flex items-center justify-center">
                <span className="text-black text-xs">🔒</span>
              </div>
            </div>
          </div>

          <div className="pt-8">
            <Button 
              type="submit" 
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-4 rounded-2xl text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isProcessing}
            >
              {isProcessing ? 'Processando...' : 'Confirmar Pedido'}
            </Button>
          </div>
        </form>
      </div>

      {/* Modal de sucesso */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="bg-amber-50 border-2 border-yellow-500 rounded-2xl max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-amber-900 text-xl font-bold">
              Pedido Recebido!
            </DialogTitle>
          </DialogHeader>
          <div className="text-center py-4 space-y-4">
            <div className="text-6xl">✅</div>
            <p className="text-amber-800 text-lg">Seu pedido foi confirmado com sucesso!</p>
            <div className="bg-yellow-100 border-2 border-yellow-400 rounded-xl p-4">
              <p className="text-sm text-amber-700 mb-1">Número do pedido:</p>
              <p className="text-2xl font-bold text-amber-900">#{orderNumber}</p>
            </div>
            <p className="text-sm text-amber-600">Você pode acompanhar o status na seção de pedidos</p>
          </div>
          <Button 
            onClick={handleSuccessClose} 
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 rounded-2xl"
          >
            Ver meus pedidos
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}
