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
          select: {
            id: true,
            quantidade: true,
            // tamanho removido no novo schema
            pizza: { select: { sabor: true, precoBase: true } },
            pizzaDoce: { select: { sabor: true, precoBase: true } },
            bebida: { select: { nome: true, preco: true } },
          }
        }
      }
    })
  ])

  // Converter Decimals em numbers no retorno para evitar serialização de Decimal
  const items = pedidos.map((p) => ({
    ...p,
    valorTotal: p.valorTotal ? Number(p.valorTotal) : null,
    itens: p.itens.map((it) => ({
      ...it,
      pizza: it.pizza ? { ...it.pizza, precoBase: Number(it.pizza.precoBase) } : null,
      pizzaDoce: it.pizzaDoce ? { ...it.pizzaDoce, precoBase: Number(it.pizzaDoce.precoBase) } : null,
      bebida: it.bebida ? { ...it.bebida, preco: Number(it.bebida.preco) } : null,
    }))
  }))

  return { items, page, pageSize, total }
}
