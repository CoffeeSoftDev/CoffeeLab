-- =====================================================
-- Base de Datos: rfwsmqex_contabilidad
-- Módulo: Pago a Proveedores
-- Descripción: Tablas para gestionar proveedores y pagos
-- =====================================================

-- Tabla: supplier
-- Descripción: Guarda y enlista los proveedores disponibles por unidad de negocio
CREATE TABLE IF NOT EXISTS `supplier` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `udn_id` INT(11) NOT NULL COMMENT 'FK: Unidad de negocio',
  `name` VARCHAR(100) NOT NULL COMMENT 'Nombre del proveedor',
  `rfc` TEXT DEFAULT NULL COMMENT 'RFC del proveedor',
  `phone` CHAR(15) DEFAULT NULL COMMENT 'Teléfono de contacto',
  `email` TEXT DEFAULT NULL COMMENT 'Correo electrónico',
  `balance` DECIMAL(12,2) DEFAULT 0.00 COMMENT 'Deuda actual con el proveedor',
  `active` TINYINT(1) DEFAULT 1 COMMENT '1=Activo, 0=Inactivo',
  PRIMARY KEY (`id`),
  KEY `idx_udn` (`udn_id`),
  KEY `idx_active` (`active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Proveedores por unidad de negocio';

-- Tabla: supplier_payment
-- Descripción: Registra los pagos realizados a proveedores
CREATE TABLE IF NOT EXISTS `supplier_payment` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `supplier_id` INT(11) NOT NULL COMMENT 'FK: Proveedor',
  `amount` DECIMAL(12,2) NOT NULL COMMENT 'Monto del pago',
  `description` TEXT DEFAULT NULL COMMENT 'Descripción o concepto del pago',
  `operation_date` DATE NOT NULL COMMENT 'Fecha de operación del pago',
  `active` TINYINT(1) DEFAULT 1 COMMENT '1=Activo, 0=Cancelado',
  PRIMARY KEY (`id`),
  KEY `idx_supplier` (`supplier_id`),
  KEY `idx_operation_date` (`operation_date`),
  KEY `idx_active` (`active`),
  CONSTRAINT `fk_supplier_payment_supplier` FOREIGN KEY (`supplier_id`) REFERENCES `supplier` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Pagos a proveedores';

-- =====================================================
-- Datos de ejemplo (opcional)
-- =====================================================

-- Insertar UDN de ejemplo (si no existe)
INSERT IGNORE INTO `udn` (`id`, `name`, `active`) VALUES
(1, 'Matriz', 1),
(2, 'Sucursal Norte', 1),
(3, 'Sucursal Sur', 1);

-- Insertar proveedores de ejemplo
INSERT INTO `supplier` (`udn_id`, `name`, `rfc`, `phone`, `email`, `balance`, `active`) VALUES
(1, 'Proveedor ABC S.A. de C.V.', 'ABC123456789', '5551234567', 'contacto@abc.com', 15000.00, 1),
(1, 'Distribuidora XYZ', 'XYZ987654321', '5559876543', 'ventas@xyz.com', 8500.50, 1),
(2, 'Suministros del Norte', 'SDN456789123', '5556543210', 'info@norte.com', 0.00, 1);

-- Insertar pagos de ejemplo
INSERT INTO `supplier_payment` (`supplier_id`, `amount`, `description`, `operation_date`, `active`) VALUES
(1, 5000.00, 'Pago parcial factura #001', '2025-01-15', 1),
(1, 3000.00, 'Abono a cuenta', '2025-01-20', 1),
(2, 8500.50, 'Liquidación total', '2025-01-18', 1);

-- =====================================================
-- Índices adicionales para optimización
-- =====================================================

-- Índice compuesto para búsquedas por fecha y proveedor
CREATE INDEX `idx_payment_date_supplier` ON `supplier_payment` (`operation_date`, `supplier_id`);

-- Índice para búsquedas por UDN y estado activo
CREATE INDEX `idx_supplier_udn_active` ON `supplier` (`udn_id`, `active`);

-- =====================================================
-- Triggers para actualizar balance automáticamente
-- =====================================================

DELIMITER $$

-- Trigger: Actualizar balance al insertar pago
CREATE TRIGGER `trg_after_payment_insert` 
AFTER INSERT ON `supplier_payment`
FOR EACH ROW
BEGIN
    IF NEW.active = 1 THEN
        UPDATE `supplier` 
        SET `balance` = `balance` - NEW.amount 
        WHERE `id` = NEW.supplier_id;
    END IF;
END$$

-- Trigger: Actualizar balance al modificar pago
CREATE TRIGGER `trg_after_payment_update` 
AFTER UPDATE ON `supplier_payment`
FOR EACH ROW
BEGIN
    IF OLD.active = 1 AND NEW.active = 0 THEN
        -- Pago cancelado: devolver monto al balance
        UPDATE `supplier` 
        SET `balance` = `balance` + OLD.amount 
        WHERE `id` = OLD.supplier_id;
    ELSEIF OLD.active = 0 AND NEW.active = 1 THEN
        -- Pago reactivado: restar monto del balance
        UPDATE `supplier` 
        SET `balance` = `balance` - NEW.amount 
        WHERE `id` = NEW.supplier_id;
    ELSEIF OLD.active = 1 AND NEW.active = 1 AND OLD.amount != NEW.amount THEN
        -- Monto modificado: ajustar diferencia
        UPDATE `supplier` 
        SET `balance` = `balance` + OLD.amount - NEW.amount 
        WHERE `id` = OLD.supplier_id;
    END IF;
END$$

-- Trigger: Actualizar balance al eliminar pago
CREATE TRIGGER `trg_after_payment_delete` 
AFTER DELETE ON `supplier_payment`
FOR EACH ROW
BEGIN
    IF OLD.active = 1 THEN
        UPDATE `supplier` 
        SET `balance` = `balance` + OLD.amount 
        WHERE `id` = OLD.supplier_id;
    END IF;
END$$

DELIMITER ;

-- =====================================================
-- Fin del script
-- =====================================================
