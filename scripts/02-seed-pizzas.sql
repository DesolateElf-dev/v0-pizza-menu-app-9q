-- Inserir pizzas no cardápio (apenas se não existirem)
INSERT INTO pizzas (id, sabor, descricao, preco_base)
VALUES 
  ('pizza-1', 'Margherita', 'Molho de tomate, mussarela, manjericão fresco e azeite', 35.00),
  ('pizza-2', 'Calabresa', 'Calabresa fatiada, cebola, mussarela e azeitonas', 38.00),
  ('pizza-3', 'Portuguesa', 'Presunto, ovos, cebola, azeitonas, mussarela e ervilha', 42.00),
  ('pizza-4', 'Quatro Queijos', 'Mussarela, provolone, parmesão e gorgonzola', 45.00),
  ('pizza-5', 'Frango com Catupiry', 'Frango desfiado, catupiry, milho e mussarela', 40.00)
ON CONFLICT (sabor) DO NOTHING;
