-- =====================================================
-- Foreign Currency Module - Database Schema
-- =====================================================
-- Description: Table structure for managing foreign currencies
--              used in accounting operations with exchange rates
-- =====================================================

CREATE TABLE IF NOT EXISTS foreign_currency (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Primary key',
    udn_id INT NOT NULL COMMENT 'Business unit identifier (Foreign key to udn table)',
    name VARCHAR(100) NOT NULL COMMENT 'Currency name (e.g., Dólar, Quetzal, Euro)',
    code VARCHAR(10) NOT NULL COMMENT 'Currency symbol/code (e.g., USD, GTQ, EUR)',
    conversion_value DECIMAL(10,2) NOT NULL COMMENT 'Exchange rate to MXN',
    active TINYINT(1) DEFAULT 1 COMMENT 'Status: 1=Active, 0=Inactive',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Record creation timestamp',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Last modification timestamp',
    
    -- Foreign key constraint
    CONSTRAINT fk_foreign_currency_udn 
        FOREIGN KEY (udn_id) 
        REFERENCES udn(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    
    -- Unique constraint to prevent duplicate currencies per business unit
    CONSTRAINT unique_currency_per_udn 
        UNIQUE KEY (udn_id, name),
    
    -- Index for query optimization
    INDEX idx_udn_id (udn_id),
    INDEX idx_active (active),
    INDEX idx_udn_active (udn_id, active)
    
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Foreign currencies with exchange rates for accounting operations';

-- =====================================================
-- Sample Data (Optional - for testing)
-- =====================================================
INSERT INTO foreign_currency (udn_id, name, code, conversion_value, active) VALUES
(1, 'Dólar', 'USD', 20.00, 1),
(1, 'Quetzal', 'GTQ', 2.50, 1),
(2, 'Dólar', 'USD', 20.00, 1);
