import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...')

  // Apagar dados antigos
  await prisma.pizzaDoce.deleteMany()
  await prisma.bebida.deleteMany()

  // Pizzas Doces
  const pizzasDoces = [
    {
      sabor: 'Chocolate com Morango',
      descricao: 'Pizza doce com chocolate meio amargo e morangos frescos',
      precoBase: 45.90,
      imagem: 'chocolate-morango.jpg'  // Imagem em public/images/pizzas-doces
    },
    {
      sabor: 'Banana com Canela',
      descricao: 'Pizza doce com banana caramelizada e canela em pó',
      precoBase: 39.90,
      imagem: 'banana-canela.jpg'
    },
    {
      sabor: 'Prestígio',
      descricao: 'Pizza doce com chocolate e coco ralado',
      precoBase: 42.90,
      imagem: 'prestigio.jpg'
    },
    {
      sabor: 'Romeu e Julieta',
      descricao: 'Pizza doce com goiabada e queijo minas',
      precoBase: 44.90,
      imagem: 'romeu-julieta.jpg'
    },
    {
      sabor: 'Nutella com Morango',
      descricao: 'Pizza doce com nutella e morangos frescos',
      precoBase: 52.90,
      imagem: 'nutella-morango.jpg'
    }
  ]

  console.log('🍕 Criando pizzas doces...')
  for (const pizza of pizzasDoces) {
    await prisma.pizzaDoce.create({ data: pizza })
  }
  console.log(`✅ ${pizzasDoces.length} pizzas doces criadas!`)

  // Bebidas
  const bebidas = [
    {
      nome: 'Coca-Cola',
      volume: '350ml',
      preco: 5.00,
      imagem: 'coca-cola-lata.jpg'  // Imagem em public/images/bebidas
    },
    {
      nome: 'Guaraná Antarctica',
      volume: '350ml',
      preco: 4.50,
      imagem: 'guarana-lata.jpg'
    },
    {
      nome: 'Sprite',
      volume: '350ml',
      preco: 4.50,
      imagem: 'sprite-lata.jpg'
    },
    {
      nome: 'Fanta Laranja',
      volume: '350ml',
      preco: 4.50,
      imagem: 'fanta-lata.jpg'
    },
    {
      nome: 'Suco de Laranja Natural',
      volume: '500ml',
      preco: 8.00,
      imagem: 'suco-laranja.jpg'
    },
    {
      nome: 'Água Mineral',
      volume: '500ml',
      preco: 3.00,
      imagem: 'agua-mineral.jpg'
    },
    {
      nome: 'Heineken',
      volume: '330ml',
      preco: 8.00,
      imagem: 'heineken.jpg'
    },
    {
      nome: 'Brahma',
      volume: '350ml',
      preco: 6.00,
      imagem: 'brahma.jpg'
    }
  ]

  console.log('🥤 Criando bebidas...')
  for (const bebida of bebidas) {
    await prisma.bebida.create({ data: bebida })
  }
  console.log(`✅ ${bebidas.length} bebidas criadas!`)

  console.log('🎉 Seed concluído com sucesso!')
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
