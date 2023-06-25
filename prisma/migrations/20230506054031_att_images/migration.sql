/*
  Warnings:

  - You are about to drop the `Image` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `Image`;

-- CreateTable
CREATE TABLE `Imagens` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `publicId` VARCHAR(191) NOT NULL,
    `format` VARCHAR(191) NOT NULL,
    `version` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Imagens_publicId_key`(`publicId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
