# Requirements Document - Gestión de Clientes

## Introduction

El módulo **Gestión de Clientes** es un componente estratégico del sistema KPI/Marketing dentro del ERP CoffeeSoft. Este módulo permite la administración integral de clientes que realizan pedidos a domicilio en las diferentes unidades de negocio, proporcionando un control completo sobre su información personal, procedencia, comportamiento de compra y clasificación (activo, inactivo o VIP).

El sistema está diseñado para facilitar el seguimiento personalizado de clientes, mantener actualizada su información de contacto, y generar insights valiosos para estrategias de marketing y fidelización. La interfaz utiliza TailwindCSS y componentes de CoffeeSoft para garantizar una experiencia fluida, adaptable y profesional.

## Requirements

### Requirement 1: Registro de Nuevos Clientes

**User Story:** Como administrador del sistema, quiero registrar nuevos clientes con información completa, para mantener una base de datos actualizada que permita comunicación efectiva y seguimiento personalizado.

#### Acceptance Criteria

1. WHEN el usuario hace clic en "Agregar Cliente" THEN el sistema SHALL mostrar un formulario modal con todos los campos requeridos para el registro.

2. WHEN el usuario completa el formulario de registro THEN el sistema SHALL validar que los campos obligatorios (nombre, teléfono, domicilio, unidad de negocio) estén completos antes de permitir el envío.

3. WHEN el usuario ingresa un teléfono THEN el sistema SHALL validar que sea numérico y tenga una longitud mínima de 10 dígitos.

4. WHEN el usuario ingresa un correo electrónico THEN el sistema SHALL validar que tenga un formato válido (contiene @ y dominio).

5. WHEN el usuario selecciona una unidad de negocio THEN el sistema SHALL registrar la procedencia del cliente para análisis posteriores.

6. WHEN el usuario marca el checkbox VIP THEN el sistema SHALL registrar al cliente con estatus VIP para seguimiento preferencial.

7. WHEN el registro se completa exitosamente THEN el sistema SHALL mostrar un mensaje de confirmación y actualizar automáticamente la lista de clientes.

8. WHEN el registro falla THEN el sistema SHALL mostrar un mensaje de error específico indicando la causa del problema.

### Requirement 2: Edición y Actualización de Datos de Clientes

**User Story:** Como administrador del sistema, quiero editar y actualizar la información de clientes existentes, para mantener los datos actualizados y corregir errores cuando sea necesario.

#### Acceptance Criteria

1. WHEN el usuario hace clic en el botón de editar de un cliente THEN el sistema SHALL cargar los datos actuales del cliente en un formulario modal prellenado.

2. WHEN el usuario modifica cualquier campo del formulario THEN el sistema SHALL permitir la edición sin restricciones en campos no críticos.

3. WHEN el usuario actualiza el teléfono o correo THEN el sistema SHALL validar el formato antes de guardar los cambios.

4. WHEN el usuario cambia la unidad de negocio del cliente THEN el sistema SHALL actualizar la procedencia y reflejar el cambio en los reportes.

5. WHEN el usuario marca o desmarca el checkbox VIP THEN el sistema SHALL actualizar el estatus del cliente inmediatamente.

6. WHEN la actualización se completa exitosamente THEN el sistema SHALL mostrar un mensaje de confirmación y refrescar la tabla de clientes.

7. WHEN la actualización falla THEN el sistema SHALL mostrar un mensaje de error y mantener los datos originales sin cambios.

### Requirement 3: Gestión de Estatus de Clientes (Baja Controlada)

**User Story:** Como administrador del sistema, quiero dar de baja clientes de manera controlada mediante cambio de estatus, para mantener un registro histórico sin eliminar información permanentemente.

#### Acceptance Criteria

1. WHEN el usuario hace clic en el botón de cambiar estatus de un cliente activo THEN el sistema SHALL mostrar una confirmación preguntando si desea desactivar al cliente.

2. WHEN el usuario confirma la desactivación THEN el sistema SHALL cambiar el estatus del cliente a "inactivo" sin eliminar el registro de la base de datos.

3. WHEN un cliente está inactivo THEN el sistema SHALL mostrar únicamente el botón de reactivación en lugar de editar/eliminar.

4. WHEN el usuario hace clic en reactivar un cliente inactivo THEN el sistema SHALL mostrar una confirmación y cambiar el estatus a "activo".

5. WHEN el estatus cambia exitosamente THEN el sistema SHALL mostrar un mensaje de confirmación y actualizar la visualización según el filtro activo.

6. WHEN el cambio de estatus falla THEN el sistema SHALL mostrar un mensaje de error y mantener el estatus original.

### Requirement 4: Clasificación por Unidad de Negocio

**User Story:** Como administrador del sistema, quiero clasificar clientes por unidad de negocio de origen, para analizar el comportamiento de compra por ubicación y tomar decisiones estratégicas.

#### Acceptance Criteria

1. WHEN el usuario registra o edita un cliente THEN el sistema SHALL requerir la selección de una unidad de negocio de un catálogo predefinido.

2. WHEN el sistema carga el formulario THEN el sistema SHALL obtener dinámicamente la lista de unidades de negocio activas desde la base de datos.

3. WHEN el usuario filtra por unidad de negocio THEN el sistema SHALL mostrar únicamente los clientes asociados a esa unidad.

4. WHEN se genera un reporte THEN el sistema SHALL agrupar clientes por unidad de negocio para análisis comparativo.

5. WHEN una unidad de negocio se desactiva THEN el sistema SHALL mantener la asociación histórica con los clientes existentes.

### Requirement 5: Identificación de Clientes VIP

**User Story:** Como administrador del sistema, quiero marcar y visualizar clientes VIP, para proporcionar seguimiento preferencial y estrategias de fidelización personalizadas.

#### Acceptance Criteria

1. WHEN el usuario marca un cliente como VIP THEN el sistema SHALL registrar este estatus en la base de datos.

2. WHEN se muestra la tabla de clientes THEN el sistema SHALL mostrar un badge visual distintivo (verde o dorado) para clientes VIP.

3. WHEN el usuario filtra por tipo de cliente VIP THEN el sistema SHALL mostrar únicamente los clientes marcados como VIP.

4. WHEN se genera un reporte de clientes VIP THEN el sistema SHALL agrupar y contar clientes VIP por unidad de negocio.

5. WHEN un cliente VIP es desactivado THEN el sistema SHALL mantener su estatus VIP en el registro histórico.

### Requirement 6: Búsqueda y Filtrado Avanzado

**User Story:** Como administrador del sistema, quiero buscar y filtrar clientes por múltiples criterios, para encontrar rápidamente información específica y generar análisis segmentados.

#### Acceptance Criteria

1. WHEN el usuario accede al módulo de clientes THEN el sistema SHALL mostrar una barra de filtros con opciones de: Unidad de Negocio, Estatus (activo/inactivo) y Tipo de Cliente (VIP/general).

2. WHEN el usuario selecciona un filtro de estatus THEN el sistema SHALL actualizar la tabla mostrando únicamente clientes con ese estatus.

3. WHEN el usuario selecciona un filtro de unidad de negocio THEN el sistema SHALL mostrar únicamente clientes de esa unidad.

4. WHEN el usuario utiliza el buscador de la tabla THEN el sistema SHALL filtrar dinámicamente por nombre, teléfono o correo electrónico.

5. WHEN el usuario combina múltiples filtros THEN el sistema SHALL aplicar todos los criterios simultáneamente (operación AND).

6. WHEN el usuario limpia los filtros THEN el sistema SHALL mostrar todos los clientes activos por defecto.

### Requirement 7: Visualización y Tabla Dinámica

**User Story:** Como administrador del sistema, quiero visualizar la información de clientes en una tabla dinámica y responsive, para acceder fácilmente a los datos desde cualquier dispositivo.

#### Acceptance Criteria

1. WHEN el usuario accede al módulo THEN el sistema SHALL mostrar una tabla con columnas: Nombre, Teléfono, Correo, Unidad de Negocio, Estatus, VIP y Acciones.

2. WHEN la tabla contiene más de 10 registros THEN el sistema SHALL implementar paginación automática.

3. WHEN el usuario hace clic en un encabezado de columna THEN el sistema SHALL ordenar la tabla por esa columna (ascendente/descendente).

4. WHEN el usuario accede desde un dispositivo móvil THEN el sistema SHALL adaptar la visualización de la tabla manteniendo la funcionalidad completa.

5. WHEN un cliente es VIP THEN el sistema SHALL mostrar un badge distintivo en la columna correspondiente.

6. WHEN un cliente está inactivo THEN el sistema SHALL mostrar un indicador visual diferenciado (color gris o icono específico).

7. WHEN la tabla se carga THEN el sistema SHALL mostrar botones de acción (editar/cambiar estatus) alineados a la derecha de cada fila.

### Requirement 8: Integración con Sistema de Pedidos

**User Story:** Como administrador del sistema, quiero que los clientes registrados estén disponibles para el sistema de pedidos, para facilitar la captura de pedidos a domicilio con información precargada.

#### Acceptance Criteria

1. WHEN un cliente es registrado en el módulo de gestión THEN el sistema SHALL hacer disponible su información para el módulo de pedidos.

2. WHEN se crea un pedido THEN el sistema SHALL permitir seleccionar clientes activos desde el catálogo de gestión de clientes.

3. WHEN se selecciona un cliente en pedidos THEN el sistema SHALL autocompletar los datos de contacto y domicilio.

4. WHEN un cliente es desactivado THEN el sistema SHALL mantener la relación con pedidos históricos pero no permitir nuevos pedidos.

### Requirement 9: Validaciones y Mensajes de Usuario

**User Story:** Como administrador del sistema, quiero recibir validaciones claras y mensajes informativos, para evitar errores en la captura de datos y entender el resultado de mis acciones.

#### Acceptance Criteria

1. WHEN el usuario intenta guardar un formulario incompleto THEN el sistema SHALL mostrar mensajes de error específicos para cada campo faltante.

2. WHEN el usuario ingresa un formato inválido THEN el sistema SHALL mostrar un mensaje de error en tiempo real indicando el formato correcto.

3. WHEN una operación se completa exitosamente THEN el sistema SHALL mostrar un mensaje de éxito con SweetAlert o similar.

4. WHEN el usuario intenta cambiar el estatus de un cliente THEN el sistema SHALL mostrar una confirmación con bootbox o swalQuestion antes de proceder.

5. WHEN ocurre un error del servidor THEN el sistema SHALL mostrar un mensaje amigable indicando que se contacte al administrador.

### Requirement 10: Registro de Fecha de Cumpleaños

**User Story:** Como administrador del sistema, quiero registrar la fecha de cumpleaños de los clientes, para implementar estrategias de marketing personalizadas y campañas de fidelización.

#### Acceptance Criteria

1. WHEN el usuario registra o edita un cliente THEN el sistema SHALL proporcionar un campo de fecha para capturar el cumpleaños.

2. WHEN el usuario selecciona una fecha de cumpleaños THEN el sistema SHALL validar que sea una fecha válida en el pasado.

3. WHEN se guarda el cumpleaños THEN el sistema SHALL almacenar la fecha en formato estándar (YYYY-MM-DD) en la base de datos.

4. WHEN se consulta un cliente THEN el sistema SHALL mostrar la fecha de cumpleaños en formato legible (DD/MM/YYYY).

5. IF el campo de cumpleaños está vacío THEN el sistema SHALL permitir guardar el registro sin este dato (campo opcional).
