-- =====================================================
-- ERP Launcher Module - Database Schema
-- Usa las tablas existentes: modulos y submodulos
-- =====================================================

-- =====================================================
-- Verificar estructura de tablas existentes
-- =====================================================
-- La tabla 'modulos' debe tener:
-- - idModulo (int, PK)
-- - modulo (varchar(100))
-- - mod_ruta (text)
-- - mod_estado (smallint)
-- - mod_orden (int)

-- La tabla 'submodulos' debe tener:
-- - idSubmodulo (int, PK)
-- - submodulo (varchar(100))
-- - sub_ruta (text)
-- - sub_estado (smallint)
-- - sub_orden (int)
-- - sub_idModulo (int, FK)

-- =====================================================
-- Agregar campos adicionales para el launcher
-- =====================================================

-- Agregar campos a la tabla modulos si no existen
ALTER TABLE modulos 
ADD COLUMN IF NOT EXISTS mod_descripcion VARCHAR(255) DEFAULT NULL COMMENT 'Descripción del módulo',
ADD COLUMN IF NOT EXISTS mod_icono VARCHAR(50) DEFAULT NULL COMMENT 'Clase de icono Font Awesome',
ADD COLUMN IF NOT EXISTS mod_color VARCHAR(50) DEFAULT NULL COMMENT 'Color del icono (Tailwind)',
ADD COLUMN IF NOT EXISTS mod_badge VARCHAR(20) DEFAULT NULL COMMENT 'Badge: nuevo, legacy, null';

-- Agregar índices para optimizar consultas
ALTER TABLE modulos 
ADD INDEX IF NOT EXISTS idx_mod_estado (mod_estado),
ADD INDEX IF NOT EXISTS idx_mod_orden (mod_orden);

ALTER TABLE submodulos
ADD INDEX IF NOT EXISTS idx_sub_estado (sub_estado),
ADD INDEX IF NOT EXISTS idx_sub_modulo (sub_idModulo);

-- =====================================================
-- Tabla de logs de acceso (nueva)
-- =====================================================
CREATE TABLE IF NOT EXISTS modulos_access_logs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  module_id INT NOT NULL,
  access_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  ip_address VARCHAR(45),
  module_type ENUM('modulo', 'submodulo') DEFAULT 'modulo',
  INDEX idx_user (user_id),
  INDEX idx_module (module_id),
  INDEX idx_date (access_date),
  INDEX idx_type (module_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Actualizar datos existentes con información del launcher
-- =====================================================

-- Actualizar módulos principales con iconos y descripciones
UPDATE modulos SET 
  mod_descripcion = 'Indicadores clave de rendimiento',
  mod_icono = 'icon-chart-bar',
  mod_color = 'text-blue-600',
  mod_badge = 'nuevo'
WHERE modulo = 'KPI' AND mod_estado = 1;

UPDATE modulos SET 
  mod_descripcion = 'Gestión de producción y control de procesos',
  mod_icono = 'icon-cog',
  mod_color = 'text-orange-600',
  mod_badge = NULL
WHERE modulo = 'PRODUCCION' AND mod_estado = 1;

UPDATE modulos SET 
  mod_descripcion = 'Sistema de contabilidad y finanzas',
  mod_icono = 'icon-calculator',
  mod_color = 'text-green-600',
  mod_badge = NULL
WHERE modulo = 'CONTABILIDAD' AND mod_estado = 1;

UPDATE modulos SET 
  mod_descripcion = 'Costeo de recetas y subrecetas',
  mod_icono = 'icon-dollar',
  mod_color = 'text-purple-600',
  mod_badge = 'legacy'
WHERE modulo = 'COSTSYS' AND mod_estado = 1;

-- =====================================================
-- Insertar módulos si no existen
-- =====================================================

INSERT IGNORE INTO modulos (modulo, mod_ruta, mod_estado, mod_orden, mod_descripcion, mod_icono, mod_color, mod_badge) VALUES
('KPI', '../kpi/index.php', 1, 1, 'Indicadores clave de rendimiento', 'icon-chart-bar', 'text-blue-600', 'nuevo'),
('PRODUCCION', '../produccion/index.php', 1, 2, 'Gestión de producción y control de procesos', 'icon-cog', 'text-orange-600', NULL),
('CONTABILIDAD', '../contabilidad/index.php', 1, 3, 'Sistema de contabilidad y finanzas', 'icon-calculator', 'text-green-600', NULL),
('COSTSYS', '../produccion/costsys/index.php', 1, 4, 'Costeo de recetas y subrecetas', 'icon-dollar', 'text-purple-600', 'legacy');

-- =====================================================
-- Notas de implementación
-- =====================================================
-- 1. Los permisos de usuario se manejan a través de la lógica existente del sistema
-- 2. El campo mod_estado controla si el módulo está activo (1) o inactivo (0)
-- 3. El campo mod_orden define el orden de visualización en el launcher
-- 4. El campo mod_badge puede ser: 'nuevo', 'legacy', o NULL
-- 5. Los submódulos se pueden mostrar como opciones secundarias si es necesario
