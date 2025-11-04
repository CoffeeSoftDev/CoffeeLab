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

#### 1.4 Modal de Cierre del Día

**Método**: `generateDailyClose()`

Modal con selector de fecha y dos botones separados:

```javascript
generateDailyClose() {
    const today = moment().format('YYYY-MM-DD');
    
    const modalContent = `
        <div class="mb-4 p-3 rounded">
            <div class="flex items-center gap-3">
                <div>
                    <label class="font-semibold text-sm mb-1 block">Seleccionar fecha:</label>
                    <input 
                        type="date" 
                        id="dailyCloseDate" 
                        class="form-control"
                        value="${today}"
                    />
                </div>
                <button 
                    id="btnConsultData" 
                    class="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded transition mt-auto">
                    <i class="icon-search"></i> Consultar
                </button>
                <button 
                    id="btnPrintTicket" 
                    class="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded transition mt-auto opacity-50 cursor-not-allowed"
                    disabled>
                    <i class="icon-print"></i> Imprimir
                </button>
            </div>
        </div>
        
        <div id="ticketContainer">
            <div class="text-center text-gray-400 py-10">
                <i class="icon-doc-text text-5xl mb-3"></i>
                <p>Selecciona una fecha y presiona "Consultar"</p>
            </div>
        </div>
    `;
    
    bootbox.dialog({
        title: `<i class="icon-calendar"></i> Cierre del Día - Pedidos de Pastelería`,
        message: modalContent,
        closeButton: true
    });
    
    // Evento para consultar datos
    $('#btnConsultData').on('click', () => {
        const selectedDate = $('#dailyCloseDate').val();
        if (selectedDate) {
            this.loadDailyCloseData(selectedDate);
        } else {
            alert({
                icon: "warning",
                text: "Por favor selecciona una fecha",
                btn1: true,
                btn1Text: "Ok"
            });
        }
    });
    
    // Evento para imprimir (solo funciona si está habilitado)
    $('#btnPrintTicket').on('click', () => {
        if (!$('#btnPrintTicket').prop('disabled')) {
            this.printDailyCloseTicket();
        }
    });
}
```

**Método**: `loadDailyCloseData(date)`

Consulta los datos y habilita el botón de impresión:

```javascript
async loadDailyCloseData(date) {
    // Mostrar indicador de carga
    $('#ticketContainer').html(`
        <div class="text-center py-10">
            <div class="spinner-border text-blue-600" role="status"></div>
            <p class="text-gray-600 mt-3">Consultando datos...</p>
        </div>
    `);
    
    const request = await useFetch({
        url: this._link,
        data: {
            opc: "getDailySummary",
            date: date
        }
    });
    
    if (request.status === 200) {
        // Renderizar ticket
        this.renderDailyCloseTicketInModal(request.data, date);
        
        // Habilitar botón de impresión
        $('#btnPrintTicket')
            .prop('disabled', false)
            .removeClass('opacity-50 cursor-not-allowed')
            .addClass('hover:bg-green-700');
    } else {
        // Mostrar mensaje de error
        $('#ticketContainer').html(`
            <div class="text-center py-10">
                <i class="icon-attention text-5xl text-gray-400 mb-3"></i>
                <p class="text-gray-600">${request.message || "No hay pedidos registrados para esta fecha"}</p>
            </div>
        `);
        
        // Mantener botón deshabilitado
        $('#btnPrintTicket')
            .prop('disabled', true)
            .addClass('opacity-50 cursor-not-allowed');
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

Consulta pedidos activos y pagos reales desde la tabla `pedidos_payments`:

```php
function getDailySalesMetrics($params) {
    // 1. Obtener total de ventas y número de pedidos
    $queryOrders = "
        SELECT 
            COUNT(*) as total_orders,
            SUM(total_pay) as total_sales
        FROM {$this->bd}pedidos_orders
        WHERE DATE(date_order) = ?
        AND subsidiaries_id = ?
        AND status != 4
    ";
    
    $orders = $this->_Read($queryOrders, [
        $params['date'],
        $params['subsidiaries_id']
    ])[0];
    
    // 2. Obtener pagos reales agrupados por método de pago
    $queryPayments = "
        SELECT 
            pp.method_pay_id,
            SUM(pp.advanced_pay) as total_paid
        FROM {$this->bd}pedidos_payments pp
        INNER JOIN {$this->bd}pedidos_orders po ON pp.order_id = po.id
        WHERE DATE(po.date_order) = ?
        AND po.subsidiaries_id = ?
        AND po.status != 4
        GROUP BY pp.method_pay_id
    ";
    
    $payments = $this->_Read($queryPayments, [
        $params['date'],
        $params['subsidiaries_id']
    ]);
    
    // 3. Mapear pagos por método (1=Efectivo, 2=Tarjeta, 3=Transferencia)
    $card_sales = 0;
    $cash_sales = 0;
    $transfer_sales = 0;
    
    foreach ($payments as $payment) {
        switch ($payment['method_pay_id']) {
            case 1:
                $cash_sales = $payment['total_paid'];
                break;
            case 2:
                $card_sales = $payment['total_paid'];
                break;
            case 3:
                $transfer_sales = $payment['total_paid'];
                break;
        }
    }
    
    return [
        'total_orders' => $orders['total_orders'],
        'total_sales' => $orders['total_sales'],
        'card_sales' => $card_sales,
        'cash_sales' => $cash_sales,
        'transfer_sales' => $transfer_sales
    ];
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

## Interaction Flow

### Flujo de Cierre del Día

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Usuario hace clic en "Cierre del día"                    │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. Se abre modal con:                                        │
│    - Selector de fecha (valor por defecto: hoy)             │
│    - Botón "Consultar" (habilitado)                         │
│    - Botón "Imprimir" (deshabilitado)                       │
│    - Mensaje: "Selecciona una fecha y presiona Consultar"   │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. Usuario selecciona fecha y presiona "Consultar"          │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. Validación frontend:                                      │
│    ¿Fecha seleccionada?                                      │
└────────┬───────────────────────────┬────────────────────────┘
         │ NO                        │ SÍ
         ▼                           ▼
┌──────────────────┐    ┌────────────────────────────────────┐
│ Mostrar alerta   │    │ 5. Mostrar indicador de carga      │
│ "Selecciona      │    │    "Consultando datos..."          │
│  una fecha"      │    └────────────┬───────────────────────┘
└──────────────────┘                 │
                                     ▼
                        ┌────────────────────────────────────┐
                        │ 6. Petición AJAX a getDailySummary │
                        │    POST: { opc, date }             │
                        └────────────┬───────────────────────┘
                                     │
                                     ▼
                        ┌────────────────────────────────────┐
                        │ 7. Backend consulta:               │
                        │    - Pedidos activos del día       │
                        │    - Pagos desde pedidos_payments  │
                        │    - Agrupa por método de pago     │
                        └────────┬───────────────┬───────────┘
                                 │ Datos         │ Sin datos
                                 ▼               ▼
                    ┌──────────────────┐  ┌─────────────────┐
                    │ 8a. Renderizar   │  │ 8b. Mostrar     │
                    │     ticket con   │  │     mensaje     │
                    │     métricas     │  │     "No hay     │
                    │                  │  │     pedidos"    │
                    │ 9a. Habilitar    │  │                 │
                    │     botón        │  │ 9b. Mantener    │
                    │     "Imprimir"   │  │     botón       │
                    │                  │  │     deshabilitado│
                    └────────┬─────────┘  └─────────────────┘
                             │
                             ▼
                    ┌──────────────────────────────────────┐
                    │ 10. Usuario presiona "Imprimir"      │
                    └────────┬─────────────────────────────┘
                             │
                             ▼
                    ┌──────────────────────────────────────┐
                    │ 11. Abrir ventana de impresión       │
                    │     con ticket generado              │
                    └──────────────────────────────────────┘
```

### Estados del Botón "Imprimir"

| Estado | Condición | Apariencia | Comportamiento |
|--------|-----------|------------|----------------|
| Deshabilitado | Modal recién abierto | `opacity-50 cursor-not-allowed` | No responde a clicks |
| Deshabilitado | Consulta sin resultados | `opacity-50 cursor-not-allowed` | No responde a clicks |
| Habilitado | Consulta exitosa con datos | `hover:bg-green-700` | Abre ventana de impresión |

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

### Tabla: pedidos_payments

**Estructura relevante para cierre del día**:

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INT | Clave primaria |
| order_id | INT | FK a pedidos_orders |
| method_pay_id | INT | Método de pago (1=Efectivo, 2=Tarjeta, 3=Transferencia) |
| advanced_pay | DECIMAL(10,2) | Monto del pago |
| date_create | DATETIME | Fecha del pago |
| description | TEXT | Observaciones |

**Relación con pedidos_orders**:

```sql
SELECT 
    po.id,
    po.date_order,
    po.total_pay,
    pp.method_pay_id,
    pp.advanced_pay
FROM pedidos_orders po
LEFT JOIN pedidos_payments pp ON po.id = pp.order_id
WHERE DATE(po.date_order) = '2025-01-15'
AND po.status != 4;
```

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
