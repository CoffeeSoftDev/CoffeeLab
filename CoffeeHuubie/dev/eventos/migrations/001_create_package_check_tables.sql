-- ============================================================================
-- Migration: Crear tablas para gestión de paquetes y productos relacionados
-- Fecha: 2025-01-30
-- Descripción: Crea las tablas evt_package_check y evt_check_products para
--              gestionar la relación entre paquetes de eventos y sus productos
-- ============================================================================

-- Tabla: evt_package_check
-- Propósito: Tabla de control que vincula un paquete de evento con sus productos seleccionables
CREATE TABLE IF NOT EXISTS evt_package_check (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT 'ID único del registro de control',
    events_package_id INT NOT NULL COMMENT 'ID del paquete en evt_events_package',
    created_at DATETIME NOT NULL COMMENT 'Fecha y hora de creación del registro',
    
    -- Foreign Keys
    CONSTRAINT fk_package_check_events_package 
        FOREIGN KEY (events_package_id) 
        REFERENCES evt_events_package(id) 
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    
    -- Índices
    INDEX idx_events_package (events_package_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Tabla de control para gestión de productos en paquetes de eventos';

-- Tabla: evt_check_products
-- Propósito: Almacena los productos relacionados con cada paquete y su estado activo/inactivo
CREATE TABLE IF NOT EXISTS evt_check_products (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT 'ID único del producto en el check',
    package_check_id INT NOT NULL COMMENT 'ID del registro de control en evt_package_check',
    product_id INT NOT NULL COMMENT 'ID del producto en evt_products',
    active TINYINT(1) DEFAULT 1 COMMENT 'Estado del producto: 1=activo, 0=inactivo',
    
    -- Foreign Keys
    CONSTRAINT fk_check_products_package_check 
        FOREIGN KEY (package_check_id) 
        REFERENCES evt_package_check(id) 
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    
    CONSTRAINT fk_check_products_product 
        FOREIGN KEY (product_id) 
        REFERENCES evt_products(id) 
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    
    -- Índices
    INDEX idx_package_check (package_check_id),
    INDEX idx_product (product_id),
    
    -- Restricción única para evitar duplicados
    UNIQUE KEY unique_check_product (package_check_id, product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Productos relacionados con paquetes de eventos y su estado activo/inactivo';

-- ============================================================================
-- Migración de datos existentes (si aplica)
-- ============================================================================

-- Paso 1: Crear registros en evt_package_check para paquetes existentes
-- Solo se crean registros para paquetes que aún no tienen un registro de control
INSERT INTO evt_package_check (events_package_id, created_at)
SELECT 
    id, 
    COALESCE(date_creation, NOW()) as created_at
FROM evt_events_package
WHERE id NOT IN (SELECT events_package_id FROM evt_package_check)
AND active = 1;

-- Paso 2: Crear registros en evt_check_products para productos de paquetes existentes
-- Se insertan todos los productos asociados a cada paquete con active = 1 por defecto
INSERT INTO evt_check_products (package_check_id, product_id, active)
SELECT DISTINCT
    pc.id as package_check_id,
    pp.product_id,
    1 as active
FROM evt_package_check pc
INNER JOIN evt_events_package ep ON pc.events_package_id = ep.id
INNER JOIN evt_package_products pp ON ep.package_id = pp.package_id
WHERE pp.active = 1
AND NOT EXISTS (
    SELECT 1 
    FROM evt_check_products cp 
    WHERE cp.package_check_id = pc.id 
    AND cp.product_id = pp.product_id
);

-- ============================================================================
-- Verificación de la migración
-- ============================================================================

-- Verificar que las tablas se crearon correctamente
SELECT 
    TABLE_NAME,
    TABLE_ROWS,
    CREATE_TIME
FROM information_schema.TABLES
WHERE TABLE_SCHEMA = DATABASE()
AND TABLE_NAME IN ('evt_package_check', 'evt_check_products');

-- Verificar foreign keys
SELECT 
    CONSTRAINT_NAME,
    TABLE_NAME,
    REFERENCED_TABLE_NAME
FROM information_schema.KEY_COLUMN_USAGE
WHERE TABLE_SCHEMA = DATABASE()
AND TABLE_NAME IN ('evt_package_check', 'evt_check_products')
AND REFERENCED_TABLE_NAME IS NOT NULL;

-- Verificar índices
SELECT 
    TABLE_NAME,
    INDEX_NAME,
    COLUMN_NAME,
    NON_UNIQUE
FROM information_schema.STATISTICS
WHERE TABLE_SCHEMA = DATABASE()
AND TABLE_NAME IN ('evt_package_check', 'evt_check_products')
ORDER BY TABLE_NAME, INDEX_NAME, SEQ_IN_INDEX;

-- ============================================================================
-- Rollback (en caso de necesitar revertir la migración)
-- ============================================================================

-- ADVERTENCIA: Ejecutar solo si necesitas revertir la migración
-- Esto eliminará todas las tablas y datos relacionados

-- DROP TABLE IF EXISTS evt_check_products;
-- DROP TABLE IF EXISTS evt_package_check;
