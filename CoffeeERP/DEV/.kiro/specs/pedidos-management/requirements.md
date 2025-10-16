# Requirements Document - Sistema de Administración de Pedidos

## Introduction

El Sistema de Administración de Pedidos es una aplicación web diseñada para gestionar el ciclo completo de pedidos recibidos a través de múltiples canales de comunicación (WhatsApp, Facebook, Instagram, llamadas, e-commerce, etc.). El sistema permite capturar, rastrear y analizar pedidos diarios, productos/servicios, y generar reportes analíticos para la toma de decisiones estratégicas.

## Glossary

- **System**: Sistema de Administración de Pedidos
- **Order**: Pedido realizado por un cliente a través de cualquier canal de comunicación
- **Channel**: Canal o medio de comunicación por el cual se recibe un pedido (WhatsApp, Facebook, Instagram, llamadas, e-commerce, etc.)
- **Product**: Producto o servicio ofrecido por la unidad de negocio
- **UDN**: Unidad de Negocio (sucursal o establecimiento)
- **Client**: Cliente que realiza un pedido
- **Campaign**: Campaña publicitaria o anuncio que genera pedidos
- **Transfer**: Transferencia bancaria como método de pago
- **Daily Capture**: Captura de pedidos del día actual
- **Historical Report**: Reporte histórico de pedidos y ventas

## Requirements

### Requirement 1: Gestión de Captura de Pedidos Diarios

**User Story:** Como auxiliar de atención a clientes, quiero capturar los pedidos diarios recibidos por diferentes canales, para llevar un registro completo de las ventas.

#### Acceptance Criteria

1. THE System SHALL display a daily order capture form with the following sections: "Información del cliente" and "Datos del pedido"
2. THE System SHALL require the following mandatory fields in "Información del cliente": client name, phone, and UDN
3. THE System SHALL provide optional fields: email and birthday date
4. THE System SHALL require the following mandatory fields in "Datos del pedido": order date, delivery time, channel (medio de reservación), and amount
5. THE System SHALL provide a dropdown for channel selection with options: WhatsApp, Facebook, Instagram, llamadas, e-commerce, Uber, etc.
6. THE System SHALL allow selecting if the order is for home delivery or pickup
7. WHERE THE order came from an advertisement, THE System SHALL display a checkbox and dropdown to select the associated campaign
8. THE System SHALL provide a text area for additional notes
9. THE System SHALL validate that phone number has valid format
10. THE System SHALL validate that amount is a positive decimal number
11. THE System SHALL prevent capturing orders with dates older than the current date UNLESS no previous record exists for that date
12. WHEN THE user submits a valid order form, THE System SHALL save the order to the database with status "active"
13. WHEN THE order is saved successfully, THE System SHALL display a success confirmation message and clear the form
14. THE System SHALL allow capturing only one order per day per date selected
15. THE System SHALL lock orders for editing after 7 days from creation date

### Requirement 2: Visualización y Filtrado de Pedidos

**User Story:** Como jefe de atención a clientes, quiero visualizar y filtrar los pedidos registrados, para analizar el desempeño de ventas por diferentes criterios.

#### Acceptance Criteria

1. THE System SHALL display a table with all orders for the selected date and UDN
2. THE System SHALL allow filtering orders by date, UDN, channel, client name, amount, payment modality, and campaign
3. THE System SHALL display the following columns: date, channel, client, phone, amount, payment status, delivery status, campaign, and actions
4. THE System SHALL allow exporting the filtered table to CSV or Excel format
5. WHEN THE user clicks on an order row, THE System SHALL display detailed order information
6. THE System SHALL update the table dynamically when filters are applied without page reload
7. THE System SHALL display business rules indicators (e.g., orders locked after one week)

### Requirement 3: Edición y Eliminación de Pedidos

**User Story:** Como auxiliar de atención a clientes, quiero editar o eliminar pedidos capturados, para corregir errores de captura.

#### Acceptance Criteria

1. WHEN THE order was created within the last 7 days, THE System SHALL enable the edit button
2. WHEN THE order was created more than 7 days ago, THE System SHALL disable the edit button
3. WHEN THE user clicks edit, THE System SHALL display a pre-filled form with current order data
4. THE System SHALL validate all fields before saving changes
5. WHEN THE user clicks delete, THE System SHALL display a confirmation dialog
6. WHEN THE deletion is confirmed, THE System SHALL change the order status to "inactive" instead of physically deleting it
7. THE System SHALL log all edit and delete actions with user and timestamp

### Requirement 4: Verificación de Transferencias

**User Story:** Como personal de tesorería, quiero verificar si las transferencias de los pedidos fueron recibidas, para confirmar el pago.

#### Acceptance Criteria

1. WHERE THE payment modality is "transfer", THE System SHALL display a "verify payment" button
2. WHEN THE user clicks verify payment, THE System SHALL display a confirmation dialog
3. WHEN THE verification is confirmed, THE System SHALL update the payment status to "verified"
4. THE System SHALL record the verification date and user who verified
5. THE System SHALL allow filtering orders by payment status (pending, verified)
6. THE System SHALL display a visual indicator for unverified transfers older than 3 days
7. THE System SHALL prevent editing payment status once verified

### Requirement 5: Registro de Llegada al Establecimiento

**User Story:** Como auxiliar de atención a clientes, quiero registrar si el cliente llegó al establecimiento, para servicios que requieren presencia física.

#### Acceptance Criteria

1. WHERE THE product type is "service", THE System SHALL display an "arrival status" field
2. THE System SHALL provide options: "arrived", "did not arrive", "pending"
3. WHEN THE user updates arrival status, THE System SHALL save the change immediately
4. THE System SHALL record the date and time of status change
5. THE System SHALL allow filtering orders by arrival status
6. THE System SHALL display arrival statistics in the dashboard
7. THE System SHALL send automatic reminders for pending arrival confirmations after 24 hours

### Requirement 6: Dashboard de Métricas y KPIs

**User Story:** Como jefe de atención a clientes, quiero visualizar métricas clave de pedidos, para tomar decisiones estratégicas.

#### Acceptance Criteria

1. THE System SHALL display total orders count for the selected period
2. THE System SHALL display total revenue amount for the selected period
3. THE System SHALL calculate and display average order value (cheque promedio)
4. THE System SHALL display revenue percentage compared to total monthly sales
5. THE System SHALL show orders count by channel in a bar chart
6. THE System SHALL display a line chart with monthly orders trend comparing current year vs previous year
7. THE System SHALL show orders generated by campaigns count and percentage
8. THE System SHALL allow filtering all metrics by date range and UDN
9. THE System SHALL refresh metrics automatically when filters change

### Requirement 7: Reporte Anual de Ventas por Canal

**User Story:** Como jefe de atención a clientes, quiero consultar el historial anual de ventas por canal, para identificar los canales más efectivos.

#### Acceptance Criteria

1. THE System SHALL display a table with monthly columns (January to December) for the selected year
2. THE System SHALL show total sales amount per channel per month
3. THE System SHALL calculate and display total orders count per channel per month
4. THE System SHALL display annual totals per channel
5. THE System SHALL allow filtering by UDN and year
6. THE System SHALL allow exporting the report to Excel
7. THE System SHALL display a comparative chart showing current year vs previous year by channel

### Requirement 8: Gestión de Productos y Servicios

**User Story:** Como jefe de atención a clientes, quiero administrar el catálogo de productos y servicios, para mantener actualizada la oferta disponible.

#### Acceptance Criteria

1. THE System SHALL allow creating new products with fields: name, description, price, type (product/service), UDN, and status
2. THE System SHALL validate that product name is unique per UDN
3. THE System SHALL allow editing product information
4. THE System SHALL allow activating or deactivating products without deleting them
5. THE System SHALL display a table with all products filtered by UDN and status
6. THE System SHALL prevent deleting products that have associated orders
7. THE System SHALL display product usage statistics (total orders, total revenue)

### Requirement 9: Gestión de Canales de Comunicación

**User Story:** Como jefe de atención a clientes, quiero administrar los canales de comunicación disponibles, para mantener actualizada la lista de medios de contacto.

#### Acceptance Criteria

1. THE System SHALL allow creating new channels with fields: name, icon, color, and status
2. THE System SHALL validate that channel name is unique
3. THE System SHALL allow editing channel information
4. THE System SHALL allow activating or deactivating channels
5. THE System SHALL display a table with all channels and their status
6. THE System SHALL prevent deleting channels that have associated orders
7. THE System SHALL display channel usage statistics in the admin panel

### Requirement 10: Gestión de Campañas y Anuncios

**User Story:** Como jefe de atención a clientes, quiero registrar las campañas publicitarias, para medir su efectividad en la generación de pedidos.

#### Acceptance Criteria

1. THE System SHALL allow creating campaigns with fields: name, strategy, start date, end date, budget, total clicks, image, channel, and UDN
2. THE System SHALL validate that campaign dates are logical (end date after start date)
3. THE System SHALL allow editing campaign information
4. THE System SHALL allow activating or deactivating campaigns
5. THE System SHALL display campaign performance metrics (orders generated, revenue, ROI)
6. THE System SHALL allow filtering campaigns by date range, UDN, and channel
7. THE System SHALL display a ranking of most effective campaigns

### Requirement 11: Control de Accesos por Rol

**User Story:** Como administrador del sistema, quiero controlar los permisos de acceso por rol de usuario, para garantizar la seguridad de la información.

#### Acceptance Criteria

1. THE System SHALL authenticate users before granting access
2. WHERE THE user role is "Jefe de atención a clientes", THE System SHALL grant full access to all modules
3. WHERE THE user role is "Auxiliar de atención a clientes", THE System SHALL grant access only to daily order capture and view
4. WHERE THE user role is "Tesorería", THE System SHALL grant access only to payment verification and daily orders table
5. THE System SHALL log all user access attempts
6. THE System SHALL display appropriate error messages for unauthorized access attempts
7. THE System SHALL automatically log out users after 30 minutes of inactivity

### Requirement 12: Exportación de Reportes

**User Story:** Como jefe de atención a clientes, quiero exportar reportes en diferentes formatos, para compartir información con otras áreas.

#### Acceptance Criteria

1. THE System SHALL allow exporting daily orders table to CSV and Excel formats
2. THE System SHALL allow exporting monthly sales summary to Excel
3. THE System SHALL allow exporting annual historical report to Excel
4. THE System SHALL include all visible columns and applied filters in exports
5. THE System SHALL generate export files with proper formatting and headers
6. WHEN THE export is complete, THE System SHALL provide a download link
7. THE System SHALL log all export actions with user and timestamp
