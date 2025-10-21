'use server'

import { prisma } from '@/lib/db'
import { Decimal } from '@prisma/client/runtime/library'

export async function criarPedido(usuarioEmail: string, itens: any[], valorTotal: number) {
  try {
    // Buscar usuário pelo email
    const usuario = await prisma.usuario.findUnique({
      where: { email: usuarioEmail }
    })

    if (!usuario) {
      throw new Error(`Usuário com email ${usuarioEmail} não encontrado`)
    }

    console.log('✅ Criando pedido para:', usuario.nome)

    const pedido = await prisma.pedido.create({
      data: {
        usuarioId: usuario.id,
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

    console.log('✅ Pedido criado:', pedido.id)

    // Converter Decimals para numbers antes de retornar
    const pedidoConvertido = {
      ...pedido,
      valorTotal: parseFloat(pedido.valorTotal.toString()),
      itens: pedido.itens.map(item => ({
        ...item,
        pizza: {
          ...item.pizza,
          precoBase: parseFloat(item.pizza.precoBase.toString())
        }
      }))
    }

    return pedidoConvertido
    
  } catch (error) {
    console.error('❌ Erro ao criar pedido:', error)
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

    // Converter Decimals para numbers
    const pedidosConvertidos = pedidos.map(pedido => ({
      ...pedido,
      valorTotal: parseFloat(pedido.valorTotal.toString()),
      itens: pedido.itens.map(item => ({
        ...item,
        pizza: {
          ...item.pizza,
          precoBase: parseFloat(item.pizza.precoBase.toString())
        }
      }))
    }))

    return pedidosConvertidos
  } catch (error) {
    console.error('Erro ao buscar pedidos:', error)
    return []
  }
}
