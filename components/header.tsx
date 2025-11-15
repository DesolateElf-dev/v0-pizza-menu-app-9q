"use client"

import { ArrowLeft, User, Clock, LogOut } from 'lucide-react'
import { useRouter, usePathname } from 'next/navigation'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Sheet, SheetContent, SheetTrigger, useSheetState } from '@/components/ui/sheet'
import { getCurrentSession } from '@/app/actions/session-actions'
import { logout } from '@/app/actions/logout-actions'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { UserSession } from '@/lib/auth'

interface HeaderProps {
  showBackButton?: boolean
}

export function Header({ showBackButton }: HeaderProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [session, setSession] = useState<UserSession | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const sheet = useSheetState(false)

  const isMenuPage = pathname === '/menu'

  useEffect(() => {
    async function loadSession() {
      try {
        const s = await getCurrentSession()
        setSession(s)
      } catch {
        setSession(null)
      } finally {
        setIsLoading(false)
      }
    }
    loadSession()
  }, [pathname])

  const handleLogout = async () => {
    await logout()
  }

  return (
    <header className="bg-red-600 text-white px-4 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {(showBackButton || !isMenuPage) && (
          <button onClick={() => router.back()} className="p-1 hover:bg-red-700 rounded-full transition-colors" aria-label="Voltar">
            <ArrowLeft className="w-6 h-6" />
          </button>
        )}
        <Link href="/menu">
          <h1 className="text-xl font-bold hover:text-amber-200 transition-colors cursor-pointer">Pizzaria Mackenzie iteracao2</h1>
        </Link>
      </div>

      <div className="flex items-center gap-2">
        <Link href="/pedidos" title="Meus pedidos" className="mr-1 hidden sm:inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-red-700 hover:bg-red-800">
          <Clock className="w-4 h-4" />
          <span className="text-sm font-medium">Pedidos</span>
        </Link>

        {isLoading ? (
          <div className="w-10 h-10 bg-red-700 rounded-full animate-pulse" />
        ) : (
          <Sheet>
            <SheetTrigger asChild onClick={() => sheet.onOpenChange(true)}>
              <Avatar className="w-10 h-10 bg-amber-600 cursor-pointer hover:bg-amber-700 transition-colors">
                <AvatarFallback className="bg-amber-600 text-white">
                  <User className="w-5 h-5" />
                </AvatarFallback>
              </Avatar>
            </SheetTrigger>
            <SheetContent side="right" open={sheet.open} onClose={() => sheet.onOpenChange(false)}>
              <div className="p-4 flex flex-col h-full">
                {session ? (
                  <>
                    <div className="mb-4">
                      <p className="text-sm text-amber-700">Logado como</p>
                      <p className="text-lg font-semibold">{session.nome}</p>
                    </div>
                    <nav className="flex-1">
                      <ul className="space-y-2">
                        <li>
                          <Link href="/pedidos" className="block px-3 py-2 rounded-lg hover:bg-amber-50" onClick={() => sheet.onOpenChange(false)}>
                            📋 Meus pedidos
                          </Link>
                        </li>
                        <li>
                          <Link href="/perfil" className="block px-3 py-2 rounded-lg hover:bg-amber-50" onClick={() => sheet.onOpenChange(false)}>
                            👤 Meu perfil
                          </Link>
                        </li>
                        <li>
                          <button onClick={async () => { await handleLogout(); sheet.onOpenChange(false) }} className="w-full text-left px-3 py-2 rounded-lg hover:bg-amber-50">
                            🚪 Sair
                          </button>
                        </li>
                      </ul>
                    </nav>
                    <div className="text-center text-sm text-amber-600">Pizzaria Mackenzie</div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <Link href="/" className="px-4 py-2 rounded-xl bg-yellow-500 text-amber-900 font-bold" onClick={() => sheet.onOpenChange(false)}>
                      Entrar
                    </Link>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        )}
      </div>
    </header>
  )
}
