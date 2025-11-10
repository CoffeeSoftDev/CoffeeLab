# 📅 Calendario de Ventas - Documentación

## 🎯 Descripción
Componente visual que muestra las ventas de las últimas 5 semanas en formato calendario, con totales diarios y semanales.

---

## 📁 Estructura de Archivos

```
kpi/marketing/ventas/
├── src/js/
│   ├── kpi-ventas.js                    # Archivo principal (clase SalesCalendar agregada)
│   └── components/
│       └── calendario-ventas.js         # Componente reutilizable del calendario
├── ctrl/
│   └── ctrl-ingresos.php                # Método getCalendarioVentas() agregado
└── mdl/
    └── mdl-ingresos.php                 # Usa métodos existentes (getsoftVentas)
```

---

## ⚙️ Instalación

### 1. Incluir el componente en el HTML

Agregar en el `<head>` del archivo principal:

```html
<script src="src/js/components/calendario-ventas.js"></script>
```

### 2. Verificar que el módulo esté inicializado

El componente ya está integrado en `kpi-ventas.js`:

```javascript
let salesCalendar = new SalesCalendar(api, "root");
salesCalendar.render();
```

---

## 🔧 Uso del Componente

### **Desde el Frontend**

```javascript
// Llamada básica
const data = await useFetch({
    url: api,
    data: {
        opc: 'getCalendarioVentas',
        udn: 5
    }
});

calendarioVentas({
    parent: 'container',
    id: 'miCalendario',
    title: 'Calendario de Ventas - Últimas 5 Semanas',
    json: data.semanas,
    onDayClick: (dia) => {
        console.log('Día seleccionado:', dia);
    }
});
```

---

## 📤 Estructura de Datos (Backend)

### **Respuesta del controlador:**

```json
{
  "status": 200,
  "title": "Calendario de Ventas - Últimas 5 Semanas",
  "fechaInicio": "2024-11-20",
  "fechaFin": "2024-12-24",
  "semanas": [
    {
      "numero": 1,
      "totalSemana": "$347,382.00",
      "totalSemanaRaw": 347382,
      "dias": [
        {
          "dia": "31",
          "fecha": "2024-12-31",
          "diaSemana": "Martes 31",
          "total": 74587.5,
          "totalFormateado": "$74,587.50",
          "clientes": 37,
          "chequePromedio": "$2,015.88"
        },
        ...
      ]
    },
    ...
  ]
}
```

---

## 🎨 Colores por Monto

El componente aplica colores automáticamente según el total de ventas:

| Rango de Ventas | Color | Clase CSS |
|-----------------|-------|-----------|
| $0 | Gris claro | `bg-gray-100` |
| < $20,000 | Azul claro | `bg-blue-100` |
| $20,000 - $30,000 | Amarillo claro | `bg-yellow-100` |
| $30,000 - $40,000 | Verde claro | `bg-green-100` |
| $40,000 - $50,000 | Verde medio | `bg-green-200` |
| > $50,000 | Verde intenso | `bg-green-300` |

---

## 🔄 Flujo de Datos

```
Frontend (SalesCalendar)
    ↓
POST: { opc: 'getCalendarioVentas', udn: 5 }
    ↓
ctrl-ingresos.php → getCalendarioVentas()
    ↓
mdl-ingresos.php → getsoftVentas() (por cada día)
    ↓
Agrupa en semanas (7 días)
    ↓
Retorna JSON con estructura de semanas
    ↓
Frontend → calendarioVentas() → Renderiza calendario
```

---

## 📋 Características

✅ Muestra las últimas 5 semanas (35 días)
✅ Totales diarios con formato de moneda
✅ Totales semanales destacados
✅ Colores dinámicos según monto de ventas
✅ Información de clientes y cheque promedio
✅ Click en día para ver detalles
✅ Filtro por UDN
✅ Responsive con TailwindCSS
✅ Integrado con el framework CoffeeSoft

---

## 🎯 Eventos Disponibles

### **onDayClick**

Se ejecuta al hacer click en un día:

```javascript
calendarioVentas({
    parent: 'container',
    json: data.semanas,
    onDayClick: (dia) => {
        alert({
            icon: 'info',
            title: `Ventas del día ${dia.dia}`,
            html: `
                <p><strong>Total:</strong> ${dia.totalFormateado}</p>
                <p><strong>Clientes:</strong> ${dia.clientes}</p>
                <p><strong>Cheque Promedio:</strong> ${dia.chequePromedio}</p>
            `
        });
    }
});
```

### **onWeekClick** (opcional)

Se puede agregar para manejar clicks en semanas completas.

---

## 🔧 Personalización

### **Cambiar colores**

Editar la función `getColorByAmount()` en `calendario-ventas.js`:

```javascript
function getColorByAmount(total) {
    if (total === 0) return "bg-gray-100";
    if (total < 20000) return "bg-blue-100";
    if (total < 30000) return "bg-yellow-100";
    // Personalizar rangos aquí
    return "bg-green-300";
}
```

### **Cambiar número de semanas**

En el controlador `ctrl-ingresos.php`, modificar:

```php
$fechaInicio->modify('-34 days'); // Cambiar a -41 para 6 semanas
```

---

## 📝 Notas Importantes

1. **Dependencias:** Requiere jQuery, TailwindCSS y el framework CoffeeSoft
2. **Formato de fechas:** Usa `formatSpanishDay()` para mostrar fechas en español
3. **Formato de moneda:** Usa `evaluar()` para formatear montos
4. **UDN específicas:** El cálculo de totales varía según la UDN (Hotel, Restaurante, etc.)
5. **Semana actual:** Por defecto muestra las últimas 5 semanas desde hoy

---

## 🚀 Ejemplo Completo

```javascript
class MiModulo extends Templates {
    async renderCalendario() {
        const data = await useFetch({
            url: 'ctrl/ctrl-ingresos.php',
            data: {
                opc: 'getCalendarioVentas',
                udn: $('#udn').val()
            }
        });

        calendarioVentas({
            parent: 'containerCalendario',
            id: 'calendarioVentas',
            title: data.title,
            json: data.semanas,
            onDayClick: (dia) => {
                this.mostrarDetallesDia(dia);
            }
        });
    }

    mostrarDetallesDia(dia) {
        alert({
            icon: 'info',
            title: `📊 Ventas del ${dia.diaSemana}`,
            html: `
                <div class="text-left space-y-2">
                    <p><strong>Total:</strong> ${dia.totalFormateado}</p>
                    <p><strong>Clientes:</strong> ${dia.clientes}</p>
                    <p><strong>Cheque Promedio:</strong> ${dia.chequePromedio}</p>
                </div>
            `,
            btn1: true,
            btn1Text: 'Cerrar'
        });
    }
}
```

---

## ✅ Checklist de Integración

- [x] Componente `calendario-ventas.js` creado
- [x] Clase `SalesCalendar` agregada a `kpi-ventas.js`
- [x] Método `getCalendarioVentas()` en controlador
- [x] Pestaña "Calendario de Ventas" agregada al módulo
- [x] Filtro por UDN implementado
- [x] Colores dinámicos por monto
- [x] Eventos de click en días
- [x] Totales semanales calculados
- [x] Formato de moneda y fechas en español

---

## 🐛 Troubleshooting

**Problema:** No se muestran datos
- Verificar que `getsoftVentas()` esté retornando datos
- Revisar que la UDN seleccionada tenga ventas registradas

**Problema:** Colores no se aplican
- Verificar que TailwindCSS esté cargado
- Revisar que los montos sean numéricos

**Problema:** Error al hacer click en un día
- Verificar que `onDayClick` esté definido
- Revisar la consola del navegador para errores

---

## 📞 Soporte

Para dudas o mejoras, consultar la documentación de CoffeeSoft o revisar los pivotes de referencia en `.kiro/steering/`.
