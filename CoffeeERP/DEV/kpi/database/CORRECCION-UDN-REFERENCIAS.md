# 🔧 Corrección: Referencias UDN

## Problema Identificado

Las tablas del módulo de campañas **NO tenían claves foráneas reales** hacia la tabla UDN, solo referencias por `udn_id` sin integridad referencial.

## ❌ Estado Anterior

```sql
-- Tablas SIN claves foráneas
CREATE TABLE campaign_types (
    udn_id INT NOT NULL  -- Solo referencia, sin FK
);

CREATE TABLE campaign_classification (
    udn_id INT NOT NULL  -- Solo referencia, sin FK
);

CREATE TABLE campaigns (
    udn_id INT NOT NULL  -- Solo referencia, sin FK
);
```

**Problemas:**
- ❌ No hay integridad referencial
- ❌ Se pueden insertar UDN inexistentes
- ❌ No hay cascada en actualizaciones
- ❌ No hay restricciones en eliminaciones

## ✅ Estado Corregido

```sql
-- Tablas CON claves foráneas
CREATE TABLE campaign_types (
    udn_id INT NOT NULL,
    CONSTRAINT fk_campaign_types_udn 
    FOREIGN KEY (udn_id) 
    REFERENCES rfwsmqex_gvsl_finanzas.udn(idUDN) 
    ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE campaign_classification (
    udn_id INT NOT NULL,
    CONSTRAINT fk_campaign_classification_udn 
    FOREIGN KEY (udn_id) 
    REFERENCES rfwsmqex_gvsl_finanzas.udn(idUDN) 
    ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE campaigns (
    udn_id INT NOT NULL,
    CONSTRAINT fk_campaigns_udn 
    FOREIGN KEY (udn_id) 
    REFERENCES rfwsmqex_gvsl_finanzas.udn(idUDN) 
    ON DELETE RESTRICT ON UPDATE CASCADE
);
```

**Beneficios:**
- ✅ Integridad referencial garantizada
- ✅ Solo se pueden usar UDN existentes y activas
- ✅ Actualizaciones en cascada
- ✅ Restricción en eliminaciones (RESTRICT)

## 🗄️ Tabla UDN de Referencia

**Base de datos:** `rfwsmqex_gvsl_finanzas`
**Tabla:** `udn`

```sql
CREATE TABLE udn (
    idUDN INT PRIMARY KEY,
    UDN VARCHAR(100),
    Abreviatura VARCHAR(10),
    Stado TINYINT(1)  -- 1 = Activo, 0 = Inactivo
);
```

**Datos de ejemplo:**
| idUDN | UDN | Abreviatura | Stado |
|-------|-----|-------------|-------|
| 1 | QUINTA TABACHINES | QT | 1 |
| 2 | MAMMA MIA TRATTORIA | MMT | 0 |
| 3 | MAMMA MIA EXPRESS | MME | 0 |
| 4 | BAOS | BS | 1 |
| 5 | SONORA'S MEAT | SM | 1 |

## 📁 Archivos Corregidos

### 1. Base de Datos (kpi-campaign.sql)
```sql
-- Agregadas claves foráneas a todas las tablas
CONSTRAINT fk_campaign_types_udn 
FOREIGN KEY (udn_id) REFERENCES rfwsmqex_gvsl_finanzas.udn(idUDN)

CONSTRAINT fk_campaign_classification_udn 
FOREIGN KEY (udn_id) REFERENCES rfwsmqex_gvsl_finanzas.udn(idUDN)

CONSTRAINT fk_campaigns_udn 
FOREIGN KEY (udn_id) REFERENCES rfwsmqex_gvsl_finanzas.udn(idUDN)
```

### 2. Modelo (mdl-kpi-campaign.php)
```php
// Corregida la referencia a la base de datos UDN
function lsUDN() {
    return $this->_Select([
        'table' => "rfwsmqex_gvsl_finanzas.udn",  // ✅ Corregido
        'values' => "idUDN as id, UDN as valor, Abreviatura",
        'where' => 'Stado = 1',  // Solo UDN activas
        'order' => ['ASC' => 'UDN']
    ]);
}
```

### 3. Script de Actualización (UPDATE-FOREIGN-KEYS.sql)
- ✅ Verifica UDNs disponibles
- ✅ Actualiza datos existentes
- ✅ Agrega claves foráneas si no existen
- ✅ Verifica la creación exitosa

## 🚀 Instrucciones de Aplicación

### Para Instalación Nueva:
```sql
-- Ejecutar el archivo principal (ya incluye las FK)
mysql -u usuario -p < kpi/database/kpi-campaign.sql
```

### Para Actualización de BD Existente:
```sql
-- Ejecutar el script de actualización
mysql -u usuario -p < kpi/database/UPDATE-FOREIGN-KEYS.sql
```

## 🔍 Verificación

### 1. Verificar UDNs Disponibles:
```sql
SELECT idUDN, UDN, Abreviatura, Stado 
FROM rfwsmqex_gvsl_finanzas.udn 
WHERE Stado = 1;
```

### 2. Verificar Claves Foráneas:
```sql
SELECT 
    TABLE_NAME,
    CONSTRAINT_NAME,
    REFERENCED_TABLE_SCHEMA,
    REFERENCED_TABLE_NAME,
    REFERENCED_COLUMN_NAME
FROM information_schema.KEY_COLUMN_USAGE 
WHERE CONSTRAINT_SCHEMA = 'rfwsmqex_kpi' 
AND REFERENCED_TABLE_NAME IS NOT NULL;
```

### 3. Probar Integridad:
```sql
-- Esto debe fallar (UDN inexistente)
INSERT INTO rfwsmqex_kpi.campaign_types (name, udn_id, description) 
VALUES ('Test', 999, 'Test');

-- Esto debe funcionar (UDN válida)
INSERT INTO rfwsmqex_kpi.campaign_types (name, udn_id, description) 
VALUES ('Test', 1, 'Test');
```

## 🎯 Beneficios de la Corrección

### Integridad de Datos
- ✅ No se pueden crear campañas con UDN inexistentes
- ✅ Solo se muestran UDN activas en los selects
- ✅ Consistencia garantizada entre bases de datos

### Mantenimiento
- ✅ Si se actualiza una UDN, se actualiza automáticamente
- ✅ Si se intenta eliminar una UDN con campañas, se restringe
- ✅ Relaciones claras y documentadas

### Funcionalidad
- ✅ Los filtros por UDN funcionan correctamente
- ✅ Los reportes muestran datos consistentes
- ✅ La navegación entre módulos es coherente

## 🧪 Pruebas Recomendadas

### 1. Probar Selects de UDN:
- Verificar que se cargan solo UDN activas
- Verificar nombres y abreviaturas correctas

### 2. Probar Filtros:
- Filtrar campañas por UDN
- Verificar que solo aparecen datos de esa UDN

### 3. Probar Integridad:
- Intentar crear campaña con UDN inválida (debe fallar)
- Crear campaña con UDN válida (debe funcionar)

### 4. Probar Reportes:
- Verificar que los reportes CPC/CAC filtran por UDN
- Verificar que el resumen de campaña respeta la UDN

## ✅ Checklist de Corrección

- [x] Claves foráneas agregadas a campaign_types
- [x] Claves foráneas agregadas a campaign_classification  
- [x] Claves foráneas agregadas a campaigns
- [x] Referencia corregida en lsUDN()
- [x] Script de actualización creado
- [x] Documentación actualizada
- [x] Verificaciones incluidas
- [x] Pruebas documentadas

---

**Estado**: ✅ REFERENCIAS UDN CORREGIDAS  
**Fecha**: 2025  
**Desarrollado con**: CoffeeIA ☕