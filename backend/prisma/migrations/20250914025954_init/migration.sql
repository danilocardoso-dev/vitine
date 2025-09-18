-- CreateTable
CREATE TABLE "public"."lojistas" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(100) NOT NULL,
    "subdominio" VARCHAR(50) NOT NULL,
    "email" VARCHAR(120) NOT NULL,
    "senha_hash" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lojistas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."produtos" (
    "id" SERIAL NOT NULL,
    "lojista_id" INTEGER NOT NULL,
    "nome" VARCHAR(150) NOT NULL,
    "preco" DECIMAL(10,2) NOT NULL,
    "categoria" VARCHAR(80),
    "descricao" TEXT,
    "foto_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "produtos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."pedidos" (
    "id" SERIAL NOT NULL,
    "lojista_id" INTEGER NOT NULL,
    "cliente_nome" VARCHAR(150),
    "cliente_whatsapp" VARCHAR(30),
    "total" DECIMAL(10,2) NOT NULL,
    "status" VARCHAR(30) NOT NULL DEFAULT 'pendente',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pedidos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."pedido_itens" (
    "id" SERIAL NOT NULL,
    "pedido_id" INTEGER NOT NULL,
    "produto_id" INTEGER NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "preco_unit" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "pedido_itens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "lojistas_subdominio_key" ON "public"."lojistas"("subdominio");

-- CreateIndex
CREATE UNIQUE INDEX "lojistas_email_key" ON "public"."lojistas"("email");

-- AddForeignKey
ALTER TABLE "public"."produtos" ADD CONSTRAINT "produtos_lojista_id_fkey" FOREIGN KEY ("lojista_id") REFERENCES "public"."lojistas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."pedidos" ADD CONSTRAINT "pedidos_lojista_id_fkey" FOREIGN KEY ("lojista_id") REFERENCES "public"."lojistas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."pedido_itens" ADD CONSTRAINT "pedido_itens_pedido_id_fkey" FOREIGN KEY ("pedido_id") REFERENCES "public"."pedidos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."pedido_itens" ADD CONSTRAINT "pedido_itens_produto_id_fkey" FOREIGN KEY ("produto_id") REFERENCES "public"."produtos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
