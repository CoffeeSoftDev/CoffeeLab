-- =====================================================
-- Tabla: module_unlock
-- Descripción: Registro de solicitudes de apertura de módulos
-- =====================================================

CREATE TABLE IF NOT EXISTS module_unlock (
    id INT(11) PRIMARY KEY AUTO_INCREMENT,
    udn_id INT(11) NOT NULL COMMENT 'ID de la unidad de negocio',
    module_id INT(11) NOT NULL COMMENT 'ID del módulo operativo',
    unlock_date DATE NOT NULL COMMENT 'Fecha de solicitud de apertura',
    lock_date DATE NULL COMMENT 'Fecha de cierre del módulo',
    lock_reason TEXT NOT NULL COMMENT 'Motivo de la apertura',
    operation_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de última operación',
    active TINYINT(1) NOT NULL DEFAULT 1 COMMENT '1=desbloqueado, 0=bloqueado',
    
    FOREIGN KEY (udn_id) REFERENCES udn(idUDN) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (module_id) REFERENCES module(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    
    INDEX idx_active (active),
    INDEX idx_unlock_date (unlock_date),
    INDEX idx_udn_module (udn_id, module_id),
    INDEX idx_operation_date (operation_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
