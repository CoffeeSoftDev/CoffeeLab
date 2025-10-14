# Design Document - Dashboard de Pedidos con Analytics

## Overview

El Dashboard de Pedidos con Analytics es un módulo de visualización de datos que proporciona métricas consolidadas, comparativas temporales y rankings de productos y clientes. El diseño sigue la arquitectura MVC de CoffeeSoft, utilizando componentes reutilizables y consultas optimizadas para garantizar un rendimiento óptimo.

El dashboard se compone de tres capas principales:
- **Frontend (JS)**: Clase `Dashboard` que hereda de `Templates` y maneja la renderización de componentes visuales
- **Controlador (PHP)**: Clase `Pedidos` con métodos específicos para obtener métricas del dashboard
- **Modelo (PHP)**: Clase `MPedidos` con consultas SQL optimizadas para agregaciones y rankings

## Architecture

### Component Structure

```
Dashboard Module
├── Frontend Layer (dashboard.js)
│   ├── Dashboard Class (extends Templates)
│   │   ├── render()
│   │   ├── layout()
│   │   ├── filterBar()
│   │   ├── renderMetrics()
│   │   ├── renderCharts()
│   │   └── renderTables()
│   └── Components
│       ├── infoCard (métricas)
│       ├── barChart (pedidos por estado)
│       ├── createCoffeTable (rankings)
│       └── createfilterBar (filtros)
│
├── Controller Layer (ctrl-pedidos.php)
│   └── Pedidos Class
│       ├── apiDashboard()
│       ├── getDashboardMetrics()
│       ├── getTopProducts()
│       └── getTopClients()
│
└── Model Layer (mdl-pedidos.php)
    └── MPedidos Class
        ├── listOrdersByMonth()
        ├── getOrdersByStatus()
        ├── getProductSales()
        ├── getClientPurchases()
        └── calculateAverageTicket()
```

### Data Flow

```
User Action (Filter Change)
    ↓
Frontend (dashboard.js)
    ↓
AJAX Request (useFetch)
    ↓
Controller (ctrl-pedidos.php)
    ↓
Model (mdl-pedidos.php)
    ↓
Database Query
    ↓
Response (JSON)
    ↓
Frontend Rendering
```

## Components and Interfaces

### Frontend Components

#### 1. Dashboard Class

```javascript
class Dashboard extends Templates {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "Dashboard";
    }
}
```


**Key Methods:**

- `render()`: Inicializa el dashboard llamando a layout() y cargando datos iniciales
- `layout()`: Crea la estructura base usando primaryLayout() y tabLayout()
- `filterBar()`: Renderiza filtros de sucursal y período de comparación
- `renderMetrics()`: Genera las 4 tarjetas de métricas principales
- `renderCharts()`: Crea el gráfico de barras de pedidos por estado
- `renderTables()`: Renderiza las tablas de rankings (productos y clientes)

#### 2. Filter Bar Component

```javascript
this.createfilterBar({
    parent: `filterBar${this.PROJECT_NAME}`,
    data: [
        {
            opc: "select",
            id: "sucursal",
            lbl: "Sucursal",
            class: "col-sm-4",
            data: lsSucursales,
            onchange: "dashboard.loadDashboard()"
        },
        {
            opc: "select",
            id: "periodo",
            lbl: "Comparar con",
            class: "col-sm-4",
            data: [
                { id: "month", valor: "Mes anterior" },
                { id: "year", valor: "Año anterior" }
            ],
            onchange: "dashboard.loadDashboard()"
        }
    ]
});
```

#### 3. Metrics Cards Component

```javascript
this.infoCard({
    parent: "metricsContainer",
    theme: "dark",
    json: [
        {
            id: "cardCotizaciones",
            title: "Cotizaciones del Mes",
            data: {
                value: data.cotizaciones.count,
                description: `${data.cotizaciones.variation}% vs período anterior`,
                color: data.cotizaciones.variation > 0 ? "text-green-400" : "text-red-400"
            }
        },
        // ... más tarjetas
    ]
});
```

#### 4. Bar Chart Component

```javascript
this.barChart({
    parent: "chartPedidosEstado",
    id: "chartBar",
    title: "Pedidos por Estado",
    labels: ["Cotizaciones", "Pagados", "Cancelados"],
    dataA: data.currentMonth,
    dataB: data.previousMonth,
    yearA: currentYear,
    yearB: previousYear
});
```


### Controller Layer

#### API Dashboard Method

```php
function apiDashboard() {
    $status = 500;
    $message = 'Error al obtener datos del dashboard';
    $data = null;

    try {
        $month = $_POST['month'] ?? date('n');
        $year = $_POST['year'] ?? date('Y');
        $subsidiariesId = $_POST['sucursal'] ?? 'all';
        $comparisonType = $_POST['periodo'] ?? 'month';

        // Calcular período de comparación
        if ($comparisonType === 'month') {
            $prevMonth = $month == 1 ? 12 : $month - 1;
            $prevYear = $month == 1 ? $year - 1 : $year;
        } else {
            $prevMonth = $month;
            $prevYear = $year - 1;
        }

        // Obtener métricas del mes actual
        $currentMetrics = $this->getDashboardMetrics([
            'month' => $month,
            'year' => $year,
            'subsidiariesId' => $subsidiariesId
        ]);

        // Obtener métricas del período anterior
        $previousMetrics = $this->getDashboardMetrics([
            'month' => $prevMonth,
            'year' => $prevYear,
            'subsidiariesId' => $subsidiariesId
        ]);

        // Calcular variaciones
        $data = [
            'cotizaciones' => [
                'count' => $currentMetrics['cotizaciones'],
                'variation' => $this->calculateVariation(
                    $currentMetrics['cotizaciones'],
                    $previousMetrics['cotizaciones']
                )
            ],
            'ventasTotales' => [
                'amount' => $currentMetrics['ventasTotales'],
                'variation' => $this->calculateVariation(
                    $currentMetrics['ventasTotales'],
                    $previousMetrics['ventasTotales']
                )
            ],
            'ingresos' => [
                'amount' => $currentMetrics['ingresos'],
                'variation' => $this->calculateVariation(
                    $currentMetrics['ingresos'],
                    $previousMetrics['ingresos']
                )
            ],
            'pendienteCobrar' => [
                'amount' => $currentMetrics['pendienteCobrar'],
                'count' => $currentMetrics['pedidosPendientes']
            ],
            'chequePromedio' => [
                'amount' => $currentMetrics['chequePromedio'],
                'variation' => $this->calculateVariation(
                    $currentMetrics['chequePromedio'],
                    $previousMetrics['chequePromedio']
                )
            ],
            'chartData' => $this->getChartData([
                'month' => $month,
                'year' => $year,
                'subsidiariesId' => $subsidiariesId
            ]),
            'topProducts' => $this->getTopProducts([
                'month' => $month,
                'year' => $year,
                'subsidiariesId' => $subsidiariesId,
                'limit' => 10
            ]),
            'topClients' => $this->getTopClients([
                'month' => $month,
                'year' => $year,
                'subsidiariesId' => $subsidiariesId,
                'limit' => 10
            ])
        ];

        $status = 200;
        $message = 'Datos obtenidos correctamente';

    } catch (Exception $e) {
        $message = 'Error: ' . $e->getMessage();
    }

    return [
        'status' => $status,
        'message' => $message,
        'data' => $data
    ];
}
```


#### Helper Methods

```php
private function calculateVariation($current, $previous) {
    if ($previous == 0) return 0;
    return round((($current - $previous) / $previous) * 100, 2);
}

function getDashboardMetrics($params) {
    $month = $params['month'];
    $year = $params['year'];
    $subsidiariesId = $params['subsidiariesId'];

    return [
        'cotizaciones' => $this->countOrdersByStatus([1, $month, $year, $subsidiariesId]),
        'ventasTotales' => $this->sumOrdersByStatus([2, 3], $month, $year, $subsidiariesId),
        'ingresos' => $this->sumPaidOrders($month, $year, $subsidiariesId),
        'pendienteCobrar' => $this->sumPendingBalance($month, $year, $subsidiariesId),
        'pedidosPendientes' => $this->countPendingOrders($month, $year, $subsidiariesId),
        'chequePromedio' => $this->calculateAverageTicket($month, $year, $subsidiariesId)
    ];
}

function getTopProducts($params) {
    $products = $this->getProductSales($params);
    $rows = [];

    foreach ($products as $index => $product) {
        $rows[] = [
            '#' => $index + 1,
            'Producto' => $product['name'],
            'Cantidad' => $product['quantity']
        ];
    }

    return ['row' => $rows];
}

function getTopClients($params) {
    $clients = $this->getClientPurchases($params);
    $rows = [];

    foreach ($clients as $index => $client) {
        $rows[] = [
            '#' => $index + 1,
            'Cliente' => $client['name'],
            'Compras' => $client['purchases'],
            'Total' => evaluar($client['total'])
        ];
    }

    return ['row' => $rows];
}
```

### Model Layer

#### Database Queries

**1. Count Orders by Status**

```php
function countOrdersByStatus($params) {
    list($status, $month, $year, $subsidiariesId) = $params;
    
    $where = "MONTH(date_creation) = ? AND YEAR(date_creation) = ? AND status = ?";
    $data = [$month, $year, $status];
    
    if ($subsidiariesId !== 'all') {
        $where .= " AND subsidiaries_id = ?";
        $data[] = $subsidiariesId;
    }
    
    $query = "SELECT COUNT(*) as count FROM {$this->bd}pedidos_orders WHERE $where";
    $result = $this->_Read($query, $data);
    
    return $result[0]['count'] ?? 0;
}
```


**2. Sum Orders by Status**

```php
function sumOrdersByStatus($statuses, $month, $year, $subsidiariesId) {
    $statusList = implode(',', $statuses);
    $where = "MONTH(date_creation) = ? AND YEAR(date_creation) = ? AND status IN ($statusList)";
    $data = [$month, $year];
    
    if ($subsidiariesId !== 'all') {
        $where .= " AND subsidiaries_id = ?";
        $data[] = $subsidiariesId;
    }
    
    $query = "SELECT COALESCE(SUM(total_pay - COALESCE(discount, 0)), 0) as total 
              FROM {$this->bd}pedidos_orders WHERE $where";
    $result = $this->_Read($query, $data);
    
    return $result[0]['total'] ?? 0;
}
```

**3. Sum Paid Orders (Ingresos)**

```php
function sumPaidOrders($month, $year, $subsidiariesId) {
    $where = "MONTH(p.date_pay) = ? AND YEAR(p.date_pay) = ?";
    $data = [$month, $year];
    
    if ($subsidiariesId !== 'all') {
        $where .= " AND o.subsidiaries_id = ?";
        $data[] = $subsidiariesId;
    }
    
    $query = "SELECT COALESCE(SUM(p.pay), 0) as total 
              FROM {$this->bd}pedidos_payments p
              INNER JOIN {$this->bd}pedidos_orders o ON p.order_id = o.id
              WHERE $where";
    $result = $this->_Read($query, $data);
    
    return $result[0]['total'] ?? 0;
}
```

**4. Sum Pending Balance**

```php
function sumPendingBalance($month, $year, $subsidiariesId) {
    $where = "MONTH(o.date_creation) = ? AND YEAR(o.date_creation) = ? AND o.status IN (1, 2)";
    $data = [$month, $year];
    
    if ($subsidiariesId !== 'all') {
        $where .= " AND o.subsidiaries_id = ?";
        $data[] = $subsidiariesId;
    }
    
    $query = "SELECT COALESCE(SUM(
                  (o.total_pay - COALESCE(o.discount, 0)) - 
                  COALESCE((SELECT SUM(p.pay) FROM {$this->bd}pedidos_payments p WHERE p.order_id = o.id), 0)
              ), 0) as pending
              FROM {$this->bd}pedidos_orders o
              WHERE $where";
    $result = $this->_Read($query, $data);
    
    return $result[0]['pending'] ?? 0;
}
```

**5. Calculate Average Ticket**

```php
function calculateAverageTicket($month, $year, $subsidiariesId) {
    $where = "MONTH(date_creation) = ? AND YEAR(date_creation) = ? AND status IN (2, 3)";
    $data = [$month, $year];
    
    if ($subsidiariesId !== 'all') {
        $where .= " AND subsidiaries_id = ?";
        $data[] = $subsidiariesId;
    }
    
    $query = "SELECT 
                  COALESCE(AVG(total_pay - COALESCE(discount, 0)), 0) as average
              FROM {$this->bd}pedidos_orders
              WHERE $where";
    $result = $this->_Read($query, $data);
    
    return $result[0]['average'] ?? 0;
}
```


**6. Get Product Sales (Top 10)**

```php
function getProductSales($params) {
    $month = $params['month'];
    $year = $params['year'];
    $subsidiariesId = $params['subsidiariesId'];
    $limit = $params['limit'];
    
    $where = "MONTH(o.date_creation) = ? AND YEAR(o.date_creation) = ? AND o.status != 4";
    $data = [$month, $year];
    
    if ($subsidiariesId !== 'all') {
        $where .= " AND o.subsidiaries_id = ?";
        $data[] = $subsidiariesId;
    }
    
    $query = "SELECT 
                  p.name,
                  SUM(od.quantity) as quantity
              FROM {$this->bd}pedidos_order_details od
              INNER JOIN {$this->bd}pedidos_products p ON od.product_id = p.id
              INNER JOIN {$this->bd}pedidos_orders o ON od.order_id = o.id
              WHERE $where
              GROUP BY p.id, p.name
              ORDER BY quantity DESC
              LIMIT $limit";
    
    return $this->_Read($query, $data);
}
```

**7. Get Client Purchases (Top 10)**

```php
function getClientPurchases($params) {
    $month = $params['month'];
    $year = $params['year'];
    $subsidiariesId = $params['subsidiariesId'];
    $limit = $params['limit'];
    
    $where = "MONTH(o.date_creation) = ? AND YEAR(o.date_creation) = ? AND o.status != 4";
    $data = [$month, $year];
    
    if ($subsidiariesId !== 'all') {
        $where .= " AND o.subsidiaries_id = ?";
        $data[] = $subsidiariesId;
    }
    
    $query = "SELECT 
                  c.name,
                  COUNT(o.id) as purchases,
                  SUM(o.total_pay - COALESCE(o.discount, 0)) as total
              FROM {$this->bd}pedidos_orders o
              INNER JOIN {$this->bd}pedidos_clients c ON o.client_id = c.id
              WHERE $where
              GROUP BY c.id, c.name
              ORDER BY purchases DESC, total DESC
              LIMIT $limit";
    
    return $this->_Read($query, $data);
}
```

**8. Get Chart Data (Orders by Status)**

```php
function getChartData($params) {
    $month = $params['month'];
    $year = $params['year'];
    $subsidiariesId = $params['subsidiariesId'];
    
    $where = "MONTH(date_creation) = ? AND YEAR(date_creation) = ?";
    $data = [$month, $year];
    
    if ($subsidiariesId !== 'all') {
        $where .= " AND subsidiaries_id = ?";
        $data[] = $subsidiariesId;
    }
    
    $query = "SELECT 
                  status,
                  COUNT(*) as count
              FROM {$this->bd}pedidos_orders
              WHERE $where
              GROUP BY status";
    
    $result = $this->_Read($query, $data);
    
    // Formatear datos para Chart.js
    $chartData = [
        'labels' => ['Cotizaciones', 'Abonados', 'Pagados', 'Cancelados'],
        'data' => [0, 0, 0, 0]
    ];
    
    foreach ($result as $row) {
        $chartData['data'][$row['status'] - 1] = $row['count'];
    }
    
    return $chartData;
}
```


## Data Models

### Request Model (Frontend → Backend)

```javascript
{
    opc: "apiDashboard",
    month: 1,              // 1-12
    year: 2025,
    sucursal: "all",       // "all" o ID de sucursal
    periodo: "month"       // "month" o "year"
}
```

### Response Model (Backend → Frontend)

```javascript
{
    status: 200,
    message: "Datos obtenidos correctamente",
    data: {
        cotizaciones: {
            count: 245,
            variation: 12.5
        },
        ventasTotales: {
            amount: 875320,
            variation: 8.3
        },
        ingresos: {
            amount: 763190,
            variation: 5.7
        },
        pendienteCobrar: {
            amount: 112130,
            count: 42
        },
        chequePromedio: {
            amount: 4456.73,
            variation: -2.1
        },
        chartData: {
            labels: ["Cotizaciones", "Abonados", "Pagados", "Cancelados"],
            data: [245, 42, 156, 18]
        },
        topProducts: {
            row: [
                { "#": 1, "Producto": "Pastel Tres Leches", "Cantidad": 89 },
                { "#": 2, "Producto": "Pastel Chocolate", "Cantidad": 76 },
                // ... más productos
            ]
        },
        topClients: {
            row: [
                { "#": 1, "Cliente": "María González", "Compras": 24, "Total": "$45,890" },
                { "#": 2, "Cliente": "Juan Pérez", "Compras": 21, "Total": "$38,750" },
                // ... más clientes
            ]
        }
    }
}
```

### Database Schema

**Tablas principales:**

```sql
pedidos_orders
├── id (PK)
├── client_id (FK)
├── subsidiaries_id (FK)
├── status (1=Cotización, 2=Abonado, 3=Pagado, 4=Cancelado)
├── total_pay
├── discount
├── date_creation
├── date_order
└── time_order

pedidos_order_details
├── id (PK)
├── order_id (FK)
├── product_id (FK)
├── quantity
└── price

pedidos_payments
├── id (PK)
├── order_id (FK)
├── pay
├── date_pay
└── method_pay_id (FK)

pedidos_products
├── id (PK)
├── name
├── price
└── active

pedidos_clients
├── id (PK)
├── name
├── phone
├── email
└── subsidiaries_id (FK)
```


## Error Handling

### Frontend Error Handling

```javascript
async loadDashboard() {
    try {
        const sucursal = $('#filterBarDashboard #sucursal').val();
        const periodo = $('#filterBarDashboard #periodo').val();
        const currentDate = new Date();
        
        const response = await useFetch({
            url: this._link,
            data: {
                opc: "apiDashboard",
                month: currentDate.getMonth() + 1,
                year: currentDate.getFullYear(),
                sucursal: sucursal,
                periodo: periodo
            }
        });
        
        if (response.status === 200) {
            this.renderMetrics(response.data);
            this.renderCharts(response.data);
            this.renderTables(response.data);
        } else {
            alert({
                icon: "error",
                title: "Error",
                text: response.message || "No se pudieron cargar los datos del dashboard",
                btn1: true,
                btn1Text: "Aceptar"
            });
        }
    } catch (error) {
        console.error('Error loading dashboard:', error);
        alert({
            icon: "error",
            title: "Error de conexión",
            text: "No se pudo conectar con el servidor. Por favor, intente nuevamente.",
            btn1: true,
            btn1Text: "Aceptar"
        });
    }
}
```

### Backend Error Handling

```php
function apiDashboard() {
    $status = 500;
    $message = 'Error al obtener datos del dashboard';
    $data = null;

    try {
        // Validar parámetros requeridos
        if (!isset($_POST['month']) || !isset($_POST['year'])) {
            throw new Exception('Parámetros month y year son requeridos');
        }
        
        $month = intval($_POST['month']);
        $year = intval($_POST['year']);
        
        // Validar rangos
        if ($month < 1 || $month > 12) {
            throw new Exception('El mes debe estar entre 1 y 12');
        }
        
        if ($year < 2020 || $year > 2100) {
            throw new Exception('Año inválido');
        }
        
        // Procesar datos...
        
        $status = 200;
        $message = 'Datos obtenidos correctamente';
        
    } catch (Exception $e) {
        $status = 400;
        $message = $e->getMessage();
        error_log("Error en apiDashboard: " . $e->getMessage());
    }

    return [
        'status' => $status,
        'message' => $message,
        'data' => $data
    ];
}
```

### Database Error Handling

```php
function getProductSales($params) {
    try {
        $query = "SELECT ...";
        $result = $this->_Read($query, $data);
        
        if ($result === false) {
            throw new Exception('Error al ejecutar consulta de productos');
        }
        
        return $result;
        
    } catch (Exception $e) {
        error_log("Error en getProductSales: " . $e->getMessage());
        return [];
    }
}
```


## Testing Strategy

### Unit Tests

**Frontend Tests:**

1. **Filter Change Tests**
   - Verificar que al cambiar el filtro de sucursal se actualicen los datos
   - Verificar que al cambiar el período de comparación se recalculen las variaciones
   - Verificar que los filtros mantengan su estado después de actualizar

2. **Data Rendering Tests**
   - Verificar que las tarjetas de métricas muestren los valores correctos
   - Verificar que los gráficos se rendericen con los datos correctos
   - Verificar que las tablas muestren el formato correcto de números y monedas

3. **Error Handling Tests**
   - Verificar que se muestre un mensaje de error cuando falla la petición
   - Verificar que se maneje correctamente una respuesta vacía
   - Verificar que se muestre un loader mientras cargan los datos

**Backend Tests:**

1. **Controller Tests**
   - Verificar que apiDashboard retorne status 200 con datos válidos
   - Verificar que se calculen correctamente las variaciones porcentuales
   - Verificar que se manejen correctamente los parámetros opcionales
   - Verificar que se validen los rangos de mes y año

2. **Model Tests**
   - Verificar que countOrdersByStatus retorne el conteo correcto
   - Verificar que sumOrdersByStatus calcule correctamente los totales
   - Verificar que getProductSales retorne los productos ordenados por cantidad
   - Verificar que getClientPurchases retorne los clientes ordenados por compras
   - Verificar que calculateAverageTicket calcule correctamente el promedio

3. **Query Performance Tests**
   - Verificar que las consultas se ejecuten en menos de 500ms
   - Verificar que se utilicen índices apropiados
   - Verificar que no haya N+1 queries

### Integration Tests

1. **End-to-End Flow**
   - Cargar dashboard → Verificar que se muestren todos los componentes
   - Cambiar filtro de sucursal → Verificar que se actualicen todos los datos
   - Cambiar período de comparación → Verificar que se recalculen las variaciones

2. **Data Consistency**
   - Verificar que la suma de pedidos por estado coincida con el total de pedidos
   - Verificar que el monto de ingresos no supere el monto de ventas totales
   - Verificar que el pendiente por cobrar sea la diferencia entre ventas e ingresos

### Manual Testing Checklist

- [ ] Dashboard carga correctamente en primera vista
- [ ] Filtros funcionan correctamente
- [ ] Tarjetas de métricas muestran datos correctos
- [ ] Gráfico de barras se renderiza correctamente
- [ ] Tabla de pedidos por estado muestra datos correctos
- [ ] Top 10 productos muestra el ranking correcto
- [ ] Top 10 clientes muestra el ranking correcto
- [ ] Variaciones porcentuales se calculan correctamente
- [ ] Formato de moneda es correcto ($XX,XXX.XX)
- [ ] Colores de variación son correctos (verde/rojo)
- [ ] Dashboard es responsive en móvil
- [ ] Dashboard es responsive en tablet
- [ ] Manejo de errores funciona correctamente
- [ ] Performance es aceptable (< 3 segundos carga inicial)


## Performance Optimization

### Database Optimization

**Índices recomendados:**

```sql
-- Índice compuesto para consultas por fecha y sucursal
CREATE INDEX idx_orders_date_subsidiary ON pedidos_orders(date_creation, subsidiaries_id, status);

-- Índice para consultas de pagos por fecha
CREATE INDEX idx_payments_date ON pedidos_payments(date_pay, order_id);

-- Índice para detalles de pedido
CREATE INDEX idx_order_details_order_product ON pedidos_order_details(order_id, product_id);

-- Índice para clientes por sucursal
CREATE INDEX idx_clients_subsidiary ON pedidos_clients(subsidiaries_id, active);
```

**Query Optimization:**

1. Usar `COALESCE` para manejar valores NULL en agregaciones
2. Limitar resultados con `LIMIT` en rankings
3. Usar `INNER JOIN` en lugar de subconsultas cuando sea posible
4. Evitar `SELECT *`, especificar solo columnas necesarias

### Frontend Optimization

**Lazy Loading:**

```javascript
// Cargar gráficos solo cuando sean visibles
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            this.renderCharts(this.cachedData);
            observer.unobserve(entry.target);
        }
    });
});

observer.observe(document.getElementById('chartContainer'));
```

**Caching:**

```javascript
class Dashboard extends Templates {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.cachedData = null;
        this.cacheTimestamp = null;
        this.CACHE_DURATION = 5 * 60 * 1000; // 5 minutos
    }
    
    async loadDashboard() {
        const now = Date.now();
        
        // Usar caché si es válido
        if (this.cachedData && 
            this.cacheTimestamp && 
            (now - this.cacheTimestamp) < this.CACHE_DURATION) {
            this.renderAll(this.cachedData);
            return;
        }
        
        // Cargar datos frescos
        const response = await useFetch({...});
        
        if (response.status === 200) {
            this.cachedData = response.data;
            this.cacheTimestamp = now;
            this.renderAll(response.data);
        }
    }
}
```

**Debouncing:**

```javascript
filterBar() {
    let debounceTimer;
    
    this.createfilterBar({
        parent: `filterBar${this.PROJECT_NAME}`,
        data: [
            {
                opc: "select",
                id: "sucursal",
                lbl: "Sucursal",
                onchange: () => {
                    clearTimeout(debounceTimer);
                    debounceTimer = setTimeout(() => {
                        this.loadDashboard();
                    }, 300);
                }
            }
        ]
    });
}
```

### Response Time Targets

- **Carga inicial:** < 3 segundos
- **Cambio de filtro:** < 1 segundo
- **Renderizado de gráficos:** < 500ms
- **Actualización de tablas:** < 300ms


## UI/UX Design

### Color Palette (CoffeeSoft Corporate)

```css
/* Primary Colors */
--color-primary: #103B60;      /* Azul corporativo */
--color-secondary: #8CC63F;    /* Verde acción */
--color-background: #1F2A37;   /* Fondo oscuro */
--color-card: #283341;         /* Fondo de tarjetas */

/* Status Colors */
--color-success: #3FC189;      /* Verde éxito */
--color-warning: #F2C215;      /* Amarillo advertencia */
--color-danger: #E05562;       /* Rojo peligro */
--color-info: #2A55A3;         /* Azul información */

/* Text Colors */
--color-text-primary: #FFFFFF;
--color-text-secondary: #9CA3AF;
--color-text-muted: #6B7280;
```

### Layout Structure

```
┌─────────────────────────────────────────────────────────┐
│  Header: "📊 Dashboard de Pedidos"                      │
├─────────────────────────────────────────────────────────┤
│  Filters: [Sucursal ▼] [Comparar con ▼]                │
├─────────────────────────────────────────────────────────┤
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │Cotizacio │ │  Ventas  │ │ Ingresos │ │Pendiente │  │
│  │   245    │ │ $875,320 │ │ $763,190 │ │ $112,130 │  │
│  │ +12.5% ↑ │ │ +8.3% ↑  │ │ +5.7% ↑  │ │ 42 pedid │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘  │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────────────────┐ ┌─────────────────────────┐│
│  │ Pedidos por Estado      │ │ Pedidos Este Mes        ││
│  │ [Gráfico de Barras]     │ │ [Tabla]                 ││
│  │                         │ │ Estado | No. | Venta    ││
│  │                         │ │ Pagados| 156 | $875,320 ││
│  │                         │ │ Abonado| 42  | $112,130 ││
│  └─────────────────────────┘ └─────────────────────────┘│
├─────────────────────────────────────────────────────────┤
│  ┌─────────────────────────┐ ┌─────────────────────────┐│
│  │ Top 10 Productos        │ │ Top 10 Clientes         ││
│  │ [Tabla con Ranking]     │ │ [Tabla con Ranking]     ││
│  │ # | Producto | Cantidad │ │ # | Cliente | Compras  ││
│  │ 1 | Tres Lec | 89       │ │ 1 | María G | 24       ││
│  │ 2 | Chocolat | 76       │ │ 2 | Juan P  | 21       ││
│  └─────────────────────────┘ └─────────────────────────┘│
└─────────────────────────────────────────────────────────┘
```

### Responsive Breakpoints

```javascript
// Desktop (> 1024px)
- Grid de 4 columnas para tarjetas
- Gráficos y tablas lado a lado (2 columnas)
- Ancho completo para rankings

// Tablet (768px - 1024px)
- Grid de 2 columnas para tarjetas
- Gráficos y tablas apilados (1 columna)
- Ancho completo para rankings

// Mobile (< 768px)
- Grid de 1 columna para tarjetas
- Todos los elementos apilados
- Tablas con scroll horizontal
```

### Animation Guidelines

```css
/* Transiciones suaves */
.metric-card {
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.metric-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

/* Animación de carga */
@keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
}

.loading {
    animation: pulse 1.5s ease-in-out infinite;
}

/* Animación de números */
.counter {
    transition: all 0.5s ease-out;
}
```

### Accessibility

- Usar etiquetas semánticas HTML5 (`<section>`, `<article>`, `<header>`)
- Incluir atributos `aria-label` en gráficos y tablas
- Asegurar contraste mínimo de 4.5:1 para texto
- Soportar navegación por teclado (Tab, Enter, Escape)
- Incluir tooltips descriptivos en elementos interactivos

