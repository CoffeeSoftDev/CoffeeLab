# Implementation Plan

- [x] 1. Preparar base de datos para tipo de entrega






  - Agregar columna `delivery_type` a la tabla `pedidos_orders` con tipo ENUM('local', 'domicilio') y valor por defecto 'local'
  - Verificar que la migración se ejecute correctamente sin afectar datos existentes
  - _Requirements: 3.1, 3.2_











- [ ] 2. Actualizar modelo de datos (mdl-pedidos.php)
- [x] 2.1 Modificar método `getOrders()` para incluir campo delivery_type


  - Agregar `delivery_type` al SELECT de la consulta
  - Verificar que el campo se retorne correctamente en el array de resultados


  - _Requirements: 3.3_







- [ ] 2.2 Crear método `getDailySalesMetrics()`
  - Implementar consulta SQL que agrupe ventas por método de pago
  - Calcular totales: venta total, tarjeta, efectivo, transferencia


  - Filtrar por fecha y sucursal, excluyendo pedidos cancelados (status != 4)
  - Retornar array con métricas calculadas
  - _Requirements: 2.4, 2.8, 3.4_

- [x] 3. Actualizar controlador (ctrl-pedidos.php)




- [ ] 3.1 Modificar método `listOrders()` para incluir columna de entrega
  - Agregar campo `delivery_type` en la respuesta de cada pedido
  - Preparar estructura para renderizado de ícono en frontend
  - _Requirements: 1.4, 2.2_


- [ ] 3.2 Crear método `getDailySummary()`
  - Recibir fecha desde POST

  - Llamar a `getDailySalesMetrics()` del modelo

  - Validar que existan pedidos para la fecha seleccionada
  - Retornar respuesta estructurada con status, message y data
  - Manejar caso de 0 pedidos con status 404
  - _Requirements: 2.2, 2.3, 2.8_

- [ ] 4. Actualizar formulario de pedidos (order.js)
- [x] 4.1 Agregar campo de tipo de entrega en `jsonOrder()`




  - Insertar radio buttons después del campo de fecha/hora de entrega
  - Configurar opciones: "Local" (por defecto) y "A domicilio"
  - Aplicar clases de estilo consistentes con el diseño actual
  - _Requirements: 1.1, 1.2_



- [ ] 4.2 Validar campo delivery_type en métodos add y edit
  - Asegurar que el valor se envíe correctamente al backend
  - Establecer "local" como valor por defecto si no se selecciona
  - _Requirements: 1.3, 1.6_

- [x] 5. Actualizar tabla de pedidos (order.js)

- [ ] 5.1 Agregar columna "Entrega" en la tabla
  - Posicionar después de la columna "Estado"
  - Renderizar ícono según delivery_type:
    - `domicilio`: ícono de moto (icon-moto) en color ámbar
    - `local`: ícono de tienda (icon-store) en gris o vacío
  - Agregar tooltip descriptivo a los íconos
  - Centrar contenido de la columna
  - _Requirements: 1.4, 1.5_

- [ ] 6. Implementar funcionalidad de cierre del día
- [x] 6.1 Agregar botón "Cierre del día" en FilterBar




  - Posicionar junto a "Nuevo Pedido" y calendario
  - Aplicar estilo ámbar (bg-amber-500 hover:bg-amber-600)
  - Agregar ícono de recibo (icon-receipt)
  - Configurar evento onClick para llamar a `generateDailyClose()`
  - _Requirements: 2.1, 2.9_



- [ ] 6.2 Crear método `generateDailyClose()` en order.js
  - Obtener fecha seleccionada del calendario
  - Realizar petición AJAX a `getDailySummary` con la fecha
  - Validar que haya una fecha seleccionada antes de la petición
  - Manejar respuesta exitosa llamando a `renderDailyCloseTicket()`
  - Mostrar mensaje de error si no hay pedidos o falla la petición
  - _Requirements: 2.2, 2.8_

- [ ] 6.3 Crear método `renderDailyCloseTicket()` en order.js
  - Generar estructura HTML del ticket con logo y título "PEDIDOS DE PASTELERÍA"
  - Mostrar métricas del día:
    - Venta total del día
    - Ingresos por tarjeta
    - Ingresos en efectivo
    - Ingresos por transferencia
    - Número total de pedidos
  - Aplicar formato de moneda a los totales
  - Usar mismo estilo visual que ticket de pedido personalizado
  - Implementar funcionalidad de impresión/PDF
  - _Requirements: 2.3, 2.4, 2.5, 2.6_

- [ ] 7. Validaciones y manejo de errores
- [ ] 7.1 Implementar validaciones en frontend
  - Validar que delivery_type tenga valor válido antes de enviar formulario
  - Verificar que haya fecha seleccionada antes de generar cierre
  - Mostrar mensajes de error apropiados con componente alert()
  - _Requirements: 1.1, 2.8_

- [ ] 7.2 Implementar validaciones en backend
  - Validar que delivery_type sea 'local' o 'domicilio', establecer 'local' por defecto
  - Manejar caso de consulta vacía en getDailySummary
  - Retornar mensajes de error descriptivos
  - _Requirements: 3.2, 3.4_

- [ ] 8. Integración y pruebas finales
- [ ] 8.1 Probar flujo completo de creación de pedido
  - Crear pedido con tipo "local" y verificar guardado
  - Crear pedido con tipo "domicilio" y verificar guardado
  - Verificar visualización correcta en tabla con íconos
  - Editar pedido y cambiar tipo de entrega
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6_

- [ ] 8.2 Probar funcionalidad de cierre del día
  - Crear múltiples pedidos con diferentes métodos de pago
  - Generar cierre del día y verificar cálculos
  - Probar con fecha sin pedidos
  - Verificar que pedidos cancelados no se incluyan
  - Probar impresión del ticket
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8_

- [ ] 8.3 Verificar responsive design
  - Probar formulario en móvil y tablet
  - Verificar tabla con nueva columna en diferentes tamaños
  - Probar botón de cierre en dispositivos móviles
  - Verificar ticket en diferentes resoluciones
  - _Requirements: 1.4, 2.1, 2.6_
