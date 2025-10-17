# Design Document

## Overview

Este documento describe el diseño técnico para implementar dos funcionalidades en el módulo de pedidos de CoffeeSoft:

1. **Sistema de Tipo de Entrega**: Clasificación de pedidos como "Local" o "A domicilio"
2. **Cierre del Día**: Generación de ticket resumen con métricas de ventas diarias

El diseño sigue la arquitectura MVC de CoffeeSoft, utilizando componentes existentes y manteniendo la consistencia con el sistema actual.

## Architecture

### Diagrama de Componentes

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (JavaScript)                     │
├─────────────────────────────────────────────────────────────┤
│  order.js / order-dashboard.js                              │
│  - Formulario con radio buttons (delivery_type)             │
│  - Botón "Cierre del día"                                   │
│  - Renderizado de tabla con columna delivery                │
│  - Generación de ticket visual                              │
└────────────────┬────────────────────────────────────────────┘
                 │ AJAX (useFetch)
                 ▼
┌─────────────────────────────────────────────────────────────┐
│                  Controlador (PHP)                           │
├─────────────────────────────────────────────────────────────┤
│  ctrl-pedidos.php                                            │
│  - addOrder() / editOrder() → guarda delivery_type           │
│  - listOrders() → incluye columna delivery en respuesta     │
│  - getDailySummary() → calcula métricas del día             │
└────────────────┬────────────────────────────────────────────┘
                 │ SQL Queries
                 ▼
┌─────────────────────────────────────────────────────────────┐
│                     Modelo (PHP)                             │
├─────────────────────────────────────────────────────────────┤
│  mdl-pedidos.php                                             │
│  - createOrder() / updateOrder() → maneja delivery_type      │
│  - listOrders() → incluye delivery_type en SELECT            │
│  - getDailySalesMetrics() → agrupa por payment_method       │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│                  Base de Datos (MySQL)                       │
├─────────────────────────────────────────────────────────────┤
│  pedidos_orders                                              │
│  + delivery_type ENUM('local', 'domicilio') DEFAULT 'local'  │
└─────────────────────────────────────────────────────────────┘
```

## Components and Interfaces

### 1. Frontend Components

#### 1.1 Formulario de Pedido (order.js)

**Componente**: Radio buttons para tipo de entrega

```javascript
{
    opc: "radio",
    id: "delivery_type",
    lbl: "Tipo de entrega",
    class: "col-12 col-lg-6 mb-3",
    data: [
        { id: "local", valor: "Local" },
        { id: "domicilio", valor: "A domicilio" }
    ],
    default: "local"
}
```

**Ubicación**: Después del campo de fecha/hora de entrega en `jsonOrder()`

#### 1.2 Tabla de Pedidos

**Modificación en `listOrders()`**:

- Agregar nueva columna después de "Estado"
- Renderizar ícono según tipo de entrega:
  - `domicilio`: `<i class="icon-moto text-amber-500"></i>`
  - `local`: `<i class="icon-store text-gray-500"></i>` o vacío

```javascript
'Entrega': {
    'html': order.delivery_type === 'domicilio' 
        ? '<i class="icon-moto text-amber-500 text-xl" title="Entrega a domicilio"></i>'
        : '<i class="icon-store text-gray-500" title="Entrega local"></i>',
    'class': 'text-center'
}
```

#### 1.3 Botón Cierre del Día

**Ubicación**: FilterBar, junto a "Nuevo Pedido" y calendario

```javascript
{
    opc: "button",
    id: "btnDailyClose",
    text: "Cierre del día",
    class: "col-12 col-md-3",
    className: "bg-amber-500 hover:bg-amber-600 text-white font-semibold",
    icono: "icon-receipt",
    onClick: () => order.generateDailyClose()
}
```

#### 1.4 Ticket de Cierre

**Método**: `generateDailyClose()`

Componente visual similar al ticket de pedido personalizado:

```javascript
generateDailyClose() {
    const selectedDate = getDataRangePicker("calendar").fi;
    
    const request = await useFetch({
        url: this._link,
        data: {
            opc: "getDailySummary",
            date: selectedDate
        }
    });
    
    if (request.status === 200) {
        this.renderDailyCloseTicket(request.data);
    }
}
```

### 2. Backend Components

#### 2.1 Controlador (ctrl-pedidos.php)

**Método nuevo**: `getDailySummary()`

```php
function getDailySummary() {
    $status = 500;
    $message = 'Error al obtener resumen del día';
    $data = null;
    
    $date = $_POST['date'];
    $subsidiaries_id = $_SESSION['SUB'];
    
    $summary = $this->getDailySalesMetrics([
        'date' => $date,
        'subsidiaries_id' => $subsidiaries_id
    ]);
    
    if ($summary) {
        $status = 200;
        $message = 'Resumen obtenido correctamente';
        $data = $summary;
    }
    
    return [
        'status' => $status,
        'message' => $message,
        'data' => $data
    ];
}
```

**Modificación en `listOrders()`**:
- Incluir campo `delivery_type` en la respuesta

#### 2.2 Modelo (mdl-pedidos.php)

**Método nuevo**: `getDailySalesMetrics()`

```php
function getDailySalesMetrics($params) {
    $query = "
        SELECT 
            COUNT(*) as total_orders,
            SUM(total_pay - IFNULL(discount, 0)) as total_sales,
            SUM(CASE WHEN payment_method = 'tarjeta' THEN total_pay - IFNULL(discount, 0) ELSE 0 END) as card_sales,
            SUM(CASE WHEN payment_method = 'efectivo' THEN total_pay - IFNULL(discount, 0) ELSE 0 END) as cash_sales,
            SUM(CASE WHEN payment_method = 'transferencia' THEN total_pay - IFNULL(discount, 0) ELSE 0 END) as transfer_sales
        FROM {$this->bd}pedidos_orders
        WHERE DATE(date_creation) = ?
        AND subsidiaries_id = ?
        AND status != 4
    ";
    
    return $this->_Read($query, [
        $params['date'],
        $params['subsidiaries_id']
    ])[0];
}
```

**Modificación en `getOrders()`**:
- Agregar `delivery_type` al SELECT

```php
'values' => "
    id,
    name_client,
    phone,
    date_creation,
    total_pay,
    discount,
    status,
    delivery_type,
    ...
"
```

## Data Models

### Tabla: pedidos_orders

**Campo nuevo**:

```sql
ALTER TABLE pedidos_orders 
ADD COLUMN delivery_type ENUM('local', 'domicilio') 
DEFAULT 'local' 
AFTER status;
```

**Estructura completa relevante**:

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INT | Clave primaria |
| name_client | VARCHAR(255) | Nombre del cliente |
| phone | VARCHAR(20) | Teléfono |
| date_creation | DATETIME | Fecha de creación |
| date_order | DATE | Fecha de entrega |
| time_order | TIME | Hora de entrega |
| total_pay | DECIMAL(10,2) | Total a pagar |
| discount | DECIMAL(10,2) | Descuento aplicado |
| payment_method | ENUM | Método de pago |
| status | INT | Estado del pedido |
| **delivery_type** | **ENUM** | **Tipo de entrega** |
| subsidiaries_id | INT | Sucursal |

## Error Handling

### Frontend

1. **Validación de formulario**:
   - Verificar que `delivery_type` tenga un valor válido antes de enviar
   - Mostrar mensaje si no se selecciona ninguna opción

2. **Manejo de respuesta del ticket**:
   ```javascript
   if (request.status !== 200) {
       alert({
           icon: "error",
           text: "No se pudo generar el cierre del día",
           btn1: true
       });
   }
   ```

3. **Validación de fecha**:
   - Verificar que haya una fecha seleccionada en el calendario
   - Mostrar mensaje si no hay pedidos en la fecha

### Backend

1. **Validación de datos**:
   ```php
   if (!in_array($_POST['delivery_type'], ['local', 'domicilio'])) {
       $_POST['delivery_type'] = 'local';
   }
   ```

2. **Manejo de consultas vacías**:
   ```php
   if (empty($summary) || $summary['total_orders'] == 0) {
       return [
           'status' => 404,
           'message' => 'No hay pedidos registrados para esta fecha',
           'data' => null
       ];
   }
   ```

## Testing Strategy

### Unit Tests

1. **Frontend**:
   - Verificar que el radio button se renderice correctamente
   - Validar que el valor por defecto sea "local"
   - Comprobar que el ícono correcto se muestre según el tipo

2. **Backend**:
   - Probar `getDailySummary()` con diferentes fechas
   - Verificar cálculos de totales por método de pago
   - Validar filtrado por estado (excluir cancelados)

### Integration Tests

1. **Flujo completo de creación**:
   - Crear pedido con tipo "domicilio"
   - Verificar que se guarde correctamente en BD
   - Confirmar que aparezca en la tabla con ícono correcto

2. **Flujo de cierre del día**:
   - Crear varios pedidos con diferentes métodos de pago
   - Generar cierre del día
   - Verificar que los totales coincidan

### Manual Testing

1. **Casos de prueba**:
   - Crear pedido local y verificar visualización
   - Crear pedido a domicilio y verificar ícono
   - Editar pedido y cambiar tipo de entrega
   - Generar cierre con 0 pedidos
   - Generar cierre con múltiples métodos de pago
   - Verificar que pedidos cancelados no se incluyan

2. **Pruebas de UI**:
   - Responsive design en móvil/tablet
   - Impresión del ticket de cierre
   - Accesibilidad de iconos y botones
