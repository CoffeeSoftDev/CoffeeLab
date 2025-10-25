-- =====================================================
-- Módulo de Efectivo - Database Schema
-- =====================================================

-- Table: cash_concept
-- Stores cash concepts/categories for different business units
CREATE TABLE IF NOT EXISTS cash_concept (
    id INT PRIMARY KEY AUTO_INCREMENT,
    udn_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    operation_type ENUM('suma', 'resta') NOT NULL COMMENT 'suma=income, resta=withdrawal',
    description TEXT,
    active TINYINT(1) DEFAULT 1 COMMENT '1=active, 0=inactive',
    date_creation DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign Keys
    CONSTRAINT fk_cash_concept_udn 
        FOREIGN KEY (udn_id) REFERENCES udn(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    
    -- Unique Constraints
    CONSTRAINT unique_concept_per_udn 
        UNIQUE KEY (udn_id, name),
    
    -- Indexes
    INDEX idx_cash_concept_udn (udn_id),
    INDEX idx_cash_concept_active (active),
    INDEX idx_cash_concept_operation_type (operation_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: cash_movement
-- Stores all cash movements (income and withdrawals)
CREATE TABLE IF NOT EXISTS cash_movement (
    id INT PRIMARY KEY AUTO_INCREMENT,
    udn_id INT NOT NULL,
    concept_id INT NOT NULL,
    movement_type ENUM('entrada', 'salida') NOT NULL COMMENT 'entrada=income, salida=withdrawal',
    amount DECIMAL(10,2) NOT NULL,
    description TEXT,
    user_id INT NOT NULL,
    date_creation DATETIME DEFAULT CURRENT_TIMESTAMP,
    active TINYINT(1) DEFAULT 1 COMMENT '1=active, 0=deleted',
    
    -- Foreign Keys
    CONSTRAINT fk_cash_movement_udn 
        FOREIGN KEY (udn_id) REFERENCES udn(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    
    CONSTRAINT fk_cash_movement_concept 
        FOREIGN KEY (concept_id) REFERENCES cash_concept(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    
    CONSTRAINT fk_cash_movement_user 
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    
    -- Constraints
    CONSTRAINT chk_amount_positive 
        CHECK (amount > 0),
    
    -- Indexes
    INDEX idx_cash_movement_udn (udn_id),
    INDEX idx_cash_movement_concept (concept_id),
    INDEX idx_cash_movement_user (user_id),
    INDEX idx_cash_movement_date (date_creation),
    INDEX idx_cash_movement_type (movement_type),
    INDEX idx_cash_movement_active (active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: cash_closure
-- Stores cash closure records for each business unit
CREATE TABLE IF NOT EXISTS cash_closure (
    id INT PRIMARY KEY AUTO_INCREMENT,
    udn_id INT NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    closure_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    user_id INT NOT NULL,
    notes TEXT,
    
    -- Foreign Keys
    CONSTRAINT fk_cash_closure_udn 
        FOREIGN KEY (udn_id) REFERENCES udn(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    
    CONSTRAINT fk_cash_closure_user 
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    
    -- Indexes
    INDEX idx_cash_closure_udn (udn_id),
    INDEX idx_cash_closure_date (closure_date),
    INDEX idx_cash_closure_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Insert default operation types (optional)
-- =====================================================

-- Insert default cash concepts (examples)
-- INSERT INTO cash_concept (udn_id, name, operation_type, description, active) VALUES
-- (1, 'Efectivo', 'suma', 'Efectivo recibido por las ventas a clientes', 1),
-- (1, 'Monedas extranjeras', 'suma', 'Monedas extranjeras recibidas', 1),
-- (1, 'Bancos', 'suma', 'Depósitos bancarios', 1),
-- (1, 'Retiro', 'resta', 'Retiro de efectivo', 1),
-- (1, 'Destajo', 'resta', 'Pago por destajo', 1),
-- (1, 'Descuento destajo', 'resta', 'Descuento aplicado a destajo', 1),
-- (1, 'Vales', 'resta', 'Vales entregados', 1);
