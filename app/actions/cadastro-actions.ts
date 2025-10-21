'use server'

export async function getPizzas() {
  try {
    // Importação dinâmica para evitar problemas de cache
    const { prisma } = await import('@/lib/db')
    
    console.log('Tentando carregar pizzas do banco...')
    
    const pizzas = await prisma.pizza.findMany({
      orderBy: {
        sabor: 'asc'
      }
    })

    console.log(`✅ Carregadas ${pizzas.length} pizzas do banco`)
    return pizzas
    
  } catch (error) {
    console.error('❌ Erro detalhado ao carregar pizzas:')
    console.error('Tipo do erro:', typeof error)
    console.error('Mensagem:', error instanceof Error ? error.message : String(error))
    console.error('Stack:', error instanceof Error ? error.stack : 'Sem stack trace')
    
    // Retornar array vazio em caso de erro
    return []
  }
}

export async function getPizzaById(id: string) {
  try {
    const { prisma } = await import('@/lib/db')
    
    const pizza = await prisma.pizza.findUnique({
      where: { id }
    })

    return pizza
  } catch (error) {
    console.error('Erro ao buscar pizza por ID:', error)
    return null
  }
}