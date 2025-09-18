/*
  Warnings:

  - You are about to drop the column `created_at` on the `lojistas` table. All the data in the column will be lost.
  - You are about to drop the column `senha_hash` on the `lojistas` table. All the data in the column will be lost.
  - You are about to drop the column `subdominio` on the `lojistas` table. All the data in the column will be lost.
  - You are about to drop the column `cliente_nome` on the `pedidos` table. All the data in the column will be lost.
  - You are about to drop the column `cliente_whatsapp` on the `pedidos` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `pedidos` table. All the data in the column will be lost.
  - You are about to drop the column `lojista_id` on the `pedidos` table. All the data in the column will be lost.
  - You are about to drop the column `total` on the `pedidos` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `produtos` table. All the data in the column will be lost.
  - You are about to drop the column `foto_url` on the `produtos` table. All the data in the column will be lost.
  - You are about to drop the column `lojista_id` on the `produtos` table. All the data in the column will be lost.
  - You are about to drop the `pedido_itens` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[numeroVenda]` on the table `pedidos` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `lojistas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clienteEmail` to the `pedidos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clienteNome` to the `pedidos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clienteTelefone` to the `pedidos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lojistaId` to the `pedidos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numeroVenda` to the `pedidos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `pedidos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `valorTotal` to the `pedidos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lojistaId` to the `produtos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `produtos` table without a default value. This is not possible if the table is not empty.
  - Made the column `categoria` on table `produtos` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."pedido_itens" DROP CONSTRAINT "pedido_itens_pedido_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."pedido_itens" DROP CONSTRAINT "pedido_itens_produto_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."pedidos" DROP CONSTRAINT "pedidos_lojista_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."produtos" DROP CONSTRAINT "produtos_lojista_id_fkey";

-- DropIndex
DROP INDEX "public"."lojistas_subdominio_key";

-- AlterTable
ALTER TABLE "public"."lojistas" DROP COLUMN "created_at",
DROP COLUMN "senha_hash",
DROP COLUMN "subdominio",
ADD COLUMN     "cep" TEXT,
ADD COLUMN     "cidade" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "endereco" TEXT,
ADD COLUMN     "estado" TEXT,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "plano" TEXT NOT NULL DEFAULT 'basico',
ADD COLUMN     "telefone" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "nome" SET DATA TYPE TEXT,
ALTER COLUMN "email" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "public"."pedidos" DROP COLUMN "cliente_nome",
DROP COLUMN "cliente_whatsapp",
DROP COLUMN "created_at",
DROP COLUMN "lojista_id",
DROP COLUMN "total",
ADD COLUMN     "clienteEmail" TEXT NOT NULL,
ADD COLUMN     "clienteEndereco" TEXT,
ADD COLUMN     "clienteNome" TEXT NOT NULL,
ADD COLUMN     "clienteTelefone" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "lojistaId" INTEGER NOT NULL,
ADD COLUMN     "numeroVenda" TEXT NOT NULL,
ADD COLUMN     "observacoes" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "valorTotal" DECIMAL(10,2) NOT NULL,
ALTER COLUMN "status" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "public"."produtos" DROP COLUMN "created_at",
DROP COLUMN "foto_url",
DROP COLUMN "lojista_id",
ADD COLUMN     "cores" TEXT[],
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "estoque" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "imagens" TEXT[],
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "lojistaId" INTEGER NOT NULL,
ADD COLUMN     "tamanhos" TEXT[],
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "nome" SET DATA TYPE TEXT,
ALTER COLUMN "categoria" SET NOT NULL,
ALTER COLUMN "categoria" SET DATA TYPE TEXT;

-- DropTable
DROP TABLE "public"."pedido_itens";

-- CreateTable
CREATE TABLE "public"."users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'admin',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."itens_pedido" (
    "id" SERIAL NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "precoUnit" DECIMAL(10,2) NOT NULL,
    "tamanho" TEXT,
    "cor" TEXT,
    "pedidoId" INTEGER NOT NULL,
    "produtoId" INTEGER NOT NULL,

    CONSTRAINT "itens_pedido_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "pedidos_numeroVenda_key" ON "public"."pedidos"("numeroVenda");

-- AddForeignKey
ALTER TABLE "public"."produtos" ADD CONSTRAINT "produtos_lojistaId_fkey" FOREIGN KEY ("lojistaId") REFERENCES "public"."lojistas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."pedidos" ADD CONSTRAINT "pedidos_lojistaId_fkey" FOREIGN KEY ("lojistaId") REFERENCES "public"."lojistas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."itens_pedido" ADD CONSTRAINT "itens_pedido_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "public"."pedidos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."itens_pedido" ADD CONSTRAINT "itens_pedido_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "public"."produtos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
