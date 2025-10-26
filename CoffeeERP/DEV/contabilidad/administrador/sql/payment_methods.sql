-- =====================================================
-- Módulo de Formas de Pago - Database Schema
-- =====================================================

-- Table: payment_methods
-- Stores payment methods available for purchases across all business units
CREATE TABLE IF NOT EXISTS payment_methods (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL COMMENT 'Payment method name (e.g., Efectivo, Transferencia, Tarjeta)',
    active TINYINT(1) DEFAULT 1 COMMENT '1=active, 0=inactive',
    date_creation DATETIME DEFAULT CURRENT_TIMESTAMP,
    date_updated DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Unique Constraints
    CONSTRAINT unique_payment_method_name 
        UNIQUE KEY (name),
    
    -- Indexes
    INDEX idx_payment_methods_name (name),
    INDEX idx_payment_methods_active (active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Insert default payment methods
-- =====================================================

INSERT INTO payment_methods (name, active) VALUES
('Efectivo', 1),
('Transferencia', 1),
('Tarjeta de débito', 1),
('Tarjeta de crédito', 1),
('Almacén de compras (corporativo)', 1);
