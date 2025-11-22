# Design Document

## Overview

Esta funcionalidad agrega contadores de órdenes por estado al ticket de cierre diario. La solución extiende la lógica existente de `getDailyClose()` y `ticketDailyClose()` para incluir tres nuevos campos: número de cotizaciones, número de cancelados y número de pendientes.

La implementación es mínima y no invasiva, agregando solo las consultas necesarias en el backend y los elementos de visualización en el frontend, manteniendo la estructura y estilo actual del ticket.

## Architecture

La solución involucra dos componentes principales:

1. **Backend (PHP)**: Extender el método `getDailySalesMetrics()` en `mdl-pedidos.php` para incluir contadores por estado
2. **Frontend (JavaScript)**: Actualizar el método `ticketDailyClose()` en `app.js` para renderizar los nuevos contadores

El flujo de datos es:
```
Usuario selecciona fecha/sucursal → viewDailyClose() → getDailyClose() (backend) 
→ getDailySalesMetrics() (consulta DB) → Retorna datos + contadores 
→ ticketDailyClose() → Renderiza ticket con contadores
```

## Components and Interfaces

### Backend Component

**File**: `pedidos/mdl/mdl-pedidos.php`

**Method**: `getDailySalesMetrics()`

**Current behavior**: 
- Consulta órdenes del día filtradas por fecha y sucursal
- Excluye órdenes canceladas (status != 4) y cotizaciones (status != 1)
- Retorna total de ventas y métodos de pago

**New behavior**:
- Mantiene la lógica actual para ventas
- Agrega tres consultas adicionales para contar órdenes por estado
- Retorna los contadores en el array de respuesta

**Interface Changes**:
```php
// Respuesta actual
return [
    'total_orders'   => $ordersData['total_orders'],
    'total_sales'    => $ordersData['total_sales'],
    'card_sales'     => $card_sales,
    'cash_sales'     => $cash_sales,
    'transfer_sales' => $transfer_sales
];

// Nueva respuesta (agregando campos)
return [
    'total_orders'      => $ordersData['total_orders'],
    'total_sales'       => $ordersData['total_sales'],
    'card_sales'        => $card_sales,
    'cash_sales'        => $cash_sales,
    'transfer_sales'    => $transfer_sales,
    'quotation_count'   => $quotation_count,    // NUEVO
    'cancelled_count'   => $cancelled_count,    // NUEVO
    'pending_count'     => $pending_count       // NUEVO
];
```

### Frontend Component

**File**: `pedidos/src/js/app.js`

**Method**: `ticketDailyClose()`

**Current behavior**:
- Recibe datos del backend
- Renderiza ticket con métodos de pago y total de órdenes
- Muestra información de sucursal

**New behavior**:
- Mantiene la lógica actual
- Agrega sección de contadores de estado después del número de pedidos
- Usa el mismo estilo visual del ticket existente

**Interface Changes**:
```javascript
// Datos actuales recibidos
const d = {
    total_sales: 0,
    card_sales: 0,
    cash_sales: 0,
    transfer_sales: 0,
    total_orders: 0
};

// Nuevos datos (agregando campos)
const d = {
    total_sales: 0,
    card_sales: 0,
    cash_sales: 0,
    transfer_sales: 0,
    total_orders: 0,
    quotation_count: 0,   // NUEVO
    cancelled_count: 0,   // NUEVO
    pending_count: 0      // NUEVO
};
```

## Data Models

### Database Query Pattern

Las consultas seguirán el mismo patrón que la consulta existente de órdenes:

```sql
SELECT COUNT(*) as count
FROM fayxzvov_coffee.order
WHERE DATE_FORMAT(date_order, '%Y-%m-%d') = ?
  AND status = ?
  [AND subsidiaries_id = ?]  -- Condicional según filtro
```

### Response Data Structure

```javascript
{
    status: 200,
    message: "Resumen obtenido correctamente",
    data: {
        total_sales: 15000.00,
        card_sales: 8000.00,
        cash_sales: 5000.00,
        transfer_sales: 2000.00,
        total_orders: 25,
        quotation_count: 5,      // Órdenes con status = 1
        cancelled_count: 2,      // Órdenes con status = 4
        pending_count: 8,        // Órdenes con status = 2
        subsidiary_name: "Sucursal Centro",
        is_all_subsidiaries: false
    }
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Acceptance Criteria Testing Prework

1.1 WHEN the system queries daily close data THEN the system SHALL count orders with status equal to 1 (cotización)
Thoughts: This is a rule that should apply to all daily close queries. We can test by creating random dates and subsidiary filters, querying the system, and verifying the count matches a direct database query for status = 1.
Testable: yes - property

1.2 WHEN the ticket is rendered THEN the system SHALL display the count of quotation orders with the label "COTIZACIONES"
Thoughts: This is about the rendering output. We can test by generating random data, calling the render function, and checking that the output HTML contains both the label "COTIZACIONES" and the count value.
Testable: yes - property

1.3 WHEN there are no quotation orders THEN the system SHALL display zero as the count
Thoughts: This is an edge case for when the count is zero. This will be handled by the property testing generator.
Testable: edge-case

2.1 WHEN the system queries daily close data THEN the system SHALL count orders with status equal to 4 (cancelado)
Thoughts: Similar to 1.1, this is a rule for all queries. We can test with random inputs and verify against direct database queries.
Testable: yes - property

2.2 WHEN the ticket is rendered THEN the system SHALL display the count of cancelled orders with the label "CANCELADOS"
Thoughts: Similar to 1.2, testing the rendering output for cancelled orders.
Testable: yes - property

2.3 WHEN there are no cancelled orders THEN the system SHALL display zero as the count
Thoughts: Edge case for zero count, handled by generator.
Testable: edge-case

3.1 WHEN the system queries daily close data THEN the system SHALL count orders with status equal to 2 (pendiente)
Thoughts: Similar to 1.1 and 2.1, testing count accuracy for pending orders.
Testable: yes - property

3.2 WHEN the ticket is rendered THEN the system SHALL display the count of pending orders with the label "PENDIENTES"
Thoughts: Similar to 1.2 and 2.2, testing rendering for pending orders.
Testable: yes - property

3.3 WHEN there are no pending orders THEN the system SHALL display zero as the count
Thoughts: Edge case for zero count, handled by generator.
Testable: edge-case

4.1 WHEN a specific subsidiary is selected THEN the system SHALL count only orders belonging to that subsidiary
Thoughts: This is a filtering rule that should apply to all subsidiary selections. We can test by creating orders in different subsidiaries, querying with a specific subsidiary filter, and verifying only that subsidiary's orders are counted.
Testable: yes - property

4.2 WHEN "all subsidiaries" mode is active THEN the system SHALL count orders from all subsidiaries
Thoughts: This is the inverse of 4.1. We can test by creating orders in multiple subsidiaries, querying with subsidiaries_id = 0, and verifying all orders are counted.
Testable: yes - property

4.3 WHEN the date filter changes THEN the system SHALL recalculate counts for the new date range
Thoughts: This is about temporal filtering. We can test by creating orders on different dates, querying with different date filters, and verifying counts match the filtered date.
Testable: yes - property

### Property Reflection

After reviewing all properties:

**Redundancies identified:**
- Properties 1.1, 2.1, and 3.1 can be combined into a single comprehensive property: "Status count accuracy"
- Properties 1.2, 2.2, and 3.2 can be combined into: "Status label rendering"
- Properties 4.1 and 4.2 can be combined into: "Subsidiary filtering"

**Consolidated properties:**

**Property 1: Status count accuracy**
*For any* date, subsidiary filter, and status value (1, 2, or 4), the count returned by getDailySalesMetrics should equal the count from a direct database query with the same filters
**Validates: Requirements 1.1, 2.1, 3.1**

**Property 2: Status label rendering**
*For any* daily close data with status counts, the rendered ticket HTML should contain the labels "COTIZACIONES", "CANCELADOS", and "PENDIENTES" along with their respective count values
**Validates: Requirements 1.2, 2.2, 3.2**

**Property 3: Subsidiary filtering consistency**
*For any* date and subsidiary selection (specific or all), the status counts should only include orders matching the subsidiary filter
**Validates: Requirements 4.1, 4.2**

**Property 4: Date filtering consistency**
*For any* two different dates, querying daily close data for each date should return different counts if the orders differ between those dates
**Validates: Requirements 4.3**

## Error Handling

La implementación seguirá el patrón de manejo de errores existente:

1. **Database Query Errors**: Si las consultas fallan, los contadores se inicializarán en 0
2. **Missing Data**: Si no hay datos para la fecha/sucursal, se retornará status 404 con contadores en 0
3. **Invalid Status**: No se requiere validación adicional ya que los status son constantes en el sistema

```php
// Patrón de manejo de errores
$quotation_count = 0;
$cancelled_count = 0;
$pending_count = 0;

$quotations = $this->_Read($queryQuotations, $paramsQuotations);
if (is_array($quotations) && !empty($quotations)) {
    $quotation_count = $quotations[0]['count'];
}
// Similar para cancelled y pending
```

## Testing Strategy

### Unit Testing

Unit tests cubrirán:

1. **Backend - getDailySalesMetrics()**:
   - Verificar que retorna los tres nuevos campos
   - Verificar que los contadores son numéricos
   - Verificar comportamiento con fecha sin órdenes

2. **Frontend - ticketDailyClose()**:
   - Verificar que renderiza las tres nuevas líneas
   - Verificar formato de las etiquetas
   - Verificar que maneja valores undefined/null

### Property-Based Testing

Se utilizará PHPUnit con generadores aleatorios para PHP y fast-check para JavaScript.

**Property tests incluirán:**

1. **Property 1: Status count accuracy** - Generar fechas y filtros aleatorios, verificar que los contadores coincidan con consultas directas
2. **Property 2: Status label rendering** - Generar datos aleatorios, verificar que el HTML contiene las etiquetas y valores correctos
3. **Property 3: Subsidiary filtering consistency** - Generar órdenes en múltiples sucursales, verificar que el filtro funciona correctamente
4. **Property 4: Date filtering consistency** - Generar órdenes en diferentes fechas, verificar que el filtro temporal funciona

Cada property test ejecutará un mínimo de 100 iteraciones con datos aleatorios.

## Implementation Notes

1. **No modificar lógica existente**: Los cambios solo agregan funcionalidad, no modifican el comportamiento actual
2. **Mantener estilo visual**: Los nuevos elementos seguirán el mismo diseño del ticket actual
3. **Posición en el ticket**: Los contadores se mostrarán después del "NÚMERO DE PEDIDOS" y antes del footer
4. **Performance**: Las tres consultas adicionales son simples COUNT queries con índices en date_order y status
