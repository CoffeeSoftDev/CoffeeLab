# Design Document

## Overview

Este diseño aborda la corrección del error "Trying to access array offset on value of type null" en el controlador de pedidos. La solución implementa validaciones defensivas y manejo robusto de casos donde los datos de sucursales pueden ser nulos o inválidos.

## Architecture

La solución se implementa en el patrón MVC existente:

- **Modelo (MPedidos)**: Ya existe, no requiere cambios
- **Controlador (Pedidos)**: Se modificará para agregar validaciones
- **Vista**: No requiere cambios, el controlador garantiza datos válidos

### Flujo de Datos

```
Usuario → Request → Pedidos::listOrders() 
    → Validar subsidiaries_id
    → getSucursalByID()
    → Validar resultado
    → Procesar pedidos con datos seguros
    → Retornar respuesta
```

## Components and Interfaces

### 1. Método `listOrders()`

**Modificaciones:**
- Agregar validación de `$_POST['subsidiaries_id']` antes de usar
- Validar que `$Sucursal` no sea null después de `getSucursalByID()`
- Proporcionar valores por defecto si la sucursal no existe

### 2. Función `formatSucursal()`

**Modificaciones:**
- Agregar validación de parámetros de entrada
- Manejar casos donde los parámetros son null o vacíos
- Retornar un folio válido en todos los casos

### 3. Validación de Sesión

**Nuevas validaciones:**
- Verificar existencia de `$_SESSION['ROLID']`
- Verificar existencia de `$_SESSION['SUB']`
- Proporcionar valores por defecto seguros

## Data Models

No se requieren cambios en los modelos de datos. Las estructuras existentes son:

```php
// Sucursal (de la base de datos)
[
    'id' => int,
    'name' => string,
    'sucursal' => string,
    // ... otros campos
]

// Order (de la base de datos)
[
    'id' => int,
    'name_client' => string,
    'phone' => string,
    'discount' => float,
    'total_pay' => float,
    // ... otros campos
]
```


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property Reflection

Después de analizar los criterios de aceptación, identificamos las siguientes propiedades. Algunas propiedades son redundantes:

- Las propiedades 1.1 y 1.5 son esencialmente la misma: prevenir acceso a null
- Las propiedades 2.1 y 2.4 se pueden combinar: garantizar folios válidos
- Las propiedades 2.2 se subsume en las validaciones generales

Propiedades consolidadas:

**Property 1: Null Safety en Acceso a Sucursales**
*Para cualquier* resultado de `getSucursalByID()`, el sistema debe validar que no sea null antes de acceder a sus propiedades como array
**Validates: Requirements 1.1, 1.5**

**Property 2: Valores por Defecto para Sucursales Inválidas**
*Para cualquier* caso donde `getSucursalByID()` retorna null o datos inválidos, el sistema debe utilizar valores por defecto seguros que permitan continuar la operación
**Validates: Requirements 1.2, 2.2**

**Property 3: Folios Siempre Válidos**
*Para cualquier* combinación de parámetros de entrada a `formatSucursal()` (incluyendo null, vacío, o valores válidos), la función debe retornar un string no vacío que represente un folio válido
**Validates: Requirements 2.1, 2.4**

**Property 4: Validación de Parámetros de Entrada**
*Para cualquier* parámetro recibido desde `$_POST` o `$_SESSION`, el sistema debe validar su existencia y tipo antes de usarlo en operaciones críticas
**Validates: Requirements 3.1, 3.2, 3.3**

## Error Handling

### Estrategia de Manejo de Errores

1. **Validación Defensiva**: Verificar todos los valores antes de usarlos
2. **Valores por Defecto**: Proporcionar fallbacks seguros
3. **Logging**: Registrar errores sin interrumpir el flujo
4. **Mensajes Claros**: Informar al usuario cuando sea necesario

### Casos de Error Específicos

```php
// Caso 1: Sucursal no encontrada
if ($Sucursal === null || !is_array($Sucursal)) {
    // Log del error
    error_log("Sucursal no encontrada: ID {$subsidiaries_id}");
    
    // Usar valores por defecto
    $Sucursal = [
        'name' => 'SISTEMA',
        'sucursal' => 'GEN',
        'id' => $subsidiaries_id
    ];
}

// Caso 2: subsidiaries_id inválido
if (empty($_POST['subsidiaries_id'])) {
    $subsidiaries_id = $_SESSION['SUB'] ?? 1;
}

// Caso 3: Variables de sesión faltantes
$rolId = $_SESSION['ROLID'] ?? 0;
$subId = $_SESSION['SUB'] ?? 1;
```

## Testing Strategy

### Unit Testing

Se implementarán tests unitarios para:

1. **Test de Sucursal Null**: Verificar que `listOrders()` maneja correctamente cuando `getSucursalByID()` retorna null
2. **Test de Folio con Parámetros Null**: Verificar que `formatSucursal()` genera un folio válido con parámetros null
3. **Test de Sesión Inválida**: Verificar comportamiento cuando variables de sesión no existen
4. **Test de POST Vacío**: Verificar que se usan valores por defecto cuando `$_POST['subsidiaries_id']` está vacío

### Property-Based Testing

Para este proyecto PHP, utilizaremos **PHPUnit** con generadores personalizados para property-based testing. Cada test de propiedad ejecutará un mínimo de 100 iteraciones.

**Configuración:**
- Framework: PHPUnit 9.x o superior
- Generadores: Implementación personalizada de generadores de datos aleatorios
- Iteraciones: 100 por propiedad

**Property Tests:**

1. **Property Test 1: Null Safety**
   - **Feature: null-array-offset-fix, Property 1: Null Safety en Acceso a Sucursales**
   - Generar: IDs de sucursales aleatorios (válidos e inválidos)
   - Verificar: Nunca se accede a propiedades de null
   - Validar: No se generan errores de tipo "array offset on null"

2. **Property Test 2: Default Values**
   - **Feature: null-array-offset-fix, Property 2: Valores por Defecto para Sucursales Inválidas**
   - Generar: Resultados de getSucursalByID (null, array vacío, array válido)
   - Verificar: Siempre se obtienen valores utilizables
   - Validar: La operación completa sin excepciones

3. **Property Test 3: Valid Folios**
   - **Feature: null-array-offset-fix, Property 3: Folios Siempre Válidos**
   - Generar: Combinaciones aleatorias de parámetros (null, vacío, strings válidos, números)
   - Verificar: formatSucursal() siempre retorna un string no vacío
   - Validar: El folio tiene formato válido (no null, no vacío, es string)

4. **Property Test 4: Input Validation**
   - **Feature: null-array-offset-fix, Property 4: Validación de Parámetros de Entrada**
   - Generar: Arrays de $_POST y $_SESSION con valores aleatorios (null, vacío, válidos)
   - Verificar: Todos los accesos están protegidos
   - Validar: No se generan errores de undefined index

### Integration Testing

No se requieren tests de integración para esta corrección, ya que se enfoca en validaciones locales dentro del controlador.

### Manual Testing

1. Probar listOrders() con usuario admin sin subsidiaries_id en POST
2. Probar listOrders() con subsidiaries_id inválido
3. Verificar que los folios se generan correctamente en todos los casos
4. Verificar logs de errores cuando hay problemas con sucursales
