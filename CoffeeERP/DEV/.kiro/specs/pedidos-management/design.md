# Design Document - Sistema de Administración de Pedidos

## Overview

El Sistema de Administración de Pedidos es una aplicación web modular construida con la arquitectura CoffeeSoft, que implementa el patrón MVC (Modelo-Vista-Controlador) con PHP en el backend y JavaScript/jQuery en el frontend. El sistema utiliza TailwindCSS para el diseño de interfaz y sigue los estándares de desarrollo establecidos en los pivotes de referencia.

### Arquitectura General

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND (JS)                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Dashboard   │  │   Pedidos    │  │  Productos   │      │
│  │   Module     │  │    Module    │  │    Module    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│           │                │                 │               │
│           └────────────────┴─────────────────┘               │
│                          │                                   │
│                   CoffeeSoft.js                              │
│                   (Components)                               │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND (PHP)                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ctrl-pedidos  │  │ctrl-productos│  │ ctrl-canales │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│           │                │                 │               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ mdl-pedidos  │  │mdl-productos │  │  mdl-canales │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                          │                                   │
│                      CRUD.php                                │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    DATABASE (MySQL)                          │
│  pedido, producto, cliente, canal, campana, etc.            │
└─────────────────────────────────────────────────────────────┘
```

## Architecture

### Frontend Architecture

El frontend está organizado en módulos JavaScript que heredan de la clase `Templates` de CoffeeSoft:

**Módulos Principales:**

1. **Dashboard Module** (`dashboard.js`)
   - Visualización de KPIs y métricas
   - Gráficos comparativos (Chart.js)
   - Filtros dinámicos por fecha y UDN

2. **Pedidos Module** (`pedidos.js`)
   - Captura de pedidos diarios
   - Listado y filtrado de pedidos
   - Edición y eliminación con reglas de negocio
   - Verificación de transferencias
   - Registro de llegadas

3. **Productos Module** (`productos.js`)
   - Gestión de productos y servicios
   - Categorización por UDN
   - Activación/desactivación

4. **Canales Module** (`canales.js`)
   - Administración de canales de comunicación
   - Gestión de campañas publicitarias

### Backend Architecture

El backend sigue el patrón MVC con separación clara de responsabilidades:

**Controladores (ctrl):**
- Reciben peticiones POST con `opc` (operación)
- Validan datos de entrada
- Invocan métodos del modelo
- Retornan respuestas JSON estandarizadas

**Modelos (mdl):**
- Extienden la clase `CRUD`
- Implementan operaciones de base de datos
- Usan métodos heredados: `_Select`, `_Insert`, `_Update`, `_Delete`, `_Read`

### Database Schema

Basado en el diagrama proporcionado:

```sql
-- Tablas principales
pedido (id, monto, envio_domicilio, fecha_creacion, fecha_pedido, 
        user_id, canal_id, cliente_id, udn_id, red_social_id, active)

producto (id, nombre, descripcion, udn_id, active)

producto_pedido (id, producto_id, pedido_id)

cliente (id, nombre, apellido_paterno, apellido_materno, vip, 
         telefono, correo, fecha_cumpleaños, fecha_creacion, udn_id, active)

canal (id, nombre, active)

red_social (id, nombre, color, icono, active)

campana (id, nombre, estrategia, fecha_creacion, udn_id, 
         red_social_id, active)

anuncio (id, nombre, fecha_inicio, fecha_fin, total_monto, 
         total_clics, imagen, campana_id, tipo_id, clasificacion_id)

tipo_anuncio (id, nombre, active)

clasificacion_anuncio (id, nombre, active)
```

## Components and Interfaces

### Frontend Components (CoffeeSoft)

**1. Dashboard Components**

```javascript
class Dashboard extends Templates {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "Dashboard";
    }

    // Métodos principales
    render()           // Renderiza el dashboard completo
    layout()           // Estructura visual con tabs
    filterBar()        // Barra de filtros (UDN, fecha)
    showKPIs()         // Tarjetas de métricas principales
    renderCharts()     // Gráficos comparativos
    loadMetrics()      // Carga datos del backend
}
```

**Componentes visuales utilizados:**
- `dashboardComponent()` - Contenedor principal con grid
- `infoCard()` - Tarjetas KPI
- `linearChart()` - Gráficos de línea (Chart.js)
- `barChart()` - Gráficos de barras
- `createfilterBar()` - Filtros dinámicos

**2. Pedidos Components**

```javascript
class Pedidos extends Templates {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "Pedidos";
    }

    // Métodos principales
    render()              // Renderiza módulo completo
    layout()              // Estructura con tabs
    filterBar()           // Filtros de búsqueda
    lsPedidos()           // Lista pedidos en tabla
    addPedido()           // Formulario de captura
    editPedido(id)        // Edición de pedido
    verifyTransfer(id)    // Verificar pago
    registerArrival(id)   // Registrar llegada
    cancelPedido(id)      // Cancelar pedido
    jsonPedido()          // Estructura del formulario
}
```

**Componentes visuales utilizados:**
- `tabLayout()` - Navegación por pestañas
- `createTable()` - Tabla dinámica con DataTables
- `createModalForm()` - Formularios modales
- `createfilterBar()` - Barra de filtros
- `swalQuestion()` - Confirmaciones
- `dataPicker()` - Selector de fechas

**3. Productos Components**

```javascript
class Productos extends Templates {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "Productos";
    }

    // Métodos principales
    render()                  // Renderiza módulo
    layout()                  // Estructura visual
    filterBar()               // Filtros (UDN, estado)
    lsProductos()             // Lista productos
    addProducto()             // Agregar producto
    editProducto(id)          // Editar producto
    statusProducto(id, active) // Cambiar estado
    jsonProducto()            // Estructura formulario
}
```

**4. Canales Components**

```javascript
class Canales extends Templates {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "Canales";
    }

    // Métodos principales
    render()                // Renderiza módulo
    layout()                // Estructura con tabs
    lsCanales()             // Lista canales
    addCanal()              // Agregar canal
    editCanal(id)           // Editar canal
    statusCanal(id, active) // Cambiar estado
    lsCampanas()            // Lista campañas
    addCampana()            // Agregar campaña
    editCampana(id)         // Editar campaña
}
```

### Backend Interfaces

**Controladores (ctrl)**

Todos los controladores siguen esta estructura estándar:

```php
class ctrl extends mdl {
    
    // Inicialización de filtros
    function init() {
        return [
            'udn' => $this->lsUDN(),
            'canales' => $this->lsCanales([1]),
            'productos' => $this->lsProductos([1])
        ];
    }

    // Listar registros
    function ls() {
        $__row = [];
        $fi = $_POST['fi'];
        $ff = $_POST['ff'];
        
        $ls = $this->listPedidos([$fi, $ff, $_SESSION['SUB']]);
        
        foreach ($ls as $key) {
            $__row[] = [
                'id' => $key['id'],
                'Fecha' => formatSpanishDate($key['fecha_pedido']),
                'Cliente' => $key['cliente_nombre'],
                'Canal' => $key['canal_nombre'],
                'Monto' => evaluar($key['monto']),
                'Estado' => renderStatus($key['active']),
                'dropdown' => dropdown($key['id'], $key['active'])
            ];
        }
        
        return ['row' => $__row];
    }

    // Obtener registro
    function getPedido() {
        $status = 500;
        $message = 'Error al obtener pedido';
        
        $pedido = $this->getPedidoById([$_POST['id']]);
        
        if ($pedido) {
            $status = 200;
            $message = 'Pedido obtenido correctamente';
        }
        
        return [
            'status' => $status,
            'message' => $message,
            'data' => $pedido
        ];
    }

    // Agregar registro
    function addPedido() {
        $status = 500;
        $message = 'Error al crear pedido';
        
        $_POST['fecha_creacion'] = date('Y-m-d H:i:s');
        $_POST['user_id'] = $_SESSION['USER_ID'];
        $_POST['udn_id'] = $_SESSION['SUB'];
        $_POST['active'] = 1;
        
        $create = $this->createPedido($this->util->sql($_POST));
        
        if ($create) {
            $status = 200;
            $message = 'Pedido creado correctamente';
        }
        
        return [
            'status' => $status,
            'message' => $message
        ];
    }

    // Editar registro
    function editPedido() {
        $status = 500;
        $message = 'Error al editar pedido';
        
        // Validar que el pedido tenga menos de 7 días
        $pedido = $this->getPedidoById([$_POST['id']]);
        $diasTranscurridos = (strtotime(date('Y-m-d')) - strtotime($pedido['fecha_creacion'])) / 86400;
        
        if ($diasTranscurridos > 7) {
            return [
                'status' => 403,
                'message' => 'No se puede editar pedidos con más de 7 días'
            ];
        }
        
        $edit = $this->updatePedido($this->util->sql($_POST, 1));
        
        if ($edit) {
            $status = 200;
            $message = 'Pedido editado correctamente';
        }
        
        return [
            'status' => $status,
            'message' => $message
        ];
    }

    // Cambiar estado
    function statusPedido() {
        $status = 500;
        $message = 'Error al cambiar estado';
        
        $update = $this->updatePedido($this->util->sql($_POST, 1));
        
        if ($update) {
            $status = 200;
            $message = 'Estado actualizado correctamente';
        }
        
        return [
            'status' => $status,
            'message' => $message
        ];
    }

    // Verificar transferencia
    function verifyTransfer() {
        $status = 500;
        $message = 'Error al verificar transferencia';
        
        $_POST['fecha_verificacion'] = date('Y-m-d H:i:s');
        $_POST['usuario_verificacion'] = $_SESSION['USER_ID'];
        $_POST['pago_verificado'] = 1;
        
        $update = $this->updatePedido($this->util->sql($_POST, 1));
        
        if ($update) {
            $status = 200;
            $message = 'Transferencia verificada correctamente';
        }
        
        return [
            'status' => $status,
            'message' => $message
        ];
    }

    // Registrar llegada
    function registerArrival() {
        $status = 500;
        $message = 'Error al registrar llegada';
        
        $_POST['fecha_llegada'] = date('Y-m-d H:i:s');
        $_POST['llego_establecimiento'] = $_POST['arrived'];
        
        $update = $this->updatePedido($this->util->sql($_POST, 1));
        
        if ($update) {
            $status = 200;
            $message = 'Llegada registrada correctamente';
        }
        
        return [
            'status' => $status,
            'message' => $message
        ];
    }
}
```

**Modelos (mdl)**

```php
class mdl extends CRUD {
    protected $util;
    public $bd;

    public function __construct() {
        $this->util = new Utileria;
        $this->bd = "database_name.";
    }

    // Listar pedidos
    function listPedidos($array) {
        $leftjoin = [
            $this->bd . 'cliente' => 'pedido.cliente_id = cliente.id',
            $this->bd . 'canal' => 'pedido.canal_id = canal.id',
            $this->bd . 'red_social' => 'pedido.red_social_id = red_social.id'
        ];

        return $this->_Select([
            'table' => $this->bd . 'pedido',
            'values' => "
                pedido.id,
                pedido.monto,
                pedido.fecha_pedido,
                pedido.fecha_creacion,
                pedido.envio_domicilio,
                pedido.active,
                cliente.nombre AS cliente_nombre,
                cliente.telefono AS cliente_telefono,
                canal.nombre AS canal_nombre,
                red_social.nombre AS red_social_nombre
            ",
            'leftjoin' => $leftjoin,
            'where' => 'pedido.fecha_pedido BETWEEN ? AND ? AND pedido.udn_id = ?',
            'order' => ['DESC' => 'pedido.fecha_creacion'],
            'data' => $array
        ]);
    }

    // Obtener pedido por ID
    function getPedidoById($array) {
        $result = $this->_Select([
            'table' => $this->bd . 'pedido',
            'values' => '*',
            'where' => 'id = ?',
            'data' => $array
        ]);
        return $result[0] ?? null;
    }

    // Crear pedido
    function createPedido($array) {
        return $this->_Insert([
            'table' => $this->bd . 'pedido',
            'values' => $array['values'],
            'data' => $array['data']
        ]);
    }

    // Actualizar pedido
    function updatePedido($array) {
        return $this->_Update([
            'table' => $this->bd . 'pedido',
            'values' => $array['values'],
            'where' => 'id = ?',
            'data' => $array['data']
        ]);
    }

    // Listar UDN
    function lsUDN() {
        return $this->_Select([
            'table' => 'udn',
            'values' => 'idUDN AS id, UDN AS valor',
            'where' => 'Stado = 1',
            'order' => ['ASC' => 'UDN']
        ]);
    }

    // Listar canales
    function lsCanales($array) {
        return $this->_Select([
            'table' => $this->bd . 'canal',
            'values' => 'id, nombre AS valor',
            'where' => 'active = ?',
            'order' => ['ASC' => 'nombre'],
            'data' => $array
        ]);
    }

    // Listar productos
    function lsProductos($array) {
        return $this->_Select([
            'table' => $this->bd . 'producto',
            'values' => 'id, nombre AS valor',
            'where' => 'active = ?',
            'order' => ['ASC' => 'nombre'],
            'data' => $array
        ]);
    }
}
```

## Data Models

### Pedido (Order)

```javascript
{
    id: integer,
    monto: decimal(10,2),
    envio_domicilio: boolean,
    fecha_creacion: datetime,
    fecha_pedido: date,
    hora_entrega: time,
    user_id: integer,
    canal_id: integer,
    cliente_id: integer,
    udn_id: integer,
    red_social_id: integer,
    campana_id: integer (nullable),
    llego_establecimiento: boolean (nullable),
    pago_verificado: boolean,
    fecha_verificacion: datetime (nullable),
    usuario_verificacion: integer (nullable),
    notas: text (nullable),
    active: boolean
}
```

### Cliente (Client)

```javascript
{
    id: integer,
    nombre: string,
    apellido_paterno: string,
    apellido_materno: string,
    vip: boolean,
    telefono: string,
    correo: string (nullable),
    fecha_cumpleaños: date (nullable),
    fecha_creacion: datetime,
    udn_id: integer,
    active: boolean
}
```

### Producto (Product)

```javascript
{
    id: integer,
    nombre: string,
    descripcion: text,
    precio: decimal(10,2),
    tipo: enum('producto', 'servicio'),
    udn_id: integer,
    active: boolean
}
```

### Canal (Channel)

```javascript
{
    id: integer,
    nombre: string,
    icono: string,
    color: string,
    active: boolean
}
```

### Campaña (Campaign)

```javascript
{
    id: integer,
    nombre: string,
    estrategia: text,
    fecha_creacion: datetime,
    fecha_inicio: date,
    fecha_fin: date,
    presupuesto: decimal(10,2),
    total_clics: integer,
    udn_id: integer,
    red_social_id: integer,
    active: boolean
}
```

## Error Handling

### Frontend Error Handling

```javascript
// Manejo de errores en peticiones AJAX
async function handleRequest(options) {
    try {
        const response = await useFetch(options);
        
        if (response.status === 200) {
            alert({
                icon: "success",
                text: response.message
            });
            return response;
        } else if (response.status === 403) {
            alert({
                icon: "warning",
                title: "Acceso denegado",
                text: response.message
            });
        } else if (response.status === 409) {
            alert({
                icon: "info",
                title: "Conflicto",
                text: response.message
            });
        } else {
            alert({
                icon: "error",
                title: "Error",
                text: response.message
            });
        }
    } catch (error) {
        alert({
            icon: "error",
            title: "Error de conexión",
            text: "No se pudo conectar con el servidor"
        });
        console.error(error);
    }
}
```

### Backend Error Handling

```php
// Manejo de errores en controladores
try {
    // Validar entrada
    if (empty($_POST['campo_requerido'])) {
        throw new Exception('Campo requerido faltante');
    }
    
    // Ejecutar operación
    $result = $this->operacion();
    
    if (!$result) {
        throw new Exception('Error en la operación');
    }
    
    return [
        'status' => 200,
        'message' => 'Operación exitosa',
        'data' => $result
    ];
    
} catch (Exception $e) {
    return [
        'status' => 500,
        'message' => $e->getMessage()
    ];
}
```

### Validation Rules

**Frontend Validations:**
- Campos requeridos no vacíos
- Formato de email válido
- Formato de teléfono válido (10 dígitos)
- Montos positivos
- Fechas válidas y lógicas
- Longitud máxima de campos

**Backend Validations:**
- Sanitización de datos con `$this->util->sql()`
- Validación de permisos por rol
- Validación de reglas de negocio (7 días para edición)
- Validación de existencia de registros relacionados
- Validación de unicidad de campos

## Testing Strategy

### Unit Testing

**Frontend Tests:**
```javascript
// Test de validación de formularios
describe('Pedidos Form Validation', () => {
    test('should validate required fields', () => {
        const form = new Pedidos(api, 'root');
        const isValid = form.validateForm({
            cliente_nombre: '',
            telefono: '',
            monto: ''
        });
        expect(isValid).toBe(false);
    });

    test('should validate phone format', () => {
        const form = new Pedidos(api, 'root');
        const isValid = form.validatePhone('1234567890');
        expect(isValid).toBe(true);
    });

    test('should validate amount is positive', () => {
        const form = new Pedidos(api, 'root');
        const isValid = form.validateAmount(-100);
        expect(isValid).toBe(false);
    });
});
```

**Backend Tests:**
```php
// Test de operaciones CRUD
class PedidosTest extends PHPUnit\Framework\TestCase {
    
    public function testCreatePedido() {
        $ctrl = new ctrl();
        $_POST = [
            'opc' => 'addPedido',
            'cliente_nombre' => 'Test Cliente',
            'telefono' => '1234567890',
            'monto' => 500.00,
            'canal_id' => 1
        ];
        
        $result = $ctrl->addPedido();
        $this->assertEquals(200, $result['status']);
    }

    public function testEditPedidoWithin7Days() {
        $ctrl = new ctrl();
        $_POST = [
            'opc' => 'editPedido',
            'id' => 1,
            'monto' => 600.00
        ];
        
        $result = $ctrl->editPedido();
        $this->assertEquals(200, $result['status']);
    }

    public function testEditPedidoAfter7Days() {
        $ctrl = new ctrl();
        $_POST = [
            'opc' => 'editPedido',
            'id' => 999, // Pedido antiguo
            'monto' => 600.00
        ];
        
        $result = $ctrl->editPedido();
        $this->assertEquals(403, $result['status']);
    }
}
```

### Integration Testing

**Test de flujo completo:**
1. Crear pedido desde formulario
2. Verificar que aparece en la tabla
3. Editar pedido
4. Verificar transferencia
5. Registrar llegada
6. Verificar que los datos se reflejan en el dashboard

### User Acceptance Testing

**Escenarios de prueba:**
1. Captura de pedido diario completo
2. Edición de pedido dentro de 7 días
3. Intento de edición después de 7 días (debe fallar)
4. Verificación de transferencia por tesorería
5. Registro de llegada para servicios
6. Filtrado de pedidos por múltiples criterios
7. Exportación de reportes
8. Visualización de dashboard con métricas
9. Gestión de productos y canales
10. Control de accesos por rol

### Performance Testing

**Métricas objetivo:**
- Tiempo de carga de tabla con 1000 registros: < 2 segundos
- Tiempo de respuesta de formularios: < 500ms
- Tiempo de generación de reportes: < 3 segundos
- Tiempo de carga de dashboard: < 2 segundos

**Optimizaciones:**
- Paginación en tablas (10-20 registros por página)
- Índices en campos de búsqueda frecuente
- Cache de filtros comunes
- Lazy loading de gráficos
- Compresión de respuestas JSON

## Design Decisions

### 1. Arquitectura MVC con CoffeeSoft

**Decisión:** Usar el framework CoffeeSoft con arquitectura MVC estricta.

**Razones:**
- Separación clara de responsabilidades
- Reutilización de componentes
- Mantenibilidad del código
- Consistencia con otros módulos del ERP
- Componentes probados y estables

### 2. jQuery + TailwindCSS para Frontend

**Decisión:** Usar jQuery para lógica y TailwindCSS para estilos.

**Razones:**
- Integración nativa con CoffeeSoft
- Curva de aprendizaje baja
- Componentes reutilizables ya disponibles
- Diseño responsive automático
- Consistencia visual con el ERP

### 3. Soft Delete en lugar de Hard Delete

**Decisión:** Cambiar estado `active` a 0 en lugar de eliminar físicamente.

**Razones:**
- Auditoría completa de operaciones
- Posibilidad de recuperar datos
- Integridad referencial
- Cumplimiento de normativas

### 4. Regla de 7 días para edición

**Decisión:** Bloquear edición de pedidos después de 7 días.

**Razones:**
- Evitar modificaciones a datos históricos
- Mantener integridad de reportes
- Cumplir con políticas de negocio
- Auditoría clara de cambios

### 5. Roles y permisos granulares

**Decisión:** Implementar control de acceso por rol de usuario.

**Razones:**
- Seguridad de la información
- Separación de responsabilidades
- Cumplimiento de políticas internas
- Auditoría de accesos

### 6. Dashboard con métricas en tiempo real

**Decisión:** Calcular métricas dinámicamente en cada consulta.

**Razones:**
- Datos siempre actualizados
- No requiere procesos batch
- Simplicidad de implementación
- Flexibilidad en filtros

### 7. Exportación a Excel/CSV

**Decisión:** Permitir exportación de todas las tablas y reportes.

**Razones:**
- Análisis externo de datos
- Integración con otras herramientas
- Respaldo de información
- Requerimiento de usuarios

### 8. Validación dual (Frontend + Backend)

**Decisión:** Validar datos tanto en frontend como en backend.

**Razones:**
- Mejor experiencia de usuario (validación inmediata)
- Seguridad (validación en servidor)
- Prevención de datos inválidos
- Robustez del sistema

## Technology Stack

**Frontend:**
- JavaScript ES6+
- jQuery 3.x
- TailwindCSS 3.x
- Chart.js 3.x
- DataTables 1.x
- Moment.js
- SweetAlert2
- Bootbox.js

**Backend:**
- PHP 7.4+
- MySQL 5.7+
- Apache/Nginx

**Framework:**
- CoffeeSoft (custom framework)
- CRUD.php (base class)
- Utileria.php (utilities)

**Development Tools:**
- Git (version control)
- VS Code (IDE)
- phpMyAdmin (database management)
- Chrome DevTools (debugging)

## Security Considerations

**Authentication:**
- Session-based authentication
- Session timeout after 30 minutes of inactivity
- Secure session configuration

**Authorization:**
- Role-based access control (RBAC)
- Permission validation on every request
- Audit log of all actions

**Data Protection:**
- SQL injection prevention (prepared statements)
- XSS prevention (output escaping)
- CSRF protection (token validation)
- Input sanitization
- Output encoding

**Database Security:**
- Encrypted connections
- Least privilege principle
- Regular backups
- Audit logging

**API Security:**
- POST-only endpoints
- JSON responses
- Error message sanitization
- Rate limiting (future enhancement)
