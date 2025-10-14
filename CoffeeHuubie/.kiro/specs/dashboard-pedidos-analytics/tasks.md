# Implementation Plan - Dashboard de Pedidos con Analytics

## Overview

Este plan de implementación detalla las tareas de código necesarias para desarrollar el Dashboard de Pedidos con Analytics. Las tareas están organizadas en orden secuencial, priorizando la funcionalidad core y marcando las pruebas unitarias como opcionales.

---

## Tasks

- [ ] 1. Configurar estructura base del dashboard
  - Crear archivo `dashboard.js` en la carpeta `dev/pedidos/js/`
  - Implementar clase `Dashboard` que extienda de `Templates`
  - Definir constructor con `PROJECT_NAME = "Dashboard"`
  - Implementar método `render()` que llame a `layout()` y `loadDashboard()`
  - _Requirements: 1.1, 8.1, 8.3_

- [ ] 2. Implementar layout y estructura visual del dashboard
  - [ ] 2.1 Crear método `layout()` con `primaryLayout` y `tabLayout`
    - Usar `primaryLayout` para crear contenedor principal con filterBar y container
    - Implementar `tabLayout` con pestañas: Dashboard, Pedidos, Reportes
    - Configurar tema dark y tipo short para las pestañas
    - _Requirements: 8.3, 8.7_

  - [ ] 2.2 Crear método `filterBar()` con selectores dinámicos
    - Implementar `createfilterBar` con selector de sucursal
    - Agregar selector de período de comparación (Mes anterior / Año anterior)
    - Configurar evento `onchange` para llamar a `loadDashboard()`
    - Incluir opción "Todas las sucursales" en el selector
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

  - [ ] 2.3 Crear contenedores para métricas, gráficos y tablas
    - Definir contenedor `metricsContainer` para las 4 tarjetas
    - Definir contenedor `chartContainer` para gráfico de barras
    - Definir contenedor `tableOrdersContainer` para tabla de pedidos
    - Definir contenedor `tableProductsContainer` para top productos
    - Definir contenedor `tableClientsContainer` para top clientes
    - _Requirements: 2.1, 3.1, 4.1, 5.1, 6.1_

- [ ] 3. Implementar carga de datos del dashboard
  - [ ] 3.1 Crear método `loadDashboard()` con petición AJAX
    - Obtener valores de filtros (sucursal, período)
    - Implementar `useFetch` con `opc: "apiDashboard"`
    - Enviar parámetros: month, year, sucursal, periodo
    - Manejar respuesta exitosa llamando a métodos de renderizado
    - Implementar manejo de errores con `alert()` de CoffeeSoft
    - _Requirements: 1.6, 8.1, 8.2, 9.1, 9.2_

  - [ ] 3.2 Implementar sistema de caché para optimizar rendimiento
    - Agregar propiedades `cachedData` y `cacheTimestamp` al constructor
    - Definir `CACHE_DURATION` de 5 minutos
    - Verificar validez del caché antes de hacer petición
    - Actualizar caché después de petición exitosa
    - _Requirements: 9.1, 9.2, 9.5_

  - [ ]* 3.3 Escribir pruebas unitarias para carga de datos
    - Probar que `loadDashboard()` haga la petición correcta
    - Verificar que se manejen errores de conexión
    - Probar que el caché funcione correctamente
    - _Requirements: 9.1, 9.2_

- [ ] 4. Implementar renderizado de tarjetas de métricas
  - [ ] 4.1 Crear método `renderMetrics(data)` con componente `infoCard`
    - Implementar tarjeta de Cotizaciones con count y variation
    - Implementar tarjeta de Ventas Totales con amount y variation
    - Implementar tarjeta de Ingresos con amount y variation
    - Implementar tarjeta de Pendiente por Cobrar con amount y count
    - Configurar colores dinámicos (verde para positivo, rojo para negativo)
    - Formatear montos con `formatPrice()` o `evaluar()`
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9, 2.10_

  - [ ] 4.2 Agregar tarjeta de Cheque Promedio
    - Calcular y mostrar cheque promedio del mes
    - Incluir porcentaje de variación respecto al período anterior
    - Aplicar formato de moneda
    - _Requirements: 7.1, 7.2, 7.5_

  - [ ]* 4.3 Escribir pruebas para renderizado de métricas
    - Verificar que las tarjetas muestren los valores correctos
    - Probar que los colores de variación sean correctos
    - Verificar formato de moneda
    - _Requirements: 2.1-2.10_


- [ ] 5. Implementar gráfico de barras de pedidos por estado
  - [ ] 5.1 Crear método `renderCharts(data)` con componente `barChart`
    - Extraer datos de `data.chartData`
    - Configurar labels: ["Cotizaciones", "Abonados", "Pagados", "Cancelados"]
    - Pasar datos del mes actual y período de comparación
    - Configurar colores corporativos (#103B60, #8CC63F)
    - Implementar tooltips con formato de moneda
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.6_

  - [ ] 5.2 Agregar lógica para gráfico agrupado por sucursal
    - Detectar cuando filtro es "Todas las sucursales"
    - Agrupar datos por sucursal en el gráfico
    - Ajustar leyenda para mostrar sucursales
    - _Requirements: 3.5_

  - [ ]* 5.3 Escribir pruebas para renderizado de gráficos
    - Verificar que el gráfico se renderice correctamente
    - Probar que los datos se muestren en el orden correcto
    - Verificar tooltips
    - _Requirements: 3.1-3.6_

- [ ] 6. Implementar tabla de pedidos por estado
  - [ ] 6.1 Crear método `renderTableOrders(data)` con `createCoffeTable`
    - Definir columnas: Estado, No. Pedidos, Venta
    - Renderizar filas para: Pagados, Abonados, Cotizaciones, Cancelados
    - Aplicar formato de moneda a columna Venta
    - Configurar tema corporativo
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_

  - [ ] 6.2 Agregar columna de Sucursal cuando filtro es "Todas"
    - Detectar filtro de sucursal
    - Agregar columna "Sucursal" dinámicamente
    - Agrupar datos por sucursal
    - _Requirements: 4.7, 4.8_

  - [ ]* 6.3 Escribir pruebas para tabla de pedidos
    - Verificar que se muestren todas las filas
    - Probar formato de moneda
    - Verificar agrupación por sucursal
    - _Requirements: 4.1-4.8_

- [ ] 7. Implementar tabla de Top 10 Productos Vendidos
  - [ ] 7.1 Crear método `renderTopProducts(data)` con `createCoffeTable`
    - Definir columnas: #, Producto, Cantidad
    - Renderizar datos de `data.topProducts.row`
    - Aplicar colores distintivos a primeras 3 posiciones
    - Configurar tema corporativo
    - _Requirements: 5.1, 5.2, 5.3, 5.6, 5.7_

  - [ ]* 7.2 Escribir pruebas para tabla de productos
    - Verificar que se muestren máximo 10 productos
    - Probar ordenamiento por cantidad
    - Verificar colores de ranking
    - _Requirements: 5.1-5.7_

- [ ] 8. Implementar tabla de Top 10 Clientes con Más Compras
  - [ ] 8.1 Crear método `renderTopClients(data)` con `createCoffeTable`
    - Definir columnas: #, Cliente, Compras, Total
    - Renderizar datos de `data.topClients.row`
    - Aplicar formato de moneda a columna Total
    - Aplicar colores distintivos a primeras 3 posiciones
    - Configurar tema corporativo
    - _Requirements: 6.1, 6.2, 6.3, 6.6, 6.7, 6.8_

  - [ ]* 8.2 Escribir pruebas para tabla de clientes
    - Verificar que se muestren máximo 10 clientes
    - Probar ordenamiento por compras
    - Verificar formato de moneda
    - _Requirements: 6.1-6.8_

- [ ] 9. Implementar controlador PHP para dashboard
  - [ ] 9.1 Crear método `apiDashboard()` en ctrl-pedidos.php
    - Recibir parámetros: month, year, sucursal, periodo
    - Validar parámetros requeridos (month, year)
    - Validar rangos (month: 1-12, year: 2020-2100)
    - Calcular período de comparación según tipo (month/year)
    - Llamar a `getDashboardMetrics()` para período actual
    - Llamar a `getDashboardMetrics()` para período anterior
    - Calcular variaciones porcentuales con `calculateVariation()`
    - Obtener datos de gráfico con `getChartData()`
    - Obtener top productos con `getTopProducts()`
    - Obtener top clientes con `getTopClients()`
    - Retornar respuesta JSON con status, message y data
    - _Requirements: 8.2, 8.4, 9.4_

  - [ ] 9.2 Crear método helper `calculateVariation($current, $previous)`
    - Manejar caso de división por cero
    - Calcular porcentaje: ((current - previous) / previous) * 100
    - Redondear a 2 decimales
    - _Requirements: 2.9, 2.10_

  - [ ] 9.3 Crear método `getDashboardMetrics($params)`
    - Extraer parámetros: month, year, subsidiariesId
    - Llamar a `countOrdersByStatus()` para cotizaciones
    - Llamar a `sumOrdersByStatus()` para ventas totales
    - Llamar a `sumPaidOrders()` para ingresos
    - Llamar a `sumPendingBalance()` para pendiente por cobrar
    - Llamar a `countPendingOrders()` para número de pedidos pendientes
    - Llamar a `calculateAverageTicket()` para cheque promedio
    - Retornar array con todas las métricas
    - _Requirements: 2.1-2.8, 7.1-7.5_

  - [ ] 9.4 Crear método `getTopProducts($params)`
    - Llamar a modelo `getProductSales()` con parámetros
    - Iterar sobre resultados y formatear como array de filas
    - Incluir columnas: #, Producto, Cantidad
    - Retornar array con clave 'row'
    - _Requirements: 5.1-5.7_

  - [ ] 9.5 Crear método `getTopClients($params)`
    - Llamar a modelo `getClientPurchases()` con parámetros
    - Iterar sobre resultados y formatear como array de filas
    - Incluir columnas: #, Cliente, Compras, Total
    - Aplicar formato de moneda a Total con `evaluar()`
    - Retornar array con clave 'row'
    - _Requirements: 6.1-6.8_

  - [ ] 9.6 Implementar manejo de errores con try-catch
    - Envolver lógica en bloque try-catch
    - Capturar excepciones y retornar status 400
    - Registrar errores en log con `error_log()`
    - _Requirements: 8.2_

  - [ ]* 9.7 Escribir pruebas unitarias para controlador
    - Probar que apiDashboard retorne status 200 con datos válidos
    - Verificar validación de parámetros
    - Probar cálculo de variaciones
    - Verificar manejo de errores
    - _Requirements: 8.2, 8.4_


- [ ] 10. Implementar consultas SQL en modelo PHP
  - [ ] 10.1 Crear método `countOrdersByStatus($params)` en mdl-pedidos.php
    - Extraer parámetros: status, month, year, subsidiariesId
    - Construir query con filtros de fecha y estado
    - Agregar filtro de sucursal si no es "all"
    - Usar `_Read()` para ejecutar consulta
    - Retornar count o 0 si no hay resultados
    - _Requirements: 2.1, 8.2_

  - [ ] 10.2 Crear método `sumOrdersByStatus($statuses, $month, $year, $subsidiariesId)`
    - Construir lista de estados con `implode()`
    - Crear query con SUM de (total_pay - discount)
    - Filtrar por mes, año y estados
    - Agregar filtro de sucursal si no es "all"
    - Usar `COALESCE` para manejar NULL
    - Retornar total o 0
    - _Requirements: 2.3, 8.2_

  - [ ] 10.3 Crear método `sumPaidOrders($month, $year, $subsidiariesId)`
    - Crear query con JOIN entre payments y orders
    - Sumar columna `pay` de payments
    - Filtrar por fecha de pago (date_pay)
    - Agregar filtro de sucursal en orders
    - Usar `COALESCE` para manejar NULL
    - Retornar total de ingresos
    - _Requirements: 2.5, 2.6, 8.2_

  - [ ] 10.4 Crear método `sumPendingBalance($month, $year, $subsidiariesId)`
    - Crear query que calcule: (total_pay - discount) - SUM(payments)
    - Filtrar pedidos con status IN (1, 2)
    - Usar subconsulta para sumar pagos por pedido
    - Agregar filtro de sucursal
    - Usar `COALESCE` para manejar NULL
    - Retornar saldo pendiente
    - _Requirements: 2.7, 2.8, 8.2_

  - [ ] 10.5 Crear método `countPendingOrders($month, $year, $subsidiariesId)`
    - Crear query con COUNT de pedidos
    - Filtrar por status IN (1, 2)
    - Filtrar por mes y año
    - Agregar filtro de sucursal
    - Retornar número de pedidos pendientes
    - _Requirements: 2.8_

  - [ ] 10.6 Crear método `calculateAverageTicket($month, $year, $subsidiariesId)`
    - Crear query con AVG de (total_pay - discount)
    - Filtrar por status IN (2, 3) - solo pagados y abonados
    - Filtrar por mes y año
    - Agregar filtro de sucursal
    - Usar `COALESCE` para manejar NULL
    - Retornar promedio o 0
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

  - [ ] 10.7 Crear método `getProductSales($params)`
    - Extraer parámetros: month, year, subsidiariesId, limit
    - Crear query con JOIN entre order_details, products y orders
    - Sumar cantidad (SUM(quantity)) agrupando por producto
    - Filtrar por mes, año y status != 4 (no cancelados)
    - Agregar filtro de sucursal
    - Ordenar por cantidad DESC
    - Aplicar LIMIT
    - Retornar array de productos con name y quantity
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 8.2_

  - [ ] 10.8 Crear método `getClientPurchases($params)`
    - Extraer parámetros: month, year, subsidiariesId, limit
    - Crear query con JOIN entre orders y clients
    - Contar pedidos (COUNT) y sumar total (SUM) por cliente
    - Filtrar por mes, año y status != 4
    - Agregar filtro de sucursal
    - Ordenar por purchases DESC, total DESC
    - Aplicar LIMIT
    - Retornar array de clientes con name, purchases y total
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 8.2_

  - [ ] 10.9 Crear método `getChartData($params)`
    - Extraer parámetros: month, year, subsidiariesId
    - Crear query con COUNT agrupado por status
    - Filtrar por mes y año
    - Agregar filtro de sucursal
    - Formatear resultado como array con labels y data
    - Mapear status a labels: 1=Cotizaciones, 2=Abonados, 3=Pagados, 4=Cancelados
    - Retornar array con estructura para Chart.js
    - _Requirements: 3.1, 3.2, 3.4, 8.2_

  - [ ]* 10.10 Escribir pruebas unitarias para modelo
    - Probar cada método con datos de prueba
    - Verificar que las consultas retornen resultados correctos
    - Probar filtros de sucursal
    - Verificar manejo de NULL con COALESCE
    - _Requirements: 8.2, 9.3_

- [ ] 11. Optimizar base de datos con índices
  - [ ] 11.1 Crear índice compuesto para consultas de pedidos
    - Ejecutar: `CREATE INDEX idx_orders_date_subsidiary ON pedidos_orders(date_creation, subsidiaries_id, status)`
    - Verificar que el índice se cree correctamente
    - _Requirements: 9.3_

  - [ ] 11.2 Crear índice para consultas de pagos
    - Ejecutar: `CREATE INDEX idx_payments_date ON pedidos_payments(date_pay, order_id)`
    - Verificar que el índice se cree correctamente
    - _Requirements: 9.3_

  - [ ] 11.3 Crear índice para detalles de pedido
    - Ejecutar: `CREATE INDEX idx_order_details_order_product ON pedidos_order_details(order_id, product_id)`
    - Verificar que el índice se cree correctamente
    - _Requirements: 9.3_

  - [ ] 11.4 Crear índice para clientes por sucursal
    - Ejecutar: `CREATE INDEX idx_clients_subsidiary ON pedidos_clients(subsidiaries_id, active)`
    - Verificar que el índice se cree correctamente
    - _Requirements: 9.3_

  - [ ]* 11.5 Realizar pruebas de rendimiento de consultas
    - Medir tiempo de ejecución de cada query
    - Verificar que se usen los índices con EXPLAIN
    - Confirmar que las consultas se ejecuten en < 500ms
    - _Requirements: 9.1, 9.2, 9.3_


- [ ] 12. Implementar responsividad y estilos
  - [ ] 12.1 Configurar grid responsivo para tarjetas de métricas
    - Aplicar clase `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4`
    - Verificar que en móvil se muestre 1 columna
    - Verificar que en tablet se muestren 2 columnas
    - Verificar que en desktop se muestren 4 columnas
    - _Requirements: 10.1, 10.2, 10.3_

  - [ ] 12.2 Configurar layout responsivo para gráficos y tablas
    - Aplicar clase `grid grid-cols-1 lg:grid-cols-2 gap-6`
    - En móvil: apilar todos los elementos
    - En desktop: mostrar gráficos y tablas lado a lado
    - _Requirements: 10.1, 10.2, 10.3_

  - [ ] 12.3 Implementar scroll horizontal para tablas en móvil
    - Envolver tablas en contenedor con `overflow-x-auto`
    - Aplicar clase `min-w-full` a las tablas
    - Verificar que las tablas sean navegables en móvil
    - _Requirements: 10.5_

  - [ ] 12.4 Ajustar tamaño de gráficos para móvil
    - Configurar `maintainAspectRatio: false` en Chart.js
    - Ajustar altura del contenedor según viewport
    - Verificar legibilidad en pantallas pequeñas
    - _Requirements: 10.4_

  - [ ] 12.5 Aplicar paleta de colores corporativa
    - Usar #103B60 para elementos primarios
    - Usar #8CC63F para elementos de acción
    - Usar #1F2A37 para fondos
    - Usar #3FC189 para indicadores positivos
    - Usar #E05562 para indicadores negativos
    - _Requirements: 8.7_

  - [ ] 12.6 Implementar estados hover y active
    - Agregar efecto hover a tarjetas con `transform: translateY(-4px)`
    - Agregar sombra en hover: `box-shadow: 0 8px 16px rgba(0,0,0,0.2)`
    - Configurar transiciones suaves: `transition: all 0.2s ease`
    - _Requirements: 10.6_

  - [ ]* 12.7 Realizar pruebas de responsividad
    - Probar en Chrome DevTools con diferentes dispositivos
    - Verificar en móvil real (iOS y Android)
    - Probar en tablet
    - Verificar en diferentes navegadores
    - _Requirements: 10.1-10.6_

- [ ] 13. Implementar optimizaciones de rendimiento
  - [ ] 13.1 Agregar sistema de caché en frontend
    - Implementar propiedades `cachedData` y `cacheTimestamp`
    - Definir `CACHE_DURATION` de 5 minutos
    - Verificar validez del caché antes de peticiones
    - Actualizar caché después de respuestas exitosas
    - _Requirements: 9.1, 9.2, 9.5_

  - [ ] 13.2 Implementar lazy loading para gráficos
    - Usar `IntersectionObserver` para detectar visibilidad
    - Cargar gráficos solo cuando sean visibles en viewport
    - Desconectar observer después de carga
    - _Requirements: 9.5_

  - [ ] 13.3 Implementar debouncing en filtros
    - Agregar timer de 300ms en eventos de cambio de filtro
    - Cancelar timer anterior si hay nuevo cambio
    - Ejecutar petición solo después del delay
    - _Requirements: 9.2_

  - [ ] 13.4 Agregar indicador de carga (loader)
    - Mostrar spinner mientras se cargan datos
    - Aplicar animación pulse a elementos en carga
    - Ocultar loader cuando datos estén listos
    - _Requirements: 9.1_

  - [ ]* 13.5 Realizar pruebas de rendimiento
    - Medir tiempo de carga inicial (debe ser < 3s)
    - Medir tiempo de cambio de filtro (debe ser < 1s)
    - Verificar que el caché funcione correctamente
    - Probar con conexión lenta (3G)
    - _Requirements: 9.1, 9.2_

- [ ] 14. Integrar dashboard con sistema existente
  - [ ] 14.1 Agregar pestaña de Dashboard en index.php
    - Modificar `tabLayout` existente para incluir tab "Dashboard"
    - Configurar `onClick` para llamar a `dashboard.render()`
    - Establecer como pestaña activa por defecto
    - _Requirements: 8.1, 8.3_

  - [ ] 14.2 Importar archivo dashboard.js en index.php
    - Agregar `<script src="js/dashboard.js"></script>`
    - Verificar que se cargue después de CoffeeSoft.js
    - Verificar que no haya conflictos con otros scripts
    - _Requirements: 8.1_

  - [ ] 14.3 Inicializar instancia de Dashboard en main.js
    - Crear variable global `let dashboard;`
    - Instanciar en `$(async () => { dashboard = new Dashboard(api, "root"); })`
    - Verificar que se inicialice correctamente
    - _Requirements: 8.1, 8.3_

  - [ ] 14.4 Verificar integración con método init() del controlador
    - Asegurar que `init()` retorne lista de sucursales
    - Usar datos de `init()` para poblar filtro de sucursales
    - Verificar que los datos se carguen correctamente
    - _Requirements: 8.2_

  - [ ]* 14.5 Realizar pruebas de integración end-to-end
    - Probar flujo completo: cargar dashboard → cambiar filtros → ver resultados
    - Verificar que no haya errores en consola
    - Probar navegación entre pestañas
    - Verificar que los datos persistan al cambiar de pestaña
    - _Requirements: 8.1-8.7_

- [ ] 15. Documentación y pruebas finales
  - [ ] 15.1 Documentar métodos principales del frontend
    - Agregar comentarios JSDoc a métodos públicos
    - Documentar parámetros y valores de retorno
    - Incluir ejemplos de uso
    - _Requirements: 8.1_

  - [ ] 15.2 Documentar métodos del controlador
    - Agregar comentarios PHPDoc a métodos públicos
    - Documentar parámetros, tipos y valores de retorno
    - Incluir ejemplos de respuesta JSON
    - _Requirements: 8.2_

  - [ ] 15.3 Documentar consultas SQL del modelo
    - Agregar comentarios explicativos a queries complejas
    - Documentar índices utilizados
    - Incluir ejemplos de resultados
    - _Requirements: 8.2_

  - [ ]* 15.4 Ejecutar checklist de pruebas manuales
    - Verificar que dashboard cargue correctamente
    - Probar todos los filtros
    - Verificar que las métricas sean correctas
    - Probar gráficos y tablas
    - Verificar responsividad
    - Probar manejo de errores
    - _Requirements: 1.1-10.7_

  - [ ]* 15.5 Realizar pruebas de accesibilidad
    - Verificar contraste de colores (mínimo 4.5:1)
    - Probar navegación por teclado
    - Verificar atributos aria-label
    - Probar con lector de pantalla
    - _Requirements: 10.6, 10.7_

---

## Summary

**Total Tasks:** 15 tareas principales
**Total Sub-tasks:** 67 sub-tareas
**Optional Test Tasks:** 15 sub-tareas marcadas con *

**Estimated Effort:**
- Frontend: ~8-10 horas
- Backend (Controller): ~4-6 horas
- Backend (Model): ~6-8 horas
- Database Optimization: ~2-3 horas
- Styling & Responsiveness: ~4-5 horas
- Performance Optimization: ~3-4 horas
- Integration & Testing: ~4-5 horas

**Total Estimated Time:** 31-41 horas

