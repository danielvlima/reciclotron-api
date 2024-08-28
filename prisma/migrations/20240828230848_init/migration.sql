-- CreateTable
CREATE TABLE `Usuarios` (
    `cpf` VARCHAR(11) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `telefone` VARCHAR(191) NOT NULL,
    `nome` VARCHAR(191) NOT NULL,
    `senha` LONGTEXT NOT NULL,
    `dataAniversario` DATETIME(3) NOT NULL,
    `generoUsuario` ENUM('HOMEM_CIS', 'HOMEM_TRANS', 'MULHER_CIS', 'MULHER_TRANS', 'NAO_BINARIO') NOT NULL,
    `nivelPrivilegio` ENUM('USUARIO', 'ADMINSTRADOR') NOT NULL DEFAULT 'USUARIO',
    `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `atualizadoEm` DATETIME(3) NULL,
    `pontos` INTEGER NOT NULL DEFAULT 0,
    `codigoRecuperacao` VARCHAR(191) NULL,
    `codigoRecuperacaoCriadoEm` DATETIME(3) NULL,
    `token` LONGTEXT NULL,
    `codigoRecuperacaoVerificado` BOOLEAN NULL,

    UNIQUE INDEX `Usuarios_cpf_key`(`cpf`),
    UNIQUE INDEX `Usuarios_email_key`(`email`),
    UNIQUE INDEX `Usuarios_telefone_key`(`telefone`),
    PRIMARY KEY (`cpf`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EmpresasParceiras` (
    `cnpj` VARCHAR(14) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `telefone` VARCHAR(191) NOT NULL,
    `nomeFantasia` VARCHAR(191) NOT NULL,
    `razaoSocial` VARCHAR(191) NOT NULL,
    `senha` LONGTEXT NOT NULL,
    `ramo` VARCHAR(191) NOT NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `tipoEmpresa` ENUM('FISICA', 'ONLINE', 'AMBOS') NOT NULL,
    `enderecolojaOnline` VARCHAR(191) NULL,
    `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `atualizadoEm` DATETIME(3) NULL,
    `codigoRecuperacao` VARCHAR(191) NULL,
    `codigoRecuperacaoCriadoEm` DATETIME(3) NULL,
    `logo` LONGTEXT NULL,
    `token` LONGTEXT NULL,
    `codigoRecuperacaoVerificado` BOOLEAN NULL,

    UNIQUE INDEX `EmpresasParceiras_cnpj_key`(`cnpj`),
    UNIQUE INDEX `EmpresasParceiras_email_key`(`email`),
    UNIQUE INDEX `EmpresasParceiras_telefone_key`(`telefone`),
    PRIMARY KEY (`cnpj`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Enderecos` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `rua` VARCHAR(191) NOT NULL,
    `numero` VARCHAR(191) NOT NULL,
    `complemento` VARCHAR(191) NOT NULL,
    `bairro` VARCHAR(191) NOT NULL,
    `cidade` VARCHAR(191) NOT NULL,
    `uf` VARCHAR(2) NOT NULL,
    `cep` VARCHAR(8) NOT NULL,
    `lat` DOUBLE NOT NULL,
    `long` DOUBLE NOT NULL,
    `cnpjEmpresa` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Enderecos_cnpjEmpresa_key`(`cnpjEmpresa`),
    INDEX `Enderecos_cnpjEmpresa_idx`(`cnpjEmpresa`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CuponsDesconto` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `cnpjEmpresa` VARCHAR(191) NULL,
    `nome` VARCHAR(191) NOT NULL,
    `valor` INTEGER NOT NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `regras` LONGTEXT NOT NULL,
    `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `atualizadoEm` DATETIME(3) NULL,
    `notificadoAcabouEm` DATETIME(3) NULL,
    `quantidadeDisponiveis` INTEGER NOT NULL,

    INDEX `CuponsDesconto_cnpjEmpresa_idx`(`cnpjEmpresa`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Ecopontos` (
    `id` VARCHAR(191) NOT NULL,
    `nome` VARCHAR(191) NOT NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `atualizadoEm` DATETIME(3) NULL,
    `enderecoId` BIGINT NOT NULL,
    `tipo` ENUM('TOTEM', 'BOX') NOT NULL,

    UNIQUE INDEX `Ecopontos_id_key`(`id`),
    INDEX `Ecopontos_enderecoId_idx`(`enderecoId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Materiais` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `valor` INTEGER NOT NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `atualizadoEm` DATETIME(3) NULL,
    `ehAceitoTipoEcoponto` ENUM('TOTEM', 'BOX', 'TODOS') NOT NULL,
    `logo` LONGTEXT NULL,

    UNIQUE INDEX `Materiais_nome_key`(`nome`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MateriaisDepositados` (
    `transacaoId` BIGINT NOT NULL,
    `materialId` BIGINT NOT NULL,
    `quantidade` INTEGER NOT NULL,
    `nomeMaterial` VARCHAR(191) NOT NULL,
    `valorTotal` INTEGER NOT NULL,

    INDEX `MateriaisDepositados_materialId_idx`(`materialId`),
    INDEX `MateriaisDepositados_transacaoId_idx`(`transacaoId`),
    PRIMARY KEY (`transacaoId`, `materialId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Transacoes` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `titulo` VARCHAR(191) NOT NULL,
    `usuarioCPF` VARCHAR(191) NULL,
    `tipo` ENUM('CREDITO', 'DEBITO') NOT NULL,
    `valorTotal` INTEGER NOT NULL,
    `cupomId` BIGINT NULL,
    `ecopontoId` VARCHAR(191) NULL,
    `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `status` ENUM('PENDENTE', 'EFETIVADO', 'REJEITADO') NOT NULL,
    `finalizadoEm` DATETIME(3) NULL,

    INDEX `Transacoes_cupomId_idx`(`cupomId`),
    INDEX `Transacoes_usuarioCPF_idx`(`usuarioCPF`),
    INDEX `Transacoes_ecopontoId_idx`(`ecopontoId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CuponsCompradosUsuario` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `usuarioCPF` VARCHAR(191) NULL,
    `cupomId` BIGINT NOT NULL,
    `cupomNome` VARCHAR(191) NOT NULL,
    `cupomRegras` LONGTEXT NOT NULL,
    `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `expiraEm` DATETIME(3) NOT NULL,
    `utilizadoEm` DATETIME(3) NULL,
    `notificadoExpiraEm` DATETIME(3) NULL,
    `notificadoExpiradoEm` DATETIME(3) NULL,

    INDEX `CuponsCompradosUsuario_cupomId_idx`(`cupomId`),
    INDEX `CuponsCompradosUsuario_usuarioCPF_idx`(`usuarioCPF`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SolicitacoesEcoponto` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `acao` ENUM('ADICIONAR', 'DEVOLUCAO', 'COLETAR') NOT NULL,
    `cnpjEmpresa` VARCHAR(191) NOT NULL,
    `tipoEcoponto` ENUM('TOTEM', 'BOX') NULL,
    `ecopontoId` VARCHAR(191) NULL,
    `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `atendidoEm` DATETIME(3) NULL,
    `agendadoPara` DATETIME(3) NULL,

    INDEX `SolicitacoesEcoponto_cnpjEmpresa_idx`(`cnpjEmpresa`),
    INDEX `SolicitacoesEcoponto_ecopontoId_idx`(`ecopontoId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Log` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `realizadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `acao` LONGTEXT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
