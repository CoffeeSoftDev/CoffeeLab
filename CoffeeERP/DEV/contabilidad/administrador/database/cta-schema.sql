-- Tabla: mayor_account (Cuentas de Mayor)
CREATE TABLE IF NOT EXISTS `mayor_account` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `udn_id` INT(11) NOT NULL COMMENT 'Unidad de negocio',
  `name` VARCHAR(255) NOT NULL COMMENT 'Nombre de la cuenta de mayor',
  `description` TEXT NULL COMMENT 'Descripción de la cuenta',
  `active` TINYINT(1) NOT NULL DEFAULT 1 COMMENT '1=Activo, 0=Inactivo',
  `date_creation` DATETIME NOT NULL COMMENT 'Fecha de creación',
  PRIMARY KEY (`id`),
  INDEX `idx_udn` (`udn_id`),
  INDEX `idx_active` (`active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Cuentas de mayor por unidad de negocio';

-- Tabla: sub_account (Subcuentas de Mayor)
CREATE TABLE IF NOT EXISTS `sub_account` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `udn_id` INT(11) NOT NULL COMMENT 'Unidad de negocio',
  `mayor_account_id` INT(11) NOT NULL COMMENT 'Cuenta de mayor padre',
  `name` VARCHAR(255) NOT NULL COMMENT 'Nombre de la subcuenta',
  `description` TEXT NULL COMMENT 'Descripción de la subcuenta',
  `active` TINYINT(1) NOT NULL DEFAULT 1 COMMENT '1=Activo, 0=Inactivo',
  `date_creation` DATETIME NOT NULL COMMENT 'Fecha de creación',
  PRIMARY KEY (`id`),
  INDEX `idx_udn` (`udn_id`),
  INDEX `idx_mayor_account` (`mayor_account_id`),
  INDEX `idx_active` (`active`),
  FOREIGN KEY (`mayor_account_id`) REFERENCES `mayor_account`(`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Subcuentas de mayor';

-- Tabla: purchase_type (Tipos de Compra)
CREATE TABLE IF NOT EXISTS `purchase_type` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `udn_id` INT(11) NOT NULL COMMENT 'Unidad de negocio',
  `name` VARCHAR(255) NOT NULL COMMENT 'Nombre del tipo de compra',
  `description` TEXT NULL COMMENT 'Descripción del tipo',
  `active` TINYINT(1) NOT NULL DEFAULT 1 COMMENT '1=Activo, 0=Inactivo',
  `date_creation` DATETIME NOT NULL COMMENT 'Fecha de creación',
  PRIMARY KEY (`id`),
  INDEX `idx_udn` (`udn_id`),
  INDEX `idx_active` (`active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Tipos de compra';

-- Tabla: payment_method (Formas de Pago)
CREATE TABLE IF NOT EXISTS `payment_method` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `udn_id` INT(11) NOT NULL COMMENT 'Unidad de negocio',
  `name` VARCHAR(255) NOT NULL COMMENT 'Nombre de la forma de pago',
  `description` TEXT NULL COMMENT 'Descripción',
  `active` TINYINT(1) NOT NULL DEFAULT 1 COMMENT '1=Activo, 0=Inactivo',
  `date_creation` DATETIME NOT NULL COMMENT 'Fecha de creación',
  PRIMARY KEY (`id`),
  INDEX `idx_udn` (`udn_id`),
  INDEX `idx_active` (`active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Formas de pago';

-- Tabla: product_class (Clasificación de Productos - basada en el diagrama)
CREATE TABLE IF NOT EXISTS `product_class` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `udn_id` INT(11) NOT NULL COMMENT 'Unidad de negocio',
  `name` VARCHAR(255) NOT NULL COMMENT 'Nombre de la clasificación',
  `description` TEXT NULL COMMENT 'Descripción',
  `active` TINYINT(1) NOT NULL DEFAULT 1 COMMENT '1=Activo, 0=Inactivo',
  PRIMARY KEY (`id`),
  INDEX `idx_udn` (`udn_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Clasificación de productos';

-- Tabla: product (Productos - basada en el diagrama)
CREATE TABLE IF NOT EXISTS `product` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `class_insumo_id` INT(11) NOT NULL COMMENT 'Clasificación del producto',
  `name` VARCHAR(255) NOT NULL COMMENT 'Nombre del producto',
  `active` TINYINT(1) NOT NULL DEFAULT 1 COMMENT '1=Activo, 0=Inactivo',
  PRIMARY KEY (`id`),
  INDEX `idx_class` (`class_insumo_id`),
  FOREIGN KEY (`class_insumo_id`) REFERENCES `product_class`(`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Productos/Insumos';

-- Datos de ejemplo para mayor_account
INSERT INTO `mayor_account` (`udn_id`, `name`, `description`, `active`, `date_creation`) VALUES
(1, 'Activo fijo', 'Bienes de larga duración', 1, NOW()),
(1, 'Costo directo', 'Costos directamente relacionados con producción', 1, NOW()),
(1, 'Costo indirecto', 'Costos indirectos de operación', 1, NOW()),
(1, 'Almacén', 'Inventario y almacenamiento', 1, NOW()),
(1, 'Gastos de administración', 'Gastos administrativos generales', 1, NOW());
