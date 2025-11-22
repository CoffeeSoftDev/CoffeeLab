# Design Document

## Overview

Esta funcionalidad mejora el ticket de cierre del día agregando información clara sobre la sucursal. El sistema modificará tanto el backend (PHP) como el frontend (JavaScript) para incluir y mostrar el nombre de la sucursal en el ticket impreso.

## Architecture

La solución involucra dos componentes principales:

1. **Backend (PHP)**: Modificar el método `getDailyClose()` en `ctrl-pedidos.php` para incluir información de la sucursal en la respuesta
2. **Frontend (JavaScript)**: Actualizar el método `ticketDailyClose()` en `app.js` para renderizar la información de la sucursal en el ticket

El flujo de datos es:
```
Usuario selecciona fecha/sucursal → viewDailyClose() → getDailyClose() (backend) 
→ Retorna datos + info sucursal → ticketDailyClose() → Renderiza ticket con sucursal
```

## Components and Interfaces

### Backend Component

**File**: `pedidos/ctrl/ctrl-pedidos.php`

**Method**: `getDailyClose()`

**Current behavior**: 
- Obtiene el `subsidiaries_id` del POST o de la sesión
- Consulta las métricas de ventas del día
- Retorna datos de ventas sin información de la sucursal

**New behavior**:
- Mantiene la lógica actual de obtención del `subsidiaries_id`
- Agrega consulta para obtener el nombre de la sucursal
- Incluye información de la sucursal en la respuesta

### Frontend Component

**File**: `pedidos/src/js/app.js`

**Method**: `viewDailyClose()`

**Current behavior**:
- Obtiene la fecha seleccionada
- Llama al endpoint `getDailyClose`
- Pasa los datos al método `ticketDailyClose()`

**New behavior**:
- Mantiene la lógica actual
- Pasa la información de sucursal adicional al método `ticketDailyClose()`

**Method**: `ticketDailyClose()`

**Current behavior**:
- Recibe datos de ventas
- Renderiza el ticket con header, resumen de ventas y footer

**New behavior**:
- Recibe datos de ventas + información de sucursal
- Renderiza el ticket incluyendo el nombre de la sucursal en el header

## Data Models

### Response Payload (getDailyClose)

```javascript
{
  status: 200,
  message: "Resumen obtenido correctamente",
  data: {
    total_sales: float,
    card_sales: float,
    cash_sales: float,
    transfer_sales: float,
    total_orders: int,
    subsidiary_name: string,  // NUEVO
    is_all_subsidiaries: boolean  // NUEVO
  }
}
```

### Subsidiary Information

```javascript
{
  subsidiary_name: "Nombre de la Sucursal" | "TODAS LAS SUCURSALES",
  is_all_subsidiaries: true | false
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Acceptance Criteria Testing Prework:

1.1 WHEN the system generates a daily close ticket THEN the system SHALL display the subsidiary name in the ticket header
Thoughts: This is a rule that should apply to all tickets generated. We can test this by generating random subsidiary data and verifying that the rendered ticket HTML contains the subsidiary name.
Testable: yes - property

1.2 WHEN a specific subsidiary is selected THEN the system SHALL display that subsidiary's name in the ticket
Thoughts: This is about verifying that when a specific subsidiary ID is provided, the correct name appears. We can test with various subsidiary IDs and verify the output.
Testable: yes - property

1.3 WHEN "all subsidiaries" option is selected THEN the system SHALL display "TODAS LAS SUCURSALES" in the ticket
Thoughts: This is a specific case when subsidiaries_id = 0. This is an edge case that we should explicitly test.
Testable: yes - example

1.4 WHEN the ticket is rendered THEN the system SHALL position the subsidiary information below the date and above the sales summary
Thoughts: This is about the structure of the rendered HTML. We can verify that the subsidiary element appears in the correct position in the DOM.
Testable: yes - property

1.5 WHEN the subsidiary information is displayed THEN the system SHALL format it consistently with the existing ticket design
Thoughts: This is about visual consistency, which is subjective and not easily testable programmatically.
Testable: no

2.1 WHEN the getDailyClose endpoint is called THEN the system SHALL return the subsidiary information along with sales data
Thoughts: This is a rule about the API response structure. We can test that the response always includes subsidiary fields.
Testable: yes - property

2.2 WHEN subsidiaries_id is 0 THEN the system SHALL identify this as "all subsidiaries" mode
Thoughts: This is a specific edge case for the value 0.
Testable: yes - example

2.3 WHEN subsidiaries_id is a specific value THEN the system SHALL retrieve the subsidiary name from the database
Thoughts: This is about database retrieval logic. We can test with various valid subsidiary IDs.
Testable: yes - property

2.4 WHEN the subsidiary data is retrieved THEN the system SHALL include it in the response payload
Thoughts: This is about ensuring the data structure is correct. This is covered by property 2.1.
Testable: redundant with 2.1

2.5 WHEN the subsidiary does not exist THEN the system SHALL handle the error gracefully
Thoughts: This is about error handling for invalid subsidiary IDs.
Testable: yes - example

### Property Reflection:

After reviewing the prework, I've identified the following redundancies:
- Property 2.4 is redundant with 2.1 (both test that subsidiary info is in the response)
- Property 1.2 can be combined with 1.1 into a more comprehensive property

The remaining properties provide unique validation value.

### Correctness Properties:

**Property 1: Subsidiary name appears in ticket**
*For any* daily close ticket generated with valid subsidiary data, the rendered HTML should contain the subsidiary name
**Validates: Requirements 1.1, 1.2**

**Property 2: Ticket structure includes subsidiary section**
*For any* daily close ticket, the subsidiary information element should appear after the date element and before the sales summary section in the DOM structure
**Validates: Requirements 1.4**

**Property 3: API response includes subsidiary data**
*For any* successful getDailyClose API call, the response data should include both subsidiary_name and is_all_subsidiaries fields
**Validates: Requirements 2.1**

**Property 4: Database retrieval for valid subsidiaries**
*For any* valid subsidiary ID (> 0), calling getDailyClose should retrieve and return the correct subsidiary name from the database
**Validates: Requirements 2.3**

## Error Handling

### Invalid Subsidiary ID
- **Scenario**: Subsidiary ID does not exist in database
- **Handling**: Return a default value like "Sucursal Desconocida" and log the error
- **User Impact**: Ticket still generates but shows unknown subsidiary

### Missing Subsidiary Data
- **Scenario**: Database query fails or returns null
- **Handling**: Use fallback text "Sucursal No Disponible"
- **User Impact**: Ticket generates with fallback text

### All Subsidiaries Mode
- **Scenario**: subsidiaries_id = 0
- **Handling**: Set subsidiary_name to "TODAS LAS SUCURSALES" and is_all_subsidiaries to true
- **User Impact**: Clear indication that report covers all locations

## Testing Strategy

### Unit Testing

Unit tests will cover:
- Backend: getDailyClose() returns correct subsidiary data structure
- Frontend: ticketDailyClose() renders subsidiary information correctly
- Edge case: subsidiaries_id = 0 shows "TODAS LAS SUCURSALES"
- Error case: Invalid subsidiary ID shows fallback text

### Property-Based Testing

Property-based tests will use **fast-check** (JavaScript) for frontend testing. Each test will run a minimum of 100 iterations.

Property tests will verify:
- **Property 1**: Subsidiary name always appears in rendered ticket HTML
- **Property 2**: Subsidiary section always positioned correctly in DOM
- **Property 3**: API response always includes required subsidiary fields
- **Property 4**: Valid subsidiary IDs always return correct names

Each property-based test will be tagged with: **Feature: daily-close-subsidiary-display, Property {number}: {property_text}**

### Integration Testing

Integration tests will verify:
- End-to-end flow from user selection to ticket rendering
- Correct data flow between backend and frontend
- Proper handling of both specific subsidiary and "all subsidiaries" modes
