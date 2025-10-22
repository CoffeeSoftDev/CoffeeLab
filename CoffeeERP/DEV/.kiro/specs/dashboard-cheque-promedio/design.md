# Design Document

## Overview

El Dashboard Analítico de Cheque Promedio es una extensión del módulo existente de Analytics de Ventas que se enfoca específicamente en métricas de cheque promedio y análisis comparativo. El dashboard aprovecha la infraestructura existente del controlador `ctrl-ingresos.php` y las funciones API ya implementadas como `apiPromediosDiarios` y `apiIngresosTotales`, integrándose perfectamente con el ecosistema CoffeeSoft.

## Architecture

### Frontend Architecture
```
kpi/marketing/ventas/
├── index.php                          # Punto de entrada
├── src/js/kpi-ventas.js               # Archivo principal existente (se extiende)
├── ctrl/ctrl-ingresos.php             # Controlador existente (se extiende)
└── mdl/mdl-ingresos.php               # Modelo existente (se extiende)
```

### Class Structure
```javascript
// Estructura de clases existente que se mantiene
App extends Templates                   # Clase principal
├── SalesDashboard extends Templates    # Dashboard principal (se extiende)
├── Sales extends Templates             # Módulo de ventas
├── MonthlySales extends Templates      # Comparativas mensuales
└── CumulativeAverages extends Templates # Promedios acumulados
```

## Components and Interfaces

### 1. Dashboard Principal (SalesDashboard)

#### Componentes Visuales:
- **4 KPI Cards principales**:
  - Ventas del día anterior
  - Ventas del mes actual
  - Total de clientes del mes
  - Cheque promedio calculado

- **Gráficos analíticos**:
  - Comparativa de cheque promedio por categorías (barras)
  - Análisis de ventas por día de la semana (barras)
  - Tendencia de ventas diarias (líneas)
  - Ranking de mejores días por promedio semanal

#### FilterBar Components:
```javascript
filterBarDashboard() {
    // Filtros existentes que se mantienen:
    // - UDN (Unidad de Negocio)
    // - Período 1 (mes/año de consulta)
    // - Período 2 (mes/año de comparación)
    // - Categoría (filtro dinámico por UDN)
}
```

### 2. API Integration

#### Endpoints Existentes (se reutilizan):
```php
// Controlador: ctrl-ingresos.php
apiPromediosDiarios()    # Dashboard principal con KPIs
apiIngresosTotales()     # Datos diarios detallados
comparativaByCategory()  # Comparativas por categoría
apiIngresosComparativoSemana() # Análisis semanal
apiTopDiasSemanaPromedio()     # Ranking semanal
```

#### Nuevos Endpoints (se agregan):
```php
// Extensiones al controlador existente
apiChequePromedioDashboard() # KPIs específicos de cheque promedio
apiAnalisisCategorias()      # Análisis detallado por categorías
```

## Data Models

### 1. KPI Card Data Structure
```javascript
{
    ventaDia: "$ 45,230.50",      // Venta del día anterior
    ventaMes: "$ 1,234,567.89",   // Venta del mes actual
    Clientes: 1250,               // Total clientes del mes
    ChequePromedio: "$ 987.65"    // Cheque promedio calculado
}
```

### 2. Comparative Analysis Data
```javascript
{
    labels: ["A&B", "Alimentos", "Bebidas"],
    A: [673.18, 613.0, 54.6],     // Datos período actual
    B: [640.25, 590.5, 49.75],    // Datos período comparativo
    anioA: 2025,
    anioB: 2024
}
```

### 3. Weekly Analysis Data
```javascript
{
    labels: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"],
    dataA: [1200.50, 1350.75, 1100.25, 1450.80, 1600.90, 1800.45, 1300.60],
    dataB: [1150.30, 1280.40, 1050.15, 1380.70, 1520.85, 1720.35, 1250.50],
    yearA: 2024,
    yearB: 2025
}
```

## Error Handling

### 1. Data Validation
```javascript
// Validación de filtros antes de consultas
validateFilters() {
    const udn = $('#filterBarDashboard #udn').val();
    const periodo1 = $('#filterBarDashboard #periodo1').val();
    const periodo2 = $('#filterBarDashboard #periodo2').val();
    
    if (!udn || !periodo1 || !periodo2) {
        this.showError("Todos los filtros son requeridos");
        return false;
    }
    return true;
}
```

### 2. API Error Handling
```php
// Controlador: manejo de errores en APIs
try {
    $data = $this->apiPromediosDiarios();
    return ['status' => 200, 'data' => $data];
} catch (Exception $e) {
    return ['status' => 500, 'message' => 'Error al obtener datos: ' . $e->getMessage()];
}
```

### 3. Chart Error Handling
```javascript
// Manejo de errores en gráficos
renderChart(data) {
    if (!data || !data.labels || data.labels.length === 0) {
        this.showEmptyState("No hay datos disponibles para el período seleccionado");
        return;
    }
    // Renderizar gráfico normal
}
```

## Testing Strategy

### 1. Unit Testing
- **Frontend**: Pruebas de componentes individuales (KPI Cards, gráficos)
- **Backend**: Pruebas de funciones API existentes y nuevas extensiones
- **Data**: Validación de estructuras de datos y cálculos

### 2. Integration Testing
- **API Integration**: Pruebas de comunicación frontend-backend
- **Filter Integration**: Pruebas de filtros dinámicos y actualización de datos
- **Chart Integration**: Pruebas de renderizado de gráficos con datos reales

### 3. Performance Testing
- **Load Testing**: Pruebas con grandes volúmenes de datos
- **Response Time**: Medición de tiempos de respuesta de APIs
- **Memory Usage**: Monitoreo de uso de memoria en gráficos complejos

## Design Decisions and Rationales

### 1. Reutilización de Infraestructura Existente
**Decisión**: Extender el controlador y modelo existentes en lugar de crear nuevos archivos.
**Rationale**: 
- Mantiene consistencia con la arquitectura actual
- Aprovecha las funciones API ya implementadas y probadas
- Reduce duplicación de código y esfuerzo de desarrollo

### 2. Paleta de Colores CoffeeSoft
**Decisión**: Usar colores corporativos (#103B60, #8CC63F, #EAEAEA)
**Rationale**:
- Mantiene consistencia visual con el resto del sistema
- Facilita la identificación de períodos en comparativas
- Mejora la experiencia de usuario al mantener familiaridad visual

### 3. Estructura de Filtros Dinámicos
**Decisión**: Implementar filtros que se actualizan automáticamente según la UDN seleccionada
**Rationale**:
- Mejora la usabilidad al mostrar solo opciones relevantes
- Reduce errores de usuario al filtrar datos inconsistentes
- Aprovecha la lógica existente de clasificación por UDN

### 4. Integración con Chart.js
**Decisión**: Mantener Chart.js como librería de gráficos
**Rationale**:
- Consistencia con gráficos existentes en el sistema
- Amplia funcionalidad para diferentes tipos de visualizaciones
- Facilidad de personalización con la paleta corporativa

### 5. Responsive Design
**Decisión**: Implementar diseño responsive con TailwindCSS
**Rationale**:
- Compatibilidad con dispositivos móviles y tablets
- Consistencia con el framework CSS utilizado en CoffeeSoft
- Flexibilidad en el layout de dashboard para diferentes resoluciones