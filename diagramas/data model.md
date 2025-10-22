::: mermaid
erDiagram
  Pizza {
    String id PK
    String nome
    String descricao
    Decimal precoBase
    String imagem
    DateTime criadoEm
  }

  PizzaDoce {
    String id PK
    String nome
    String descricao
    Decimal precoBase
    String imagem
    DateTime criadoEm
  }

  Bebida {
    String id PK
    String nome
    String volume
    Decimal preco
    String imagem
    DateTime criadoEm
  }

  Pedido {
    String id PK
    String usuarioId
    Decimal valorTotal
    String status
    DateTime criadoEm
  }

  ItemPedido {
    String id PK
    String pedidoId FK
    String pizzaId 
    String pizzaDoceId
    String bebidaId
    Int quantidade
  }

  Pedido ||--o{ ItemPedido : "contém"
  Pizza ||--o{ ItemPedido : "ref por pizzaId"
  PizzaDoce ||--o{ ItemPedido : "ref por pizzaDoceId"
  Bebida ||--o{ ItemPedido : "ref por bebidaId"
:::