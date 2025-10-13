# Requirements Document

## Introduction

Se requiere desarrollar un dashboard interactivo de pedidos que proporcione métricas clave del negocio en tiempo real. El dashboard debe mostrar información sobre pedidos realizados, ventas completadas, pedidos pendientes y cancelaciones del mes actual, con capacidad de filtrado por períodos específicos y visualización de datos mediante gráficos interactivos.

## Requirements

### Requirement 1

**User Story:** Como administrador del sistema, quiero ver el total de pedidos realizados en el mes actual, para poder monitorear el volumen de operaciones del negocio.

#### Acceptance Criteria

1. WHEN el usuario accede al dashboard THEN el sistema SHALL mostrar una tarjeta con el total de pedidos del mes actual
2. WHEN se consulta la métrica THEN el sistema SHALL usar el método `getOrderByMonth()` del controlador
3. WHEN se filtra por mes específico THEN el sistema SHALL actualizar el contador de pedidos para ese período
4. WHEN no hay pedidos en el período THEN el sistema SHALL mostrar "0" como valor
5. WHEN los datos se actualizan THEN el sistema SHALL reflejar el conteo actualizado inmediatamente

### Requirement 2

**User Story:** Como gerente financiero, quiero ver el total de ventas completadas del mes, para poder evaluar el desempeño financiero del negocio.

#### Acceptance Criteria

1. WHEN el usuario accede al dashboard THEN el sistema SHALL mostrar una tarjeta con las ventas del mes
2. WHEN se calcula las ventas THEN el sistema SHALL usar el método `getOrderSales()` para obtener pedidos pagados
3. WHEN se consulta ventas THEN el sistema SHALL sumar únicamente pedidos con estado "pagado" (status = 3)
4. WHEN se muestra el monto THEN el sistema SHALL formatear la cantidad con símbolo de moneda
5. WHEN se compara con el mes anterior THEN el sistema SHALL mostrar porcentaje de crecimiento

### Requirement 3

**User Story:** Como gerente de operaciones, quiero ver el total de dinero pendiente por cobrar, para poder gestionar el flujo de efectivo del negocio.

#### Acceptance Criteria

1. WHEN el usuario accede al dashboard THEN el sistema SHALL mostrar una tarjeta con ventas pendientes
2. WHEN se calcula ventas pendientes THEN el sistema SHALL usar el método `getOrderProcess()` 
3. WHEN se consulta pendientes THEN el sistema SHALL incluir solo pedidos con saldo pendiente por pagar
4. WHEN se muestra el saldo THEN el sistema SHALL calcular la diferencia entre total y pagado
5. WHEN se actualiza la información THEN el sistema SHALL reflejar cambios en tiempo real

### Requirement 4

**User Story:** Como analista de ventas, quiero visualizar gráficos interactivos de las métricas de pedidos, para poder identificar tendencias y patrones del negocio.

#### Acceptance Criteria

1. WHEN el usuario accede al dashboard THEN el sistema SHALL mostrar un gráfico de líneas con pedidos por día
2. WHEN se renderiza el gráfico THEN el sistema SHALL usar Chart.js para la visualización
3. WHEN el usuario interactúa con el gráfico THEN el sistema SHALL mostrar tooltips con información detallada
4. WHEN se cambia el período THEN el sistema SHALL actualizar automáticamente los datos del gráfico
5. WHEN se carga el gráfico THEN el sistema SHALL usar colores corporativos consistentes

### Requirement 5

**User Story:** Como usuario del dashboard, quiero poder filtrar las métricas por mes y año específicos, para poder analizar el desempeño histórico del negocio.

#### Acceptance Criteria

1. WHEN el usuario selecciona un mes en el filtro THEN el sistema SHALL actualizar todas las métricas para ese mes
2. WHEN el usuario selecciona un año THEN el sistema SHALL combinar mes y año en las consultas
3. WHEN se cambia el filtro THEN el sistema SHALL recargar todas las tarjetas del dashboard
4. WHEN no se especifica filtro THEN el sistema SHALL usar el mes y año actual por defecto
5. WHEN se aplica el filtro THEN el sistema SHALL mostrar un indicador de carga durante la actualización

### Requirement 6

**User Story:** Como administrador, quiero que el dashboard sea responsivo y funcional en dispositivos móviles, para poder acceder a la información desde cualquier lugar.

#### Acceptance Criteria

1. WHEN el usuario accede desde un dispositivo móvil THEN el sistema SHALL adaptar el layout automáticamente
2. WHEN se visualiza en pantallas pequeñas THEN el sistema SHALL reorganizar las tarjetas en una columna
3. WHEN se usan gráficos en móvil THEN el sistema SHALL mantener la interactividad con gestos táctiles
4. WHEN se navega en móvil THEN el sistema SHALL proporcionar navegación optimizada
5. WHEN se cargan datos en móvil THEN el sistema SHALL optimizar la velocidad de carga

### Requirement 7

**User Story:** Como usuario del sistema, quiero que el dashboard se integre correctamente con el controlador de pedidos existente, para aprovechar la lógica de negocio ya implementada.

#### Acceptance Criteria

1. WHEN el dashboard consulta datos THEN el sistema SHALL usar el API endpoint `../pedidos/ctrl/ctrl-pedidos.php`
2. WHEN se realizan consultas THEN el sistema SHALL usar los métodos existentes del controlador de pedidos
3. WHEN se procesa la respuesta THEN el sistema SHALL manejar el formato JSON estándar del sistema
4. WHEN ocurre un error THEN el sistema SHALL mostrar mensajes de error apropiados
5. WHEN se autentica THEN el sistema SHALL respetar las sesiones y permisos existentes