-- ============================================
-- Módulo de Clientes - Database Schema
-- Sistema: CoffeeSoft ERP - Contabilidad
-- ============================================

-- Tabla: clients
-- Almacena información de clientes con crédito activo
CREATE TABLE IF NOT EXISTS clients (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL COMMENT 'Nombre completo del cliente',
    phone VARCHAR(20) COMMENT 'Teléfono de contacto',
    email VARCHAR(100) COMMENT 'Correo electrónico',
    udn_id INT NOT NULL COMMENT 'ID de la unidad de negocio',
    current_balance DECIMAL(10,2) DEFAULT 0.00 COMMENT 'Saldo actual del cliente',
    active TINYINT(1) DEFAULT 1 COMMENT '1=Activo, 0=Inactivo',
    date_create DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación',
    date_update DATETIME ON UPDATE CURRENT_TIMESTAMP COMMENT 'Fecha de última actualización',
    
    INDEX idx_udn (udn_id),
    INDEX idx_active (active),
    INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Clientes con crédito activo';

-- Tabla: credit_movements
-- Registra todos los movimientos de crédito (consumos, pagos, anticipos)
CREATE TABLE IF NOT EXISTS credit_movements (
    id INT PRIMARY KEY AUTO_INCREMENT,
    client_id INT NOT NULL COMMENT 'ID del cliente',
    udn_id INT NOT NULL COMMENT 'ID de la unidad de negocio',
    movement_type ENUM('consumo', 'abono_parcial', 'pago_total', 'anticipo') NOT NULL COMMENT 'Tipo de movimiento',
    payment_method ENUM('n/a', 'efectivo', 'banco') NOT NULL COMMENT 'Método de pago',
    amount DECIMAL(10,2) NOT NULL COMMENT 'Monto del movimiento',
    previous_balance DECIMAL(10,2) NOT NULL COMMENT 'Saldo anterior',
    new_balance DECIMAL(10,2) NOT NULL COMMENT 'Nuevo saldo después del movimiento',
    description TEXT COMMENT 'Descripción opcional del movimiento',
    capture_date DATE NOT NULL COMMENT 'Fecha de captura del movimiento',
    created_by INT NOT NULL COMMENT 'ID del usuario que creó el registro',
    updated_by INT COMMENT 'ID del usuario que actualizó el registro',
    date_create DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación del registro',
    date_update DATETIME ON UPDATE CURRENT_TIMESTAMP COMMENT 'Fecha de última actualización',
    active TINYINT(1) DEFAULT 1 COMMENT '1=Activo, 0=Eliminado (soft delete)',
    
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    INDEX idx_client (client_id),
    INDEX idx_udn (udn_id),
    INDEX idx_capture_date (capture_date),
    INDEX idx_movement_type (movement_type),
    INDEX idx_payment_method (payment_method),
    INDEX idx_active (active),
    INDEX idx_client_date (client_id, capture_date),
    INDEX idx_udn_date (udn_id, capture_date),
    INDEX idx_active_date (active, capture_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Movimientos de crédito de clientes';

-- Tabla: movement_audit_log
-- Registra auditoría de todas las acciones sobre movimientos
CREATE TABLE IF NOT EXISTS movement_audit_log (
    id INT PRIMARY KEY AUTO_INCREMENT,
    movement_id INT NOT NULL COMMENT 'ID del movimiento afectado',
    client_id INT NOT NULL COMMENT 'ID del cliente',
    action ENUM('create', 'update', 'delete') NOT NULL COMMENT 'Tipo de acción realizada',
    user_id INT NOT NULL COMMENT 'ID del usuario que realizó la acción',
    action_date DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha y hora de la acción',
    old_data JSON COMMENT 'Datos anteriores (para update y delete)',
    new_data JSON COMMENT 'Datos nuevos (para create y update)',
    
    INDEX idx_movement (movement_id),
    INDEX idx_client (client_id),
    INDEX idx_action_date (action_date),
    INDEX idx_user (user_id),
    INDEX idx_action (action)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Auditoría de movimientos de crédito';

-- ============================================
-- Datos iniciales de ejemplo (opcional)
-- ============================================

-- Insertar clientes de ejemplo
INSERT INTO clients (name, phone, email, udn_id, current_balance, active) VALUES
('American Express', '5551234567', 'contacto@amex.com', 1, 9500.00, 1),
('API', '5559876543', 'info@api.com', 1, 3500.00, 1),
('Asociación de Plataneros', '5555551234', 'asociacion@plataneros.com', 1, 0.00, 1),
('Cliente no Frecuente', '5554443322', 'cliente@nofrecuente.com', 1, 0.00, 1),
('Eventos', '5552223344', 'eventos@empresa.com', 1, 0.00, 1),
('Marina Chiapas', '5556667788', 'marina@chiapas.com', 1, 1500.00, 1);

-- ============================================
-- Vistas útiles para reportes
-- ============================================

-- Vista: client_balance_summary
-- Resumen de saldos y movimientos por cliente
CREATE OR REPLACE VIEW client_balance_summary AS
SELECT 
    c.id,
    c.name,
    c.phone,
    c.email,
    c.udn_id,
    c.current_balance,
    COUNT(cm.id) as total_movements,
    SUM(CASE WHEN cm.movement_type = 'consumo' THEN cm.amount ELSE 0 END) as total_consumptions,
    SUM(CASE WHEN cm.movement_type IN ('abono_parcial', 'pago_total') THEN cm.amount ELSE 0 END) as total_payments,
    MAX(cm.capture_date) as last_movement_date
FROM clients c
LEFT JOIN credit_movements cm ON c.id = cm.client_id AND cm.active = 1
WHERE c.active = 1
GROUP BY c.id;

-- Vista: daily_movements_summary
-- Resumen de movimientos diarios
CREATE OR REPLACE VIEW daily_movements_summary AS
SELECT 
    capture_date,
    udn_id,
    COUNT(*) as total_movements,
    SUM(CASE WHEN movement_type = 'consumo' THEN amount ELSE 0 END) as total_consumptions,
    SUM(CASE WHEN movement_type IN ('abono_parcial', 'pago_total') AND payment_method = 'efectivo' THEN amount ELSE 0 END) as total_cash_payments,
    SUM(CASE WHEN movement_type IN ('abono_parcial', 'pago_total') AND payment_method = 'banco' THEN amount ELSE 0 END) as total_bank_payments
FROM credit_movements
WHERE active = 1
GROUP BY capture_date, udn_id;

-- ============================================
-- Stored Procedures útiles
-- ============================================

DELIMITER $$

-- Procedimiento: calculate_client_balance
-- Calcula el saldo de un cliente en una fecha específica
CREATE PROCEDURE IF NOT EXISTS calculate_client_balance(
    IN p_client_id INT,
    IN p_date DATE,
    OUT p_balance DECIMAL(10,2)
)
BEGIN
    SELECT 
        COALESCE(
            SUM(CASE 
                WHEN movement_type = 'consumo' THEN amount
                WHEN movement_type IN ('abono_parcial', 'pago_total') THEN -amount
                ELSE 0
            END),
            0.00
        ) INTO p_balance
    FROM credit_movements
    WHERE client_id = p_client_id
        AND capture_date <= p_date
        AND active = 1;
END$$

-- Procedimiento: get_consolidated_report
-- Genera reporte consolidado por rango de fechas
CREATE PROCEDURE IF NOT EXISTS get_consolidated_report(
    IN p_udn_id INT,
    IN p_start_date DATE,
    IN p_end_date DATE
)
BEGIN
    SELECT 
        c.id,
        c.name as client_name,
        c.current_balance as initial_balance,
        COALESCE(SUM(CASE WHEN cm.movement_type = 'consumo' THEN cm.amount ELSE 0 END), 0) as total_consumptions,
        COALESCE(SUM(CASE WHEN cm.movement_type IN ('abono_parcial', 'pago_total') THEN cm.amount ELSE 0 END), 0) as total_payments,
        c.current_balance as final_balance,
        COUNT(cm.id) as movement_count
    FROM clients c
    LEFT JOIN credit_movements cm ON c.id = cm.client_id
        AND cm.capture_date BETWEEN p_start_date AND p_end_date
        AND cm.active = 1
    WHERE c.udn_id = p_udn_id
        AND c.active = 1
    GROUP BY c.id
    ORDER BY c.name;
END$$

DELIMITER ;

-- ============================================
-- Triggers para mantener integridad de datos
-- ============================================

DELIMITER $$

-- Trigger: after_movement_insert
-- Actualiza el saldo del cliente después de insertar un movimiento
CREATE TRIGGER IF NOT EXISTS after_movement_insert
AFTER INSERT ON credit_movements
FOR EACH ROW
BEGIN
    IF NEW.active = 1 THEN
        UPDATE clients
        SET current_balance = NEW.new_balance,
            date_update = NOW()
        WHERE id = NEW.client_id;
    END IF;
END$$

-- Trigger: after_movement_update
-- Actualiza el saldo del cliente después de actualizar un movimiento
CREATE TRIGGER IF NOT EXISTS after_movement_update
AFTER UPDATE ON credit_movements
FOR EACH ROW
BEGIN
    IF NEW.active = 1 THEN
        UPDATE clients
        SET current_balance = NEW.new_balance,
            date_update = NOW()
        WHERE id = NEW.client_id;
    ELSE
        -- Si se desactiva el movimiento, recalcular saldo
        DECLARE v_balance DECIMAL(10,2);
        CALL calculate_client_balance(NEW.client_id, CURDATE(), v_balance);
        UPDATE clients
        SET current_balance = v_balance,
            date_update = NOW()
        WHERE id = NEW.client_id;
    END IF;
END$$

DELIMITER ;

-- ============================================
-- Fin del script
-- ============================================
