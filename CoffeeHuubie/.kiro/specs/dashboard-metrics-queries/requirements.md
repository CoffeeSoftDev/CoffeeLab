# Requirements Document

## Introduction

El dashboard de pedidos necesita mostrar métricas clave del negocio de manera clara y precisa. Este spec define los requerimientos para implementar las consultas SQL y la lógica backend necesaria para alimentar las tarjetas (cards) del dashboard con información en tiempo real sobre pedidos, ventas y cancelaciones del mes actual.

## Requirements

### Requirement 1

**User Story:** Como administrador del sistema, quiero ver el número total de pedidos realizados en el mes actual, para poder monitorear el volumen de operaciones del negocio.

#### Acceptance Criteria

1. WHEN el usuario accede al dashboard THEN el sistema SHALL mostrar el total de pedidos del mes actual
2. WHEN se selecciona un mes específico THEN el sistema SHALL calcular el total de pedidos para ese mes
3. WHEN se selecciona un año específico THEN el sistema SHALL considerar el mes y año seleccionados
4. WHEN no hay pedidos en el período THEN el sistema SHALL mostrar "0" como valor
5. WHEN los datos se actualizan THEN el sistema SHALL reflejar el conteo actualizado inmediatamente

### Requirement 2

**User Story:** Como gerente financiero, quiero ver el dinero total que ha entrado por pedidos en el mes, para poder evaluar el flujo de efectivo del negocio.

#### Acceptance Criteria

1. WHEN el usuario accede al dashboard THEN el sistema SHALL mostrar el total de dinero entrante del mes
2. WHEN se calcula el dinero entrante THEN el sistema SHALL sumar todos los anticipos y pagos recibidos
3. WHEN un pedido tiene múltiples pagos THEN el sistema SHALL incluir todos los pagos del período
4. WHEN se filtra por mes/año THEN el sistema SHALL calcular solo los pagos de ese período
5. WHEN el monto es cero THEN el sistema SHALL mostrar "$0.00" formateado

### Requirement 3

**User Story:** Como analista de ventas, quiero ver cuántos pedidos se pagaron completamente en el mes, para poder medir la efectividad de cierre de ventas.

#### Acceptance Criteria

1. WHEN el usuario accede al dashboard THEN el sistema SHALL mostrar el total de pedidos pagados completamente
2. WHEN un pedido está marcado como "pagado" o "cerrado" THEN el sistema SHALL contarlo en esta métrica
3. WHEN se filtra por mes/año THEN el sistema SHALL contar solo los pedidos cerrados en ese período
4. WHEN se calcula el total de ventas THEN el sistema SHALL sumar el monto total de pedidos pagados
5. WHEN no hay ventas cerradas THEN el sistema SHALL mostrar "0 pedidos" y "$0.00"

### Requirement 4

**User Story:** Como gerente de operaciones, quiero ver el número y monto de pedidos cancelados en el mes, para poder identificar pérdidas potenciales y áreas de mejora.

#### Acceptance Criteria

1. WHEN el usuario accede al dashboard THEN el sistema SHALL mostrar el total de pedidos cancelados del mes
2. WHEN un pedido tiene estado "cancelado" THEN el sistema SHALL incluirlo en esta métrica
3. WHEN se calcula el monto perdido THEN el sistema SHALL sumar el valor total de pedidos cancelados
4. WHEN se filtra por período THEN el sistema SHALL considerar la fecha de cancelación
5. WHEN no hay cancelaciones THEN el sistema SHALL mostrar "0 cancelaciones" y "$0.00"

### Requirement 5

**User Story:** Como administrador, quiero ver el desglose de pedidos por estado (cotizaciones, pagados, cancelados), para poder entender la distribución del pipeline de ventas.

#### Acceptance Criteria

1. WHEN el usuario accede al dashboard THEN el sistema SHALL mostrar el total de cotizaciones activas
2. WHEN se cuenta cotizaciones THEN el sistema SHALL incluir pedidos con estado "cotización" o "pendiente"
3. WHEN se cuenta pagados THEN el sistema SHALL incluir pedidos con estado "pagado" o "completado"
4. WHEN se cuenta cancelados THEN el sistema SHALL incluir pedidos con estado "cancelado"
5. WHEN se suman los totales THEN el sistema SHALL validar que coincidan con el total de pedidos del mes

### Requirement 6

**User Story:** Como usuario del dashboard, quiero poder filtrar las métricas por mes y año específicos, para poder analizar el desempeño histórico del negocio.

#### Acceptance Criteria

1. WHEN el usuario selecciona un mes en el filtro THEN el sistema SHALL actualizar todas las métricas para ese mes
2. WHEN el usuario selecciona un año THEN el sistema SHALL combinar mes y año en las consultas
3. WHEN se cambia el filtro THEN el sistema SHALL recargar todas las cards del dashboard
4. WHEN no se especifica filtro THEN el sistema SHALL usar el mes y año actual por defecto
5. WHEN se aplica el filtro THEN el sistema SHALL mostrar un indicador de carga durante la actualización
