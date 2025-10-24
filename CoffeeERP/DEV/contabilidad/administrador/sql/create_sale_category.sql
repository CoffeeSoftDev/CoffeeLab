-- Tabla: sale_category
-- Descripción: Almacena las categorías de venta con sus configuraciones de impuestos por unidad de negocio

CREATE TABLE IF NOT EXISTS `sale_category` (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `udn_id` INT(11) NOT NULL COMMENT 'ID de la unidad de negocio',
    `name` VARCHAR(100) NOT NULL COMMENT 'Nombre de la categoría de venta',
    `tax_iva` TINYINT(1) NOT NULL DEFAULT 0 COMMENT 'Aplica IVA (0=No, 1=Sí)',
    `tax_ieps` TINYINT(1) NOT NULL DEFAULT 0 COMMENT 'Aplica IEPS (0=No, 1=Sí)',
    `tax_hospedaje` TINYINT(1) NOT NULL DEFAULT 0 COMMENT 'Aplica impuesto de hospedaje (0=No, 1=Sí)',
    `active` TINYINT(1) NOT NULL DEFAULT 1 COMMENT 'Estado (0=Inactivo, 1=Activo)',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación',
    `updated_at` DATETIME NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT 'Fecha de última actualización',
    PRIMARY KEY (`id`),
    INDEX `idx_udn_id` (`udn_id`),
    INDEX `idx_active` (`active`),
    INDEX `idx_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Categorías de venta con configuración de impuestos';
