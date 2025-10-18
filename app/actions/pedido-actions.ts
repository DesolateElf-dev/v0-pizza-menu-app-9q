'use server'

import { prisma } from '@/lib/db'
import { Decimal } from '@prisma/client/runtime/library'

export async function criarPedido(usuarioId: string, itens: any[], valorTotal: number) {
  try {
    const pedido = await prisma.pedido.create({
      data: {
        usuarioId,
        valorTotal: new Decimal(valorTotal.toFixed(2)),
        status: 'Recebido',
        itens: {
          create: itens.map(item => ({
            pizzaId: item.id,
            quantidade: item.quantidade || 1,
            tamanho: 'Média'
          }))
        }
      },
      include: {
        itens: {
          include: {
            pizza: true
          }
        }
      }
    })

    console.log('Pedido criado:', pedido.id)
    return pedido
  } catch (error) {
    console.error('Erro ao criar pedido:', error)
    throw error
  }
}

export async function getPedidosByUsuario(usuarioId: string) {
  try {
    const pedidos = await prisma.pedido.findMany({
      where: {
        usuarioId,
        status: {
          in: ['Recebido', 'Em preparo', 'Saiu para entrega']
        }
      },
      include: {
        itens: {
          include: {
            pizza: true
          }
        }
      },
      orderBy: {
        dataPedido: 'desc'
      }
    })

    return pedidos
  } catch (error) {
    console.error('Erro ao buscar pedidos:', error)
    return []
  }
}