# 📢 ETAPA 2 - Anuncios (COMPLETADA)

## Descripción
Módulo completo para la gestión de campañas y anuncios publicitarios con seguimiento de resultados y métricas.

## ✅ Funcionalidades Implementadas

### 1. FilterBar
- ✅ Select de Unidad de Negocio (UDN)
- ✅ Select de Red Social (Facebook, Instagram, TikTok, Twitter, LinkedIn, YouTube)
- ✅ Botón "Agregar Campaña"

### 2. Agregar Campaña (Modal)
- ✅ Formulario con campos:
  - Nombre de la campaña
  - Unidad de negocio
  - Red social
  - Estrategia (textarea)
  - Fecha de inicio
  - Fecha final
- ✅ Al guardar, pregunta si desea crear un anuncio inmediatamente
- ✅ Validaciones de campos requeridos

### 3. Crear Anuncio de Campaña (Modal)
- ✅ Formulario con dos secciones:

#### Sección 1: Datos del Anuncio
- Nombre del anuncio
- Campaña (select)
- Tipo de anuncio (select)
- Título
- Subtítulo
- Descripción
- Clasificación (select)
- URL de imagen
- Fecha de inicio
- Fecha final

### 4. Tabla de Anuncios Creados
- ✅ Columnas:
  - Título
  - Subtítulo
  - Imagen (preview visual)
  - Nombre de campaña
  - Nombre del anuncio
  - Clasificación
  - Tipo de anuncio
  - Fecha inicio
  - Fecha final
  - Acciones (Editar, Capturar resultados)

### 5. Editar Anuncio
- ✅ Modal con formulario precargado
- ✅ Actualización de datos
- ✅ Recarga automática de tabla

### 6. Capturar Resultados (Modal)
- ✅ Formulario con campos:
  - Total gastado ($)
  - Total de clics
  - Total de resultados
  - Costo por resultado (calculado automáticamente)
- ✅ Cálculo automático: `costo_por_resultado = total_gastado / total_resultados`
- ✅ Guardado y actualización de resultados

## 🗄️ Base de Datos

### Nuevas Tablas

#### campaigns
```sql
- id (INT, PK, AUTO_INCREMENT)
- name (VARCHAR 150)
- udn_id (INT)
- social_network (VARCHAR 50)
- strategy (TEXT)
- start_date (DATE)
- end_date (DATE)
- active (TINYINT 1)
- date_creation (DATETIME)
```

#### campaign_ads
```sql
- id (INT, PK, AUTO_INCREMENT)
- campaign_id (INT, FK)
- ad_name (VARCHAR 150)
- title (VARCHAR 200)
- subtitle (VARCHAR 200)
- description (TEXT)
- image (VARCHAR 255)
- type_id (INT, FK)
- classification_id (INT, FK)
- start_date (DATE)
- end_date (DATE)
- active (TINYINT 1)
- date_creation (DATETIME)
```

#### campaign_ad_results
```sql
- id (INT, PK, AUTO_INCREMENT)
- ad_id (INT, FK)
- total_spent (DECIMAL 10,2)
- total_clicks (INT)
- total_results (INT)
- cost_per_result (DECIMAL 10,2) - Calculado automáticamente
- date_recorded (DATE)
- date_creation (DATETIME)
```

### Relaciones
- `campaign_ads.campaign_id` → `campaigns.id` (CASCADE)
- `campaign_ads.type_id` → `campaign_types.id` (SET NULL)
- `campaign_ads.classification_id` → `campaign_classification.id` (SET NULL)
- `campaign_ad_results.ad_id` → `campaign_ads.id` (CASCADE)

## 📁 Archivos Modificados

### Backend
- ✅ `kpi/mdl/mdl-kpi-campaign.php` - Agregadas funciones:
  - `listCampaigns()`
  - `createCampaign()`
  - `listCampaignAds()`
  - `getCampaignAdById()`
  - `createCampaignAd()`
  - `updateCampaignAd()`
  - `getCampaignAdResults()`
  - `createCampaignAdResult()`
  - `updateCampaignAdResult()`

- ✅ `kpi/ctrl/ctrl-kpi-campaign.php` - Agregados métodos:
  - `init()` - Actualizado con nuevos datos
  - `lsCampaignAds()`
  - `getCampaignAd()`
  - `addCampaignAd()`
  - `editCampaignAd()`
  - `addCampaign()`
  - `getAdResults()`
  - `saveAdResults()`
  - `formatSpanishDate()` - Helper

### Frontend
- ✅ `kpi/src/js/kpi-campaign.js` - Agregada clase `Ads`:
  - `render()` - Layout principal
  - `filterBar()` - Filtros
  - `lsCampaignAds()` - Tabla de anuncios
  - `addCampaign()` - Modal crear campaña
  - `addCampaignAd()` - Modal crear anuncio
  - `editCampaignAd()` - Modal editar anuncio
  - `showResults()` - Modal capturar resultados
  - `jsonCampaign()` - Estructura formulario campaña
  - `jsonCampaignAd()` - Estructura formulario anuncio
  - `jsonAdResults()` - Estructura formulario resultados

### Base de Datos
- ✅ `kpi/database/kpi-campaign.sql` - Agregadas:
  - Tabla `campaigns`
  - Tabla `campaign_ads`
  - Tabla `campaign_ad_results`
  - Datos de ejemplo

## 🎯 Flujo de Trabajo

```
1. Usuario accede a pestaña "Anuncios"
   ↓
2. Selecciona UDN y Red Social (filtros)
   ↓
3. Click en "Agregar Campaña"
   ↓
4. Llena formulario de campaña
   ↓
5. Al guardar, pregunta: "¿Crear anuncio?"
   ↓
6. Si acepta → Modal de crear anuncio
   ↓
7. Llena formulario de anuncio
   ↓
8. Anuncio aparece en tabla
   ↓
9. Puede editar o capturar resultados
   ↓
10. Resultados se calculan automáticamente
```

## 🎨 Características Técnicas

### Validaciones
- ✅ Campos requeridos en formularios
- ✅ Cálculo automático de costo por resultado
- ✅ Validación de fechas
- ✅ Sanitización de datos en backend

### UI/UX
- ✅ Modales con tamaño grande para formularios extensos
- ✅ Preview de imágenes en tabla
- ✅ Iconos descriptivos
- ✅ Mensajes de confirmación
- ✅ Alertas informativas
- ✅ Tema corporativo en tablas

### Integraciones
- ✅ Relación con Tipos de Campaña (ETAPA 1)
- ✅ Relación con Clasificaciones (ETAPA 1)
- ✅ Relación con UDN (base de datos externa)
- ✅ Filtrado dinámico por UDN y Red Social

## 📊 Datos de Ejemplo

### Campañas
```sql
- Campaña Verano 2025 (Facebook)
- Black Friday 2025 (Instagram)
```

### Anuncios
```sql
- Anuncio Verano 1 → Campaña Verano 2025
- Anuncio Black Friday → Campaña Black Friday 2025
```

## 🚀 Uso del Módulo

### 1. Crear una Campaña
```
1. Click en "Agregar Campaña"
2. Llenar datos:
   - Nombre: "Campaña Navidad 2025"
   - UDN: Seleccionar
   - Red Social: "Facebook"
   - Estrategia: "Aumentar ventas navideñas"
   - Fechas: 01/12/2025 - 31/12/2025
3. Guardar
4. Opcionalmente crear anuncio inmediatamente
```

### 2. Crear un Anuncio
```
1. Desde modal de campaña o botón directo
2. Llenar datos:
   - Nombre: "Anuncio Navidad 1"
   - Campaña: Seleccionar
   - Tipo: "Promoción de Temporada"
   - Título: "Navidad 2025"
   - Subtítulo: "Ofertas especiales"
   - Descripción: "Las mejores ofertas navideñas"
   - Clasificación: "Digital"
   - Imagen: URL de la imagen
   - Fechas: 01/12/2025 - 31/12/2025
3. Guardar
```

### 3. Capturar Resultados
```
1. Click en botón de resultados (📊) en la tabla
2. Llenar datos:
   - Total gastado: $1000.00
   - Total clics: 500
   - Total resultados: 50
3. El sistema calcula automáticamente:
   - Costo por resultado: $20.00
4. Guardar
```

## 🔧 Mantenimiento

### Agregar Nueva Red Social
Editar en `ctrl-kpi-campaign.php`:
```php
'socialNetworks' => [
    // ... existentes
    ['id' => 'NuevaRed', 'valor' => 'Nueva Red']
]
```

### Modificar Cálculo de Resultados
Editar en `ctrl-kpi-campaign.php` método `saveAdResults()`:
```php
$_POST['cost_per_result'] = $totalResults > 0 
    ? round($totalSpent / $totalResults, 2) 
    : 0;
```

## 📈 Métricas Disponibles

- Total gastado por anuncio
- Total de clics generados
- Total de resultados obtenidos
- Costo por resultado (CPR)
- Fechas de inicio y fin de campaña
- Red social utilizada
- Tipo y clasificación de anuncio

## ✅ Checklist de Implementación

- [x] Base de datos creada
- [x] Modelo implementado
- [x] Controlador implementado
- [x] Frontend implementado
- [x] FilterBar con UDN y Red Social
- [x] Agregar campaña
- [x] Crear anuncio
- [x] Tabla de anuncios
- [x] Editar anuncio
- [x] Capturar resultados
- [x] Cálculo automático de CPR
- [x] Validaciones
- [x] Datos de ejemplo
- [x] Documentación

---

**Estado**: ✅ ETAPA 2 COMPLETADA  
**Fecha**: 2025  
**Desarrollado con**: CoffeeIA ☕
