# Implementation Plan

- [x] 1. Crear métodos de consulta en el modelo (mdl-reservaciones.php)


  - Implementar los 5 métodos SQL para obtener métricas del dashboard
  - Agregar manejo de errores y valores por defecto
  - _Requirements: 1.1, 2.1, 3.1, 4.1, 5.1_



- [ ] 1.1 Implementar getTotalPedidosMes()
  - Crear método que cuente pedidos del mes filtrados por sucursal y rango de fechas
  - Retornar estructura con 'total_pedidos'
  - Manejar caso cuando no hay datos (retornar 0)

  - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [ ] 1.2 Implementar getDineroEntranteMes()
  - Crear método que sume todos los pagos del período usando LEFT JOIN con evt_payments
  - Usar COALESCE para manejar NULL y retornar 0 cuando no hay pagos

  - Filtrar por fecha de creación del pago, no del evento
  - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [ ] 1.3 Implementar getVentasCerradasMes()
  - Crear método que cuente y sume pedidos con status_process_id = 3

  - Retornar estructura con 'cantidad_cerradas' y 'monto_total_ventas'
  - Filtrar por rango de fechas y sucursal
  - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [x] 1.4 Implementar getCancelacionesMes()

  - Crear método que cuente y sume pedidos con status_process_id = 4
  - Retornar estructura con 'cantidad_canceladas' y 'monto_perdido'
  - Usar COALESCE para manejar casos sin cancelaciones
  - _Requirements: 4.1, 4.2, 4.3, 4.4_



- [ ] 1.5 Implementar getDesgloseEstadosMes()
  - Crear método con GROUP BY status_process_id para obtener conteo por estado
  - Incluir INNER JOIN con status_process para obtener nombres de estados
  - Retornar array con todos los estados presentes en el período


  - _Requirements: 5.1, 5.2, 5.3, 5.4_

- [ ] 2. Actualizar controlador para usar nuevos métodos del modelo
  - Modificar apiVentas() para llamar a los nuevos métodos


  - Actualizar apiResumenVentas() para procesar datos del modelo
  - Agregar validación de parámetros de entrada
  - _Requirements: 1.1, 2.1, 3.1, 4.1, 5.1, 6.1, 6.2_

- [x] 2.1 Refactorizar apiVentas() en ctrl-reservaciones.php

  - Mantener lógica existente de cálculo de fechas (fi, ff)
  - Reemplazar lógica de apiResumenVentas($__row) por llamada a nuevos métodos
  - Pasar parámetros correctos: fi, ff, subsidiaries_id
  - _Requirements: 6.1, 6.2, 6.3_



- [ ] 2.2 Reescribir apiResumenVentas() para usar métodos del modelo
  - Cambiar firma del método para recibir ($fi, $ff, $subsidiaries_id)
  - Llamar a cada método del modelo: getTotalPedidosMes, getDineroEntranteMes, etc.
  - Procesar array de getDesgloseEstadosMes() en estructura simple


  - Retornar estructura de datos según diseño
  - _Requirements: 1.1, 2.1, 3.1, 4.1, 5.1_

- [ ] 2.3 Agregar validación de parámetros en apiVentas()
  - Validar que mes esté entre 1 y 12, usar mes actual si es inválido
  - Validar que año esté en rango razonable (2020-2030), usar año actual si es inválido


  - Verificar que $_SESSION['SUB'] esté definido
  - _Requirements: 6.1, 6.2, 6.4_

- [x] 3. Actualizar frontend para mostrar nuevas métricas

  - Modificar showCardsDashboard() para usar nueva estructura de datos
  - Agregar manejo de errores en renderDashboard()
  - Actualizar descripciones de cards con información del desglose
  - _Requirements: 1.5, 2.5, 3.5, 4.5, 5.5, 6.5_





- [ ] 3.1 Actualizar showCardsDashboard() en app.js
  - Modificar estructura de json para cards usando data.total_pedidos
  - Agregar card para "Pedidos del mes" con desglose en descripción

  - Actualizar card "Dinero entrante" con data.dinero_entrante
  - Agregar card "Ventas cerradas" con cantidad y monto
  - Agregar card "Cancelaciones" con cantidad y monto perdido
  - _Requirements: 1.5, 2.5, 3.5, 4.5, 5.5_


- [ ] 3.2 Mejorar manejo de errores en renderDashboard()
  - Envolver llamada a useFetch en try-catch
  - Crear método getDefaultCards() que retorne estructura con valores en 0
  - Mostrar alerta al usuario si falla la carga de datos
  - _Requirements: 6.5_


- [ ] 3.3 Actualizar formato de visualización de montos
  - Verificar que formatPrice() esté disponible y funcionando
  - Aplicar formato a todos los valores monetarios en las cards
  - Asegurar que cantidades numéricas se muestren sin formato de moneda
  - _Requirements: 2.5, 3.5, 4.5_

- [ ] 4. Optimización y pruebas
  - Verificar rendimiento de consultas SQL
  - Probar con diferentes rangos de fechas
  - Validar que filtros de mes/año funcionen correctamente
  - _Requirements: All requirements_

- [ ] 4.1 Probar consultas SQL con datos reales
  - Ejecutar cada consulta manualmente en la base de datos
  - Verificar que los resultados sean correctos comparando con datos conocidos
  - Probar casos edge: mes sin datos, mes con muchos datos
  - _Requirements: 1.1, 2.1, 3.1, 4.1, 5.1_

- [ ] 4.2 Validar integración completa del dashboard
  - Cargar dashboard y verificar que todas las cards muestren datos
  - Cambiar filtro de mes y verificar actualización de métricas
  - Cambiar filtro de año y verificar cálculos correctos
  - Probar con mes actual (debe mostrar datos en tiempo real)
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [ ] 4.3 Verificar consistencia de datos entre métricas
  - Sumar desglose (cotizaciones + pagados + cancelados) debe igual total_pedidos
  - Verificar que monto de ventas cerradas sea coherente con dinero entrante
  - Validar que cancelaciones no afecten negativamente otras métricas
  - _Requirements: 5.5_

- [ ]* 4.4 Documentar consultas y agregar comentarios en código
  - Agregar comentarios explicativos en cada método del modelo
  - Documentar estructura de retorno de cada método
  - Crear ejemplos de uso en comentarios del controlador
  - _Requirements: All requirements_
