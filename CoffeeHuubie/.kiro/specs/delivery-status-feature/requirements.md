# Requirements Document

## Introduction

Este documento define los requisitos para implementar una columna interactiva de **Estado de Entrega** en el módulo de pedidos. La funcionalidad permitirá a los usuarios visualizar y actualizar el estado de entrega de cada pedido directamente desde la tabla principal, mejorando el control operativo y la trazabilidad de las entregas.

## Requirements

### Requirement 1: Visualización del Estado de Entrega

**User Story:** Como usuario del sistema de pedidos, quiero ver el estado de entrega de cada pedido en la tabla principal, para identificar rápidamente qué pedidos han sido entregados y cuáles están pendientes.

#### Acceptance Criteria

1. WHEN el usuario visualiza la lista de pedidos THEN el sistema SHALL mostrar una columna llamada "Entrega" después de la columna "Estado"
2. WHEN un pedido tiene `is_delivered = 1` THEN el sistema SHALL mostrar un badge verde con el texto "Entregado" y clase `bg-green-500`
3. WHEN un pedido tiene `is_delivered = 0` THEN el sistema SHALL mostrar un badge rojo con el texto "No entregado" y clase `bg-red-500`
4. WHEN un pedido es una cotización (status = 1) THEN el sistema SHALL mostrar un badge gris con el texto "No aplica" y clase `bg-gray-400`
5. WHEN el badge se renderiza THEN el sistema SHALL incluir un icono apropiado (✓ para entregado, ✗ para no entregado, - para no aplica)

### Requirement 2: Actualización Interactiva del Estado

**User Story:** Como usuario del sistema, quiero poder actualizar el estado de entrega haciendo clic en el badge, para mantener actualizada la información sin necesidad de editar todo el pedido.

#### Acceptance Criteria

1. WHEN el usuario hace clic en un badge de estado "Entregado" o "No entregado" THEN el sistema SHALL mostrar un modal de confirmación usando `swalQuestion`
2. WHEN el modal se muestra THEN el sistema SHALL incluir el folio del pedido en el título
3. WHEN el modal se muestra THEN el sistema SHALL ofrecer dos opciones: "Sí, entregado" y "No entregado"
4. WHEN el usuario selecciona "Sí, entregado" THEN el sistema SHALL actualizar `is_delivered = 1` en la base de datos
5. WHEN el usuario selecciona "No entregado" THEN el sistema SHALL actualizar `is_delivered = 0` en la base de datos
6. WHEN el usuario hace clic en un badge "No aplica" THEN el sistema SHALL NOT mostrar ningún modal ni permitir cambios

### Requirement 3: Integración con Backend

**User Story:** Como desarrollador, quiero que la actualización del estado de entrega se realice mediante una llamada al controlador existente, para mantener la consistencia arquitectónica del sistema.

#### Acceptance Criteria

1. WHEN se actualiza el estado de entrega THEN el sistema SHALL enviar una petición a `ctrl-pedidos.php` con `opc: 'updateDeliveryStatus'`
2. WHEN se envía la petición THEN el sistema SHALL incluir los parámetros `id` (del pedido) e `is_delivered` (0 o 1)
3. WHEN el controlador recibe la petición THEN el sistema SHALL validar que el pedido existe
4. WHEN el pedido existe THEN el sistema SHALL actualizar el campo `is_delivered` en la tabla `order`
5. WHEN la actualización es exitosa THEN el sistema SHALL retornar `status: 200` con un mensaje de confirmación
6. WHEN ocurre un error THEN el sistema SHALL retornar `status: 500` con un mensaje descriptivo del error

### Requirement 4: Retroalimentación Visual

**User Story:** Como usuario, quiero recibir confirmación visual inmediata después de actualizar el estado de entrega, para saber que mi acción fue procesada correctamente.

#### Acceptance Criteria

1. WHEN la actualización es exitosa THEN el sistema SHALL mostrar una notificación toast con mensaje de éxito
2. WHEN la actualización es exitosa THEN el sistema SHALL actualizar el badge visualmente sin recargar toda la tabla
3. WHEN la actualización falla THEN el sistema SHALL mostrar una notificación toast con el mensaje de error
4. WHEN se muestra la notificación THEN el sistema SHALL usar colores apropiados (verde para éxito, rojo para error)
5. WHEN el badge se actualiza THEN el sistema SHALL aplicar una animación de transición suave

### Requirement 5: Validaciones y Reglas de Negocio

**User Story:** Como administrador del sistema, quiero que solo se permita actualizar el estado de entrega en pedidos válidos, para mantener la integridad de los datos.

#### Acceptance Criteria

1. WHEN un pedido tiene `status = 1` (cotización) THEN el sistema SHALL NOT permitir cambiar el estado de entrega
2. WHEN un pedido tiene `status = 4` (cancelado) THEN el sistema SHALL permitir visualizar pero NOT modificar el estado de entrega
3. WHEN se intenta actualizar un pedido inexistente THEN el sistema SHALL retornar un error 404
4. WHEN el usuario no tiene permisos THEN el sistema SHALL validar la sesión antes de permitir cambios
5. WHEN se actualiza el estado THEN el sistema SHALL registrar la fecha y hora de la modificación en `date_creation` o campo equivalente

### Requirement 6: Compatibilidad y Rendimiento

**User Story:** Como usuario, quiero que la funcionalidad de estado de entrega funcione de manera fluida y rápida, sin afectar el rendimiento general del sistema.

#### Acceptance Criteria

1. WHEN se carga la tabla de pedidos THEN el sistema SHALL renderizar los badges de entrega en menos de 500ms
2. WHEN se actualiza un estado THEN el sistema SHALL completar la operación en menos de 2 segundos
3. WHEN hay múltiples usuarios actualizando estados THEN el sistema SHALL manejar las peticiones concurrentes sin conflictos
4. WHEN se usa en dispositivos móviles THEN los badges SHALL ser táctiles y responsivos
5. WHEN se integra la funcionalidad THEN el sistema SHALL mantener compatibilidad con el código existente de `dashboard-pedidos.js`
