-- ============================================
-- Schema: Módulo de Cuentas de Ventas
-- Tabla: categoria_venta
-- Descripción: Gestión de categorías de venta con permisos e impuestos
-- ============================================

CREATE TABLE IF NOT EXISTS categoria_venta (
    id INT AUTO_INCREMENT PRIMARY KEY,
    udn_id INT NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    permiso_descuento TINYINT(1) DEFAULT 0 COMMENT 'Permiso para aplicar descuentos',
    permiso_cortesia TINYINT(1) DEFAULT 0 COMMENT 'Permiso para aplicar cortesías',
    impuesto_iva TINYINT(1) DEFAULT 0 COMMENT 'Aplica IVA',
    impuesto_ieps TINYINT(1) DEFAULT 0 COMMENT 'Aplica IEPS',
    impuesto_hospedaje TINYINT(1) DEFAULT 0 COMMENT 'Aplica impuesto de hospedaje',
    impuesto_cero TINYINT(1) DEFAULT 0 COMMENT 'Aplica impuesto al 0%',
    activo TINYINT(1) DEFAULT 1 COMMENT '1=Activo, 0=Inactivo',
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (udn_id) REFERENCES udn(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    UNIQUE KEY unique_category_per_udn (udn_id, nombre),
    INDEX idx_udn_activo (udn_id, activo),
    INDEX idx_nombre (nombre)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Categorías de venta con permisos e impuestos';

-- ============================================
-- Datos de prueba
-- ============================================

-- Insertar categorías de ejemplo para UDN Baos (asumiendo udn_id = 1)
INSERT INTO categoria_venta (udn_id, nombre, permiso_descuento, permiso_cortesia, impuesto_iva, impuesto_ieps, impuesto_hospedaje, impuesto_cero, activo) VALUES
(1, 'Alimentos', 1, 1, 1, 0, 0, 0, 1),
(1, 'Bebidas', 1, 1, 1, 0, 0, 0, 1),
(1, 'Desayunos', 1, 0, 1, 0, 0, 0, 1),
(1, 'Descorche', 0, 0, 0, 0, 0, 1, 1),
(1, 'Hospedaje', 0, 0, 0, 0, 1, 0, 1);

-- Verificar inserción
SELECT 
    cv.id,
    u.nombre AS unidad_negocio,
    cv.nombre AS categoria,
    cv.permiso_descuento,
    cv.permiso_cortesia,
    cv.impuesto_iva,
    cv.impuesto_ieps,
    cv.impuesto_hospedaje,
    cv.impuesto_cero,
    cv.activo,
    cv.fecha_creacion
FROM categoria_venta cv
LEFT JOIN udn u ON cv.udn_id = u.id
ORDER BY cv.id;
