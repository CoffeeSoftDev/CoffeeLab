# Requirements Document - Módulo de Compras

## Introduction

El módulo de Compras es un sistema integral para la gestión y administración de compras empresariales, clasificadas por tipo (fondo fijo, corporativo, crédito). Permite registrar, visualizar, editar y eliminar compras, con control de proveedores, productos, categorías y métodos de pago.

## Glossary

- **System**: Módulo de Compras del sistema de contabilidad CoffeeSoft
- **User**: Usuario del sistema con permisos para gestionar compras
- **Purchase**: Registro de compra con información de producto, proveedor, montos y clasificación
- **Purchase_Type**: Clasificación de compra (Fondo fijo, Corporativo, Crédito)
- **Product_Category**: Categoría del producto comprado (Gastos de administración, Gastos operativos, etc.)
- **Provider**: Proveedor o entidad que emite la factura
- **Payment_Method**: Método de pago utilizado (Efectivo, Tarjeta de crédito, Tarjeta de débito, Transferencia)

## Requirements

### Requirement 1: Interfaz Principal del Módulo

**User Story:** Como usuario del sistema, quiero acceder al módulo de compras con una interfaz que muestre el resumen total y las listas de compras por tipo, para visualizar de forma clara el estado de las compras y acceder fácilmente a las opciones de gestión.

#### Acceptance Criteria

1. WHEN THE User accede al módulo de compras, THE System SHALL mostrar cuatro tarjetas con los totales: "Total de compras", "Total compras de fondo fijo", "Total compras a crédito" y "Total compras de corporativo"

2. THE System SHALL mostrar dos botones principales: "Subir archivos de compras" y "Registrar nueva compra" en la parte superior de la interfaz

3. THE System SHALL incluir un filtro desplegable con las opciones: "Mostrar todas las compras", "Compras de fondo fijo", "Compras de corporativo" y "Compras a crédito"

4. THE System SHALL mostrar una tabla con las columnas: "FOLIO", "CLASE PRODUCTO", "PRODUCTO", "TIPO DE COMPRA", "TOTAL" y columna de acciones

5. WHEN THE User selecciona un filtro de tipo de compra, THE System SHALL actualizar la tabla mostrando únicamente las compras del tipo seleccionado

6. THE System SHALL mostrar tres íconos de acción por cada fila: ícono de ojo (ver detalle), ícono de lápiz (editar) e ícono de papelera (eliminar)

### Requirement 2: Registro de Nueva Compra

**User Story:** Como usuario del sistema, quiero registrar una nueva compra en el sistema mediante un formulario dinámico, para mantener actualizado el control de gastos y clasificar las compras según su tipo.

#### Acceptance Criteria

1. WHEN THE User hace clic en "Registrar nueva compra", THE System SHALL mostrar un modal con el formulario de registro

2. THE System SHALL incluir los campos obligatorios: "Categoría de producto", "Producto", "Tipo de compra", "Proveedor al contado y No de factura", "Subtotal" e "Impuesto"

3. THE System SHALL incluir el campo opcional: "Descripción de la compra"

4. WHEN THE User selecciona "Tipo de compra", THE System SHALL mostrar el campo "Método de pago" con las opciones correspondientes al tipo seleccionado

5. WHEN THE User selecciona "Corporativo" como tipo de compra, THE System SHALL mostrar las opciones de método de pago: "Efectivo", "Tarjeta de débito", "Tarjeta de crédito", "Transferencia" y "Almacén del área compras"

6. THE System SHALL calcular automáticamente el campo "Total" sumando "Subtotal" más "Impuesto"

7. WHEN THE User deja campos obligatorios vacíos y hace clic en "Guardar compra", THE System SHALL mostrar mensajes de validación indicando los campos faltantes

8. WHEN THE User completa todos los campos obligatorios y hace clic en "Guardar compra", THE System SHALL registrar la compra en la base de datos

9. WHEN THE System registra exitosamente una compra, THE System SHALL mostrar un mensaje de confirmación y actualizar la tabla principal

10. WHEN THE System registra exitosamente una compra, THE System SHALL actualizar los totales mostrados en las tarjetas superiores

### Requirement 3: Visualización de Detalle de Compra

**User Story:** Como usuario del sistema, quiero visualizar el detalle completo de una compra seleccionada, para consultar la información del producto, tipo, método de pago y totales.

#### Acceptance Criteria

1. WHEN THE User hace clic en el ícono de ojo de una compra, THE System SHALL mostrar un modal con el título "DETALLE DE COMPRA"

2. THE System SHALL mostrar la sección "INFORMACIÓN DEL PRODUCTO" con los campos: "Categoría de producto", "Producto", "Tipo de compra" y "Método de pago"

3. THE System SHALL mostrar la sección "INFORMACIÓN DE FACTURACIÓN" con el campo "Número de Ticket/Factura"

4. THE System SHALL mostrar la sección "DESCRIPCIÓN" con el texto descriptivo de la compra

5. THE System SHALL mostrar la sección "RESUMEN FINANCIERO" con los campos: "Subtotal", "Impuesto" y "Total"

6. THE System SHALL mostrar en el encabezado del modal la información: "Actualizado por última vez: [fecha], Por: [nombre_usuario]"

7. THE System SHALL formatear los montos con el símbolo de moneda y dos decimales (ej: $ 1,012.00)

### Requirement 4: Edición de Compra

**User Story:** Como usuario del sistema, quiero editar los datos de una compra existente, para corregir o actualizar información registrada previamente.

#### Acceptance Criteria

1. WHEN THE User hace clic en el ícono de lápiz de una compra, THE System SHALL mostrar un modal con el título "EDITAR COMPRA"

2. THE System SHALL prellenar todos los campos del formulario con los datos actuales de la compra seleccionada

3. THE System SHALL permitir editar los campos: "Categoría de producto", "Producto", "Tipo de compra", "Método de pago", "Número o folio de ticket o factura", "Subtotal", "Impuesto" y "Descripción de la compra"

4. WHEN THE User modifica el "Subtotal" o "Impuesto", THE System SHALL recalcular automáticamente el "Total"

5. WHEN THE User deja campos obligatorios vacíos, THE System SHALL mostrar mensajes de validación antes de permitir guardar

6. WHEN THE User hace clic en "Editar compra" con datos válidos, THE System SHALL actualizar el registro en la base de datos

7. WHEN THE System actualiza exitosamente una compra, THE System SHALL mostrar un mensaje de confirmación y actualizar la tabla principal

8. WHEN THE System actualiza exitosamente una compra, THE System SHALL recalcular y actualizar los totales en las tarjetas superiores si el tipo de compra o monto cambió

### Requirement 5: Eliminación de Compra

**User Story:** Como usuario del sistema, quiero eliminar una compra del registro, para mantener la base de datos limpia y actualizada.

#### Acceptance Criteria

1. WHEN THE User hace clic en el ícono de papelera de una compra, THE System SHALL mostrar un modal de confirmación con el título "ELIMINAR COMPRA"

2. THE System SHALL mostrar el mensaje "¿Esta seguro de querer eliminar la compra?" con un ícono de interrogación

3. THE System SHALL mostrar dos botones: "Continuar" (azul) y "Cancelar" (blanco con borde rojo)

4. WHEN THE User hace clic en "Cancelar", THE System SHALL cerrar el modal sin realizar cambios

5. WHEN THE User hace clic en "Continuar", THE System SHALL eliminar el registro de la base de datos de forma permanente

6. WHEN THE System elimina exitosamente una compra, THE System SHALL mostrar un mensaje de confirmación

7. WHEN THE System elimina exitosamente una compra, THE System SHALL actualizar la tabla principal removiendo la fila eliminada

8. WHEN THE System elimina exitosamente una compra, THE System SHALL recalcular y actualizar los totales en las tarjetas superiores

### Requirement 6: Filtrado de Compras por Tipo

**User Story:** Como usuario del sistema, quiero filtrar las compras por tipo (fondo fijo, corporativo, crédito o todas), para visualizar únicamente las compras que me interesan en un momento dado.

#### Acceptance Criteria

1. THE System SHALL mostrar un selector desplegable con las opciones: "Mostrar todas las compras", "Compras de fondo fijo", "Compras de corporativo" y "Compras a crédito"

2. WHEN THE User selecciona "Mostrar todas las compras", THE System SHALL mostrar todas las compras registradas en la tabla

3. WHEN THE User selecciona "Compras de fondo fijo", THE System SHALL mostrar únicamente las compras con tipo_compra_id correspondiente a fondo fijo

4. WHEN THE User selecciona "Compras de corporativo", THE System SHALL mostrar únicamente las compras con tipo_compra_id correspondiente a corporativo

5. WHEN THE User selecciona "Compras a crédito", THE System SHALL mostrar únicamente las compras con tipo_compra_id correspondiente a crédito

6. THE System SHALL mantener visible el total general en la tarjeta "Total de compras" independientemente del filtro aplicado

### Requirement 7: Cálculo y Visualización de Totales

**User Story:** Como usuario del sistema, quiero ver los totales de compras generales y por tipo en tiempo real, para tener un resumen financiero actualizado del estado de las compras.

#### Acceptance Criteria

1. THE System SHALL calcular y mostrar el "Total de compras" sumando todas las compras activas en la base de datos

2. THE System SHALL calcular y mostrar el "Total compras de fondo fijo" sumando únicamente las compras con tipo fondo fijo

3. THE System SHALL calcular y mostrar el "Total compras a crédito" sumando únicamente las compras con tipo crédito

4. THE System SHALL calcular y mostrar el "Total compras de corporativo" sumando únicamente las compras con tipo corporativo

5. WHEN THE User registra una nueva compra, THE System SHALL actualizar inmediatamente los totales correspondientes

6. WHEN THE User edita una compra existente, THE System SHALL recalcular los totales si el monto o tipo de compra cambió

7. WHEN THE User elimina una compra, THE System SHALL restar el monto eliminado de los totales correspondientes

8. THE System SHALL formatear todos los totales con el símbolo de moneda y dos decimales (ej: $ 13,826.13)

### Requirement 8: Gestión de Proveedores

**User Story:** Como usuario del sistema, quiero seleccionar proveedores de una lista predefinida al registrar compras, para mantener un catálogo consistente de proveedores.

#### Acceptance Criteria

1. THE System SHALL mostrar un selector desplegable "Proveedor" en el formulario de registro de compra

2. THE System SHALL cargar la lista de proveedores activos desde la tabla proveedores en la base de datos

3. WHEN THE User selecciona un proveedor, THE System SHALL asociar el proveedor_id con la compra

4. THE System SHALL permitir ingresar manualmente el número de factura o ticket en el campo "Proveedor al contado y No de factura"

5. THE System SHALL validar que el campo de proveedor no esté vacío antes de permitir guardar la compra

### Requirement 9: Gestión de Categorías y Productos

**User Story:** Como usuario del sistema, quiero seleccionar categorías de producto y productos relacionados al registrar compras, para clasificar correctamente los gastos.

#### Acceptance Criteria

1. THE System SHALL mostrar un selector desplegable "Categoría de producto" en el formulario de registro

2. THE System SHALL cargar las categorías desde la tabla clase_insumo en la base de datos

3. WHEN THE User selecciona una categoría, THE System SHALL cargar en el selector "Producto" únicamente los productos relacionados con esa categoría

4. THE System SHALL mostrar el selector "Producto" deshabilitado hasta que se seleccione una categoría

5. THE System SHALL validar que ambos campos (categoría y producto) estén seleccionados antes de permitir guardar

### Requirement 10: Validación de Campos Numéricos

**User Story:** Como usuario del sistema, quiero que los campos de montos validen automáticamente el formato numérico, para evitar errores de captura.

#### Acceptance Criteria

1. THE System SHALL validar que los campos "Subtotal" e "Impuesto" acepten únicamente valores numéricos

2. THE System SHALL formatear automáticamente los campos de monto con dos decimales al perder el foco

3. THE System SHALL mostrar el símbolo de moneda ($) antes de los campos de monto

4. WHEN THE User ingresa un valor no numérico en campos de monto, THE System SHALL mostrar un mensaje de error

5. THE System SHALL validar que el "Subtotal" sea mayor a cero antes de permitir guardar

6. THE System SHALL permitir que el campo "Impuesto" sea cero o mayor
