-- =====================================================
-- Tabla: module
-- Descripción: Catálogo de módulos operativos del sistema
-- =====================================================

CREATE TABLE IF NOT EXISTS module (
    id INT(11) PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    active TINYINT(1) NOT NULL DEFAULT 1,
    
    UNIQUE KEY uk_name (name),
    INDEX idx_active (active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Datos iniciales: Módulos del sistema
-- =====================================================

INSERT INTO module (name, description, active) VALUES
('Ventas', 'Módulo de gestión de ventas y facturación', 1),
('Compras', 'Módulo de gestión de compras y proveedores', 1),
('Clientes', 'Módulo de gestión de clientes', 1),
('Formas de pago', 'Módulo de configuración de formas de pago', 1),
('Cuenta de ventas', 'Módulo de cuentas contables de ventas', 1),
('Almacén', 'Módulo de gestión de inventario y almacén', 1),
('Proveedores', 'Módulo de gestión de proveedores', 1);
