-- =============================================
-- Datos de Prueba para Resumen de Campaña
-- Base de datos: rfwsmqex_kpi
-- =============================================

-- IMPORTANTE: Ejecutar después de crear las tablas principales

-- Limpiar datos existentes (opcional)
-- DELETE FROM rfwsmqex_kpi.campaign_ad_results;
-- DELETE FROM rfwsmqex_kpi.campaign_ads;
-- DELETE FROM rfwsmqex_kpi.campaigns;

-- Más tipos de campaña para variedad
INSERT INTO `rfwsmqex_kpi`.`campaign_types` (`name`, `udn_id`, `description`, `active`) VALUES
('Descuentos Especiales', 1, 'Campañas con descuentos atractivos', 1),
('Productos Nuevos', 1, 'Lanzamiento de productos nuevos', 1),
('Temporada Alta', 1, 'Campañas para temporadas específicas', 1);

-- Más clasificaciones
INSERT INTO `rfwsmqex_kpi`.`campaign_classification` (`name`, `udn_id`, `description`, `active`) VALUES
('Redes Sociales', 1, 'Campañas enfocadas en redes sociales', 1),
('Email Marketing', 1, 'Campañas por correo electrónico', 1),
('Publicidad Pagada', 1, 'Campañas con inversión publicitaria', 1);

-- Campañas adicionales para julio 2025 (mes actual de prueba)
INSERT INTO `rfwsmqex_kpi`.`campaigns` (`name`, `udn_id`, `social_network`, `strategy`, `start_date`, `end_date`, `active`) VALUES
('Campaña Julio Especial', 1, 'Facebook', 'Promociones de medio año', '2025-07-01', '2025-07-31', 1),
('Campaña Regreso a Clases', 1, 'Instagram', 'Productos para estudiantes', '2025-07-15', '2025-07-30', 1),
('Campaña Flash Weekend', 1, 'TikTok', 'Ofertas de fin de semana', '2025-07-05', '2025-07-07', 1),
('Campaña Mitad de Año', 1, 'YouTube', 'Balance de medio año', '2025-07-10', '2025-07-25', 1);

-- Anuncios para las nuevas campañas (IDs 5, 6, 7, 8)
INSERT INTO `rfwsmqex_kpi`.`campaign_ads` (`campaign_id`, `ad_name`, `title`, `subtitle`, `description`, `type_id`, `classification_id`, `start_date`, `end_date`, `active`) VALUES
-- Campaña Julio Especial (ID 5)
(5, 'Anuncio Julio 1', 'Julio Increíble', 'Ofertas de medio año', 'Las mejores promociones de julio', 4, 4, '2025-07-01', '2025-07-15', 1),
(5, 'Anuncio Julio 2', 'Julio Total', 'No te lo pierdas', 'Segunda quincena de ofertas', 1, 1, '2025-07-16', '2025-07-31', 1),

-- Campaña Regreso a Clases (ID 6)
(6, 'Anuncio Estudiantes 1', 'Back to School', 'Todo para estudiar', 'Productos escolares con descuento', 5, 4, '2025-07-15', '2025-07-25', 1),
(6, 'Anuncio Estudiantes 2', 'Útiles Escolares', 'Prepárate para clases', 'Los mejores precios en útiles', 2, 5, '2025-07-20', '2025-07-30', 1),

-- Campaña Flash Weekend (ID 7)
(7, 'Anuncio Flash 1', 'Weekend Flash', 'Solo 3 días', 'Ofertas relámpago de fin de semana', 6, 6, '2025-07-05', '2025-07-07', 1),

-- Campaña Mitad de Año (ID 8)
(8, 'Anuncio Mitad Año', 'Mid Year Sale', 'Balance perfecto', 'Ofertas de mitad de año', 4, 4, '2025-07-10', '2025-07-25', 1);

-- Resultados para todos los anuncios nuevos (IDs 8-13)
INSERT INTO `rfwsmqex_kpi`.`campaign_ad_results` (`ad_id`, `total_spent`, `total_clicks`, `total_results`, `cost_per_result`, `date_recorded`) VALUES
-- Resultados para Campaña Julio Especial
(8, 3500.00, 1750, 140, 25.00, '2025-07-15'),
(9, 2800.00, 1400, 100, 28.00, '2025-07-31'),

-- Resultados para Campaña Regreso a Clases
(10, 2200.00, 1100, 88, 25.00, '2025-07-25'),
(11, 1800.00, 900, 60, 30.00, '2025-07-30'),

-- Resultados para Campaña Flash Weekend
(12, 5000.00, 2500, 200, 25.00, '2025-07-07'),

-- Resultados para Campaña Mitad de Año
(13, 3200.00, 1600, 128, 25.00, '2025-07-25');

-- Datos adicionales para diferentes meses (para probar filtros)
INSERT INTO `rfwsmqex_kpi`.`campaigns` (`name`, `udn_id`, `social_network`, `strategy`, `start_date`, `end_date`, `active`) VALUES
('Campaña Junio', 1, 'Facebook', 'Promociones de junio', '2025-06-01', '2025-06-30', 1),
('Campaña Agosto', 1, 'Instagram', 'Promociones de agosto', '2025-08-01', '2025-08-31', 1);

INSERT INTO `rfwsmqex_kpi`.`campaign_ads` (`campaign_id`, `ad_name`, `title`, `subtitle`, `description`, `type_id`, `classification_id`, `start_date`, `end_date`, `active`) VALUES
(9, 'Anuncio Junio', 'Junio Especial', 'Mes de ofertas', 'Promociones especiales de junio', 1, 1, '2025-06-01', '2025-06-30', 1),
(10, 'Anuncio Agosto', 'Agosto Total', 'Vacaciones', 'Ofertas de vacaciones', 2, 2, '2025-08-01', '2025-08-31', 1);

INSERT INTO `rfwsmqex_kpi`.`campaign_ad_results` (`ad_id`, `total_spent`, `total_clicks`, `total_results`, `cost_per_result`, `date_recorded`) VALUES
(14, 2000.00, 1000, 80, 25.00, '2025-06-30'),
(15, 2500.00, 1250, 100, 25.00, '2025-08-31');

-- Verificar datos insertados
SELECT 'RESUMEN DE DATOS INSERTADOS:' as mensaje;

SELECT 'Campañas por mes:' as info;
SELECT 
    MONTH(start_date) as mes,
    MONTHNAME(start_date) as nombre_mes,
    COUNT(*) as total_campanas
FROM rfwsmqex_kpi.campaigns 
GROUP BY MONTH(start_date), MONTHNAME(start_date)
ORDER BY mes;

SELECT 'Anuncios por campaña:' as info;
SELECT 
    c.name as campana,
    COUNT(ca.id) as total_anuncios
FROM rfwsmqex_kpi.campaigns c
LEFT JOIN rfwsmqex_kpi.campaign_ads ca ON c.id = ca.campaign_id
GROUP BY c.id, c.name
ORDER BY c.name;

SELECT 'Anuncios con resultados:' as info;
SELECT 
    ca.ad_name,
    car.total_spent,
    car.total_clicks,
    car.total_results,
    car.cost_per_result
FROM rfwsmqex_kpi.campaign_ads ca
JOIN rfwsmqex_kpi.campaign_ad_results car ON ca.id = car.ad_id
ORDER BY ca.ad_name;

SELECT 'Datos listos para probar Resumen de Campaña!' as mensaje;