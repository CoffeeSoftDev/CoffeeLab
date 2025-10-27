# 📊 Implementación Módulo de Ventas del Día

## ✅ Historias de Usuario Implementadas

### Historia #1 – Registro de Ventas del Día

**Estado:** ✅ Completado

**Funcionalidades implementadas:**

1. ✅ Interfaz con pestañas y componentes definidos
2. ✅ Mostrar categorías activas desde la tabla `categories`
3. ✅ Cálculo automático de subtotales por categoría (sin impuestos)
4. ✅ Aplicar descuentos y cortesías según configuración (`discount=1`, `courtesy=1`)
5. ✅ Calcular IVA (8%) solo si `tax_iva = 1`
6. ✅ Calcular IEPS (3%) solo si `tax_ieps = 1`
7. ✅ Calcular Hospedaje (3%) solo si `tax_hospedaje = 1`
8. ✅ Desglose visual:
   - Ventas totales sin impuestos
   - Descuentos y cortesías
   - IVA calculado
   - Total final de venta
9. ✅ Botón "Guardar la venta del día" almacena en `daily_closure`
10. ✅ Validación de campos vacíos como 0.00

---

### Historia #2 – Cálculo Automático de Impuestos y Beneficios

**Estado:** ✅ Completado

**Funcionalidades implementadas:**

1. ✅ Lógica de cálculo basada en flags de configuración
2. ✅ IVA (8%) aplicado solo si `tax_iva = 1`
3. ✅ IEPS (3%) aplicado solo si `tax_ieps = 1`
4. ✅ Hospedaje (3%) aplicado solo si `tax_hospedaje = 1`
5. ✅ Cortesías permitidas solo si `courtesy = 1`
6. ✅ Descuentos permitidos solo si `discount = 1`
7. ✅ Cálculo dinámico en tiempo real (sin recargar página)
8. ✅ Totales actualizados automáticamente al capturar valores

---

## 🔧 Archivos Modificados

### 1. Frontend (JavaScript)

**Archivo:** `contabilidad/captura/js/ventas.js`

**Cambios principales:**

#### `renderSaleForm()`
- ✅ Grid de 4 columnas para categorías de venta
- ✅ Grid de 4 columnas para descuentos y cortesías
- ✅ Sección de impuestos con IVA calculado automáticamente
- ✅ Resumen visual con totales
- ✅ Botón "Guardar la venta del día"
- ✅ Data attributes para configuración de impuestos:
  - `data-tax-iva`
  - `data-tax-ieps`
  - `data-tax-hospedaje`
  - `data-courtesy`
  - `data-discount`

#### `updateTotals()` - **NUEVO ALGORITMO**
```javascript
// Cálculo inteligente de impuestos por categoría
$('.category-input').each(function () {
    const amount = parseFloat($(this).val()) || 0;
    const taxIva = parseInt($(this).data('tax-iva')) || 0;
    const taxIeps = parseInt($(this).data('tax-ieps')) || 0;
    const taxHospedaje = parseInt($(this).data('tax-hospedaje')) || 0;

    totalCategories += amount;

    // Aplicar impuestos solo si están configurados
    if (taxIva === 1) totalIva += amount * 0.08;
    if (taxIeps === 1) totalIeps += amount * 0.03;
    if (taxHospedaje === 1) totalHospedaje += amount * 0.03;
});
```

**Características:**
- ✅ Cálculo individual por categoría
- ✅ Respeta configuración de cada categoría
- ✅ Resta impuestos de descuentos/cortesías
- ✅ Actualización en tiempo real
- ✅ Validación de campos vacíos

#### `saveDailySale()` - **ACTUALIZADO**
```javascript
// Guardar con detalles de impuestos por categoría
categories.push({
    sale_category_id: $(this).data('id'),
    total: amount,
    subtotal: amount,
    tax_iva: taxIva === 1 ? amount * 0.08 : 0,
    tax_ieps: taxIeps === 1 ? amount * 0.03 : 0,
    tax_hospedaje: taxHospedaje === 1 ? amount * 0.03 : 0
});
```

---

### 2. Controlador (PHP)

**Archivo:** `contabilidad/captura/ctrl/ctrl-ventas.php`

**Métodos existentes (sin cambios necesarios):**

- ✅ `init()` - Carga categorías, descuentos, conceptos
- ✅ `saveDailySale()` - Guarda venta con detalles
- ✅ `getDailySale()` - Obtiene datos de venta
- ✅ `savePaymentForms()` - Guarda formas de pago
- ✅ `closeDailyOperation()` - Cierra corte diario

---

### 3. Modelo (PHP)

**Archivo:** `contabilidad/captura/mdl/mdl-admin.php`

**Métodos convertidos a formato `_Read`:**

#### `lsBankAccount()` - ✅ CONVERTIDO
```php
function lsBankAccount($array) {
    $query = "
        SELECT 
            id, 
            name as valor, 
            code
        FROM {$this->bd}bank_account
        WHERE active = 1 
        AND udn_id = ?
        ORDER BY name ASC
    ";
    
    return $this->_Read($query, $array);
}
```

#### `lsCashConcept()` - ✅ CONVERTIDO
```php
function lsCashConcept($array) {
    $query = "
        SELECT 
            id, 
            name as valor, 
            operation_type
        FROM {$this->bd}cash_concept
        WHERE active = 1 
        AND udn_id = ?
        ORDER BY name ASC
    ";
    
    return $this->_Read($query, $array);
}
```

---

## 📊 Estructura de Datos

### Tabla: `categories`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | INT | ID de categoría |
| `udn_id` | INT | Unidad de negocio |
| `name` | VARCHAR | Nombre de categoría |
| `tax_iva` | TINYINT | 1 = Aplica IVA 8% |
| `tax_ieps` | TINYINT | 1 = Aplica IEPS 3% |
| `tax_hospedaje` | TINYINT | 1 = Aplica Hospedaje 3% |
| `courtesy` | TINYINT | 1 = Permite cortesías |
| `discount` | TINYINT | 1 = Permite descuentos |
| `active` | TINYINT | 1 = Activo |

### Tabla: `daily_closure`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | INT | ID del corte |
| `udn_id` | INT | Unidad de negocio |
| `operation_date` | DATE | Fecha de operación |
| `total_sale_without_tax` | DECIMAL | Venta sin impuestos |
| `subtotal` | DECIMAL | Subtotal (venta - descuentos) |
| `tax` | DECIMAL | Total de impuestos |
| `total_sale` | DECIMAL | Total de venta |
| `status` | ENUM | open/closed |

### Tabla: `detail_sale_category`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | INT | ID del detalle |
| `daily_closure_id` | INT | FK a daily_closure |
| `sale_category_id` | INT | FK a categories |
| `total` | DECIMAL | Total de la categoría |
| `subtotal` | DECIMAL | Subtotal |
| `tax_iva` | DECIMAL | IVA calculado |
| `tax_ieps` | DECIMAL | IEPS calculado |
| `tax_hospedaje` | DECIMAL | Hospedaje calculado |

---

## 🎨 Diseño de Interfaz

### Layout Principal

```
┌─────────────────────────────────────────────────────────┐
│  📊 Módulo de Ventas                                    │
│  Captura y consulta de ventas diarias                  │
├─────────────────────────────────────────────────────────┤
│  [Ventas] [Administrador]                               │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Venta por categoría (sin impuestos)                    │
│  ┌──────────┬──────────┬──────────┬──────────┐         │
│  │Alimentos │ Bebidas  │ Diversos │Descorche │         │
│  │$ 19092.59│$ 4824.07 │$    0.00 │$    0.00 │         │
│  └──────────┴──────────┴──────────┴──────────┘         │
│                                                          │
│  Descuentos y cortesías (sin impuestos)                 │
│  ┌──────────┬──────────┬──────────┬──────────┐         │
│  │Desc Alim │Desc Beb  │Cort Alim │Cort Beb  │         │
│  │$  182.87 │$    0.00 │$   83.33 │$    0.00 │         │
│  └──────────┴──────────┴──────────┴──────────┘         │
│                                                          │
│  Impuestos                                               │
│  ┌──────────┐                                           │
│  │IVA (8 %) │                                           │
│  │$ 1892.04 │                                           │
│  └──────────┘                                           │
│                                                          │
│  ┌─────────────────────────────────────────────┐       │
│  │ Ventas                      $ 23,916.66     │       │
│  │ Descuentos y cortesías      -$   266.20    │       │
│  │ Impuestos                   $  1,892.04    │       │
│  │ ─────────────────────────────────────────  │       │
│  │ Total de venta              $ 25,542.50    │       │
│  └─────────────────────────────────────────────┘       │
│                                                          │
│         [Guardar la venta del día]                      │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## 🔄 Flujo de Trabajo

### 1. Carga Inicial
```
Usuario accede → init() → Carga categorías activas → Renderiza formulario
```

### 2. Captura de Ventas
```
Usuario ingresa montos → updateTotals() → Calcula impuestos por categoría → Actualiza resumen
```

### 3. Guardado
```
Click "Guardar" → saveDailySale() → Valida datos → Guarda en BD → Retorna closure_id
```

---

## ✅ Criterios de Aceptación Cumplidos

### Historia #1
- [x] Interfaz desarrollada con pestañas y componentes
- [x] Categorías activas mostradas desde BD
- [x] Subtotales calculados automáticamente
- [x] Descuentos aplicados según configuración
- [x] IVA calculado solo si `tax_iva = 1`
- [x] IEPS calculado solo si `tax_ieps = 1`
- [x] Hospedaje calculado solo si `tax_hospedaje = 1`
- [x] Desglose completo mostrado
- [x] Botón guardar funcional
- [x] Campos vacíos = 0.00

### Historia #2
- [x] Lógica basada en flags de configuración
- [x] IVA aplicado condicionalmente
- [x] Cortesías permitidas según configuración
- [x] Descuentos permitidos según configuración
- [x] Cálculo dinámico en tiempo real
- [x] Totales actualizados sin recargar

---

## 🚀 Próximos Pasos

1. ✅ **Implementación completada**
2. 🔄 **Pruebas de integración**
   - Validar cálculos con diferentes configuraciones
   - Probar con múltiples categorías
   - Verificar guardado en BD
3. 📝 **Documentación de usuario**
   - Manual de uso
   - Guía de configuración de categorías
4. 🎯 **Optimizaciones**
   - Caché de configuraciones
   - Validaciones adicionales
   - Mensajes de error mejorados

---

## 📝 Notas Técnicas

### Tasas de Impuestos
- **IVA:** 8% (0.08)
- **IEPS:** 3% (0.03)
- **Hospedaje:** 3% (0.03)

### Configuración de Categorías
Cada categoría debe tener configurados los siguientes campos en la BD:
- `tax_iva` (0 o 1)
- `tax_ieps` (0 o 1)
- `tax_hospedaje` (0 o 1)
- `courtesy` (0 o 1)
- `discount` (0 o 1)

### Validaciones
- Campos vacíos se interpretan como 0.00
- Solo se guardan categorías con monto > 0
- Los impuestos se calculan individualmente por categoría
- Los descuentos restan del subtotal y de los impuestos

---

**Fecha de implementación:** 2025-01-XX  
**Desarrollado por:** CoffeeIA ☕  
**Framework:** CoffeeSoft 2.0
