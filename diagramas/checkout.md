sequenceDiagram
  participant U as Usuário
  participant Menu as /menu (Client)
  participant Cart as CartProvider/useCart
  participant Checkout as /checkout (Client)
  participant SA as criarPedido (Server Action)
  participant DB as Prisma/Postgres

  U->>Menu: Abre /menu
  Menu->>SA: getPizzas/getPizzasDoces/getBebidas
  SA->>DB: SELECT ...
  DB-->>SA: rows
  SA-->>Menu: lista

  U->>Menu: Clica "Adicionar"
  Menu->>Cart: addItem({id,type,precoUnit,...})

  U->>Checkout: Vai para /checkout
  Checkout->>Cart: items, total
  U->>Checkout: Clica "Pagar"
  Checkout->>SA: criarPedido({usuarioId, total, itens[{id,type,quantidade}]})
  SA->>DB: INSERT Pedido, INSERT ItemPedido (polimórfico)
  DB-->>SA: OK
  SA-->>Checkout: Pedido criado
  Checkout-->>U: Confirmação