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
    // Buscar usuário pelo email
    const usuario = await prisma.usuario.findUnique({
      where: { email: usuarioEmail }
    })

    if (!usuario) {
      throw new Error(`Usuário com email ${usuarioEmail} não encontrado`)
    }

    console.log('✅ Criando pedido para:', usuario.nome)
    console.log('📦 Itens do carrinho:', itens)

    // Criar itens polimórficos baseados no tipo
    const itensParaCriar = itens.map(item => {
      const itemData: any = {
        quantidade: item.quantidade || 1
      }
      
      // Preencher apenas o campo correto baseado no tipo
      switch (item.type) {
        case 'pizza':
          itemData.pizzaId = item.id
          break
        case 'pizzaDoce':
          itemData.pizzaDoceId = item.id
          break
        case 'bebida':
          itemData.bebidaId = item.id
          break
        default:
          throw new Error(`Tipo de item inválido: ${item.type}`)
      }
      
      return itemData
    })

    console.log('🔧 Itens para criar no banco:', itensParaCriar)

    const pedido = await prisma.pedido.create({
      data: {
        usuarioId: usuario.id,
        valorTotal: new Decimal(valorTotal.toFixed(2)),
        status: 'Recebido',
        itens: {
          create: itensParaCriar
        }
      },
      include: {
        itens: {
          include: {
            pizza: true,
            pizzaDoce: true,
            bebida: true
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
        pizza: item.pizza ? {
          ...item.pizza,
          precoBase: parseFloat(item.pizza.precoBase.toString())
        } : null,
        pizzaDoce: item.pizzaDoce ? {
          ...item.pizzaDoce,
          precoBase: parseFloat(item.pizzaDoce.precoBase.toString())
        } : null,
        bebida: item.bebida ? {
          ...item.bebida,
          preco: parseFloat(item.bebida.preco.toString())
        } : null
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
            pizza: true,
            pizzaDoce: true,
            bebida: true
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
      valorTotal: parseFloat(pedido.valorTotal?.toString() || '0'),
      itens: pedido.itens.map(item => ({
        ...item,
        pizza: item.pizza ? {
          ...item.pizza,
          precoBase: parseFloat(item.pizza.precoBase.toString())
        } : null,
        pizzaDoce: item.pizzaDoce ? {
          ...item.pizzaDoce,
          precoBase: parseFloat(item.pizzaDoce.precoBase.toString())
        } : null,
        bebida: item.bebida ? {
          ...item.bebida,
          preco: parseFloat(item.bebida.preco.toString())
        } : null
      }))
    }))

    return pedidosConvertidos
  } catch (error) {
    console.error('Erro ao buscar pedidos:', error)
    return []
  }
}

// Função auxiliar para obter o nome do item baseado no tipo
export function getItemName(item: any): string {
  if (item.pizza) return item.pizza.sabor
  if (item.pizzaDoce) return item.pizzaDoce.sabor
  if (item.bebida) return item.bebida.nome
  return 'Item desconhecido'
}

// Função auxiliar para obter o preço do item baseado no tipo
export function getItemPrice(item: any): number {
  if (item.pizza) return item.pizza.precoBase
  if (item.pizzaDoce) return item.pizzaDoce.precoBase
  if (item.bebida) return item.bebida.preco
  return 0
}