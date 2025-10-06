# 📊 Módulo de Campañas - KPI

## Descripción
Sistema completo para la gestión de campañas de marketing con análisis de rendimiento, administración de anuncios y reportes históricos.

## 🎯 Funcionalidades Implementadas

### Interfaz Principal
- **Dashboard**: Visualización de métricas y KPIs de campañas activas
- **Anuncios**: Gestión de anuncios publicitarios
- **Resumen de campaña**: Análisis detallado de rendimiento
- **Historial Anual**: Consulta histórica de campañas
- **Administrador**: Gestión de tipos y clasificaciones

### ETAPA 1 - Administrador ✅

#### Tipos de Campaña
- ✅ Listado con filtros (UDN + Estado)
- ✅ Agregar nuevo tipo
- ✅ Editar tipo existente
- ✅ Activar/Desactivar tipo
- ✅ Validación de nombres únicos por UDN

#### Clasificación de Campaña
- ✅ Listado con filtros (UDN + Estado)
- ✅ Agregar nueva clasificación
- ✅ Editar clasificación existente
- ✅ Activar/Desactivar clasificación
- ✅ Validación de nombres únicos por UDN

## 📁 Estructura de Archivos

```
kpi/
├── campaign.php                          # Vista principal
├── database/
│   └── kpi-campaign.sql                  # Script de base de datos
├── ctrl/
│   └── ctrl-kpi-campaign.php             # Controlador
├── mdl/
│   └── mdl-kpi-campaign.php              # Modelo
└── src/
    └── js/
        └── kpi-campaign.js               # Frontend JavaScript
```

## 🗄️ Base de Datos

### Prefijo
`rfwsmqex_kpi`

### Tablas

#### campaign_types
```sql
- id (INT, PK, AUTO_INCREMENT)
- name (VARCHAR 100)
- udn_id (INT)
- description (TEXT)
- active (TINYINT 1)
- date_creation (DATETIME)
```

#### campaign_classification
```sql
- id (INT, PK, AUTO_INCREMENT)
- name (VARCHAR 100)
- udn_id (INT)
- description (TEXT)
- active (TINYINT 1)
- date_creation (DATETIME)
```

### Relaciones
- Ambas tablas se relacionan con `rfwsmqex_gvsl_finanzas.udn` mediante `udn_id`

## 🚀 Instalación

1. **Ejecutar script SQL**
   ```bash
   mysql -u usuario -p < kpi/database/kpi-campaign.sql
   ```

2. **Verificar permisos**
   - Asegurar que el usuario tenga acceso a:
     - `rfwsmqex_kpi`
     - `rfwsmqex_gvsl_finanzas` (solo lectura para tabla `udn`)

3. **Acceder al módulo**
   ```
   http://tu-dominio/kpi/campaign.php
   ```

## 🎨 Tecnologías

- **Backend**: PHP 7.4+
- **Frontend**: JavaScript (jQuery)
- **Framework**: CoffeeSoft
- **Estilos**: TailwindCSS
- **Base de datos**: MySQL 5.7+

## 📋 Próximas Etapas

### ETAPA 2 - Dashboard (Pendiente)
- Tarjetas de KPIs principales
- Gráficas de rendimiento
- Métricas en tiempo real

### ETAPA 3 - Anuncios (Pendiente)
- Gestión de anuncios
- Vinculación con campañas
- Seguimiento de conversiones

### ETAPA 4 - Resumen de Campaña (Pendiente)
- Análisis detallado por campaña
- Comparativas de rendimiento
- Exportación de reportes

### ETAPA 5 - Historial Anual (Pendiente)
- Vista histórica por año
- Tendencias y patrones
- Análisis comparativo anual

## 🔧 Mantenimiento

### Agregar nueva UDN
Las UDN se gestionan desde la tabla `rfwsmqex_gvsl_finanzas.udn`. El módulo las carga automáticamente.

### Modificar estados
Los estados se manejan mediante el campo `active`:
- `1` = Activo
- `0` = Inactivo

## 📞 Soporte

Para dudas o problemas, contactar al equipo de desarrollo de CoffeeSoft.

---

**Versión**: 1.0.0  
**Fecha**: 2025  
**Desarrollado con**: CoffeeIA ☕
