# Design Document

## Overview

El módulo de **Redes Sociales** es un sistema de análisis y gestión de métricas de redes sociales diseñado para el departamento de Publicidad. El sistema sigue la arquitectura MVC de CoffeeSoft, utilizando jQuery + TailwindCSS en el frontend y PHP con MySQL en el backend.

El diseño se basa en los pivotes de referencia:
- **Pivote Admin**: Para la gestión CRUD de redes sociales y métricas
- **Pivote Analytics Ventas**: Para el dashboard, visualizaciones y comparativas

## Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend Layer                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Dashboard   │  │   Capture    │  │    Admin     │      │
│  │  Component   │  │  Component   │  │  Component   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│           │                │                 │               │
│           └────────────────┴─────────────────┘               │
│                          │                                   │
│                   ┌──────▼──────┐                           │
│                   │   App.js    │                           │
│                   │  (Templates)│                           │
│                   └──────┬──────┘                           │
└──────────────────────────┼──────────────────────────────────┘
                           │
                    ┌──────▼──────┐
                    │   AJAX/     │
                    │  useFetch   │
                    └──────┬──────┘
┌──────────────────────────┼──────────────────────────────────┐
│                   Backend Layer                              │
│                   ┌──────▼──────┐                           │
│                   │ctrl-campaign│                           │
│                   │    .php     │                           │
│                   └──────┬──────┘                           │
│                          │                                   │
│                   ┌──────▼──────┐                           │
│                   │mdl-campaign │                           │
│                   │    .php     │                           │
│                   └──────┬──────┘                           │
└──────────────────────────┼──────────────────────────────────┘
                           │
                    ┌──────▼──────┐
                    │   MySQL     │
                    │  Database   │
                    └─────────────┘
```

### Module Structure

```
kpi/
├── index.php                          # Punto de entrada con <div id="root"></div>
├── ctrl/
│   └── ctrl-campaign.php              # Controlador principal
├── mdl/
│   └── mdl-campaign.php               # Modelo de datos
└── js/
    └── campaign.js                    # Frontend principal
```

### Database Schema

```sql
-- Tabla de redes sociales
CREATE TABLE kpi_social_networks (
    id INT PRIMARY KEY AUTO_INCREMENT,
    subsidiaries_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    icon VARCHAR(50),
    color VARCHAR(20),
    description TEXT,
    active TINYINT(1) DEFAULT 1,
    date_creation DATETIME,
    UNIQUE KEY unique_network (subsidiaries_id, name)
);

-- Tabla de métricas
CREATE TABLE kpi_metrics (
    id INT PRIMARY KEY AUTO_INCREMENT,
    subsidiaries_id INT NOT NULL,
    social_network_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    active TINYINT(1) DEFAULT 1,
    date_creation DATETIME,
    FOREIGN KEY (social_network_id) REFERENCES kpi_social_networks(id),
    UNIQUE KEY unique_metric (subsidiaries_id, social_network_id, name)
);

-- Tabla de capturas mensuales
CREATE TABLE kpi_social_captures (
    id INT PRIMARY KEY AUTO_INCREMENT,
    subsidiaries_id INT NOT NULL,
    social_network_id INT NOT NULL,
    year INT NOT NULL,
    month INT NOT NULL,
    date_creation DATETIME,
    user_id INT,
    UNIQUE KEY unique_capture (subsidiaries_id, social_network_id, year, month)
);

-- Tabla de movimientos de métricas
CREATE TABLE kpi_metric_movements (
    id INT PRIMARY KEY AUTO_INCREMENT,
    capture_id INT NOT NULL,
    metric_id INT NOT NULL,
    value DECIMAL(15,2) NOT NULL,
    date_creation DATETIME,
    FOREIGN KEY (capture_id) REFERENCES kpi_social_captures(id),
    FOREIGN KEY (metric_id) REFERENCES kpi_metrics(id)
);
```

## Components and Interfaces

### Frontend Components

#### 1. App Class (Main Controller)

```javascript
class App extends Templates {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "SocialNetworks";
    }
    
    render() {
        this.layout();
        // Inicializar submódulos
    }
    
    layout() {
        // Estructura principal con tabs
        this.primaryLayout({...});
        this.tabLayout({
            json: [
                { id: "dashboard", tab: "Dashboard", active: true },
                { id: "capture", tab: "Captura de información" },
                { id: "adminMetrics", tab: "Administrador de métricas" },
                { id: "adminNetworks", tab: "Administrador de redes sociales" }
            ]
        });
    }
}
```

#### 2. DashboardSocialNetwork Class

Hereda de `App` y maneja la visualización del dashboard.

**Métodos principales:**
- `render()`: Renderiza el dashboard completo
- `layout()`: Estructura visual con tarjetas KPI y gráficas
- `filterBar()`: Filtros de UDN, año y mes
- `showCards()`: Muestra tarjetas con métricas principales
- `trendChart()`: Gráfica de tendencia de interacciones
- `comparativeTable()`: Tabla de resumen general de métricas
- `monthlyComparative()`: Comparativa mensual por red social

#### 3. RegisterSocialNetWork Class

Hereda de `App` y maneja la captura de información.

**Métodos principales:**
- `render()`: Renderiza el módulo de captura
- `layout()`: Estructura con filtros y contenedor de captura
- `filterBar()`: Filtros de UDN, red social, año y tipo de reporte
- `createCapture()`: Componente para nueva captura mensual
- `showAnnualReport()`: Concentrado anual de métricas
- `showMonthlyComparative()`: Comparativa mensual
- `showAnnualComparative()`: Comparativa anual
- `addMetricMovement()`: Agregar movimiento de métrica
- `editMetricMovement()`: Editar movimiento existente
- `deleteMetricMovement()`: Eliminar movimiento

#### 4. AdminMetrics Class

Hereda de `App` y maneja el CRUD de métricas.

**Métodos principales:**
- `render()`: Renderiza el administrador de métricas
- `layout()`: Estructura con filtros y tabla
- `filterBar()`: Filtros de UDN y estado
- `lsMetrics()`: Lista de métricas con tabla CoffeeSoft
- `addMetric()`: Modal para agregar métrica
- `editMetric(id)`: Modal para editar métrica
- `statusMetric(id, active)`: Cambiar estado de métrica

#### 5. AdminSocialNetWork Class

Hereda de `App` y maneja el CRUD de redes sociales.

**Métodos principales:**
- `render()`: Renderiza el administrador de redes sociales
- `layout()`: Estructura con filtros y tabla
- `filterBar()`: Filtros de UDN y estado
- `lsSocialNetworks()`: Lista de redes sociales con tabla CoffeeSoft
- `addSocialNetwork()`: Modal para agregar red social
- `editSocialNetwork(id)`: Modal para editar red social
- `statusSocialNetwork(id, active)`: Cambiar estado de red social

### Backend Components

#### Controller (ctrl-campaign.php)

**Métodos principales:**

```php
class ctrl extends mdl {
    // Inicialización
    function init() // Retorna listas para filtros (UDN, redes sociales, métricas)
    
    // Dashboard
    function lsDashboard() // Datos del dashboard
    function apiDashboardMetrics() // Métricas para tarjetas KPI
    function apiTrendChart() // Datos para gráfica de tendencias
    function apiComparativeTable() // Tabla de resumen general
    
    // Captura
    function lsCaptures() // Lista de capturas
    function getCapture() // Obtener captura específica
    function addCapture() // Crear nueva captura mensual
    function editCapture() // Editar captura existente
    function addMetricMovement() // Agregar movimiento de métrica
    function editMetricMovement() // Editar movimiento
    function deleteMetricMovement() // Eliminar movimiento
    function apiAnnualReport() // Concentrado anual
    function apiMonthlyComparative() // Comparativa mensual
    function apiAnnualComparative() // Comparativa anual
    
    // Admin Métricas
    function lsMetrics() // Lista de métricas
    function getMetric() // Obtener métrica por ID
    function addMetric() // Crear métrica
    function editMetric() // Editar métrica
    function statusMetric() // Cambiar estado
    
    // Admin Redes Sociales
    function lsSocialNetworks() // Lista de redes sociales
    function getSocialNetwork() // Obtener red social por ID
    function addSocialNetwork() // Crear red social
    function editSocialNetwork() // Editar red social
    function statusSocialNetwork() // Cambiar estado
}
```

#### Model (mdl-campaign.php)

**Métodos principales:**

```php
class mdl extends CRUD {
    // Dashboard
    function getDashboardMetrics($array) // Métricas del dashboard
    function getTrendData($array) // Datos de tendencias
    function getComparativeData($array) // Datos comparativos
    
    // Capturas
    function listCaptures($array) // Lista de capturas
    function getCaptureById($array) // Captura por ID
    function createCapture($array) // Crear captura
    function updateCapture($array) // Actualizar captura
    function existsCapture($array) // Validar existencia
    
    // Movimientos de métricas
    function listMetricMovements($array) // Movimientos por captura
    function createMetricMovement($array) // Crear movimiento
    function updateMetricMovement($array) // Actualizar movimiento
    function deleteMetricMovement($array) // Eliminar movimiento
    function getAnnualReport($array) // Reporte anual
    function getMonthlyComparative($array) // Comparativa mensual
    function getAnnualComparative($array) // Comparativa anual
    
    // Métricas
    function listMetrics($array) // Lista de métricas
    function getMetricById($array) // Métrica por ID
    function createMetric($array) // Crear métrica
    function updateMetric($array) // Actualizar métrica
    function existsMetricByName($array) // Validar existencia
    function lsMetricsByNetwork($array) // Métricas por red social
    
    // Redes Sociales
    function listSocialNetworks($array) // Lista de redes sociales
    function getSocialNetworkById($array) // Red social por ID
    function createSocialNetwork($array) // Crear red social
    function updateSocialNetwork($array) // Actualizar red social
    function existsSocialNetworkByName($array) // Validar existencia
    function lsSocialNetworks($array) // Para filtros select
}
```

## Data Models

### Social Network Model

```javascript
{
    id: number,
    subsidiaries_id: number,
    name: string,
    icon: string,
    color: string,
    description: string,
    active: boolean,
    date_creation: datetime
}
```

### Metric Model

```javascript
{
    id: number,
    subsidiaries_id: number,
    social_network_id: number,
    name: string,
    description: string,
    active: boolean,
    date_creation: datetime
}
```

### Capture Model

```javascript
{
    id: number,
    subsidiaries_id: number,
    social_network_id: number,
    year: number,
    month: number,
    date_creation: datetime,
    user_id: number,
    movements: [
        {
            metric_id: number,
            metric_name: string,
            value: number
        }
    ]
}
```

### Dashboard Metrics Model

```javascript
{
    totalReach: number,
    interactions: number,
    monthViews: number,
    totalInvestment: number,
    trendData: {
        labels: string[],
        datasets: [
            {
                label: string,
                data: number[],
                backgroundColor: string
            }
        ]
    },
    comparativeTable: [
        {
            platform: string,
            reach: number,
            interactions: number,
            followers: number,
            investment: number,
            roi: number
        }
    ]
}
```

## Error Handling

### Frontend Error Handling

1. **Validación de Formularios:**
   - Validar campos obligatorios antes de enviar
   - Validar formato de datos (números, fechas)
   - Mostrar mensajes de error específicos por campo

2. **Manejo de Respuestas AJAX:**
```javascript
success: (response) => {
    if (response.status === 200) {
        alert({ icon: "success", text: response.message });
        this.lsMetrics();
    } else if (response.status === 409) {
        alert({ icon: "warning", text: response.message });
    } else {
        alert({ icon: "error", text: response.message });
    }
}
```

3. **Validación de Permisos:**
   - Verificar acceso a UDN antes de mostrar datos
   - Deshabilitar acciones no permitidas

### Backend Error Handling

1. **Validación de Datos:**
```php
function addMetric() {
    $status = 500;
    $message = 'Error al agregar métrica';
    
    // Validar campos obligatorios
    if (empty($_POST['name']) || empty($_POST['social_network_id'])) {
        return [
            'status' => 400,
            'message' => 'Campos obligatorios faltantes'
        ];
    }
    
    // Validar duplicados
    $exists = $this->existsMetricByName([
        $_POST['name'],
        $_POST['social_network_id'],
        $_SESSION['SUB']
    ]);
    
    if ($exists) {
        return [
            'status' => 409,
            'message' => 'Ya existe una métrica con ese nombre'
        ];
    }
    
    // Crear métrica
    $create = $this->createMetric($this->util->sql($_POST));
    
    if ($create) {
        $status = 200;
        $message = 'Métrica agregada correctamente';
    }
    
    return [
        'status' => $status,
        'message' => $message
    ];
}
```

2. **Manejo de Transacciones:**
   - Usar transacciones para operaciones múltiples
   - Rollback en caso de error

3. **Logging de Errores:**
   - Registrar errores críticos
   - Incluir contexto (usuario, fecha, operación)

## Testing Strategy

### Unit Testing

1. **Frontend Tests:**
   - Validación de formularios
   - Cálculo de porcentajes de comparación
   - Formateo de datos para gráficas
   - Manejo de estados de componentes

2. **Backend Tests:**
   - Validación de datos de entrada
   - Lógica de negocio (cálculos de ROI, comparativas)
   - Consultas SQL (verificar resultados esperados)
   - Manejo de casos edge (divisiones por cero, datos faltantes)

### Integration Testing

1. **Frontend-Backend Integration:**
   - Flujo completo de captura de métricas
   - Actualización de dashboard tras captura
   - Sincronización de filtros entre módulos

2. **Database Integration:**
   - Integridad referencial (foreign keys)
   - Validación de unicidad (unique constraints)
   - Transacciones complejas

### User Acceptance Testing

1. **Escenarios de Prueba:**
   - Captura mensual completa de métricas
   - Comparación entre meses y años
   - Gestión de catálogos (redes sociales y métricas)
   - Visualización de dashboard con diferentes filtros

2. **Criterios de Aceptación:**
   - Todos los requerimientos funcionales cumplidos
   - Interfaz intuitiva y responsiva
   - Tiempos de respuesta aceptables (<2 segundos)
   - Datos precisos en comparativas y cálculos

### Performance Testing

1. **Métricas a Evaluar:**
   - Tiempo de carga del dashboard
   - Tiempo de respuesta de consultas con grandes volúmenes
   - Rendimiento de gráficas con múltiples datasets

2. **Optimizaciones:**
   - Índices en columnas de búsqueda frecuente
   - Caché de consultas repetitivas
   - Paginación en listados extensos
   - Lazy loading de gráficas

## Design Decisions and Rationales

### 1. Arquitectura Modular con Clases Separadas

**Decisión:** Crear clases separadas para cada submódulo (Dashboard, Capture, AdminMetrics, AdminSocialNetWork).

**Razón:** 
- Facilita el mantenimiento y escalabilidad
- Permite desarrollo paralelo de módulos
- Reduce acoplamiento entre componentes
- Sigue el principio de responsabilidad única

### 2. Uso de Tabs para Navegación

**Decisión:** Implementar navegación mediante tabs en lugar de páginas separadas.

**Razón:**
- Mejora la experiencia de usuario (sin recargas de página)
- Mantiene el contexto de filtros entre módulos
- Reduce el tiempo de navegación
- Sigue el patrón del pivote Analytics Ventas

### 3. Captura Mensual con Movimientos Separados

**Decisión:** Separar la captura mensual (header) de los movimientos de métricas (detalle).

**Razón:**
- Permite validar unicidad de captura por mes/año/UDN
- Facilita la edición de métricas individuales
- Mejora la integridad de datos
- Permite auditoría de cambios por métrica

### 4. Baja Lógica en lugar de Eliminación Física

**Decisión:** Usar campo `active` para deshabilitar registros en lugar de eliminarlos.

**Razón:**
- Preserva integridad referencial
- Mantiene historial de datos
- Permite recuperación de registros
- Facilita auditoría

### 5. Cálculo de ROI Simplificado

**Decisión:** ROI = (Alcance + Interacciones) / Inversión

**Razón:**
- Fórmula simple y comprensible
- Refleja el valor obtenido por inversión
- Permite comparación entre plataformas
- Basado en métricas disponibles

### 6. Uso de Chart.js para Visualizaciones

**Decisión:** Implementar gráficas con Chart.js siguiendo el patrón del pivote Analytics Ventas.

**Razón:**
- Librería probada y estable
- Amplia variedad de tipos de gráficos
- Fácil personalización con TailwindCSS
- Responsive y performante

### 7. Filtros Persistentes entre Tabs

**Decisión:** Mantener los valores de filtros al cambiar de tab.

**Razón:**
- Mejora la experiencia de usuario
- Reduce repetición de selecciones
- Facilita análisis comparativo
- Mantiene contexto de trabajo

### 8. Validación de Unicidad en Backend

**Decisión:** Validar duplicados en el controlador antes de insertar.

**Razón:**
- Previene errores de base de datos
- Proporciona mensajes de error claros
- Mejora la experiencia de usuario
- Reduce carga en la base de datos
