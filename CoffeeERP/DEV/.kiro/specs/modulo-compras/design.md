# Design Document - Módulo de Compras

## Overview

El módulo de Compras es un sistema de gestión integral que permite registrar, visualizar, editar y eliminar compras empresariales. Está construido sobre el framework CoffeeSoft, utilizando arquitectura MVC con separación clara entre frontend (JavaScript), controlador (PHP) y modelo (PHP).

### Características Principales

- Dashboard con totales por tipo de compra (general, fondo fijo, crédito, corporativo)
- CRUD completo de compras con validaciones
- Gestión de proveedores y productos relacionados
- Filtrado dinámico por tipo de compra
- Cálculo automático de totales (subtotal + impuesto)
- Interfaz responsive con TailwindCSS

### Stack Tecnológico

- **Frontend**: JavaScript (jQuery), CoffeeSoft Framework, TailwindCSS
- **Backend**: PHP 7.4+
- **Base de Datos**: MySQL
- **Componentes**: Templates, Components (CoffeeSoft)

## Architecture

### Estructura de Archivos

```
contabilidad/
├── administrador/
│   ├── index.php                    # Punto de entrada
│   ├── js/
│   │   └── compras.js              # Frontend principal
│   ├── ctrl/
│   │   └── ctrl-compras.php        # Controlador
│   └── mdl/
│       ├── mdl-compras.php         # Modelo de compras
│       └── mdl-proveedores.php     # Modelo de proveedores
```

### Patrón de Arquitectura

**MVC (Model-View-Controller)**

- **Model (mdl)**: Acceso a datos, consultas SQL, lógica de negocio
- **View (index.php + js)**: Interfaz de usuario, renderizado dinámico
- **Controller (ctrl)**: Intermediario entre modelo y vista, validaciones


### Flujo de Datos

```
Usuario → Frontend (compras.js) → Controlador (ctrl-compras.php) → Modelo (mdl-compras.php) → Base de Datos
                                                                                                      ↓
Usuario ← Frontend (actualización UI) ← Controlador (JSON response) ← Modelo (datos procesados) ←──┘
```

## Components and Interfaces

### Frontend Components (compras.js)

#### Clase Principal: App

```javascript
class App extends Templates {
    constructor(link, div_modulo)
    PROJECT_NAME = "compras"
    
    // Métodos principales
    render()              // Inicializa el módulo
    layout()              // Estructura visual con tabs
    filterBar()           // Barra de filtros
    lsCompras()           // Lista de compras (tabla)
    addCompra()           // Modal para nueva compra
    editCompra(id)        // Modal para editar compra
    viewCompra(id)        // Modal de detalle
    deleteCompra(id)      // Confirmación de eliminación
    jsonCompra()          // Estructura del formulario
}
```

#### Clase Secundaria: Proveedor

```javascript
class Proveedor extends App {
    constructor(link, div_modulo)
    
    // Métodos
    filterBarProveedor()  // Filtros de proveedores
    lsProveedor()         // Lista de proveedores
    addProveedor()        // Agregar proveedor
    editProveedor(id)     // Editar proveedor
    statusProveedor(id)   // Cambiar estado
}
```

### Backend Components

#### Controlador (ctrl-compras.php)

```php
class ctrl extends mdl {
    init()                // Carga filtros iniciales
    lsCompras()           // Lista compras con filtros
    getCompra()           // Obtiene una compra por ID
    addCompra()           // Registra nueva compra
    editCompra()          // Actualiza compra existente
    deleteCompra()        // Elimina compra
    getTotales()          // Calcula totales por tipo
}
```

#### Modelo Compras (mdl-compras.php)

```php
class mdl extends CRUD {
    listCompras($array)           // SELECT con filtros
    getCompraById($id)            // SELECT por ID
    createCompra($array)          // INSERT
    updateCompra($array)          // UPDATE
    deleteCompraById($id)         // DELETE (soft/hard)
    getTotalesByType()            // Totales agrupados
    lsInsumo()                    // Lista productos
    lsClaseInsumo()               // Lista categorías
    lsTipoCompra()                // Lista tipos de compra
    lsFormaPago()                 // Lista métodos de pago
}
```


#### Modelo Proveedores (mdl-proveedores.php)

```php
class mdl extends CRUD {
    listProveedores($array)       // SELECT proveedores
    getProveedorById($id)         // SELECT por ID
    createProveedor($array)       // INSERT
    updateProveedor($array)       // UPDATE
    existsProveedorByName($name)  // Validación unicidad
}
```

### Componentes CoffeeSoft Utilizados

#### Layouts
- `primaryLayout()` - Layout principal con filterBar y container
- `tabLayout()` - Pestañas (Compras, Proveedores)

#### Formularios
- `createModalForm()` - Modales para agregar/editar
- `form()` - Generación de formularios dinámicos
- `createfilterBar()` - Barra de filtros

#### Tablas
- `createTable()` - Tabla dinámica con paginación
- `createCoffeTable()` - Tabla estilizada

#### Interacción
- `swalQuestion()` - Confirmaciones (eliminar)
- `detailCard()` - Visualización de detalles
- `useFetch()` - Peticiones AJAX

## Data Models

### Tabla: compras

```sql
CREATE TABLE compras (
    id INT PRIMARY KEY AUTO_INCREMENT,
    udn_id INT NOT NULL,
    insumo_id INT NOT NULL,
    clase_insumo_id INT NOT NULL,
    proveedor_id INT NOT NULL,
    tipo_compra_id INT NOT NULL,
    forma_pago_id INT NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    impuesto DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    total DECIMAL(10,2) NOT NULL,
    descripcion TEXT,
    fecha_operacion DATETIME NOT NULL,
    activo TINYINT(1) DEFAULT 1,
    
    FOREIGN KEY (udn_id) REFERENCES udn(id),
    FOREIGN KEY (insumo_id) REFERENCES insumo(id),
    FOREIGN KEY (clase_insumo_id) REFERENCES clase_insumo(id),
    FOREIGN KEY (proveedor_id) REFERENCES proveedores(id),
    FOREIGN KEY (tipo_compra_id) REFERENCES tipo_compra(id),
    FOREIGN KEY (forma_pago_id) REFERENCES forma_pago(id),
    
    INDEX idx_tipo_compra (tipo_compra_id),
    INDEX idx_fecha (fecha_operacion),
    INDEX idx_activo (activo)
);
```

### Tabla: proveedores

```sql
CREATE TABLE proveedores (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(255) NOT NULL,
    rfc VARCHAR(13),
    telefono VARCHAR(20),
    email VARCHAR(100),
    direccion TEXT,
    activo TINYINT(1) DEFAULT 1,
    fecha_creacion DATETIME NOT NULL,
    
    UNIQUE KEY uk_nombre (nombre),
    INDEX idx_activo (activo)
);
```


### Tabla: insumo (productos)

```sql
CREATE TABLE insumo (
    id INT PRIMARY KEY AUTO_INCREMENT,
    clase_insumo_id INT NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    activo TINYINT(1) DEFAULT 1,
    
    FOREIGN KEY (clase_insumo_id) REFERENCES clase_insumo(id),
    INDEX idx_clase (clase_insumo_id)
);
```

### Tabla: clase_insumo (categorías)

```sql
CREATE TABLE clase_insumo (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    activo TINYINT(1) DEFAULT 1
);
```

### Tabla: tipo_compra

```sql
CREATE TABLE tipo_compra (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL,
    descripcion VARCHAR(255),
    activo TINYINT(1) DEFAULT 1
);

-- Datos iniciales
INSERT INTO tipo_compra (id, nombre) VALUES
(1, 'Fondo fijo'),
(2, 'Corporativo'),
(3, 'Crédito');
```

### Tabla: forma_pago

```sql
CREATE TABLE forma_pago (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL,
    descripcion VARCHAR(255),
    activo TINYINT(1) DEFAULT 1
);

-- Datos iniciales
INSERT INTO forma_pago (nombre) VALUES
('Efectivo'),
('Tarjeta de débito'),
('Tarjeta de crédito'),
('Transferencia'),
('Almacén del área compras');
```

### Relaciones entre Tablas

```
compras
├── udn_id → udn.id
├── insumo_id → insumo.id
├── clase_insumo_id → clase_insumo.id
├── proveedor_id → proveedores.id
├── tipo_compra_id → tipo_compra.id
└── forma_pago_id → forma_pago.id

insumo
└── clase_insumo_id → clase_insumo.id
```

## Error Handling

### Frontend Validations

```javascript
// Validación de campos obligatorios
if (!categoria || !producto || !tipoCompra || !proveedor || !subtotal) {
    alert({ icon: "warning", text: "Complete todos los campos obligatorios" });
    return false;
}

// Validación de montos
if (parseFloat(subtotal) <= 0) {
    alert({ icon: "error", text: "El subtotal debe ser mayor a cero" });
    return false;
}
```


### Backend Validations

```php
// Validación de existencia
function addCompra() {
    $status = 500;
    $message = 'Error al registrar la compra';
    
    // Validar campos obligatorios
    if (empty($_POST['insumo_id']) || empty($_POST['proveedor_id'])) {
        return [
            'status' => 400,
            'message' => 'Campos obligatorios faltantes'
        ];
    }
    
    // Validar monto
    if ($_POST['subtotal'] <= 0) {
        return [
            'status' => 400,
            'message' => 'El subtotal debe ser mayor a cero'
        ];
    }
    
    // Calcular total
    $_POST['total'] = $_POST['subtotal'] + $_POST['impuesto'];
    $_POST['fecha_operacion'] = date('Y-m-d H:i:s');
    
    $create = $this->createCompra($this->util->sql($_POST));
    
    if ($create) {
        $status = 200;
        $message = 'Compra registrada correctamente';
    }
    
    return [
        'status' => $status,
        'message' => $message
    ];
}
```

### Error Messages

| Código | Mensaje | Descripción |
|--------|---------|-------------|
| 200 | Operación exitosa | Registro/actualización/eliminación correcta |
| 400 | Datos inválidos | Campos obligatorios faltantes o formato incorrecto |
| 404 | No encontrado | Registro no existe en la base de datos |
| 409 | Conflicto | Registro duplicado (ej: proveedor con mismo nombre) |
| 500 | Error del servidor | Error en la base de datos o lógica de negocio |

## Testing Strategy

### Unit Tests

#### Frontend Tests
```javascript
// Test: Cálculo automático de total
test('calcularTotal', () => {
    const subtotal = 1000;
    const impuesto = 160;
    const total = subtotal + impuesto;
    expect(total).toBe(1160);
});

// Test: Validación de campos obligatorios
test('validarCamposObligatorios', () => {
    const datos = {
        categoria: '',
        producto: 'Test',
        subtotal: 100
    };
    expect(validarFormulario(datos)).toBe(false);
});
```

#### Backend Tests
```php
// Test: Creación de compra
public function testCreateCompra() {
    $data = [
        'insumo_id' => 1,
        'proveedor_id' => 1,
        'tipo_compra_id' => 1,
        'subtotal' => 1000,
        'impuesto' => 160,
        'total' => 1160
    ];
    
    $result = $this->ctrl->addCompra($data);
    $this->assertEquals(200, $result['status']);
}
```


### Integration Tests

```javascript
// Test: Flujo completo de registro de compra
describe('Flujo de Compra', () => {
    it('debe registrar una compra completa', async () => {
        // 1. Cargar filtros iniciales
        const init = await useFetch({ url: api, data: { opc: 'init' }});
        expect(init.categorias).toBeDefined();
        
        // 2. Abrir modal de nueva compra
        app.addCompra();
        expect($('#formCompraAdd')).toBeVisible();
        
        // 3. Llenar formulario
        $('#categoria').val(1).trigger('change');
        $('#producto').val(1).trigger('change');
        $('#subtotal').val(1000);
        
        // 4. Enviar formulario
        const response = await submitForm();
        expect(response.status).toBe(200);
        
        // 5. Verificar actualización de tabla
        expect($('#tbCompras tbody tr').length).toBeGreaterThan(0);
    });
});
```

### Manual Testing Checklist

- [ ] Verificar carga inicial del módulo con totales correctos
- [ ] Probar registro de compra con todos los tipos (fondo fijo, corporativo, crédito)
- [ ] Validar cálculo automático de total (subtotal + impuesto)
- [ ] Probar edición de compra existente
- [ ] Verificar modal de detalle con información completa
- [ ] Probar eliminación con confirmación
- [ ] Validar filtrado por tipo de compra
- [ ] Verificar actualización de totales después de cada operación
- [ ] Probar validaciones de campos obligatorios
- [ ] Verificar formato de montos con símbolo de moneda
- [ ] Probar gestión de proveedores (agregar, editar, cambiar estado)
- [ ] Validar relación entre categorías y productos (cascada)

## Design Decisions

### 1. Uso de Tabs para Separación de Módulos

**Decisión**: Implementar pestañas (Compras, Proveedores) en lugar de páginas separadas.

**Razón**: 
- Mejor experiencia de usuario (navegación sin recargar página)
- Consistencia con el pivote admin
- Facilita el mantenimiento del código

### 2. Cálculo Automático de Total

**Decisión**: Calcular el total automáticamente en el frontend y validar en el backend.

**Razón**:
- Mejora la experiencia del usuario (feedback inmediato)
- Reduce errores de captura
- El backend valida para garantizar integridad de datos

### 3. Soft Delete vs Hard Delete

**Decisión**: Implementar eliminación física (hard delete) con confirmación.

**Razón**:
- Requisito explícito: "eliminar el registro de forma permanente"
- Simplifica la lógica de consultas
- Modal de confirmación previene eliminaciones accidentales

### 4. Relación Categoría-Producto

**Decisión**: Cargar productos dinámicamente según la categoría seleccionada.

**Razón**:
- Mejora la usabilidad (lista filtrada de productos)
- Reduce errores de clasificación
- Optimiza el rendimiento (menos datos cargados inicialmente)


### 5. Estructura de Totales

**Decisión**: Calcular totales en tiempo real mediante consultas SQL agrupadas.

**Razón**:
- Garantiza precisión (datos directos de la base de datos)
- Evita inconsistencias por caché
- Permite auditoría y trazabilidad

### 6. Uso del Framework CoffeeSoft

**Decisión**: Utilizar componentes nativos de CoffeeSoft en lugar de librerías externas.

**Razón**:
- Consistencia visual con el resto del sistema
- Menor curva de aprendizaje para el equipo
- Optimización del rendimiento (menos dependencias)
- Mantenimiento centralizado

### 7. Validación Dual (Frontend + Backend)

**Decisión**: Implementar validaciones tanto en JavaScript como en PHP.

**Razón**:
- Frontend: Mejora la experiencia del usuario (feedback inmediato)
- Backend: Garantiza la seguridad (no se puede omitir desde el cliente)
- Defensa en profundidad contra datos inválidos

## API Endpoints

### Compras

| Endpoint | Método | Parámetros | Respuesta |
|----------|--------|------------|-----------|
| `ctrl-compras.php?opc=init` | POST | - | `{ categorias, productos, proveedores, tiposCompra, formasPago }` |
| `ctrl-compras.php?opc=lsCompras` | POST | `tipo_compra_id` (opcional) | `{ row: [...], totales: {...} }` |
| `ctrl-compras.php?opc=getCompra` | POST | `id` | `{ status, message, data: {...} }` |
| `ctrl-compras.php?opc=addCompra` | POST | `insumo_id, proveedor_id, tipo_compra_id, forma_pago_id, subtotal, impuesto, descripcion` | `{ status, message }` |
| `ctrl-compras.php?opc=editCompra` | POST | `id, insumo_id, proveedor_id, tipo_compra_id, forma_pago_id, subtotal, impuesto, descripcion` | `{ status, message }` |
| `ctrl-compras.php?opc=deleteCompra` | POST | `id` | `{ status, message }` |
| `ctrl-compras.php?opc=getTotales` | POST | - | `{ total_general, total_fondo_fijo, total_credito, total_corporativo }` |

### Proveedores

| Endpoint | Método | Parámetros | Respuesta |
|----------|--------|------------|-----------|
| `ctrl-compras.php?opc=lsProveedores` | POST | `activo` | `{ row: [...] }` |
| `ctrl-compras.php?opc=getProveedor` | POST | `id` | `{ status, message, data: {...} }` |
| `ctrl-compras.php?opc=addProveedor` | POST | `nombre, rfc, telefono, email, direccion` | `{ status, message }` |
| `ctrl-compras.php?opc=editProveedor` | POST | `id, nombre, rfc, telefono, email, direccion` | `{ status, message }` |
| `ctrl-compras.php?opc=statusProveedor` | POST | `id, activo` | `{ status, message }` |

## Security Considerations

### Autenticación y Autorización
- Validar sesión activa en todas las peticiones PHP
- Verificar permisos del usuario para operaciones CRUD
- Implementar tokens CSRF para formularios

### Validación de Datos
- Sanitizar todos los inputs con `$this->util->sql()`
- Validar tipos de datos (int, decimal, string)
- Escapar salidas HTML para prevenir XSS

### SQL Injection Prevention
- Usar prepared statements en todas las consultas
- Nunca concatenar variables directamente en SQL
- Validar IDs numéricos antes de usar en queries

### Auditoría
- Registrar operaciones críticas (crear, editar, eliminar)
- Almacenar usuario y fecha de última modificación
- Implementar logs de errores para debugging


## Performance Optimization

### Database Optimization
- Índices en columnas de búsqueda frecuente (`tipo_compra_id`, `fecha_operacion`, `activo`)
- Consultas optimizadas con JOINs eficientes
- Paginación en tablas con muchos registros (15 registros por página)

### Frontend Optimization
- Carga diferida de productos según categoría seleccionada
- Caché de filtros iniciales en variables globales
- Uso de DataTables para renderizado eficiente de tablas grandes

### Caching Strategy
- Cachear listas de catálogos (tipos de compra, formas de pago) en el frontend
- Actualizar caché solo cuando se modifiquen catálogos
- Invalidar caché de totales después de operaciones CRUD

## Deployment Considerations

### Requisitos del Servidor
- PHP 7.4 o superior
- MySQL 5.7 o superior
- Apache/Nginx con mod_rewrite habilitado
- Extensiones PHP: mysqli, json, session

### Configuración de Base de Datos
```sql
-- Crear base de datos
CREATE DATABASE IF NOT EXISTS rfwsmqex_contabilidad 
CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Configurar usuario
GRANT ALL PRIVILEGES ON rfwsmqex_contabilidad.* 
TO 'usuario_contabilidad'@'localhost' 
IDENTIFIED BY 'password_seguro';
```

### Variables de Entorno
```php
// conf/config.php
define('DB_HOST', 'localhost');
define('DB_NAME', 'rfwsmqex_contabilidad');
define('DB_USER', 'usuario_contabilidad');
define('DB_PASS', 'password_seguro');
```

### Migración de Datos
1. Ejecutar scripts de creación de tablas
2. Insertar datos iniciales (tipos de compra, formas de pago)
3. Migrar proveedores existentes (si aplica)
4. Validar integridad referencial

## Maintenance and Monitoring

### Logs
- Registrar errores PHP en `logs/error.log`
- Registrar operaciones CRUD en `logs/audit.log`
- Monitorear consultas lentas en MySQL slow query log

### Backups
- Backup diario de la base de datos
- Retención de 30 días
- Backup incremental cada 6 horas

### Monitoring Metrics
- Tiempo de respuesta de endpoints (< 500ms)
- Tasa de errores (< 1%)
- Uso de memoria PHP (< 128MB por request)
- Conexiones activas a MySQL (< 100)

## Future Enhancements

### Fase 2 (Opcional)
- Importación masiva de compras desde Excel/CSV
- Exportación de reportes en PDF
- Gráficas de tendencias de compras por mes
- Notificaciones por email al registrar compras grandes
- Integración con sistema de inventario
- Aprobación de compras por niveles (workflow)
- Adjuntar archivos de facturas (PDF, imágenes)
- Historial de cambios por compra (auditoría detallada)

### Mejoras de UX
- Búsqueda avanzada con múltiples filtros
- Ordenamiento de columnas en tabla
- Vista de calendario para compras por fecha
- Dashboard con widgets personalizables
- Modo oscuro/claro
- Accesos directos por teclado

