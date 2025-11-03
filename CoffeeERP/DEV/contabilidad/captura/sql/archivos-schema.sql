-- ============================================
-- Script de migración: Módulo de Archivos
-- Base de datos: rfwsmqex_contabilidad
-- Fecha: 2025-01-12
-- ============================================

USE rfwsmqex_contabilidad;

-- ============================================
-- Tabla: file
-- Descripción: Almacena información de archivos subidos al sistema
-- ============================================

CREATE TABLE IF NOT EXISTS file (
    id INT PRIMARY KEY AUTO_INCREMENT,
    udn_id INT NOT NULL COMMENT 'ID de la unidad de negocio',
    user_id INT NOT NULL COMMENT 'ID del usuario que subió el archivo',
    file_name VARCHAR(255) NOT NULL COMMENT 'Nombre original del archivo',
    upload_date DATETIME NOT NULL COMMENT 'Fecha y hora de subida',
    size_bytes BIGINT NOT NULL COMMENT 'Tamaño del archivo en bytes',
    path VARCHAR(500) NOT NULL COMMENT 'Ruta física del archivo en el servidor',
    extension VARCHAR(10) NOT NULL COMMENT 'Extensión del archivo (pdf, jpg, etc)',
    operation_date DATE NOT NULL COMMENT 'Fecha de la operación relacionada',
    module ENUM('Ventas', 'Compras', 'Almacén', 'Tesorería') NOT NULL COMMENT 'Módulo de origen',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación del registro',
    
    -- Índices para optimización
    INDEX idx_module (module),
    INDEX idx_operation_date (operation_date),
    INDEX idx_udn_id (udn_id),
    INDEX idx_composite (operation_date, module, udn_id),
    
    -- Claves foráneas
    CONSTRAINT fk_file_udn FOREIGN KEY (udn_id) REFERENCES udn(idUDN) ON DELETE RESTRICT,
    CONSTRAINT fk_file_user FOREIGN KEY (user_id) REFERENCES usuarios(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Archivos del sistema';

-- ============================================
-- Tabla: file_logs
-- Descripción: Registra auditoría de acciones sobre archivos
-- ============================================

CREATE TABLE IF NOT EXISTS file_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    file_id INT NOT NULL COMMENT 'ID del archivo',
    user_id INT NOT NULL COMMENT 'ID del usuario que realizó la acción',
    action ENUM('download', 'view', 'delete') NOT NULL COMMENT 'Tipo de acción realizada',
    action_date DATETIME NOT NULL COMMENT 'Fecha y hora de la acción',
    ip_address VARCHAR(45) COMMENT 'Dirección IP del usuario',
    
    -- Índices para optimización
    INDEX idx_file_id (file_id),
    INDEX idx_action_date (action_date),
    INDEX idx_user_id (user_id),
    
    -- Claves foráneas
    CONSTRAINT fk_log_file FOREIGN KEY (file_id) REFERENCES file(id) ON DELETE CASCADE,
    CONSTRAINT fk_log_user FOREIGN KEY (user_id) REFERENCES usuarios(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Auditoría de acciones sobre archivos';

-- ============================================
-- Datos de prueba (opcional)
-- ============================================

-- Insertar archivos de ejemplo (comentado por defecto)
/*
INSERT INTO file (udn_id, user_id, file_name, upload_date, size_bytes, path, extension, operation_date, module) VALUES
(1, 1, 'ventas_diciembre_2025.pdf', NOW(), 256000, 'uploads/ventas/ventas_diciembre_2025.pdf', 'pdf', '2025-12-01', 'Ventas'),
(1, 1, 'compras_enero_2025.xlsx', NOW(), 512000, 'uploads/compras/compras_enero_2025.xlsx', 'xlsx', '2025-01-15', 'Compras'),
(2, 1, 'salida_almacen_001.pdf', NOW(), 128000, 'uploads/almacen/salida_almacen_001.pdf', 'pdf', '2025-01-10', 'Almacén'),
(1, 1, 'pago_proveedor_123.pdf', NOW(), 320000, 'uploads/tesoreria/pago_proveedor_123.pdf', 'pdf', '2025-01-08', 'Tesorería');
*/

-- ============================================
-- Verificación de tablas creadas
-- ============================================

SELECT 
    'Tabla file creada correctamente' AS status,
    COUNT(*) AS total_columns
FROM information_schema.COLUMNS 
WHERE TABLE_SCHEMA = 'rfwsmqex_contabilidad' 
AND TABLE_NAME = 'file';

SELECT 
    'Tabla file_logs creada correctamente' AS status,
    COUNT(*) AS total_columns
FROM information_schema.COLUMNS 
WHERE TABLE_SCHEMA = 'rfwsmqex_contabilidad' 
AND TABLE_NAME = 'file_logs';

-- ============================================
-- Fin del script
-- ============================================
