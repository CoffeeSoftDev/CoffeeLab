# Implementation Plan

- [x] 1. Configurar estructura base del proyecto



  - Crear carpeta `calendario-pedidos/` en el directorio `dev/`
  - Crear archivo `index.php` con estructura HTML base y contenedor `<div id="root"></div>`
  - Crear carpetas `ctrl/`, `mdl/` y `js/` dentro del proyecto
  - Incluir librerías necesarias: jQuery, Moment.js, FullCalendar, CoffeeSoft
  - _Requirements: 1.1, 1.2_

- [ ] 2. Implementar modelo de datos (mdl-calendarioPedidos.php)
- [ ] 2.1 Crear clase base del modelo
  - Crear archivo `mdl/mdl-calendarioPedidos.php`
  - Extender clase `CRUD` y configurar propiedades `$bd` y `$util`
  - Requerir archivos `_CRUD.php` y `_Utileria.php`
  - _Requirements: 1.1_

- [ ] 2.2 Implementar método listOrdersByDate()
  - Crear consulta SQL con `_Select` para obtener pedidos por rango de fechas
  - Incluir campos: id, folio, name, phone, date_order, time_order, status, total_pay, subsidiaries_id
  - Aplicar filtros: fecha inicial, fecha final, sucursal (opcional)
  - Usar LEFT JOIN con tabla de estados para obtener nombre del estado
  - Ordenar por fecha y hora de entrega
  - _Requirements: 1.1, 1.2, 4.1, 4.2_

- [ ] 2.3 Implementar métodos auxiliares para filtros
  - Crear método `lsUDN()` para obtener lista de sucursales
  - Crear método `lsStatus()` para obtener lista de estados
  - _Requirements: 4.1, 4.2_

- [ ] 3. Implementar controlador (ctrl-calendarioPedidos.php)
- [ ] 3.1 Crear clase base del controlador
  - Crear archivo `ctrl/ctrl-calendarioPedidos.php`
  - Extender clase `mdl` (modelo)
  - Configurar session_start() y validación de $_POST['opc']
  - _Requirements: 1.1_

- [ ] 3.2 Implementar método init()
  - Llamar a `lsUDN()` y `lsStatus()` del modelo
  - Retornar array con listas para filtros
  - _Requirements: 4.1, 4.2_

- [ ] 3.3 Implementar método getOrders()
  - Recibir parámetros: fi (fecha inicial), ff (fecha final), udn (opcional)
  - Validar que las fechas sean válidas y fi <= ff
  - Llamar a `listOrdersByDate()` del modelo
  - Transformar resultados al formato de FullCalendar
  - Aplicar colores según estado del pedido
  - Retornar JSON con array de eventos
  - _Requirements: 1.1, 1.2, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 4.1, 4.2, 4.3_

- [ ] 3.4 Implementar función auxiliar getEventColor()
  - Mapear estado_id a color correspondiente
  - Retornar código de color hexadecimal
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6_

- [ ] 4. Implementar frontend JavaScript (calendarioPedidos.js)
- [ ] 4.1 Crear clase CalendarApp
  - Crear archivo `js/calendarioPedidos.js`
  - Definir clase `CalendarApp` que extienda `Templates`
  - Configurar constructor con `PROJECT_NAME = "CalendarioPedidos"`
  - Inicializar propiedad `calendar` como null
  - _Requirements: 1.1_

- [ ] 4.2 Implementar método render()
  - Llamar a `layout()` para crear estructura HTML
  - Llamar a `filterBar()` para crear barra de filtros
  - Llamar a `initCalendar()` para inicializar FullCalendar
  - _Requirements: 1.1, 1.3_

- [ ] 4.3 Implementar método layout()
  - Usar `primaryLayout()` de CoffeeSoft para crear estructura
  - Crear contenedor para filtros con id `filterBarCalendarioPedidos`
  - Crear contenedor para calendario con id `containerCalendarioPedidos`
  - Aplicar estilos con tema oscuro (bg-[#1F2A37])
  - _Requirements: 1.1, 5.1, 5.2, 5.3, 5.4_

- [ ] 4.4 Implementar método filterBar()
  - Usar `createfilterBar()` de CoffeeSoft
  - Agregar input de calendario con `dataPicker()` para rango de fechas
  - Agregar select para filtro de sucursal
  - Configurar evento onChange para recargar eventos
  - Establecer rango por defecto: mes actual
  - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [ ] 4.5 Implementar método initCalendar()
  - Configurar FullCalendar con opciones:
    - initialView: 'dayGridMonth'
    - locale: 'es'
    - headerToolbar con navegación y vistas
    - events: función para carga dinámica
    - eventClick: manejador de clicks
    - eventContent: renderizado personalizado
    - eventDidMount: tooltips con información adicional
  - Aplicar estilos personalizados para tema oscuro
  - Renderizar calendario en contenedor
  - _Requirements: 1.1, 1.2, 1.3, 5.1, 5.2, 5.3, 5.4, 6.1, 6.2, 6.3, 6.4_

- [ ] 4.6 Implementar método loadEvents()
  - Obtener valores de filtros (fechas, sucursal)
  - Hacer petición con `useFetch()` a controlador
  - Pasar parámetros: opc: 'getOrders', fi, ff, udn
  - Manejar respuesta exitosa y errores
  - Retornar array de eventos para FullCalendar
  - _Requirements: 1.1, 1.2, 4.1, 4.2, 4.3_

- [ ] 4.7 Implementar método handleEventClick()
  - Extraer ID del pedido del evento clickeado
  - Verificar existencia de función `app.showOrder()` en contexto global
  - Ejecutar `app.showOrder(id)` si existe
  - Implementar fallback de redirección si no existe
  - _Requirements: 3.1, 3.2, 3.3_

- [ ] 4.8 Implementar renderizado personalizado de eventos
  - Crear función `eventContent` para FullCalendar
  - Mostrar folio del pedido
  - Mostrar nombre del cliente (truncado si es necesario)
  - Mostrar hora de entrega
  - Aplicar estilos responsivos
  - _Requirements: 6.1, 6.2, 6.3, 6.4_

- [ ] 4.9 Implementar tooltips para eventos
  - Crear función `eventDidMount` para FullCalendar
  - Configurar tooltip con jQuery
  - Mostrar información completa: folio, cliente, teléfono, total
  - Aplicar formato de moneda con `formatPrice()`
  - _Requirements: 6.4_

- [ ] 5. Implementar estilos CSS personalizados
  - Crear estilos para tema oscuro de FullCalendar
  - Personalizar botones de navegación con colores corporativos
  - Aplicar estilos a eventos (hover, cursor pointer)
  - Implementar media queries para responsividad
  - Ajustar tamaños de fuente para diferentes dispositivos
  - _Requirements: 5.1, 5.2, 5.3, 5.4_

- [ ] 6. Integrar con módulo de pedidos existente
  - Verificar que `app.showOrder(id)` esté disponible globalmente
  - Probar integración con modal de detalle de pedido
  - Asegurar que el calendario mantiene su estado después de cerrar el detalle
  - _Requirements: 3.1, 3.2, 3.3_

- [ ] 7. Implementar manejo de errores
  - Agregar try-catch en `loadEvents()`
  - Mostrar alertas con `alert()` de CoffeeSoft en caso de error
  - Validar respuestas del servidor
  - Manejar casos de conexión fallida
  - _Requirements: 1.1, 1.2_

- [ ] 8. Optimizar rendimiento
  - Implementar carga lazy de eventos (solo mes visible)
  - Cachear eventos ya cargados
  - Invalidar caché al aplicar filtros
  - Agregar índices en columnas date_order y subsidiaries_id en base de datos
  - _Requirements: 1.1, 1.2, 1.3_

- [ ] 9. Configurar inicialización del módulo
  - Crear bloque `$(async () => {})` en calendarioPedidos.js
  - Instanciar `CalendarApp` con API y contenedor root
  - Llamar a `render()` para inicializar
  - _Requirements: 1.1_

- [ ] 10. Integrar navegación entre módulos
  - Agregar botón "Ver Listado" en filterBar para volver a pedidos.php
  - Agregar botón "Calendario" en módulo de pedidos para acceder al calendario
  - Configurar redirecciones correctas
  - _Requirements: 1.1_

- [ ] 11. Documentación y pruebas finales
  - Documentar uso del módulo en README
  - Probar carga de calendario con diferentes rangos de fechas
  - Probar filtros de sucursal
  - Verificar colores según estados
  - Probar click en eventos y visualización de detalle
  - Verificar responsividad en móvil, tablet y escritorio
  - Validar tooltips y información mostrada
  - _Requirements: 1.1, 1.2, 1.3, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 3.1, 3.2, 3.3, 4.1, 4.2, 4.3, 4.4, 5.1, 5.2, 5.3, 5.4, 6.1, 6.2, 6.3, 6.4_
