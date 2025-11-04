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







- [x] 2.2 Crear/Actualizar método `getDailySalesMetrics()`


  - Implementar consulta SQL que obtenga pedidos activos del día (status != 4)
  - Calcular venta total del día sumando campo `total_pay` de pedidos activos
  - Implementar consulta SQL a tabla `pedidos_payments` para obtener pagos reales
  - Agrupar pagos por `method_pay_id` y sumar campo `advanced_pay`
  - Mapear method_pay_id a nombres: 1=Efectivo, 2=Tarjeta, 3=Transferencia
  - Calcular totales por método de pago desde registros reales de pagos
  - Contar número total de pedidos del día
  - Filtrar por fecha y sucursal
  - Retornar array con métricas calculadas: total_sales, card_sales, cash_sales, transfer_sales, total_orders
  - _Requirements: 2.8, 2.9, 2.10, 3.4_

- [x] 3. Actualizar controlador (ctrl-pedidos.php)




- [ ] 3.1 Modificar método `listOrders()` para incluir columna de entrega
  - Agregar campo `delivery_type` en la respuesta de cada pedido
  - Preparar estructura para renderizado de ícono en frontend
  - _Requirements: 1.4, 2.2_




- [ ] 3.2 Crear/Actualizar método `getDailySummary()`
  - Recibir fecha desde POST (campo 'date')
  - Validar que la fecha esté presente
  - Llamar a `getDailySalesMetrics()` del modelo pasando fecha y sucursal
  - Validar que existan pedidos para la fecha seleccionada
  - Verificar que los datos de pagos se obtengan correctamente de la tabla pedidos_payments
  - Retornar respuesta estructurada con status, message y data
  - Incluir en data: total_sales, card_sales, cash_sales, transfer_sales, total_orders
  - Manejar caso de 0 pedidos con status 404 y mensaje descriptivo
  - _Requirements: 2.4, 2.5, 2.8, 2.10, 2.13_

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
  - Aplicar estilo verde (bg-green-600 hover:bg-green-700)
  - Agregar ícono de recibo (icon-receipt)


  - Configurar evento onClick para llamar a `generateDailyClose()`
  - _Requirements: 2.1, 2.15_

- [ ] 6.2 Refactorizar método `generateDailyClose()` en app.js
  - Crear modal con selector de fecha (input type="date")
  - Agregar botón "Consultar" para ejecutar búsqueda de datos
  - Agregar botón "Imprimir" inicialmente deshabilitado


  - Mostrar mensaje inicial indicando que se debe consultar primero
  - Validar que haya fecha seleccionada antes de consultar
  - Configurar evento onClick del botón "Consultar" para llamar a `loadDailyCloseData()`
  - _Requirements: 2.2, 2.3, 2.14_

- [ ] 6.3 Actualizar método `loadDailyCloseData()` en app.js
  - Mostrar indicador de carga mientras se consultan los datos


  - Realizar petición AJAX a `getDailySummary` con la fecha seleccionada
  - Validar respuesta del servidor
  - Si hay datos, llamar a `renderDailyCloseTicketInModal()` y habilitar botón "Imprimir"
  - Si no hay datos, mostrar mensaje "No hay pedidos registrados para esta fecha"
  - Mantener botón "Imprimir" deshabilitado si no hay datos
  - _Requirements: 2.4, 2.5, 2.6, 2.13_

- [ ] 6.4 Verificar método `renderDailyCloseTicketInModal()` en app.js
  - Confirmar que genera estructura HTML del ticket con logo y título "PEDIDOS DE PASTELERÍA"
  - Verificar que muestra métricas del día correctamente:
    - Venta total del día


    - Ingresos por tarjeta (desde tabla pedidos_payments)
    - Ingresos en efectivo (desde tabla pedidos_payments)
    - Ingresos por transferencia (desde tabla pedidos_payments)
    - Número total de pedidos
  - Aplicar formato de moneda a los totales
  - Usar mismo estilo visual que ticket de pedido personalizado
  - Habilitar botón "Imprimir" después de renderizar
  - _Requirements: 2.7, 2.8, 2.11_

- [ ] 6.5 Verificar método `printDailyCloseTicket()` en app.js
  - Confirmar que abre ventana de impresión con el ticket generado
  - Verificar que el formato sea adecuado para impresión
  - Asegurar que incluye estilos necesarios para la impresión
  - _Requirements: 2.12_

- [ ] 7. Validaciones y manejo de errores
- [x] 7.1 Implementar validaciones en frontend


  - Validar que delivery_type tenga valor válido antes de enviar formulario
  - Verificar que haya fecha seleccionada antes de generar cierre
  - Mostrar mensajes de error apropiados con componente alert()
  - _Requirements: 1.1, 2.8_

- [ ] 7.2 Implementar validaciones en backend
  - Validar que delivery_type sea 'local' o 'domicilio', establecer 'local' por defecto
  - Manejar caso de consulta vacía en getDailySummary
  - Retornar mensajes de error descriptivos
  - _Requirements: 3.2, 3.4_

- [ ] 7.3 Implementar lógica de habilitación/deshabilitación del botón "Imprimir"
  - Verificar que el botón inicie deshabilitado al abrir el modal
  - Aplicar estilos visuales de deshabilitado: opacity-50, cursor-not-allowed
  - Habilitar botón solo después de consulta exitosa con datos
  - Remover estilos de deshabilitado al habilitar
  - Mantener deshabilitado si la consulta no retorna datos
  - Ignorar eventos click cuando el botón está deshabilitado
  - _Requirements: 4.2, 4.3, 4.5, 4.6, 4.7, 4.9_

- [ ] 8. Integración y pruebas finales
- [ ] 8.1 Probar flujo completo de creación de pedido
  - Crear pedido con tipo "local" y verificar guardado
  - Crear pedido con tipo "domicilio" y verificar guardado
  - Verificar visualización correcta en tabla con íconos
  - Editar pedido y cambiar tipo de entrega
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6_

- [ ] 8.2 Probar funcionalidad de cierre del día
  - Abrir modal y verificar estado inicial (botón Imprimir deshabilitado)
  - Intentar presionar "Imprimir" deshabilitado (no debe hacer nada)
  - Presionar "Consultar" sin fecha (debe mostrar alerta)
  - Crear múltiples pedidos con diferentes métodos de pago
  - Registrar pagos en tabla pedidos_payments con diferentes métodos
  - Presionar "Consultar" con fecha válida
  - Verificar que se muestre indicador de carga
  - Verificar que el ticket se renderice correctamente
  - Verificar que el botón "Imprimir" se habilite
  - Verificar cálculos de totales por método de pago
  - Presionar "Imprimir" habilitado (debe abrir ventana de impresión)
  - Probar con fecha sin pedidos (botón debe permanecer deshabilitado)
  - Verificar que pedidos cancelados no se incluyan en cálculos
  - Verificar que los pagos se obtengan desde pedidos_payments
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.10, 4.1, 4.2, 4.3, 4.5, 4.6_

- [ ]* 8.3 Verificar responsive design
  - Probar formulario en móvil y tablet
  - Verificar tabla con nueva columna en diferentes tamaños
  - Probar botón de cierre en dispositivos móviles
  - Verificar ticket en diferentes resoluciones
  - _Requirements: 1.4, 2.1, 2.6_
