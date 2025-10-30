# Design Document

## Overview

El módulo de gestión de paquetes de eventos implementa un sistema de vinculación automática entre eventos, paquetes de menú y productos. El diseño se basa en una arquitectura MVC (Modelo-Vista-Controlador) siguiendo los estándares de CoffeeSoft, con énfasis en la integridad transaccional y la reutilización de código.

### Objetivos del Diseño

- Automatizar la vinculación de productos cuando se agrega un paquete a un evento
- Garantizar la consistencia de datos mediante transacciones
- Proporcionar métodos reutilizables en el modelo para operaciones comunes
- Mantener la compatibilidad con el sistema existente de eventos

## Architecture

### Database Schema

El sistema utiliza las siguientes tablas principales:

```
evt_events (Eventos)
├── id (PK)
├── name_event
├── date_start
├── date_end
└── ...

evt_package (Paquetes de menú)
├── id (PK)
├── name
├── description
├── price_person
└── ...

evt_events_package (Relación Evento-Paquete)
├── id (PK) [idPackage]
├── event_id (FK → evt_events.id)
├── package_id (FK → evt_package.id)
├── quantity
├── price
└── date_creation

evt_package_products (Productos del paquete)
├── id (PK)
├── package_id (FK → evt_package.id)
├── products_id (FK → evt_products.id)
├── quantity
└── ...

evt_package_check (Verificación de paquete)
├── id (PK)
├── events_package_id (FK → evt_events_package.id)
├── created_at
└── ...

evt_check_products (Productos a verificar)
├── id (PK)
├── package_check_id (FK → evt_package_check.id)
├── product_id (FK → evt_products.id)
└── active
```

### Flujo de Datos

```
1. Usuario agrega paquete al evento
   ↓
2. Sistema crea registro en evt_events_package
   ↓
3. Sistema obtiene idPackage (MAX id)
   ↓
4. Sistema crea registro en evt_package_check
   ↓
5. Sistema obtiene package_check_id
   ↓
6. Sistema consulta productos del paquete
   ↓
7. Sistema inserta cada producto en evt_check_products
   ↓
8. Sistema confirma transacción (COMMIT)
```

## Components and Interfaces

### 1. Modelo (mdl-eventos.php)

#### Método Principal: `insertPackageWithProducts`

**Propósito:** Vincular un paquete de evento con todos sus productos en las tablas de verificación.

**Firma:**
```php
function insertPackageWithProducts($events_package_id, $package_id)
```

**Parámetros:**
- `$events_package_id` (int): ID del registro en evt_events_package
- `$package_id` (int): ID del paquete en evt_package

**Retorno:**
```php
[
    'status' => 200|500,
    'message' => string,
    'data' => [
        'package_check_id' => int,
        'products_inserted' => int
    ]
]
```

**Lógica Interna:**

1. **Validación de paquete:**
   - Verificar que `package_id` existe en `evt_package`
   - Si no existe, retornar error 404

2. **Inicio de transacción:**
   - Ejecutar `BEGIN TRANSACTION`

3. **Crear registro de verificación:**
   - Insertar en `evt_package_check`:
     ```php
     [
         'events_package_id' => $events_package_id,
         'created_at' => date('Y-m-d H:i:s')
     ]
     ```
   - Obtener `package_check_id` mediante `maxPackageCheckId()`

4. **Consultar productos del paquete:**
   - Ejecutar `getProductsByPackage($package_id)`
   - Retorna: `[{product_id, quantity}, ...]`

5. **Insertar productos en verificación:**
   - Para cada producto:
     ```php
     [
         'package_check_id' => $package_check_id,
         'product_id' => $product['product_id'],
         'active' => 1
     ]
     ```
   - Usar método `insertProductCheck()`

6. **Confirmar transacción:**
   - Si todo OK: `COMMIT`
   - Si error: `ROLLBACK` y retornar error 500

#### Métodos Auxiliares

**`getProductsByPackage($package_id)`**
```php
// Consulta productos activos de un paquete
SELECT products_id as product_id, quantity
FROM evt_package_products
WHERE package_id = ? AND active = 1
```

**`insertPackageCheck($events_package_id)`**
```php
// Crea registro en evt_package_check
// Retorna: package_check_id o false
```

**`maxPackageCheckId()`**
```php
// Obtiene el último ID insertado
SELECT MAX(id) as max_id FROM evt_package_check
```

**`insertProductCheck($check_id, $product_id)`**
```php
// Inserta producto en evt_check_products
// Valida duplicados antes de insertar
```

**`getPackageCheckByEventPackageId($events_package_id)`**
```php
// Consulta registro de verificación existente
SELECT id, events_package_id, created_at
FROM evt_package_check
WHERE events_package_id = ?
```

**`listProductsCheckByPackageCheckId($package_check_id)`**
```php
// Lista productos de una verificación
SELECT 
    cp.id as check_product_id,
    cp.product_id,
    cp.active,
    p.name as product_name
FROM evt_check_products cp
LEFT JOIN evt_products p ON cp.product_id = p.id
WHERE cp.package_check_id = ?
```

### 2. Controlador (ctrl-eventos.php)

#### Modificación en `addEventMenus()`

**Ubicación:** Después de insertar en `evt_events_package`

**Código a agregar:**
```php
if ($addEventPackage == true) {
    $success = true;
    
    // Vincular productos del paquete
    foreach ($menus as $menu) {
        $package_id = $menu['menu']['id'];
        $events_package_id = $this->maxEventPackageId();
        
        $result = $this->insertPackageWithProducts($events_package_id, $package_id);
        
        if ($result['status'] !== 200) {
            error_log("Error al vincular productos: " . $result['message']);
        }
    }
}
```

#### Modificación en `editEventMenus()`

**Ubicación:** Después de insertar en `evt_events_package`

**Código a agregar:**
```php
if ($addEventPackage == true) {
    $success = true;
    
    // Vincular productos del paquete en edición
    foreach ($menus as $menu) {
        $package_id = $menu['menu']['id'];
        $events_package_id = $this->maxEventPackageId();
        
        $result = $this->insertPackageWithProducts($events_package_id, $package_id);
        
        if ($result['status'] !== 200) {
            error_log("Error al vincular productos en edición: " . $result['message']);
        }
    }
}
```

### 3. Frontend (eventos.js)

#### Nuevo Método: `renderProductCheckboxList`

**Propósito:** Renderizar lista de productos con checkboxes para verificación.

**Firma:**
```javascript
renderProductCheckboxList(events_package_id, containerId)
```

**Implementación:**
```javascript
async renderProductCheckboxList(events_package_id, containerId) {
    const response = await useFetch({
        url: this._link,
        data: { 
            opc: "getProductsCheck", 
            events_package_id: events_package_id 
        }
    });
    
    if (response.status !== 200) {
        $(`#${containerId}`).html('<p class="text-red-500">Error al cargar productos</p>');
        return;
    }
    
    const products = response.data;
    let html = '<div class="mt-3"><h4 class="text-sm font-semibold mb-2">Productos del paquete:</h4>';
    
    products.forEach(product => {
        const checked = product.active == 1 ? 'checked' : '';
        html += `
            <div class="flex items-center gap-2 mb-2">
                <input 
                    type="checkbox" 
                    id="product-${product.check_product_id}" 
                    ${checked}
                    onchange="eventos.toggleProductCheck(${product.check_product_id}, this.checked)"
                />
                <label for="product-${product.check_product_id}" class="text-sm">
                    ${product.product_name}
                </label>
            </div>
        `;
    });
    
    html += '</div>';
    $(`#${containerId}`).html(html);
}
```

#### Nuevo Método: `toggleProductCheck`

**Propósito:** Actualizar estado de verificación de un producto.

**Firma:**
```javascript
toggleProductCheck(check_product_id, isChecked)
```

**Implementación:**
```javascript
async toggleProductCheck(check_product_id, isChecked) {
    const response = await useFetch({
        url: this._link,
        data: {
            opc: "updateProductCheck",
            id: check_product_id,
            active: isChecked ? 1 : 0
        }
    });
    
    if (response.status !== 200) {
        alert({ 
            icon: "error", 
            text: "Error al actualizar el producto" 
        });
    }
}
```

#### Nuevo Endpoint en Controlador: `getProductsCheck`

```php
function getProductsCheck() {
    $status = 500;
    $message = 'Error al obtener productos';
    
    $events_package_id = $_POST['events_package_id'];
    
    // Obtener package_check_id
    $packageCheck = $this->getPackageCheckByEventPackageId([$events_package_id]);
    
    if (!$packageCheck) {
        return [
            'status' => 404,
            'message' => 'No se encontró verificación para este paquete',
            'data' => []
        ];
    }
    
    $products = $this->listProductsCheckByPackageCheckId([$packageCheck['id']]);
    
    return [
        'status' => 200,
        'message' => 'Productos obtenidos correctamente',
        'data' => $products
    ];
}
```

#### Nuevo Endpoint en Controlador: `updateProductCheck`

```php
function updateProductCheck() {
    $status = 500;
    $message = 'Error al actualizar producto';
    
    $update = $this->updateProductCheckActive($this->util->sql($_POST, 1));
    
    if ($update) {
        $status = 200;
        $message = 'Producto actualizado correctamente';
    }
    
    return [
        'status' => $status,
        'message' => $message
    ];
}
```

## Data Models

### EventPackage Model

```php
[
    'id' => int,                    // idPackage
    'event_id' => int,              // FK a evt_events
    'package_id' => int,            // FK a evt_package
    'quantity' => int,              // Cantidad de personas
    'price' => float,               // Precio total
    'date_creation' => datetime     // Fecha de creación
]
```

### PackageCheck Model

```php
[
    'id' => int,                    // package_check_id
    'events_package_id' => int,     // FK a evt_events_package
    'created_at' => datetime        // Fecha de creación
]
```

### CheckProduct Model

```php
[
    'id' => int,                    // check_product_id
    'package_check_id' => int,      // FK a evt_package_check
    'product_id' => int,            // FK a evt_products
    'active' => int                 // 0 o 1 (verificado)
]
```

## Error Handling

### Códigos de Error

| Código | Descripción | Acción |
|--------|-------------|--------|
| 200 | Operación exitosa | Retornar datos |
| 404 | Paquete no encontrado | Retornar mensaje descriptivo |
| 500 | Error de servidor/BD | ROLLBACK y retornar error |

### Manejo de Excepciones

```php
try {
    // Inicio de transacción
    $this->db->begin_transaction();
    
    // Operaciones...
    
    // Confirmar
    $this->db->commit();
    
    return ['status' => 200, 'message' => 'Éxito'];
    
} catch (Exception $e) {
    // Revertir cambios
    $this->db->rollback();
    
    // Registrar error
    error_log("Error en insertPackageWithProducts: " . $e->getMessage());
    
    return [
        'status' => 500, 
        'message' => 'Error al procesar: ' . $e->getMessage()
    ];
}
```

### Validaciones

1. **Validación de paquete existente:**
```php
$package = $this->_Select([
    'table' => "{$this->bd}evt_package",
    'values' => 'id',
    'where' => 'id = ?',
    'data' => [$package_id]
]);

if (empty($package)) {
    return [
        'status' => 404,
        'message' => 'Paquete no encontrado'
    ];
}
```

2. **Validación de duplicados:**
```php
$exists = $this->_Select([
    'table' => "{$this->bd}evt_check_products",
    'values' => 'id',
    'where' => 'package_check_id = ? AND product_id = ?',
    'data' => [$check_id, $product_id]
]);

if (!empty($exists)) {
    return true; // Ya existe, no insertar
}
```

## Testing Strategy

### Unit Tests

1. **Test: insertPackageWithProducts - Caso exitoso**
   - Input: `events_package_id=1, package_id=1`
   - Expected: `status=200, package_check_id creado, productos insertados`

2. **Test: insertPackageWithProducts - Paquete no existe**
   - Input: `events_package_id=1, package_id=999`
   - Expected: `status=404, message='Paquete no encontrado'`

3. **Test: insertPackageWithProducts - Error en transacción**
   - Input: `events_package_id=1, package_id=1` (simular error BD)
   - Expected: `status=500, ROLLBACK ejecutado`

4. **Test: getProductsByPackage**
   - Input: `package_id=1`
   - Expected: Array de productos con `product_id` y `quantity`

5. **Test: insertProductCheck - Duplicado**
   - Input: `check_id=1, product_id=1` (ya existe)
   - Expected: `true` (no insertar duplicado)

### Integration Tests

1. **Test: Flujo completo de agregar paquete**
   - Crear evento
   - Agregar paquete al evento
   - Verificar registro en `evt_events_package`
   - Verificar registro en `evt_package_check`
   - Verificar productos en `evt_check_products`

2. **Test: Editar menú de evento**
   - Crear evento con paquete
   - Editar menú (eliminar y agregar nuevo paquete)
   - Verificar que se eliminan registros antiguos
   - Verificar que se crean nuevos registros

### Manual Testing

1. **Escenario: Agregar paquete desde interfaz**
   - Navegar a crear evento
   - Agregar paquete de menú
   - Verificar que aparecen checkboxes de productos
   - Marcar/desmarcar productos
   - Guardar evento
   - Verificar en base de datos

2. **Escenario: Ver evento con paquetes**
   - Abrir evento existente
   - Verificar que se muestran paquetes
   - Verificar que se muestran productos con estado correcto

## Performance Considerations

### Optimizaciones

1. **Batch Insert:** Usar inserción múltiple para productos
```php
// En lugar de múltiples INSERT individuales
foreach ($products as $product) {
    $this->_Insert(...);
}

// Usar inserción múltiple
$this->_Insert([
    'table' => 'evt_check_products',
    'values' => ['package_check_id', 'product_id', 'active'],
    'data' => $productsArray // Array de arrays
]);
```

2. **Índices de base de datos:**
```sql
CREATE INDEX idx_events_package_id ON evt_package_check(events_package_id);
CREATE INDEX idx_package_check_id ON evt_check_products(package_check_id);
CREATE INDEX idx_product_id ON evt_check_products(product_id);
```

3. **Caché de consultas frecuentes:**
```php
// Cachear lista de productos de paquetes populares
$cacheKey = "package_products_{$package_id}";
$products = $this->cache->get($cacheKey);

if (!$products) {
    $products = $this->getProductsByPackage([$package_id]);
    $this->cache->set($cacheKey, $products, 3600); // 1 hora
}
```

## Security Considerations

1. **Validación de entrada:**
```php
$events_package_id = filter_var($_POST['events_package_id'], FILTER_VALIDATE_INT);
$package_id = filter_var($_POST['package_id'], FILTER_VALIDATE_INT);

if (!$events_package_id || !$package_id) {
    return ['status' => 400, 'message' => 'Parámetros inválidos'];
}
```

2. **Prepared Statements:** Ya implementado en clase CRUD

3. **Validación de permisos:**
```php
// Verificar que el usuario tiene acceso al evento
$event = $this->getEventById([$event_id]);
if ($event['subsidiaries_id'] !== $_SESSION['SUB']) {
    return ['status' => 403, 'message' => 'Acceso denegado'];
}
```
