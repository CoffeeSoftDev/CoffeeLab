# Requirements Document

## Introduction

Este documento define los requerimientos para agregar dos funcionalidades críticas al módulo de pedidos de CoffeeSoft:

1. **Sistema de Tipo de Entrega**: Permitir clasificar pedidos como "Local" o "A domicilio" con visualización clara en la interfaz
2. **Cierre del Día**: Generar un ticket resumen con las ventas totales y desglose por método de pago

Estas funcionalidades mejorarán la gestión operativa del negocio, permitiendo diferenciar tipos de servicio y facilitar el control de caja diario.

## Requirements

### Requirement 1: Sistema de Tipo de Entrega

**User Story:** Como administrador de la pastelería, quiero poder especificar si un pedido es para entrega local o a domicilio, para poder organizar mejor la logística de entregas y visualizar rápidamente qué pedidos requieren servicio de delivery.

#### Acceptance Criteria

1. WHEN el usuario crea o edita un pedido THEN el sistema SHALL mostrar un campo de selección "Tipo de entrega" con las opciones "Local" y "A domicilio"
2. WHEN el usuario no selecciona ninguna opción THEN el sistema SHALL establecer "Local" como valor predeterminado
3. WHEN el usuario guarda un pedido THEN el sistema SHALL almacenar el tipo de entrega en el campo `delivery_type` de la base de datos
4. WHEN el sistema muestra la tabla de pedidos THEN SHALL incluir una columna visual después de "Estado" que muestre un ícono de moto para pedidos a domicilio
5. IF el pedido es tipo "Local" THEN la columna de tipo de entrega SHALL mostrar un ícono de tienda o permanecer vacía
6. WHEN el usuario visualiza el detalle de un pedido THEN el sistema SHALL mostrar claramente el tipo de entrega seleccionado

### Requirement 2: Generación de Ticket de Cierre del Día

**User Story:** Como encargado de caja, quiero generar un ticket de cierre del día que resuma todas las ventas y métodos de pago, para poder realizar el corte de caja de manera rápida y precisa al finalizar la jornada.

#### Acceptance Criteria

1. WHEN el usuario accede al módulo de pedidos THEN el sistema SHALL mostrar un botón "Cierre del día" junto al calendario y botón "Nuevo Pedido"
2. WHEN el usuario hace clic en "Cierre del día" THEN el sistema SHALL abrir un modal con selector de fecha y dos botones separados: "Consultar" e "Imprimir"
3. WHEN el modal se abre THEN el botón "Imprimir" SHALL estar deshabilitado hasta que se realice una consulta exitosa
4. WHEN el usuario selecciona una fecha y presiona "Consultar" THEN el sistema SHALL realizar la búsqueda de pedidos y pagos registrados
5. WHEN se consultan los datos THEN el sistema SHALL mostrar un mensaje de carga mientras procesa la información
6. WHEN la consulta es exitosa THEN el sistema SHALL mostrar el ticket con el resumen de ventas y habilitar el botón "Imprimir"
7. WHEN se genera el ticket THEN SHALL incluir el logotipo de CoffeeSoft y el título "PEDIDOS DE PASTELERÍA"
8. WHEN se calcula el resumen THEN el sistema SHALL mostrar:
   - Venta total del día (suma de todos los pedidos activos)
   - Ingresos por tarjeta (basado en registros de pagos reales)
   - Ingresos en efectivo (basado en registros de pagos reales)
   - Ingresos por transferencia (basado en registros de pagos reales)
   - Número total de pedidos del día
9. WHEN se consultan los datos THEN el sistema SHALL considerar únicamente los pedidos con estado activo (no cancelados)
10. WHEN se consultan los pagos THEN el sistema SHALL obtener los registros de la tabla `pedidos_payments` agrupados por método de pago
11. WHEN se muestra el ticket THEN SHALL usar el mismo formato visual que el ticket de pedido personalizado existente
12. WHEN el usuario presiona "Imprimir" THEN el sistema SHALL abrir una ventana de impresión con el ticket generado
13. IF no hay pedidos en la fecha seleccionada THEN el sistema SHALL mostrar un mensaje indicando "No hay pedidos registrados para esta fecha"
14. IF no hay una fecha seleccionada al presionar "Consultar" THEN el sistema SHALL mostrar una alerta solicitando seleccionar una fecha
15. WHEN se genera el ticket THEN el botón SHALL tener estilo visual verde (`bg-green-600`) con ícono de recibo (`icon-receipt`)

### Requirement 3: Integración con Base de Datos

**User Story:** Como desarrollador del sistema, necesito que los cambios en la base de datos sean compatibles con la estructura existente, para mantener la integridad de los datos y evitar conflictos con funcionalidades previas.

#### Acceptance Criteria

1. WHEN se implementa el tipo de entrega THEN el sistema SHALL agregar el campo `delivery_type` a la tabla de pedidos con valores permitidos: 'local', 'domicilio'
2. WHEN se crea un nuevo pedido sin especificar tipo THEN el campo `delivery_type` SHALL tener valor predeterminado 'local'
3. WHEN se consultan pedidos para el cierre del día THEN el sistema SHALL filtrar por fecha y agrupar por método de pago
4. WHEN se calculan totales THEN el sistema SHALL excluir pedidos con estado cancelado o inactivo
5. WHEN se consultan pagos para el cierre del día THEN el sistema SHALL obtener los registros de la tabla `pedidos_payments` filtrando por fecha y pedidos activos
6. WHEN se agrupan pagos por método THEN el sistema SHALL usar el campo `method_pay_id` de la tabla `pedidos_payments`
7. WHEN se suman los pagos THEN el sistema SHALL usar el campo `advanced_pay` de la tabla `pedidos_payments`

### Requirement 4: Separación de Acciones de Consulta e Impresión

**User Story:** Como usuario del sistema, quiero que las acciones de consultar datos y generar el ticket de impresión estén separadas, para poder revisar la información antes de imprimir y evitar impresiones innecesarias.

#### Acceptance Criteria

1. WHEN el modal de cierre del día se abre THEN el sistema SHALL mostrar dos botones claramente diferenciados: "Consultar" e "Imprimir"
2. WHEN el modal se abre por primera vez THEN el botón "Imprimir" SHALL estar visualmente deshabilitado (opacity reducida, cursor not-allowed)
3. WHEN el usuario presiona "Consultar" sin seleccionar fecha THEN el sistema SHALL mostrar una alerta de validación
4. WHEN el usuario presiona "Consultar" con fecha válida THEN el sistema SHALL ejecutar la búsqueda de datos sin generar el ticket de impresión
5. WHEN la consulta es exitosa THEN el sistema SHALL habilitar el botón "Imprimir" y cambiar su estado visual a activo
6. WHEN el usuario presiona "Imprimir" estando habilitado THEN el sistema SHALL abrir la ventana de impresión con el ticket previamente consultado
7. WHEN el usuario presiona "Imprimir" estando deshabilitado THEN el sistema SHALL ignorar el evento (no hacer nada)
8. WHEN el usuario cambia la fecha después de una consulta exitosa THEN el botón "Imprimir" SHALL permanecer habilitado hasta que se cierre el modal
9. WHEN no hay datos para la fecha consultada THEN el botón "Imprimir" SHALL permanecer deshabilitado
