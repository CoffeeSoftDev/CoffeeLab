# 📈 Gráfico Lineal: Cheque Promedio Diario por Categoría

## 🎯 Descripción

Gráfico lineal que muestra el comportamiento día por día del cheque promedio por categoría durante un mes específico. Permite visualizar tendencias y patrones de consumo por categoría a lo largo del mes.

---

## 🔄 Flujo Completo

### 1️⃣ Backend (PHP)

**Método:** `getChequePromedioDailyByCategory()`  
**Ubicación:** `ctrl/ctrl-ingresos-dashboard.php`

#### Parámetros de Entrada
```php
$udn      = $_POST['udn']      ?? 1;           // Unidad de negocio
$anio     = $_POST['anio']     ?? date('Y');   // Año a consultar
$mes      = $_POST['mes']      ?? date('m');   // Mes a consultar
$category = $_POST['category'] ?? 'todas';     // Categoría (opcional)
```

#### Lógica del Método

1. **Calcular días del mes:**
   ```php
   $diasMes = cal_days_in_month(CAL_GREGORIAN, $mes, $anio);
   ```

2. **Definir categorías según UDN:**
   - **UDN 1 (Hotel):** Hospedaje, A&B, Diversos
   - **UDN 5 (Varoch):** Cortes, Bebidas, Guarniciones, Sales, Domicilio
   - **Otros:** Alimentos, Bebidas

3. **Iterar por cada día del mes:**
   ```php
   for ($dia = 1; $dia <= $diasMes; $dia++) {
       $fecha = sprintf('%04d-%02d-%02d', $anio, $mes, $dia);
       $ventas = $this->getsoftVentas([$udn, $fecha]);
       
       $clientes = $ventas['noHabitaciones'] ?? 0;
       
       // Calcular cheque promedio por categoría
       foreach ($categorias as $key => $config) {
           $total = $ventas[$config['field']] ?? 0;
           $chequePromedio = $clientes > 0 ? round($total / $clientes, 2) : 0;
           $datasets[$key]['data'][] = $chequePromedio;
       }
   }
   ```

4. **Estructura de Respuesta:**
   ```php
   return [
       'status'   => 200,
       'labels'   => ['01', '02', '03', ..., '31'],
       'tooltip'  => ['Lunes 01', 'Martes 02', ...],
       'datasets' => [
           [
               'label' => 'Hospedaje',
               'data'  => [450.50, 520.30, ...],
               'borderColor' => '#FF6384',
               'backgroundColor' => '#FF638433',
               'fill' => false,
               'tension' => 0.3,
               'pointRadius' => 4,
               'pointBackgroundColor' => '#FF6384'
           ],
           // ... más categorías
       ]
   ];
   ```

---

### 2️⃣ Frontend (JavaScript)

**Ubicación:** `src/js/dashboard.js`

#### Método de Layout: `layoutLinearDailyCategory()`

```javascript
layoutLinearDailyCategory() {
    // 1. Limpiar contenedor del filterBar
    $('#filterBarLinearDaily').empty();

    // 2. Crear filterBar con selectores de mes y año
    this.createfilterBar({
        parent: `filterBarLinearDaily`,
        data: [
            {
                opc: "select",
                id: "mesLinear",
                lbl: "Mes",
                class: "col-sm-4",
                data: moment.months().map((m, i) => ({ id: i + 1, valor: m })),
                onchange: `dashboard.renderLinearDailyCategory()`,
            },
            {
                opc: "select",
                id: "anioLinear",
                lbl: "Año",
                class: "col-sm-4",
                data: Array.from({ length: 5 }, (_, i) => {
                    const year = moment().year() - i;
                    return { id: year, valor: year.toString() };
                }),
                onchange: `dashboard.renderLinearDailyCategory()`,
            },
        ],
    });

    // 3. Establecer valores por defecto (mes y año actual)
    const currentMonth = moment().month() + 1;
    const currentYear = moment().year();

    setTimeout(() => {
        $(`#filterBarLinearDaily #mesLinear`).val(currentMonth);
        $(`#filterBarLinearDaily #anioLinear`).val(currentYear);
        this.renderLinearDailyCategory();
    }, 100);
}
```

#### Método de Renderizado: `renderLinearDailyCategory()`

```javascript
async renderLinearDailyCategory() {
    // 1. Obtener valores de filtros
    let udn = $('#filterBar #udn').val();
    let mes = $('#filterBarLinearDaily #mesLinear').val();
    let anio = $('#filterBarLinearDaily #anioLinear').val();

    const meses = moment.months();
    const nombreMes = meses[parseInt(mes) - 1];

    // 2. Consultar backend
    let mkt = await useFetch({
        url: api_dashboard,
        data: {
            opc: "getChequePromedioDailyByCategory",
            udn: udn,
            mes: mes,
            anio: anio,
        },
    });

    // 3. Renderizar gráfico lineal
    this.linearChart({
        parent: "containerLinearDaily",
        id: "chartLinearDaily",
        title: `📈 Cheque Promedio Diario por Categoría - ${nombreMes} ${anio}`,
        data: {
            labels: mkt.labels,
            tooltip: mkt.tooltip,
            datasets: mkt.datasets
        }
    });
}
```

---

### 3️⃣ Renderizado en UI

**Contenedor en Layout:**

```javascript
{
    type: "grafico", 
    id: "linearDailyCategory", 
    title: "",
    content: [
        { 
            class: "border px-3 py-2 rounded", 
            type: "div", 
            id: "filterBarLinearDaily" 
        },
        { 
            class: " mt-2", 
            type: "div", 
            id: "containerLinearDaily" 
        },
    ]
}
```

**Visibilidad:** Controlada por `showGraphicsCategory('daily')`

---

## 📊 Características del Gráfico

### Tipo de Gráfico
- **Chart.js Line Chart** con múltiples datasets (una línea por categoría)

### Colores por Categoría

#### UDN 1 (Hotel)
- 🔴 **Hospedaje:** `#FF6384`
- 🔵 **A&B:** `#36A2EB`
- 🟡 **Diversos:** `#FFCE56`

#### UDN 5 (Varoch)
- 🔴 **Cortes:** `#FF6384`
- 🔵 **Bebidas:** `#36A2EB`
- 🟡 **Guarniciones:** `#FFCE56`
- 🟢 **Sales:** `#4BC0C0`
- 🟣 **Domicilio:** `#9966FF`

#### Otros Restaurantes
- 🟢 **Alimentos:** `#4CAF50`
- 🔵 **Bebidas:** `#2196F3`

### Configuración Visual
```javascript
{
    fill: false,              // Sin relleno bajo la línea
    tension: 0.3,             // Curvatura suave
    pointRadius: 4,           // Tamaño de puntos
    backgroundColor: 'color33' // Transparencia 20%
}
```

---

## 🎨 Interactividad

### Tooltips
- **Formato:** "Día de la semana + Número"
  - Ejemplo: "Lunes 01", "Martes 02"
- **Contenido:** Categoría + Cheque Promedio formateado
  - Ejemplo: "Hospedaje: $450.50"

### Filtros Independientes
- **Mes:** Selector con todos los meses del año
- **Año:** Selector con últimos 5 años
- **Actualización:** Automática al cambiar cualquier filtro

---

## 📈 Casos de Uso

### 1. Identificar Tendencias
- Ver si el cheque promedio aumenta o disminuye durante el mes
- Detectar días con picos o caídas significativas

### 2. Comparar Categorías
- Visualizar qué categoría tiene mayor cheque promedio
- Identificar categorías con comportamiento estable vs volátil

### 3. Análisis de Patrones
- Detectar patrones semanales (fines de semana vs días laborales)
- Identificar días específicos con comportamiento atípico

### 4. Planificación Operativa
- Ajustar inventario según tendencias de consumo
- Planificar promociones en días de bajo cheque promedio

---

## 🔧 Integración con el Sistema

### Llamada en renderDashboard()
```javascript
this.layoutLinearDailyCategory();
```

### Dependencias
- **Backend:** `getsoftVentas()` - Obtiene ventas diarias
- **Frontend:** `linearChart()` - Componente de gráfico lineal
- **Utilidades:** `moment.js` - Manejo de fechas

---

## 📝 Ejemplo de Datos

### Request
```javascript
{
    opc: "getChequePromedioDailyByCategory",
    udn: 1,
    mes: 10,
    anio: 2025
}
```

### Response
```json
{
    "status": 200,
    "labels": ["01", "02", "03", ..., "31"],
    "tooltip": ["Lunes 01", "Martes 02", "Miércoles 03", ...],
    "datasets": [
        {
            "label": "Hospedaje",
            "data": [450.50, 520.30, 480.75, ...],
            "borderColor": "#FF6384",
            "backgroundColor": "#FF638433",
            "fill": false,
            "tension": 0.3,
            "pointRadius": 4,
            "pointBackgroundColor": "#FF6384"
        },
        {
            "label": "A&B",
            "data": [120.30, 135.50, 128.90, ...],
            "borderColor": "#36A2EB",
            "backgroundColor": "#36A2EB33",
            "fill": false,
            "tension": 0.3,
            "pointRadius": 4,
            "pointBackgroundColor": "#36A2EB"
        }
    ]
}
```

---

## ⚠️ Consideraciones

### Manejo de Datos Faltantes
- Si no hay clientes en un día: `chequePromedio = 0`
- Si no hay ventas en una categoría: `total = 0`

### Performance
- Consulta optimizada: una llamada por día del mes
- Caché de datos en frontend para evitar reconsultas

### Responsive
- Gráfico adaptable a diferentes tamaños de pantalla
- Leyenda posicionada en la parte inferior

---

## 🚀 Mejoras Futuras

1. **Filtro por Categoría:** Mostrar/ocultar líneas específicas
2. **Comparación de Meses:** Superponer datos de diferentes meses
3. **Exportación:** Descargar datos en CSV/Excel
4. **Anotaciones:** Marcar eventos especiales en el gráfico
5. **Zoom:** Permitir zoom en rangos de fechas específicos

---

## 📚 Referencias

- **Chart.js Documentation:** https://www.chartjs.org/docs/latest/charts/line.html
- **Moment.js:** https://momentjs.com/
- **CoffeeSoft Framework:** Ver `DOC-COFFEESOFT.md`
