-- ============================================
-- Módulo de Compras - Schema Database
-- ============================================

-- Tabla: product_class (Categorías de productos / Cuentas mayores)
CREATE TABLE IF NOT EXISTS rfwsmqex_contabilidad.product_class (
    id INT PRIMARY KEY AUTO_INCREMENT,
    udn_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    active TINYINT DEFAULT 1,
    FOREIGN KEY (udn_id) REFERENCES udn(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: product (Productos / Subcuentas)
CREATE TABLE IF NOT EXISTS rfwsmqex_contabilidad.product (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_class_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    active TINYINT DEFAULT 1,
    FOREIGN KEY (product_class_id) REFERENCES product_class(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: purchase_type (Tipos de compra)
CREATE TABLE IF NOT EXISTS rfwsmqex_contabilidad.purchase_type (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    active TINYINT DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: method_pay (Métodos de pago)
CREATE TABLE IF NOT EXISTS rfwsmqex_contabilidad.method_pay (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    active TINYINT DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: supplier (Proveedores)
CREATE TABLE IF NOT EXISTS rfwsmqex_contabilidad.supplier (
    id INT PRIMARY KEY AUTO_INCREMENT,
    udn_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    rfc TEXT,
    phone CHAR(15),
    email TEXT,
    balance DECIMAL(12,2) DEFAULT 0.00,
    active TINYINT DEFAULT 1,
    FOREIGN KEY (udn_id) REFERENCES udn(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: purchase (Compras)
CREATE TABLE IF NOT EXISTS rfwsmqex_contabilidad.purchase (
    id INT PRIMARY KEY AUTO_INCREMENT,
    udn_id INT NOT NULL,
    product_class_id INT NOT NULL,
    product_id INT NOT NULL,
    supplier_id INT,
    purchase_type_id INT NOT NULL,
    method_pay_id INT NOT NULL,
    total DECIMAL(12,2) NOT NULL,
    subtotal DECIMAL(12,2) NOT NULL,
    tax DECIMAL(12,2) NOT NULL,
    description TEXT,
    operation_date DATE NOT NULL,
    active TINYINT DEFAULT 1,
    FOREIGN KEY (udn_id) REFERENCES udn(id),
    FOREIGN KEY (product_class_id) REFERENCES product_class(id),
    FOREIGN KEY (product_id) REFERENCES product(id),
    FOREIGN KEY (supplier_id) REFERENCES supplier(id),
    FOREIGN KEY (purchase_type_id) REFERENCES purchase_type(id),
    FOREIGN KEY (method_pay_id) REFERENCES method_pay(id),
    INDEX idx_udn (udn_id),
    INDEX idx_purchase_type (purchase_type_id),
    INDEX idx_operation_date (operation_date),
    INDEX idx_active (active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
