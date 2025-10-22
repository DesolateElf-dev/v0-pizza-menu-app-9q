flowchart LR
  subgraph Browser [Cliente (React 19)]
    A[/Menu (/menu)/]
    B[/Checkout (/checkout)/]
    C[/Pedidos (/pedidos)/]
    Ctx[(CartProvider<br/>useCart)]
    Card[Product/Pizza Card]
  end

  subgraph NextApp [Next.js (App Router)]
    LA[app/layout.tsx<br/>CartProvider]
    SA1[Server Action<br/>getPizzas/getPizzasDoces/getBebidas]
    SA2[Server Action<br/>criarPedido]
    SA3[Server Action<br/>getPedidos]
    Prisma[Prisma Client]
  end

  subgraph DB [(PostgreSQL)]
    T1[(Pizza)]
    T2[(PizzaDoce)]
    T3[(Bebida)]
    T4[(Pedido)]
    T5[(ItemPedido)]
  end

  A -->|listar/Adicionar| Ctx
  Card -->|addItem(type,id,preco)| Ctx
  A -->|SSR/SA| SA1 --> Prisma --> T1 & T2 & T3

  B -->|Confirmar Pedido| SA2 --> Prisma --> T4 & T5
  C -->|Histórico| SA3 --> Prisma --> T4 & T5

  LA -.-> Ctx