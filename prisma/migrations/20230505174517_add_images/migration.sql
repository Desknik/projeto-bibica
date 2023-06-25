/*
  Warnings:

  - You are about to drop the column `imagem` on the `Decoracoes` table. All the data in the column will be lost.
  - You are about to drop the column `imagem` on the `Produto` table. All the data in the column will be lost.
  - Added the required column `imagemId` to the `Decoracoes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imagemId` to the `Produto` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Decoracoes` DROP COLUMN `imagem`,
    ADD COLUMN `imagemId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `Produto` DROP COLUMN `imagem`,
    ADD COLUMN `imagemId` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `Image` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `publicId` VARCHAR(191) NOT NULL,
    `format` VARCHAR(191) NOT NULL,
    `version` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Image_publicId_key`(`publicId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `Decoracoes_imagemId_idx` ON `Decoracoes`(`imagemId`);

-- CreateIndex
CREATE INDEX `Produto_imagemId_idx` ON `Produto`(`imagemId`);
