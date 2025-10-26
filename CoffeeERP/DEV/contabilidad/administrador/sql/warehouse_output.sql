-- Tabla: warehouse_output
-- Descripción: Almacena las salidas de almacén del sistema
-- Fecha de creación: 2025-01-12

CREATE TABLE IF NOT EXISTS `warehouse_output` (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `insumo_id` INT(11) NOT NULL COMMENT 'ID del insumo/almacén',
    `amount` DECIMAL(10,2) NOT NULL DEFAULT 0.00 COMMENT 'Cantidad/Monto de la salida',
    `description` TEXT NULL COMMENT 'Descripción opcional de la salida',
    `operation_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de la operación',
    `active` TINYINT(1) NOT NULL DEFAULT 1 COMMENT '1=Activo, 0=Eliminado',
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    INDEX `idx_insumo` (`insumo_id`),
    INDEX `idx_active` (`active`),
    INDEX `idx_operation_date` (`operation_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Salidas de almacén';

-- Datos de ejemplo (opcional)
-- INSERT INTO `warehouse_output` (`insumo_id`, `amount`, `description`, `operation_date`) VALUES
-- (1, 419.31, 'Donec luctus mauris quia libero luctus elementum.', '2025-01-10 10:30:00'),
-- (2, 24.00, 'Nam vulputat eget odio vel vulputate', '2025-01-11 14:15:00'),
-- (3, 343.00, '', '2025-01-12 09:00:00');
