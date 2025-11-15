-- CreateTable
CREATE TABLE "pizzas_doces" (
    "id" TEXT NOT NULL,
    "sabor" TEXT NOT NULL,
    "descricao" TEXT,
    "preco_base" DECIMAL(10,2) NOT NULL,
    "imagem" TEXT,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pizzas_doces_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bebidas" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "volume" TEXT,
    "preco" DECIMAL(10,2) NOT NULL,
    "imagem" TEXT,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bebidas_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "itens_pedido" ADD COLUMN "pizza_doce_id" TEXT,
ADD COLUMN "bebida_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "pizzas_doces_sabor_key" ON "pizzas_doces"("sabor");

-- AddForeignKey
ALTER TABLE "itens_pedido" ADD CONSTRAINT "itens_pedido_pizza_doce_id_fkey" FOREIGN KEY ("pizza_doce_id") REFERENCES "pizzas_doces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "itens_pedido" ADD CONSTRAINT "itens_pedido_bebida_id_fkey" FOREIGN KEY ("bebida_id") REFERENCES "bebidas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
