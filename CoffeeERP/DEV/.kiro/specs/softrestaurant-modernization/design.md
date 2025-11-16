# Design Document - SoftRestaurant Modernization

## Overview

Este documento describe el diseño técnico para la modernización del sistema SoftRestaurant bajo el framework CoffeeSoft. La modernización se enfoca en reestructurar la arquitectura del proyecto manteniendo al 100% la lógica funcional existente, aplicando patrones MVC, componentes reutilizables y convenciones del framework.

### Objetivos del Diseño

1. **Arquitectura Modular**: Separar responsabilidades en capas MVC bien definidas
2. **Reutilización de Código**: Usar componentes de CoffeeSoft y crear componentes personalizados donde sea necesario
3. **Mantenibilidad**: Código limpio, organizado y fácil de mantener
4. **Preservación Funcional**: Mantener toda la lógica de negocio sin alteraciones
5. **Escalabilidad**: Facilitar futuras extensiones del sistema

## Architecture

### Estructura de Carpetas

```
softrestaurant-update/
│
├── index.php                           # Punto de entrada principal
│
├── ctrl/                               # Controladores (Lógica de negocio)
│   ├── ctrl-administracion.php
│   ├── ctrl-productos-vendidos.php
│   ├── ctrl-salidas.php
│   ├── ctrl-desplazamientos.php
│   ├── ctrl-gestion-archivos.php
│   └── ctrl-soft-archivos-diarios.php
│
├── mdl/                                # Modelos (Acceso a datos)
│   ├── mdl-administracion.php
│   ├── mdl-productos-vendidos.php
│   ├── mdl-salidas.php
│   ├── mdl-desplazamientos.php
│   ├── mdl-gestion-archivos.php
│   └── mdl-costo-potencial.php
│
├── js/                                 # Scripts principales
│   ├── administracion.js
│   ├── productos-vendidos.js
│   ├── salidas.js
│   ├── desplazamientos.js
│   └── gestion-archivos.js
│
├── src/                                # Recursos estáticos
│   ├── js/
│   │   ├── coffeSoft.js               # Framework core (OBLIGATORIO)
│   │   └── plugins.js                 # Plugins jQuery (OBLIGATORIO)
│   │
│   ├── components/                     # Componentes personalizados
│   │   ├── product-card.js
│   │   ├── category-selector.js
│   │   └── excel-uploader.js
│   │
│   └── css/
│       └── custom.css
│
└── layout/                             # Layouts compartidos
    ├── head.php
    ├── navbar.php
    └── footer.php
```

### Arquitectura de Capas

```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                        │
│  (index.php, layouts, TailwindCSS, Components)              │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND LAYER (JS)                       │
│  Classes extending Templates (CoffeeSoft)                    │
│  - App (main class)                                          │
│  - Submodules (if needed)                                    │
│  - Components (createTable, createForm, etc.)                │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    CONTROLLER LAYER (PHP)                    │
│  Classes extending Model                                     │
│  - Route requests (opc parameter)                            │
│  - Business logic                                            │
│  - Data transformation                                       │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    MODEL LAYER (PHP)                         │
│  Classes extending CRUD                                      │
│  - Database operations                                       │
│  - Data validation                                           │
│  - Query execution                                           │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    DATABASE LAYER                            │
│  MySQL Database                                              │
│  - Tables: productos, categorias, ventas, etc.              │
└─────────────────────────────────────────────────────────────┘
```

## Components and Interfaces

### Frontend Components (JavaScript)

#### 1. Clase Base: App (extends Templates)

**Responsabilidad**: Clase principal que gestiona el módulo de administración

```javascript
class App extends Templates {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "administracion";
    }
    
    // Métodos principales
    render()           // Inicializa el módulo
    layout()           // Crea estructura visual
    filterBar()        // Barra de filtros
    ls()               // Lista productos
    lsGrupo()          // Lista por categoría
    rptDetallado()     // Reporte detallado
    addProducto()      // Agregar producto
    editProducto(id)   // Editar producto
    statusProducto(id) // Cambiar estado
    uploadExcel()      // Subir archivo Excel
}
```

#### 2. Clase: ProductosVendidos (extends Templates)

**Responsabilidad**: Gestión de productos vendidos y desplazamientos

```javascript
class ProductosVendidos extends Templates {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "productosVendidos";
    }
    
    // Métodos principales
    render()
    layout()
    filterBar()
    lsSoftRestaurant()      // Lista de Soft Restaurant
    lsCostsys()             // Lista de Costsys
    lsFogaza()              // Lista específica Fogaza
    subirCostoPotencial()   // Subir a costo potencial
    lsDiasPendientes()      // Días pendientes de carga
}
```

#### 3. Clase: Salidas (extends Templates)

**Responsabilidad**: Gestión de salidas de productos

```javascript
class Salidas extends Templates {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "salidas";
    }
    
    // Métodos principales
    render()
    layout()
    filterBar()
    ls()
    addSalida()
    editSalida(id)
    statusSalida(id)
}
```

#### 4. Componentes Personalizados

**ProductCard Component**
```javascript
productCard(options) {
    const defaults = {
        parent: "root",
        id: "productCard",
        data: {},
        onClick: () => {}
    };
    // Renderiza tarjeta de producto con imagen, nombre, precio
}
```

**ExcelUploader Component**
```javascript
excelUploader(options) {
    const defaults = {
        parent: "root",
        id: "excelUploader",
        onUpload: () => {},
        onCompare: () => {}
    };
    // Componente para subir y comparar archivos Excel
}
```

**CategorySelector Component**
```javascript
categorySelector(options) {
    const defaults = {
        parent: "root",
        id: "categorySelector",
        categories: [],
        onChange: () => {}
    };
    // Selector dinámico de categorías con lógica específica
}
```

### Backend Components (PHP)

#### 1. Controladores

**Estructura Estándar de Controlador**

```php
<?php
session_start();

if (empty($_POST['opc'])) exit(0);

require_once '../mdl/mdl-[modulo].php';

class ctrl extends mdl {
    
    function init() {
        // Inicializa filtros y datos iniciales
        return [
            'udn' => $this->lsUDN(),
            'categorias' => $this->lsCategorias()
        ];
    }
    
    function ls() {
        // Lista registros principales
        $data = $this->listProductos([$_POST['udn']]);
        $rows = [];
        
        foreach ($data as $item) {
            $rows[] = [
                'id' => $item['id'],
                'nombre' => $item['nombre'],
                'precio' => evaluar($item['precio']),
                'dropdown' => dropdown($item['id'])
            ];
        }
        
        return ['row' => $rows];
    }
    
    function addProducto() {
        // Agregar nuevo producto
        $status = 500;
        $message = 'Error al agregar';
        
        $exists = $this->existsProductoByName([$_POST['nombre']]);
        
        if (!$exists) {
            $create = $this->createProducto($this->util->sql($_POST));
            if ($create) {
                $status = 200;
                $message = 'Producto agregado correctamente';
            }
        } else {
            $status = 409;
            $message = 'El producto ya existe';
        }
        
        return ['status' => $status, 'message' => $message];
    }
    
    function editProducto() {
        // Editar producto existente
    }
    
    function getProducto() {
        // Obtener producto por ID
    }
    
    function statusProducto() {
        // Cambiar estado del producto
    }
}

// Complements
function dropdown($id) {
    return [
        ['icon' => 'icon-pencil', 'text' => 'Editar', 'onclick' => "app.editProducto($id)"],
        ['icon' => 'icon-trash', 'text' => 'Eliminar', 'onclick' => "app.deleteProducto($id)"]
    ];
}

function evaluar($val) {
    return $val ? '$ ' . number_format($val, 2, '.', ',') : '-';
}

$obj = new ctrl();
echo json_encode($obj->{$_POST['opc']}());
```

#### 2. Modelos

**Estructura Estándar de Modelo**

```php
<?php
require_once '../../conf/_CRUD.php';
require_once '../../conf/_Utileria.php';

class mdl extends CRUD {
    protected $util;
    public $bd;
    
    public function __construct() {
        $this->util = new Utileria;
        $this->bd = "rfwsmqex_softrestaurant.";
    }
    
    // Productos
    function listProductos($array) {
        return $this->_Select([
            'table' => $this->bd . 'productos',
            'values' => 'id, nombre, precio, categoria_id, active',
            'where' => 'udn = ? AND active = 1',
            'order' => ['DESC' => 'id'],
            'data' => $array
        ]);
    }
    
    function getProductoById($array) {
        return $this->_Select([
            'table' => $this->bd . 'productos',
            'values' => '*',
            'where' => 'id = ?',
            'data' => $array
        ])[0];
    }
    
    function existsProductoByName($array) {
        $query = "SELECT id FROM {$this->bd}productos 
                  WHERE LOWER(nombre) = LOWER(?) AND active = 1";
        $result = $this->_Read($query, $array);
        return count($result) > 0;
    }
    
    function createProducto($array) {
        return $this->_Insert([
            'table' => $this->bd . 'productos',
            'values' => $array['values'],
            'data' => $array['data']
        ]);
    }
    
    function updateProducto($array) {
        return $this->_Update([
            'table' => $this->bd . 'productos',
            'values' => $array['values'],
            'where' => 'id = ?',
            'data' => $array['data']
        ]);
    }
    
    function deleteProductoById($array) {
        return $this->_Delete([
            'table' => $this->bd . 'productos',
            'where' => 'id = ?',
            'data' => $array
        ]);
    }
    
    // Categorías
    function lsCategorias($array = []) {
        return $this->_Select([
            'table' => $this->bd . 'categorias',
            'values' => 'id, nombre AS valor',
            'where' => 'active = 1',
            'order' => ['ASC' => 'nombre']
        ]);
    }
    
    // UDN
    function lsUDN() {
        return $this->_Select([
            'table' => $this->bd . 'udn',
            'values' => 'id, nombre AS valor',
            'where' => 'active = 1',
            'order' => ['ASC' => 'nombre']
        ]);
    }
}
```

## Data Models

### Tablas Principales

#### 1. productos
```sql
CREATE TABLE productos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10,2),
    costo DECIMAL(10,2),
    categoria_id INT,
    udn INT,
    imagen VARCHAR(255),
    active TINYINT DEFAULT 1,
    fecha_creacion DATETIME,
    fecha_modificacion DATETIME,
    INDEX idx_categoria (categoria_id),
    INDEX idx_udn (udn),
    INDEX idx_active (active)
);
```

#### 2. categorias
```sql
CREATE TABLE categorias (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    udn INT,
    active TINYINT DEFAULT 1,
    fecha_creacion DATETIME,
    INDEX idx_udn (udn)
);
```

#### 3. productos_vendidos
```sql
CREATE TABLE productos_vendidos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    producto_id INT,
    udn INT,
    cantidad DECIMAL(10,2),
    precio_venta DECIMAL(10,2),
    fecha_venta DATE,
    mes INT,
    anio INT,
    folio VARCHAR(50),
    INDEX idx_producto (producto_id),
    INDEX idx_fecha (fecha_venta),
    INDEX idx_periodo (mes, anio)
);
```

#### 4. salidas
```sql
CREATE TABLE salidas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    producto_id INT,
    cantidad DECIMAL(10,2),
    motivo VARCHAR(255),
    udn INT,
    usuario_id INT,
    fecha_salida DATETIME,
    active TINYINT DEFAULT 1,
    INDEX idx_producto (producto_id),
    INDEX idx_fecha (fecha_salida)
);
```

#### 5. costo_potencial
```sql
CREATE TABLE costo_potencial (
    id INT PRIMARY KEY AUTO_INCREMENT,
    receta_id INT,
    udn INT,
    mes INT,
    anio INT,
    desplazamiento DECIMAL(10,2),
    precio_venta DECIMAL(10,2),
    costo DECIMAL(10,2),
    costo_porcentaje DECIMAL(5,2),
    margen_contribucion DECIMAL(10,2),
    ventas_estimadas DECIMAL(10,2),
    costo_estimado DECIMAL(10,2),
    mc_estimado DECIMAL(10,2),
    fecha_costo DATE,
    INDEX idx_receta (receta_id),
    INDEX idx_periodo (mes, anio)
);
```

#### 6. archivos_diarios
```sql
CREATE TABLE archivos_diarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    udn INT,
    fecha DATE,
    folio VARCHAR(50),
    monto_productos_vendidos DECIMAL(10,2),
    monto_ventas_dia DECIMAL(10,2),
    file_productos_vendidos VARCHAR(255),
    file_ventas_dia VARCHAR(255),
    fecha_carga DATETIME,
    INDEX idx_fecha (fecha),
    INDEX idx_udn (udn)
);
```

### Relaciones entre Tablas

```
productos ──┬── categorias (categoria_id)
            ├── udn (udn)
            ├── productos_vendidos (producto_id)
            └── salidas (producto_id)

productos_vendidos ── productos (producto_id)

costo_potencial ── recetas_costsys (receta_id)

archivos_diarios ── udn (udn)
```

## Error Handling

### Estrategia de Manejo de Errores

#### Frontend (JavaScript)

```javascript
// Uso de try-catch en operaciones asíncronas
async editProducto(id) {
    try {
        const request = await useFetch({
            url: this._link,
            data: { opc: "getProducto", id }
        });
        
        if (request.status === 200) {
            // Mostrar formulario con datos
        } else {
            alert({
                icon: "error",
                text: request.message || "Error al obtener producto"
            });
        }
    } catch (error) {
        console.error("Error:", error);
        alert({
            icon: "error",
            text: "Error de conexión con el servidor"
        });
    }
}

// Validación de formularios
this.createForm({
    json: [...],
    success: (response) => {
        if (response.status === 200) {
            alert({ icon: "success", text: response.message });
            this.ls(); // Recargar lista
        } else if (response.status === 409) {
            alert({ icon: "warning", text: response.message });
        } else {
            alert({ icon: "error", text: response.message });
        }
    }
});
```

#### Backend (PHP)

```php
// Estructura estándar de respuesta
function addProducto() {
    $status = 500;
    $message = 'Error al agregar producto';
    $data = null;
    
    try {
        // Validación de entrada
        if (empty($_POST['nombre'])) {
            return [
                'status' => 400,
                'message' => 'El nombre es requerido'
            ];
        }
        
        // Validación de negocio
        $exists = $this->existsProductoByName([$_POST['nombre']]);
        if ($exists) {
            return [
                'status' => 409,
                'message' => 'Ya existe un producto con ese nombre'
            ];
        }
        
        // Operación
        $_POST['fecha_creacion'] = date('Y-m-d H:i:s');
        $create = $this->createProducto($this->util->sql($_POST));
        
        if ($create) {
            $status = 200;
            $message = 'Producto agregado correctamente';
            $data = ['id' => $create];
        }
        
    } catch (Exception $e) {
        error_log("Error en addProducto: " . $e->getMessage());
        $status = 500;
        $message = 'Error interno del servidor';
    }
    
    return [
        'status' => $status,
        'message' => $message,
        'data' => $data
    ];
}
```

### Códigos de Estado HTTP

- **200**: Operación exitosa
- **400**: Datos de entrada inválidos
- **404**: Recurso no encontrado
- **409**: Conflicto (duplicado, violación de regla de negocio)
- **500**: Error interno del servidor

## Testing Strategy

### Niveles de Testing

#### 1. Testing Manual de Funcionalidad

**Objetivo**: Verificar que cada módulo funciona igual que la versión anterior

**Checklist por Módulo**:

**Administración**
- [ ] Seleccionar UDN carga productos correctos
- [ ] Reporte detallado muestra todos los campos
- [ ] Reporte por categoría agrupa correctamente
- [ ] Subir Excel compara productos existentes
- [ ] Subir Excel actualiza productos correctamente
- [ ] Vincular producto con receta funciona
- [ ] Total de productos se actualiza

**Productos Vendidos**
- [ ] Filtros por UDN, mes, año funcionan
- [ ] Consulta Soft Restaurant muestra datos correctos
- [ ] Consulta Costsys muestra datos correctos
- [ ] Consulta Fogaza con categorías funciona
- [ ] Subir a Costo Potencial calcula correctamente
- [ ] Comparar antes de subir muestra diferencias
- [ ] Productos no encontrados se listan
- [ ] Días pendientes se cuentan correctamente

**Salidas**
- [ ] Listar salidas muestra registros
- [ ] Agregar salida guarda correctamente
- [ ] Editar salida actualiza datos
- [ ] Cambiar estado funciona
- [ ] Filtros por fecha funcionan

#### 2. Testing de Integración

**Objetivo**: Verificar comunicación entre capas

**Casos de Prueba**:

```javascript
// Test 1: Flujo completo de agregar producto
1. Frontend: Llenar formulario
2. Frontend: Enviar datos con useFetch()
3. Backend: Recibir en ctrl-administracion.php
4. Backend: Validar en addProducto()
5. Backend: Guardar en mdl con createProducto()
6. Backend: Retornar respuesta JSON
7. Frontend: Mostrar mensaje de éxito
8. Frontend: Recargar lista con ls()

// Test 2: Flujo de subir Excel
1. Frontend: Seleccionar archivo
2. Frontend: Confirmar acción (comparar/subir)
3. Backend: Recibir archivo en ctrl
4. Backend: Procesar Excel con PHPSpreadsheet
5. Backend: Comparar con productos existentes
6. Backend: Insertar/actualizar productos
7. Backend: Retornar resumen
8. Frontend: Mostrar tabla de resultados

// Test 3: Flujo de costo potencial
1. Frontend: Seleccionar mes/año
2. Frontend: Confirmar subir a CP
3. Backend: Obtener desplazamientos
4. Backend: Calcular costo potencial
5. Backend: Actualizar tabla costo_potencial
6. Backend: Retornar productos agregados/no encontrados
7. Frontend: Mostrar en tabs
```

#### 3. Testing de Datos

**Objetivo**: Verificar que las consultas SQL producen los mismos resultados

**Método**:
1. Ejecutar consulta en versión antigua
2. Ejecutar consulta en versión nueva (adaptada a CRUD)
3. Comparar resultados
4. Verificar que sean idénticos

**Ejemplo**:
```php
// Versión antigua
$query = "SELECT * FROM productos WHERE udn = 1 AND active = 1";
$result_old = mysqli_query($conn, $query);

// Versión nueva
$result_new = $this->_Select([
    'table' => $this->bd . 'productos',
    'values' => '*',
    'where' => 'udn = ? AND active = ?',
    'data' => [1, 1]
]);

// Comparar
assert(count($result_old) === count($result_new));
```

#### 4. Testing de Regresión

**Objetivo**: Asegurar que no se rompió funcionalidad existente

**Checklist**:
- [ ] Todos los endpoints responden
- [ ] Todas las consultas retornan datos
- [ ] Todos los formularios validan correctamente
- [ ] Todas las tablas se renderizan
- [ ] Todos los filtros funcionan
- [ ] Todas las exportaciones a Excel funcionan
- [ ] Todas las importaciones de Excel funcionan
- [ ] Todos los cálculos son correctos

### Herramientas de Testing

- **Manual**: Navegador + DevTools
- **API**: Postman para probar endpoints
- **Base de Datos**: MySQL Workbench para verificar consultas
- **Logs**: error_log de PHP para debugging

## Design Decisions and Rationales

### 1. Uso de CoffeeSoft Framework

**Decisión**: Adoptar completamente el framework CoffeeSoft en lugar de crear una solución custom.

**Rationale**:
- Componentes probados y estables
- Consistencia con otros proyectos del ecosistema
- Reducción de código boilerplate
- Facilita mantenimiento futuro
- Documentación disponible

### 2. Preservación de Lógica de Negocio

**Decisión**: No modificar ninguna consulta SQL, cálculo o validación existente, solo adaptar su formato.

**Rationale**:
- Minimiza riesgo de introducir bugs
- Mantiene comportamiento probado en producción
- Facilita validación (comparar resultados)
- Reduce tiempo de testing
- Evita necesidad de re-certificación de usuarios

### 3. Separación por Módulos

**Decisión**: Crear archivos separados (ctrl, mdl, js) para cada módulo principal.

**Rationale**:
- Facilita mantenimiento independiente
- Permite trabajo en paralelo de desarrolladores
- Reduce conflictos en control de versiones
- Mejora organización del código
- Facilita testing unitario

### 4. Componentes Personalizados

**Decisión**: Crear componentes personalizados solo cuando la funcionalidad no existe en CoffeeSoft.

**Rationale**:
- Evita reinventar la rueda
- Mantiene consistencia visual
- Reduce código a mantener
- Aprovecha optimizaciones del framework
- Facilita actualizaciones futuras

### 5. Nomenclatura Estricta

**Decisión**: Aplicar nomenclatura de CoffeeSoft sin excepciones (ls, add, edit, get, status, etc.).

**Rationale**:
- Facilita comprensión del código
- Permite a desarrolladores moverse entre proyectos
- Reduce curva de aprendizaje
- Facilita generación automática de código
- Mejora mantenibilidad a largo plazo

### 6. TailwindCSS para Estilos

**Decisión**: Usar TailwindCSS exclusivamente, eliminar CSS custom donde sea posible.

**Rationale**:
- Consistencia visual con CoffeeSoft
- Reduce tamaño de archivos CSS
- Facilita responsive design
- Mejora velocidad de desarrollo
- Simplifica mantenimiento de estilos

### 7. Estructura de Respuestas JSON

**Decisión**: Mantener estructura de respuestas JSON existente del backend.

**Rationale**:
- Evita cambios en frontend
- Mantiene compatibilidad con integraciones
- Reduce riesgo de errores
- Facilita migración gradual si es necesario
- Simplifica testing

### 8. Manejo de Archivos Excel

**Decisión**: Mantener uso de PHPSpreadsheet para importación/exportación.

**Rationale**:
- Librería probada y estable
- Soporta formatos complejos
- Mantiene funcionalidad existente
- Evita necesidad de cambiar formato de archivos
- Usuarios ya familiarizados con el proceso

## Migration Strategy

### Fase 1: Preparación (Semana 1)
- Crear estructura de carpetas
- Configurar archivos base (index.php, head.php, etc.)
- Instalar dependencias (CoffeeSoft, TailwindCSS)
- Configurar base de datos

### Fase 2: Backend (Semana 2-3)
- Migrar modelos (mdl)
- Migrar controladores (ctrl)
- Probar endpoints uno por uno
- Validar consultas SQL

### Fase 3: Frontend (Semana 4-5)
- Migrar archivos JavaScript
- Crear componentes personalizados
- Implementar layouts
- Conectar con backend

### Fase 4: Testing (Semana 6)
- Testing funcional por módulo
- Testing de integración
- Testing de regresión
- Corrección de bugs

### Fase 5: Documentación (Semana 7)
- Documentar cambios
- Crear guía de migración
- Documentar nuevos componentes
- Preparar capacitación

### Fase 6: Despliegue (Semana 8)
- Despliegue en ambiente de pruebas
- Validación con usuarios
- Correcciones finales
- Despliegue en producción
