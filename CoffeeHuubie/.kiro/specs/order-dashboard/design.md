# Design Document

## Overview

El dashboard de pedidos será una aplicación JavaScript que utiliza el framework CoffeeSoft para crear una interfaz interactiva y responsiva. El sistema se integrará con el controlador de pedidos existente (`ctrl-pedidos.php`) para obtener métricas en tiempo real y presentarlas mediante tarjetas informativas y gráficos interactivos usando Chart.js.

## Architecture

### Frontend Architecture
- **Framework Base:** CoffeeSoft (Templates class)
- **Visualización:** Chart.js para gráficos interactivos
- **Estilos:** TailwindCSS para diseño responsivo
- **Comunicación:** useFetch() para llamadas AJAX al backend

### Backend Integration
- **API Endpoint:** `../pedidos/ctrl/ctrl-pedidos.php`
- **Métodos Nuevos:** Se agregarán métodos específicos para métricas del dashboard
- **Autenticación:** Uso de sesiones PHP existentes ($_SESSION)

### Data Flow
1. Frontend solicita datos via AJAX
2. Controlador procesa la solicitud y consulta el modelo
3. Modelo ejecuta queries SQL específicas
4. Datos se formatean y retornan como JSON
5. Frontend actualiza la interfaz con los nuevos datos

## Components and Interfaces

### Main Dashboard Class
```javascript
class OrderDashboard extends Templates {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "OrderDashboard";
        this.chartInstance = null;
    }
}
```

### Core Methods
- `init()`: Inicialización del dashboard
- `render()`: Renderizado principal de la interfaz
- `layout()`: Estructura base del dashboard
- `createFilterBar()`: Barra de filtros de fecha
- `loadMetrics()`: Carga de métricas principales
- `renderChart()`: Renderizado del gráfico interactivo
- `updateDashboard()`: Actualización de datos

### Dashboard Cards Structure
```javascript
// Estructura de tarjetas métricas
const dashboardCards = [
    {
        id: 'total-orders',
        title: 'Pedidos del Mes',
        icon: 'icon-shopping-cart',
        value: 0,
        color: 'blue'
    },
    {
        id: 'completed-sales',
        title: 'Ventas Completadas',
        icon: 'icon-check-circle',
        value: '$0.00',
        color: 'green'
    },
    {
        id: 'pending-sales',
        title: 'Ventas Pendientes',
        icon: 'icon-clock',
        value: '$0.00',
        color: 'yellow'
    }
];
```

### Chart Configuration
```javascript
const chartConfig = {
    type: 'line',
    options: {
        responsive: true,
        plugins: {
            legend: { display: false },
            tooltip: { 
                backgroundColor: '#1F2A37',
                titleColor: '#fff',
                bodyColor: '#fff'
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: { color: '#374151' },
                ticks: { color: '#9CA3AF' }
            },
            x: {
                grid: { color: '#374151' },
                ticks: { color: '#9CA3AF' }
            }
        }
    }
};
```

## Data Models

### Dashboard Metrics Response
```json
{
    "status": 200,
    "data": {
        "totalOrders": 45,
        "completedSales": {
            "count": 32,
            "amount": 15750.00
        },
        "pendingSales": {
            "count": 13,
            "amount": 8250.00
        },
        "chartData": {
            "labels": ["Sem 1", "Sem 2", "Sem 3", "Sem 4"],
            "datasets": [{
                "data": [12, 18, 8, 7],
                "borderColor": "#3B82F6",
                "backgroundColor": "transparent"
            }]
        }
    }
}
```

### Filter Parameters
```json
{
    "opc": "getDashboardMetrics",
    "month": 12,
    "year": 2024
}
```

## Backend Methods Design

### Controller Methods (ctrl-pedidos.php)
```php
// Nuevo método para métricas del dashboard
function getDashboardMetrics() {
    $month = $_POST['month'] ?? date('n');
    $year = $_POST['year'] ?? date('Y');
    
    $totalOrders = $this->getOrdersByMonth([$month, $year]);
    $completedSales = $this->getCompletedSales([$month, $year]);
    $pendingSales = $this->getPendingSales([$month, $year]);
    $chartData = $this->getOrdersChartData([$month, $year]);
    
    return [
        'status' => 200,
        'data' => [
            'totalOrders' => count($totalOrders),
            'completedSales' => $completedSales,
            'pendingSales' => $pendingSales,
            'chartData' => $chartData
        ]
    ];
}
```

### Model Methods (mdl-pedidos.php)
```php
// Consulta para pedidos por mes
function getOrdersByMonth($params) {
    return $this->_Select([
        'table' => "{$this->bd}pedidos_orders",
        'values' => "COUNT(*) as total",
        'where' => "MONTH(date_creation) = ? AND YEAR(date_creation) = ? AND subsidiaries_id = ?",
        'data' => [$params[0], $params[1], $_SESSION['SUB']]
    ]);
}

// Consulta para ventas completadas
function getCompletedSales($params) {
    return $this->_Select([
        'table' => "{$this->bd}pedidos_orders",
        'values' => "COUNT(*) as count, SUM(total_pay) as amount",
        'where' => "status = 3 AND MONTH(date_creation) = ? AND YEAR(date_creation) = ? AND subsidiaries_id = ?",
        'data' => [$params[0], $params[1], $_SESSION['SUB']]
    ]);
}
```

## User Interface Design

### Layout Structure
```html
<div id="OrderDashboard" class="p-6 bg-gray-900 min-h-screen">
    <!-- Header -->
    <div class="mb-6">
        <h1 class="text-3xl font-bold text-white">📊 Dashboard de Pedidos</h1>
        <p class="text-gray-400">Métricas y análisis en tiempo real</p>
    </div>
    
    <!-- Filter Bar -->
    <div id="filterBarOrderDashboard" class="mb-6"></div>
    
    <!-- Metrics Cards -->
    <div id="metricsCards" class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"></div>
    
    <!-- Chart Section -->
    <div id="chartSection" class="bg-gray-800 rounded-lg p-6">
        <canvas id="ordersChart"></canvas>
    </div>
</div>
```

### Responsive Design
- **Desktop:** Grid de 3 columnas para las tarjetas métricas
- **Tablet:** Grid de 2 columnas con ajuste automático
- **Mobile:** Columna única con tarjetas apiladas

### Color Scheme
- **Background:** Gray-900 (#111827)
- **Cards:** Gray-800 (#1F2937)
- **Primary:** Blue-500 (#3B82F6)
- **Success:** Green-500 (#10B981)
- **Warning:** Yellow-500 (#F59E0B)
- **Text:** White/Gray-300

## Error Handling

### Frontend Error Handling
```javascript
async loadMetrics() {
    try {
        const response = await useFetch({
            url: this._link,
            data: { opc: 'getDashboardMetrics', month: this.currentMonth, year: this.currentYear }
        });
        
        if (response.status === 200) {
            this.updateCards(response.data);
            this.updateChart(response.data.chartData);
        } else {
            this.showError('Error al cargar métricas: ' + response.message);
        }
    } catch (error) {
        this.showError('Error de conexión al servidor');
    }
}
```

### Backend Error Handling
```php
function getDashboardMetrics() {
    try {
        // Lógica de consulta
        return ['status' => 200, 'data' => $data];
    } catch (Exception $e) {
        return [
            'status' => 500,
            'message' => 'Error interno del servidor',
            'error' => $e->getMessage()
        ];
    }
}
```

## Testing Strategy

### Unit Testing
- Validación de métodos de consulta SQL
- Pruebas de formateo de datos
- Verificación de cálculos de métricas

### Integration Testing
- Comunicación frontend-backend
- Validación de respuestas JSON
- Pruebas de filtros de fecha

### User Interface Testing
- Responsividad en diferentes dispositivos
- Interactividad de gráficos
- Actualización de datos en tiempo real

### Performance Testing
- Tiempo de carga de métricas
- Optimización de consultas SQL
- Rendimiento de gráficos con grandes datasets

## Security Considerations

### Authentication
- Validación de sesión PHP activa
- Verificación de permisos de usuario
- Control de acceso por sucursal

### Data Validation
- Sanitización de parámetros de entrada
- Validación de rangos de fecha
- Prevención de inyección SQL

### Session Management
- Uso de $_SESSION para contexto de usuario
- Timeout de sesión automático
- Validación de subsidiaria activa