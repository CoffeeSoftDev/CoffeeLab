-- =====================================================
-- Tabla: close_time
-- Descripción: Configuración de horarios de cierre mensual
-- =====================================================

CREATE TABLE IF NOT EXISTS close_time (
    id INT(11) PRIMARY KEY AUTO_INCREMENT,
    month TINYINT(2) NOT NULL COMMENT 'Mes del año (1-12)',
    close_time TIME NOT NULL COMMENT 'Hora de cierre del módulo',
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updated_by VARCHAR(100) COMMENT 'Usuario que realizó la última actualización',
    
    UNIQUE KEY uk_month (month)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Datos iniciales: Horarios por defecto (23:59)
-- =====================================================

INSERT INTO close_time (month, close_time) VALUES
(1, '23:59:00'),
(2, '23:59:00'),
(3, '23:59:00'),
(4, '23:59:00'),
(5, '23:59:00'),
(6, '23:59:00'),
(7, '23:59:00'),
(8, '23:59:00'),
(9, '23:59:00'),
(10, '23:59:00'),
(11, '23:59:00'),
(12, '23:59:00');
