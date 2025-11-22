# Requirements Document

## Introduction

Este documento especifica los requisitos para mejorar el ticket de cierre del día en el sistema de pedidos de pastelería. Actualmente, el sistema genera un ticket de cierre diario que muestra las ventas totales, métodos de pago y número de pedidos, pero no indica de qué sucursal corresponde el cierre. Esta mejora agregará información clara sobre la sucursal en el ticket impreso.

## Glossary

- **Sistema**: El sistema de gestión de pedidos de pastelería
- **Ticket de Cierre**: Documento impreso que resume las ventas del día
- **Sucursal**: Ubicación física de la empresa donde se realizan las ventas
- **Usuario Administrador**: Usuario con rol ID 1 que puede ver todas las sucursales
- **Usuario Regular**: Usuario con acceso limitado a su sucursal asignada

## Requirements

### Requirement 1

**User Story:** Como usuario del sistema, quiero ver claramente de qué sucursal es el cierre del día en el ticket impreso, para poder identificar rápidamente la procedencia de los datos.

#### Acceptance Criteria

1. WHEN the system generates a daily close ticket THEN the system SHALL display the subsidiary name in the ticket header
2. WHEN a specific subsidiary is selected THEN the system SHALL display that subsidiary's name in the ticket
3. WHEN "all subsidiaries" option is selected THEN the system SHALL display "TODAS LAS SUCURSALES" in the ticket
4. WHEN the ticket is rendered THEN the system SHALL position the subsidiary information below the date and above the sales summary
5. WHEN the subsidiary information is displayed THEN the system SHALL format it consistently with the existing ticket design

### Requirement 2

**User Story:** Como administrador, quiero que el sistema obtenga correctamente la información de la sucursal desde el backend, para asegurar que los datos mostrados sean precisos.

#### Acceptance Criteria

1. WHEN the getDailyClose endpoint is called THEN the system SHALL return the subsidiary information along with sales data
2. WHEN subsidiaries_id is 0 THEN the system SHALL identify this as "all subsidiaries" mode
3. WHEN subsidiaries_id is a specific value THEN the system SHALL retrieve the subsidiary name from the database
4. WHEN the subsidiary data is retrieved THEN the system SHALL include it in the response payload
5. WHEN the subsidiary does not exist THEN the system SHALL handle the error gracefully
