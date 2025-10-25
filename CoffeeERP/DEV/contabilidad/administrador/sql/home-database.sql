-- Base de datos para el módulo Home
-- Sistema de Contabilidad CoffeeSoft

-- Tabla: sales (Ventas)
CREATE TABLE IF NOT EXISTS `rfwsmqex_contabilidad`.`sales` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `folio` VARCHAR(50) NULL,
    `total` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    `date_sale` DATE NOT NULL,
    `udn_id` INT NOT NULL,
    `active` TINYINT(1) NOT NULL DEFAULT 1,
    `date_create` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `date_update` DATETIME NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    INDEX `idx_date_sale` (`date_sale`),
    INDEX `idx_udn_id` (`udn_id`),
    INDEX `idx_active` (`active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: purchases (Compras)
CREATE TABLE IF NOT EXISTS `rfwsmqex_contabilidad`.`purchases` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `folio` VARCHAR(50) NULL,
    `total` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    `date_purchase` DATE NOT NULL,
    `supplier_id` INT NULL,
    `udn_id` INT NOT NULL,
    `active` TINYINT(1) NOT NULL DEFAULT 1,
    `date_create` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `date_update` DATETIME NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    INDEX `idx_date_purchase` (`date_purchase`),
    INDEX `idx_udn_id` (`udn_id`),
    INDEX `idx_active` (`active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: files (Archivos)
CREATE TABLE IF NOT EXISTS `rfwsmqex_contabilidad`.`files` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `path` VARCHAR(500) NOT NULL,
    `type` VARCHAR(50) NULL,
    `size` INT NULL,
    `date_upload` DATE NOT NULL,
    `udn_id` INT NOT NULL,
    `active` TINYINT(1) NOT NULL DEFAULT 1,
    `date_create` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `date_update` DATETIME NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    INDEX `idx_date_upload` (`date_upload`),
    INDEX `idx_udn_id` (`udn_id`),
    INDEX `idx_active` (`active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: withdrawals (Retiros)
CREATE TABLE IF NOT EXISTS `rfwsmqex_contabilidad`.`withdrawals` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `folio` VARCHAR(50) NULL,
    `amount` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    `concept` VARCHAR(255) NULL,
    `date_withdrawal` DATE NOT NULL,
    `udn_id` INT NOT NULL,
    `active` TINYINT(1) NOT NULL DEFAULT 1,
    `date_create` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `date_update` DATETIME NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    INDEX `idx_date_withdrawal` (`date_withdrawal`),
    INDEX `idx_udn_id` (`udn_id`),
    INDEX `idx_active` (`active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: udn (Unidades de Negocio) - Si no existe
CREATE TABLE IF NOT EXISTS `rfwsmqex_contabilidad`.`udn` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `valor` VARCHAR(100) NOT NULL,
    `description` TEXT NULL,
    `active` TINYINT(1) NOT NULL DEFAULT 1,
    `date_create` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `date_update` DATETIME NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    INDEX `idx_active` (`active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Datos de ejemplo para UDN
INSERT INTO `rfwsmqex_contabilidad`.`udn` (`valor`, `active`) VALUES
('Unidad Principal', 1),
('Sucursal Norte', 1),
('Sucursal Sur', 1)
ON DUPLICATE KEY UPDATE `valor` = VALUES(`valor`);
