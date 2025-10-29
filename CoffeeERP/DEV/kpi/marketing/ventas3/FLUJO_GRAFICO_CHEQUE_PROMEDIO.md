# 📊 Flujo Completo: Gráfico de Cheque Promedio por Categoría

## 🎯 Análisis del Gráfico Existente (renderDailyAverageCheck)

### 1️⃣ Frontend (JavaScript)

**Ubicación:** `src/js/dashboard.js`

**Método Principal:** `renderDailyAverageCheck()`

```javascript
async renderDailyAverageCheck() {
    // 1. Obtener valores de filtros
    let udn = $('#filterBar #udn').val();
    let category = $('#category option:selected').text();
    let date = this.getFilterDate();

    // 2. Consultar backend
    let mkt = await useFetch({
        url: api_dashboard,
        data: {
            opc: "getDailyCheck",
            udn: udn,
            category: category,
            anio1: date.year1,
            mes1: date.month1,
            anio2: date.year2,
            mes2: date.month2,
        },
    });

    // 3. Renderizar gráfico usando barChart()
    this.barChart({
        parent: "containerDailyAverageCheck",
        id: "chartDailyCheck",
        title: `📊 Cheque Promedio Diario - ${nombreMes1} ${date.year1} vs ${nombreMes2} ${date.year2}`,
        labels: mkt.labels,
        dataA: mkt.dataB,
        dataB: mkt.dataA,
        yearA: mkt.yearA,
        yearB: mkt.yearB
    });
}
```

**Método de Layout:** `layoutDailyAverageCheck()`
- Crea el filterBar con selector de categorías
- Llama a `renderDailyAverageCheck()` para mostrar el gráfico inicial

### 2️⃣ Renderizado en UI

**Contenedor:** Definido en `layout()` del dashboard

```javascript
{
    type: "grafico", 
    id: "dailyAverageCheck", 
    title: "",
    content: [
        { class: "border px-3 py-2 rounded", type: "div", id: "filterBarDailyAverageCheck" },
        { class: " mt-2", type: "div", id: "containerDailyAverageCheck" },
    ]
}
```

**Visibilidad:** Controlada por `showGraphicsCategory('daily')`

### 3️⃣ Backend (PHP)

**Ubicación:** `ctrl/ctrl-ingresos-dashboard.php`

**Método:** `getDailyCheck()`

**Flujo:**
1. Recibe parámetros: `udn`, `anio1`, `mes1`, `anio2`, `mes2`, `category`
2. Llama a `apiIngresosTotales()` para obtener datos de ambos períodos
3. Agrupa datos por día de la semana
4. Calcula cheque promedio: `total / clientes`
5. Retorna estructura:

```php
return [
    'status'  => 200,
    'labels'  => ['Lunes', 'Martes', ...],
    'dataA'   => [cheques año anterior],
    'dataB'   => [cheques año actual],
    'yearA'   => 2024,
    'yearB'   => 2025
];
```

---

## 🆕 Nuevo Gráfico: Cheque Promedio por Categoría

### 1️⃣ Frontend (JavaScript)

**Método Nuevo:** `renderChequePromedioByCategory()`

```javascript
async renderChequePromedioByCategory() {
    let date = this.getFilterDate();
    
    const meses = moment.months();
    const nombreMes1 = meses[parseInt(date.month1) - 1];
    const nombreMes2 = meses[parseInt(date.month2) - 1];

    let mkt = await useFetch({
        url: api_dashboard,
        data: {
            opc: "getChequePromedioByCategory",
            udn: $('#filterBar #udn').val(),
            anio1: date.year1,
            mes1: date.month1,
            anio2: date.year2,
            mes2: date.month2,
        },
    });

    this.barChart({
        parent: "categoryAverageCheck",
        id: "chartCategoryAverage",
        title: `📊 Cheque Promedio por Categoría - ${nombreMes1} ${date.year1} vs ${nombreMes2} ${date.year2}`,
        labels: mkt.labels,
        dataA: mkt.dataA,
        dataB: mkt.dataB,
        yearA: mkt.yearA,
        yearB: mkt.yearB
    });
}
```

**Llamada:** Se ejecuta en `renderDashboard()` después de `layoutChequePromedio()`

### 2️⃣ Renderizado en UI

**Contenedor Agregado:**

```javascript
{ type: "grafico", id: "categoryAverageCheck", title: "" }
```

**Visibilidad:** Incluido en `showGraphicsCategory('daily')`

### 3️⃣ Backend (PHP)

**Método Nuevo:** `getChequePromedioByCategory()`

**Lógica:**

```php
function getChequePromedioByCategory() {
    // 1. Obtener parámetros
    $udn   = $_POST['udn']   ?? 1;
    $anio1 = $_POST['anio1'] ?? date('Y');
    $mes1  = $_POST['mes1']  ?? date('m');
    $anio2 = $_POST['anio2'] ?? date('Y') - 1;
    $mes2  = $_POST['mes2']  ?? date('m');

    // 2. Obtener ventas mensuales de ambos períodos
    $ventasActual   = $this->ingresosMensuales([$udn, $anio1, $mes1]);
    $ventasAnterior = $this->ingresosMensuales([$udn, $anio2, $mes2]);

    // 3. Definir categorías según UDN
    if ($udn == 1) {
        $labels = ['Hospedaje', 'A&B', 'Diversos'];
        // Calcular cheque promedio por categoría
    } elseif ($udn == 5) {
        $labels = ['Cortes', 'Bebidas', 'Guarniciones', 'Sales', 'Domicilio'];
    } else {
        $labels = ['Alimentos', 'Bebidas'];
    }

    // 4. Calcular cheque promedio: total / clientes
    $clientesActual = $ventasActual['totalHabitaciones'] ?? 0;
    $dataActual = [
        $clientesActual > 0 ? round($ventasActual['totalCategoria'] / $clientesActual, 2) : 0
    ];

    // 5. Retornar estructura
    return [
        'status'  => 200,
        'labels'  => $labels,
        'dataA'   => $dataAnterior,
        'dataB'   => $dataActual,
        'yearA'   => intval($anio2),
        'yearB'   => intval($anio1)
    ];
}
```

---

## 🔄 Flujo Completo de Datos

```
┌─────────────────────────────────────────────────────────────┐
│                    USUARIO INTERACTÚA                        │
│  Selecciona: UDN, Período 1 (mes/año), Período 2 (mes/año) │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              FRONTEND: renderDashboard()                     │
│  - Obtiene valores de filtros                               │
│  - Llama a renderChequePromedioByCategory()                 │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│         FRONTEND: renderChequePromedioByCategory()           │
│  - Prepara parámetros (udn, anio1, mes1, anio2, mes2)      │
│  - Ejecuta useFetch() con opc: "getChequePromedioByCategory"│
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│      BACKEND: getChequePromedioByCategory()                  │
│  1. Obtiene ingresosMensuales() para ambos períodos         │
│  2. Extrae clientes y totales por categoría                 │
│  3. Calcula: chequePromedio = total / clientes              │
│  4. Retorna JSON con labels, dataA, dataB, yearA, yearB     │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│         FRONTEND: Recibe datos y llama barChart()            │
│  - parent: "categoryAverageCheck"                            │
│  - labels: ['Hospedaje', 'A&B', 'Diversos']                 │
│  - dataA: [cheques año anterior]                             │
│  - dataB: [cheques año actual]                               │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│           COMPONENTE: barChart() (Chart.js)                  │
│  - Crea gráfico de barras comparativo                       │
│  - Aplica colores: Verde (#8CC63F) y Azul (#103B60)        │
│  - Muestra valores formateados con formatPrice()            │
│  - Renderiza en #categoryAverageCheck                        │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                  USUARIO VE EL GRÁFICO                       │
│  📊 Cheque Promedio por Categoría - Octubre 2025 vs 2024   │
└─────────────────────────────────────────────────────────────┘
```

---

## 📋 Checklist de Implementación

### ✅ Backend (PHP)
- [x] Crear método `getChequePromedioByCategory()` en `ctrl-ingresos-dashboard.php`
- [x] Obtener datos de `ingresosMensuales()` para ambos períodos
- [x] Calcular cheque promedio por categoría (total / clientes)
- [x] Manejar diferentes UDN (1, 5, otros)
- [x] Retornar estructura JSON compatible con barChart()

### ✅ Frontend (JavaScript)
- [x] Crear método `renderChequePromedioByCategory()` en `dashboard.js`
- [x] Agregar contenedor `categoryAverageCheck` en layout
- [x] Llamar método en `renderDashboard()`
- [x] Incluir en `showGraphicsCategory('daily')`
- [x] Usar `barChart()` para renderizar

### ✅ Integración
- [x] Conectar frontend con backend usando `useFetch()`
- [x] Pasar parámetros correctos (udn, anio1, mes1, anio2, mes2)
- [x] Manejar respuesta y extraer datos
- [x] Aplicar formato de título dinámico con nombres de meses

---

## 🎨 Características del Gráfico

- **Tipo:** Gráfico de barras comparativo (Chart.js)
- **Colores:** 
  - Año anterior: Verde (#8CC63F)
  - Año actual: Azul (#103B60)
- **Formato:** Valores monetarios con `formatPrice()`
- **Responsive:** Adaptable a diferentes tamaños de pantalla
- **Interactivo:** Tooltips con información detallada

---

## 🔧 Mantenimiento

Para modificar el gráfico:

1. **Cambiar categorías:** Editar arrays de `labels` en `getChequePromedioByCategory()`
2. **Ajustar cálculos:** Modificar fórmula de cheque promedio en backend
3. **Cambiar colores:** Actualizar `backgroundColor` en `barChart()`
4. **Agregar filtros:** Extender `filterBar` y pasar nuevos parámetros

---

## 📝 Notas Técnicas

- El gráfico se actualiza automáticamente al cambiar los filtros principales (UDN, Período 1, Período 2)
- Si no hay clientes, el cheque promedio se muestra como 0 (no como total de ventas)
- Compatible con múltiples UDN con diferentes estructuras de categorías
- Usa la misma estructura que otros gráficos del dashboard para mantener consistencia
