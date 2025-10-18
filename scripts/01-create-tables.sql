-- Criar tabela de usuários
CREATE TABLE IF NOT EXISTS usuarios (
  id TEXT PRIMARY KEY,
  nome TEXT NOT NULL,
  cpf TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE,
  senha TEXT,
  telefone TEXT,
  rua TEXT,
  numero TEXT,
  complemento TEXT,
  bairro TEXT,
  cidade TEXT,
  estado TEXT,
  cep TEXT,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criar tabela de pizzas
CREATE TABLE IF NOT EXISTS pizzas (
  id TEXT PRIMARY KEY,
  sabor TEXT UNIQUE NOT NULL,
  descricao TEXT,
  preco_base DECIMAL(10, 2) NOT NULL,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criar tabela de pedidos
CREATE TABLE IF NOT EXISTS pedidos (
  id TEXT PRIMARY KEY,
  usuario_id TEXT NOT NULL,
  data_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status TEXT DEFAULT 'Recebido',
  valor_total DECIMAL(10, 2),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Criar tabela de itens de pedido
CREATE TABLE IF NOT EXISTS itens_pedido (
  id TEXT PRIMARY KEY,
  pedido_id TEXT NOT NULL,
  pizza_id TEXT NOT NULL,
  tamanho TEXT NOT NULL,
  quantidade INTEGER NOT NULL,
  FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE,
  FOREIGN KEY (pizza_id) REFERENCES pizzas(id) ON DELETE RESTRICT
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_pedidos_usuario ON pedidos(usuario_id);
CREATE INDEX IF NOT EXISTS idx_itens_pedido ON itens_pedido(pedido_id);
CREATE INDEX IF NOT EXISTS idx_itens_pizza ON itens_pedido(pizza_id);
