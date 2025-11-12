# Design Document

## Overview

El módulo **Ventas2** implementa un sistema de gestión de ventas diarias con arquitectura MVC siguiendo los estándares de CoffeeSoft. El sistema permite consultar, filtrar, capturar y editar información de ventas por unidad de negocio con desglose por categorías (Alimentos y Bebidas).

## Architecture

### Frontend Architecture
- **Framework Base**: CoffeeSoft (jQuery + TailwindCSS)
- **Patrón**: Herencia de clase Templates
- **Estructura**: Clase principal `Sales` con métodos especializados
- **Comunicación**: AJAX mediante `useFetch()` con respuestas JSON

### Backend Architecture
- **Patrón**: MVC (Model-View-Controller)
- **Controlador**: `ctrl-ventas2.php` extiende clase del modelo
- **Modelo**: `mdl-ventas2.php` extiende clase CRUD
- **Base de Datos**: MySQL con tablas relacionadas

### Database Schema

```
ventas (tabla principal de tipos de venta)
├── idVenta (PK)
├── Name_Venta
└── creacion

venta_bitacora (registros de ventas diarias)
├── idBV (PK)
├── Cantidad
├── Fecha_Venta
└── id_Folio (FK)

ventas_udn (relación ventas-unidades de negocio)
├── idUV (PK)
├── id_UDN (FK → udn.idUDN)
├── id_Venta (FK → ventas.idVenta)
├── Stado
└── creacion

udn (unidades de negocio)
├── idUDN (PK)
├── UDN
├── Abreviatura
├── colorUDN
├── Stado
└── Antiguedad
```

## Components and Interfaces

### Frontend Components

#### 1. Sales Class (Principal)
```javascript
class Sales extends Templates {
    constructor(link, div_modulo)
    render()
    layout()
    filterBar()
    listSales()
    addSale()
    editSale(id)
    statusSale(id, active)
}
```

**Métodos principales:**
- `render()`: Inicializa el módulo completo
- `layout()`: Crea estructura con primaryLayout
- `filterBar()`: Barra de filtros (UDN, Año, Mes)
- `listSales()`: Tabla dinámica con createTable
- `addSale()`: Modal para captura de ventas
- `editSale(id)`: Modal para edición
- `statusSale(id, active)`: Cambio de estado

### Backend Components

#### 2. Controller (ctrl-ventas2.php)
```php
class ctrl extends mdl {
    function init()
    function lsSales()
    function getSale()
    function addSale()
    function editSale()
    function statusSale()
}
```

#### 3. Model (mdl-ventas2.php)
```php
class mdl extends CRUD {
    function listSales($array)
    function getSaleById($id)
    function createSale($array)
    function updateSale($array)
    function existsSaleByDate($array)
    function lsUDN()
    function lsVentas()
}
```

## Data Models

### Sale Record Structure
```javascript
{
    id: number,
    Fecha: string,        // Formato: "2025-09-01"
    Dia: string,          // "Monday", "Tuesday", etc.
    Estado: string,       // Badge HTML con estado
    Clientes: number,
    Alimentos: string,    // Formato moneda "$1,234.56"
    Bebidas: string,      // Formato moneda "$1,234.56"
    Total: string,        // Formato moneda "$1,234.56"
    dropdown: array       // Acciones disponibles
}
```

### Filter Parameters
```javascript
{
    udn: number,          // ID de unidad de negocio
    anio: number,         // Año (2023, 2024, 2025)
    mes: number,          // Mes (1-12)
    type: number          // Tipo de consulta (1, 2, 3)
}
```

### Form Data Structure
```javascript
{
    opc: string,          // "addSale" | "editSale"
    id: number,           // Solo para edición
    udn: number,
    fecha: string,        // "YYYY-MM-DD"
    clientes: number,
    alimentos: number,
    bebidas: number
}
```

## Error Handling

### Frontend Validation
- Validación automática de campos requeridos mediante `createForm()`
- Validación de formato de números con `validationInputForNumber()`
- Mensajes de error con `alert({ icon: "error", text: message })`

### Backend Validation
```php
// Validación de existencia
if ($exists > 0) {
    return [
        'status' => 409,
        'message' => 'Ya existe un registro para esta fecha y UDN'
    ];
}

// Validación de inserción
if (!$create) {
    return [
        'status' => 500,
        'message' => 'Error al guardar el registro'
    ];
}
```

### Error Response Format
```javascript
{
    status: number,       // 200, 400, 404, 409, 500
    message: string,      // Mensaje descriptivo
    data: object | null   // Datos adicionales si aplica
}
```

## Testing Strategy

### Unit Tests
- Validación de métodos del modelo (listSales, createSale, updateSale)
- Validación de respuestas del controlador
- Validación de formato de datos

### Integration Tests
- Flujo completo: filtrar → consultar → mostrar tabla
- Flujo completo: abrir modal → llenar formulario → guardar
- Flujo completo: editar registro → actualizar → refrescar tabla
- Flujo completo: cambiar estado → confirmar → actualizar

### UI Tests
- Renderizado correcto de componentes
- Funcionamiento de filtros
- Apertura y cierre de modales
- Actualización de tabla después de operaciones

## Design Decisions

### 1. Uso de CoffeeSoft Framework
**Decisión**: Usar componentes nativos de CoffeeSoft
**Razón**: Mantener consistencia con el resto del sistema y aprovechar componentes probados

### 2. Estructura de Tabs
**Decisión**: Integrar como pestaña dentro del módulo existente
**Razón**: El módulo ya tiene pestañas (Dashboard, Calendario, etc.) y se debe mantener la navegación coherente

### 3. Desglose por Categorías
**Decisión**: Mostrar Alimentos y Bebidas como columnas separadas
**Razón**: Facilita el análisis visual y permite comparación rápida entre categorías

### 4. Validación de Duplicados
**Decisión**: Validar fecha + UDN antes de insertar
**Razón**: Evitar registros duplicados que afecten la integridad de los datos

### 5. Formato de Moneda
**Decisión**: Usar función `formatPrice()` en frontend
**Razón**: Consistencia visual y mejor experiencia de usuario

### 6. Estado de Ventas
**Decisión**: Campo `active` en venta_bitacora y `Stado` en ventas_udn
**Razón**: Permite desactivar registros sin eliminarlos físicamente

## Technical Considerations

### Performance
- Usar DataTables solo cuando sea necesario (tablas grandes)
- Limitar consultas con filtros obligatorios (UDN, Año, Mes)
- Cachear datos de filtros (UDN, tipos de venta) en init()

### Security
- Validación de datos en backend con `$this->util->sql()`
- Prevención de SQL injection mediante prepared statements
- Validación de permisos de usuario (si aplica)

### Maintainability
- Separación clara de responsabilidades (MVC)
- Nomenclatura consistente entre frontend y backend
- Comentarios solo donde sea necesario
- Código autoexplicativo

### Scalability
- Estructura modular permite agregar nuevas categorías
- Fácil extensión para reportes adicionales
- Preparado para múltiples UDN


## Integration Points

### Existing Code Integration
El módulo se integra con la estructura existente en `kpi-ventas.js`:

1. **Instancia Global**: Se crea instancia `sales` en el scope global
2. **Renderizado**: Se llama desde `app.render()` 
3. **Tab Navigation**: Se activa desde el tab "Módulo ventas"
4. **Shared Data**: Usa variables globales `udn`, `lsudn`, `clasificacion`

### API Endpoints
```javascript
// Inicialización
{ opc: "init" } → { udn, lsudn, clasification }

// Listar ventas
{ opc: "lsSales", udn, anio, mes, type } → { row, thead }

// Obtener venta
{ opc: "getSale", id } → { status, message, data }

// Agregar venta
{ opc: "addSale", ...formData } → { status, message }

// Editar venta
{ opc: "editSale", id, ...formData } → { status, message }

// Cambiar estado
{ opc: "statusSale", id, active } → { status, message }
```

## UI/UX Considerations

### Visual Design
- **Tema**: Corporativo de CoffeeSoft (#103B60, #8CC63F)
- **Tabla**: Fondo oscuro con texto claro
- **Estados**: Badges con colores semánticos (verde=activo, rojo=inactivo)
- **Botones**: Iconos descriptivos con tooltips

### User Flow
1. Usuario selecciona UDN, Año y Mes
2. Sistema muestra tabla con ventas del período
3. Usuario puede:
   - Ver desglose por categorías
   - Agregar nueva venta (botón "Subir Información")
   - Editar venta existente (icono lápiz)
   - Cambiar estado (icono toggle)

### Responsive Design
- Filtros se adaptan a pantalla (col-sm-3)
- Tabla con scroll horizontal en móviles
- Modales centrados y adaptables

## Deployment Notes

### Files to Create/Modify
```
kpi/marketing/ventas2/
├── ctrl/
│   └── ctrl-ventas2.php (NUEVO)
├── mdl/
│   └── mdl-ventas2.php (NUEVO)
└── src/js/
    └── kpi-ventas.js (MODIFICAR - agregar métodos a clase Sales)
```

### Database Changes
No se requieren cambios en la estructura de base de datos. Las tablas ya existen:
- `ventas`
- `venta_bitacora`
- `ventas_udn`
- `udn`

### Dependencies
- jQuery 3.x
- Moment.js (para manejo de fechas)
- Chart.js (ya incluido en el módulo)
- TailwindCSS (framework de estilos)
- CoffeeSoft.js (framework base)
- plugins.js (utilidades jQuery)

### Configuration
```php
// En mdl-ventas2.php
$this->bd = "rfwsmqex_ventas.";

// En ctrl-ventas2.php
require_once '../mdl/mdl-ventas2.php';
```
