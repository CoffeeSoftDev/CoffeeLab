# Design Document

## Overview

La funcionalidad de **Estado de Entrega** se implementará como una extensión del módulo de pedidos existente, agregando una columna interactiva en la tabla principal que permita visualizar y actualizar el estado de entrega mediante un sistema de badges dinámicos y modales de confirmación.

### Arquitectura General

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (JS)                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  dashboard-pedidos.js                                 │   │
│  │  - renderDeliveryBadge()                             │   │
│  │  - updateDeliveryStatus()                            │   │
│  │  - handleDeliveryClick()                             │   │
│  └──────────────────────────────────────────────────────┘   │
│                          ↓ useFetch()                        │
├─────────────────────────────────────────────────────────────┤
│                    Backend (PHP)                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  ctrl-pedidos.php                                     │   │
│  │  - updateDeliveryStatus()                            │   │
│  └──────────────────────────────────────────────────────┘   │
│                          ↓                                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  mdl-pedidos.php                                      │   │
│  │  - updateOrderDeliveryStatus()                       │   │
│  └──────────────────────────────────────────────────────┘   │
│                          ↓                                   │
├─────────────────────────────────────────────────────────────┤
│                    Database (MySQL)                          │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  order table                                          │   │
│  │  - is_delivered (int): 0 = No, 1 = Sí               │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Architecture

### Frontend Layer (JavaScript)

#### Modificaciones en `dashboard-pedidos.js`

**1. Actualización del método `listOrders()`**

Se modificará la construcción del array `rows[]` para incluir la nueva columna "Entrega":

```javascript
// Dentro del foreach de orders
rows[] = [
    'id'       => $order['id'],
    'folio'    => $Folio,
    'Creación' => formatSpanishDate($order['date_creation']),
    'Cliente'  => [...],
    'Abono'    => [...],
    'Total'    => [...],
    'Saldo'    => [...],
    'Estado'   => getStatusBadge($order['status']),
    
    // ✨ NUEVA COLUMNA
    'Entrega'  => [
        'html'  => this.renderDeliveryBadge($order),
        'class' => 'text-center cursor-pointer'
    ],
    
    'dropdown' => [...]
];
```

**2. Nuevo método: `renderDeliveryBadge(order)`**

```javascript
renderDeliveryBadge(order) {
    // No aplica para cotizaciones
    if (order.status === 1) {
        return `
            <span class="px-3 py-1 rounded-full text-xs font-semibold bg-gray-400 text-gray-700">
                <i class="icon-minus"></i> No aplica
            </span>
        `;
    }
    
    const isDelivered = parseInt(order.is_delivered) === 1;
    const bgColor = isDelivered ? 'bg-green-500' : 'bg-red-500';
    const icon = isDelivered ? 'icon-ok' : 'icon-cancel';
    const text = isDelivered ? 'Entregado' : 'No entregado';
    
    // Solo clickeable si no está cancelado
    const clickable = order.status !== 4;
    const clickAttr = clickable 
        ? `onclick="dashboardPedidos.handleDeliveryClick(${order.id}, ${order.is_delivered}, '${order.folio}')"` 
        : '';
    
    return `
        <span 
            class="px-3 py-1 rounded-full text-xs font-semibold ${bgColor} text-white 
                   ${clickable ? 'cursor-pointer hover:opacity-80 transition' : 'cursor-not-allowed opacity-60'}"
            ${clickAttr}
            data-order-id="${order.id}"
            data-delivered="${order.is_delivered}">
            <i class="${icon}"></i> ${text}
        </span>
    `;
}
```

**3. Nuevo método: `handleDeliveryClick(orderId, currentStatus, folio)`**

```javascript
handleDeliveryClick(orderId, currentStatus, folio) {
    const newStatus = currentStatus === 1 ? 0 : 1;
    const statusText = newStatus === 1 ? 'entregado' : 'no entregado';
    
    this.swalQuestion({
        opts: {
            title: '📦 Actualizar estado de entrega',
            html: `¿El pedido <strong>${folio}</strong> fue ${statusText}?`,
            icon: 'question',
            confirmButtonText: newStatus === 1 ? '✓ Sí, entregado' : '✗ No entregado',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: newStatus === 1 ? '#10b981' : '#ef4444'
        },
        data: {
            opc: 'updateDeliveryStatus',
            id: orderId,
            is_delivered: newStatus
        },
        methods: {
            send: (response) => {
                if (response.status === 200) {
                    // Actualización optimista del badge
                    this.updateBadgeUI(orderId, newStatus);
                    
                    alert({
                        icon: 'success',
                        title: 'Estado actualizado',
                        text: response.message,
                        timer: 2000,
                        showConfirmButton: false
                    });
                } else {
                    alert({
                        icon: 'error',
                        title: 'Error',
                        text: response.message,
                        btn1: true,
                        btn1Text: 'Ok'
                    });
                }
            }
        }
    });
}
```

**4. Nuevo método: `updateBadgeUI(orderId, newStatus)`**

```javascript
updateBadgeUI(orderId, newStatus) {
    const badge = $(`span[data-order-id="${orderId}"]`);
    
    if (badge.length === 0) return;
    
    const isDelivered = newStatus === 1;
    const bgColor = isDelivered ? 'bg-green-500' : 'bg-red-500';
    const icon = isDelivered ? 'icon-ok' : 'icon-cancel';
    const text = isDelivered ? 'Entregado' : 'No entregado';
    
    // Animación de transición
    badge.fadeOut(200, function() {
        $(this)
            .removeClass('bg-green-500 bg-red-500')
            .addClass(bgColor)
            .attr('data-delivered', newStatus)
            .attr('onclick', `dashboardPedidos.handleDeliveryClick(${orderId}, ${newStatus}, '${badge.closest('tr').find('td:first').text()}')`)
            .html(`<i class="${icon}"></i> ${text}`)
            .fadeIn(200);
    });
}
```

### Backend Layer (PHP)

#### Modificaciones en `ctrl-pedidos.php`

**Nuevo método en la clase `Pedidos`:**

```php
function updateDeliveryStatus() {
    $status = 500;
    $message = 'Error al actualizar el estado de entrega';
    
    $id = $_POST['id'] ?? null;
    $is_delivered = $_POST['is_delivered'] ?? null;
    
    // Validaciones
    if (!$id || !isset($is_delivered)) {
        return [
            'status' => 400,
            'message' => 'Parámetros incompletos'
        ];
    }
    
    // Verificar que el pedido existe
    $order = $this->getOrderById([$id]);
    
    if (empty($order)) {
        return [
            'status' => 404,
            'message' => 'Pedido no encontrado'
        ];
    }
    
    // No permitir cambios en cotizaciones
    if ($order[0]['status'] == 1) {
        return [
            'status' => 403,
            'message' => 'No se puede actualizar el estado de entrega de una cotización'
        ];
    }
    
    // Actualizar en base de datos
    $update = $this->updateOrderDeliveryStatus([
        'id' => $id,
        'is_delivered' => $is_delivered
    ]);
    
    if ($update) {
        $status = 200;
        $statusText = $is_delivered == 1 ? 'entregado' : 'no entregado';
        $message = "El pedido fue marcado como {$statusText}";
    }
    
    return [
        'status' => $status,
        'message' => $message,
        'data' => [
            'id' => $id,
            'is_delivered' => $is_delivered
        ]
    ];
}
```

#### Modificaciones en `mdl-pedidos.php`

**Nuevo método en la clase `MPedidos`:**

```php
function updateOrderDeliveryStatus($data) {
    return $this->_Update([
        'table' => "{$this->bd}order",
        'values' => 'is_delivered = ?',
        'where' => 'id = ?',
        'data' => [
            $data['is_delivered'],
            $data['id']
        ]
    ]);
}
```

## Components and Interfaces

### Badge Component Structure

```html
<!-- Estado: Entregado -->
<span class="px-3 py-1 rounded-full text-xs font-semibold bg-green-500 text-white 
             cursor-pointer hover:opacity-80 transition"
      onclick="dashboardPedidos.handleDeliveryClick(123, 1, 'TXT-001-123')"
      data-order-id="123"
      data-delivered="1">
    <i class="icon-ok"></i> Entregado
</span>

<!-- Estado: No entregado -->
<span class="px-3 py-1 rounded-full text-xs font-semibold bg-red-500 text-white 
             cursor-pointer hover:opacity-80 transition"
      onclick="dashboardPedidos.handleDeliveryClick(123, 0, 'TXT-001-123')"
      data-order-id="123"
      data-delivered="0">
    <i class="icon-cancel"></i> No entregado
</span>

<!-- Estado: No aplica (cotización) -->
<span class="px-3 py-1 rounded-full text-xs font-semibold bg-gray-400 text-gray-700">
    <i class="icon-minus"></i> No aplica
</span>
```

### Modal Confirmation (swalQuestion)

```javascript
{
    title: '📦 Actualizar estado de entrega',
    html: '¿El pedido <strong>TXT-001-123</strong> fue entregado?',
    icon: 'question',
    confirmButtonText: '✓ Sí, entregado',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#10b981'
}
```

## Data Models

### Database Schema

**Tabla: `order`**

Campo relevante:
- `is_delivered` (int): 
  - `0` = No entregado
  - `1` = Entregado
  - Default: `0`

### Request/Response Models

**Request: updateDeliveryStatus**
```json
{
    "opc": "updateDeliveryStatus",
    "id": 123,
    "is_delivered": 1
}
```

**Response: Success**
```json
{
    "status": 200,
    "message": "El pedido fue marcado como entregado",
    "data": {
        "id": 123,
        "is_delivered": 1
    }
}
```

**Response: Error**
```json
{
    "status": 403,
    "message": "No se puede actualizar el estado de entrega de una cotización"
}
```

## Error Handling

### Frontend Error Scenarios

1. **Pedido no encontrado (404)**
   - Mostrar alert con mensaje de error
   - No actualizar el badge
   - Sugerir recargar la tabla

2. **Cotización (403)**
   - Mostrar mensaje: "Las cotizaciones no tienen estado de entrega"
   - No permitir el click en el badge

3. **Error de red**
   - Mostrar mensaje genérico de error
   - Mantener el estado anterior del badge
   - Ofrecer reintentar

4. **Sesión expirada**
   - Redirigir al login
   - Mostrar mensaje de sesión expirada

### Backend Error Scenarios

1. **Parámetros incompletos**
   - Return: `status: 400, message: 'Parámetros incompletos'`

2. **Pedido inexistente**
   - Return: `status: 404, message: 'Pedido no encontrado'`

3. **Cotización**
   - Return: `status: 403, message: 'No se puede actualizar el estado de entrega de una cotización'`

4. **Error de base de datos**
   - Return: `status: 500, message: 'Error al actualizar el estado de entrega'`
   - Log del error en servidor

## Testing Strategy

### Unit Tests

**Frontend:**
1. `renderDeliveryBadge()` - Verificar renderizado correcto según estado
2. `updateBadgeUI()` - Verificar actualización visual del badge
3. `handleDeliveryClick()` - Verificar apertura del modal

**Backend:**
1. `updateDeliveryStatus()` - Verificar actualización en BD
2. Validación de parámetros
3. Manejo de pedidos inexistentes
4. Restricción de cotizaciones

### Integration Tests

1. **Flujo completo de actualización:**
   - Click en badge → Modal → Confirmación → Actualización BD → Actualización UI

2. **Validación de permisos:**
   - Usuario sin sesión no puede actualizar

3. **Concurrencia:**
   - Múltiples usuarios actualizando el mismo pedido

### Manual Testing Checklist

- [ ] Badge se renderiza correctamente en todos los estados
- [ ] Click en badge abre modal de confirmación
- [ ] Modal muestra el folio correcto del pedido
- [ ] Actualización exitosa muestra notificación
- [ ] Badge se actualiza sin recargar tabla
- [ ] Cotizaciones muestran "No aplica" y no son clickeables
- [ ] Pedidos cancelados no permiten cambios
- [ ] Errores muestran mensajes apropiados
- [ ] Funciona en dispositivos móviles
- [ ] Animaciones son suaves y no causan lag

## Performance Considerations

1. **Renderizado inicial:**
   - Los badges se generan en el servidor (PHP) para evitar múltiples renders en JS
   - Uso de clases CSS predefinidas para evitar cálculos en runtime

2. **Actualización optimista:**
   - El badge se actualiza inmediatamente en el frontend
   - Si falla la petición, se revierte el cambio

3. **Caché de datos:**
   - No se recarga toda la tabla después de actualizar
   - Solo se actualiza el badge específico

4. **Debouncing:**
   - Prevenir múltiples clicks rápidos en el mismo badge
   - Deshabilitar badge durante la petición AJAX

## Security Considerations

1. **Validación de sesión:**
   - Verificar `$_SESSION['SUB']` en el controlador
   - Validar permisos del usuario

2. **Sanitización de inputs:**
   - Usar `$this->util->sql()` para prevenir SQL injection
   - Validar que `is_delivered` sea 0 o 1

3. **CSRF Protection:**
   - Incluir token CSRF en las peticiones (si aplica)

4. **Rate Limiting:**
   - Limitar número de actualizaciones por minuto por usuario

## Migration Plan

1. **Verificar campo en BD:**
   - Confirmar que `order.is_delivered` existe
   - Si no existe, crear con: `ALTER TABLE order ADD COLUMN is_delivered INT DEFAULT 0`

2. **Despliegue:**
   - Actualizar `mdl-pedidos.php`
   - Actualizar `ctrl-pedidos.php`
   - Actualizar `dashboard-pedidos.js`
   - Limpiar caché del navegador

3. **Rollback plan:**
   - Mantener backup de archivos anteriores
   - Script SQL para revertir cambios en BD si es necesario
