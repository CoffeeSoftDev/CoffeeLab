-- ============================================
-- Módulo de Banco - Estructura de Base de Datos
-- Sistema Contable CoffeeSoft
-- ============================================

-- Tabla: banks
-- Descripción: Almacena instituciones bancarias registradas en el sistema
CREATE TABLE IF NOT EXISTS banks (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador único del banco',
    name VARCHAR(100) NOT NULL COMMENT 'Nombre de la institución bancaria',
    active TINYINT(1) DEFAULT 1 COMMENT 'Estado del banco (1=activo, 0=inactivo)',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación del registro',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Fecha de última actualización',
    
    UNIQUE KEY unique_bank_name (name),
    INDEX idx_active (active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Instituciones bancarias';

-- Tabla: bank_accounts
-- Descripción: Almacena cuentas bancarias vinculadas a bancos y unidades de negocio
CREATE TABLE IF NOT EXISTS bank_accounts (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador único de la cuenta bancaria',
    udn_id INT NOT NULL COMMENT 'Referencia a unidad de negocio',
    bank_id INT NOT NULL COMMENT 'Referencia al banco',
    account_alias VARCHAR(100) DEFAULT NULL COMMENT 'Nombre o alias opcional de la cuenta',
    last_four_digits CHAR(4) NOT NULL COMMENT 'Últimos 4 dígitos de la cuenta bancaria',
    payment_method_id INT DEFAULT NULL COMMENT 'Referencia a forma de pago',
    active TINYINT(1) DEFAULT 1 COMMENT 'Estado operativo (1=activa, 0=inactiva)',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación del registro',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Fecha de última actualización',
    
    FOREIGN KEY (bank_id) REFERENCES banks(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (udn_id) REFERENCES udn(idUDN) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (payment_method_id) REFERENCES payment_methods(id) ON DELETE SET NULL ON UPDATE CASCADE,
    
    INDEX idx_udn_bank (udn_id, bank_id),
    INDEX idx_bank_id (bank_id),
    INDEX idx_active (active),
    INDEX idx_payment_method (payment_method_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Cuentas bancarias por UDN';

-- ============================================
-- Datos de ejemplo (opcional - comentar en producción)
-- ============================================

-- Bancos de ejemplo
-- INSERT INTO banks (name, active) VALUES
-- ('BBVA', 1),
-- ('Santander', 1),
-- ('Banamex', 1),
-- ('Banorte', 1);

-- ============================================
-- Verificación de estructura
-- ============================================

-- Verificar tablas creadas
-- SHOW TABLES LIKE '%bank%';

-- Verificar estructura de banks
-- DESCRIBE banks;

-- Verificar estructura de bank_accounts
-- DESCRIBE bank_accounts;

-- Verificar claves foráneas
-- SELECT 
--     TABLE_NAME,
--     COLUMN_NAME,
--     CONSTRAINT_NAME,
--     REFERENCED_TABLE_NAME,
--     REFERENCED_COLUMN_NAME
-- FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
-- WHERE TABLE_NAME IN ('banks', 'bank_accounts')
-- AND REFERENCED_TABLE_NAME IS NOT NULL;
