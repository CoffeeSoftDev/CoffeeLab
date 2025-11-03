-- ============================================
-- Database Schema for Módulo de Almacén
-- ============================================

-- Table: product_class
-- Stores product classifications (Alimentos, Bebidas, Diversos, etc.)
CREATE TABLE IF NOT EXISTS product_class (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    description TEXT,
    active TINYINT DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_active (active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: product
-- Stores individual products/supplies
CREATE TABLE IF NOT EXISTS product (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_class_id INT NOT NULL,
    name VARCHAR(50) NOT NULL,
    description TEXT,
    active TINYINT DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_class_id) REFERENCES product_class(id) ON DELETE RESTRICT,
    INDEX idx_product_class (product_class_id),
    INDEX idx_active (active),
    INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: warehouse_output
-- Stores warehouse output transactions
CREATE TABLE IF NOT EXISTS warehouse_output (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    udn_id INT NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    description TEXT,
    operation_date DATE NOT NULL,
    user_id INT NOT NULL,
    active TINYINT DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES product(id) ON DELETE RESTRICT,
    INDEX idx_operation_date (operation_date),
    INDEX idx_udn (udn_id),
    INDEX idx_product (product_id),
    INDEX idx_active (active),
    INDEX idx_composite (operation_date, udn_id, active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: file
-- Stores uploaded backup files
CREATE TABLE IF NOT EXISTS file (
    id INT PRIMARY KEY AUTO_INCREMENT,
    udn_id INT NOT NULL,
    user_id INT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    upload_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    size_bytes INT,
    path TEXT,
    extension CHAR(5),
    operation_date DATE,
    INDEX idx_udn (udn_id),
    INDEX idx_operation_date (operation_date),
    INDEX idx_upload_date (upload_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: audit_log
-- Stores audit trail for all operations
CREATE TABLE IF NOT EXISTS audit_log (
    id INT PRIMARY KEY AUTO_INCREMENT,
    udn_id INT NOT NULL,
    user_id INT NOT NULL,
    record_id INT,
    name_table VARCHAR(255),
    name_user VARCHAR(50),
    name_udn VARCHAR(50),
    name_collaborator VARCHAR(255),
    action ENUM('create', 'update', 'delete', 'view') NOT NULL,
    change_items LONGTEXT,
    creation_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_table (name_table),
    INDEX idx_action (action),
    INDEX idx_creation_date (creation_date),
    INDEX idx_composite (name_table, record_id, action)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Sample Data for Testing
-- ============================================

-- Insert sample product classes
INSERT INTO product_class (name, description, active) VALUES
('Alimentos', 'Productos alimenticios', 1),
('Bebidas', 'Bebidas y líquidos', 1),
('Diversos', 'Productos diversos', 1);

-- Insert sample products
INSERT INTO product (product_class_id, name, description, active) VALUES
(1, 'Arroz', 'Arroz blanco', 1),
(1, 'Frijol', 'Frijol negro', 1),
(2, 'Agua', 'Agua purificada', 1),
(2, 'Refresco', 'Bebidas gaseosas', 1),
(3, 'Papel', 'Papel higiénico', 1),
(3, 'Jabón', 'Jabón líquido', 1);
