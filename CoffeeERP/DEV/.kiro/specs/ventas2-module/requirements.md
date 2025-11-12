# Requirements Document

## Introduction

El módulo **Ventas2** es un sistema de consulta y gestión de ventas diarias que permite a los usuarios visualizar, filtrar y cargar información de ventas por unidad de negocio (UDN). El sistema proporciona un desglose detallado por categorías (Alimentos, Bebidas) y permite la captura manual de ventas diarias cuando sea necesario.

## Glossary

- **System**: El módulo Ventas2 completo
- **UDN**: Unidad de Negocio (ej: BAOS, VAROCH, etc.)
- **Venta Diaria**: Registro de ventas de un día específico
- **Categoría**: Clasificación de ventas (Alimentos, Bebidas)
- **Usuario**: Persona que interactúa con el sistema
- **Base de Datos**: Sistema de almacenamiento MySQL con las tablas ventas, ventas_udn, venta_bitacora, udn

## Requirements

### Requirement 1

**User Story:** Como usuario del sistema, quiero acceder a una pestaña de consulta de ventas, para visualizar el desempeño mensual filtrado por UDN, mes y año

#### Acceptance Criteria

1. WHEN el Usuario accede al módulo Ventas2, THE System SHALL renderizar una interfaz con pestañas de navegación
2. THE System SHALL mostrar una pestaña activa llamada "Módulo ventas" por defecto
3. WHEN el Usuario selecciona la pestaña "Módulo ventas", THE System SHALL mostrar una barra de filtros con selectores de UDN, Año y Mes
4. THE System SHALL cargar automáticamente los valores disponibles en cada selector desde la base de datos
5. WHEN el Usuario hace clic en el botón "Buscar", THE System SHALL ejecutar una consulta a la base de datos con los filtros seleccionados

### Requirement 2

**User Story:** Como usuario del sistema, quiero visualizar una tabla de ventas diarias, para analizar el desempeño por fecha con desglose de categorías

#### Acceptance Criteria

1. THE System SHALL mostrar una tabla con las columnas: Fecha, Día, Estado, Clientes, Alimentos, Bebidas, Total
2. WHEN la consulta retorna datos, THE System SHALL renderizar cada registro como una fila en la tabla
3. THE System SHALL formatear los valores monetarios con el símbolo $ y separadores de miles
4. THE System SHALL mostrar el estado de cada venta con un badge visual (Capturado en verde)
5. THE System SHALL ordenar los registros por fecha de forma descendente
6. THE System SHALL aplicar estilos corporativos de CoffeeSoft con tema "corporativo"

### Requirement 3

**User Story:** Como usuario del sistema, quiero un botón para subir información de ventas, para registrar manualmente ventas cuando sea necesario

#### Acceptance Criteria

1. THE System SHALL mostrar un botón "Subir Información" en la barra de filtros
2. WHEN el Usuario hace clic en "Subir Información", THE System SHALL abrir un formulario modal
3. THE System SHALL incluir en el formulario los campos: UDN, Fecha, Clientes, Alimentos, Bebidas
4. WHEN el Usuario envía el formulario, THE System SHALL validar que todos los campos requeridos estén completos
5. IF la validación es exitosa, THE System SHALL insertar el registro en la tabla venta_bitacora
6. THE System SHALL crear registros relacionados en ventas_udn vinculando con las tablas ventas y udn
7. WHEN la inserción es exitosa, THE System SHALL mostrar un mensaje de confirmación
8. THE System SHALL recargar automáticamente la tabla de ventas con los datos actualizados

### Requirement 4

**User Story:** Como usuario del sistema, quiero editar registros de ventas existentes, para corregir información capturada incorrectamente

#### Acceptance Criteria

1. THE System SHALL mostrar un botón de edición en cada fila de la tabla
2. WHEN el Usuario hace clic en editar, THE System SHALL obtener los datos del registro desde la base de datos
3. THE System SHALL abrir un formulario modal prellenado con los datos actuales
4. WHEN el Usuario modifica los campos y envía el formulario, THE System SHALL actualizar el registro en venta_bitacora
5. THE System SHALL actualizar los registros relacionados en ventas_udn si es necesario
6. WHEN la actualización es exitosa, THE System SHALL mostrar un mensaje de confirmación
7. THE System SHALL recargar la tabla con los datos actualizados

### Requirement 5

**User Story:** Como usuario del sistema, quiero cambiar el estado de una venta, para marcarla como activa o inactiva según sea necesario

#### Acceptance Criteria

1. THE System SHALL mostrar un botón de estado en cada fila de la tabla
2. WHEN el Usuario hace clic en el botón de estado, THE System SHALL mostrar un diálogo de confirmación
3. THE System SHALL indicar claramente la acción a realizar (activar/desactivar)
4. WHEN el Usuario confirma la acción, THE System SHALL actualizar el campo active en venta_bitacora
5. THE System SHALL actualizar el campo Stado en ventas_udn si existe relación
6. WHEN la actualización es exitosa, THE System SHALL mostrar un mensaje de confirmación
7. THE System SHALL recargar la tabla reflejando el nuevo estado

### Requirement 6

**User Story:** Como desarrollador del sistema, quiero que el módulo siga la arquitectura MVC de CoffeeSoft, para mantener consistencia y facilitar el mantenimiento

#### Acceptance Criteria

1. THE System SHALL implementar un archivo JavaScript que extienda la clase Templates de CoffeeSoft
2. THE System SHALL implementar un controlador PHP (ctrl-ventas2.php) que extienda la clase del modelo
3. THE System SHALL implementar un modelo PHP (mdl-ventas2.php) que extienda la clase CRUD
4. THE System SHALL usar los métodos de CoffeeSoft: createTable(), createForm(), createModalForm(), swalQuestion()
5. THE System SHALL seguir la nomenclatura estándar: ls() en frontend, listVentas() en modelo
6. THE System SHALL usar useFetch() para todas las peticiones AJAX
7. THE System SHALL aplicar el tema corporativo de CoffeeSoft en todos los componentes visuales
