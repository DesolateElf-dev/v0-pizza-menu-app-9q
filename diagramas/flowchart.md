::: mermaid
flowchart LR
    subgraph Cliente ["Cliente (React 19)"]
        A[Menu /menu]
        B[Checkout /checkout]
        C[Pedidos /pedidos]
        Ctx[CartProvider useCart]
        Card[Product Card]
    end

    subgraph NextJS ["Next.js App Router"]
        LA[app/layout.tsx CartProvider]
        SA1[getPizzas Server Action]
        SA2[criarPedido Server Action]
        SA3[getPedidos Server Action]
        Prisma[Prisma Client]
    end

    subgraph Database ["PostgreSQL"]
        T1[Pizza]
        T2[PizzaDoce]
        T3[Bebida]
        T4[Pedido]
        T5[ItemPedido]
    end

    A --> Ctx
    Card --> Ctx
    A --> SA1
    SA1 --> Prisma
    Prisma --> T1
    Prisma --> T2
    Prisma --> T3

    B --> SA2
    SA2 --> Prisma
    Prisma --> T4
    Prisma --> T5

    C --> SA3
    SA3 --> Prisma

    LA -.-> Ctx

:::