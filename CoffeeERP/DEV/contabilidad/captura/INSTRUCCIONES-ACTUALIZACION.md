# 📋 Instrucciones para Actualizar el Módulo de Ventas

## 🎯 Objetivo
Implementar el cálculo automático de impuestos basado en la configuración de cada categoría según las historias de usuario.

---

## 📝 Cambios a Realizar

### 1. Actualizar el método `updateTotals()` en `ventas.js`

**Ubicación:** Línea 353 aproximadamente

**Reemplazar el método completo con:**

```javascript
updateTotals() {
    let totalCategories = 0;
    let totalIva = 0;
    let totalIeps = 0;
    let totalHospedaje = 0;

    // Calcular totales de categorías con sus impuestos correspondientes
    $('.category-input').each(function () {
        const amount = parseFloat($(this).val()) || 0;
        const taxIva = parseInt($(this).data('tax-iva')) || 0;
        const taxIeps = parseInt($(this).data('tax-ieps')) || 0;
        const taxHospedaje = parseInt($(this).data('tax-hospedaje')) || 0;

        totalCategories += amount;

        // Aplicar IVA solo si tax_iva = 1
        if (taxIva === 1) {
            totalIva += amount * 0.08;
        }
        // Aplicar IEPS solo si tax_ieps = 1
        if (taxIeps === 1) {
            totalIeps += amount * 0.03;
        }
        // Aplicar Hospedaje solo si tax_hospedaje = 1
        if (taxHospedaje === 1) {
            totalHospedaje += amount * 0.03;
        }
    });

    // Calcular descuentos y cortesías con sus impuestos
    let totalDiscounts = 0;
    $('.discount-input').each(function () {
        const amount = parseFloat($(this).val()) || 0;
        const taxIva = parseInt($(this).data('tax-iva')) || 0;
        const taxIeps = parseInt($(this).data('tax-ieps')) || 0;
        const taxHospedaje = parseInt($(this).data('tax-hospedaje')) || 0;

        totalDiscounts += amount;

        // Restar impuestos de descuentos
        if (taxIva === 1) {
            totalIva -= amount * 0.08;
        }
        if (taxIeps === 1) {
            totalIeps -= amount * 0.03;
        }
        if (taxHospedaje === 1) {
            totalHospedaje -= amount * 0.03;
        }
    });

    const subtotal = totalCategories - totalDiscounts;
    const totalTax = totalIva + totalIeps + totalHospedaje;
    const totalSale = subtotal + totalTax;

    // Actualizar campo de IVA
    $('#tax_iva').val(totalIva.toFixed(2));

    // Actualizar resumen visual
    $('#summary_sales').text(`$ ${totalCategories.toFixed(2)}`);
    $('#summary_discounts').text(`$ ${totalDiscounts.toFixed(2)}`);
    $('#summary_taxes').text(`$ ${totalTax.toFixed(2)}`);
    $('#summary_total').text(`$ ${totalSale.toFixed(2)}`);

    return { 
        totalCategories, 
        totalDiscounts, 
        subtotal, 
        totalTax, 
        totalSale,
        totalIva,
        totalIeps,
        totalHospedaje
    };
}
```

---

### 2. Actualizar el método `saveDailySale()` en `ventas.js`

**Ubicación:** Línea 456 aproximadamente

**Reemplazar la sección de recopilación de categorías con:**

```javascript
// Recopilar datos de categorías con sus impuestos
$('.category-input').each(function () {
    const amount = parseFloat($(this).val()) || 0;
    if (amount > 0) {
        const taxIva = parseInt($(this).data('tax-iva')) || 0;
        const taxIeps = parseInt($(this).data('tax-ieps')) || 0;
        const taxHospedaje = parseInt($(this).data('tax-hospedaje')) || 0;

        categories.push({
            sale_category_id: $(this).data('id'),
            total: amount,
            subtotal: amount,
            tax_iva: taxIva === 1 ? amount * 0.08 : 0,
            tax_ieps: taxIeps === 1 ? amount * 0.03 : 0,
            tax_hospedaje: taxHospedaje === 1 ? amount * 0.03 : 0
        });
    }
});

// Recopilar datos de descuentos con sus impuestos
$('.discount-input').each(function () {
    const amount = parseFloat($(this).val()) || 0;
    if (amount > 0) {
        const taxIva = parseInt($(this).data('tax-iva')) || 0;
        const taxIeps = parseInt($(this).data('tax-ieps')) || 0;
        const taxHospedaje = parseInt($(this).data('tax-hospedaje')) || 0;

        discountsList.push({
            discount_courtesy_id: $(this).data('id'),
            total: amount,
            subtotal: amount,
            tax_iva: taxIva === 1 ? amount * 0.08 : 0,
            tax_ieps: taxIeps === 1 ? amount * 0.03 : 0,
            tax_hospedaje: taxHospedaje === 1 ? amount * 0.03 : 0
        });
    }
});
```

---

## ✅ Verificación de Cambios

### 1. Verificar que el formulario tenga los data attributes

En el método `renderSaleForm()`, asegúrate de que los inputs tengan:

```javascript
data-tax-iva="${cat.tax_iva || 0}"
data-tax-ieps="${cat.tax_ieps || 0}"
data-tax-hospedaje="${cat.tax_hospedaje || 0}"
data-courtesy="${cat.courtesy || 0}"
data-discount="${cat.discount || 0}"
```

### 2. Verificar que el resumen visual esté presente

Asegúrate de que existan estos elementos en el HTML:

```html
<span id="summary_sales"></span>
<span id="summary_discounts"></span>
<span id="summary_taxes"></span>
<span id="summary_total"></span>
```

### 3. Verificar eventos

Asegúrate de que los eventos estén conectados:

```javascript
$(".category-input, .discount-input").on("input", () => this.updateTotals());
$("#btnSaveSale").on("click", () => this.saveDailySale());
```

---

## 🧪 Pruebas a Realizar

### Prueba 1: Cálculo de IVA
1. Configurar una categoría con `tax_iva = 1`
2. Ingresar monto de $1000
3. Verificar que IVA = $80 (8%)
4. Verificar que Total = $1080

### Prueba 2: Múltiples Impuestos
1. Configurar categoría con `tax_iva = 1` y `tax_ieps = 1`
2. Ingresar monto de $1000
3. Verificar que IVA = $80 y IEPS = $30
4. Verificar que Total = $1110

### Prueba 3: Descuentos
1. Ingresar venta de $1000 con IVA
2. Ingresar descuento de $100 con IVA
3. Verificar que IVA = $72 (8% de $900)
4. Verificar que Total = $972

### Prueba 4: Sin Impuestos
1. Configurar categoría con todos los impuestos en 0
2. Ingresar monto de $1000
3. Verificar que Total = $1000 (sin impuestos)

### Prueba 5: Guardado
1. Capturar ventas con diferentes configuraciones
2. Guardar
3. Verificar en BD que los impuestos se guardaron correctamente en `detail_sale_category`

---

## 📊 Configuración de Base de Datos

### Verificar estructura de tabla `categories`

```sql
SELECT 
    id,
    name,
    tax_iva,
    tax_ieps,
    tax_hospedaje,
    courtesy,
    discount,
    active
FROM rfwsmqex_contabilidad.categories
WHERE active = 1;
```

### Ejemplo de configuración correcta:

| id | name | tax_iva | tax_ieps | tax_hospedaje | courtesy | discount | active |
|----|------|---------|----------|---------------|----------|----------|--------|
| 1 | Alimentos | 1 | 0 | 0 | 1 | 1 | 1 |
| 2 | Bebidas | 1 | 1 | 0 | 1 | 1 | 1 |
| 3 | Diversos | 1 | 1 | 1 | 1 | 1 | 1 |

---

## 🐛 Solución de Problemas

### Problema: Los impuestos no se calculan
**Solución:** Verificar que los data attributes estén presentes en los inputs

### Problema: El total no se actualiza
**Solución:** Verificar que los eventos `on("input")` estén conectados

### Problema: Los impuestos se calculan incorrectamente
**Solución:** Verificar las tasas de impuestos (IVA=0.08, IEPS=0.03, Hospedaje=0.03)

### Problema: No se guardan los detalles
**Solución:** Verificar que el método `saveDailySale()` esté enviando los arrays `categories` y `discounts`

---

## 📞 Soporte

Si encuentras algún problema durante la implementación:

1. Revisa el archivo `IMPLEMENTACION-VENTAS.md` para más detalles
2. Consulta el archivo `ventas-updated.js` con el código completo
3. Verifica los logs de consola del navegador
4. Revisa los logs del servidor PHP

---

**Última actualización:** 2025-01-XX  
**Versión:** 1.0  
**Framework:** CoffeeSoft 2.0
