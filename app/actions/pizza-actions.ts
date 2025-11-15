'use server'

import { prisma } from '@/lib/db'

export async function getPizzas() {
  try {
    const pizzas = await prisma.pizza.findMany({
      orderBy: {
        sabor: 'asc',
      },
    })

    console.log(`Carregadas ${pizzas.length} pizzas do banco`)

    // Converter Decimal para number antes de retornar
    const pizzasConvertidas = pizzas.map((pizza) => ({
      ...pizza,
      precoBase: parseFloat(pizza.precoBase.toString()), // Decimal -> number
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
      where: { id },
    })

    if (!pizza) return null

    // Converter Decimal para number
    return {
      ...pizza,
      precoBase: parseFloat(pizza.precoBase.toString()),
    }
  } catch (error) {
    console.error('Erro ao buscar pizza:', error)
    return null
  }
}

/**
 * NOVO: Buscar pizzas doces
 */
export async function getPizzasDoces() {
  try {
    const pizzasDoces = await prisma.pizzaDoce.findMany({
      orderBy: {
        sabor: 'asc',
      },
    })

    console.log(`Carregadas ${pizzasDoces.length} pizzas doces do banco`)

    const pizzasDocesConvertidas = pizzasDoces.map((pizzaDoce) => ({
      ...pizzaDoce,
      precoBase: parseFloat(pizzaDoce.precoBase.toString()),
    }))

    return pizzasDocesConvertidas
  } catch (error) {
    console.error('Erro ao carregar pizzas doces:', error)
    return []
  }
}

/**
 * NOVO: Buscar bebidas
 */
export async function getBebidas() {
  try {
    const bebidas = await prisma.bebida.findMany({
      orderBy: {
        nome: 'asc',
      },
    })

    console.log(`Carregadas ${bebidas.length} bebidas do banco`)

    const bebidasConvertidas = bebidas.map((bebida) => ({
      ...bebida,
      preco: bebida.preco ? parseFloat(bebida.preco.toString()) : 0,
    }))

    return bebidasConvertidas
  } catch (error) {
    console.error('Erro ao carregar bebidas:', error)
    return []
  }
}