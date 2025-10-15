# Implementation Plan - Dashboard de Pedidos con Analytics

## Overview

Este plan de implementación detalla las tareas de código necesarias para desarrollar el Dashboard de Pedidos con Analytics siguiendo la estructura del pivote **analytics-sales.js**. El sistema se compone de múltiples clases modulares que heredan de `Templates`, cada una con su propio `render()` y `layout()`.

**Referencia:** Pivote `analitycs sales.md` - Módulo de Ventas

---

## Tasks

- [ ] 1. Configurar estructura base y clases modulares
  - [ ] 1.1 Crear archivo `dashboard-pedidos.js` en `dev/pedidos/js/`
    - Definir variables globales: `let api, app, dashboardPedidos;`
    - Definir variables para datos iniciales: `let lsSucursales, lsStatus;`
    - Implementar función `$(async () => {})` para inicialización
    - Llamar a `useFetch` con `opc: "init"` para obtener datos iniciales
    - Instanciar clases: `app = new App(api, "root")` y `dashboardPedidos = new DashboardPedidos(api, "root")`
    - Llamar a `app.render()`
    - _Requirements: 8.1, 8.3_
    - _Referencia: Líneas 1-25 del pivote_

  - [ ] 1.2 Crear clase `App` que extienda de `Templates`
    - Definir constructor con `PROJECT_NAME = "DashboardPedidos"`
    - Implementar método `render()` que llame a `layout()` y renderice submódulos
    - Implementar método `layout()` con `primaryLayout` y `tabLayout`
    - Crear método `headerBar()` para título y subtítulo del módulo
    - _Requirements: 8.1, 8.3_
    - _Referencia: Clase App del pivote, líneas 27-120_

  - [ ] 1.3 Crear clase `DashboardPedidos` que extienda de `Templates`
    - Definir constructor con `PROJECT_NAME = "DashboardPedidos"`
    - Implementar método `render()` que llame a `layout()`
    - Implementar método `layout()` con `dashboardComponent()`
    - _Requirements: 8.1, 8.3_
    - _Referencia: Clase SalesDashboard del pivote, líneas 122-200_

- [ ] 2. Implementar layout principal con tabs (Clase App)
  - [ ] 2.1 Crear método `layout()` en clase App
    - Usar `this.primaryLayout()` con parent: "root", id: PROJECT_NAME
    - Definir card con filterBar y container
    - Llamar a `this.headerBar()` para título del módulo
    - Llamar a `this.tabLayout()` para crear pestañas
    - Remover clase `h-screen` del content-tabs
    - _Requirements: 8.3, 8.7_
    - _Referencia: Método layout() de App, líneas 50-90_

  - [ ] 2.2 Implementar método `tabLayout()` con pestañas del módulo
    - Configurar parent: `container${this.PROJECT_NAME}`
    - Definir id: "tabsPedidos", theme: "dark", type: "short"
    - Crear tabs: Dashboard (activo), Pedidos, Comparativas, Promedios
    - Configurar onClick para cada tab llamando a métodos de renderizado
    - _Requirements: 8.3_
    - _Referencia: Método layoutTabs() de App, líneas 60-90_

  - [ ] 2.3 Implementar método `headerBar()` personalizado
    - Recibir options con: parent, title, subtitle, icon, textBtn, onClick
    - Crear estructura con título, subtítulo y botón de acción
    - Aplicar estilos Tailwind para layout flex y responsive
    - _Requirements: 8.7_
    - _Referencia: Método headerBar() de App, líneas 95-120_

- [ ] 3. Implementar layout del dashboard (Clase DashboardPedidos)
  - [ ] 3.1 Crear método `layout()` en clase DashboardPedidos
    - Llamar a `this.dashboardComponent()` con configuración completa
    - Definir parent: "container-dashboard", id: "dashboardComponent"
    - Configurar title y subtitle del dashboard
    - Definir json con tipos de contenedores: gráficos y tablas
    - Llamar a `this.filterBarDashboard()` para crear filtros
    - _Requirements: 8.3_
    - _Referencia: Método layout() de SalesDashboard, líneas 130-150_

  - [ ] 3.2 Implementar método `filterBarDashboard()` con selectores
    - Usar `this.createfilterBar()` con parent: "filterBarDashboard"
    - Crear select de UDN/Sucursal con data: lsSucursales
    - Crear input type="month" para período 1 (consultar con)
    - Crear input type="month" para período 2 (comparar con)
    - Configurar onchange para llamar a `dashboardPedidos.renderDashboard()`
    - Establecer valores por defecto: mes actual y mes del año anterior
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_
    - _Referencia: Método filterBarDashboard(), líneas 200-250_

  - [ ] 3.3 Crear método `renderDashboard()` para cargar datos
    - Obtener valores de filtros: udn, periodo1, periodo2
    - Extraer año y mes de cada período
    - Llamar a `useFetch` con `opc: "apiPromediosDiarios"`
    - Enviar parámetros: udn, anio1, mes1, anio2, mes2
    - Llamar a métodos de renderizado: showCards(), gráficos, tablas
    - _Requirements: 1.6, 8.1, 8.2_
    - _Referencia: Método renderDashboard(), líneas 252-280_

- [ ] 4. Implementar tarjetas de métricas (KPIs)
  - [ ] 4.1 Crear método `showCards(data)` con componente `infoCard`
    - Usar `this.infoCard()` con parent: "cardDashboard", theme: "light"
    - Crear tarjeta "Venta del día de ayer" con data.ventaDia
    - Crear tarjeta "Venta del Mes" con data.ventaMes
    - Crear tarjeta "Clientes" con data.Clientes
    - Crear tarjeta "Cheque Promedio" con data.ChequePromedio
    - Aplicar colores: text-[#8CC63F], text-green-800, text-[#103B60], text-red-600
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.7, 2.8_
    - _Referencia: Método showCards(), líneas 282-320_

  - [ ] 4.2 Implementar componente `infoCard()` personalizado
    - Recibir options con: parent, id, class, theme, json, data
    - Soportar tema light y dark
    - Renderizar tarjetas con título, valor y descripción
    - Aplicar colores dinámicos según data.color
    - Crear grid responsive: grid-cols-2 md:grid-cols-4
    - _Requirements: 2.9, 2.10, 8.7_
    - _Referencia: Método infoCard(), líneas 600-650_

  - [ ]* 4.3 Escribir pruebas para tarjetas de métricas
    - Verificar que se rendericen 4 tarjetas
    - Probar formato de moneda
    - Verificar colores según tema
    - _Requirements: 2.1-2.10_


- [ ] 5. Implementar gráficos comparativos
  - [ ] 5.1 Crear método `chequeComparativo(options)` con gráfico de barras
    - Recibir options con: parent, id, title, data, anioA, anioB
    - Obtener períodos de filtros (periodo1 y periodo2)
    - Formatear fechas con moment.js para título dinámico
    - Crear canvas con Chart.js tipo "bar"
    - Configurar datasets con colores #103B60 y #8CC63F
    - Implementar animación onComplete para mostrar valores sobre barras
    - Formatear tooltips con `formatPrice()`
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.6_
    - _Referencia: Método chequeComparativo(), líneas 322-400_

  - [ ] 5.2 Crear método `comparativaIngresosDiarios(options)` con gráfico lineal
    - Usar `this.linearChart()` con parent, id, title, data
    - Configurar título dinámico con períodos de comparación
    - Pasar data.linear del backend
    - _Requirements: 3.1, 3.2_
    - _Referencia: Método comparativaIngresosDiarios(), líneas 402-420_

  - [ ] 5.3 Crear método `ventasPorDiaSemana(data)` con gráfico de barras
    - Usar `this.barChart()` con parent: "ventasDiasSemana"
    - Configurar title: "Ventas por Día de Semana"
    - Pasar data del backend con estructura de barras
    - _Requirements: 3.1, 3.2_
    - _Referencia: Método ventasPorDiaSemana(), líneas 422-430_

  - [ ]* 5.4 Escribir pruebas para gráficos
    - Verificar renderizado de gráficos
    - Probar animaciones
    - Verificar tooltips con formato correcto
    - _Requirements: 3.1-3.6_

- [ ] 6. Implementar componentes de gráficos reutilizables
  - [ ] 6.1 Crear método `linearChart(options)` para gráficos lineales
    - Recibir options con: parent, id, title, class, data
    - Crear contenedor con título y canvas
    - Configurar Chart.js tipo "line"
    - Implementar tooltips personalizados con data.tooltip
    - Formatear valores con `formatPrice()`
    - Destruir gráfico anterior si existe (window._charts[id])
    - _Requirements: 3.1, 3.2, 8.3_
    - _Referencia: Método linearChart(), líneas 650-700_

  - [ ] 6.2 Crear método `barChart(options)` para gráficos de barras
    - Recibir options con: parent, id, title, labels, dataA, dataB, yearA, yearB
    - Crear contenedor con título y canvas
    - Configurar Chart.js tipo "bar"
    - Aplicar colores: #103B60 para período 1, #8CC63F para período 2
    - Implementar leyenda con usePointStyle
    - Formatear tooltips con `formatPrice()`
    - _Requirements: 3.1, 3.2, 3.3, 8.3_
    - _Referencia: Método barChart(), líneas 702-780_

  - [ ]* 6.3 Escribir pruebas para componentes de gráficos
    - Verificar que se creen correctamente
    - Probar destrucción de gráficos anteriores
    - Verificar tooltips personalizados
    - _Requirements: 3.1-3.6_

- [ ] 7. Implementar rankings y tablas especiales
  - [ ] 7.1 Crear método `topDiasSemana(options)` para ranking semanal
    - Recibir options con: parent, title, subtitle, data
    - Crear contenedor con borde y fondo blanco
    - Renderizar header con título y subtítulo
    - Iterar sobre data y crear filas con colores dinámicos
    - Aplicar paleta de colores: verde, azul, púrpura, naranja, gris
    - Mostrar: ranking (#), día, promedio, veces, clientes
    - Formatear montos con `formatPrice()`
    - Destacar primer lugar con "⭐ Mejor día"
    - _Requirements: 5.1, 5.2, 5.3, 5.6, 5.7_
    - _Referencia: Método topDiasSemana(), líneas 782-850_

  - [ ]* 7.2 Crear método `topDiasMes(options)` para mejores días del mes (opcional)
    - Similar a topDiasSemana pero con datos diarios
    - Mostrar: ranking, fecha, día, clientes, total, nota
    - Aplicar colores distintivos a top 5
    - _Requirements: 5.1-5.7_
    - _Referencia: Método topDiasMes(), líneas 852-920_

- [ ] 8. Implementar componente `dashboardComponent()` personalizado
  - [ ] 8.1 Crear método `dashboardComponent(options)` para layout del dashboard
    - Recibir options con: parent, id, title, subtitle, json
    - Crear estructura HTML con header, filterBar, cardDashboard y content
    - Renderizar título y subtítulo en header
    - Crear contenedor para filterBar con id "filterBarDashboard"
    - Crear sección para cards con id "cardDashboard"
    - Crear grid para contenido: grid-cols-1 md:grid-cols-2
    - Iterar sobre json y crear bloques según tipo (grafico, tabla, doc, filterBar)
    - Agregar títulos con emojis e iconos a cada bloque
    - Aplicar estilos: bg-white, rounded-xl, shadow-md, border
    - _Requirements: 8.3, 8.7, 10.1, 10.2_
    - _Referencia: Método dashboardComponent(), líneas 432-500_

  - [ ]* 8.2 Escribir pruebas para dashboardComponent
    - Verificar que se creen todos los contenedores
    - Probar renderizado de bloques dinámicos
    - Verificar estilos responsive
    - _Requirements: 8.3, 10.1-10.3_

- [ ] 9. Implementar controlador PHP para dashboard (ctrl-pedidos.php)
  - [ ] 9.1 Crear método `apiDashboard()` siguiendo estructura del pivote
    - Recibir parámetros: udn, anio1, mes1, anio2, mes2
    - Llamar a métodos del modelo para obtener métricas
    - Estructurar respuesta con: dashboard (cards), barras (gráfico comparativo), linear (gráfico lineal), barDays (días semana), topWeek (ranking)
    - Retornar array con todas las secciones del dashboard
    - _Requirements: 8.2, 8.4, 9.4_
    - _Referencia: Estructura similar a ctrl-ingresos.php del pivote_

  - [ ] 9.2 Implementar lógica para cards del dashboard
    - Calcular ventaDia: ventas del día anterior
    - Calcular ventaMes: suma de ventas del mes actual
    - Calcular Clientes: número de clientes únicos del mes
    - Calcular ChequePromedio: promedio de ticket del mes
    - Retornar array con estos 4 valores
    - _Requirements: 2.1-2.8, 7.1-7.5_

  - [ ] 9.3 Implementar lógica para gráfico de barras comparativo
    - Obtener datos de ambos períodos (anio1/mes1 vs anio2/mes2)
    - Estructurar dataset con labels y arrays A y B
    - Incluir anioA y anioB para leyenda
    - Retornar estructura compatible con método chequeComparativo()
    - _Requirements: 3.1, 3.2, 3.3_

  - [ ] 9.4 Implementar lógica para gráfico lineal de ingresos diarios
    - Obtener ventas día por día de ambos períodos
    - Estructurar datasets con labels, data y tooltip
    - Retornar estructura compatible con linearChart()
    - _Requirements: 3.1, 3.2_

  - [ ] 9.5 Implementar lógica para gráfico de barras por día de semana
    - Agrupar ventas por día de la semana (Lunes-Domingo)
    - Calcular totales para cada día
    - Estructurar con labels, dataA (año actual), dataB (año anterior)
    - Retornar estructura compatible con barChart()
    - _Requirements: 3.1, 3.2_

  - [ ] 9.6 Implementar lógica para ranking semanal (topWeek)
    - Calcular promedio de ventas por día de la semana
    - Ordenar días por promedio descendente
    - Incluir: dia, promedio, veces (frecuencia), clientes
    - Retornar array ordenado para topDiasSemana()
    - _Requirements: 5.1-5.7_

  - [ ]* 9.7 Escribir pruebas unitarias para controlador
    - Probar que apiDashboard retorne estructura correcta
    - Verificar cálculos de métricas
    - Probar agrupaciones por día de semana
    - _Requirements: 8.2, 8.4_


- [ ] 10. Implementar consultas SQL en modelo PHP (mdl-pedidos.php)
  - [ ] 10.1 Crear método `getOrdersDashboard($params)` para métricas generales
    - Recibir parámetros: mes, anio, subsidiariesId
    - Crear query con SUM, COUNT y AVG de pedidos
    - Filtrar por MONTH(date_creation) y YEAR(date_creation)
    - Agregar filtro de sucursal con subsidiaries_id
    - Excluir pedidos cancelados (status != 4)
    - Usar `_Select` o `_Read` según complejidad
    - Retornar array con: totalVentas, numPedidos, chequePromedio, numClientes
    - _Requirements: 2.1-2.8, 7.1-7.5, 8.2_

  - [ ] 10.2 Crear método `getOrdersByDay($params)` para ventas diarias
    - Recibir parámetros: mes, anio, subsidiariesId
    - Crear query con GROUP BY DATE(date_creation)
    - Calcular SUM(total_pay - COALESCE(discount, 0)) por día
    - Filtrar por mes, año y sucursal
    - Ordenar por fecha ASC
    - Retornar array con: fecha, total, clientes
    - _Requirements: 3.1, 3.2, 8.2_

  - [ ] 10.3 Crear método `getOrdersByWeekday($params)` para ventas por día de semana
    - Recibir parámetros: mes, anio, subsidiariesId
    - Crear query con GROUP BY DAYOFWEEK(date_creation)
    - Usar DAYNAME() para obtener nombre del día
    - Calcular SUM(total_pay), COUNT(*), AVG(total_pay)
    - Filtrar por mes, año y sucursal
    - Retornar array con: dia, total, promedio, veces, clientes
    - _Requirements: 5.1-5.7, 8.2_

  - [ ] 10.4 Crear método `getTopProducts($params)` para productos más vendidos
    - Recibir parámetros: mes, anio, subsidiariesId, limit
    - Crear query con JOIN entre order_details, products y orders
    - Agrupar por product_id y sumar quantity
    - Filtrar por mes, año, sucursal y status != 4
    - Ordenar por quantity DESC
    - Aplicar LIMIT (default: 10)
    - Retornar array con: name, quantity
    - _Requirements: 5.1-5.7, 8.2_

  - [ ] 10.5 Crear método `getTopClients($params)` para clientes con más compras
    - Recibir parámetros: mes, anio, subsidiariesId, limit
    - Crear query con JOIN entre orders y clients
    - Agrupar por client_id
    - Calcular COUNT(orders) y SUM(total_pay)
    - Filtrar por mes, año, sucursal y status != 4
    - Ordenar por COUNT DESC, SUM DESC
    - Aplicar LIMIT (default: 10)
    - Retornar array con: name, purchases, total
    - _Requirements: 6.1-6.8, 8.2_

  - [ ] 10.6 Crear método `getComparativeData($params)` para comparativas
    - Recibir parámetros: mes1, anio1, mes2, anio2, subsidiariesId
    - Ejecutar consultas para ambos períodos
    - Estructurar respuesta con datasets A y B
    - Incluir labels para categorías
    - Retornar estructura compatible con gráficos comparativos
    - _Requirements: 3.1, 3.2, 3.3, 8.2_

  - [ ]* 10.7 Escribir pruebas unitarias para modelo
    - Probar cada método con datos de prueba
    - Verificar agrupaciones (GROUP BY)
    - Probar filtros de fecha y sucursal
    - Verificar ordenamiento y límites
    - _Requirements: 8.2, 9.3_

- [ ] 11. Optimizar base de datos con índices
  - [ ] 11.1 Crear índices para optimizar consultas del dashboard
    - Crear índice: `idx_orders_date_subsidiary` en (date_creation, subsidiaries_id, status)
    - Crear índice: `idx_payments_date` en (date_pay, order_id)
    - Crear índice: `idx_order_details_order_product` en (order_id, product_id)
    - Crear índice: `idx_clients_subsidiary` en (subsidiaries_id, active)
    - Verificar creación con `SHOW INDEX FROM table_name`
    - _Requirements: 9.3_

  - [ ]* 11.2 Realizar pruebas de rendimiento de consultas
    - Usar EXPLAIN para verificar uso de índices
    - Medir tiempo de ejecución con BENCHMARK
    - Confirmar que consultas se ejecuten en < 500ms
    - _Requirements: 9.1, 9.2, 9.3_


- [ ] 12. Implementar responsividad y estilos siguiendo pivote
  - [ ] 12.1 Aplicar paleta de colores CoffeeSoft
    - Azul corporativo: #103B60 (elementos primarios)
    - Verde acción: #8CC63F (botones, indicadores positivos)
    - Gris claro: #EAEAEA (fondos secundarios)
    - Fondos oscuros: #1F2A37, #283341
    - Colores de estado: #3FC189 (éxito), #E05562 (peligro), #F2C215 (advertencia)
    - _Requirements: 8.7_
    - _Referencia: Paleta del pivote_

  - [ ] 12.2 Configurar grid responsivo para dashboard
    - Cards: `grid grid-cols-2 md:grid-cols-4 gap-4`
    - Gráficos: `grid grid-cols-1 md:grid-cols-2 gap-6`
    - Verificar adaptación en móvil, tablet y desktop
    - _Requirements: 10.1, 10.2, 10.3_

  - [ ] 12.3 Aplicar estilos a componentes siguiendo pivote
    - Tarjetas: `bg-white rounded-xl shadow-md border`
    - Gráficos: `border p-4 rounded-xl`
    - Tablas: usar tema corporativo de CoffeeSoft
    - Aplicar transiciones suaves: `transition: all 0.2s ease`
    - _Requirements: 8.7, 10.6_

  - [ ]* 12.4 Realizar pruebas de responsividad
    - Probar en diferentes dispositivos y navegadores
    - Verificar legibilidad de gráficos en móvil
    - Probar scroll horizontal en tablas
    - _Requirements: 10.1-10.6_

- [ ] 13. Implementar optimizaciones de rendimiento (opcional)
  - [ ]* 13.1 Agregar sistema de caché en frontend
    - Implementar propiedades `cachedData` y `cacheTimestamp`
    - Definir `CACHE_DURATION` de 5 minutos
    - Verificar validez antes de peticiones
    - _Requirements: 9.1, 9.2, 9.5_

  - [ ]* 13.2 Implementar lazy loading para gráficos
    - Usar `IntersectionObserver` para detectar visibilidad
    - Cargar gráficos solo cuando sean visibles
    - _Requirements: 9.5_

  - [ ]* 13.3 Agregar indicador de carga
    - Mostrar spinner mientras se cargan datos
    - Aplicar animación pulse
    - _Requirements: 9.1_

- [ ] 14. Integrar dashboard con sistema existente
  - [ ] 14.1 Actualizar método `init()` en ctrl-pedidos.php
    - Agregar retorno de lista de sucursales (lsSucursales)
    - Agregar retorno de lista de estados (lsStatus)
    - Verificar que retorne estructura correcta
    - _Requirements: 8.2_

  - [ ] 14.2 Importar archivo dashboard-pedidos.js en index.php
    - Agregar `<script src="js/dashboard-pedidos.js"></script>`
    - Verificar que se cargue después de CoffeeSoft.js y plugins.js
    - Verificar orden de carga de scripts
    - _Requirements: 8.1_

  - [ ] 14.3 Verificar inicialización en archivo principal
    - Confirmar que variables globales se declaren correctamente
    - Verificar que `useFetch` con `opc: "init"` funcione
    - Confirmar que instancias se creen correctamente
    - Verificar que `app.render()` se ejecute
    - _Requirements: 8.1, 8.3_

  - [ ]* 14.4 Realizar pruebas de integración end-to-end
    - Probar flujo completo de carga del dashboard
    - Verificar cambio de filtros y actualización de datos
    - Probar navegación entre pestañas
    - Verificar que no haya errores en consola
    - _Requirements: 8.1-8.7_

- [ ] 15. Documentación y pruebas finales
  - [ ]* 15.1 Documentar métodos principales
    - Agregar comentarios a métodos complejos del frontend
    - Documentar parámetros de métodos del controlador
    - Incluir ejemplos de uso en comentarios
    - _Requirements: 8.1, 8.2_

  - [ ]* 15.2 Ejecutar checklist de pruebas manuales
    - Verificar carga correcta del dashboard
    - Probar todos los filtros (sucursal, períodos)
    - Verificar métricas en tarjetas
    - Probar gráficos (barras, lineal, días semana)
    - Verificar tablas (pedidos, productos, clientes)
    - Probar responsividad en diferentes dispositivos
    - Verificar manejo de errores
    - _Requirements: 1.1-10.7_

  - [ ]* 15.3 Realizar pruebas de accesibilidad (opcional)
    - Verificar contraste de colores
    - Probar navegación por teclado
    - Verificar atributos aria-label
    - _Requirements: 10.6, 10.7_

---

## Summary

**Total Tasks:** 15 tareas principales
**Total Sub-tasks:** 52 sub-tareas (reducidas y optimizadas)
**Optional Test Tasks:** 18 sub-tareas marcadas con *

**Estructura basada en pivote:** analytics-sales.js

**Clases principales:**
- `App`: Clase principal con layout y tabs
- `DashboardPedidos`: Dashboard con métricas y gráficos

**Componentes reutilizables:**
- `dashboardComponent()`: Layout del dashboard
- `infoCard()`: Tarjetas de métricas
- `linearChart()`: Gráficos lineales
- `barChart()`: Gráficos de barras
- `topDiasSemana()`: Rankings con colores

**Estimated Effort:**
- Frontend (JS): ~10-12 horas
- Backend (Controller): ~5-7 horas
- Backend (Model): ~6-8 horas
- Database Optimization: ~2-3 horas
- Styling & Integration: ~4-5 horas

**Total Estimated Time:** 27-35 horas

