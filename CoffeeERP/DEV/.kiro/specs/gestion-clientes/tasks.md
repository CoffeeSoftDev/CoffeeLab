# Implementation Plan - Gestión de Clientes

## Tareas de Implementación

- [x] 1. Crear estructura de base de datos



  - Crear tabla `cliente` con todos los campos especificados (id, nombre, apellido_paterno, apellido_materno, vip, telefono, correo, fecha_cumpleaños, fecha_creacion, udn_id, active)
  - Crear tabla `domicilio_cliente` con relación a cliente (id, cliente_id, calle, numero_exterior, numero_interior, colonia, ciudad, estado, codigo_postal, referencias, es_principal)
  - Establecer foreign keys y constraints apropiados
  - Configurar ON DELETE CASCADE para domicilio_cliente



  - _Requirements: 1.1, 1.5, 1.7, 10.3_

- [ ] 2. Implementar modelo de datos (mdl-clientes.php)
  - Crear clase `mdl` que extienda de `Conexion`
  - Implementar método `lsClientes($params)` para listar clientes con filtros (udn_id, active, vip)
  - Implementar método `getClienteById($id)` para obtener cliente específico con su domicilio
  - Implementar método `createCliente($data)` para insertar nuevo cliente
  - Implementar método `createDomicilio($data)` para insertar domicilio del cliente
  - Implementar método `updateCliente($data)` para actualizar información del cliente



  - Implementar método `updateDomicilio($data)` para actualizar domicilio
  - Implementar método `existsClienteByPhone($phone)` para validar duplicados
  - Usar prepared statements en todas las consultas para prevenir SQL injection
  - _Requirements: 1.2, 2.1, 3.2, 4.2, 6.2_

- [ ] 3. Implementar controlador (ctrl-clientes.php)
  - Crear clase `ctrl` que extienda de `mdl`
  - Implementar método `init()` para cargar datos iniciales (lista de UDN)
  - Implementar método `listClientes()` que procese filtros y formatee respuesta para la tabla


  - Implementar método `getCliente()` que obtenga cliente por ID con validaciones
  - Implementar método `addCliente()` con validaciones completas (campos obligatorios, formato teléfono, formato correo, duplicados)
  - Implementar método `editCliente()` con validaciones y actualización de cliente y domicilio
  - Implementar método `statusCliente()` para cambiar estatus activo/inactivo
  - Implementar formateo de respuestas con badges VIP y estados visuales
  - Sanitizar todos los inputs con `$this->util->sql()`
  - _Requirements: 1.3, 1.4, 2.2, 2.6, 3.2, 3.5, 9.1, 9.2_



- [ ] 4. Crear vista principal (index.php)
  - Crear archivo index.php en `kpi/marketing/clientes/`
  - Incluir layout head con `core-libraries.php` y estilos de CoffeeSoft
  - Crear contenedor principal con id `root`
  - Incluir script `clientes.js`
  - Configurar API endpoint hacia `ctrl/ctrl-clientes.php`

  - Incluir layout script con librerías necesarias
  - _Requirements: 7.1, 7.4_

- [ ] 5. Implementar módulo JavaScript principal (clientes.js)
  - Crear clase `Clientes` que extienda de `Templates`
  - Implementar constructor con link API y div_modulo
  - Implementar método `init()` para inicializar el módulo y cargar datos iniciales
  - Implementar método `render()` que coordine layout, filterBar y lista inicial
  - Implementar método `layout()` usando `primaryLayout()` con filterBar y container

  - Agregar título "Gestión de Clientes" y descripción del módulo
  - _Requirements: 7.1_

- [ ] 6. Implementar barra de filtros
  - Implementar método `filterBar()` en clase Clientes
  - Usar `createfilterBar()` de Templates
  - Agregar filtro select de Unidad de Negocio (cargado dinámicamente desde init)
  - Agregar filtro select de Estatus (Activos/Inactivos) con valores 1/0
  - Agregar filtro select de Tipo de Cliente (Todos/VIP) con valores null/1
  - Agregar botón "Agregar Cliente" que llame a `addCliente()`

  - Configurar onchange de filtros para llamar a `ls()`
  - _Requirements: 6.1, 6.2, 6.3, 6.5_

- [ ] 7. Implementar listado de clientes con tabla dinámica
  - Implementar método `ls()` que use `createTable()` de Templates
  - Configurar tabla con columnas: Nombre Completo, Teléfono, Correo, Unidad de Negocio, Estatus, VIP, Acciones
  - Habilitar paginación con 10 registros por página
  - Habilitar búsqueda dinámica en la tabla
  - Habilitar ordenamiento por columnas

  - Configurar tema 'light' para la tabla
  - Alinear columna de Acciones a la derecha
  - Centrar columnas de Estatus y VIP
  - _Requirements: 7.1, 7.2, 7.3, 7.7_

- [ ] 8. Implementar renderizado de tabla con badges visuales
  - Implementar método `renderTable(data)` en controlador
  - Formatear nombre completo concatenando nombre, apellido_paterno, apellido_materno
  - Renderizar badge VIP con color verde/dorado cuando vip = 1
  - Renderizar indicador de estatus con colores diferenciados (activo = verde, inactivo = gris)
  - Agregar botones de acción: Editar (icono pencil) y Cambiar Estatus (icono toggle)
  - Mostrar botón de reactivación para clientes inactivos
  - Usar función `renderStatus()` para formatear estatus
  - _Requirements: 5.2, 5.3, 7.5, 7.6_

- [x] 9. Implementar formulario de nuevo cliente

  - Implementar método `addCliente()` en clase Clientes
  - Usar `createModalForm()` de Templates
  - Configurar título "Agregar Cliente"
  - Agregar campo input para Nombre (obligatorio)
  - Agregar campo input para Apellido Paterno (opcional)
  - Agregar campo input para Apellido Materno (opcional)
  - Agregar campo input para Teléfono con validación numérica (obligatorio, onkeyup: validationInputForNumber)
  - Agregar campo input para Correo con validación de formato email (opcional)
  - Agregar campo date para Fecha de Cumpleaños (opcional)
  - Agregar campo select para Unidad de Negocio (obligatorio, cargado desde init)
  - Agregar campo checkbox para VIP (opcional)

  - Agregar campos de domicilio: Calle (obligatorio), Número Exterior, Número Interior, Colonia, Ciudad, Estado, Código Postal, Referencias
  - Configurar data con opc: 'addCliente'
  - Implementar callback success que muestre alerta y actualice lista
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 10.1, 10.2_

- [ ] 10. Implementar formulario de edición de cliente
  - Implementar método `editCliente(id)` en clase Clientes
  - Hacer petición async con `useFetch()` para obtener datos del cliente (opc: 'getCliente')
  - Usar `createModalForm()` con autofill de datos obtenidos

  - Configurar título "Editar Cliente"
  - Usar mismos campos que formulario de agregar
  - Prellenar todos los campos con datos actuales del cliente
  - Prellenar campos de domicilio
  - Configurar data con opc: 'editCliente' e id del cliente
  - Implementar callback success que muestre alerta y actualice lista
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6_


- [ ] 11. Implementar cambio de estatus de cliente
  - Implementar método `statusCliente(id, active)` en clase Clientes
  - Usar `swalQuestion()` de Templates para confirmación
  - Configurar título dinámico según acción (activar/desactivar)
  - Configurar texto explicativo de la acción
  - Configurar icono "warning"
  - Configurar data con opc: 'statusCliente', id del cliente, y nuevo valor de active (invertir 1/0)
  - Implementar callback send que muestre alerta de éxito y actualice lista
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 9.4_


- [ ] 12. Implementar validaciones frontend
  - Agregar validación de campos obligatorios antes de enviar formulario
  - Agregar validación de formato de teléfono (mínimo 10 dígitos, solo números)
  - Agregar validación de formato de correo electrónico (regex)
  - Agregar validación de domicilio obligatorio
  - Mostrar alertas específicas con SweetAlert para cada tipo de error


  - Implementar validación en tiempo real con onkeyup para campos numéricos
  - _Requirements: 1.2, 1.3, 1.4, 9.1, 9.2_

- [ ] 13. Implementar manejo de respuestas y mensajes
  - Configurar callbacks success en todos los formularios
  - Mostrar alerta de éxito (status 200) con mensaje del servidor
  - Mostrar alerta de advertencia (status 409) para duplicados
  - Mostrar alerta de error (status 400) para validaciones fallidas
  - Mostrar alerta de error genérico para otros errores
  - Usar `alert()` de CoffeeSoft con iconos apropiados (success, warning, error, info)
  - Actualizar lista automáticamente después de operaciones exitosas
  - _Requirements: 1.7, 2.6, 3.5, 9.3, 9.4, 9.5_

- [ ] 14. Implementar integración con sistema de pedidos
  - Verificar que clientes activos estén disponibles para consulta desde módulo de pedidos
  - Asegurar que la estructura de datos sea compatible con el sistema existente
  - Documentar endpoint de consulta de clientes activos
  - Verificar que clientes inactivos no aparezcan en nuevos pedidos
  - Mantener relaciones con pedidos históricos al desactivar clientes
  - _Requirements: 8.1, 8.2, 8.3, 8.4_

- [ ] 15. Implementar diseño responsive
  - Verificar que la tabla se adapte correctamente a dispositivos móviles
  - Verificar que los formularios sean usables en pantallas pequeñas
  - Verificar que los filtros se reorganicen apropiadamente en móvil
  - Usar clases de TailwindCSS para responsive (col-12, col-md-3, etc.)
  - Probar en diferentes tamaños de pantalla (desktop, tablet, móvil)
  - _Requirements: 7.4_

- [ ]* 16. Crear pruebas de integración
  - Probar flujo completo: crear cliente → editar → desactivar → reactivar
  - Probar filtros: por UDN, por estatus, por tipo VIP, combinados
  - Probar validaciones: campos obligatorios, formatos, duplicados
  - Probar integración con pedidos: cliente activo disponible, inactivo no disponible
  - Verificar que badges VIP se muestren correctamente
  - Verificar que cambios de estatus se reflejen inmediatamente
  - _Requirements: Todos_

- [ ]* 17. Realizar pruebas de rendimiento
  - Medir tiempo de carga inicial del módulo
  - Medir tiempo de respuesta de filtros
  - Medir tiempo de guardado de nuevo cliente
  - Probar con volumen de datos realista (100+ clientes)
  - Verificar que paginación funcione correctamente con muchos registros
  - Optimizar consultas SQL si es necesario
  - _Requirements: 7.2_

- [ ]* 18. Documentar código y crear manual de usuario
  - Agregar comentarios en código JavaScript explicando métodos principales
  - Agregar comentarios en código PHP explicando validaciones
  - Documentar estructura de base de datos
  - Crear manual de usuario con capturas de pantalla
  - Documentar casos de uso principales
  - Documentar integración con sistema de pedidos
  - _Requirements: Todos_
