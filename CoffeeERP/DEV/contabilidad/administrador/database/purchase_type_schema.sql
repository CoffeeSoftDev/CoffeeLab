-- =====================================================
-- Módulo de Tipos de Compra - Database Schema
-- =====================================================
-- Fecha: 2025-10-26
-- Propósito: Crear tabla purchase_type para gestionar tipos de compra
-- =====================================================

USE rfwsmqex_contabilidad;

-- =====================================================
-- TABLA: purchase_type
-- =====================================================
-- Almacena los tipos de compra disponibles para cada unidad de negocio

CREATE TABLE IF NOT EXISTS purchase_type (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT 'Identificador único del tipo de compra',
    udn_id INT NOT NULL COMMENT 'Referencia a la unidad de negocio',
    name VARCHAR(50) NOT NULL COMMENT 'Nombre del tipo de compra (ej: Corporativo, Fondo fijo, Crédito)',
    active TINYINT(1) DEFAULT 1 COMMENT '1=activo, 0=inactivo',
    
    -- Foreign Keys
    CONSTRAINT fk_purchase_type_udn 
        FOREIGN KEY (udn_id) REFERENCES udn(idUDN)
        ON DELETE RESTRICT 
        ON UPDATE CASCADE
        COMMENT 'Relación con tabla udn - No permite eliminar UDN con tipos de compra asociados',
    
    -- Indexes
    INDEX idx_purchase_type_udn_id (udn_id),
    INDEX idx_purchase_type_active (active),
    INDEX idx_purchase_type_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Tipos de compra disponibles para cada unidad de negocio';

-- =====================================================
-- VERIFICACIÓN DE ESTRUCTURA
-- =====================================================

-- Verificar estructura de tabla purchase_type
DESCRIBE purchase_type;

-- Verificar foreign keys
SELECT 
    CONSTRAINT_NAME,
    TABLE_NAME,
    COLUMN_NAME,
    REFERENCED_TABLE_NAME,
    REFERENCED_COLUMN_NAME
FROM information_schema.KEY_COLUMN_USAGE
WHERE TABLE_SCHEMA = 'rfwsmqex_contabilidad'
AND TABLE_NAME = 'purchase_type'
AND REFERENCED_TABLE_NAME IS NOT NULL;

-- Verificar índices
SHOW INDEX FROM purchase_type;

-- =====================================================
-- DATOS DE EJEMPLO (OPCIONAL - Solo para desarrollo)
-- =====================================================

-- Insertar tipos de compra de ejemplo para diferentes UDN
-- Nota: Ajustar los IDs de UDN según tu base de datos

/*
INSERT INTO purchase_type (udn_id, name, active) VALUES
(1, 'Corporativo', 1),
(1, 'Fondo fijo', 1),
(1, 'Crédito', 1),
(2, 'Corporativo', 1),
(2, 'Fondo fijo', 1);
*/

-- =====================================================
-- NOTAS DE IMPLEMENTACIÓN
-- =====================================================

/*
IMPORTANTE:
1. La tabla purchase_type enlista los tipos de compras disponibles para la unidad de negocio
2. Cada UDN puede tener sus propios tipos de compra
3. El campo 'active' controla la disponibilidad del tipo de compra
4. Los tipos de compra desactivados no se eliminan, solo se ocultan
5. La foreign key con udn previene la eliminación de UDN con tipos de compra asociados

RELACIONES:
- purchase_type.udn_id → udn.idUDN (RESTRICT)

USO EN LA APLICACIÓN:
- Los tipos de compra se usan para clasificar las compras en el sistema
- Se pueden filtrar compras por tipo de compra
- Solo los tipos activos aparecen en los formularios de captura
*/

-- =====================================================
-- FIN DEL SCRIPT
-- =====================================================
