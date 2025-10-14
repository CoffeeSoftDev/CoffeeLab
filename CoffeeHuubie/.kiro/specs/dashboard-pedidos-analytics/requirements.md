# Requirements Document - Dashboard de Pedidos con Analytics

## Introduction

Este documento define los requisitos para el desarrollo de un dashboard interactivo de análisis de pedidos que permita visualizar métricas clave, comparativas temporales y rankings de productos y clientes. El dashboard debe proporcionar información consolidada en tiempo real para facilitar la toma de decisiones operativas y comerciales del sistema de pedidos.

El sistema debe permitir filtrar información por sucursal, realizar comparativas mensuales y anuales, y presentar datos mediante tarjetas resumen (cards), gráficos interactivos y tablas detalladas.

## Requirements

### Requirement 1: Filtros Dinámicos del Dashboard

**User Story:** Como usuario del sistema, quiero poder filtrar la información del dashboard por sucursal y período de tiempo, para analizar el desempeño de cada unidad de negocio en diferentes rangos temporales.

#### Acceptance Criteria

1. WHEN el usuario accede al dashboard THEN el sistema SHALL mostrar un selector de sucursal con todas las sucursales disponibles más la opción "Todas las sucursales"
2. WHEN el usuario selecciona una sucursal específica THEN el sistema SHALL actualizar todas las métricas, gráficos y tablas mostrando únicamente datos de esa sucursal
3. WHEN el usuario selecciona "Todas las sucursales" THEN el sistema SHALL mostrar datos consolidados de todas las sucursales
4. WHEN el usuario accede al dashboard THEN el sistema SHALL mostrar un selector de período de comparación con las opciones "Mes anterior" y "Año anterior"
5. WHEN el usuario selecciona un período de comparación THEN el sistema SHALL actualizar las tarjetas de métricas mostrando el porcentaje de variación respecto al período seleccionado
6. WHEN el usuario cambia cualquier filtro THEN el sistema SHALL actualizar automáticamente todos los componentes del dashboard sin recargar la página

### Requirement 2: Tarjetas de Métricas (Cards)

**User Story:** Como gerente de operaciones, quiero visualizar métricas clave del mes actual en tarjetas resumen con comparativas del período anterior, para evaluar rápidamente el desempeño del negocio.

#### Acceptance Criteria

1. WHEN el dashboard se carga THEN el sistema SHALL mostrar una tarjeta con el número total de cotizaciones del mes actual
2. WHEN se muestra la tarjeta de cotizaciones THEN el sistema SHALL incluir el porcentaje de variación respecto al período de comparación seleccionado (mes o año anterior)
3. WHEN el dashboard se carga THEN el sistema SHALL mostrar una tarjeta con el monto total de ventas del mes (suma de todos los pedidos pagados y abonados)
4. WHEN se muestra la tarjeta de ventas totales THEN el sistema SHALL incluir una leyenda inferior mostrando el porcentaje de variación (ej: "2% más comparada con el mes anterior")
5. WHEN el dashboard se carga THEN el sistema SHALL mostrar una tarjeta con el monto total de ingresos del mes (pedidos completamente pagados más abonos parciales)
6. WHEN se muestra la tarjeta de ingresos THEN el sistema SHALL incluir el porcentaje de variación respecto al período anterior
7. WHEN el dashboard se carga THEN el sistema SHALL mostrar una tarjeta con el monto pendiente por cobrar del mes (saldo de pedidos no liquidados)
8. WHEN se muestra la tarjeta de pendiente por cobrar THEN el sistema SHALL incluir el número de pedidos con saldo pendiente
9. IF el porcentaje de variación es positivo THEN el sistema SHALL mostrar el indicador en color verde con ícono de flecha hacia arriba
10. IF el porcentaje de variación es negativo THEN el sistema SHALL mostrar el indicador en color rojo con ícono de flecha hacia abajo

### Requirement 3: Gráfico de Barras - Pedidos por Estado

**User Story:** Como analista de ventas, quiero visualizar en un gráfico de barras la distribución de pedidos por estado (Cotizaciones, Pagados, Cancelados), para identificar patrones en el flujo de pedidos del mes.

#### Acceptance Criteria

1. WHEN el dashboard se carga THEN el sistema SHALL mostrar un gráfico de barras con tres categorías: Cotizaciones, Pagados y Cancelados
2. WHEN se renderiza el gráfico THEN el sistema SHALL mostrar el número de pedidos en cada categoría para el mes actual
3. WHEN el usuario pasa el cursor sobre una barra THEN el sistema SHALL mostrar un tooltip con el número exacto de pedidos y el porcentaje que representa del total
4. WHEN se aplica un filtro de sucursal THEN el sistema SHALL actualizar el gráfico mostrando únicamente los datos de la sucursal seleccionada
5. WHEN se selecciona "Todas las sucursales" THEN el sistema SHALL mostrar barras agrupadas por sucursal para cada estado
6. WHEN el gráfico se actualiza THEN el sistema SHALL aplicar animaciones suaves de transición

### Requirement 4: Tabla de Pedidos por Estado

**User Story:** Como gerente comercial, quiero ver una tabla detallada con el número de pedidos y monto de ventas por estado, para analizar la distribución de ingresos por categoría.

#### Acceptance Criteria

1. WHEN el dashboard se carga THEN el sistema SHALL mostrar una tabla con las columnas: Estado, No. Pedidos, Venta
2. WHEN se muestra la tabla THEN el sistema SHALL incluir filas para: Pagados, Abonados, Cotizaciones y Cancelados
3. WHEN se muestra la fila de "Pagados" THEN el sistema SHALL mostrar el número de pedidos con status=3 y la suma total de sus montos
4. WHEN se muestra la fila de "Abonados" THEN el sistema SHALL mostrar el número de pedidos con status=2 y la suma total de sus montos
5. WHEN se muestra la fila de "Cotizaciones" THEN el sistema SHALL mostrar el número de pedidos con status=1 y monto $0
6. WHEN se muestra la fila de "Cancelados" THEN el sistema SHALL mostrar el número de pedidos con status=4 y monto $0
7. WHEN el filtro de sucursal es "Todas las sucursales" THEN el sistema SHALL agregar una columna "Sucursal" y agrupar los datos por sucursal
8. WHEN se aplica un filtro de sucursal específica THEN el sistema SHALL mostrar únicamente los datos de esa sucursal sin la columna de sucursal

### Requirement 5: Top 10 Productos Vendidos

**User Story:** Como gerente de producto, quiero ver un ranking de los 10 productos más vendidos del mes, para identificar los productos estrella y optimizar el inventario.

#### Acceptance Criteria

1. WHEN el dashboard se carga THEN el sistema SHALL mostrar una tabla con las columnas: #, Producto, Cantidad
2. WHEN se genera el ranking THEN el sistema SHALL ordenar los productos por cantidad vendida en orden descendente
3. WHEN se muestra el ranking THEN el sistema SHALL limitar la visualización a los 10 productos con mayor cantidad vendida
4. WHEN se calcula la cantidad THEN el sistema SHALL sumar todas las unidades vendidas del producto en pedidos con status diferente a cancelado (status != 4)
5. WHEN se aplica un filtro de sucursal THEN el sistema SHALL recalcular el ranking considerando únicamente las ventas de esa sucursal
6. WHEN se muestra cada fila THEN el sistema SHALL incluir el número de ranking (#), nombre del producto y cantidad total vendida
7. WHEN el ranking se actualiza THEN el sistema SHALL aplicar colores distintivos a las primeras 3 posiciones (oro, plata, bronce)

### Requirement 6: Top 10 Clientes con Más Compras

**User Story:** Como gerente de relaciones con clientes, quiero ver un ranking de los 10 clientes con más compras del mes, para identificar clientes VIP y diseñar estrategias de fidelización.

#### Acceptance Criteria

1. WHEN el dashboard se carga THEN el sistema SHALL mostrar una tabla con las columnas: #, Cliente, Compras, Total
2. WHEN se genera el ranking THEN el sistema SHALL ordenar los clientes por número de compras en orden descendente
3. WHEN se muestra el ranking THEN el sistema SHALL limitar la visualización a los 10 clientes con mayor número de compras
4. WHEN se calcula el número de compras THEN el sistema SHALL contar todos los pedidos del cliente con status diferente a cancelado (status != 4)
5. WHEN se calcula el total THEN el sistema SHALL sumar el monto total de todos los pedidos del cliente (incluyendo pagados y abonados)
6. WHEN se aplica un filtro de sucursal THEN el sistema SHALL recalcular el ranking considerando únicamente las compras realizadas en esa sucursal
7. WHEN se muestra cada fila THEN el sistema SHALL incluir el número de ranking (#), nombre del cliente, número de compras y monto total gastado
8. WHEN el ranking se actualiza THEN el sistema SHALL aplicar colores distintivos a las primeras 3 posiciones

### Requirement 7: Métricas Adicionales - Cheque Promedio

**User Story:** Como analista financiero, quiero visualizar el cheque promedio del mes, para evaluar el ticket promedio de venta y compararlo con períodos anteriores.

#### Acceptance Criteria

1. WHEN el dashboard se carga THEN el sistema SHALL calcular el cheque promedio dividiendo el total de ventas entre el número de pedidos (excluyendo cotizaciones y cancelados)
2. WHEN se muestra el cheque promedio THEN el sistema SHALL incluir el porcentaje de variación respecto al período de comparación seleccionado
3. WHEN se calcula el cheque promedio THEN el sistema SHALL considerar únicamente pedidos con status=2 (Abonados) o status=3 (Pagados)
4. WHEN se aplica un filtro de sucursal THEN el sistema SHALL recalcular el cheque promedio considerando únicamente los pedidos de esa sucursal
5. IF no hay pedidos válidos para el cálculo THEN el sistema SHALL mostrar "N/A" en lugar de $0.00

### Requirement 8: Integración con Sistema Existente

**User Story:** Como desarrollador del sistema, quiero que el dashboard se integre correctamente con la arquitectura existente de CoffeeSoft, para mantener la consistencia del código y facilitar el mantenimiento.

#### Acceptance Criteria

1. WHEN se desarrolla el dashboard THEN el sistema SHALL seguir la estructura MVC definida en los archivos MDL.md, CTRL.md y FRONT JS.md
2. WHEN se crean consultas a la base de datos THEN el sistema SHALL utilizar los métodos heredados de la clase CRUD (_Select, _Read)
3. WHEN se desarrolla el frontend THEN el sistema SHALL utilizar componentes de CoffeeSoft (createTable, createfilterBar, infoCard, barChart, linearChart)
4. WHEN se crean métodos en el controlador THEN el sistema SHALL seguir la convención de nombres: apiDashboard, getDashboardMetrics, getTopProducts, getTopClients
5. WHEN se crean métodos en el modelo THEN el sistema SHALL seguir la convención de nombres: listOrdersByMonth, getProductSales, getClientPurchases
6. WHEN se implementan gráficos THEN el sistema SHALL utilizar Chart.js con la configuración estándar de CoffeeSoft
7. WHEN se aplican estilos THEN el sistema SHALL utilizar exclusivamente clases de Tailwind CSS con la paleta de colores corporativa (#103B60, #8CC63F, #EAEAEA)

### Requirement 9: Rendimiento y Optimización

**User Story:** Como usuario del sistema, quiero que el dashboard cargue rápidamente y responda de forma fluida a los cambios de filtros, para tener una experiencia de usuario óptima.

#### Acceptance Criteria

1. WHEN el dashboard se carga por primera vez THEN el sistema SHALL completar la carga inicial en menos de 3 segundos
2. WHEN el usuario cambia un filtro THEN el sistema SHALL actualizar los datos en menos de 1 segundo
3. WHEN se realizan consultas a la base de datos THEN el sistema SHALL utilizar índices apropiados en las columnas de fecha, sucursal y estado
4. WHEN se calculan métricas THEN el sistema SHALL realizar las operaciones de agregación en el servidor (no en el cliente)
5. WHEN se renderizan gráficos THEN el sistema SHALL utilizar lazy loading para componentes no visibles en el viewport inicial
6. WHEN hay múltiples sucursales THEN el sistema SHALL implementar paginación o scroll infinito en las tablas de rankings si superan los 10 elementos

### Requirement 10: Responsividad y Accesibilidad

**User Story:** Como usuario móvil, quiero poder acceder al dashboard desde cualquier dispositivo, para consultar métricas en cualquier momento y lugar.

#### Acceptance Criteria

1. WHEN el dashboard se visualiza en dispositivos móviles THEN el sistema SHALL adaptar el layout a una columna única
2. WHEN se visualiza en tablets THEN el sistema SHALL mostrar las tarjetas en una grilla de 2 columnas
3. WHEN se visualiza en desktop THEN el sistema SHALL mostrar las tarjetas en una grilla de 4 columnas
4. WHEN se renderizan gráficos en móvil THEN el sistema SHALL ajustar el tamaño y orientación para mantener la legibilidad
5. WHEN se muestran tablas en móvil THEN el sistema SHALL implementar scroll horizontal o diseño de tarjetas apiladas
6. WHEN el usuario interactúa con elementos THEN el sistema SHALL proporcionar feedback visual (hover, active states)
7. WHEN se muestran números y montos THEN el sistema SHALL formatear correctamente con separadores de miles y símbolo de moneda
