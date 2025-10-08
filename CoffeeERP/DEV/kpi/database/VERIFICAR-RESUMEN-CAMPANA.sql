-- =============================================
-- Verificación: Datos para Resumen de Campaña
-- Base de datos: rfwsmqex_kpi
-- =============================================

-- 1. Verificar UDNs disponibles
SELECT 'UDNs DISPONIBLES:' as seccion;
SELECT idUDN, UDN, Abreviatura, Stado 
FROM rfwsmqex_gvsl_finanzas.udn 
WHERE Stado = 1
ORDER BY UDN;

-- 2. Verificar campañas por mes
SELECT 'CAMPAÑAS POR MES:' as seccion;
SELECT 
    YEAR(start_date) as año,
    MONTH(start_date) as mes,
    MONTHNAME(start_date) as nombre_mes,
    COUNT(*) as total_campañas,
    GROUP_CONCAT(name SEPARATOR ', ') as campañas
FROM rfwsmqex_kpi.campaigns 
WHERE active = 1
GROUP BY YEAR(start_date), MONTH(start_date), MONTHNAME(start_date)
ORDER BY año, mes;

-- 3. Verificar datos completos para Resumen de Campaña (Julio 2025)
SELECT 'DATOS PARA RESUMEN DE CAMPAÑA - JULIO 2025:' as seccion;
SELECT 
    c.name as campaign_name,
    ca.ad_name,
    ca.start_date,
    ca.end_date,
    DATEDIFF(ca.end_date, ca.start_date) + 1 as duracion_dias,
    ct.name as type_name,
    cc.name as classification_name,
    car.total_spent as inversion,
    car.total_clicks as clic,
    car.cost_per_result as cpc,
    c.social_network
FROM rfwsmqex_kpi.campaign_ads ca
LEFT JOIN rfwsmqex_kpi.campaigns c ON ca.campaign_id = c.id
LEFT JOIN rfwsmqex_kpi.campaign_ad_results car ON ca.id = car.ad_id
LEFT JOIN rfwsmqex_kpi.campaign_types ct ON ca.type_id = ct.id
LEFT JOIN rfwsmqex_kpi.campaign_classification cc ON ca.classification_id = cc.id
WHERE ca.active = 1
  AND c.udn_id = 1
  AND MONTH(ca.start_date) = 7
  AND YEAR(ca.start_date) = 2025
ORDER BY c.name, ca.ad_name;

-- 4. Verificar totales y promedios
SELECT 'TOTALES Y PROMEDIOS - JULIO 2025:' as seccion;
SELECT 
    COUNT(*) as total_anuncios,
    SUM(car.total_spent) as total_inversion,
    SUM(car.total_clicks) as total_clics,
    AVG(car.cost_per_result) as promedio_cpc,
    MIN(car.cost_per_result) as cpc_minimo,
    MAX(car.cost_per_result) as cpc_maximo
FROM rfwsmqex_kpi.campaign_ads ca
LEFT JOIN rfwsmqex_kpi.campaigns c ON ca.campaign_id = c.id
LEFT JOIN rfwsmqex_kpi.campaign_ad_results car ON ca.id = car.ad_id
WHERE ca.active = 1
  AND c.udn_id = 1
  AND MONTH(ca.start_date) = 7
  AND YEAR(ca.start_date) = 2025;

-- 5. Verificar datos por red social
SELECT 'DATOS POR RED SOCIAL - JULIO 2025:' as seccion;
SELECT 
    c.social_network,
    COUNT(ca.id) as total_anuncios,
    SUM(car.total_spent) as total_inversion,
    SUM(car.total_clicks) as total_clics,
    AVG(car.cost_per_result) as promedio_cpc
FROM rfwsmqex_kpi.campaign_ads ca
LEFT JOIN rfwsmqex_kpi.campaigns c ON ca.campaign_id = c.id
LEFT JOIN rfwsmqex_kpi.campaign_ad_results car ON ca.id = car.ad_id
WHERE ca.active = 1
  AND c.udn_id = 1
  AND MONTH(ca.start_date) = 7
  AND YEAR(ca.start_date) = 2025
GROUP BY c.social_network
ORDER BY total_inversion DESC;

-- 6. Verificar formato de duración (como aparecerá en el reporte)
SELECT 'FORMATO DE DURACIÓN:' as seccion;
SELECT 
    ca.ad_name,
    ca.start_date,
    ca.end_date,
    CONCAT(
        DATE_FORMAT(ca.start_date, '%d/%m/%Y'), 
        ' - ', 
        DATE_FORMAT(ca.end_date, '%d/%m/%Y'), 
        ' DÍAS: ', 
        DATEDIFF(ca.end_date, ca.start_date) + 1
    ) as duracion_formateada
FROM rfwsmqex_kpi.campaign_ads ca
LEFT JOIN rfwsmqex_kpi.campaigns c ON ca.campaign_id = c.id
WHERE ca.active = 1
  AND c.udn_id = 1
  AND MONTH(ca.start_date) = 7
  AND YEAR(ca.start_date) = 2025
ORDER BY ca.start_date;

-- 7. Verificar que no hay datos nulos importantes
SELECT 'VERIFICACIÓN DE DATOS NULOS:' as seccion;
SELECT 
    'campaign_ads sin campaign_id' as problema,
    COUNT(*) as cantidad
FROM rfwsmqex_kpi.campaign_ads 
WHERE campaign_id IS NULL
UNION ALL
SELECT 
    'campaign_ads sin resultados' as problema,
    COUNT(*) as cantidad
FROM rfwsmqex_kpi.campaign_ads ca
LEFT JOIN rfwsmqex_kpi.campaign_ad_results car ON ca.id = car.ad_id
WHERE car.ad_id IS NULL
UNION ALL
SELECT 
    'campaigns sin udn_id' as problema,
    COUNT(*) as cantidad
FROM rfwsmqex_kpi.campaigns 
WHERE udn_id IS NULL;

SELECT 'VERIFICACIÓN COMPLETADA!' as mensaje;
SELECT 'Ahora puedes probar el Resumen de Campaña con:' as instruccion;
SELECT '- UDN: 1' as parametro1;
SELECT '- Mes: 7 (Julio)' as parametro2;
SELECT '- Año: 2025' as parametro3;
SELECT '- Red Social: Todas o específica' as parametro4;