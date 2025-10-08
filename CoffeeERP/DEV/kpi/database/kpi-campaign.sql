-- =============================================
-- Base de datos: rfwsmqex_kpi
-- Módulo: Campañas de Marketing
-- =============================================

-- Tabla: Tipos de Campaña
CREATE TABLE IF NOT EXISTS `rfwsmqex_kpi`.`campaign_types` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `udn_id` INT NOT NULL,
  `description` TEXT NULL,
  `active` TINYINT(1) DEFAULT 1,
  `date_creation` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_udn` (`udn_id`),
  INDEX `idx_active` (`active`),
  CONSTRAINT `fk_campaign_types_udn` FOREIGN KEY (`udn_id`) REFERENCES `rfwsmqex_gvsl_finanzas`.`udn`(`idUDN`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: Clasificación de Campaña
CREATE TABLE IF NOT EXISTS `rfwsmqex_kpi`.`campaign_classification` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `udn_id` INT NOT NULL,
  `description` TEXT NULL,
  `active` TINYINT(1) DEFAULT 1,
  `date_creation` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_udn` (`udn_id`),
  INDEX `idx_active` (`active`),
  CONSTRAINT `fk_campaign_classification_udn` FOREIGN KEY (`udn_id`) REFERENCES `rfwsmqex_gvsl_finanzas`.`udn`(`idUDN`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Datos de ejemplo para Tipos de Campaña
INSERT INTO `rfwsmqex_kpi`.`campaign_types` (`name`, `udn_id`, `description`, `active`) VALUES
('Promoción de Temporada', 1, 'Campañas relacionadas con fechas especiales', 1),
('Lanzamiento de Producto', 1, 'Campañas para nuevos productos', 1),
('Fidelización', 1, 'Campañas para retener clientes', 1);

-- Datos de ejemplo para Clasificación de Campaña
INSERT INTO `rfwsmqex_kpi`.`campaign_classification` (`name`, `udn_id`, `description`, `active`) VALUES
('Digital', 1, 'Campañas en medios digitales', 1),
('Tradicional', 1, 'Campañas en medios tradicionales', 1),
('Mixta', 1, 'Campañas que combinan ambos medios', 1);

-- =============================================
-- ETAPA 2: Anuncios
-- =============================================

-- Tabla: Campañas
CREATE TABLE IF NOT EXISTS `rfwsmqex_kpi`.`campaigns` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(150) NOT NULL,
  `udn_id` INT NOT NULL,
  `social_network` VARCHAR(50) NULL COMMENT 'Facebook, Instagram, TikTok, etc.',
  `strategy` TEXT NULL,
  `start_date` DATE NULL,
  `end_date` DATE NULL,
  `active` TINYINT(1) DEFAULT 1,
  `date_creation` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_udn` (`udn_id`),
  INDEX `idx_active` (`active`),
  INDEX `idx_dates` (`start_date`, `end_date`),
  CONSTRAINT `fk_campaigns_udn` FOREIGN KEY (`udn_id`) REFERENCES `rfwsmqex_gvsl_finanzas`.`udn`(`idUDN`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: Anuncios
CREATE TABLE IF NOT EXISTS `rfwsmqex_kpi`.`campaign_ads` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `campaign_id` INT NOT NULL,
  `ad_name` VARCHAR(150) NOT NULL,
  `title` VARCHAR(200) NULL,
  `subtitle` VARCHAR(200) NULL,
  `description` TEXT NULL,
  `image` VARCHAR(255) NULL,
  `type_id` INT NULL COMMENT 'FK a campaign_types',
  `classification_id` INT NULL COMMENT 'FK a campaign_classification',
  `start_date` DATE NULL,
  `end_date` DATE NULL,
  `active` TINYINT(1) DEFAULT 1,
  `date_creation` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_campaign` (`campaign_id`),
  INDEX `idx_type` (`type_id`),
  INDEX `idx_classification` (`classification_id`),
  INDEX `idx_active` (`active`),
  FOREIGN KEY (`campaign_id`) REFERENCES `campaigns`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`type_id`) REFERENCES `campaign_types`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`classification_id`) REFERENCES `campaign_classification`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: Resultados de Anuncios
CREATE TABLE IF NOT EXISTS `rfwsmqex_kpi`.`campaign_ad_results` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `ad_id` INT NOT NULL,
  `total_spent` DECIMAL(10,2) DEFAULT 0.00,
  `total_clicks` INT DEFAULT 0,
  `total_results` INT DEFAULT 0,
  `cost_per_result` DECIMAL(10,2) DEFAULT 0.00 COMMENT 'Se calcula automáticamente',
  `date_recorded` DATE DEFAULT NULL,
  `date_creation` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_ad` (`ad_id`),
  INDEX `idx_date` (`date_recorded`),
  FOREIGN KEY (`ad_id`) REFERENCES `campaign_ads`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Datos de ejemplo para Campañas
INSERT INTO `rfwsmqex_kpi`.`campaigns` (`name`, `udn_id`, `social_network`, `strategy`, `start_date`, `end_date`, `active`) VALUES
('Campaña Verano 2025', 1, 'Facebook', 'Aumentar ventas en temporada alta', '2025-06-01', '2025-08-31', 1),
('Black Friday 2025', 1, 'Instagram', 'Promociones especiales fin de año', '2025-11-20', '2025-11-30', 1);

-- Datos de ejemplo para Anuncios
INSERT INTO `rfwsmqex_kpi`.`campaign_ads` (`campaign_id`, `ad_name`, `title`, `subtitle`, `description`, `type_id`, `classification_id`, `start_date`, `end_date`, `active`) VALUES
(1, 'Anuncio Verano 1', 'Disfruta el Verano', 'Ofertas especiales', 'Promociones de verano con descuentos', 1, 1, '2025-07-01', '2025-07-15', 1),
(1, 'Anuncio Verano 2', 'Verano Total', 'Descuentos increíbles', 'Segunda fase de promociones verano', 2, 1, '2025-07-16', '2025-07-31', 1),
(2, 'Anuncio Black Friday', 'Black Friday 2025', 'Hasta 50% de descuento', 'Las mejores ofertas del año', 1, 2, '2025-07-20', '2025-07-30', 1),
(2, 'Anuncio Cyber Monday', 'Cyber Monday', 'Ofertas online', 'Descuentos especiales online', 3, 1, '2025-07-25', '2025-07-31', 1);

-- Datos de ejemplo para Resultados de Anuncios
INSERT INTO `rfwsmqex_kpi`.`campaign_ad_results` (`ad_id`, `total_spent`, `total_clicks`, `total_results`, `cost_per_result`, `date_recorded`) VALUES
(1, 1500.00, 750, 50, 30.00, '2025-07-15'),
(2, 2200.00, 1100, 75, 29.33, '2025-07-31'),
(3, 3000.00, 1800, 120, 25.00, '2025-07-30'),
(4, 1800.00, 900, 60, 30.00, '2025-07-31');

-- Más campañas para datos de prueba
INSERT INTO `rfwsmqex_kpi`.`campaigns` (`name`, `udn_id`, `social_network`, `strategy`, `start_date`, `end_date`, `active`) VALUES
('Campaña Navidad 2025', 1, 'TikTok', 'Promociones navideñas para jóvenes', '2025-07-01', '2025-07-31', 1),
('Campaña San Valentín', 1, 'Instagram', 'Ofertas románticas para parejas', '2025-07-10', '2025-07-20', 1);

-- Más anuncios para las nuevas campañas
INSERT INTO `rfwsmqex_kpi`.`campaign_ads` (`campaign_id`, `ad_name`, `title`, `subtitle`, `description`, `type_id`, `classification_id`, `start_date`, `end_date`, `active`) VALUES
(3, 'Anuncio Navidad 1', 'Navidad Mágica', 'Regalos especiales', 'Los mejores regalos navideños', 1, 1, '2025-07-01', '2025-07-15', 1),
(3, 'Anuncio Navidad 2', 'Fin de Año', 'Celebra con nosotros', 'Ofertas de fin de año', 2, 2, '2025-07-16', '2025-07-31', 1),
(4, 'Anuncio San Valentín', 'Amor y Descuentos', 'Para tu pareja', 'Regalos perfectos para San Valentín', 3, 1, '2025-07-10', '2025-07-20', 1);

-- Resultados para los nuevos anuncios
INSERT INTO `rfwsmqex_kpi`.`campaign_ad_results` (`ad_id`, `total_spent`, `total_clicks`, `total_results`, `cost_per_result`, `date_recorded`) VALUES
(5, 2500.00, 1250, 100, 25.00, '2025-07-15'),
(6, 1900.00, 950, 80, 23.75, '2025-07-31'),
(7, 1200.00, 600, 40, 30.00, '2025-07-20');
