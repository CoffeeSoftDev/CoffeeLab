# 📊 Uso de getDatasetRangeConcepto - Bar Chart

## 🎯 Descripción
Función PHP que genera datos para gráficas de barras comparativas basadas en rangos temporales, filtrando por concepto específico (cortes, alimentos, bebidas, etc.).

---

## ⚙️ Estructura de la Función

### **Ubicación:** `ctrl/ctrl-ingresos.php`

```php
public function getDatasetRangeConcepto($concepto = null)
```

### **Parámetros:**
- `$concepto` (string|null): ID del concepto a filtrar
  - Ejemplos: `'totalAlimentos'`, `'totalBebidas'`, `'totalHabitaciones'`, `'chequePromedio'`
  - Si no se envía, toma el valor de `$_POST['concepto']` o por defecto `'totalAlimentos'`

### **Datos POST requeridos:**
```php
$_POST['anio']    // Año actual (ej: 2024)
$_POST['mes']     // Mes actual (1-12)
$_POST['rango']   // Cantidad de meses hacia atrás (ej: 6, 12)
$_POST['udn']     // Unidad de negocio
$_POST['concepto'] // (Opcional) Concepto a filtrar
```

---

## 📤 Estructura de Respuesta

```json
{
  "title": "Comparativa Anual de Cortes por UDN",
  "labels": ["Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
  "dataA": [6100, 6300, 6400, 6700, 6500, 6800],
  "dataB": [6200, 6500, 6800, 7100, 6900, 7200],
  "yearA": 2023,
  "yearB": 2024
}
```

---

## 🔧 Uso desde el Frontend (JavaScript)

### **Ejemplo 1: Llamada básica**

```javascript
async function cargarGraficaBarras() {
    const data = await useFetch({
        url: api,
        data: {
            opc: 'getPromediosDiariosRange',
            anio: 2024,
            mes: 12,
            rango: 6,
            udn: 5,
            concepto: 'totalAlimentos'
        }
    });

    // Renderizar gráfica de barras
    this.barChart({
        parent: 'containerGrafica',
        id: 'chartBarras',
        title: data.dataset.title,
        labels: data.dataset.labels,
        dataA: data.dataset.dataA,
        dataB: data.dataset.dataB,
        yearA: data.dataset.yearA,
        yearB: data.dataset.yearB
    });
}
```

### **Ejemplo 2: Con filtro dinámico**

```javascript
class PromediosAcumulados extends Templates {
    constructor(link, div_modulo) {
        super(link, div_modulo);
        this.PROJECT_NAME = "promediosAcumulados";
    }

    async renderGrafica() {
        const concepto = $('#selectConcepto').val();
        const rango = $('#selectRango').val();

        const response = await useFetch({
            url: this._link,
            data: {
                opc: 'getPromediosDiariosRange',
                anio: moment().year(),
                mes: moment().month() + 1,
                rango: rango,
                udn: $('#udn').val(),
                concepto: concepto
            }
        });

        this.barChart({
            parent: 'containerChart',
            id: 'chartComparativo',
            title: response.dataset.title,
            class: 'border p-4 rounded-xl',
            labels: response.dataset.labels,
            dataA: response.dataset.dataA,
            dataB: response.dataset.dataB,
            yearA: response.dataset.yearA,
            yearB: response.dataset.yearB
        });
    }

    filterBar() {
        this.createfilterBar({
            parent: `filterBar${this.PROJECT_NAME}`,
            data: [
                {
                    opc: "select",
                    id: "selectConcepto",
                    lbl: "Concepto",
                    class: "col-sm-3",
                    data: [
                        { id: "totalAlimentos", valor: "Alimentos" },
                        { id: "totalBebidas", valor: "Bebidas" },
                        { id: "chequePromedio", valor: "Cheque Promedio" },
                        { id: "totalHabitaciones", valor: "Clientes" }
                    ],
                    onchange: "promediosAcumulados.renderGrafica()"
                },
                {
                    opc: "select",
                    id: "selectRango",
                    lbl: "Rango",
                    class: "col-sm-2",
                    data: [
                        { id: 3, valor: "3 meses" },
                        { id: 6, valor: "6 meses" },
                        { id: 12, valor: "12 meses" }
                    ],
                    onchange: "promediosAcumulados.renderGrafica()"
                }
            ]
        });
    }
}
```

---

## 📋 Conceptos Disponibles por UDN

### **UDN = 1 (Hotel)**
```javascript
const conceptosHotel = [
    { id: 'totalGeneral', nombre: 'Suma de ingresos' },
    { id: 'totalHospedaje', nombre: 'Ingreso de Hospedaje' },
    { id: 'totalAyB', nombre: 'Ingreso AyB' },
    { id: 'totalDiversos', nombre: 'Ingreso Diversos' },
    { id: 'totalHabitaciones', nombre: 'Habitaciones' },
    { id: 'chequePromedio', nombre: 'Cheque Promedio' },
    { id: 'chequePromedioHospedaje', nombre: 'Cheque Promedio Hospedaje' },
    { id: 'chequePromedioAyB', nombre: 'Cheque Promedio AyB' },
    { id: 'chequePromedioDiversos', nombre: 'Cheque Promedio Diversos' }
];
```

### **UDN = 5 (Restaurante)**
```javascript
const conceptosRestaurante = [
    { id: 'totalHabitaciones', nombre: 'Clientes' },
    { id: 'totalAlimentos', nombre: 'Cortes' },
    { id: 'totalBebidas', nombre: 'Bebidas' },
    { id: 'totalGuarniciones', nombre: 'Guarniciones' },
    { id: 'totalSales', nombre: 'Sales' },
    { id: 'totalDomicilio', nombre: 'Domicilio' },
    { id: 'totalGral', nombre: 'Total' },
    { id: 'chequePromedio', nombre: 'Cheque Promedio' }
];
```

### **UDN = Otros**
```javascript
const conceptosOtros = [
    { id: 'totalHabitaciones', nombre: 'Clientes' },
    { id: 'totalGralAyB', nombre: 'Ventas AyB' },
    { id: 'totalAlimentos', nombre: 'Ventas Alimentos' },
    { id: 'totalBebidas', nombre: 'Ventas Bebidas' },
    { id: 'chequePromedioAyB', nombre: 'Cheque Promedio AyB' },
    { id: 'chequePromedioAlimentos', nombre: 'Cheque Promedio Alimentos' },
    { id: 'chequePromedioBebidas', nombre: 'Cheque Promedio Bebidas' }
];
```

---

## 🎨 Colores por Defecto

El componente `barChart` de CoffeeSoft aplica automáticamente:

```javascript
// yearB (Año actual) - Verde
backgroundColor: '#4CAF50'

// yearA (Año anterior) - Azul  
backgroundColor: '#2196F3'
```

Estos colores se configuran internamente en el componente y coinciden con la imagen de referencia.

---

## ✅ Validaciones

La función incluye:
- ✅ Filtrado por concepto específico
- ✅ Orden cronológico de meses (más antiguo → más reciente)
- ✅ Conversión a float de valores numéricos
- ✅ Manejo de datos faltantes (retorna 0)
- ✅ Comparación automática año actual vs año anterior

---

## 🔄 Flujo de Datos

```
Frontend (JS)
    ↓
POST: { opc: 'getPromediosDiariosRange', concepto: 'totalAlimentos', ... }
    ↓
ctrl-ingresos.php → getPromediosDiariosRange()
    ↓
apiPromediosDiariosRange() → Genera matriz de datos
    ↓
getDatasetRangeConcepto($concepto) → Filtra y formatea
    ↓
Retorna JSON con estructura barChart
    ↓
Frontend → barChart() → Renderiza gráfica de barras agrupadas
```

---

## 📝 Notas Importantes

1. **Rango dinámico:** El parámetro `rango` define cuántos meses hacia atrás se consultan
2. **Comparación automática:** Siempre compara el año actual con el año anterior
3. **Labels únicos:** Los meses se extraen sin duplicar
4. **Orden cronológico:** Se usa `array_reverse()` para ordenar correctamente (más antiguo → más reciente)
5. **Compatible con barChart:** La estructura retornada es directamente compatible con el componente `barChart` de CoffeeSoft
6. **Formato de datos:**
   - `dataA`: Datos del año anterior (barra azul)
   - `dataB`: Datos del año actual (barra verde)
   - `yearA`: Año anterior (número entero)
   - `yearB`: Año actual (número entero)

---

## 🚀 Ejemplo Completo

```javascript
// En tu clase principal
async renderDashboard() {
    const data = await useFetch({
        url: api,
        data: {
            opc: 'getPromediosDiariosRange',
            anio: 2024,
            mes: 12,
            rango: 12,
            udn: 5,
            concepto: 'chequePromedio'
        }
    });

    this.barChart({
        parent: 'containerGrafica',
        id: 'chartAnual',
        title: data.dataset.title,
        class: 'border p-4 rounded-xl',
        labels: data.dataset.labels,
        dataA: data.dataset.dataA,
        dataB: data.dataset.dataB,
        yearA: data.dataset.yearA,
        yearB: data.dataset.yearB
    });
}
```

### **Ejemplo con múltiples conceptos**

```javascript
async renderMultiplesGraficas() {
    const conceptos = ['totalAlimentos', 'totalBebidas', 'chequePromedio'];
    
    for (const concepto of conceptos) {
        const data = await useFetch({
            url: api,
            data: {
                opc: 'getPromediosDiariosRange',
                anio: 2024,
                mes: 12,
                rango: 6,
                udn: 5,
                concepto: concepto
            }
        });

        this.barChart({
            parent: 'containerGraficas',
            id: `chart-${concepto}`,
            title: data.dataset.title,
            class: 'border p-4 rounded-xl mb-4',
            labels: data.dataset.labels,
            dataA: data.dataset.dataA,
            dataB: data.dataset.dataB,
            yearA: data.dataset.yearA,
            yearB: data.dataset.yearB
        });
    }
}
```
