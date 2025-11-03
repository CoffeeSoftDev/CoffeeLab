# Módulo de Almacén - CoffeeSoft

## Descripción
Sistema completo de gestión de salidas de almacén con control de inventarios, trazabilidad de movimientos y generación de reportes según niveles de acceso.

## Estructura del Proyecto

```
contabilidad/captura/almacen/
├── index.php                 # Punto de entrada principal
├── database.sql              # Schema de base de datos
├── ctrl/
│   └── ctrl-almacen.php     # Controlador principal
├── mdl/
│   └── mdl-almacen.php      # Modelo de datos
├── js/
│   └── almacen.js           # Frontend JavaScript
└── uploads/                  # Directorio para archivos subidos
```

## Instalación

### 1. Base de Datos
Ejecuta el archivo `database.sql` en tu base de datos MySQL:
```sql
mysql -u usuario -p nombre_bd < database.sql
```

### 2. Configuración
Asegúrate de que las rutas en los archivos PHP apunten correctamente a:
- `../../../conf/_CRUD.php`
- `../../../conf/_Utileria.php`
- `../../../src/js/coffeSoft.js`
- `../../../src/js/plugins.js`

### 3. Permisos
Crea el directorio `uploads/` y asigna permisos de escritura:
```bash
mkdir uploads
chmod 755 uploads
```

## Características Principales

### 📦 Gestión de Salidas
- Registro de salidas de almacén por fecha
- Edición y eliminación de registros
- Visualización de descripciones detalladas
- Total diario automático

### 📊 Reportes Consolidados
- Reporte por clasificación de productos
- Filtros por rango de fechas y UDN
- Totales por categoría
- Balance general

### 📁 Gestión de Archivos
- Carga de archivos de respaldo (máx. 20 MB)
- Listado de archivos por fecha
- Eliminación de archivos

### 🔐 Auditoría
- Registro automático de todas las operaciones
- Trazabilidad completa de cambios
- Log de eliminaciones con datos históricos

## Uso

### Acceso al Módulo
1. Abre `index.php` en tu navegador
2. Selecciona la fecha y unidad de negocio
3. Navega entre las pestañas disponibles

### Registrar Salida
1. Click en "Nueva Salida"
2. Selecciona el producto/almacén
3. Ingresa la cantidad
4. Agrega una descripción
5. Guarda el registro

### Ver Reportes
1. Ve a la pestaña "Concentrado de almacén"
2. Selecciona el rango de fechas
3. Elige la unidad de negocio
4. Click en "Buscar"

### Subir Archivos
1. Ve a la pestaña "Archivos"
2. Selecciona un archivo (máx. 20 MB)
3. Click en "Subir Archivo"

## Tablas de Base de Datos

### product_class
Clasificaciones de productos (Alimentos, Bebidas, Diversos)

### product
Productos individuales del almacén

### warehouse_output
Registros de salidas de almacén

### file
Archivos de respaldo subidos

### audit_log
Registro de auditoría de operaciones

## API Endpoints

### init
Inicializa filtros y datos del módulo
```javascript
{ opc: "init" }
```

### ls
Lista salidas de almacén por fecha
```javascript
{ opc: "ls", date: "2025-01-15", udn: 1 }
```

### addWarehouseOutput
Crea nueva salida de almacén
```javascript
{ 
  opc: "addWarehouseOutput",
  product_id: 1,
  amount: 100.50,
  description: "Salida para evento",
  date: "2025-01-15",
  udn: 1,
  user_id: 1
}
```

### editWarehouseOutput
Actualiza salida existente
```javascript
{ 
  opc: "editWarehouseOutput",
  id: 5,
  product_id: 1,
  amount: 150.00,
  description: "Actualización",
  udn: 1,
  user_id: 1
}
```

### deleteWarehouseOutput
Elimina salida de almacén (soft delete)
```javascript
{ 
  opc: "deleteWarehouseOutput",
  id: 5,
  udn: 1,
  user_id: 1
}
```

### lsReport
Genera reporte consolidado
```javascript
{ 
  opc: "lsReport",
  fi: "2025-01-01",
  ff: "2025-01-31",
  udn: 1
}
```

### uploadFile
Sube archivo de respaldo
```javascript
FormData con:
- file: archivo
- opc: "uploadFile"
- udn: 1
- user_id: 1
- date: "2025-01-15"
```

## Tecnologías Utilizadas

- **Frontend**: jQuery, CoffeeSoft Framework, TailwindCSS
- **Backend**: PHP 7.4+
- **Database**: MySQL
- **Librerías**: 
  - DataTables
  - SweetAlert2
  - Bootbox
  - Moment.js
  - DateRangePicker

## Notas de Desarrollo

### Convenciones de Código
- Nombres de funciones en camelCase
- Nombres de tablas en snake_case
- Clases en PascalCase
- Variables en camelCase

### Seguridad
- Validación de entrada en frontend y backend
- Prepared statements para prevenir SQL injection
- Validación de tamaño de archivos
- Soft delete para mantener historial

### Performance
- Índices en campos de búsqueda frecuente
- Paginación en tablas grandes
- Carga lazy de datos

## Soporte

Para reportar problemas o solicitar nuevas características, contacta al equipo de desarrollo.

## Versión
1.0.0 - Enero 2025
