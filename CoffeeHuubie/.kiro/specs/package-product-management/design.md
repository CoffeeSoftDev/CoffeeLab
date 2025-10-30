# Design Document

## Overview

Este documento describe el diseño técnico para el **Módulo de Gestión de Paquetes y Productos Relacionados** en el sistema de eventos CoffeeSoft. El módulo optimiza el flujo de inserción de paquetes asegurando que los productos relacionados se registren automáticamente en las tablas de control (`evt_package_check` y `evt_check_products`), y proporciona una interfaz visual con checkboxes para gestionar el estado activo/inactivo de cada producto.

## Architecture

### System Context

El módulo se integra en el flujo existente de creación/edición de eventos, específicamente en la función `newMenuLayout()` del archivo `eventos.js`. La arquitectura sigue el patrón MVC de CoffeeSoft:

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (eventos.js)                     │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  newMenuLayout() / editMenuLayout()                    │ │
│  │  - Renderiza interfaz de selección de paquetes        │ │
│  │  - Muestra checkboxes de productos                     │ │
│  │  - Maneja eventos de cambio de estado                  │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                 Controller (ctrl-eventos.php)                │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  addEventMenus() / editEventMenus()                    │ │
│  │  - Procesa inserción de paquetes                       │ │
│  │  - Llama a insertPackageWithProducts()                 │ │
│  │                                                          │ │
│  │  updateProductActive()                                  │ │
│  │  - Actualiza estado de productos individuales          │ │
│  │                                                          │ │
│  │  getProductsCheckByPackage()                            │ │
│  │  - Obtiene productos con su estado actual              │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                   Model (mdl-eventos.php)                    │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  getProductsByPackage($package_id)                     │ │
│  │  insertPackageCheck($events_package_id)                │ │
│  │  insertProductCheck($check_id, $product_id)            │ │
│  │  getProductsCheckByPackage($check_id)                  │ │
│  │  updateProductActive($check_product_id, $active)       │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                        Database Layer                        │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  evt_events_package                                    │ │
│  │  evt_package_check                                     │ │
│  │  evt_check_products                                    │ │
│  │  evt_package_products (relación paquete-producto)      │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Integration Points

1. **Punto de inserción**: Después de crear registros en `evt_events_package` (línea ~850 en ctrl-eventos.php, función `addEventMenus()`)
2. **Punto de visualización**: En la función `showEvent()` del frontend, al mostrar detalles del menú
3. **Punto de actualización**: Evento `onChange` de checkboxes en la interfaz de detalle del menú

## Components and Interfaces

### Frontend Components

#### 1. Checkbox List Component

**Ubicación**: `eventos.js` - Nueva función `renderProductCheckboxList()`

**Propósito**: Renderizar lista de productos con checkboxes interactivos

**Estructura HTML**:
```html
<div class="product-checkbox-list">
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <!-- Platillos -->
    <div class="bg-[#1F2A37] p-4 rounded-lg">
      <h4 class="text-white font-semibold mb-3">Platillos incluidos:</h4>
      <div id="platillos-checkboxes" class="space-y-2">
        <!-- Checkboxes dinámicos -->
      </div>
    </div>
    
    <!-- Bebidas -->
    <div class="bg-[#1F2A37] p-4 rounded-lg">
      <h4 class="text-white font-semibold mb-3">Bebidas incluidas:</h4>
      <div id="bebidas-checkboxes" class="space-y-2">
        <!-- Checkboxes dinámicos -->
      </div>
    </div>
  </div>
</div>
```

**Checkbox Item Template**:
```html
<label class="flex items-center gap-2 cursor-pointer hover:bg-[#283341] p-2 rounded transition">
  <input 
    type="checkbox" 
    class="product-checkbox w-4 h-4" 
    data-check-product-id="{id}"
    data-product-id="{product_id}"
    checked="{active === 1}"
  />
  <span class="text-gray-300 text-sm">{product_name}</span>
</label>
```

#### 2. Event Handlers

**onChange Handler para Checkboxes**:
```javascript
$(document).on('change', '.product-checkbox', async function() {
  const checkProductId = $(this).data('check-product-id');
  const isActive = $(this).is(':checked') ? 1 : 0;
  
  const response = await useFetch({
    url: link,
    data: {
      opc: 'updateProductActive',
      check_product_id: checkProductId,
      active: isActive
    }
  });
  
  if (response.status === 200) {
    // Feedback visual opcional
    $(this).closest('label').addClass('updated-flash');
    setTimeout(() => {
      $(this).closest('label').removeClass('updated-flash');
    }, 300);
  } else {
    // Revertir checkbox en caso de error
    $(this).prop('checked', !isActive);
    alert({ icon: 'error', text: response.message });
  }
});
```

### Backend Components

#### Controller Functions (ctrl-eventos.php)

##### 1. insertPackageWithProducts()

**Propósito**: Orquestar la inserción de paquetes y sus productos relacionados

**Ubicación**: Llamada dentro de `addEventMenus()` después de insertar en `evt_events_package`

**Flujo**:
```php
function insertPackageWithProducts($events_package_id, $package_id) {
    $status = 500;
    $message = 'Error al vincular productos del paquete';
    
    try {
        // 1. Crear registro en evt_package_check
        $check_id = $this->insertPackageCheck($events_package_id);
        
        if (!$check_id) {
            return ['status' => $status, 'message' => 'Error al crear package_check'];
        }
        
        // 2. Obtener productos del paquete
        $products = $this->getProductsByPackage([$package_id]);
        
        if (empty($products)) {
            return ['status' => 200, 'message' => 'Paquete sin productos asociados'];
        }
        
        // 3. Insertar cada producto en evt_check_products
        $inserted = 0;
        foreach ($products as $product) {
            $result = $this->insertProductCheck($check_id, $product['product_id']);
            if ($result) $inserted++;
        }
        
        $status = 200;
        $message = "Se vincularon {$inserted} productos al paquete";
        
    } catch (Exception $e) {
        $message = 'Error: ' . $e->getMessage();
    }
    
    return [
        'status' => $status,
        'message' => $message,
        'check_id' => $check_id ?? null,
        'products_inserted' => $inserted ?? 0
    ];
}
```

##### 2. getProductsCheckByPackage()

**Propósito**: Obtener productos con su estado actual para renderizar checkboxes

```php
function getProductsCheckByPackage() {
    $status = 500;
    $message = 'Error al obtener productos del paquete';
    
    $events_package_id = $_POST['events_package_id'];
    
    // Obtener el check_id asociado
    $check = $this->getPackageCheckByEventPackageId([$events_package_id]);
    
    if (!$check) {
        return ['status' => 404, 'message' => 'No se encontró registro de control'];
    }
    
    $products = $this->listProductsCheckByPackageCheckId([$check['id']]);
    
    if ($products) {
        $status = 200;
        $message = 'Productos obtenidos correctamente';
    }
    
    return [
        'status' => $status,
        'message' => $message,
        'data' => $products
    ];
}
```

##### 3. updateProductActive()

**Propósito**: Actualizar el estado activo/inactivo de un producto

```php
function updateProductActive() {
    $status = 500;
    $message = 'Error al actualizar estado del producto';
    
    $check_product_id = $_POST['check_product_id'];
    $active = $_POST['active'];
    
    // Validar valores
    if (!in_array($active, [0, 1])) {
        return ['status' => 400, 'message' => 'Valor de active inválido'];
    }
    
    $update = $this->updateProductCheckActive($this->util->sql([
        'active' => $active,
        'id' => $check_product_id
    ], 1));
    
    if ($update) {
        $status = 200;
        $message = 'Estado actualizado correctamente';
    }
    
    return [
        'status' => $status,
        'message' => $message
    ];
}
```

#### Model Functions (mdl-eventos.php)

##### 1. getProductsByPackage()

```php
function getProductsByPackage($array) {
    return $this->_Select([
        'table' => "{$this->bd}evt_package_products",
        'values' => 'product_id, quantity',
        'where' => 'package_id = ? AND active = 1',
        'data' => $array
    ]);
}
```

##### 2. insertPackageCheck()

```php
function insertPackageCheck($events_package_id) {
    $data = [
        'events_package_id' => $events_package_id,
        'created_at' => date('Y-m-d H:i:s')
    ];
    
    $result = $this->_Insert([
        'table' => "{$this->bd}evt_package_check",
        'values' => $this->util->sql($data)['values'],
        'data' => $this->util->sql($data)['data']
    ]);
    
    if ($result) {
        return $this->maxPackageCheckId();
    }
    
    return false;
}

function maxPackageCheckId() {
    $result = $this->_Select([
        'table' => "{$this->bd}evt_package_check",
        'values' => 'MAX(id) as max_id'
    ]);
    
    return $result[0]['max_id'] ?? null;
}
```

##### 3. insertProductCheck()

```php
function insertProductCheck($check_id, $product_id) {
    $data = [
        'package_check_id' => $check_id,
        'product_id' => $product_id,
        'active' => 1
    ];
    
    return $this->_Insert([
        'table' => "{$this->bd}evt_check_products",
        'values' => $this->util->sql($data)['values'],
        'data' => $this->util->sql($data)['data']
    ]);
}
```

##### 4. getPackageCheckByEventPackageId()

```php
function getPackageCheckByEventPackageId($array) {
    $result = $this->_Select([
        'table' => "{$this->bd}evt_package_check",
        'values' => 'id, events_package_id, created_at',
        'where' => 'events_package_id = ?',
        'data' => $array
    ]);
    
    return $result[0] ?? null;
}
```

##### 5. listProductsCheckByPackageCheckId()

```php
function listProductsCheckByPackageCheckId($array) {
    $leftjoin = [
        "{$this->bd}evt_products" => 'evt_check_products.product_id = evt_products.id'
    ];
    
    return $this->_Select([
        'table' => "{$this->bd}evt_check_products",
        'values' => 
            "evt_check_products.id as check_product_id,
            evt_check_products.product_id,
            evt_check_products.active,
            evt_products.name as product_name,
            evt_products.id_classification",
        'leftjoin' => $leftjoin,
        'where' => 'evt_check_products.package_check_id = ?',
        'data' => $array
    ]);
}
```

##### 6. updateProductCheckActive()

```php
function updateProductCheckActive($array) {
    return $this->_Update([
        'table' => "{$this->bd}evt_check_products",
        'values' => $array['values'],
        'where' => 'id = ?',
        'data' => $array['data']
    ]);
}
```

## Data Models

### Database Schema

#### evt_package_check

**Propósito**: Tabla de control que vincula un paquete de evento con sus productos seleccionables

```sql
CREATE TABLE evt_package_check (
    id INT PRIMARY KEY AUTO_INCREMENT,
    events_package_id INT NOT NULL,
    created_at DATETIME NOT NULL,
    FOREIGN KEY (events_package_id) REFERENCES evt_events_package(id) ON DELETE CASCADE
);
```

**Índices**:
- PRIMARY KEY: `id`
- FOREIGN KEY: `events_package_id` → `evt_events_package(id)`
- INDEX: `idx_events_package` en `events_package_id` para búsquedas rápidas

#### evt_check_products

**Propósito**: Almacena los productos relacionados con cada paquete y su estado activo/inactivo

```sql
CREATE TABLE evt_check_products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    package_check_id INT NOT NULL,
    product_id INT NOT NULL,
    active TINYINT(1) DEFAULT 1,
    FOREIGN KEY (package_check_id) REFERENCES evt_package_check(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES evt_products(id) ON DELETE CASCADE
);
```

**Índices**:
- PRIMARY KEY: `id`
- FOREIGN KEY: `package_check_id` → `evt_package_check(id)`
- FOREIGN KEY: `product_id` → `evt_products(id)`
- INDEX: `idx_package_check` en `package_check_id`
- UNIQUE INDEX: `unique_check_product` en (`package_check_id`, `product_id`) para evitar duplicados

### Data Flow Diagrams

#### Flujo de Inserción de Paquete

```
Usuario selecciona paquete → Clic en "Agregar Menú"
                                      ↓
                          Frontend: addEventMenus()
                                      ↓
                          POST a ctrl-eventos.php
                                      ↓
                    Controller: addEventMenus() procesa
                                      ↓
                    Inserta en evt_events_package
                                      ↓
                    Llama insertPackageWithProducts()
                                      ↓
              ┌─────────────────────────────────────┐
              │  insertPackageCheck()               │
              │  → Crea registro en                 │
              │    evt_package_check                │
              │  → Retorna check_id                 │
              └─────────────────────────────────────┘
                                      ↓
              ┌─────────────────────────────────────┐
              │  getProductsByPackage()             │
              │  → Consulta productos del paquete   │
              │  → Retorna lista de product_ids     │
              └─────────────────────────────────────┘
                                      ↓
              ┌─────────────────────────────────────┐
              │  Loop: insertProductCheck()         │
              │  → Inserta cada producto en         │
              │    evt_check_products con active=1  │
              └─────────────────────────────────────┘
                                      ↓
                          Retorna respuesta al frontend
                                      ↓
                          Muestra mensaje de éxito
```

#### Flujo de Actualización de Estado de Producto

```
Usuario hace clic en checkbox
                ↓
    onChange event capturado
                ↓
    Obtiene check_product_id y nuevo estado
                ↓
    useFetch() → POST a ctrl-eventos.php
                ↓
    Controller: updateProductActive()
                ↓
    Valida parámetros (active debe ser 0 o 1)
                ↓
    Model: updateProductCheckActive()
                ↓
    UPDATE evt_check_products SET active = ? WHERE id = ?
                ↓
    Retorna status 200 si éxito
                ↓
    Frontend: Feedback visual (flash animation)
```

## Error Handling

### Frontend Error Handling

1. **Validación de datos antes de envío**:
```javascript
if (!checkProductId || ![0, 1].includes(isActive)) {
  console.error('Datos inválidos para actualización');
  return;
}
```

2. **Manejo de respuestas de error**:
```javascript
if (response.status !== 200) {
  // Revertir estado del checkbox
  $(this).prop('checked', !isActive);
  
  // Mostrar mensaje de error
  alert({
    icon: 'error',
    title: 'Error al actualizar',
    text: response.message || 'Ocurrió un error inesperado'
  });
}
```

3. **Timeout para peticiones**:
```javascript
const response = await Promise.race([
  useFetch({ url: link, data: {...} }),
  new Promise((_, reject) => 
    setTimeout(() => reject(new Error('Timeout')), 5000)
  )
]);
```

### Backend Error Handling

1. **Try-Catch en funciones críticas**:
```php
function insertPackageWithProducts($events_package_id, $package_id) {
    try {
        // Lógica de inserción
    } catch (Exception $e) {
        error_log("Error en insertPackageWithProducts: " . $e->getMessage());
        return [
            'status' => 500,
            'message' => 'Error interno del servidor',
            'error' => $e->getMessage()
        ];
    }
}
```

2. **Validación de duplicados**:
```php
function insertProductCheck($check_id, $product_id) {
    // Verificar si ya existe
    $exists = $this->_Select([
        'table' => "{$this->bd}evt_check_products",
        'values' => 'id',
        'where' => 'package_check_id = ? AND product_id = ?',
        'data' => [$check_id, $product_id]
    ]);
    
    if (!empty($exists)) {
        return true; // Ya existe, no insertar duplicado
    }
    
    // Proceder con inserción
    return $this->_Insert([...]);
}
```

3. **Transacciones para operaciones múltiples**:
```php
function insertPackageWithProducts($events_package_id, $package_id) {
    $this->beginTransaction();
    
    try {
        $check_id = $this->insertPackageCheck($events_package_id);
        $products = $this->getProductsByPackage([$package_id]);
        
        foreach ($products as $product) {
            $this->insertProductCheck($check_id, $product['product_id']);
        }
        
        $this->commit();
        return ['status' => 200, 'message' => 'Éxito'];
        
    } catch (Exception $e) {
        $this->rollback();
        return ['status' => 500, 'message' => 'Error: ' . $e->getMessage()];
    }
}
```

## Testing Strategy

### Unit Tests

#### Frontend Tests

1. **Test: renderProductCheckboxList()**
   - Verificar que se renderizan todos los productos
   - Verificar que checkboxes reflejan el estado correcto (active = 1 → checked)
   - Verificar que se aplican las clases CSS correctas

2. **Test: onChange handler**
   - Simular clic en checkbox
   - Verificar que se envía la petición correcta
   - Verificar que se revierte el estado en caso de error

#### Backend Tests

1. **Test: insertPackageCheck()**
   - Insertar registro válido → debe retornar check_id
   - Insertar con events_package_id inválido → debe fallar

2. **Test: insertProductCheck()**
   - Insertar producto nuevo → debe retornar true
   - Insertar producto duplicado → debe manejar correctamente (no duplicar)

3. **Test: updateProductActive()**
   - Actualizar con active = 1 → debe actualizar correctamente
   - Actualizar con active = 2 → debe retornar error de validación

### Integration Tests

1. **Test: Flujo completo de inserción de paquete**
   - Crear evento → Agregar paquete → Verificar que se crearon registros en evt_package_check y evt_check_products
   - Verificar que todos los productos del paquete se insertaron con active = 1

2. **Test: Flujo de actualización de estado**
   - Crear paquete con productos → Cambiar estado de un producto → Verificar que se actualizó en BD
   - Recargar interfaz → Verificar que checkbox refleja el nuevo estado

3. **Test: Edición de menú existente**
   - Editar evento con paquetes → Verificar que no se duplican registros en evt_check_products
   - Verificar que se mantienen los estados personalizados de productos

### Manual Testing Checklist

- [ ] Crear nuevo evento y agregar paquete → Verificar que se muestran todos los productos en la vista de detalle
- [ ] Desmarcar checkbox de un producto → Verificar que se actualiza sin recargar página
- [ ] Recargar página → Verificar que el checkbox sigue desmarcado
- [ ] Editar evento existente → Verificar que se cargan correctamente los estados de productos
- [ ] Agregar múltiples paquetes → Verificar que cada uno tiene su lista de productos independiente
- [ ] Probar con paquete sin productos → Verificar que no genera errores
- [ ] Probar con conexión lenta → Verificar que hay feedback visual durante la actualización

## Performance Considerations

### Database Optimization

1. **Índices estratégicos**:
   - `evt_package_check.events_package_id` → Búsquedas frecuentes
   - `evt_check_products.package_check_id` → JOIN con package_check
   - Índice único compuesto para evitar duplicados

2. **Consultas optimizadas**:
   - Usar LEFT JOIN en lugar de múltiples consultas
   - Limitar campos en SELECT (solo los necesarios)

3. **Batch inserts**:
```php
// En lugar de múltiples INSERT individuales
foreach ($products as $product) {
    $this->insertProductCheck($check_id, $product['product_id']);
}

// Usar INSERT múltiple
$values = [];
foreach ($products as $product) {
    $values[] = "({$check_id}, {$product['product_id']}, 1)";
}
$query = "INSERT INTO evt_check_products (package_check_id, product_id, active) 
          VALUES " . implode(', ', $values);
```

### Frontend Optimization

1. **Debounce para actualizaciones**:
```javascript
let updateTimeout;
$(document).on('change', '.product-checkbox', function() {
  clearTimeout(updateTimeout);
  updateTimeout = setTimeout(() => {
    // Realizar actualización
  }, 300);
});
```

2. **Lazy loading de detalles**:
   - Cargar checkboxes solo cuando se abre el detalle del menú
   - No cargar todos los productos de todos los paquetes al inicio

3. **Caché de clasificaciones**:
   - Almacenar clasificaciones en variable global para evitar consultas repetidas

## Security Considerations

1. **Validación de entrada**:
```php
// Validar que active solo puede ser 0 o 1
if (!in_array($_POST['active'], [0, 1], true)) {
    return ['status' => 400, 'message' => 'Valor inválido'];
}

// Validar que check_product_id es numérico
if (!is_numeric($_POST['check_product_id'])) {
    return ['status' => 400, 'message' => 'ID inválido'];
}
```

2. **Prevención de SQL Injection**:
   - Usar prepared statements (ya implementado en clase CRUD)
   - Nunca concatenar valores directamente en queries

3. **Autorización**:
```php
// Verificar que el usuario tiene permiso para modificar este evento
$event = $this->getEventById([$event_id]);
if ($event['subsidiaries_id'] != $_SESSION['SUB']) {
    return ['status' => 403, 'message' => 'No autorizado'];
}
```

4. **Sanitización de salida**:
```javascript
// Escapar nombres de productos al renderizar
const productName = $('<div>').text(product.name).html();
```

## Migration Strategy

### Database Migration

```sql
-- Crear tabla evt_package_check
CREATE TABLE IF NOT EXISTS evt_package_check (
    id INT PRIMARY KEY AUTO_INCREMENT,
    events_package_id INT NOT NULL,
    created_at DATETIME NOT NULL,
    FOREIGN KEY (events_package_id) REFERENCES evt_events_package(id) ON DELETE CASCADE,
    INDEX idx_events_package (events_package_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Crear tabla evt_check_products
CREATE TABLE IF NOT EXISTS evt_check_products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    package_check_id INT NOT NULL,
    product_id INT NOT NULL,
    active TINYINT(1) DEFAULT 1,
    FOREIGN KEY (package_check_id) REFERENCES evt_package_check(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES evt_products(id) ON DELETE CASCADE,
    INDEX idx_package_check (package_check_id),
    UNIQUE KEY unique_check_product (package_check_id, product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Migrar datos existentes (si aplica)
-- Crear registros en evt_package_check para paquetes existentes
INSERT INTO evt_package_check (events_package_id, created_at)
SELECT id, date_creation FROM evt_events_package
WHERE id NOT IN (SELECT events_package_id FROM evt_package_check);

-- Crear registros en evt_check_products para productos de paquetes existentes
INSERT INTO evt_check_products (package_check_id, product_id, active)
SELECT 
    pc.id as package_check_id,
    pp.product_id,
    1 as active
FROM evt_package_check pc
INNER JOIN evt_events_package ep ON pc.events_package_id = ep.id
INNER JOIN evt_package_products pp ON ep.package_id = pp.package_id
WHERE NOT EXISTS (
    SELECT 1 FROM evt_check_products cp 
    WHERE cp.package_check_id = pc.id AND cp.product_id = pp.product_id
);
```

### Deployment Steps

1. **Fase 1: Preparación**
   - Backup de base de datos
   - Ejecutar scripts de migración en entorno de desarrollo
   - Verificar integridad de datos

2. **Fase 2: Backend**
   - Agregar funciones al modelo (mdl-eventos.php)
   - Agregar funciones al controlador (ctrl-eventos.php)
   - Probar endpoints con Postman/curl

3. **Fase 3: Frontend**
   - Agregar función `renderProductCheckboxList()` a eventos.js
   - Integrar en `showEvent()` para visualización
   - Agregar event handlers para checkboxes

4. **Fase 4: Testing**
   - Ejecutar suite de pruebas
   - Realizar pruebas manuales
   - Verificar performance

5. **Fase 5: Producción**
   - Desplegar en horario de bajo tráfico
   - Monitorear logs de errores
   - Verificar funcionalidad con usuarios piloto

## Future Enhancements

1. **Bulk operations**: Permitir seleccionar/deseleccionar todos los productos de una categoría
2. **Historial de cambios**: Registrar quién y cuándo modificó el estado de productos
3. **Productos opcionales vs obligatorios**: Agregar campo para distinguir productos que no se pueden desactivar
4. **Notificaciones**: Alertar al usuario si desactiva productos críticos del paquete
5. **Reportes**: Dashboard con estadísticas de productos más/menos seleccionados
