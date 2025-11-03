# Módulo de Archivos - Sistema de Gestión Documental

## Descripción General

El módulo de Archivos es un sistema de gestión documental integrado al ERP CoffeeSoft que permite consultar, descargar y eliminar archivos organizados por módulos (Ventas, Compras, Almacén, Tesorería). Implementa control de acceso basado en roles con tres niveles de permisos.

## Estructura de Archivos

```
contabilidad/captura/
├── index.php                      # Punto de entrada principal
├── ctrl/
│   └── ctrl-archivos.php         # Controlador PHP
├── mdl/
│   └── mdl-archivos.php          # Modelo PHP
├── js/
│   └── archivos.js               # Frontend JavaScript
└── sql/
    └── archivos-schema.sql       # Script de base de datos
```

## Instalación

### 1. Base de Datos

Ejecutar el script SQL para crear las tablas necesarias:

```bash
mysql -u usuario -p rfwsmqex_contabilidad < sql/archivos-schema.sql
```

O ejecutar manualmente desde phpMyAdmin/MySQL Workbench el contenido de `sql/archivos-schema.sql`.

### 2. Verificar Permisos

Asegurar que el servidor web tenga permisos de escritura en las carpetas de uploads:

```bash
chmod 755 uploads/
chmod 755 uploads/ventas/
chmod 755 uploads/compras/
chmod 755 uploads/almacen/
chmod 755 uploads/tesoreria/
```

### 3. Configuración

El módulo usa la configuración de base de datos definida en `conf/_Conect.php`.

## Niveles de Acceso

### Nivel 1: Captura
- **Permisos:** Consultar, descargar y eliminar archivos
- **Restricciones:** Solo puede seleccionar una fecha específica (no rangos)
- **Filtros:** Fecha única, módulo

### Nivel 2: Gerencia
- **Permisos:** Consultar y descargar archivos
- **Restricciones:** No puede eliminar archivos
- **Filtros:** Rango de fechas, módulo

### Nivel 3: Contabilidad/Dirección
- **Permisos:** Acceso completo (consultar, descargar, eliminar)
- **Restricciones:** Ninguna
- **Filtros:** Rango de fechas, módulo, UDN

## Funcionalidades

### Consulta de Archivos
- Filtrado por rango de fechas
- Filtrado por módulo (Ventas, Compras, Almacén, Tesorería)
- Filtrado por UDN (solo nivel 3)
- Visualización de totales por módulo
- Tabla con información detallada:
  - Fecha de subida
  - Módulo de origen
  - Usuario que subió el archivo
  - Nombre del archivo
  - Tipo y tamaño

### Descarga de Archivos
- Generación de tokens temporales (válidos 5 minutos)
- Validación de sesión activa
- Registro de acción en logs de auditoría

### Eliminación de Archivos
- Modal de confirmación antes de eliminar
- Validación de permisos según nivel de acceso
- Eliminación del archivo físico del servidor
- Eliminación del registro en base de datos
- Registro de acción en logs de auditoría
- Actualización automática de contadores

### Visualización de Archivos
- Previsualización en nueva pestaña
- Soporte para PDF, imágenes y documentos

## Seguridad

### Autenticación
- Validación de sesión en cada petición
- Tokens temporales para descargas
- Registro de IP en logs de auditoría

### Autorización
- Control de acceso basado en roles
- Validación de permisos por nivel
- Restricciones dinámicas en interfaz

### Prevención de Ataques
- Prepared statements para prevenir SQL injection
- Sanitización de nombres de archivos
- Escapado de HTML en frontend
- Validación de extensiones permitidas

## Auditoría

Todas las acciones sobre archivos se registran en la tabla `file_logs`:
- Descarga de archivos
- Visualización de archivos
- Eliminación de archivos

Información registrada:
- ID del archivo
- ID del usuario
- Tipo de acción
- Fecha y hora
- Dirección IP

## Optimización

### Índices de Base de Datos
- `idx_module`: Índice en columna module
- `idx_operation_date`: Índice en columna operation_date
- `idx_udn_id`: Índice en columna udn_id
- `idx_composite`: Índice compuesto (operation_date, module, udn_id)

### Frontend
- Paginación con DataTables (25 registros por página)
- Carga asíncrona de datos
- Actualización selectiva de componentes

### Backend
- Cache de listas estáticas en sesión
- Consultas optimizadas con JOINs
- Uso de prepared statements

## API Endpoints

### init()
**Descripción:** Inicializa el módulo con datos necesarios  
**Parámetros:** Ninguno  
**Retorna:**
```json
{
  "modules": [...],
  "udn": [...],
  "counts": {...},
  "userLevel": 1
}
```

### ls()
**Descripción:** Lista archivos con filtros  
**Parámetros:**
- `fi`: Fecha inicial (YYYY-MM-DD)
- `ff`: Fecha final (YYYY-MM-DD)
- `module`: Módulo a filtrar (opcional)
- `udn`: ID de UDN (opcional)

**Retorna:**
```json
{
  "row": [...],
  "ls": [...]
}
```

### getFile()
**Descripción:** Obtiene datos de un archivo específico  
**Parámetros:**
- `id`: ID del archivo

**Retorna:**
```json
{
  "status": 200,
  "message": "Archivo encontrado",
  "data": {...}
}
```

### downloadFile()
**Descripción:** Genera token para descarga segura  
**Parámetros:**
- `id`: ID del archivo

**Retorna:**
```json
{
  "status": 200,
  "message": "Token generado correctamente",
  "url": "...",
  "token": "..."
}
```

### deleteFile()
**Descripción:** Elimina un archivo del sistema  
**Parámetros:**
- `id`: ID del archivo

**Retorna:**
```json
{
  "status": 200,
  "message": "Archivo eliminado correctamente"
}
```

### getFileCounts()
**Descripción:** Obtiene contadores de archivos por módulo  
**Parámetros:** Ninguno  
**Retorna:**
```json
{
  "status": 200,
  "data": {
    "total": 10,
    "ventas": 3,
    "compras": 2,
    "almacen": 3,
    "tesoreria": 2
  }
}
```

## Códigos de Estado HTTP

- **200**: Operación exitosa
- **401**: Sesión no válida
- **403**: Permisos insuficientes
- **404**: Archivo no encontrado
- **500**: Error interno del servidor

## Troubleshooting

### Error: "Archivo no encontrado"
- Verificar que el archivo existe en la ruta especificada
- Verificar permisos de lectura en el directorio

### Error: "No tiene permisos para eliminar archivos"
- Verificar nivel de acceso del usuario
- Solo usuarios nivel 1 y 3 pueden eliminar archivos

### Error: "Sesión no válida"
- Usuario no ha iniciado sesión
- Sesión expirada
- Reiniciar sesión

### Archivos no se muestran en la tabla
- Verificar filtros aplicados (fechas, módulo, UDN)
- Verificar que existan archivos en la base de datos
- Revisar logs de errores en `ctrl/error.log`

## Mantenimiento

### Limpieza de Logs
Se recomienda limpiar periódicamente la tabla `file_logs` para mantener el rendimiento:

```sql
DELETE FROM file_logs WHERE action_date < DATE_SUB(NOW(), INTERVAL 6 MONTH);
```

### Backup de Archivos
Realizar backups periódicos de:
- Base de datos (tablas `file` y `file_logs`)
- Directorio `uploads/` completo

### Monitoreo
- Revisar espacio en disco disponible
- Monitorear tamaño de la tabla `file_logs`
- Verificar integridad de archivos físicos vs registros en BD

## Soporte

Para reportar problemas o solicitar nuevas funcionalidades, contactar al equipo de desarrollo.

## Changelog

### Versión 1.0.0 (2025-01-12)
- Implementación inicial del módulo
- Control de acceso por roles (3 niveles)
- Funcionalidades de consulta, descarga y eliminación
- Sistema de auditoría completo
- Optimización con índices de base de datos
