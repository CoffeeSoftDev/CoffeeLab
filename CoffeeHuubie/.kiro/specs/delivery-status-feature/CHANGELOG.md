# Changelog - Estado de Entrega en Pedidos

## Fecha de implementación
16 de Octubre, 2025

## Resumen
Se implementó una nueva funcionalidad que permite visualizar y actualizar el estado de entrega de los pedidos directamente desde la tabla principal, mediante badges interactivos y modales de confirmación.

## Archivos modificados

### Backend (PHP)

#### 1. `dev/pedidos/mdl/mdl-pedidos.php`
**Cambios:**
- ✅ Agregado método `updateOrderDeliveryStatus()` para actualizar el campo `is_delivered` en la base de datos
- ✅ Modificado método `getOrders()` para incluir el campo `is_delivered` en la consulta SQL

**Líneas modificadas:** ~1067-1080, ~124

#### 2. `dev/pedidos/ctrl/ctrl-pedidos.php`
**Cambios:**
- ✅ Agregado método `updateDeliveryStatus()` en la clase Pedidos para manejar las peticiones de actualización
  - Valida parámetros de entrada
  - Verifica que el pedido existe
  - Valida que no sea una cotización (status != 1)
  - Actualiza el estado en la base de datos
  - Retorna respuesta estructurada
  
- ✅ Agregada función auxiliar `renderDeliveryBadge($order)` para generar el HTML del badge
  - Muestra "No aplica" para cotizaciones
  - Muestra badge verde para entregado
  - Muestra badge rojo para no entregado
  - Deshabilita click en pedidos cancelados
  
- ✅ Modificado método `listOrders()` para incluir la columna "Entrega" en el array de rows

**Líneas modificadas:** ~1029-1080, ~1127-1165, ~80-110

### Frontend (JavaScript)

#### 3. `dev/pedidos/src/js/app.js`
**Cambios:**
- ✅ Agregado método `handleDeliveryClick(orderId, currentStatus, folio)` en la clase App
  - Muestra modal de confirmación con `swalQuestion`
  - Envía petición AJAX al controlador
  - Maneja respuestas exitosas y errores
  - Actualiza el badge visualmente
  
- ✅ Agregado método `updateBadgeUI(orderId, newStatus)` en la clase App
  - Actualiza el badge sin recargar la tabla
  - Aplica animaciones fadeIn/fadeOut
  - Actualiza clases CSS y atributos data

**Líneas modificadas:** ~433-500

## Características implementadas

### ✅ Visualización
- Nueva columna "Entrega" después de "Estado"
- Badge dinámico con 3 estados:
  - 🟢 Verde: Entregado (is_delivered = 1)
  - 🔴 Rojo: No entregado (is_delivered = 0)
  - ⚪ Gris: No aplica (cotizaciones)

### ✅ Interactividad
- Click en badge abre modal de confirmación
- Modal muestra el folio del pedido
- Opciones: "Sí, entregado" / "No entregado"
- Actualización optimista del UI sin reload

### ✅ Validaciones
- Cotizaciones (status = 1) no son clickeables
- Pedidos cancelados (status = 4) no permiten cambios
- Validación de parámetros en backend
- Validación de existencia del pedido
- Validación de sesión (usa $_SESSION['SUB'])

### ✅ Manejo de errores
- Frontend: Captura errores 400, 403, 404, 500
- Backend: Retorna códigos de estado apropiados
- Mensajes descriptivos para cada tipo de error
- Notificaciones toast para feedback visual

### ✅ Optimizaciones
- Badges generados en servidor (PHP) para mejor performance
- Actualización optimista del UI
- Animaciones suaves con jQuery fadeIn/fadeOut
- Uso de clases CSS predefinidas

## Base de datos

### Campo requerido
La funcionalidad asume que existe el campo `is_delivered` en la tabla `order`:
```sql
ALTER TABLE order ADD COLUMN is_delivered INT DEFAULT 0;
```

**Valores:**
- `0` = No entregado (default)
- `1` = Entregado

## Testing

### Casos de prueba recomendados
- [ ] Badge se renderiza correctamente en todos los estados
- [ ] Click en badge abre modal con folio correcto
- [ ] Actualización exitosa muestra notificación
- [ ] Badge se actualiza sin recargar tabla
- [ ] Cotizaciones muestran "No aplica" y no son clickeables
- [ ] Pedidos cancelados no permiten cambios
- [ ] Errores muestran mensajes apropiados
- [ ] Funciona en dispositivos móviles

## Notas de despliegue

1. **Verificar base de datos:**
   - Confirmar que el campo `is_delivered` existe en la tabla `order`
   - Si no existe, ejecutar el ALTER TABLE mencionado arriba

2. **Actualizar archivos:**
   - Subir `mdl-pedidos.php` actualizado
   - Subir `ctrl-pedidos.php` actualizado
   - Subir `app.js` actualizado

3. **Limpiar caché:**
   - Limpiar caché del navegador
   - Recargar la página de pedidos

4. **Verificar funcionamiento:**
   - Abrir la lista de pedidos
   - Verificar que aparece la columna "Entrega"
   - Probar actualizar el estado de un pedido
   - Verificar que las cotizaciones muestran "No aplica"

## Rollback

Si es necesario revertir los cambios:

1. Restaurar backup de los 3 archivos modificados
2. Opcional: Eliminar el campo `is_delivered` de la base de datos
   ```sql
   ALTER TABLE order DROP COLUMN is_delivered;
   ```

## Próximas mejoras sugeridas

- [ ] Agregar historial de cambios de estado de entrega
- [ ] Agregar filtro por estado de entrega en la barra de filtros
- [ ] Agregar permisos por rol de usuario
- [ ] Agregar notificaciones por email cuando se marca como entregado
- [ ] Agregar reporte de pedidos entregados vs pendientes
