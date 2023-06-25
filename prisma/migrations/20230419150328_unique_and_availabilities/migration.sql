/*
  Warnings:

  - You are about to drop the column `num_casa` on the `DadosUsuario` table. All the data in the column will be lost.
  - You are about to drop the column `categoria` on the `Produto` table. All the data in the column will be lost.
  - You are about to drop the column `cor` on the `Produto` table. All the data in the column will be lost.
  - You are about to drop the column `img` on the `Produto` table. All the data in the column will be lost.
  - You are about to drop the column `sabor` on the `Produto` table. All the data in the column will be lost.
  - You are about to drop the column `subcategoria` on the `Produto` table. All the data in the column will be lost.
  - You are about to drop the column `unidadeMedida` on the `Produto` table. All the data in the column will be lost.
  - You are about to drop the column `categoria` on the `SubCategoria` table. All the data in the column will be lost.
  - You are about to drop the column `classeUsuario` on the `Usuario` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[tipo]` on the table `Categoria` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[cor]` on the table `Cor` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[sabor]` on the table `Sabor` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[tipo]` on the table `SubCategoria` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[tipo]` on the table `UnidadeMedida` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `categoriaId` to the `Produto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `corId` to the `Produto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imagem` to the `Produto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `saborId` to the `Produto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unidadeMedidaId` to the `Produto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `categoriaId` to the `SubCategoria` table without a default value. This is not possible if the table is not empty.
  - Added the required column `classeUsuarioId` to the `Usuario` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Produto_categoria_idx` ON `Produto`;

-- DropIndex
DROP INDEX `Produto_cor_idx` ON `Produto`;

-- DropIndex
DROP INDEX `Produto_sabor_idx` ON `Produto`;

-- DropIndex
DROP INDEX `Produto_subcategoria_idx` ON `Produto`;

-- DropIndex
DROP INDEX `Produto_unidadeMedida_idx` ON `Produto`;

-- DropIndex
DROP INDEX `SubCategoria_categoria_idx` ON `SubCategoria`;

-- DropIndex
DROP INDEX `Usuario_classeUsuario_idx` ON `Usuario`;

-- AlterTable
ALTER TABLE `Categoria` ADD COLUMN `disponivel` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `Cor` ADD COLUMN `disponivel` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `DadosUsuario` DROP COLUMN `num_casa`,
    ADD COLUMN `numCasa` VARCHAR(5) NULL;

-- AlterTable
ALTER TABLE `Produto` DROP COLUMN `categoria`,
    DROP COLUMN `cor`,
    DROP COLUMN `img`,
    DROP COLUMN `sabor`,
    DROP COLUMN `subcategoria`,
    DROP COLUMN `unidadeMedida`,
    ADD COLUMN `categoriaId` INTEGER NOT NULL,
    ADD COLUMN `corId` INTEGER NOT NULL,
    ADD COLUMN `imagem` LONGBLOB NOT NULL,
    ADD COLUMN `saborId` INTEGER NOT NULL,
    ADD COLUMN `subCategoriaId` INTEGER NULL,
    ADD COLUMN `unidadeMedidaId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `Sabor` ADD COLUMN `disponivel` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `SubCategoria` DROP COLUMN `categoria`,
    ADD COLUMN `categoriaId` INTEGER NOT NULL,
    ADD COLUMN `disponivel` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `Usuario` DROP COLUMN `classeUsuario`,
    ADD COLUMN `classeUsuarioId` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `Situacao` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `situacao` VARCHAR(15) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pedido` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `situacaoId` INTEGER NOT NULL,
    `usuarioId` INTEGER NOT NULL,
    `dataPedido` DATETIME(0) NOT NULL,
    `dataEntrega` DATETIME(0) NULL,
    `preco` DECIMAL(18, 2) NOT NULL,

    INDEX `Pedido_situacaoId_idx`(`situacaoId`),
    INDEX `Pedido_usuarioId_idx`(`usuarioId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DetalhesPedido` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pedidoId` INTEGER NOT NULL,
    `produtoId` INTEGER NOT NULL,
    `quant` INTEGER NOT NULL,
    `desconto` DECIMAL(18, 2) NOT NULL,
    `precoUnitario` DECIMAL(18, 2) NOT NULL,

    INDEX `DetalhesPedido_pedidoId_idx`(`pedidoId`),
    INDEX `DetalhesPedido_produtoId_idx`(`produtoId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Decoracoes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `imagem` LONGBLOB NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Categoria_tipo_key` ON `Categoria`(`tipo`);

-- CreateIndex
CREATE UNIQUE INDEX `Cor_cor_key` ON `Cor`(`cor`);

-- CreateIndex
CREATE INDEX `Produto_unidadeMedidaId_idx` ON `Produto`(`unidadeMedidaId`);

-- CreateIndex
CREATE INDEX `Produto_categoriaId_idx` ON `Produto`(`categoriaId`);

-- CreateIndex
CREATE INDEX `Produto_subCategoriaId_idx` ON `Produto`(`subCategoriaId`);

-- CreateIndex
CREATE INDEX `Produto_saborId_idx` ON `Produto`(`saborId`);

-- CreateIndex
CREATE INDEX `Produto_corId_idx` ON `Produto`(`corId`);

-- CreateIndex
CREATE UNIQUE INDEX `Sabor_sabor_key` ON `Sabor`(`sabor`);

-- CreateIndex
CREATE UNIQUE INDEX `SubCategoria_tipo_key` ON `SubCategoria`(`tipo`);

-- CreateIndex
CREATE INDEX `SubCategoria_categoriaId_idx` ON `SubCategoria`(`categoriaId`);

-- CreateIndex
CREATE UNIQUE INDEX `UnidadeMedida_tipo_key` ON `UnidadeMedida`(`tipo`);

-- CreateIndex
CREATE INDEX `Usuario_classeUsuarioId_idx` ON `Usuario`(`classeUsuarioId`);
