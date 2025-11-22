# Requirements Document

## Introduction

Este documento especifica los requisitos para agregar contadores de órdenes por estado al ticket de cierre diario. El sistema actualmente muestra información de ventas totales y métodos de pago, pero no incluye información sobre la distribución de órdenes por estado (cotización, pendiente, cancelado). Esta mejora permitirá a los usuarios tener una visión más completa del estado de las órdenes en el cierre del día.

## Glossary

- **DailyClose**: Reporte de cierre del día que muestra resumen de ventas y órdenes
- **Order Status**: Estado de una orden en el sistema (1=Cotización, 2=Pendiente, 3=Pagado, 4=Cancelado)
- **Ticket**: Documento imprimible que muestra el resumen del cierre diario
- **Backend**: Capa de servidor PHP que procesa datos y consultas a base de datos
- **Frontend**: Capa de cliente JavaScript que renderiza la interfaz de usuario

## Requirements

### Requirement 1

**User Story:** Como usuario del sistema, quiero ver el número de órdenes en estado cotización en el ticket de cierre diario, para tener visibilidad de cuántas cotizaciones se generaron en el día.

#### Acceptance Criteria

1. WHEN the system queries daily close data THEN the system SHALL count orders with status equal to 1 (cotización)
2. WHEN the ticket is rendered THEN the system SHALL display the count of quotation orders with the label "COTIZACIONES"
3. WHEN there are no quotation orders THEN the system SHALL display zero as the count

### Requirement 2

**User Story:** Como usuario del sistema, quiero ver el número de órdenes canceladas en el ticket de cierre diario, para tener visibilidad de cuántas órdenes fueron canceladas en el día.

#### Acceptance Criteria

1. WHEN the system queries daily close data THEN the system SHALL count orders with status equal to 4 (cancelado)
2. WHEN the ticket is rendered THEN the system SHALL display the count of cancelled orders with the label "CANCELADOS"
3. WHEN there are no cancelled orders THEN the system SHALL display zero as the count

### Requirement 3

**User Story:** Como usuario del sistema, quiero ver el número de órdenes pendientes en el ticket de cierre diario, para tener visibilidad de cuántas órdenes están pendientes de pago en el día.

#### Acceptance Criteria

1. WHEN the system queries daily close data THEN the system SHALL count orders with status equal to 2 (pendiente)
2. WHEN the ticket is rendered THEN the system SHALL display the count of pending orders with the label "PENDIENTES"
3. WHEN there are no pending orders THEN the system SHALL display zero as the count

### Requirement 4

**User Story:** Como usuario del sistema, quiero que los contadores de estado respeten el filtro de sucursal seleccionado, para ver estadísticas específicas de cada sucursal o de todas.

#### Acceptance Criteria

1. WHEN a specific subsidiary is selected THEN the system SHALL count only orders belonging to that subsidiary
2. WHEN "all subsidiaries" mode is active THEN the system SHALL count orders from all subsidiaries
3. WHEN the date filter changes THEN the system SHALL recalculate counts for the new date range
