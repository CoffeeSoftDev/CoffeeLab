-- Tabla: supplier (Proveedores)
-- Base de datos: rfwsmqex_contabilidad
-- Descripción: Gestión de proveedores por unidad de negocio

CREATE TABLE IF NOT EXISTS `supplier` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL COMMENT 'Nombre del proveedor',
  `udn_id` INT(11) NOT NULL COMMENT 'ID de la unidad de negocio (FK a tabla udn)',
  `active` TINYINT(1) NOT NULL DEFAULT 1 COMMENT '1=Activo, 0=Inactivo',
  PRIMARY KEY (`id`),
  KEY `idx_udn_id` (`udn_id`),
  KEY `idx_active` (`active`),
  KEY `idx_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Proveedores por unidad de negocio';

-- Índices adicionales para optimización
ALTER TABLE `supplier`
  ADD INDEX `idx_udn_active` (`udn_id`, `active`),
  ADD INDEX `idx_name_udn` (`name`, `udn_id`);

-- Comentarios de columnas
ALTER TABLE `supplier`
  MODIFY COLUMN `id` INT(11) NOT NULL AUTO_INCREMENT COMMENT 'ID único del proveedor',
  MODIFY COLUMN `name` VARCHAR(255) NOT NULL COMMENT 'Nombre completo del proveedor',
  MODIFY COLUMN `udn_id` INT(11) NOT NULL COMMENT 'Relación con unidad de negocio',
  MODIFY COLUMN `active` TINYINT(1) NOT NULL DEFAULT 1 COMMENT 'Estado: 1=Activo, 0=Inactivo';

-- Datos de ejemplo (opcional - comentar si no se requiere)
-- INSERT INTO `supplier` (`name`, `udn_id`, `active`) VALUES
-- ('Marina Chiapas', 1, 1),
-- ('American Express', 1, 1),
-- ('Asociación de plataneros', 2, 1),
-- ('Cliente no frecuente', 3, 0);
