/*
  Warnings:

  - A unique constraint covering the columns `[tipo]` on the table `ClasseUsuario` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[situacao]` on the table `Situacao` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `ClasseUsuario_tipo_key` ON `ClasseUsuario`(`tipo`);

-- CreateIndex
CREATE UNIQUE INDEX `Situacao_situacao_key` ON `Situacao`(`situacao`);
