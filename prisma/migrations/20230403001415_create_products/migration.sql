-- CreateTable
CREATE TABLE `Usuario` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `classeUsuario` INTEGER NOT NULL,
    `nickname` VARCHAR(40) NOT NULL,
    `email` VARCHAR(75) NOT NULL,
    `senha` VARCHAR(50) NOT NULL,

    INDEX `Usuario_classeUsuario_idx`(`classeUsuario`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ClasseUsuario` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tipo` VARCHAR(10) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DadosUsuario` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `usuarioId` INTEGER NOT NULL,
    `nome` VARCHAR(50) NOT NULL,
    `endereco` VARCHAR(50) NULL,
    `num_casa` VARCHAR(5) NULL,
    `complemento` VARCHAR(40) NULL,
    `cep` VARCHAR(8) NULL,
    `cidade` VARCHAR(40) NULL,
    `bairro` VARCHAR(40) NULL,
    `uf` VARCHAR(2) NULL,
    `telefone` VARCHAR(13) NULL,

    UNIQUE INDEX `DadosUsuario_usuarioId_key`(`usuarioId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Produto` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(50) NOT NULL,
    `img` LONGBLOB NOT NULL,
    `disponivel` BOOLEAN NOT NULL DEFAULT true,
    `categoria` INTEGER NOT NULL,
    `subcategoria` INTEGER NULL,
    `unidadeMedida` INTEGER NOT NULL,
    `sabor` INTEGER NOT NULL,
    `cor` INTEGER NOT NULL,
    `precoUnitario` DECIMAL(18, 2) NOT NULL,

    INDEX `Produto_unidadeMedida_idx`(`unidadeMedida`),
    INDEX `Produto_categoria_idx`(`categoria`),
    INDEX `Produto_subcategoria_idx`(`subcategoria`),
    INDEX `Produto_sabor_idx`(`sabor`),
    INDEX `Produto_cor_idx`(`cor`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Categoria` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tipo` VARCHAR(40) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SubCategoria` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tipo` VARCHAR(40) NOT NULL,
    `categoria` INTEGER NOT NULL,

    INDEX `SubCategoria_categoria_idx`(`categoria`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UnidadeMedida` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tipo` VARCHAR(20) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Sabor` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sabor` VARCHAR(40) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Cor` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `cor` VARCHAR(40) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
