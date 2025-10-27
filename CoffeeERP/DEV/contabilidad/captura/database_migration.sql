-- =====================================================
-- Módulo de Ventas - Database Migration Script
-- Sistema: CoffeeSoft Contabilidad
-- Database: rfwsmqex_contabilidad
-- =====================================================

USE rfwsmqex_contabilidad;

-- =====================================================
-- 1. Configuration Tables (Catálogos)
-- =====================================================

-- Table: sale_category
CREATE TABLE IF NOT EXISTS sale_category (
    id INT PRIMARY KEY AUTO_INCREMENT,
    udn_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    active TINYINT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_udn (udn_id),
    INDEX idx_active (active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: discount_courtesy
CREATE TABLE IF NOT EXISTS discount_courtesy (
    id INT PRIMARY KEY AUTO_INCREMENT,
    udn_id INT NOT NULL,
    name VARCHAR(80) NOT NULL,
    tax_iva TINYINT DEFAULT 0,
    tax_ieps TINYINT DEFAULT 0,
    tax_hospedaje TINYINT DEFAULT 0,
    active TINYINT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_udn (udn_id),
    INDEX idx_active (active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: cash_concept
CREATE TABLE IF NOT EXISTS cash_concept (
    id INT PRIMARY KEY AUTO_INCREMENT,
    udn_id INT NOT NULL,
    name VARCHAR(50) NOT NULL,
    operation_type ENUM('suma', 'resta') DEFAULT 'suma',
    active TINYINT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_udn (udn_id),
    INDEX idx_active (active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: bank_account
CREATE TABLE IF NOT EXISTS bank_account (
    id INT PRIMARY KEY AUTO_INCREMENT,
    udn_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    account_number VARCHAR(20),
    bank_name VARCHAR(50),
    code CHAR(5),
    active TINYINT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_udn (udn_id),
    INDEX idx_active (active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: customer
CREATE TABLE IF NOT EXISTS customer (
    id INT PRIMARY KEY AUTO_INCREMENT,
    udn_id INT NOT NULL,
    name VARCHAR(50) NOT NULL,
    balance DECIMAL(12,2) DEFAULT 0.00,
    active TINYINT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_udn (udn_id),
    INDEX idx_active (active),
    INDEX idx_balance (balance)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 2. Main Transaction Table
-- =====================================================

-- Table: daily_closure
CREATE TABLE IF NOT EXISTS daily_closure (
    id INT PRIMARY KEY AUTO_INCREMENT,
    udn_id INT NOT NULL,
    employee_id INT,
    operation_date DATE NOT NULL,
    total_sale_without_tax DECIMAL(12,2) DEFAULT 0.00,
    total_sale DECIMAL(12,2) DEFAULT 0.00,
    subtotal DECIMAL(12,2) DEFAULT 0.00,
    tax DECIMAL(12,2) DEFAULT 0.00,
    cash DECIMAL(12,2) DEFAULT 0.00,
    bank DECIMAL(12,2) DEFAULT 0.00,
    foreing_currency DECIMAL(12,2) DEFAULT 0.00,
    credit_consumer DECIMAL(12,2) DEFAULT 0.00,
    credit_payment DECIMAL(12,2) DEFAULT 0.00,
    total_received DECIMAL(12,2) DEFAULT 0.00,
    difference DECIMAL(12,2) DEFAULT 0.00,
    turn ENUM('matutino', 'vespertino', 'nocturno') DEFAULT NULL,
    suites_rented INT DEFAULT 0,
    status ENUM('open', 'closed') DEFAULT 'open',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_udn_date (udn_id, operation_date),
    INDEX idx_operation_date (operation_date),
    INDEX idx_status (status),
    INDEX idx_turn (turn)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 3. Detail Tables (Desglose de Ventas)
-- =====================================================

-- Table: detail_sale_category
CREATE TABLE IF NOT EXISTS detail_sale_category (
    id INT PRIMARY KEY AUTO_INCREMENT,
    sale_category_id INT NOT NULL,
    daily_closure_id INT NOT NULL,
    total DECIMAL(12,2) DEFAULT 0.00,
    subtotal DECIMAL(12,2) DEFAULT 0.00,
    tax_iva DECIMAL(12,2) DEFAULT 0.00,
    tax_ieps DECIMAL(12,2) DEFAULT 0.00,
    tax_hospedaje DECIMAL(12,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sale_category_id) REFERENCES sale_category(id) ON DELETE RESTRICT,
    FOREIGN KEY (daily_closure_id) REFERENCES daily_closure(id) ON DELETE CASCADE,
    INDEX idx_closure (daily_closure_id),
    INDEX idx_category (sale_category_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: detail_discount_courtesy
CREATE TABLE IF NOT EXISTS detail_discount_courtesy (
    id INT PRIMARY KEY AUTO_INCREMENT,
    discount_courtesy_id INT NOT NULL,
    daily_closure_id INT NOT NULL,
    total DECIMAL(12,2) DEFAULT 0.00,
    subtotal DECIMAL(12,2) DEFAULT 0.00,
    tax_iva DECIMAL(12,2) DEFAULT 0.00,
    tax_ieps DECIMAL(12,2) DEFAULT 0.00,
    tax_hospedaje DECIMAL(12,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (discount_courtesy_id) REFERENCES discount_courtesy(id) ON DELETE RESTRICT,
    FOREIGN KEY (daily_closure_id) REFERENCES daily_closure(id) ON DELETE CASCADE,
    INDEX idx_closure (daily_closure_id),
    INDEX idx_discount (discount_courtesy_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 4. Detail Tables (Formas de Ingreso)
-- =====================================================

-- Table: detail_cash_concept
CREATE TABLE IF NOT EXISTS detail_cash_concept (
    id INT PRIMARY KEY AUTO_INCREMENT,
    cash_concept_id INT NOT NULL,
    daily_closure_id INT NOT NULL,
    amount DECIMAL(12,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cash_concept_id) REFERENCES cash_concept(id) ON DELETE RESTRICT,
    FOREIGN KEY (daily_closure_id) REFERENCES daily_closure(id) ON DELETE CASCADE,
    INDEX idx_closure (daily_closure_id),
    INDEX idx_concept (cash_concept_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: detail_bank_account
CREATE TABLE IF NOT EXISTS detail_bank_account (
    id INT PRIMARY KEY AUTO_INCREMENT,
    bank_account_id INT NOT NULL,
    daily_closure_id INT NOT NULL,
    amount DECIMAL(12,2) DEFAULT 0.00,
    reference VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (bank_account_id) REFERENCES bank_account(id) ON DELETE RESTRICT,
    FOREIGN KEY (daily_closure_id) REFERENCES daily_closure(id) ON DELETE CASCADE,
    INDEX idx_closure (daily_closure_id),
    INDEX idx_bank (bank_account_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: detail_credit_customer
CREATE TABLE IF NOT EXISTS detail_credit_customer (
    id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT NOT NULL,
    daily_closure_id INT NOT NULL,
    movement_type ENUM('consumo', 'pago') DEFAULT 'consumo',
    method_pay VARCHAR(100),
    amount DECIMAL(12,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customer(id) ON DELETE RESTRICT,
    FOREIGN KEY (daily_closure_id) REFERENCES daily_closure(id) ON DELETE CASCADE,
    INDEX idx_closure (daily_closure_id),
    INDEX idx_customer (customer_id),
    INDEX idx_movement (movement_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 5. File Storage Table
-- =====================================================
CREATE TABLE IF NOT EXISTS files (
    id INT PRIMARY KEY AUTO_INCREMENT,
    daily_closure_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    path VARCHAR(500) NOT NULL,
    file_type VARCHAR(10),
    extension VARCHAR(10),
    size_byte INT,
    uploaded_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    operation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_closure (daily_closure_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- Table: closure_files
CREATE TABLE IF NOT EXISTS closure_files (
    id INT PRIMARY KEY AUTO_INCREMENT,
    daily_closure_id INT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_type VARCHAR(10),
    file_size INT,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (daily_closure_id) REFERENCES daily_closure(id) ON DELETE CASCADE,
    INDEX idx_closure (daily_closure_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 6. Initial Data (Sample Configuration)
-- =====================================================

-- Sample Sale Categories
INSERT INTO sale_category (udn_id, name, description) VALUES
(1, 'Alimentos', 'Venta de alimentos'),
(1, 'Bebidas', 'Venta de bebidas'),
(1, 'Diversos', 'Ventas diversas'),
(1, 'Desechables', 'Venta de productos desechables')
ON DUPLICATE KEY UPDATE name=name;

-- Sample Discounts/Courtesies
INSERT INTO discount_courtesy (udn_id, name, tax_iva, tax_ieps, tax_hospedaje) VALUES
(1, 'Descuento Alimentos', 1, 0, 0),
(1, 'Descuento Bebidas', 1, 0, 0),
(1, 'Cortesía Alimentos', 1, 0, 0),
(1, 'Cortesía Bebidas', 1, 0, 0)
ON DUPLICATE KEY UPDATE name=name;

-- Sample Cash Concepts
INSERT INTO cash_concept (udn_id, name, operation_type) VALUES
(1, 'Propina', 'suma'),
(1, 'Efectivo', 'suma'),
(1, 'Vales', 'suma'),
(1, 'Dólar', 'suma'),
(1, 'Oxxo', 'resta'),
(1, 'Giro', 'resta')
ON DUPLICATE KEY UPDATE name=name;

-- Sample Bank Accounts
INSERT INTO bank_account (udn_id, name, bank_name, code) VALUES
(1, 'Santander (2987)', 'Santander', '2987'),
(1, 'Banamex (5120)', 'Banamex', '5120'),
(1, 'BBVA (4682)', 'BBVA', '4682'),
(1, 'CoFi BBVA (6982)', 'BBVA', '6982'),
(1, 'Banorte (9167)', 'Banorte', '9167')
ON DUPLICATE KEY UPDATE name=name;

-- =====================================================
-- 7. Composite Indexes for Performance
-- =====================================================

ALTER TABLE daily_closure 
ADD INDEX idx_composite_search (udn_id, operation_date, status);

ALTER TABLE detail_sale_category 
ADD INDEX idx_composite_closure_category (daily_closure_id, sale_category_id);

ALTER TABLE detail_discount_courtesy 
ADD INDEX idx_composite_closure_discount (daily_closure_id, discount_courtesy_id);

-- =====================================================
-- Migration Complete
-- =====================================================
