'use server'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'

export type OrderStatus = 'Recebido' | 'Preparando' | 'Saiu para entrega' | 'Entregue'

export async function listUserOrders(params?: { status?: OrderStatus; from?: string; to?: string; page?: number; pageSize?: number }) {
  const session = await getSession()
  if (!session) return { items: [], page: 1, pageSize: 10, total: 0 }

  const page = params?.page && params.page > 0 ? params.page : 1
  const pageSize = params?.pageSize && params.pageSize > 0 ? Math.min(params.pageSize, 50) : 10

  const where: any = { usuarioId: session.id }
  if (params?.status) where.status = params.status
  if (params?.from || params?.to) {
    where.dataPedido = {}
    if (params.from) where.dataPedido.gte = new Date(params.from)
    if (params.to) where.dataPedido.lte = new Date(params.to)
  }

  const [total, pedidos] = await Promise.all([
    prisma.pedido.count({ where }),
    prisma.pedido.findMany({
      where,
      orderBy: { dataPedido: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: {
        id: true,
        dataPedido: true,
        status: true,
        valorTotal: true,
        itens: {
          select: { id: true, quantidade: true, tamanho: true, pizza: { select: { sabor: true } } }
        }
      }
    })
  ])

  return { items: pedidos, page, pageSize, total }
}
