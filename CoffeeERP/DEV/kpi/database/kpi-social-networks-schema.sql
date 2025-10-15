-- ============================================
-- KPI - REDES SOCIALES
-- Schema de Base de Datos
-- ============================================

-- Tabla de redes sociales
CREATE TABLE IF NOT EXISTS kpi_social_networks (
    id INT PRIMARY KEY AUTO_INCREMENT,
    subsidiaries_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    icon VARCHAR(50),
    color VARCHAR(20),
    description TEXT,
    active TINYINT(1) DEFAULT 1,
    date_creation DATETIME,
    UNIQUE KEY unique_network (subsidiaries_id, name),
    INDEX idx_subsidiaries (subsidiaries_id),
    INDEX idx_active (active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de métricas
CREATE TABLE IF NOT EXISTS kpi_metrics (
    id INT PRIMARY KEY AUTO_INCREMENT,
    subsidiaries_id INT NOT NULL,
    social_network_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    active TINYINT(1) DEFAULT 1,
    date_creation DATETIME,
    FOREIGN KEY (social_network_id) REFERENCES kpi_social_networks(id) ON DELETE RESTRICT,
    UNIQUE KEY unique_metric (subsidiaries_id, social_network_id, name),
    INDEX idx_subsidiaries (subsidiaries_id),
    INDEX idx_social_network (social_network_id),
    INDEX idx_active (active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de capturas mensuales
CREATE TABLE IF NOT EXISTS kpi_social_captures (
    id INT PRIMARY KEY AUTO_INCREMENT,
    subsidiaries_id INT NOT NULL,
    social_network_id INT NOT NULL,
    year INT NOT NULL,
    month INT NOT NULL,
    date_creation DATETIME,
    user_id INT,
    FOREIGN KEY (social_network_id) REFERENCES kpi_social_networks(id) ON DELETE RESTRICT,
    UNIQUE KEY unique_capture (subsidiaries_id, social_network_id, year, month),
    INDEX idx_subsidiaries (subsidiaries_id),
    INDEX idx_social_network (social_network_id),
    INDEX idx_year_month (year, month)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de movimientos de métricas
CREATE TABLE IF NOT EXISTS kpi_metric_movements (
    id INT PRIMARY KEY AUTO_INCREMENT,
    capture_id INT NOT NULL,
    metric_id INT NOT NULL,
    value DECIMAL(15,2) NOT NULL DEFAULT 0,
    date_creation DATETIME,
    FOREIGN KEY (capture_id) REFERENCES kpi_social_captures(id) ON DELETE CASCADE,
    FOREIGN KEY (metric_id) REFERENCES kpi_metrics(id) ON DELETE RESTRICT,
    INDEX idx_capture (capture_id),
    INDEX idx_metric (metric_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Datos de ejemplo (opcional)
-- ============================================

-- Insertar redes sociales de ejemplo
INSERT INTO kpi_social_networks (subsidiaries_id, name, icon, color, description, active, date_creation) VALUES
(1, 'Facebook', 'fab fa-facebook', '#1877F2', 'Red social principal', 1, NOW()),
(1, 'Instagram', 'fab fa-instagram', '#E4405F', 'Plataforma visual', 1, NOW()),
(1, 'TikTok', 'fab fa-tiktok', '#000000', 'Videos cortos', 1, NOW()),
(1, 'Twitter', 'fab fa-twitter', '#1DA1F2', 'Microblogging', 1, NOW()),
(1, 'LinkedIn', 'fab fa-linkedin', '#0A66C2', 'Red profesional', 1, NOW())
ON DUPLICATE KEY UPDATE name=name;

-- Insertar métricas de ejemplo para Facebook
INSERT INTO kpi_metrics (subsidiaries_id, social_network_id, name, description, active, date_creation) VALUES
(1, 1, 'Alcance', 'Número de personas que vieron el contenido', 1, NOW()),
(1, 1, 'Interacciones', 'Likes, comentarios y compartidos', 1, NOW()),
(1, 1, 'Seguidores', 'Número total de seguidores', 1, NOW()),
(1, 1, 'Inversión', 'Monto invertido en publicidad', 1, NOW()),
(1, 1, 'Visualizaciones', 'Número de visualizaciones de contenido', 1, NOW())
ON DUPLICATE KEY UPDATE name=name;

-- Insertar métricas de ejemplo para Instagram
INSERT INTO kpi_metrics (subsidiaries_id, social_network_id, name, description, active, date_creation) VALUES
(1, 2, 'Alcance', 'Número de cuentas únicas alcanzadas', 1, NOW()),
(1, 2, 'Interacciones', 'Likes, comentarios y guardados', 1, NOW()),
(1, 2, 'Seguidores', 'Número total de seguidores', 1, NOW()),
(1, 2, 'Inversión', 'Monto invertido en publicidad', 1, NOW()),
(1, 2, 'Visualizaciones', 'Visualizaciones de historias y reels', 1, NOW())
ON DUPLICATE KEY UPDATE name=name;
