-- ============================================
-- KPI - REDES SOCIALES
-- Sistema de gestión y análisis de métricas de redes sociales
-- ============================================

-- Tabla de redes sociales
CREATE TABLE IF NOT EXISTS kpi_social_networks (
    id INT PRIMARY KEY AUTO_INCREMENT,
    subsidiaries_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    icon VARCHAR(50) DEFAULT NULL COMMENT 'Clase de icono (ej: icon-facebook, icon-instagram)',
    color VARCHAR(20) DEFAULT NULL COMMENT 'Color hexadecimal para identificación visual',
    description TEXT,
    active TINYINT(1) DEFAULT 1 COMMENT '1=Activo, 0=Inactivo',
    date_creation DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_network (subsidiaries_id, name),
    INDEX idx_subsidiaries (subsidiaries_id),
    INDEX idx_active (active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Catálogo de redes sociales por unidad de negocio';

-- Tabla de métricas
CREATE TABLE IF NOT EXISTS kpi_metrics (
    id INT PRIMARY KEY AUTO_INCREMENT,
    subsidiaries_id INT NOT NULL,
    social_network_id INT NOT NULL,
    name VARCHAR(100) NOT NULL COMMENT 'Nombre de la métrica (ej: Alcance, Interacciones, Seguidores)',
    description TEXT,
    active TINYINT(1) DEFAULT 1 COMMENT '1=Activo, 0=Inactivo',
    date_creation DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (social_network_id) REFERENCES kpi_social_networks(id) ON DELETE RESTRICT,
    UNIQUE KEY unique_metric (subsidiaries_id, social_network_id, name),
    INDEX idx_subsidiaries (subsidiaries_id),
    INDEX idx_social_network (social_network_id),
    INDEX idx_active (active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Catálogo de métricas por red social';

-- Tabla de capturas mensuales
CREATE TABLE IF NOT EXISTS kpi_social_captures (
    id INT PRIMARY KEY AUTO_INCREMENT,
    subsidiaries_id INT NOT NULL,
    social_network_id INT NOT NULL,
    year INT NOT NULL COMMENT 'Año de la captura',
    month INT NOT NULL COMMENT 'Mes de la captura (1-12)',
    date_creation DATETIME DEFAULT CURRENT_TIMESTAMP,
    user_id INT DEFAULT NULL COMMENT 'Usuario que realizó la captura',
    UNIQUE KEY unique_capture (subsidiaries_id, social_network_id, year, month),
    FOREIGN KEY (social_network_id) REFERENCES kpi_social_networks(id) ON DELETE RESTRICT,
    INDEX idx_subsidiaries (subsidiaries_id),
    INDEX idx_social_network (social_network_id),
    INDEX idx_year_month (year, month),
    INDEX idx_date_creation (date_creation)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Registro de capturas mensuales de métricas por red social';

-- Tabla de movimientos de métricas
CREATE TABLE IF NOT EXISTS kpi_metric_movements (
    id INT PRIMARY KEY AUTO_INCREMENT,
    capture_id INT NOT NULL,
    metric_id INT NOT NULL,
    value DECIMAL(15,2) NOT NULL DEFAULT 0.00 COMMENT 'Valor de la métrica',
    date_creation DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (capture_id) REFERENCES kpi_social_captures(id) ON DELETE CASCADE,
    FOREIGN KEY (metric_id) REFERENCES kpi_metrics(id) ON DELETE RESTRICT,
    INDEX idx_capture (capture_id),
    INDEX idx_metric (metric_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Detalle de valores de métricas por captura mensual';

-- ============================================
-- DATOS DE EJEMPLO
-- ============================================

-- Insertar redes sociales de ejemplo (ajustar subsidiaries_id según tu sistema)
INSERT INTO kpi_social_networks (subsidiaries_id, name, icon, color, description, active) VALUES
(1, 'Facebook', 'icon-facebook', '#1877F2', 'Red social principal para alcance masivo', 1),
(1, 'Instagram', 'icon-instagram', '#E4405F', 'Plataforma visual para engagement', 1),
(1, 'TikTok', 'icon-tiktok', '#000000', 'Videos cortos y tendencias virales', 1),
(1, 'Twitter', 'icon-twitter', '#1DA1F2', 'Microblogging y noticias en tiempo real', 1),
(1, 'LinkedIn', 'icon-linkedin', '#0A66C2', 'Red profesional B2B', 1),
(1, 'YouTube', 'icon-youtube', '#FF0000', 'Plataforma de videos de larga duración', 1);

-- Insertar métricas de ejemplo para Facebook
INSERT INTO kpi_metrics (subsidiaries_id, social_network_id, name, description, active) VALUES
(1, 1, 'Alcance', 'Número de personas únicas que vieron el contenido', 1),
(1, 1, 'Interacciones', 'Total de likes, comentarios, compartidos y clics', 1),
(1, 1, 'Seguidores', 'Número total de seguidores de la página', 1),
(1, 1, 'Inversión', 'Monto invertido en publicidad (MXN)', 1),
(1, 1, 'Visualizaciones', 'Número de veces que se visualizó el contenido', 1);

-- Insertar métricas de ejemplo para Instagram
INSERT INTO kpi_metrics (subsidiaries_id, social_network_id, name, description, active) VALUES
(1, 2, 'Alcance', 'Cuentas únicas alcanzadas', 1),
(1, 2, 'Interacciones', 'Likes, comentarios, guardados y compartidos', 1),
(1, 2, 'Seguidores', 'Total de seguidores del perfil', 1),
(1, 2, 'Inversión', 'Presupuesto en anuncios (MXN)', 1),
(1, 2, 'Impresiones', 'Veces que se mostró el contenido', 1),
(1, 2, 'Stories Views', 'Visualizaciones de historias', 1);

-- ============================================
-- CONSULTAS ÚTILES
-- ============================================

-- Ver todas las redes sociales activas
-- SELECT * FROM kpi_social_networks WHERE active = 1;

-- Ver métricas por red social
-- SELECT 
--     sn.name AS red_social,
--     m.name AS metrica,
--     m.description
-- FROM kpi_metrics m
-- INNER JOIN kpi_social_networks sn ON m.social_network_id = sn.id
-- WHERE m.active = 1
-- ORDER BY sn.name, m.name;

-- Ver capturas del mes actual
-- SELECT 
--     sn.name AS red_social,
--     sc.year,
--     sc.month,
--     sc.date_creation
-- FROM kpi_social_captures sc
-- INNER JOIN kpi_social_networks sn ON sc.social_network_id = sn.id
-- WHERE sc.year = YEAR(CURDATE()) 
--   AND sc.month = MONTH(CURDATE());

-- Ver movimientos de métricas de una captura
-- SELECT 
--     m.name AS metrica,
--     mm.value AS valor,
--     mm.date_creation
-- FROM kpi_metric_movements mm
-- INNER JOIN kpi_metrics m ON mm.metric_id = m.id
-- WHERE mm.capture_id = 1;
