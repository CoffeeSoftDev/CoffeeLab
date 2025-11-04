# Implementation Plan: Calendario de Pedidos Integrado

- [x] 1. Crear estructura de directorios y archivos base


  - Crear el directorio `pedidos/calendario/` con subdirectorios `ctrl/`, `mdl/`, y `src/js/`, `src/css/`
  - Crear archivo `pedidos/calendario/index.php` con estructura HTML básica
  - Crear archivo `pedidos/calendario/ctrl/ctrl-calendario.php` con clase `CalendarioPedidos`
  - Crear archivo `pedidos/calendario/mdl/mdl-calendario.php` con clase `MCalendarioPedidos`
  - Crear archivo `pedidos/calendario/src/js/app-calendario.js` para inicialización
  - Crear archivo `pedidos/calendario/src/js/calendario-pedidos.js` para lógica del calendario
  - Crear archivo `pedidos/calendario/src/css/calendario.css` para estilos personalizados
  - _Requirements: 1.1, 2.1, 8.1_

- [ ] 2. Implementar página principal del calendario
  - Configurar `pedidos/calendario/index.php` con inclusión de librerías necesarias (FullCalendar, jQuery, Moment.js)
  - Agregar referencias a archivos CSS de FullCalendar y estilos personalizados
  - Incluir navbar y sidebar del layout existente
  - Crear contenedor principal para el calendario con ID `pedidos-calendar`
  - Agregar scripts de inicialización al final del documento
  - _Requirements: 2.1, 2.5_

- [ ] 3. Implementar controlador del calendario
  - En `ctrl-calendario.php`, crear clase `CalendarioPedidos` que extienda de `Pedidos`
  - Implementar método `getCalendarioData()` que obtenga pedidos usando `listOrders()`
  - Transformar datos de pedidos al formato de eventos de FullCalendar (id, title, start, backgroundColor, extendedProps)
  - Aplicar colores según estado: Cotización (#1E90FF), Pagado (#8CC63F), Pendiente (#FFCC00), Cancelado (#FF3B30)
  - Agregar ícono de motocicleta en el título si `delivery_type` indica envío a domicilio
  - Implementar método `getOrderDetail()` que reutilice `getOrderDetails()` del padre
  - Manejar errores y retornar respuestas JSON con estructura estándar (status, message, data)
  - _Requirements: 2.2, 2.3, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 4.1, 4.2, 8.2, 8.3_

- [ ] 4. Implementar modelo del calendario
  - En `mdl-calendario.php`, crear clase `MCalendarioPedidos` que extienda de `MPedidos`
  - Heredar todos los métodos de `MPedidos` sin agregar métodos adicionales en esta fase
  - Documentar que la clase está preparada para extensiones futuras
  - _Requirements: 8.1, 8.2_

- [ ] 5. Implementar inicialización del calendario en JavaScript
  - En `app-calendario.js`, crear instancia de clase `CalendarioPedidos`
  - Configurar variables globales necesarias (link al controlador, div del módulo)
  - Llamar al método `init()` al cargar el documento
  - _Requirements: 2.1_

- [ ] 6. Implementar clase CalendarioPedidos en JavaScript
  - En `calendario-pedidos.js`, crear clase `CalendarioPedidos`
  - Implementar método `init()` que configure el layout y cree el calendario
  - Implementar método `createCalendar()` que inicialice FullCalendar con configuración en español
  - Configurar `initialView: 'dayGridMonth'` y `locale: 'es'`
  - Configurar `headerToolbar` con botones prev, next, today y opciones de vista (mes, semana, día)
  - Implementar función `events` que cargue datos mediante AJAX desde `getCalendarioData()`
  - Implementar `eventContent` para renderizar contenido personalizado (folio, cliente, ícono de motocicleta)
  - Implementar `eventClick` para abrir modal de detalle al hacer clic en un evento
  - Aplicar estilos personalizados al día actual y bordes de celdas
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 3.1, 3.2, 4.1, 4.2, 4.3, 5.1, 7.1, 7.2, 7.3, 7.4, 7.5_

- [ ] 7. Implementar modal de detalle del pedido
  - Crear estructura HTML del modal en `index.php` con secciones para folio, cliente, productos, total, estado, tipo de entrega y notas
  - Implementar función JavaScript `showOrderDetail(orderId)` que cargue datos mediante AJAX
  - Mostrar información del pedido en el modal con formato adecuado
  - Aplicar color de estado correspondiente en el modal
  - Implementar botón de cierre y funcionalidad de cerrar al hacer clic fuera del modal
  - Mantener la vista del calendario sin cambios al cerrar el modal
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [ ] 8. Implementar sistema de filtros para el calendario
  - Agregar barra de filtros en `index.php` con campos de fecha inicio, fecha fin y selector de estado
  - Implementar función JavaScript `applyFilters()` que recargue eventos del calendario con filtros aplicados
  - Pasar parámetros de filtro (fi, ff, status) en la petición AJAX a `getCalendarioData()`
  - Actualizar calendario sin recargar la página completa usando `refetchEvents()`
  - Implementar función `clearFilters()` para limpiar filtros y mostrar todos los pedidos
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [ ] 9. Implementar navegación temporal del calendario
  - Verificar que los botones de navegación de FullCalendar (prev, next, today) estén configurados
  - Implementar lógica para actualizar el título del calendario con el período visible
  - Asegurar que la navegación funcione correctamente en vistas de mes, semana y día
  - Implementar resaltado visual del día actual
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [ ] 10. Agregar botones de alternancia de vista en pedidos/index.php
  - Modificar `pedidos/index.php` para agregar botones "Lista" y "Calendario" en la barra superior
  - Crear contenedor `<div id="pedidos-calendar-container">` oculto por defecto
  - Implementar función JavaScript `toggleView(view)` que muestre/oculte tabla o calendario
  - Mantener filtros aplicados al cambiar entre vistas
  - Actualizar clase "active" en el botón correspondiente
  - Agregar estilos CSS para los botones de alternancia
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [ ] 11. Implementar manejo de errores en frontend
  - Agregar try-catch en funciones AJAX de carga de eventos
  - Mostrar mensaje de error en el calendario si falla la carga de eventos
  - Implementar botón "Reintentar" en caso de error
  - Mostrar notificación con SweetAlert2 si falla la carga de detalle del pedido
  - Detectar timeout de AJAX y mostrar mensaje amigable
  - Agregar logs de error en consola para debugging
  - _Requirements: Todos (manejo de errores transversal)_

- [ ] 12. Implementar manejo de errores en backend
  - Agregar validación de parámetros en `getCalendarioData()` (fi, ff, status)
  - Retornar respuesta con status 400 si los parámetros son inválidos
  - Agregar try-catch en consultas de base de datos
  - Retornar respuesta con status 500 si hay error en la consulta
  - Retornar respuesta con status 404 si no se encuentra un pedido en `getOrderDetail()`
  - Validar sesión activa y permisos de sucursal antes de procesar peticiones
  - _Requirements: Todos (manejo de errores transversal)_

- [ ] 13. Implementar estilos personalizados del calendario
  - En `calendario.css`, definir estilos para eventos según estado (colores de fondo y borde)
  - Estilizar el día actual con color de fondo distintivo
  - Ajustar estilos de bordes de celdas del calendario
  - Estilizar el modal de detalle del pedido
  - Agregar estilos responsivos para dispositivos móviles
  - Estilizar botones de alternancia de vista
  - Agregar estilos para el ícono de motocicleta en eventos
  - _Requirements: 2.5, 3.3, 3.4, 3.5, 3.6, 3.7, 4.1, 4.2_

- [ ] 14. Integrar calendario con sistema de sesiones y permisos
  - Verificar que `session_start()` esté presente en `ctrl-calendario.php`
  - Validar `$_SESSION['SUB']` para filtrar pedidos por sucursal del usuario
  - Agregar validación de permisos antes de retornar datos de pedidos
  - Restringir acceso a pedidos de otras sucursales
  - _Requirements: 8.1, 8.4_

- [ ] 15. Optimizar rendimiento del calendario
  - Implementar carga de eventos solo para el rango de fechas visible en el calendario
  - Agregar caché de eventos en el frontend para evitar peticiones repetidas
  - Invalidar caché al aplicar filtros o cambiar de mes
  - Optimizar query de `getOrders()` si es necesario (verificar índices en date_order y status)
  - Limitar cantidad de eventos cargados si hay más de 100 pedidos en un mes
  - _Requirements: 2.2, 6.4_

- [ ] 16. Realizar pruebas de integración
  - Probar carga del calendario con pedidos existentes en diferentes estados
  - Probar filtrado por estado (Cotización, Pagado, Pendiente, Cancelado)
  - Probar filtrado por rango de fechas
  - Probar alternancia entre vista lista y vista calendario manteniendo filtros
  - Probar apertura de modal de detalle desde eventos del calendario
  - Probar navegación entre meses, semanas y días
  - Probar visualización de múltiples pedidos en un mismo día
  - Verificar que el ícono de motocicleta aparezca solo en pedidos con envío a domicilio
  - Verificar que los colores de estado sean correctos en todos los eventos
  - Probar responsividad en diferentes tamaños de pantalla (desktop, tablet, móvil)
  - _Requirements: Todos_

- [ ] 17. Documentar el módulo
  - Crear archivo README.md en `pedidos/calendario/` con descripción del módulo
  - Documentar estructura de archivos y responsabilidades
  - Documentar formato de datos esperado por el calendario
  - Agregar ejemplos de uso de las funciones principales
  - Documentar configuración de FullCalendar utilizada
  - Agregar notas sobre mantenimiento y extensiones futuras
  - _Requirements: Todos (documentación transversal)_
