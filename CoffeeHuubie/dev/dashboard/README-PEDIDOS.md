# Dashboard de Pedidos - Implementación Completa

## 📋 Resumen

Se ha implementado un dashboard completo para el módulo de **Pedidos** con consultas SQL optimizadas y métricas en tiempo real.

## 🗂️ Archivos Creados

### Backend (PHP)

1. **`mdl/mdl-pedidos.php`** - Modelo con 5 consultas SQL:
   - `getTotalPedidosMes()` - Total de pedidos del mes
   - `getDineroEntranteMes()` - Suma de pagos recibidos
   - `getVentasCerradasMes()` - Pedidos completados (status = 3)
   - `getCancelacionesMes()` - Pedidos cancelados (status = 4)
   - `getDesgloseEstadosMes()` - Desglose por estados

2. **`ctrl/ctrl-pedidos.php`** - Controlador con:
   - `apiVentas()` - Endpoint principal con validación de parámetros
   - `apiResumenVentas()` - Procesa y estructura datos para el frontend

### Frontend (JavaScript)

3. **`src/js/pedidos.js`** - Aplicación completa con:
   - Clase `App` que extiende `Templates`
   - Filtros por mes/año
   - 4 cards con métricas
   - Gráfico de barras
   - Manejo de errores

4. **`pedidos.html`** - Página HTML del dashboard

## 📊 Métricas Implementadas

El dashboard muestra 4 cards principales:

### 1. Pedidos del Mes
- **Valor:** Total de pedidos creados en el período
- **Descripción:** Desglose (X cotizaciones • Y pagados • Z cancelados)

### 2. Dinero Entrante
- **Valor:** Suma de todos los pagos recibidos (tabla `order_payments`)
- **Descripción:** "Total de pagos recibidos en el período"

### 3. Ventas Cerradas
- **Valor:** Monto total de pedidos con status = 3 (Pagado)
- **Descripción:** "X pedidos completados"

### 4. Cancelaciones
- **Valor:** Monto total de pedidos con status = 4 (Cancelado)
- **Descripción:** "X pedidos cancelados"

## 🗄️ Estructura de Base de Datos

### Tablas Utilizadas:

**`order`**
- `id` - ID del pedido
- `date_creation` - Fecha de creación
- `total_pay` - Total del pedido
- `discount` - Descuento aplicado
- `status` - Estado del pedido (FK a `status_process`)
- `subsidiaries_id` - Sucursal

**`order_payments`**
- `id` - ID del pago
- `order_id` - FK a `order`
- `pay` - Monto del pago
- `date_pay` - Fecha del pago

**`status_process`**
- `id` - ID del estado
- `status` - Nombre del estado

### Estados del Pedido:
- **1** = Cotización
- **2** = Pendiente
- **3** = Pagado (Completado)
- **4** = Cancelado

## 🚀 Cómo Usar

### 1. Acceder al Dashboard

Abre en tu navegador:
```
http://localhost/dev/dashboard/pedidos.html
```

### 2. Filtrar por Período

- Selecciona el **mes** en el dropdown
- Selecciona el **año** en el dropdown
- Haz clic en **"Buscar"**

### 3. Visualizar Métricas

El dashboard mostrará automáticamente:
- 4 cards con las métricas principales
- Gráfico de barras con el desglose de pedidos

## 🔧 Configuración

### Requisitos Previos:

1. **Sesión PHP activa** con:
   - `$_SESSION['DB']` - Nombre de la base de datos
   - `$_SESSION['SUB']` - ID de la sucursal

2. **Tablas en la base de datos:**
   - `order`
   - `order_payments`
   - `status_process`

3. **Archivos del framework CoffeeSoft:**
   - `../../src/js/coffeSoft.js`
   - `../../src/js/plugins.js`
   - `../../conf/_CRUD.php`
   - `../../conf/_Utileria.php`

## 📝 Consultas SQL Implementadas

### Total de Pedidos del Mes
```sql
SELECT COUNT(*) as total_pedidos
FROM order
WHERE subsidiaries_id = ?
  AND date_creation BETWEEN ? AND ?
```

### Dinero Entrante del Mes
```sql
SELECT COALESCE(SUM(order_payments.pay), 0) as dinero_entrante
FROM order
LEFT JOIN order_payments ON order.id = order_payments.order_id
WHERE order.subsidiaries_id = ?
  AND order_payments.date_pay BETWEEN ? AND ?
```

### Ventas Cerradas del Mes
```sql
SELECT 
    COUNT(*) as cantidad_cerradas,
    COALESCE(SUM(order.total_pay), 0) as monto_total_ventas
FROM order
WHERE subsidiaries_id = ?
  AND date_creation BETWEEN ? AND ?
  AND status = 3
```

### Cancelaciones del Mes
```sql
SELECT 
    COUNT(*) as cantidad_canceladas,
    COALESCE(SUM(order.total_pay), 0) as monto_perdido
FROM order
WHERE subsidiaries_id = ?
  AND date_creation BETWEEN ? AND ?
  AND status = 4
```

### Desglose por Estados
```sql
SELECT 
    order.status as status_process_id,
    status_process.status as nombre_estado,
    COUNT(*) as cantidad
FROM order
INNER JOIN status_process ON order.status = status_process.id
WHERE order.subsidiaries_id = ?
  AND order.date_creation BETWEEN ? AND ?
GROUP BY order.status, status_process.status
ORDER BY order.status ASC
```

## 🎨 Personalización

### Cambiar Colores de las Cards

Edita en `src/js/pedidos.js`:
```javascript
showCardsDashboard(data) {
    // ...
    color: "text-purple-400"  // Cambia el color aquí
}
```

### Modificar Estados

Edita en `ctrl/ctrl-pedidos.php`:
```php
function status($idEstado) {
    $estados = [
        1 => ['bg' => '#EBD9FF', 'text' => '#6B3FA0', 'label' => 'Cotización'],
        // Agrega o modifica estados aquí
    ];
}
```

## 🐛 Troubleshooting

### Error: "No se recibieron datos de cards"
- Verifica que la sesión PHP esté activa
- Confirma que `$_SESSION['SUB']` tenga un valor válido
- Revisa que las tablas existan en la base de datos

### Las métricas muestran 0
- Verifica que haya datos en el rango de fechas seleccionado
- Confirma que los estados en `status_process` coincidan (1, 3, 4)
- Revisa que `subsidiaries_id` sea correcto

### Error de SQL
- Verifica el nombre de la base de datos en `$_SESSION['DB']`
- Confirma que las tablas tengan el prefijo correcto
- Revisa los logs en `ctrl/error.log`

## ✅ Testing

Para probar la implementación:

1. **Carga inicial:**
   - Abre `pedidos.html`
   - Verifica que las cards muestren datos del mes actual

2. **Filtros:**
   - Cambia el mes y haz clic en "Buscar"
   - Verifica que las métricas se actualicen

3. **Validación de datos:**
   - Suma: cotizaciones + pagados + cancelados = total_pedidos
   - Verifica que los montos sean coherentes

## 📚 Documentación Adicional

- **Spec completo:** `.kiro/specs/dashboard-metrics-queries/`
- **Requirements:** `.kiro/specs/dashboard-metrics-queries/requirements.md`
- **Design:** `.kiro/specs/dashboard-metrics-queries/design.md`
- **Tasks:** `.kiro/specs/dashboard-metrics-queries/tasks.md`

## 🎯 Próximos Pasos

1. Probar con datos reales en tu base de datos
2. Ajustar los estados según tu configuración
3. Personalizar colores y estilos según tu marca
4. Agregar más gráficos si es necesario

---

**Desarrollado con CoffeeSoft Framework ☕**
