-- ============================================
-- KPI - MÓDULO DE REDES SOCIALES
-- Sistema de gestión y análisis de métricas de redes sociales
-- ============================================

-- Tabla de redes sociales
CREATE TABLE IF NOT EXISTS kpi_social_networks (
    id INT PRIMARY KEY AUTO_INCREMENT,
    subsidiaries_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    icon VARCHAR(50) DEFAULT NULL COMMENT 'Clase de icono (ej: icon-facebook, icon-instagram)',
    color VARCHAR(20) DEFAULT NULL COMMENT 'Color hexadecimal para identificación visual',
    description TEXT DEFAULT NULL,
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
    description TEXT DEFAULT NULL,
    active TINYINT(1) DEFAULT 1 COMMENT '1=Activo, 0=Inactivo',
    date_creation DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (social_network_id) REFERENCES kpi_social_networks(id) ON DELETE RESTRICT ON UPDATE CASCADE,
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
    FOREIGN KEY (social_network_id) REFERENCES kpi_social_networks(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    UNIQUE KEY unique_capture (subsidiaries_id, social_network_id, year, month),
    INDEX idx_subsidiaries (subsidiaries_id),
    INDEX idx_social_network (social_network_id),
    INDEX idx_year_month (year, month),
    INDEX idx_date_creation (date_creation)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Registro de capturas mensuales de métricas';

-- Tabla de movimientos de métricas
CREATE TABLE IF NOT EXISTS kpi_metric_movements (
    id INT PRIMARY KEY AUTO_INCREMENT,
    capture_id INT NOT NULL,
    metric_id INT NOT NULL,
    value DECIMAL(15,2) NOT NULL DEFAULT 0.00 COMMENT 'Valor de la métrica',
    date_creation DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (capture_id) REFERENCES kpi_social_captures(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (metric_id) REFERENCES kpi_metrics(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    INDEX idx_capture (capture_id),
    INDEX idx_metric (metric_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Valores de métricas por captura mensual';

-- ============================================
-- DATOS DE EJEMPLO (OPCIONAL)
-- ============================================

-- Insertar redes sociales de ejemplo
INSERT INTO kpi_social_networks (subsidiaries_id, name, icon, color, description, active) VALUES
(1, 'Facebook', 'icon-facebook', '#1877F2', 'Red social principal para alcance masivo', 1),
(1, 'Instagram', 'icon-instagram', '#E4405F', 'Plataforma visual para engagement', 1),
(1, 'TikTok', 'icon-tiktok', '#000000', 'Videos cortos y tendencias virales', 1),
(1, 'Twitter', 'icon-twitter', '#1DA1F2', 'Microblogging y noticias en tiempo real', 1),
(1, 'LinkedIn', 'icon-linkedin', '#0A66C2', 'Red profesional B2B', 1);

-- Insertar métricas de ejemplo para Facebook
INSERT INTO kpi_metrics (subsidiaries_id, social_network_id, name, description, active) VALUES
(1, 1, 'Alcance', 'Número de personas que vieron el contenido', 1),
(1, 1, 'Interacciones', 'Total de likes, comentarios y compartidos', 1),
(1, 1, 'Seguidores', 'Número total de seguidores de la página', 1),
(1, 1, 'Visualizaciones', 'Número de veces que se visualizó el contenido', 1),
(1, 1, 'Inversión', 'Monto invertido en publicidad (MXN)', 1);

-- Insertar métricas de ejemplo para Instagram
INSERT INTO kpi_metrics (subsidiaries_id, social_network_id, name, description, active) VALUES
(1, 2, 'Alcance', 'Cuentas únicas alcanzadas', 1),
(1, 2, 'Interacciones', 'Likes, comentarios, guardados y compartidos', 1),
(1, 2, 'Seguidores', 'Total de seguidores del perfil', 1),
(1, 2, 'Visualizaciones', 'Reproducciones de stories y reels', 1),
(1, 2, 'Inversión', 'Presupuesto en anuncios (MXN)', 1);

-- ============================================
-- VISTAS ÚTILES
-- ============================================

-- Vista de resumen de capturas con información completa
CREATE OR REPLACE VIEW vw_social_captures_summary AS
SELECT 
    sc.id,
    sc.subsidiaries_id,
    sn.name AS social_network,
    sn.icon,
    sn.color,
    sc.year,
    sc.month,
    sc.date_creation,
    COUNT(mm.id) AS total_metrics,
    SUM(mm.value) AS total_value
FROM kpi_social_captures sc
INNER JOIN kpi_social_networks sn ON sc.social_network_id = sn.id
LEFT JOIN kpi_metric_movements mm ON sc.id = mm.capture_id
GROUP BY sc.id, sc.subsidiaries_id, sn.name, sn.icon, sn.color, sc.year, sc.month, sc.date_creation;

-- Vista de métricas con información de red social
CREATE OR REPLACE VIEW vw_metrics_with_network AS
SELECT 
    m.id,
    m.subsidiaries_id,
    m.social_network_id,
    sn.name AS social_network,
    sn.icon,
    sn.color,
    m.name AS metric_name,
    m.description,
    m.active,
    m.date_creation
FROM kpi_metrics m
INNER JOIN kpi_social_networks sn ON m.social_network_id = sn.id;

-- ============================================
-- PROCEDIMIENTOS ALMACENADOS (OPCIONAL)
-- ============================================

-- Procedimiento para obtener comparativa mensual
DELIMITER $$
CREATE PROCEDURE IF NOT EXISTS sp_get_monthly_comparative(
    IN p_subsidiaries_id INT,
    IN p_social_network_id INT,
    IN p_year INT,
    IN p_month INT
)
BEGIN
    SELECT 
        m.name AS metric_name,
        COALESCE(prev.value, 0) AS previous_month,
        COALESCE(curr.value, 0) AS current_month,
        COALESCE(curr.value, 0) - COALESCE(prev.value, 0) AS comparison,
        CASE 
            WHEN COALESCE(prev.value, 0) = 0 THEN 0
            ELSE ROUND(((COALESCE(curr.value, 0) - COALESCE(prev.value, 0)) / prev.value) * 100, 2)
        END AS percentage
    FROM kpi_metrics m
    LEFT JOIN (
        SELECT mm.metric_id, mm.value
        FROM kpi_metric_movements mm
        INNER JOIN kpi_social_captures sc ON mm.capture_id = sc.id
        WHERE sc.subsidiaries_id = p_subsidiaries_id
        AND sc.social_network_id = p_social_network_id
        AND sc.year = p_year
        AND sc.month = p_month
    ) curr ON m.id = curr.metric_id
    LEFT JOIN (
        SELECT mm.metric_id, mm.value
        FROM kpi_metric_movements mm
        INNER JOIN kpi_social_captures sc ON mm.capture_id = sc.id
        WHERE sc.subsidiaries_id = p_subsidiaries_id
        AND sc.social_network_id = p_social_network_id
        AND (
            (sc.year = p_year AND sc.month = p_month - 1) OR
            (sc.year = p_year - 1 AND sc.month = 12 AND p_month = 1)
        )
    ) prev ON m.id = prev.metric_id
    WHERE m.subsidiaries_id = p_subsidiaries_id
    AND m.social_network_id = p_social_network_id
    AND m.active = 1;
END$$
DELIMITER ;

-- ============================================
-- ÍNDICES ADICIONALES PARA OPTIMIZACIÓN
-- ============================================

-- Índice compuesto para búsquedas frecuentes
CREATE INDEX idx_capture_year_month_network ON kpi_social_captures(subsidiaries_id, social_network_id, year, month);

-- Índice para reportes de tendencias
CREATE INDEX idx_movements_capture_metric ON kpi_metric_movements(capture_id, metric_id, value);

-- ============================================
-- COMENTARIOS FINALES
-- ============================================

/*
NOTAS DE IMPLEMENTACIÓN:

1. INTEGRIDAD REFERENCIAL:
   - Las métricas están vinculadas a redes sociales (ON DELETE RESTRICT)
   - Los movimientos se eliminan en cascada si se elimina la captura (ON DELETE CASCADE)
   - Las redes sociales no se pueden eliminar si tienen métricas asociadas

2. VALIDACIONES:
   - Unicidad de redes sociales por UDN (unique_network)
   - Unicidad de métricas por red social y UDN (unique_metric)
   - Unicidad de capturas por mes/año/red social/UDN (unique_capture)

3. ÍNDICES:
   - Optimizados para consultas por UDN, red social, año y mes
   - Índices en campos de búsqueda frecuente (active, date_creation)

4. TIPOS DE DATOS:
   - DECIMAL(15,2) para valores de métricas (soporta hasta 999,999,999,999.99)
   - TINYINT(1) para campos booleanos (active)
   - VARCHAR con longitudes apropiadas para evitar desperdicio de espacio

5. CHARSET:
   - utf8mb4_unicode_ci para soporte completo de caracteres especiales y emojis
*/
