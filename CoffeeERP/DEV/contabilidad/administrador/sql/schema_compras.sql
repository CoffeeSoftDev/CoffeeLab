-- ============================================
-- Script de Base de Datos - Módulo de Compras
-- Sistema: Contabilidad CoffeeSoft
-- Fecha: 2025-01-12
-- ============================================

-- Configuración de base de datos
CREATE DATABASE IF NOT EXISTS rfwsmqex_contabilidad 
CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE rfwsmqex_contabilidad;

-- ============================================
-- TABLAS DE CATÁLOGOS
-- ============================================

-- Tabla: tipo_compra
-- Descripción: Catálogo de tipos de compra (Fondo fijo, Corporativo, Crédito)
CREATE TABLE IF NOT EXISTS tipo_compra (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL,
    descripcion VARCHAR(255),
    activo TINYINT(1) DEFAULT 1,
    
    INDEX idx_activo (activo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: forma_pago
-- Descripción: Catálogo de métodos de pago disponibles
CREATE TABLE IF NOT EXISTS forma_pago (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL,
    descripcion VARCHAR(255),
    activo TINYINT(1) DEFAULT 1,
    
    INDEX idx_activo (activo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: clase_insumo
-- Descripción: Categorías de productos/insumos
CREATE TABLE IF NOT EXISTS clase_insumo (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    activo TINYINT(1) DEFAULT 1,
    
    INDEX idx_activo (activo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLAS PRINCIPALES
-- ============================================

-- Tabla: proveedores
-- Descripción: Catálogo de proveedores
CREATE TABLE IF NOT EXISTS proveedores (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(255) NOT NULL,
    rfc VARCHAR(13),
    telefono VARCHAR(20),
    email VARCHAR(100),
    direccion TEXT,
    activo TINYINT(1) DEFAULT 1,
    fecha_creacion DATETIME NOT NULL,
    
    UNIQUE KEY uk_nombre (nombre),
    INDEX idx_activo (activo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- Tabla: insumo
-- Descripción: Productos/insumos relacionados con categorías
CREATE TABLE IF NOT EXISTS insumo (
    id INT PRIMARY KEY AUTO_INCREMENT,
    clase_insumo_id INT NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    activo TINYINT(1) DEFAULT 1,
    
    FOREIGN KEY (clase_insumo_id) REFERENCES clase_insumo(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    INDEX idx_clase (clase_insumo_id),
    INDEX idx_activo (activo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: compras
-- Descripción: Registro principal de compras
CREATE TABLE IF NOT EXISTS compras (
    id INT PRIMARY KEY AUTO_INCREMENT,
    udn_id INT NOT NULL,
    insumo_id INT NOT NULL,
    clase_insumo_id INT NOT NULL,
    proveedor_id INT NOT NULL,
    tipo_compra_id INT NOT NULL,
    forma_pago_id INT NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    impuesto DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    total DECIMAL(10,2) NOT NULL,
    descripcion TEXT,
    fecha_operacion DATETIME NOT NULL,
    activo TINYINT(1) DEFAULT 1,
    
    FOREIGN KEY (insumo_id) REFERENCES insumo(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (clase_insumo_id) REFERENCES clase_insumo(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (proveedor_id) REFERENCES proveedores(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (tipo_compra_id) REFERENCES tipo_compra(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (forma_pago_id) REFERENCES forma_pago(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    
    INDEX idx_udn (udn_id),
    INDEX idx_tipo_compra (tipo_compra_id),
    INDEX idx_fecha (fecha_operacion),
    INDEX idx_activo (activo),
    INDEX idx_proveedor (proveedor_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- DATOS INICIALES
-- ============================================

-- Insertar tipos de compra
INSERT INTO tipo_compra (id, nombre, descripcion, activo) VALUES
(1, 'Fondo fijo', 'Compras realizadas con fondo fijo de la empresa', 1),
(2, 'Corporativo', 'Compras corporativas con tarjeta o cuenta empresarial', 1),
(3, 'Crédito', 'Compras a crédito con proveedores', 1)
ON DUPLICATE KEY UPDATE nombre = VALUES(nombre);

-- Insertar formas de pago
INSERT INTO forma_pago (nombre, descripcion, activo) VALUES
('Efectivo', 'Pago en efectivo', 1),
('Tarjeta de débito', 'Pago con tarjeta de débito', 1),
('Tarjeta de crédito', 'Pago con tarjeta de crédito', 1),
('Transferencia', 'Transferencia bancaria', 1),
('Almacén del área compras', 'Cargo al almacén del área de compras', 1)
ON DUPLICATE KEY UPDATE nombre = VALUES(nombre);


-- Insertar categorías de productos de ejemplo
INSERT INTO clase_insumo (nombre, descripcion, activo) VALUES
('Gastos de administración', 'Gastos relacionados con la administración de la empresa', 1),
('Gastos operativos', 'Gastos operativos del negocio', 1),
('Gastos en mantenimiento', 'Gastos de mantenimiento de instalaciones y equipos', 1),
('Costo directo', 'Costos directos de producción', 1),
('Costo indirecto', 'Costos indirectos de producción', 1),
('Gastos en publicidad', 'Gastos de marketing y publicidad', 1)
ON DUPLICATE KEY UPDATE nombre = VALUES(nombre);

-- Insertar productos de ejemplo
INSERT INTO insumo (clase_insumo_id, nombre, descripcion, activo) VALUES
(1, 'Servicio de internet', 'Servicio de internet empresarial', 1),
(1, 'Papelería', 'Material de oficina y papelería', 1),
(2, 'Gasolina', 'Combustible para vehículos', 1),
(2, 'Bizcoche', 'Productos de panadería', 1),
(2, 'Agua', 'Agua embotellada', 1),
(3, 'Fumigación', 'Servicio de fumigación', 1),
(4, 'Utensilios de producción', 'Herramientas y utensilios para producción', 1),
(5, 'Accesorios y refacciones', 'Refacciones y accesorios varios', 1),
(6, 'Publicidad', 'Servicios de publicidad y marketing', 1)
ON DUPLICATE KEY UPDATE nombre = VALUES(nombre);

-- Insertar proveedores de ejemplo
INSERT INTO proveedores (nombre, rfc, telefono, email, direccion, activo, fecha_creacion) VALUES
('Proveedor General', 'XAXX010101000', '5555555555', 'contacto@proveedor.com', 'Calle Principal #123', 1, NOW()),
('Servicios Corporativos SA', 'SCO850101ABC', '5544332211', 'ventas@servicios.com', 'Av. Reforma #456', 1, NOW()),
('Distribuidora Nacional', 'DIN900202XYZ', '5566778899', 'info@distribuidora.com', 'Blvd. Industrial #789', 1, NOW())
ON DUPLICATE KEY UPDATE nombre = VALUES(nombre);

-- ============================================
-- VISTAS ÚTILES
-- ============================================

-- Vista: compras_detalle
-- Descripción: Vista con información completa de compras
CREATE OR REPLACE VIEW compras_detalle AS
SELECT 
    c.id,
    c.udn_id,
    i.nombre AS producto,
    ci.nombre AS categoria_producto,
    p.nombre AS proveedor,
    tc.nombre AS tipo_compra,
    fp.nombre AS forma_pago,
    c.subtotal,
    c.impuesto,
    c.total,
    c.descripcion,
    c.fecha_operacion,
    c.activo
FROM compras c
INNER JOIN insumo i ON c.insumo_id = i.id
INNER JOIN clase_insumo ci ON c.clase_insumo_id = ci.id
INNER JOIN proveedores p ON c.proveedor_id = p.id
INNER JOIN tipo_compra tc ON c.tipo_compra_id = tc.id
INNER JOIN forma_pago fp ON c.forma_pago_id = fp.id;

-- ============================================
-- PROCEDIMIENTOS ALMACENADOS
-- ============================================

-- Procedimiento: calcular_totales_por_tipo
-- Descripción: Calcula los totales de compras agrupados por tipo
DELIMITER //

CREATE PROCEDURE IF NOT EXISTS calcular_totales_por_tipo(IN p_udn_id INT)
BEGIN
    SELECT 
        SUM(total) AS total_general,
        SUM(CASE WHEN tipo_compra_id = 1 THEN total ELSE 0 END) AS total_fondo_fijo,
        SUM(CASE WHEN tipo_compra_id = 2 THEN total ELSE 0 END) AS total_corporativo,
        SUM(CASE WHEN tipo_compra_id = 3 THEN total ELSE 0 END) AS total_credito
    FROM compras
    WHERE activo = 1 AND udn_id = p_udn_id;
END //

DELIMITER ;

-- ============================================
-- COMENTARIOS Y DOCUMENTACIÓN
-- ============================================


-- Comentarios de tablas
ALTER TABLE compras COMMENT = 'Registro principal de compras empresariales';
ALTER TABLE proveedores COMMENT = 'Catálogo de proveedores';
ALTER TABLE insumo COMMENT = 'Catálogo de productos/insumos';
ALTER TABLE clase_insumo COMMENT = 'Categorías de productos';
ALTER TABLE tipo_compra COMMENT = 'Tipos de compra (Fondo fijo, Corporativo, Crédito)';
ALTER TABLE forma_pago COMMENT = 'Métodos de pago disponibles';

-- ============================================
-- VERIFICACIÓN DE INTEGRIDAD
-- ============================================

-- Verificar que las tablas se crearon correctamente
SELECT 
    TABLE_NAME,
    TABLE_ROWS,
    CREATE_TIME
FROM information_schema.TABLES
WHERE TABLE_SCHEMA = 'rfwsmqex_contabilidad'
AND TABLE_NAME IN ('compras', 'proveedores', 'insumo', 'clase_insumo', 'tipo_compra', 'forma_pago')
ORDER BY TABLE_NAME;

-- Verificar relaciones de claves foráneas
SELECT 
    TABLE_NAME,
    COLUMN_NAME,
    CONSTRAINT_NAME,
    REFERENCED_TABLE_NAME,
    REFERENCED_COLUMN_NAME
FROM information_schema.KEY_COLUMN_USAGE
WHERE TABLE_SCHEMA = 'rfwsmqex_contabilidad'
AND REFERENCED_TABLE_NAME IS NOT NULL
ORDER BY TABLE_NAME, COLUMN_NAME;

-- ============================================
-- NOTAS DE IMPLEMENTACIÓN
-- ============================================

/*
NOTAS IMPORTANTES:

1. CONFIGURACIÓN DE BASE DE DATOS:
   - Asegúrate de que el usuario tenga permisos suficientes
   - Verifica que el charset sea utf8mb4 para soporte completo de caracteres

2. RELACIONES:
   - Todas las FK usan ON DELETE RESTRICT para prevenir eliminaciones accidentales
   - ON UPDATE CASCADE permite actualizar IDs si es necesario

3. ÍNDICES:
   - Se crearon índices en columnas de búsqueda frecuente
   - Los índices mejoran el rendimiento de consultas con WHERE y JOIN

4. DATOS INICIALES:
   - Los INSERT usan ON DUPLICATE KEY UPDATE para evitar errores en re-ejecución
   - Puedes agregar más datos de ejemplo según necesites

5. VISTA compras_detalle:
   - Facilita consultas con información completa
   - Útil para reportes y exportaciones

6. PROCEDIMIENTO calcular_totales_por_tipo:
   - Optimiza el cálculo de totales agrupados
   - Recibe udn_id como parámetro para filtrar por unidad de negocio

7. MIGRACIÓN:
   - Ejecuta este script en un ambiente de prueba primero
   - Realiza backup antes de ejecutar en producción
   - Verifica las consultas de verificación al final

8. MANTENIMIENTO:
   - Considera agregar triggers para auditoría si es necesario
   - Implementa políticas de backup regulares
   - Monitorea el crecimiento de la tabla compras
*/

-- ============================================
-- FIN DEL SCRIPT
-- ============================================
