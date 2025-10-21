'use server'

import { prisma } from '@/lib/db'
import { Decimal } from '@prisma/client/runtime/library'

// Tipo para item do carrinho com discriminador
interface ItemCarrinho {
  id: string
  type: 'pizza' | 'pizzaDoce' | 'bebida'
  quantidade: number
}

export async function criarPedido(usuarioEmail: string, itens: ItemCarrinho[], valorTotal: number) {
  try {
    const usuario = await prisma.usuario.findUnique({ where: { email: usuarioEmail } })
    if (!usuario) throw new Error(`Usuário com email ${usuarioEmail} não encontrado`)

    const itensParaCriar = itens.map((item) => {
      const base: any = { quantidade: item.quantidade || 1 }
      if (item.type === 'pizza') base.pizzaId = item.id
      else if (item.type === 'pizzaDoce') base.pizzaDoceId = item.id
      else if (item.type === 'bebida') base.bebidaId = item.id
      else throw new Error(`Tipo de item inválido: ${item.type}`)
      return base
    })

    const pedido = await prisma.pedido.create({
      data: {
        usuarioId: usuario.id,
        valorTotal: new Decimal(Number(valorTotal).toFixed(2)),
        status: 'Recebido',
        itens: { create: itensParaCriar },
      },
      include: {
        itens: { include: { pizza: true, pizzaDoce: true, bebida: true } },
      },
    })

    const pedidoConvertido = {
      ...pedido,
      valorTotal: parseFloat(pedido.valorTotal?.toString() || '0'),
      itens: pedido.itens.map((item) => ({
        ...item,
        pizza: item.pizza
          ? { ...item.pizza, precoBase: parseFloat(item.pizza.precoBase.toString()) }
          : null,
        pizzaDoce: item.pizzaDoce
          ? { ...item.pizzaDoce, precoBase: parseFloat(item.pizzaDoce.precoBase.toString()) }
          : null,
        bebida: item.bebida
          ? { ...item.bebida, preco: parseFloat(item.bebida.preco.toString()) }
          : null,
      })),
    }

    return pedidoConvertido
  } catch (error) {
    console.error('❌ Erro ao criar pedido:', error)
    throw error
  }
}
