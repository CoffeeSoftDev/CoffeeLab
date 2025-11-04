# Requirements Document

## Introduction

Este documento define los requisitos para el módulo de **Calendario de Pedidos Integrado**, que permitirá a los usuarios del sistema visualizar y gestionar pedidos desde una interfaz de calendario interactivo. El sistema debe mostrar pedidos agrupados por fecha de entrega, con filtros por estado y una clara distinción visual para pedidos con envío a domicilio.

## Glossary

- **Sistema**: El módulo de Calendario de Pedidos Integrado dentro de la aplicación de gestión de pedidos
- **Usuario**: Persona que utiliza el módulo de pedidos para gestionar órdenes
- **Pedido**: Orden de compra registrada en el sistema con información de cliente, productos, fecha de entrega y estado
- **Estado**: Clasificación del pedido (Cotización, Pagado, Pendiente de pago, Cancelado)
- **Envío a domicilio**: Tipo de entrega donde el pedido se transporta a la dirección del cliente
- **Folio**: Identificador único del pedido en formato P-[SUCURSAL]-[NÚMERO]
- **Vista Calendario**: Interfaz que muestra pedidos organizados por fechas en formato de calendario
- **Vista Lista**: Interfaz tabular tradicional que muestra pedidos en filas
- **Evento**: Representación visual de un pedido dentro del calendario
- **Modal de Detalle**: Ventana emergente que muestra información completa de un pedido seleccionado

## Requirements

### Requirement 1: Alternancia entre Vistas

**User Story:** Como usuario del módulo de Pedidos, quiero poder alternar entre la vista de lista (tabla) y la vista calendario, para que pueda elegir la forma más conveniente de visualizar mis pedidos según mi necesidad del momento.

#### Acceptance Criteria

1. WHEN el Usuario accede al módulo de Pedidos, THE Sistema SHALL mostrar la vista de lista por defecto
2. WHEN el Usuario hace clic en el botón "Calendario", THE Sistema SHALL cambiar a la vista calendario manteniendo los filtros aplicados
3. WHEN el Usuario hace clic en el botón "Lista" desde la vista calendario, THE Sistema SHALL regresar a la vista de lista manteniendo los filtros aplicados
4. THE Sistema SHALL preservar los filtros de fecha y estado al cambiar entre vistas
5. THE Sistema SHALL mantener visible la barra de filtros en ambas vistas

### Requirement 2: Visualización de Pedidos en Calendario

**User Story:** Como usuario del módulo de Pedidos, quiero ver los pedidos agrupados por fecha de entrega en un calendario mensual o semanal, para que pueda tener una vista clara y visual de las entregas programadas.

#### Acceptance Criteria

1. WHEN el Usuario selecciona la vista calendario, THE Sistema SHALL mostrar un calendario con vista mensual por defecto
2. THE Sistema SHALL agrupar los pedidos según su fecha de entrega (campo date_order)
3. WHEN existen múltiples pedidos en una misma fecha, THE Sistema SHALL mostrar todos los pedidos en esa celda del calendario
4. THE Sistema SHALL permitir al Usuario cambiar entre vista mensual, semanal y diaria mediante controles de navegación
5. THE Sistema SHALL resaltar visualmente el día actual en el calendario

### Requirement 3: Información del Evento de Pedido

**User Story:** Como usuario del módulo de Pedidos, quiero que cada evento del calendario muestre el folio del pedido, nombre del cliente y estado con color distintivo, para que pueda identificar rápidamente la información clave de cada pedido.

#### Acceptance Criteria

1. WHEN el Sistema muestra un pedido en el calendario, THE Sistema SHALL mostrar el folio del pedido en formato P-[SUCURSAL]-[NÚMERO]
2. WHEN el Sistema muestra un pedido en el calendario, THE Sistema SHALL mostrar el nombre del cliente asociado
3. WHEN el Sistema muestra un pedido en el calendario, THE Sistema SHALL aplicar un color de fondo según el estado del pedido
4. THE Sistema SHALL usar el color azul (#1E90FF) para pedidos con estado Cotización
5. THE Sistema SHALL usar el color verde (#8CC63F) para pedidos con estado Pagado
6. THE Sistema SHALL usar el color amarillo (#FFCC00) para pedidos con estado Pendiente de pago
7. THE Sistema SHALL usar el color rojo (#FF3B30) para pedidos con estado Cancelado

### Requirement 4: Indicador de Envío a Domicilio

**User Story:** Como usuario del módulo de Pedidos, quiero que los pedidos con envío a domicilio muestren un ícono de motocicleta, para que pueda identificar fácilmente qué pedidos requieren entrega sin necesidad de abrir el detalle.

#### Acceptance Criteria

1. WHEN un pedido tiene el campo delivery_type con valor indicando envío a domicilio, THE Sistema SHALL mostrar un ícono de motocicleta junto al título del evento
2. WHEN un pedido no tiene envío a domicilio, THE Sistema SHALL omitir el ícono de motocicleta
3. THE Sistema SHALL posicionar el ícono de motocicleta de manera visible y consistente en todos los eventos

### Requirement 5: Detalle del Pedido desde Calendario

**User Story:** Como usuario del módulo de Pedidos, quiero que al hacer clic sobre un evento del calendario se abra un panel o modal con el detalle completo del pedido, para que pueda consultar toda la información sin salir de la vista calendario.

#### Acceptance Criteria

1. WHEN el Usuario hace clic en un evento del calendario, THE Sistema SHALL abrir un modal con los detalles del pedido
2. THE Sistema SHALL mostrar en el modal el folio, productos, total, cliente, tipo de entrega y notas del pedido
3. THE Sistema SHALL mostrar en el modal el estado actual del pedido con su color correspondiente
4. WHEN el Usuario cierra el modal, THE Sistema SHALL mantener la vista calendario sin cambios
5. THE Sistema SHALL permitir al Usuario cerrar el modal mediante un botón de cierre o haciendo clic fuera del modal

### Requirement 6: Filtrado de Pedidos en Calendario

**User Story:** Como usuario del módulo de Pedidos, quiero que el calendario se actualice automáticamente al aplicar filtros de fecha y estado desde la barra superior, para que pueda enfocarme en los pedidos relevantes según mis criterios de búsqueda.

#### Acceptance Criteria

1. WHEN el Usuario selecciona un rango de fechas en el filtro, THE Sistema SHALL actualizar el calendario mostrando solo pedidos dentro de ese rango
2. WHEN el Usuario selecciona un estado específico en el filtro, THE Sistema SHALL actualizar el calendario mostrando solo pedidos con ese estado
3. WHEN el Usuario selecciona múltiples estados en el filtro, THE Sistema SHALL actualizar el calendario mostrando pedidos que coincidan con cualquiera de los estados seleccionados
4. THE Sistema SHALL aplicar los filtros sin recargar la página completa
5. WHEN el Usuario limpia los filtros, THE Sistema SHALL mostrar todos los pedidos disponibles en el calendario

### Requirement 7: Navegación Temporal del Calendario

**User Story:** Como usuario del módulo de Pedidos, quiero poder navegar entre diferentes períodos de tiempo en el calendario (mes anterior, mes siguiente, hoy), para que pueda revisar pedidos pasados y futuros de manera eficiente.

#### Acceptance Criteria

1. THE Sistema SHALL proporcionar botones de navegación "Anterior", "Siguiente" y "Hoy"
2. WHEN el Usuario hace clic en "Anterior", THE Sistema SHALL mostrar el período anterior (mes, semana o día según la vista activa)
3. WHEN el Usuario hace clic en "Siguiente", THE Sistema SHALL mostrar el período siguiente (mes, semana o día según la vista activa)
4. WHEN el Usuario hace clic en "Hoy", THE Sistema SHALL regresar al período actual y resaltar el día de hoy
5. THE Sistema SHALL actualizar el título del calendario mostrando el período visible actual

### Requirement 8: Integración con Datos Existentes

**User Story:** Como usuario del módulo de Pedidos, quiero que el calendario utilice los mismos datos que la vista de lista, para que la información sea consistente y no tenga que preocuparme por discrepancias entre vistas.

#### Acceptance Criteria

1. THE Sistema SHALL utilizar el método getOrders() existente para obtener los datos de pedidos
2. THE Sistema SHALL transformar los datos del formato de tabla al formato requerido por FullCalendar
3. WHEN se actualiza un pedido en el sistema, THE Sistema SHALL reflejar los cambios en el calendario al recargar
4. THE Sistema SHALL mantener la misma lógica de filtrado que la vista de lista
5. THE Sistema SHALL usar las mismas definiciones de estado y colores que la vista de lista
