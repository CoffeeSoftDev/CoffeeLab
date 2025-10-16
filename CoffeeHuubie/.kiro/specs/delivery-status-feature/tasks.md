# Implementation Plan

- [x] 1. Preparar base de datos y modelo


  - Verificar que el campo `is_delivered` existe en la tabla `order`
  - Crear método `updateOrderDeliveryStatus()` en `mdl-pedidos.php`
  - _Requirements: 3.4, 5.4_





- [ ] 2. Implementar endpoint en controlador
  - [ ] 2.1 Crear método `updateDeliveryStatus()` en `ctrl-pedidos.php`
    - Validar parámetros de entrada (`id`, `is_delivered`)
    - Verificar que el pedido existe usando `getOrderById()`




    - Validar que no sea una cotización (status != 1)
    - Llamar al método del modelo para actualizar
    - Retornar respuesta estructurada con status y message
    - _Requirements: 3.1, 3.2, 3.3, 3.5, 5.1, 5.2, 5.3_

- [ ] 3. Implementar renderizado de badges en frontend
  - [x] 3.1 Crear método `renderDeliveryBadge(order)` en `dashboard-pedidos.js`

    - Validar si es cotización (status === 1) para mostrar "No aplica"
    - Generar badge verde para entregado (is_delivered === 1)
    - Generar badge rojo para no entregado (is_delivered === 0)
    - Incluir iconos apropiados (icon-ok, icon-cancel, icon-minus)




    - Agregar atributos data-order-id y data-delivered
    - Aplicar clases de hover y cursor según sea clickeable
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 5.1_

  - [ ] 3.2 Modificar método `listOrders()` para incluir columna "Entrega"
    - Agregar nueva columna después de "Estado" en el array de rows
    - Llamar a `renderDeliveryBadge()` para generar el HTML
    - Aplicar clase `text-center cursor-pointer` a la columna

    - _Requirements: 1.1_

- [ ] 4. Implementar interactividad del badge
  - [ ] 4.1 Crear método `handleDeliveryClick(orderId, currentStatus, folio)`
    - Calcular nuevo estado (toggle entre 0 y 1)
    - Construir mensaje dinámico con el folio del pedido
    - Configurar `swalQuestion` con opciones apropiadas



    - Definir colores de botones según acción (verde/rojo)
    - Enviar petición con `opc: 'updateDeliveryStatus'`
    - Manejar respuesta exitosa llamando a `updateBadgeUI()`
    - Mostrar notificación toast con resultado

    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 4.1, 4.3_

  - [ ] 4.2 Crear método `updateBadgeUI(orderId, newStatus)`
    - Seleccionar badge usando data-order-id

    - Aplicar animación fadeOut antes del cambio
    - Actualizar clases CSS (bg-green-500 / bg-red-500)
    - Actualizar icono y texto del badge

    - Actualizar atributo onclick con nuevo estado

    - Aplicar animación fadeIn después del cambio
    - _Requirements: 4.2, 4.5_

- [ ] 5. Implementar validaciones y reglas de negocio
  - [ ] 5.1 Validar que cotizaciones no sean clickeables
    - En `renderDeliveryBadge()` no agregar onclick si status === 1

    - Aplicar clase `cursor-not-allowed opacity-60`
    - _Requirements: 2.6, 5.1_

  - [ ] 5.2 Validar pedidos cancelados
    - En `renderDeliveryBadge()` no agregar onclick si status === 4

    - Permitir visualización pero no modificación

    - _Requirements: 5.2_

  - [ ] 5.3 Agregar validación de sesión en controlador
    - Verificar `$_SESSION['SUB']` antes de actualizar

    - Retornar error 401 si no hay sesión válida
    - _Requirements: 5.4_

- [ ] 6. Implementar manejo de errores
  - [ ] 6.1 Agregar manejo de errores en frontend
    - Capturar error 404 (pedido no encontrado)
    - Capturar error 403 (cotización)
    - Capturar errores de red
    - Mostrar mensajes apropiados con alert()
    - _Requirements: 4.3_

  - [ ] 6.2 Agregar manejo de errores en backend
    - Validar parámetros incompletos (return 400)
    - Validar pedido inexistente (return 404)
    - Validar restricción de cotización (return 403)
    - Capturar errores de base de datos (return 500)
    - _Requirements: 3.6_

- [ ] 7. Optimizaciones de rendimiento
  - [ ] 7.1 Implementar debouncing en clicks
    - Deshabilitar badge durante petición AJAX
    - Prevenir múltiples clicks rápidos
    - _Requirements: 6.1, 6.3_




  - [ ] 7.2 Optimizar renderizado inicial
    - Generar badges en servidor (PHP) en lugar de JS
    - Usar clases CSS predefinidas
    - _Requirements: 6.1_

- [ ]* 8. Testing y validación
  - [ ]* 8.1 Pruebas unitarias frontend
    - Probar `renderDeliveryBadge()` con diferentes estados
    - Probar `updateBadgeUI()` con diferentes valores
    - Probar `handleDeliveryClick()` con diferentes escenarios
    - _Requirements: All_

  - [ ]* 8.2 Pruebas unitarias backend
    - Probar `updateDeliveryStatus()` con datos válidos
    - Probar validaciones de parámetros
    - Probar restricciones de cotizaciones
    - Probar manejo de errores
    - _Requirements: All_

  - [ ]* 8.3 Pruebas de integración
    - Probar flujo completo: click → modal → actualización → UI
    - Probar concurrencia de múltiples usuarios
    - Probar en diferentes navegadores
    - Probar en dispositivos móviles
    - _Requirements: 6.3, 6.4_

- [ ] 9. Documentación y despliegue
  - Verificar que el campo `is_delivered` existe en producción
  - Actualizar archivos en servidor (mdl, ctrl, js)
  - Limpiar caché del navegador
  - Crear backup de archivos anteriores
  - Documentar cambios en changelog
  - _Requirements: All_
