"use client"

import { ArrowLeft, User, LogOut } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import Link from "next/link"

interface HeaderProps {
  showBackButton?: boolean
}

export function Header({ showBackButton }: HeaderProps) {
  const router = useRouter()
  const pathname = usePathname()

  const isMenuPage = pathname === "/menu"

  return (
    <header className="bg-red-600 text-white px-4 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {(showBackButton || !isMenuPage) && (
          <button
            onClick={() => router.back()}
            className="p-1 hover:bg-red-700 rounded-full transition-colors"
            aria-label="Voltar"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
        )}
        <Link href="/menu">
          <h1 className="text-xl font-bold hover:text-amber-200 transition-colors cursor-pointer">Pizzaria Mackenzie</h1>
        </Link>
      </div>

      <div className="flex items-center gap-2">
        {/* User Menu */}
        <Link href="/" title="Sair/Login">
          <Avatar className="w-10 h-10 bg-white cursor-pointer hover:bg-gray-100 transition-colors">
            <AvatarFallback className="bg-amber-800 text-white">
              <LogOut className="w-5 h-5" />
            </AvatarFallback>
          </Avatar>
        </Link>
      </div>
    </header>
  )
}