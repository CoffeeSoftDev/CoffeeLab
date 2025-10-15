-- ============================================
-- KPI - REDES SOCIALES
-- Schema de Base de Datos
-- ============================================

-- Tabla de redes sociales
CREATE TABLE IF NOT EXISTS red_social (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    color VARCHAR(20),
    active SMALLINT(6) DEFAULT 1,
    UNIQUE KEY unique_network (nombre)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de métricas por red social
CREATE TABLE IF NOT EXISTS metrica_red (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    red_social_id INT(11) NOT NULL,
    active SMALLINT(6) DEFAULT 1,
    FOREIGN KEY (red_social_id) REFERENCES red_social(id) ON DELETE RESTRICT,
    UNIQUE KEY unique_metric (nombre, red_social_id),
    INDEX idx_red_social (red_social_id),
    INDEX idx_active (active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de historial de capturas mensuales
CREATE TABLE IF NOT EXISTS historial_red (
    id INT PRIMARY KEY AUTO_INCREMENT,
    mes INT(11) NOT NULL,
    año INT(11) NOT NULL,
    fecha_creacion DATETIME(0),
    udn_id INT(11) NOT NULL,
    active SMALLINT(6) DEFAULT 1,
    UNIQUE KEY unique_capture (udn_id, año, mes),
    INDEX idx_udn (udn_id),
    INDEX idx_year_month (año, mes),
    INDEX idx_active (active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de métricas capturadas por historial
CREATE TABLE IF NOT EXISTS metrica_historial_red (
    id INT PRIMARY KEY AUTO_INCREMENT,
    cantidad DECIMAL(10,0) NOT NULL DEFAULT 0,
    metrica_id INT(11) NOT NULL,
    historial_id INT(11) NOT NULL,
    FOREIGN KEY (metrica_id) REFERENCES metrica_red(id) ON DELETE RESTRICT,
    FOREIGN KEY (historial_id) REFERENCES historial_red(id) ON DELETE CASCADE,
    INDEX idx_metrica (metrica_id),
    INDEX idx_historial (historial_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Datos de ejemplo (opcional)
-- ============================================

-- Insertar redes sociales de ejemplo
INSERT INTO red_social (nombre, color, active) VALUES
('Facebook', '#1877F2', 1),
('Instagram', '#E4405F', 1),
('TikTok', '#000000', 1),
('Twitter', '#1DA1F2', 1),
('LinkedIn', '#0A66C2', 1)
ON DUPLICATE KEY UPDATE nombre=nombre;

-- Insertar métricas de ejemplo para Facebook (id=1)
INSERT INTO metrica_red (nombre, red_social_id, active) VALUES
('Alcance', 1, 1),
('Interacciones', 1, 1),
('Seguidores', 1, 1),
('Inversión', 1, 1),
('Visualizaciones', 1, 1)
ON DUPLICATE KEY UPDATE nombre=nombre;

-- Insertar métricas de ejemplo para Instagram (id=2)
INSERT INTO metrica_red (nombre, red_social_id, active) VALUES
('Alcance', 2, 1),
('Interacciones', 2, 1),
('Seguidores', 2, 1),
('Inversión', 2, 1),
('Visualizaciones', 2, 1)
ON DUPLICATE KEY UPDATE nombre=nombre;

-- Insertar métricas de ejemplo para TikTok (id=3)
INSERT INTO metrica_red (nombre, red_social_id, active) VALUES
('Alcance', 3, 1),
('Interacciones', 3, 1),
('Seguidores', 3, 1),
('Inversión', 3, 1),
('Visualizaciones', 3, 1)
ON DUPLICATE KEY UPDATE nombre=nombre;
