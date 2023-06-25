/*
  Warnings:

  - You are about to drop the column `desconto` on the `DetalhesPedido` table. All the data in the column will be lost.
  - You are about to drop the column `preco` on the `Pedido` table. All the data in the column will be lost.
  - Added the required column `metodoEntrega` to the `Pedido` table without a default value. This is not possible if the table is not empty.
  - Added the required column `precoTotal` to the `Pedido` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `DetalhesPedido` DROP COLUMN `desconto`;

-- AlterTable
ALTER TABLE `Pedido` DROP COLUMN `preco`,
    ADD COLUMN `desconto` DECIMAL(18, 2) NULL,
    ADD COLUMN `descricao` VARCHAR(191) NULL,
    ADD COLUMN `metodoEntrega` VARCHAR(191) NOT NULL,
    ADD COLUMN `originadoPlataforma` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `pago` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `precoTotal` DECIMAL(18, 2) NOT NULL,
    MODIFY `situacaoId` INTEGER NOT NULL DEFAULT 1;
