-- =============================================
-- Script de Actualización: Claves Foráneas UDN
-- Base de datos: rfwsmqex_kpi
-- =============================================

-- IMPORTANTE: Ejecutar este script si las tablas ya existen sin claves foráneas

-- 1. Verificar que existan datos válidos en UDN
SELECT 'Verificando UDNs disponibles:' as mensaje;
SELECT idUDN, UDN, Abreviatura, Stado 
FROM rfwsmqex_gvsl_finanzas.udn 
WHERE Stado = 1;

-- 2. Actualizar datos de ejemplo para usar UDNs válidas
-- (Cambiar el 1 por un idUDN válido de la consulta anterior)
UPDATE rfwsmqex_kpi.campaign_types SET udn_id = 1 WHERE udn_id IS NULL OR udn_id = 0;
UPDATE rfwsmqex_kpi.campaign_classification SET udn_id = 1 WHERE udn_id IS NULL OR udn_id = 0;
UPDATE rfwsmqex_kpi.campaigns SET udn_id = 1 WHERE udn_id IS NULL OR udn_id = 0;

-- 3. Agregar claves foráneas (solo si no existen)

-- Para campaign_types
SET @constraint_exists = (
    SELECT COUNT(*) 
    FROM information_schema.TABLE_CONSTRAINTS 
    WHERE CONSTRAINT_SCHEMA = 'rfwsmqex_kpi' 
    AND TABLE_NAME = 'campaign_types' 
    AND CONSTRAINT_NAME = 'fk_campaign_types_udn'
);

SET @sql = IF(@constraint_exists = 0, 
    'ALTER TABLE rfwsmqex_kpi.campaign_types ADD CONSTRAINT fk_campaign_types_udn FOREIGN KEY (udn_id) REFERENCES rfwsmqex_gvsl_finanzas.udn(idUDN) ON DELETE RESTRICT ON UPDATE CASCADE',
    'SELECT "FK campaign_types ya existe" as mensaje'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Para campaign_classification
SET @constraint_exists = (
    SELECT COUNT(*) 
    FROM information_schema.TABLE_CONSTRAINTS 
    WHERE CONSTRAINT_SCHEMA = 'rfwsmqex_kpi' 
    AND TABLE_NAME = 'campaign_classification' 
    AND CONSTRAINT_NAME = 'fk_campaign_classification_udn'
);

SET @sql = IF(@constraint_exists = 0, 
    'ALTER TABLE rfwsmqex_kpi.campaign_classification ADD CONSTRAINT fk_campaign_classification_udn FOREIGN KEY (udn_id) REFERENCES rfwsmqex_gvsl_finanzas.udn(idUDN) ON DELETE RESTRICT ON UPDATE CASCADE',
    'SELECT "FK campaign_classification ya existe" as mensaje'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Para campaigns
SET @constraint_exists = (
    SELECT COUNT(*) 
    FROM information_schema.TABLE_CONSTRAINTS 
    WHERE CONSTRAINT_SCHEMA = 'rfwsmqex_kpi' 
    AND TABLE_NAME = 'campaigns' 
    AND CONSTRAINT_NAME = 'fk_campaigns_udn'
);

SET @sql = IF(@constraint_exists = 0, 
    'ALTER TABLE rfwsmqex_kpi.campaigns ADD CONSTRAINT fk_campaigns_udn FOREIGN KEY (udn_id) REFERENCES rfwsmqex_gvsl_finanzas.udn(idUDN) ON DELETE RESTRICT ON UPDATE CASCADE',
    'SELECT "FK campaigns ya existe" as mensaje'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 4. Verificar que las claves foráneas se crearon correctamente
SELECT 'Verificando claves foráneas creadas:' as mensaje;
SELECT 
    TABLE_NAME,
    CONSTRAINT_NAME,
    REFERENCED_TABLE_SCHEMA,
    REFERENCED_TABLE_NAME,
    REFERENCED_COLUMN_NAME
FROM information_schema.KEY_COLUMN_USAGE 
WHERE CONSTRAINT_SCHEMA = 'rfwsmqex_kpi' 
AND REFERENCED_TABLE_NAME IS NOT NULL;

SELECT 'Script completado exitosamente!' as mensaje;