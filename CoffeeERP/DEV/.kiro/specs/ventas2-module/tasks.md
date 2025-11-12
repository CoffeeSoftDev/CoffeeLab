# Implementation Plan

- [x] 1. Crear estructura backend (Modelo y Controlador)

  - Crear archivo `mdl-ventas2.php` con clase que extienda CRUD
  - Implementar métodos de consulta: `listSales()`, `getSaleById()`, `lsUDN()`, `lsVentas()`
  - Implementar métodos de escritura: `createSale()`, `updateSale()`
  - Implementar validación: `existsSaleByDate()`
  - Configurar conexión a base de datos `rfwsmqex_ventas`
  - _Requirements: 1.4, 3.4, 4.4, 5.4, 6.2, 6.3_

- [x] 1.1 Crear modelo de datos (mdl-ventas2.php)


  - Implementar método `listSales()` con filtros por UDN, año, mes y tipo
  - Implementar método `getSaleById()` para obtener registro específico
  - Implementar método `lsUDN()` para obtener lista de unidades de negocio
  - Implementar método `lsVentas()` para obtener tipos de venta
  - Implementar método `createSale()` para insertar nuevos registros
  - Implementar método `updateSale()` para actualizar registros existentes
  - Implementar método `existsSaleByDate()` para validar duplicados
  - _Requirements: 1.4, 2.1, 3.4, 4.4, 5.4, 6.2_



- [ ] 1.2 Crear controlador (ctrl-ventas2.php)
  - Implementar método `init()` para cargar datos iniciales (UDN, tipos de venta)
  - Implementar método `lsSales()` para listar ventas con formato de tabla
  - Implementar método `getSale()` para obtener datos de una venta específica
  - Implementar método `addSale()` con validación de duplicados
  - Implementar método `editSale()` para actualizar ventas

  - Implementar método `statusSale()` para cambiar estado activo/inactivo
  - Crear funciones auxiliares: `dropdown()`, `renderStatus()`
  - _Requirements: 1.5, 2.2, 3.5, 4.5, 5.5, 6.1_

- [ ] 2. Implementar interfaz de consulta de ventas (Frontend)
  - Modificar clase `Sales` en `kpi-ventas.js`
  - Implementar método `render()` para inicializar el módulo
  - Implementar método `layout()` con `primaryLayout`


  - Implementar método `filterBar()` con selectores de UDN, Año, Mes
  - Conectar tab "Módulo ventas" con método de renderizado
  - _Requirements: 1.1, 1.2, 1.3, 6.1, 6.4_

- [ ] 2.1 Crear barra de filtros
  - Implementar selector de UDN con datos de `lsudn`

  - Implementar selector de Año (últimos 5 años)
  - Implementar selector de Mes (12 meses)
  - Configurar eventos `onchange` para actualizar tabla automáticamente
  - Establecer mes actual como valor por defecto
  - _Requirements: 1.3, 1.4, 6.5_

- [x] 2.2 Implementar tabla de ventas diarias

  - Implementar método `listSales()` usando `createTable()`
  - Configurar columnas: Fecha, Día, Estado, Clientes, Alimentos, Bebidas, Total
  - Aplicar formato de moneda con `formatPrice()`
  - Aplicar tema corporativo de CoffeeSoft
  - Configurar paginación (15 registros por página)
  - Agregar columna de acciones con dropdown
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 6.4, 6.7_

- [x] 3. Implementar funcionalidad de agregar ventas

  - Crear método `addSale()` en clase Sales
  - Implementar formulario modal con `createModalForm()`
  - Agregar botón "Subir Información" en barra de filtros
  - Configurar campos del formulario: UDN, Fecha, Clientes, Alimentos, Bebidas
  - Implementar validación de campos requeridos
  - Implementar callback de éxito para recargar tabla
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.7, 3.8, 6.4_


- [ ] 3.1 Crear formulario de captura
  - Implementar método `jsonSale()` con estructura de campos
  - Configurar campo UDN como select con datos de `lsudn`
  - Configurar campo Fecha como input type="date"
  - Configurar campo Clientes como input numérico
  - Configurar campos Alimentos y Bebidas con validación de números
  - Agregar botón submit "Guardar Venta"

  - _Requirements: 3.3, 3.4, 6.4_

- [ ] 3.2 Implementar validación y envío
  - Validar que todos los campos requeridos estén completos
  - Aplicar `validationInputForNumber()` en campos monetarios
  - Enviar datos al backend con `opc: "addSale"`
  - Mostrar mensaje de confirmación con `alert()`
  - Recargar tabla automáticamente después de inserción exitosa
  - Manejar errores de duplicados (status 409)

  - _Requirements: 3.4, 3.5, 3.6, 3.7, 3.8_

- [ ] 4. Implementar funcionalidad de edición
  - Crear método `editSale(id)` en clase Sales
  - Agregar botón de edición en dropdown de cada fila
  - Obtener datos del registro con petición al backend
  - Prellenar formulario modal con datos existentes usando `autofill`

  - Implementar actualización de registro
  - Recargar tabla después de edición exitosa
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.6, 4.7, 6.4_

- [ ] 4.1 Crear formulario de edición
  - Reutilizar método `jsonSale()` para estructura de campos

  - Configurar `autofill` con datos obtenidos del backend
  - Cambiar `opc` a "editSale" en datos del formulario
  - Incluir campo `id` oculto para identificar registro
  - Mantener mismas validaciones que formulario de agregar
  - _Requirements: 4.3, 4.4, 6.4_

- [ ] 4.2 Implementar actualización de datos
  - Enviar datos actualizados al backend con `opc: "editSale"`
  - Validar respuesta del servidor

  - Mostrar mensaje de confirmación
  - Recargar tabla con datos actualizados
  - Manejar errores de actualización
  - _Requirements: 4.4, 4.5, 4.6, 4.7_

- [x] 5. Implementar cambio de estado

  - Crear método `statusSale(id, active)` en clase Sales
  - Agregar botón de estado en dropdown de cada fila
  - Implementar diálogo de confirmación con `swalQuestion()`
  - Enviar petición de cambio de estado al backend
  - Actualizar tabla después de cambio exitoso


  - Mostrar mensaje de confirmación
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.6, 5.7, 6.4_

- [ ] 5.1 Crear diálogo de confirmación
  - Implementar `swalQuestion()` con título descriptivo
  - Indicar claramente la acción (activar/desactivar)
  - Configurar botones de confirmación y cancelación
  - Enviar datos con `opc: "statusSale"` y nuevo valor de `active`
  - _Requirements: 5.2, 5.3, 5.4, 6.4_

- [ ] 5.2 Actualizar estado en backend
  - Procesar cambio de estado en `venta_bitacora`
  - Actualizar campo `Stado` en `ventas_udn` si existe relación
  - Retornar respuesta con status y mensaje
  - Recargar tabla reflejando nuevo estado
  - _Requirements: 5.4, 5.5, 5.6, 5.7_

- [ ] 6. Integración y pruebas finales
  - Verificar integración con estructura existente de tabs
  - Probar flujo completo de consulta con filtros
  - Probar flujo completo de agregar venta
  - Probar flujo completo de editar venta
  - Probar flujo completo de cambiar estado
  - Verificar formato de moneda en todas las vistas
  - Verificar tema corporativo aplicado correctamente
  - _Requirements: 1.1, 2.1, 3.1, 4.1, 5.1, 6.1, 6.4, 6.7_

- [ ]* 6.1 Pruebas de integración
  - Verificar que el tab "Módulo ventas" active correctamente la vista
  - Probar que los filtros se carguen con datos correctos
  - Verificar que la tabla se actualice al cambiar filtros
  - Probar que los modales se abran y cierren correctamente
  - Verificar que las acciones del dropdown funcionen
  - _Requirements: 1.1, 1.2, 2.1, 3.1, 4.1, 5.1_

- [ ]* 6.2 Pruebas de validación
  - Probar validación de campos requeridos en formularios
  - Probar validación de duplicados (fecha + UDN)
  - Probar validación de formato de números
  - Verificar mensajes de error apropiados
  - Probar manejo de errores del servidor
  - _Requirements: 3.4, 3.5, 4.4_

- [ ]* 6.3 Pruebas de UI/UX
  - Verificar responsive design en diferentes tamaños de pantalla
  - Probar que los colores corporativos se apliquen correctamente
  - Verificar que los badges de estado sean visibles
  - Probar que el formato de moneda sea consistente
  - Verificar que los tooltips e iconos sean descriptivos
  - _Requirements: 2.3, 2.4, 6.7_
