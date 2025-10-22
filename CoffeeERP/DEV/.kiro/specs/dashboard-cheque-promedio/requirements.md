# Requirements Document

## Introduction

El Dashboard Analítico de Cheque Promedio es un módulo especializado dentro del sistema CoffeeSoft ERP que permite visualizar y analizar métricas clave de ventas, enfocándose en el cheque promedio por cliente. Este dashboard proporcionará insights comparativos entre períodos, análisis por días de la semana y categorías de productos, facilitando la toma de decisiones estratégicas para optimizar los ingresos por cliente.

## Glossary

- **Dashboard_System**: Sistema de visualización analítica de métricas de ventas integrado en CoffeeSoft ERP
- **Cheque_Promedio**: Valor promedio de consumo calculado como total_venta dividido entre total_clientes
- **UDN**: Unidad de Negocio, identificador para filtrar datos por sucursal o punto de venta
- **KPI_Card**: Componente visual que muestra un indicador clave de rendimiento con valor, tendencia y comparativa
- **FilterBar_Component**: Barra de filtros que permite seleccionar mes, año y UDN para consultas dinámicas
- **Comparative_Analysis**: Análisis que compara métricas del período actual contra el mismo período del año anterior

## Requirements

### Requirement 1

**User Story:** Como gerente de ventas, quiero visualizar las métricas principales de ventas en un dashboard centralizado, para poder evaluar el rendimiento actual de mi negocio.

#### Acceptance Criteria

1. WHEN el usuario accede al dashboard, THE Dashboard_System SHALL mostrar cuatro KPI_Card principales con datos del período seleccionado
2. THE Dashboard_System SHALL calcular y mostrar las ventas del día anterior con fecha exacta en formato DD/MM/YYYY
3. THE Dashboard_System SHALL mostrar el total de ventas del mes actual comparado con el mismo mes del año anterior
4. THE Dashboard_System SHALL calcular el Cheque_Promedio como total_venta dividido entre total_clientes
5. THE Dashboard_System SHALL mostrar el total de clientes activos del mes con comparativa anual

### Requirement 2

**User Story:** Como analista de ventas, quiero filtrar los datos por mes, año y unidad de negocio, para poder analizar el rendimiento específico de cada período y ubicación.

#### Acceptance Criteria

1. THE Dashboard_System SHALL implementar un FilterBar_Component con selectores de mes, año y UDN
2. WHEN el usuario modifica cualquier filtro, THE Dashboard_System SHALL actualizar automáticamente todos los KPI_Card
3. THE Dashboard_System SHALL mantener la selección de filtros durante la sesión del usuario
4. THE Dashboard_System SHALL validar que los filtros seleccionados contengan datos válidos antes de ejecutar consultas

### Requirement 3

**User Story:** Como gerente comercial, quiero ver comparativas visuales del cheque promedio por día de la semana, para identificar patrones de consumo y optimizar estrategias de ventas.

#### Acceptance Criteria

1. THE Dashboard_System SHALL generar un gráfico de barras mostrando el Cheque_Promedio agrupado por día de la semana
2. THE Dashboard_System SHALL permitir comparar visualmente días de alto rendimiento versus días de bajo rendimiento
3. WHEN se selecciona un día específico en el gráfico, THE Dashboard_System SHALL mostrar detalles adicionales del período
4. THE Dashboard_System SHALL usar la paleta corporativa CoffeeSoft (azul #103B60, verde #8CC63F) en las visualizaciones

### Requirement 4

**User Story:** Como director de operaciones, quiero analizar el cheque promedio por categoría de productos, para entender qué líneas de productos generan mayor valor por cliente.

#### Acceptance Criteria

1. THE Dashboard_System SHALL mostrar un Comparative_Analysis del Cheque_Promedio por categoría de productos
2. THE Dashboard_System SHALL comparar las categorías del año actual contra el año anterior
3. THE Dashboard_System SHALL ordenar las categorías por mayor impacto en el Cheque_Promedio
4. THE Dashboard_System SHALL permitir drill-down en cada categoría para ver productos específicos

### Requirement 5

**User Story:** Como usuario del sistema, quiero que el dashboard se integre perfectamente con el ecosistema CoffeeSoft, para mantener consistencia visual y funcional.

#### Acceptance Criteria

1. THE Dashboard_System SHALL heredar de la clase Templates de CoffeeSoft
2. THE Dashboard_System SHALL usar componentes nativos como createCard, createChart y createTable
3. THE Dashboard_System SHALL implementar la estructura MVC con controladores ctrl/ventas.php y modelos mdl/ventas.php
4. THE Dashboard_System SHALL seguir las convenciones de nomenclatura y arquitectura de CoffeeSoft
5. THE Dashboard_System SHALL ser responsive y compatible con dispositivos móviles y desktop