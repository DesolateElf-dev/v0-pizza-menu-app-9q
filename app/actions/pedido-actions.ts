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
    return pizzas
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

    return pizza
  } catch (error) {
    console.error('Erro ao buscar pizza:', error)
    return null
  }
}
