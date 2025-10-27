-- =====================================================
-- Script de Base de Datos: Módulo de Clientes a Crédito
-- Proyecto: Sistema de Contabilidad
-- Base de datos: rfwsmqex_contabilidad
-- =====================================================

USE rfwsmqex_contabilidad;

-- =====================================================
-- Tabla: customer
-- Descripción: Catálogo de clientes con capacidad de crédito
-- =====================================================
CREATE TABLE IF NOT EXISTS customer (
    id INT PRIMARY KEY AUTO_INCREMENT,
    udn_id INT NOT NULL,
    name VARCHAR(50) NOT NULL,
    balance DECIMAL(12,2) DEFAULT 0.00 COMMENT 'Saldo actual de deuda',
    active TINYINT DEFAULT 1 COMMENT '1=Activo, 0=Inactivo',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (udn_id) REFERENCES udn(id) ON DELETE RESTRICT,
    INDEX idx_udn_active (udn_id, active),
    INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Catálogo de clientes con cuentas a crédito';

-- =====================================================
-- Tabla: detail_credit_customer
-- Descripción: Detalle de movimientos de crédito por cliente
-- =====================================================
CREATE TABLE IF NOT EXISTS detail_credit_customer (
    id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT NOT NULL,
    daily_closure_id INT NOT NULL,
    movement_type VARCHAR(20) NOT NULL COMMENT 'Consumo a crédito, Anticipo, Pago total',
    method_pay VARCHAR(100) COMMENT 'Efectivo, Banco, N/A',
    amount DECIMAL(15,2) NOT NULL COMMENT 'Monto del movimiento',
    description TEXT COMMENT 'Descripción opcional del movimiento',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updated_by VARCHAR(100) COMMENT 'Usuario que realizó la última modificación',
    FOREIGN KEY (customer_id) REFERENCES customer(id) ON DELETE RESTRICT,
    FOREIGN KEY (daily_closure_id) REFERENCES daily_closure(id) ON DELETE RESTRICT,
    INDEX idx_customer (customer_id),
    INDEX idx_daily_closure (daily_closure_id),
    INDEX idx_movement_type (movement_type),
    INDEX idx_created_at (created_at),
    INDEX idx_customer_date (customer_id, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Registro de movimientos de crédito (consumos, anticipos, pagos)';

-- =====================================================
-- Datos de prueba (opcional - comentar en producción)
-- =====================================================

-- Insertar clientes de prueba
-- INSERT INTO customer (udn_id, name, balance, active) VALUES
-- (1, 'American Express', 419.31, 1),
-- (1, 'API', 0.00, 1),
-- (1, 'Asociación de planeares', 0.00, 1),
-- (1, 'Cliente sin Recurrente', 0.00, 1),
-- (1, 'Eventos', 32.00, 1),
-- (1, 'Marina Chiapas', 782.00, 1);

-- =====================================================
-- Verificación de estructura
-- =====================================================

-- Verificar tablas creadas
SHOW TABLES LIKE 'customer';
SHOW TABLES LIKE 'detail_credit_customer';

-- Verificar estructura de customer
DESCRIBE customer;

-- Verificar estructura de detail_credit_customer
DESCRIBE detail_credit_customer;

-- Verificar índices de customer
SHOW INDEX FROM customer;

-- Verificar índices de detail_credit_customer
SHOW INDEX FROM detail_credit_customer;

-- =====================================================
-- Consultas útiles para mantenimiento
-- =====================================================

-- Ver clientes con saldo pendiente
-- SELECT id, name, balance, active 
-- FROM customer 
-- WHERE balance > 0 AND active = 1
-- ORDER BY balance DESC;

-- Ver movimientos recientes
-- SELECT 
--     dcm.id,
--     c.name as customer_name,
--     dcm.movement_type,
--     dcm.method_pay,
--     dcm.amount,
--     dcm.created_at
-- FROM detail_credit_customer dcm
-- INNER JOIN customer c ON dcm.customer_id = c.id
-- ORDER BY dcm.created_at DESC
-- LIMIT 20;

-- Ver resumen de movimientos por cliente
-- SELECT 
--     c.name,
--     c.balance as saldo_actual,
--     COUNT(dcm.id) as total_movimientos,
--     SUM(CASE WHEN dcm.movement_type = 'Consumo a crédito' THEN dcm.amount ELSE 0 END) as total_consumos,
--     SUM(CASE WHEN dcm.movement_type IN ('Anticipo', 'Pago total') THEN dcm.amount ELSE 0 END) as total_pagos
-- FROM customer c
-- LEFT JOIN detail_credit_customer dcm ON c.id = dcm.customer_id
-- WHERE c.active = 1
-- GROUP BY c.id, c.name, c.balance
-- ORDER BY c.balance DESC;
