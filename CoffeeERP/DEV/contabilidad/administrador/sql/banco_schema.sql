-- =====================================================
-- Módulo de Banco - Database Schema Update
-- =====================================================
-- Fecha: 2025-10-26
-- Propósito: Actualizar estructura de tablas banks y bank_accounts
-- Versión: 2.0
-- =====================================================

USE rfwsmqex_contabilidad;

-- =====================================================
-- TABLA: banks
-- =====================================================
-- Almacena el catálogo de bancos disponibles en el sistema

CREATE TABLE IF NOT EXISTS banks (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT 'Identificador único del banco',
    name VARCHAR(100) NOT NULL COMMENT 'Nombre del banco (ej: BBVA, Santander, Banamex)',
    active TINYINT(1) DEFAULT 1 COMMENT '1=activo, 0=inactivo',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha y hora de creación',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Fecha y hora de última actualización',
    
    -- Unique Constraints
    CONSTRAINT unique_bank_name 
        UNIQUE KEY (name),
    
    -- Indexes
    INDEX idx_banks_name (name),
    INDEX idx_banks_active (active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Catálogo de bancos disponibles en el sistema';

-- =====================================================
-- TABLA: bank_accounts
-- =====================================================
-- Almacena las cuentas bancarias asociadas a bancos y unidades de negocio

CREATE TABLE IF NOT EXISTS bank_accounts (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT 'Identificador único de la cuenta bancaria',
    account_alias VARCHAR(100) DEFAULT NULL COMMENT 'Alias o nombre personalizado de la cuenta (opcional)',
    last_four_digits CHAR(4) NOT NULL COMMENT 'Últimos 4 dígitos de la cuenta bancaria',
    payment_method_id INT DEFAULT NULL COMMENT 'Referencia a la forma de pago (opcional)',
    active TINYINT(1) DEFAULT 1 COMMENT '1=activa, 0=inactiva',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha y hora de creación',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Fecha y hora de última actualización',
    bank_id INT NOT NULL COMMENT 'Referencia al banco (obligatorio)',
    udn_id INT NOT NULL COMMENT 'Referencia a la unidad de negocio (obligatorio)',
    
    -- Foreign Keys
    CONSTRAINT fk_bank_accounts_bank 
        FOREIGN KEY (bank_id) REFERENCES banks(id)
        ON DELETE RESTRICT 
        ON UPDATE CASCADE
        COMMENT 'Relación con tabla banks - No permite eliminar banco con cuentas asociadas',
    
    CONSTRAINT fk_bank_accounts_payment_method 
        FOREIGN KEY (payment_method_id) REFERENCES payment_methods(id)
        ON DELETE SET NULL 
        ON UPDATE CASCADE
        COMMENT 'Relación con tabla payment_methods - Si se elimina forma de pago, se establece NULL',
    
    CONSTRAINT fk_bank_accounts_udn 
        FOREIGN KEY (udn_id) REFERENCES udn(idUDN)
        ON DELETE RESTRICT 
        ON UPDATE CASCADE
        COMMENT 'Relación con tabla udn - No permite eliminar UDN con cuentas asociadas',
    
    -- Indexes
    INDEX idx_bank_accounts_bank_id (bank_id),
    INDEX idx_bank_accounts_udn_id (udn_id),
    INDEX idx_bank_accounts_payment_method_id (payment_method_id),
    INDEX idx_bank_accounts_active (active),
    INDEX idx_bank_accounts_last_four_digits (last_four_digits)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Cuentas bancarias asociadas a bancos y unidades de negocio';

-- =====================================================
-- VERIFICACIÓN DE ESTRUCTURA
-- =====================================================

-- Verificar estructura de tabla banks
DESCRIBE banks;

-- Verificar estructura de tabla bank_accounts
DESCRIBE bank_accounts;

-- Verificar foreign keys de bank_accounts
SELECT 
    CONSTRAINT_NAME,
    TABLE_NAME,
    COLUMN_NAME,
    REFERENCED_TABLE_NAME,
    REFERENCED_COLUMN_NAME
FROM information_schema.KEY_COLUMN_USAGE
WHERE TABLE_SCHEMA = 'rfwsmqex_contabilidad'
AND TABLE_NAME = 'bank_accounts'
AND REFERENCED_TABLE_NAME IS NOT NULL;

-- Verificar índices de banks
SHOW INDEX FROM banks;

-- Verificar índices de bank_accounts
SHOW INDEX FROM bank_accounts;

-- =====================================================
-- DATOS DE PRUEBA (OPCIONAL - Solo para desarrollo)
-- =====================================================

-- Insertar bancos de prueba si no existen
INSERT IGNORE INTO banks (name, active) VALUES
('BBVA', 1),
('Santander', 1),
('Banamex', 1),
('Banorte', 1),
('HSBC', 1),
('Scotiabank', 1);

-- =====================================================
-- NOTAS DE MIGRACIÓN
-- =====================================================

/*
IMPORTANTE:
1. Este script crea las tablas si no existen (CREATE TABLE IF NOT EXISTS)
2. Si las tablas ya existen, NO las modifica automáticamente
3. Para actualizar tablas existentes, usar ALTER TABLE (ver sección siguiente)
4. Ejecutar primero el backup (backup_documentation.md)
5. Verificar que no haya datos que violen las foreign keys antes de agregarlas

ORDEN DE EJECUCIÓN:
1. Crear backup de tablas existentes
2. Ejecutar este script en ambiente de desarrollo
3. Verificar estructura con los queries de verificación
4. Probar funcionalidad de la aplicación
5. Si todo funciona, ejecutar en producción

ROLLBACK:
Si algo falla, ejecutar el script de rollback en backup_documentation.md
*/

-- =====================================================
-- SCRIPT DE MIGRACIÓN PARA TABLAS EXISTENTES
-- =====================================================

/*
Si las tablas ya existen y necesitas actualizarlas, ejecuta lo siguiente:

-- 1. Eliminar foreign keys existentes si las hay
ALTER TABLE bank_accounts DROP FOREIGN KEY IF EXISTS fk_bank_accounts_bank;
ALTER TABLE bank_accounts DROP FOREIGN KEY IF EXISTS fk_bank_accounts_payment_method;
ALTER TABLE bank_accounts DROP FOREIGN KEY IF EXISTS fk_bank_accounts_udn;

-- 2. Agregar columnas faltantes si no existen
ALTER TABLE banks 
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

ALTER TABLE bank_accounts 
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- 3. Agregar índices si no existen
ALTER TABLE banks 
    ADD UNIQUE INDEX IF NOT EXISTS unique_bank_name (name),
    ADD INDEX IF NOT EXISTS idx_banks_name (name),
    ADD INDEX IF NOT EXISTS idx_banks_active (active);

ALTER TABLE bank_accounts 
    ADD INDEX IF NOT EXISTS idx_bank_accounts_bank_id (bank_id),
    ADD INDEX IF NOT EXISTS idx_bank_accounts_udn_id (udn_id),
    ADD INDEX IF NOT EXISTS idx_bank_accounts_payment_method_id (payment_method_id),
    ADD INDEX IF NOT EXISTS idx_bank_accounts_active (active),
    ADD INDEX IF NOT EXISTS idx_bank_accounts_last_four_digits (last_four_digits);

-- 4. Agregar foreign keys
ALTER TABLE bank_accounts 
    ADD CONSTRAINT fk_bank_accounts_bank 
        FOREIGN KEY (bank_id) REFERENCES banks(id)
        ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE bank_accounts 
    ADD CONSTRAINT fk_bank_accounts_payment_method 
        FOREIGN KEY (payment_method_id) REFERENCES payment_methods(id)
        ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE bank_accounts 
    ADD CONSTRAINT fk_bank_accounts_udn 
        FOREIGN KEY (udn_id) REFERENCES udn(idUDN)
        ON DELETE RESTRICT ON UPDATE CASCADE;
*/

-- =====================================================
-- FIN DEL SCRIPT
-- =====================================================
