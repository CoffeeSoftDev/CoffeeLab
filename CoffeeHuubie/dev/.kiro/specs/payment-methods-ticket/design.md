# Design Document

## Overview

Esta funcionalidad integra los métodos de pago reales de un pedido en el ticket de impresión. La solución aprovecha el método existente `getMethodPayment` del modelo para consultar los pagos agrupados por método, y modifica mínimamente el controlador y la aplicación frontend para pasar estos datos reales en lugar de valores hardcodeados.

El diseño mantiene la arquitectura actual del sistema sin cambios estructurales, agregando solo una consulta adicional en el backend y reemplazando datos estáticos en el frontend.

## Architecture

### Flujo de Datos

```
Usuario solicita imprimir ticket
    ↓
Frontend: printOrder(id) en app.js
    ↓
Backend: getOrderDetails() en ctrl-pedidos.php
    ↓
Modelo: getMethodPayment([orderId]) en mdl-pedidos.php
    ↓
Base de datos: Consulta order_payments + method_pay
    ↓
Backend: Agrega paymentMethods a la respuesta
    ↓
Frontend: Pasa datos reales a ticketPasteleria()
    ↓
Renderiza ticket con métodos de pago reales
```

### Componentes Involucrados

1. **Backend Controller** (`pedidos/ctrl/ctrl-pedidos.php`)
   - Método: `getOrderDetails()`
   - Responsabilidad: Agregar consulta de métodos de pago

2. **Backend Model** (`pedidos/mdl/mdl-pedidos.php`)
   - Método existente: `getMethodPayment($array)`
   - Responsabilidad: Consultar y agrupar pagos por método

3. **Frontend App** (`pedidos/src/js/app.js`)
   - Método: `printOrder(id)`
   - Responsabilidad: Pasar datos reales a ticketPasteleria

## Components and Interfaces

### Backend Controller Modification

**Archivo:** `pedidos/ctrl/ctrl-pedidos.php`

**Método:** `getOrderDetails()`

**Cambios:**
- Agregar llamada a `$this->getMethodPayment([$orderId])` después de obtener los productos
- Incluir el resultado en el array `$data` con la clave `paymentMethods`
- Manejar el caso cuando no hay métodos de pago (retornar array vacío)

**Ubicación de la modificación:**
Después de la línea donde se obtienen los productos (`$products = $this->getOrderById([$orderId]);`), agregar:

```php
// Obtener métodos de pago del pedido
$paymentMethods = $this->getMethodPayment([$orderId]);
if ($paymentMethods === null || !is_array($paymentMethods)) {
    $paymentMethods = [];
}
```

Luego, en el array `$data`, agregar:

```php
'paymentMethods' => $paymentMethods
```

### Frontend App Modification

**Archivo:** `pedidos/src/js/app.js`

**Método:** `printOrder(id)`

**Cambios:**
- Reemplazar el array hardcodeado de `paymentMethods` con `pos.data.paymentMethods`

**Ubicación de la modificación:**
En la llamada a `normal.ticketPasteleria()`, cambiar:

```javascript
paymentMethods: [
    { method_pay: "Tarjeta", pay: 200 },
    { method_pay: "Efectivo", pay: 100 }
]
```

Por:

```javascript
paymentMethods: pos.data.paymentMethods || []
```

## Data Models

### Estructura de Respuesta del Backend

**Método:** `getOrderDetails()`

**Respuesta actual:**
```php
[
    'status' => 200,
    'message' => 'Detalles obtenidos correctamente',
    'data' => [
        'order' => [...],
        'products' => [...],
        'summary' => [...]
    ],
    'order' => [...]
]
```

**Respuesta modificada:**
```php
[
    'status' => 200,
    'message' => 'Detalles obtenidos correctamente',
    'data' => [
        'order' => [...],
        'products' => [...],
        'summary' => [...],
        'paymentMethods' => [
            [
                'method_pay_id' => 1,
                'method_pay' => 'Efectivo',
                'pay' => '150.00'
            ],
            [
                'method_pay_id' => 2,
                'method_pay' => 'Tarjeta',
                'pay' => '250.50'
            ]
        ]
    ],
    'order' => [...]
]
```

### Estructura de Datos del Modelo

**Método:** `getMethodPayment($array)`

**Query SQL:**
```sql
SELECT
    order_payments.method_pay_id,
    method_pay.method_pay,
    SUM(order_payments.pay) AS pay
FROM
    order_payments
INNER JOIN method_pay ON order_payments.method_pay_id = method_pay.id
WHERE
    order_payments.order_id = ?
GROUP BY
    order_payments.method_pay_id,
    method_pay.method_pay
ORDER BY
    method_pay.method_pay ASC
```

**Retorno:**
- Array de objetos con `method_pay_id`, `method_pay`, y `pay`
- Los pagos están agrupados y sumados por método
- Ordenados alfabéticamente por nombre del método
- Retorna `null` si no hay resultados

## Error Handling

### Casos de Error y Manejo

1. **No existen métodos de pago para el pedido**
   - Comportamiento: `getMethodPayment()` retorna `null`
   - Manejo: Convertir a array vacío `[]`
   - Resultado: El ticket se muestra sin sección de métodos de pago

2. **Error en la consulta de métodos de pago**
   - Comportamiento: `getMethodPayment()` retorna `null` o `false`
   - Manejo: Validar con `is_array()` y asignar array vacío
   - Resultado: El ticket se genera sin métodos de pago, sin romper la funcionalidad

3. **Datos de pago no disponibles en el frontend**
   - Comportamiento: `pos.data.paymentMethods` es `undefined`
   - Manejo: Usar operador OR `|| []` para asignar array vacío
   - Resultado: `ticketPasteleria` recibe array vacío y maneja la ausencia de datos

### Validaciones

**Backend:**
```php
// Validar que paymentMethods sea un array válido
if ($paymentMethods === null || !is_array($paymentMethods)) {
    $paymentMethods = [];
}
```

**Frontend:**
```javascript
// Validar que existan métodos de pago
paymentMethods: pos.data.paymentMethods || []
```

## Testing Strategy

### Pruebas Funcionales

1. **Pedido con múltiples métodos de pago**
   - Crear un pedido con pagos en efectivo y tarjeta
   - Verificar que el ticket muestre ambos métodos con montos correctos
   - Validar que los montos sumen el total pagado

2. **Pedido con un solo método de pago**
   - Crear un pedido pagado completamente en efectivo
   - Verificar que el ticket muestre solo ese método
   - Validar que el monto coincida con el total pagado

3. **Pedido sin pagos registrados**
   - Crear un pedido sin pagos asociados
   - Verificar que el ticket se genere sin errores
   - Validar que no se muestre sección de métodos de pago o se muestre vacía

4. **Pedido con múltiples pagos del mismo método**
   - Crear un pedido con varios pagos en efectivo
   - Verificar que el ticket agrupe y sume los pagos
   - Validar que se muestre una sola línea con el total

### Pruebas de Integración

1. **Flujo completo de impresión**
   - Desde la interfaz, hacer clic en imprimir ticket
   - Verificar que la llamada AJAX obtenga los datos correctos
   - Validar que el modal se abra con el ticket renderizado
   - Confirmar que los métodos de pago se muestren correctamente

2. **Compatibilidad con ticketPasteleria**
   - Verificar que la función `ticketPasteleria` reciba el formato correcto
   - Validar que renderice los métodos de pago sin errores
   - Confirmar que el formato visual sea consistente

### Casos de Prueba Específicos

| Caso | Entrada | Resultado Esperado |
|------|---------|-------------------|
| Pedido #123 con 2 métodos | orderId: 123 | `[{method_pay: "Efectivo", pay: 100}, {method_pay: "Tarjeta", pay: 200}]` |
| Pedido #456 sin pagos | orderId: 456 | `[]` |
| Pedido #789 con 3 pagos en efectivo | orderId: 789 | `[{method_pay: "Efectivo", pay: 450}]` (suma de 150+150+150) |
| Pedido inexistente | orderId: 999 | `[]` |

## Implementation Notes

### Consideraciones Importantes

1. **No modificar lógica existente**: Los cálculos de totales, saldos y descuentos permanecen intactos
2. **Reutilizar método existente**: `getMethodPayment()` ya existe y funciona correctamente
3. **Mantener compatibilidad**: La estructura de respuesta se extiende, no se reemplaza
4. **Manejo defensivo**: Validar siempre que los datos sean arrays antes de usarlos

### Orden de Implementación

1. Modificar `getOrderDetails()` en el backend para agregar consulta de métodos de pago
2. Modificar `printOrder()` en el frontend para usar datos reales
3. Probar con diferentes escenarios de pago
4. Validar que el ticket se renderice correctamente

### Dependencias

- Método existente: `getMethodPayment()` en `mdl-pedidos.php`
- Función existente: `ticketPasteleria()` debe aceptar el parámetro `paymentMethods`
- Tabla de base de datos: `order_payments` y `method_pay` deben existir y estar relacionadas
