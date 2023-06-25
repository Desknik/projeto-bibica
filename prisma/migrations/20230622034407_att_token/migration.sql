/*
  Warnings:

  - You are about to drop the column `token` on the `Usuario` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Usuario` DROP COLUMN `token`,
    ADD COLUMN `dataExpiracaoToken` DATETIME(0) NULL,
    ADD COLUMN `tokenAlterarSenha` VARCHAR(191) NULL;
