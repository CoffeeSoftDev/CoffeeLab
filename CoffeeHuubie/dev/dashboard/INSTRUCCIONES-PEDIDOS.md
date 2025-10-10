# 🚀 Dashboard de Pedidos - Guía de Instalación

## ⚠️ Problema Resuelto: Sin $_SESSION['SUB']

He creado una versión simplificada que **NO requiere** `$_SESSION['SUB']`. En su lugar, usa un ID de sucursal configurable.

## 📝 Pasos para Configurar

### 1. Configurar Base de Datos

Edita `dev/dashboard/src/js/pedidos.js` línea 2:

```javascript
let SUBSIDIARIES_ID = 1; // ⚠️ CAMBIA ESTO por tu ID de sucursal
```

### 2. Configurar Sesión PHP

Edita `dev/dashboard/mdl/mdl-pedidos.php` línea 11:

```php
$this->bd = "{$_SESSION['DB']}.";
// O si no tienes $_SESSION['DB'], usa directamente:
// $this->bd = "nombre_de_tu_base_de_datos.";
```

### 3. Probar las Consultas

**Opción A: Archivo de Prueba**

1. Abre `dev/dashboard/test-pedidos.php`
2. Edita líneas 5-6:
```php
$_SESSION['DB'] = 'tu_base_de_datos';  // ⚠️ CAMBIA ESTO
$SUBSIDIARIES_ID = 1;  // ⚠️ CAMBIA ESTO
```
3. Accede a: `http://localhost/dev/dashboard/test-pedidos.php`
4. Deberías ver los resultados de las consultas

**Opción B: Probar Directamente**

Abre `http://localhost/dev/dashboard/pedidos.html`

## 🗄️ Requisitos de Base de Datos

### Tablas Necesarias:

1. **`order`** (tabla de pedidos)
   - `id`
   - `date_creation`
   - `total_pay`
   - `discount`
   - `status`
   - `subsidiaries_id`

2. **`order_payments`** (tabla de pagos)
   - `id`
   - `order_id`
   - `pay`
   - `date_pay`

3. **`status_process`** (tabla de estados)
   - `id`
   - `status`

### Estados Requeridos:

```sql
INSERT INTO status_process (id, status) VALUES
(1, 'Cotización'),
(2, 'Pendiente'),
(3, 'Pagado'),
(4, 'Cancelado');
```

## 🔧 Solución de Problemas

### Error: "Table 'order' doesn't exist"

**Causa:** La tabla no existe o tiene otro nombre.

**Solución:**
1. Verifica que la tabla se llame exactamente `order`
2. Si tiene otro nombre, edita `mdl-pedidos.php` y reemplaza todas las referencias a `\`order\`` por el nombre correcto

### Error: "Unknown column 'date_pay'"

**Causa:** El campo en `order_payments` tiene otro nombre.

**Solución:**
Edita `mdl-pedidos.php` línea 95 y cambia `date_pay` por el nombre correcto:
```php
AND order_payments.TU_CAMPO_FECHA BETWEEN ? AND ?
```

### Error: "Access denied for user"

**Causa:** Problemas de permisos de base de datos.

**Solución:**
1. Verifica que el usuario de MySQL tenga permisos
2. Revisa la configuración en `../../conf/_CRUD.php`

### Las Cards Muestran 0

**Causa:** No hay datos en el rango de fechas o el `subsidiaries_id` es incorrecto.

**Solución:**
1. Verifica que `SUBSIDIARIES_ID` en `pedidos.js` sea correcto
2. Cambia el mes/año en el dashboard
3. Ejecuta esta consulta para verificar datos:
```sql
SELECT COUNT(*) FROM `order` WHERE subsidiaries_id = 1;
```

## 📊 Verificar que Funciona

Si todo está bien configurado, deberías ver:

✅ 4 cards con números (pueden ser 0 si no hay datos)  
✅ Gráfico de barras  
✅ Filtros de mes/año funcionando  
✅ Sin errores en la consola (F12)

## 🎯 Archivos Importantes

- **`ctrl/ctrl-pedidos-simple.php`** - Controlador sin dependencia de sesión
- **`mdl/mdl-pedidos.php`** - Modelo con consultas SQL
- **`src/js/pedidos.js`** - Frontend JavaScript
- **`pedidos.html`** - Página del dashboard
- **`test-pedidos.php`** - Archivo de prueba

## 💡 Siguiente Paso

Una vez que funcione con `ctrl-pedidos-simple.php`, puedes:

1. Integrar con tu sistema de sesiones real
2. Usar `ctrl-pedidos.php` (versión completa)
3. Ajustar los estados según tu configuración

## 📞 ¿Aún no funciona?

Comparte:
1. El error exacto que ves (consola del navegador F12)
2. El resultado de `test-pedidos.php`
3. El nombre real de tus tablas

---

**Desarrollado con CoffeeSoft ☕**
