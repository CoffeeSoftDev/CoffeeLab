# Design Document

## Overview

Este diseño define la arquitectura de consultas SQL y la estructura de datos necesaria para alimentar las métricas del dashboard de pedidos. El sistema se basa en la tabla `evt_events` (eventos/pedidos) y sus relaciones con `evt_payments` (pagos) y `status_process` (estados), siguiendo los patrones establecidos en CoffeeSoft.

## Architecture

### Data Flow Architecture

```
Frontend (app.js)
    ↓
    [renderDashboard() - Solicita datos con mes/año]
    ↓
Controller (ctrl-reservaciones.php)
    ↓
    [apiVentas() - Procesa parámetros y orquesta consultas]
    ↓
Model (mdl-reservaciones.php)
    ↓
    [Consultas SQL específicas por métrica]
    ↓
Database (evt_events, evt_payments, status_process)
    ↓
    [Retorna datos agregados]
    ↓
Controller
    ↓
    [Formatea respuesta JSON con cards]
    ↓
Frontend
    ↓
    [showCardsDashboard() - Renderiza cards]
```

## Components and Interfaces

### 1. Controller Methods (ctrl-reservaciones.php)

#### apiVentas() - Enhanced

Método principal que orquesta todas las consultas del dashboard.

**Input:**
```php
$_POST = [
    'mes' => '01',      // Mes seleccionado (01-12)
    'anio' => '2025',   // Año seleccionado
    'opc' => 'apiVentas'
];
```

**Output:**
```php
return [
    'cards' => [
        'total_pedidos' => 15,
        'dinero_entrante' => 25400.00,
        'ventas_cerradas' => [
            'cantidad' => 8,
            'monto' => 28600.00
        ],
        'cancelaciones' => [
            'cantidad' => 2,
            'monto' => 5900.00
        ],
        'desglose' => [
            'cotizaciones' => 4,
            'pagados' => 8,
            'cancelados' => 2
        ]
    ],
    'row' => [...],  // Datos de tabla existentes
    'ls' => [...]    // Lista completa existente
];
```

### 2. Model Methods (mdl-reservaciones.php)

#### getTotalPedidosMes($array)

Obtiene el total de pedidos del mes.

**SQL Query:**
```sql
SELECT COUNT(*) as total_pedidos
FROM {$this->bd}evt_events
WHERE subsidiaries_id = ?
  AND date_creation BETWEEN ? AND ?
```

**Parameters:** `[subsidiaries_id, fecha_inicio, fecha_fin]`

**Return:** `['total_pedidos' => 15]`

---

#### getDineroEntranteMes($array)

Calcula el dinero total que ha entrado por pagos en el mes.

**SQL Query:**
```sql
SELECT 
    COALESCE(SUM(evt_payments.pay), 0) as dinero_entrante
FROM {$this->bd}evt_events
LEFT JOIN {$this->bd}evt_payments 
    ON evt_events.id = evt_payments.evt_events_id
WHERE evt_events.subsidiaries_id = ?
  AND evt_payments.date_creation BETWEEN ? AND ?
```

**Parameters:** `[subsidiaries_id, fecha_inicio, fecha_fin]`

**Return:** `['dinero_entrante' => 25400.00]`

**Nota:** Suma todos los pagos registrados en el período, incluyendo anticipos y pagos parciales.

---

#### getVentasCerradasMes($array)

Obtiene pedidos completamente pagados (cerrados) en el mes.

**SQL Query:**
```sql
SELECT 
    COUNT(*) as cantidad_cerradas,
    COALESCE(SUM(evt_events.total_pay), 0) as monto_total_ventas
FROM {$this->bd}evt_events
WHERE subsidiaries_id = ?
  AND date_creation BETWEEN ? AND ?
  AND status_process_id = 3
```

**Parameters:** `[subsidiaries_id, fecha_inicio, fecha_fin]`

**Return:** 
```php
[
    'cantidad_cerradas' => 8,
    'monto_total_ventas' => 28600.00
]
```

**Nota:** `status_process_id = 3` representa pedidos "Pagados/Completados"

---

#### getCancelacionesMes($array)

Obtiene pedidos cancelados y su monto potencial perdido.

**SQL Query:**
```sql
SELECT 
    COUNT(*) as cantidad_canceladas,
    COALESCE(SUM(evt_events.total_pay), 0) as monto_perdido
FROM {$this->bd}evt_events
WHERE subsidiaries_id = ?
  AND date_creation BETWEEN ? AND ?
  AND status_process_id = 4
```

**Parameters:** `[subsidiaries_id, fecha_inicio, fecha_fin]`

**Return:**
```php
[
    'cantidad_canceladas' => 2,
    'monto_perdido' => 5900.00
]
```

**Nota:** `status_process_id = 4` representa pedidos "Cancelados"

---

#### getDesgloseEstadosMes($array)

Obtiene el desglose de pedidos por estado (cotizaciones, pagados, cancelados).

**SQL Query:**
```sql
SELECT 
    status_process_id,
    status_process.status as nombre_estado,
    COUNT(*) as cantidad
FROM {$this->bd}evt_events
INNER JOIN {$this->bd}status_process 
    ON evt_events.status_process_id = status_process.id
WHERE evt_events.subsidiaries_id = ?
  AND evt_events.date_creation BETWEEN ? AND ?
GROUP BY status_process_id, status_process.status
ORDER BY status_process_id ASC
```

**Parameters:** `[subsidiaries_id, fecha_inicio, fecha_fin]`

**Return:**
```php
[
    ['status_process_id' => 1, 'nombre_estado' => 'Reservación', 'cantidad' => 4],
    ['status_process_id' => 2, 'nombre_estado' => 'Si llego', 'cantidad' => 1],
    ['status_process_id' => 3, 'nombre_estado' => 'No llego', 'cantidad' => 8],
    ['status_process_id' => 4, 'nombre_estado' => 'Cancelado', 'cantidad' => 2]
]
```

---

### 3. Enhanced apiResumenVentas() Method

Método actualizado que procesa los datos del modelo y los estructura para el frontend.

```php
function apiResumenVentas($fi, $ff, $subsidiaries_id) {
    
    // Obtener métricas del modelo
    $totalPedidos = $this->getTotalPedidosMes([
        $subsidiaries_id, 
        $fi, 
        $ff
    ]);
    
    $dineroEntrante = $this->getDineroEntranteMes([
        $subsidiaries_id, 
        $fi, 
        $ff
    ]);
    
    $ventasCerradas = $this->getVentasCerradasMes([
        $subsidiaries_id, 
        $fi, 
        $ff
    ]);
    
    $cancelaciones = $this->getCancelacionesMes([
        $subsidiaries_id, 
        $fi, 
        $ff
    ]);
    
    $desglose = $this->getDesgloseEstadosMes([
        $subsidiaries_id, 
        $fi, 
        $ff
    ]);
    
    // Procesar desglose en formato simple
    $desgloseProcesado = [
        'cotizaciones' => 0,
        'pagados' => 0,
        'cancelados' => 0
    ];
    
    foreach ($desglose as $estado) {
        if ($estado['status_process_id'] == 1) {
            $desgloseProcesado['cotizaciones'] = $estado['cantidad'];
        } elseif ($estado['status_process_id'] == 3) {
            $desgloseProcesado['pagados'] = $estado['cantidad'];
        } elseif ($estado['status_process_id'] == 4) {
            $desgloseProcesado['cancelados'] = $estado['cantidad'];
        }
    }
    
    return [
        'total_pedidos' => $totalPedidos['total_pedidos'],
        'dinero_entrante' => $dineroEntrante['dinero_entrante'],
        'ventas_cerradas' => [
            'cantidad' => $ventasCerradas['cantidad_cerradas'],
            'monto' => $ventasCerradas['monto_total_ventas']
        ],
        'cancelaciones' => [
            'cantidad' => $cancelaciones['cantidad_canceladas'],
            'monto' => $cancelaciones['monto_perdido']
        ],
        'desglose' => $desgloseProcesado
    ];
}
```

## Data Models

### Database Schema Reference

**Tabla: evt_events**
```sql
- id (INT, PK)
- name_event (VARCHAR)
- name_client (VARCHAR)
- date_creation (DATETIME)
- date_start (DATETIME)
- date_end (DATETIME)
- total_pay (DECIMAL)
- advanced_pay (DECIMAL)
- discount (DECIMAL)
- status_process_id (INT, FK)
- subsidiaries_id (INT, FK)
- location (VARCHAR)
- notes (TEXT)
- phone (VARCHAR)
- email (VARCHAR)
```

**Tabla: evt_payments**
```sql
- id (INT, PK)
- evt_events_id (INT, FK)
- pay (DECIMAL)
- date_creation (DATETIME)
- method_pay_id (INT, FK)
```

**Tabla: status_process**
```sql
- id (INT, PK)
- status (VARCHAR)

Estados conocidos:
1 = Reservación (Cotización)
2 = Si llego (Confirmado)
3 = No llego (Pagado/Completado)
4 = Cancelado
```

### Frontend Data Structure

**Cards Data Structure:**
```javascript
const cardsData = {
    total_pedidos: 15,
    dinero_entrante: 25400.00,
    ventas_cerradas: {
        cantidad: 8,
        monto: 28600.00
    },
    cancelaciones: {
        cantidad: 2,
        monto: 5900.00
    },
    desglose: {
        cotizaciones: 4,
        pagados: 8,
        cancelados: 2
    }
};
```

## Error Handling

### Backend Error Handling

```php
// En cada método del modelo
function getTotalPedidosMes($array) {
    try {
        $query = "SELECT COUNT(*) as total_pedidos...";
        $result = $this->_Read($query, $array);
        
        if (empty($result)) {
            return ['total_pedidos' => 0];
        }
        
        return $result[0];
        
    } catch (Exception $e) {
        error_log("Error en getTotalPedidosMes: " . $e->getMessage());
        return ['total_pedidos' => 0];
    }
}
```

### Frontend Error Handling

```javascript
async renderDashboard() {
    try {
        let mes = $('#mes').val();
        let anio = $('#anio').val();

        const data = await useFetch({
            url: this._link,
            data: { opc: "apiVentas", mes: mes, anio: anio }
        });

        if (data.cards) {
            this.showCardsDashboard(data.cards);
        } else {
            console.error("No se recibieron datos de cards");
            this.showCardsDashboard(this.getDefaultCards());
        }

    } catch (error) {
        console.error("Error cargando dashboard:", error);
        alert({
            icon: "error",
            text: "Error al cargar las métricas del dashboard"
        });
    }
}

getDefaultCards() {
    return {
        total_pedidos: 0,
        dinero_entrante: 0,
        ventas_cerradas: { cantidad: 0, monto: 0 },
        cancelaciones: { cantidad: 0, monto: 0 },
        desglose: { cotizaciones: 0, pagados: 0, cancelados: 0 }
    };
}
```

## Testing Strategy

### Unit Testing

**Backend Tests:**
- Probar cada método del modelo con datos mock
- Validar que las consultas SQL retornen el formato esperado
- Verificar manejo de casos edge (sin datos, fechas inválidas)

**Test Cases:**
```php
// Test: getTotalPedidosMes con datos
// Expected: ['total_pedidos' => 15]

// Test: getTotalPedidosMes sin datos
// Expected: ['total_pedidos' => 0]

// Test: getDineroEntranteMes con múltiples pagos
// Expected: Suma correcta de todos los pagos

// Test: getDesgloseEstadosMes
// Expected: Array con todos los estados presentes
```

### Integration Testing

**Dashboard Flow Tests:**
1. Cargar dashboard con mes actual
2. Cambiar filtro de mes
3. Cambiar filtro de año
4. Verificar que todas las cards se actualicen
5. Verificar formato de montos (con comas y decimales)

### Performance Testing

**Metrics to Monitor:**
- Tiempo de respuesta de apiVentas: < 500ms
- Tiempo de ejecución de cada consulta SQL: < 100ms
- Tamaño de respuesta JSON: < 50KB

**Optimization Strategies:**
- Usar índices en columnas: `date_creation`, `subsidiaries_id`, `status_process_id`
- Considerar cache de resultados para el mes actual
- Limitar consultas a un rango de fechas razonable

## Implementation Notes

### SQL Performance Considerations

1. **Índices recomendados:**
```sql
CREATE INDEX idx_evt_events_date_sub 
ON evt_events(date_creation, subsidiaries_id);

CREATE INDEX idx_evt_events_status 
ON evt_events(status_process_id);

CREATE INDEX idx_evt_payments_date 
ON evt_payments(date_creation, evt_events_id);
```

2. **Uso de COALESCE:**
- Siempre usar `COALESCE(SUM(...), 0)` para evitar NULL en sumas
- Retornar 0 cuando no hay datos en lugar de NULL

3. **Filtrado por fecha:**
- Usar `BETWEEN` para rangos de fechas
- Asegurar que las fechas estén en formato `Y-m-d`

### Frontend Integration

**Actualización de showCardsDashboard():**
```javascript
showCardsDashboard(data) {
    this.cardsDashboard({
        parent: 'cardDashboard',
        theme: 'dark',
        json: [
            {
                title: "Pedidos del mes",
                id: "totalPedidos",
                data: {
                    value: data.total_pedidos,
                    description: `${data.desglose.cotizaciones} cotizaciones • ${data.desglose.pagados} pagados • ${data.desglose.cancelados} cancelados`,
                    color: "text-purple-400"
                }
            },
            {
                title: "Dinero entrante este mes",
                id: "dineroEntrante",
                data: {
                    value: formatPrice(data.dinero_entrante),
                    description: "Total de pagos recibidos en el período",
                    color: "text-pink-400"
                }
            },
            {
                title: "Ventas cerradas del mes",
                id: "ventasCerradas",
                data: {
                    value: formatPrice(data.ventas_cerradas.monto),
                    description: `${data.ventas_cerradas.cantidad} pedidos completados`,
                    color: "text-cyan-400"
                }
            },
            {
                title: "Cancelaciones del mes",
                id: "cancelaciones",
                data: {
                    value: formatPrice(data.cancelaciones.monto),
                    description: `${data.cancelaciones.cantidad} pedidos cancelados`,
                    color: "text-red-400"
                }
            }
        ]
    });
}
```

### Security Considerations

1. **Validación de parámetros:**
```php
// En apiVentas()
$mes = filter_var($_POST['mes'], FILTER_VALIDATE_INT);
$anio = filter_var($_POST['anio'], FILTER_VALIDATE_INT);

if ($mes < 1 || $mes > 12) {
    $mes = date('m');
}

if ($anio < 2020 || $anio > 2030) {
    $anio = date('Y');
}
```

2. **Control de acceso:**
- Verificar que `$_SESSION['SUB']` esté definido
- Validar que el usuario tenga permisos para ver el dashboard
- Filtrar datos solo de la sucursal del usuario

3. **Prevención de SQL Injection:**
- Usar siempre prepared statements (ya implementado en `_Read` y `_Select`)
- No concatenar valores directamente en queries
