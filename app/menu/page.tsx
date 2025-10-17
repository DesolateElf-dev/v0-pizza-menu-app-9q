"use client"

import { ArrowLeft, Home, FileText, History, Heart, Search, HelpCircle, Settings, LogOut, User } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import Link from "next/link"
import { useRouter } from "next/navigation"

const menuItems = [
  { icon: Home, label: "Iniciar", href: "/" },
  { icon: FileText, label: "Meus Pedidos", href: "/pedidos" },
  { icon: History, label: "Historico de pedidos", href: "/historico" },
  { icon: Heart, label: "Favoritos", href: "/favoritos" },
  { icon: Search, label: "Rastreio pedido", href: "/rastreio" },
  { icon: HelpCircle, label: "Suporte", href: "/suporte" },
  { icon: Settings, label: "Configurações", href: "/configuracoes" },
  { icon: LogOut, label: "Sair", href: "/sair" },
]

export default function MenuPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-red-600 text-white">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-6">
        <button onClick={() => router.back()} className="p-2 hover:bg-red-700 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold">Pizzaria Mackenzie</h1>
      </div>

      {/* User Profile */}
      <div className="px-4 py-6 flex items-center gap-4">
        <Avatar className="w-16 h-16 bg-white">
          <AvatarFallback className="bg-amber-800 text-white">
            <User className="w-8 h-8" />
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="text-white/80 text-sm">Olá,</p>
          <p className="text-white font-bold text-lg">Jotta</p>
        </div>
      </div>

      {/* Menu Items */}
      <div className="px-4 space-y-2">
        {menuItems.map((item, index) => {
          const Icon = item.icon
          return (
            <Link
              key={index}
              href={item.href}
              className="flex items-center gap-4 px-4 py-4 hover:bg-red-700 rounded-lg transition-colors"
            >
              <Icon className="w-6 h-6" />
              <span className="font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
