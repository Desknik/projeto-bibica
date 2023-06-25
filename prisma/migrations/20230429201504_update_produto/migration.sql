/*
  Warnings:

  - Added the required column `descricao` to the `Produto` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Produto` ADD COLUMN `descricao` VARCHAR(150) NOT NULL;
