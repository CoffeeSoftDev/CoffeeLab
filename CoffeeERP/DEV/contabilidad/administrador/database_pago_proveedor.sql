-- Base de datos para el módulo de Pagos a Proveedor
-- Sistema: CoffeeSoft - Contabilidad

-- Tabla: proveedores
CREATE TABLE IF NOT EXISTS `proveedores` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(255) NOT NULL,
  `rfc` VARCHAR(13) DEFAULT NULL,
  `telefono` VARCHAR(20) DEFAULT NULL,
  `email` VARCHAR(100) DEFAULT NULL,
  `direccion` TEXT DEFAULT NULL,
  `active` TINYINT(1) DEFAULT 1,
  `fecha_registro` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_nombre` (`nombre`),
  INDEX `idx_active` (`active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: tipo_pago
CREATE TABLE IF NOT EXISTS `tipo_pago` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `tipo` VARCHAR(100) NOT NULL,
  `descripcion` TEXT DEFAULT NULL,
  `active` TINYINT(1) DEFAULT 1,
  PRIMARY KEY (`id`),
  INDEX `idx_active` (`active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: pago_proveedor
CREATE TABLE IF NOT EXISTS `pago_proveedor` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `proveedor_id` INT(11) NOT NULL,
  `tipo_pago_id` INT(11) NOT NULL,
  `monto` DECIMAL(10,2) NOT NULL,
  `fecha_pago` DATE NOT NULL,
  `descripcion` TEXT DEFAULT NULL,
  `usuario_id` INT(11) DEFAULT NULL,
  `fecha_registro` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_proveedor` (`proveedor_id`),
  INDEX `idx_tipo_pago` (`tipo_pago_id`),
  INDEX `idx_fecha_pago` (`fecha_pago`),
  FOREIGN KEY (`proveedor_id`) REFERENCES `proveedores`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`tipo_pago_id`) REFERENCES `tipo_pago`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Datos iniciales para tipo_pago
INSERT INTO `tipo_pago` (`id`, `tipo`, `descripcion`, `active`) VALUES
(1, 'Fondo Fijo', 'Pagos realizados desde el fondo fijo de la empresa', 1),
(2, 'Corporativo', 'Pagos realizados desde cuentas corporativas', 1);

-- Datos de ejemplo para proveedores (opcional)
INSERT INTO `proveedores` (`nombre`, `rfc`, `telefono`, `email`, `active`) VALUES
('Proveedor Ejemplo 1', 'XAXX010101000', '5551234567', 'proveedor1@example.com', 1),
('Proveedor Ejemplo 2', 'XAXX010101001', '5559876543', 'proveedor2@example.com', 1);
