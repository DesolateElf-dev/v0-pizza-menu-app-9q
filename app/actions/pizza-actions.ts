'use server'

'use server'

import { prisma } from '@/lib/db'

export async function getPizzas() {
  try {
    const pizzas = await prisma.pizza.findMany({
      orderBy: {
        sabor: 'asc'
      }
    })

    console.log(`Carregadas ${pizzas.length} pizzas do banco`)

    // Converter Decimal para number antes de retornar
    const pizzasConvertidas = pizzas.map(pizza => ({
      ...pizza,
      precoBase: parseFloat(pizza.precoBase.toString()) // Converte Decimal para number
    }))

    return pizzasConvertidas
  } catch (error) {
    console.error('Erro ao carregar pizzas:', error)
    return []
  }
}

export async function getPizzaById(id: string) {
  try {
    const pizza = await prisma.pizza.findUnique({
      where: { id }
    })

    if (!pizza) return null

    // Converter Decimal para number
    return {
      ...pizza,
      precoBase: parseFloat(pizza.precoBase.toString())
    }
  } catch (error) {
    console.error('Erro ao buscar pizza:', error)
    return null
  }
}