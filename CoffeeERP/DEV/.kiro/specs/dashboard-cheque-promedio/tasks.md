# Implementation Plan

- [x] 1. Configurar estructura base del dashboard


  - Agregar nueva pestaña "Dashboard Cheque Promedio" en el módulo de ventas existente
  - Crear contenedor HTML para el dashboard dentro de kpi-ventas.js
  - Configurar routing y activación de la pestaña
  - _Requirements: 1.1, 5.1_



- [ ] 2. Implementar clase ChequePromedioDashboard en frontend
- [ ] 2.1 Crear clase base y constructor
  - Crear clase `ChequePromedioDashboard extends Templates` en kpi-ventas.js
  - Implementar constructor con parámetros link y div_modulo
  - Definir PROJECT_NAME = "chequePromedio"

  - _Requirements: 1.1, 6.3_

- [ ] 2.2 Implementar método layout()
  - Crear estructura HTML del dashboard usando primaryLayout()
  - Definir contenedores para cards, gráficos y filtros

  - Aplicar clases CSS de CoffeeSoft
  - _Requirements: 1.1, 7.1, 7.2_

- [ ] 2.3 Implementar filterBarDashboard()
  - Crear barra de filtros con createfilterBar()
  - Agregar selectores: UDN, mes, año

  - Configurar valores por defecto (mes y año actual)
  - Vincular evento onChange a renderDashboard()
  - _Requirements: 5.1, 5.2, 5.3_


- [x] 2.4 Implementar método render()

  - Llamar a layout() para crear estructura
  - Llamar a filterBarDashboard() para crear filtros
  - Ejecutar renderDashboard() para cargar datos iniciales
  - _Requirements: 1.1, 5.1_

- [x] 3. Implementar renderizado de métricas principales

- [ ] 3.1 Crear método showCards()
  - Recibir objeto data con métricas (ventaDia, ventaMes, clientes, chequePromedio)
  - Usar componente infoCard() de CoffeeSoft
  - Configurar 4 cards con títulos, valores y colores
  - Mostrar variaciones porcentuales con año anterior

  - _Requirements: 1.1, 1.3, 1.4, 2.1, 2.2, 2.3, 2.4_


- [ ] 3.2 Implementar formato de valores
  - Aplicar formatPrice() para valores monetarios
  - Mostrar clientes como número entero
  - Agregar símbolo "+" o "-" según variación
  - Aplicar colores: verde para positivo, rojo para negativo
  - _Requirements: 1.4, 2.2, 2.3, 7.1_


- [ ] 4. Implementar gráfico de cheque promedio por día de semana
- [ ] 4.1 Crear método renderChequePorDia()
  - Recibir objeto data con labels y valores por día

  - Usar componente barChart() de CoffeeSoft
  - Configurar eje X con días de la semana (Lunes a Domingo)
  - Configurar eje Y con valores de cheque promedio

  - _Requirements: 3.1, 3.3, 7.3_

- [ ] 4.2 Configurar visualización del gráfico
  - Aplicar color azul #103B60 para las barras
  - Mostrar tooltips con valores formateados
  - Agregar título descriptivo al gráfico

  - Hacer responsive el gráfico
  - _Requirements: 3.1, 7.1, 7.3_


- [ ] 5. Implementar gráfico comparativo por categoría
- [ ] 5.1 Crear método renderChequeCategoria()
  - Recibir objeto data con categorías, valores actual y anterior

  - Usar componente barChart() de CoffeeSoft
  - Configurar dos datasets: año actual y año anterior
  - Mostrar leyenda con años comparados
  - _Requirements: 4.1, 4.2, 4.3_


- [ ] 5.2 Configurar categorías según UDN
  - Si UDN = 1 (hotel): mostrar Hospedaje, A&B, Diversos
  - Si UDN = restaurante: mostrar Alimentos, Bebidas, Complementos
  - Aplicar colores: azul #103B60 (actual), verde #8CC63F (anterior)

  - _Requirements: 4.4, 4.5, 7.1_


- [ ] 6. Implementar método principal renderDashboard()
- [ ] 6.1 Obtener valores de filtros
  - Leer valores de UDN, mes y año desde FilterBar
  - Validar que los valores sean correctos
  - _Requirements: 5.1, 5.2_

- [ ] 6.2 Realizar llamada AJAX al backend
  - Usar useFetch() para llamar a ctrl-ingresos.php
  - Enviar parámetros: opc="getDashboardChequePromedio", udn, mes, anio
  - Manejar respuesta asíncrona con async/await
  - _Requirements: 6.1, 6.2_

- [-] 6.3 Renderizar componentes con datos


  - Llamar a showCards() con response.cards
  - Llamar a renderChequePorDia() con response.chequePorDia
  - Llamar a renderChequeCategoria() con response.chequePorCategoria
  - Manejar errores con alert() de CoffeeSoft
  - _Requirements: 1.1, 1.5, 5.2, 5.5_


- [ ] 7. Implementar backend - Controlador
- [ ] 7.1 Crear método getDashboardChequePromedio() en ctrl-ingresos.php
  - Recibir parámetros: udn, mes, anio desde $_POST
  - Validar parámetros de entrada
  - Calcular mes y año anterior para comparativas

  - _Requirements: 6.1, 6.2_

- [ ] 7.2 Obtener datos del mes actual
  - Llamar a ingresosMensuales() del modelo con mes y año actual
  - Extraer totalGeneral, totalHabitaciones (clientes)

  - Calcular chequePromedio = totalGeneral / totalHabitaciones
  - Manejar división por cero (retornar 0 si clientes = 0)
  - _Requirements: 1.3, 1.5_

- [x] 7.3 Obtener datos del año anterior

  - Llamar a ingresosMensuales() con mismo mes del año anterior

  - Extraer mismas métricas que período actual
  - Calcular chequePromedio del año anterior
  - _Requirements: 2.1, 2.5_

- [ ] 7.4 Calcular variaciones porcentuales
  - Calcular variación de ventaMes: ((actual - anterior) / anterior) * 100

  - Calcular variación de clientes
  - Calcular variación de chequePromedio
  - Formatear con símbolo "+" o "-" y símbolo "%"
  - _Requirements: 2.1, 2.2, 2.3_


- [x] 7.5 Obtener venta del día anterior

  - Crear o reutilizar método getVentasDelDia() del modelo
  - Obtener fecha de ayer (date('Y-m-d', strtotime('-1 day')))
  - Sumar ventas de todas las categorías del día
  - Formatear con evaluar()
  - _Requirements: 1.1_


- [ ] 7.6 Construir objeto cards para respuesta
  - Crear array con ventaDia, ventaMes, clientes, chequePromedio
  - Formatear valores monetarios con evaluar()
  - Incluir variaciones porcentuales
  - _Requirements: 1.1, 1.4, 2.4_

- [x] 8. Implementar cálculo de cheque promedio por día de semana

- [ ] 8.1 Crear método getChequePorDiaSemana() en modelo
  - Recibir parámetros: udn, mes, anio

  - Consultar ventas agrupadas por día de la semana (DAYOFWEEK)
  - Calcular promedio de cheque para cada día
  - Retornar array con 7 elementos (Lunes a Domingo)

  - _Requirements: 3.1, 3.2, 3.4_

- [ ] 8.2 Procesar datos en controlador
  - Llamar a getChequePorDiaSemana() desde getDashboardChequePromedio()

  - Crear array labels con nombres de días en español
  - Crear array data con valores de cheque promedio



  - Manejar días sin datos (asignar 0)
  - _Requirements: 3.3, 3.5_


- [ ] 9. Implementar comparativa de cheque promedio por categoría
- [ ] 9.1 Reutilizar método getComparativaChequePromedio() del modelo
  - Llamar con parámetros: mes, año actual, udn
  - Llamar nuevamente con año anterior
  - Extraer valores por categoría (A&B, Alimentos, Bebidas)

  - _Requirements: 4.1, 4.2, 6.3_

- [ ] 9.2 Construir estructura de respuesta
  - Crear array labels con nombres de categorías
  - Crear array actual con valores del año actual
  - Crear array anterior con valores del año anterior

  - Incluir anioActual y anioAnterior en respuesta
  - _Requirements: 4.3, 4.4, 4.5_

- [ ] 10. Construir respuesta JSON completa del backend
  - Combinar todos los datos calculados en un solo array
  - Estructura: { status: 200, cards: {...}, chequePorDia: {...}, chequePorCategoria: {...} }
  - Retornar JSON con json_encode()
  - _Requirements: 6.2, 6.4_

- [ ] 11. Integrar dashboard en módulo de ventas
- [ ] 11.1 Agregar pestaña en tabLayout()
  - Modificar método layout() de clase App en kpi-ventas.js
  - Agregar nuevo objeto en json de tabLayout()
  - Configurar id, tab, onClick para activar dashboard
  - _Requirements: 7.2_

- [ ] 11.2 Instanciar clase ChequePromedioDashboard
  - Crear instancia global: chequePromedioDashboard
  - Inicializar en $(async () => {}) con api y "root"
  - Llamar a render() en el orden correcto
  - _Requirements: 6.3, 7.2_

- [ ] 12. Validación y manejo de errores
- [ ] 12.1 Validar parámetros en backend
  - Verificar que mes esté entre 1 y 12
  - Verificar que año sea válido (> 2000)
  - Verificar que udn exista en base de datos
  - Retornar error 400 si validación falla
  - _Requirements: 5.5, 6.5_

- [ ] 12.2 Manejar errores en frontend
  - Implementar try-catch en renderDashboard()
  - Mostrar alert() con mensaje de error si falla AJAX
  - Mostrar valores en cero si no hay datos
  - _Requirements: 1.5, 5.5_

- [ ]* 13. Testing y validación
- [ ]* 13.1 Probar con diferentes UDN
  - Verificar que categorías cambien según UDN (hotel vs restaurante)
  - Validar cálculos de cheque promedio
  - _Requirements: 4.4, 4.5_

- [ ]* 13.2 Probar con períodos sin datos
  - Seleccionar mes/año sin registros
  - Verificar que muestre valores en cero sin errores
  - _Requirements: 1.5, 5.5_

- [ ]* 13.3 Probar comparativas año anterior
  - Verificar cálculo correcto de variaciones porcentuales
  - Validar colores (verde +, rojo -)
  - _Requirements: 2.1, 2.2, 2.3_

- [ ]* 13.4 Validar responsive y estilos
  - Probar en diferentes resoluciones
  - Verificar paleta de colores CoffeeSoft
  - Validar tooltips en gráficos
  - _Requirements: 7.1, 7.3_
