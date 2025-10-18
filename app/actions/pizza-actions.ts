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

// Função para calcular preço por tamanho
export function calcularPreco(precoBase: number, tamanho: string): number {
  const multiplicadores = {
    'Pequena': 0.8,   // 20% menor
    'Média': 1.0,     // preço base
    'Grande': 1.3     // 30% maior
  }
  
  return precoBase * (multiplicadores[tamanho as keyof typeof multiplicadores] || 1.0)
}