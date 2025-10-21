"use client"

import { ArrowLeft, User, LogOut } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { getCurrentSession } from "@/app/actions/session-actions"
import { logout } from "@/app/actions/logout-actions"
import Link from "next/link"
import { useEffect, useState } from "react"
import { UserSession } from "@/lib/auth"

interface HeaderProps {
  showBackButton?: boolean
}

export function Header({ showBackButton }: HeaderProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [session, setSession] = useState<UserSession | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const isMenuPage = pathname === "/menu"

  // Buscar sessão ao carregar o componente
  useEffect(() => {
    async function loadSession() {
      try {
        const userSession = await getCurrentSession()
        setSession(userSession)
      } catch (error) {
        console.error('Erro ao carregar sessão:', error)
        setSession(null)
      } finally {
        setIsLoading(false)
      }
    }
    loadSession()
  }, [pathname]) // Re-carregar quando mudar de página

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Erro no logout:', error)
      router.push('/')
    }
  }

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
        {isLoading ? (
          <div className="w-10 h-10 bg-red-700 rounded-full animate-pulse"></div>
        ) : session ? (
          /* Usuário logado */
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium hidden sm:block">Olá, {session.nome.split(' ')[0]}</span>
            <div className="flex gap-1">
              <Link href="/perfil" title="Meu Perfil">
                <Avatar className="w-10 h-10 bg-amber-600 cursor-pointer hover:bg-amber-700 transition-colors">
                  <AvatarFallback className="bg-amber-600 text-white">
                    <User className="w-5 h-5" />
                  </AvatarFallback>
                </Avatar>
              </Link>
              <button onClick={handleLogout} title="Sair" className="p-1 hover:bg-red-700 rounded-full transition-colors">
                <Avatar className="w-10 h-10 bg-red-700 cursor-pointer hover:bg-red-800 transition-colors">
                  <AvatarFallback className="bg-red-700 text-white">
                    <LogOut className="w-5 h-5" />
                  </AvatarFallback>
                </Avatar>
              </button>
            </div>
          </div>
        ) : (
          /* Usuário não logado */
          <Link href="/" title="Fazer Login">
            <Avatar className="w-10 h-10 bg-amber-600 cursor-pointer hover:bg-amber-700 transition-colors">
              <AvatarFallback className="bg-amber-600 text-white">
                <User className="w-5 h-5" />
              </AvatarFallback>
            </Avatar>
          </Link>
        )}
      </div>
    </header>
  )
}
