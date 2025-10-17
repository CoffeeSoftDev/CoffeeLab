# Implementation Plan - Sistema de Administración de Pedidos

## Task List

- [x] 1. Configurar estructura base del proyecto



  - Crear estructura de carpetas (ctrl, mdl, js, src)
  - Crear archivo index.php con contenedor root
  - Configurar imports de scripts y estilos





  - _Requirements: 1.1, 2.1, 3.1, 4.1, 5.1, 6.1, 7.1, 8.1, 9.1, 10.1, 11.1, 12.1_

- [x] 2. Implementar modelo de datos (mdl-pedidos.php)

  - [ ] 2.1 Crear clase mdl extendiendo CRUD
    - Configurar propiedades $bd y $util
    - Implementar constructor con inicialización
    - _Requirements: 1.1, 2.1_
  

  - [ ] 2.2 Implementar métodos de consulta de pedidos
    - Método listPedidos() con filtros de fecha y UDN
    - Método getPedidoById() para obtener pedido específico
    - Método listPedidosByCliente() para historial de cliente
    - _Requirements: 1.1, 2.1, 2.2, 2.3_

  
  - [ ] 2.3 Implementar métodos CRUD de pedidos
    - Método createPedido() para insertar nuevo pedido
    - Método updatePedido() para actualizar pedido existente
    - Método validatePedidoAge() para validar regla de 7 días
    - _Requirements: 1.3, 3.1, 3.2, 3.3_

  
  - [ ] 2.4 Implementar métodos de filtros y selects
    - Método lsUDN() para listar unidades de negocio
    - Método lsCanales() para listar canales activos




    - Método lsProductos() para listar productos activos
    - Método lsCampanas() para listar campañas activas
    - _Requirements: 1.2, 8.1, 9.1, 10.1_
  

  - [ ] 2.5 Implementar métodos de métricas y reportes
    - Método getDashboardMetrics() para KPIs principales
    - Método getMonthlyReport() para reporte mensual
    - Método getAnnualReport() para reporte anual por canal
    - Método getChannelPerformance() para rendimiento de canales
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 7.1, 7.2, 7.3_


- [ ] 3. Implementar controlador de pedidos (ctrl-pedidos.php)
  - [ ] 3.1 Crear clase ctrl extendiendo mdl
    - Configurar headers CORS
    - Implementar método init() para filtros iniciales
    - _Requirements: 1.1, 2.1_
  

  - [ ] 3.2 Implementar método ls() para listar pedidos
    - Recibir parámetros de filtros (fecha, UDN, canal, etc.)
    - Construir array de filas con formato para tabla
    - Incluir dropdown de acciones según estado
    - Retornar JSON con row y thead

    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6_
  
  - [ ] 3.3 Implementar método addPedido()
    - Validar campos requeridos
    - Agregar fecha_creacion, user_id, udn_id automáticamente
    - Validar que no exista pedido duplicado para la fecha

    - Llamar a createPedido() del modelo
    - Retornar status y message
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 1.10, 1.11, 1.12, 1.13_
  
  - [x] 3.4 Implementar método getPedido()

    - Recibir id del pedido
    - Llamar a getPedidoById() del modelo
    - Retornar status, message y data
    - _Requirements: 2.5, 3.1_
  
  - [x] 3.5 Implementar método editPedido()

    - Validar que el pedido tenga menos de 7 días
    - Validar campos requeridos
    - Llamar a updatePedido() del modelo
    - Retornar status y message con validación de edad
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7_
  

  - [ ] 3.6 Implementar método statusPedido()
    - Recibir id y nuevo estado
    - Actualizar campo active
    - Retornar status y message
    - _Requirements: 3.6, 3.7_
  

  - [ ] 3.7 Implementar método verifyTransfer()
    - Validar que modalidad de pago sea transferencia
    - Agregar fecha_verificacion y usuario_verificacion
    - Actualizar pago_verificado a 1
    - Retornar status y message
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7_

  
  - [ ] 3.8 Implementar método registerArrival()
    - Validar que el producto sea tipo servicio



    - Agregar fecha_llegada
    - Actualizar llego_establecimiento
    - Retornar status y message
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7_
  
  - [x] 3.9 Implementar método apiDashboardMetrics()



    - Recibir filtros (UDN, mes, año)
    - Llamar a getDashboardMetrics() del modelo
    - Formatear datos para gráficos
    - Retornar JSON con dashboard, trendData, monthlyComparative
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 6.8, 6.9_
  
  - [x] 3.10 Implementar método apiAnnualReport()



    - Recibir filtros (UDN, año)
    - Llamar a getAnnualReport() del modelo
    - Construir array de filas con meses como columnas
    - Retornar JSON con row
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7_
  
  - [x] 3.11 Implementar funciones auxiliares

    - Función dropdown() para generar opciones de acciones
    - Función renderStatus() para badges de estado
    - Función formatSpanishDate() para formato de fechas
    - _Requirements: 2.1, 2.3, 2.4_

- [x] 4. Implementar modelo de productos (mdl-productos.php)




  - [ ] 4.1 Crear clase mdl con métodos CRUD
    - Método listProductos() con filtros
    - Método getProductoById()
    - Método createProducto()
    - Método updateProducto()
    - Método existsProductoByName() para validación
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7_


- [ ] 5. Implementar controlador de productos (ctrl-productos.php)
  - [ ] 5.1 Implementar métodos del controlador
    - Método init() para filtros
    - Método ls() para listar productos
    - Método addProducto() con validación de unicidad
    - Método getProducto()




    - Método editProducto()
    - Método statusProducto()
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7_

- [x] 6. Implementar modelo de canales (mdl-canales.php)

  - [ ] 6.1 Crear clase mdl con métodos CRUD
    - Método listCanales() con filtros
    - Método getCanalById()
    - Método createCanal()
    - Método updateCanal()
    - Método existsCanalByName() para validación

    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7_
  
  - [ ] 6.2 Implementar métodos de campañas
    - Método listCampanas() con filtros
    - Método getCampanaById()
    - Método createCampana()

    - Método updateCampana()
    - Método getCampanaPerformance() para métricas
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7_

- [ ] 7. Implementar controlador de canales (ctrl-canales.php)
  - [ ] 7.1 Implementar métodos de canales
    - Método init() para filtros

    - Método lsCanales()
    - Método addCanal() con validación
    - Método getCanal()
    - Método editCanal()




    - Método statusCanal()
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7_
  
  - [ ] 7.2 Implementar métodos de campañas
    - Método lsCampanas()
    - Método addCampana() con validación de fechas

    - Método getCampana()
    - Método editCampana()
    - Método statusCampana()
    - Método apiCampanaPerformance() para métricas
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7_


- [ ] 8. Implementar módulo frontend Dashboard (dashboard.js)
  - [ ] 8.1 Crear clase Dashboard extendiendo Templates
    - Configurar constructor con PROJECT_NAME
    - Implementar método render()
    - Implementar método layout() con primaryLayout
    - _Requirements: 6.1, 6.8_
  

  - [ ] 8.2 Implementar barra de filtros del dashboard
    - Método filterBar() con createfilterBar
    - Filtros: UDN, mes, año
    - Integrar dataPicker para rango de fechas
    - Evento onChange para recargar métricas
    - _Requirements: 6.8, 6.9_
  
  - [ ] 8.3 Implementar visualización de KPIs
    - Método showKPIs() usando infoCard

    - Tarjetas: Total pedidos, Ingresos totales, Cheque promedio, % de ventas
    - Formato de moneda con evaluar()
    - Colores corporativos CoffeeSoft
    - _Requirements: 6.1, 6.2, 6.3, 6.4_
  
  - [ ] 8.4 Implementar gráficos del dashboard
    - Método renderCharts() para contenedor de gráficos

    - Gráfico de barras: Pedidos por canal (barChart)
    - Gráfico de línea: Tendencia mensual (linearChart)
    - Gráfico comparativo: Año actual vs anterior
    - Integración con Chart.js
    - _Requirements: 6.5, 6.6, 6.7_
  

  - [ ] 8.5 Implementar carga de métricas
    - Método loadMetrics() con useFetch
    - Llamada a apiDashboardMetrics del backend
    - Actualización dinámica de KPIs y gráficos
    - Manejo de errores
    - _Requirements: 6.8, 6.9_


- [ ] 9. Implementar módulo frontend Pedidos (pedidos.js)
  - [ ] 9.1 Crear clase Pedidos extendiendo Templates
    - Configurar constructor con PROJECT_NAME
    - Implementar método render()
    - Implementar método layout() con tabLayout

    - Tabs: Captura, Listado, Historial
    - _Requirements: 1.1, 2.1, 7.1_
  
  - [x] 9.2 Implementar barra de filtros de pedidos



    - Método filterBar() con createfilterBar
    - Filtros: UDN, fecha, canal, cliente, monto, modalidad, campaña
    - Integrar dataPicker para rango de fechas
    - Botón de exportar
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

  
  - [ ] 9.3 Implementar listado de pedidos
    - Método lsPedidos() usando createTable
    - Configurar DataTables con paginación
    - Columnas: Fecha, Cliente, Teléfono, Canal, Monto, Estado pago, Estado llegada, Campaña, Acciones

    - Formato de moneda y fechas
    - Dropdown de acciones según estado
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7_
  
  - [x] 9.4 Implementar formulario de captura de pedidos

    - Método addPedido() usando createModalForm
    - Método jsonPedido() con estructura del formulario
    - Sección "Información del cliente": nombre, teléfono, email, cumpleaños
    - Sección "Datos del pedido": fecha, hora, canal, monto, modalidad, envío
    - Checkbox y select para campaña
    - Textarea para notas

    - Validaciones frontend
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 1.10, 1.11, 1.12, 1.13, 1.14, 1.15_
  
  - [ ] 9.5 Implementar edición de pedidos
    - Método editPedido(id) con useFetch para obtener datos

    - Usar createModalForm con autofill
    - Validar edad del pedido (7 días)
    - Deshabilitar edición si excede límite
    - Mostrar mensaje de error si no se puede editar




    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7_
  
  - [ ] 9.6 Implementar verificación de transferencias
    - Método verifyTransfer(id) con swalQuestion
    - Validar que modalidad sea transferencia
    - Actualizar estado de pago

    - Mostrar indicador visual de transferencias pendientes
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7_
  
  - [ ] 9.7 Implementar registro de llegadas
    - Método registerArrival(id) con modal de confirmación
    - Opciones: Llegó, No llegó, Pendiente
    - Validar que sea tipo servicio

    - Actualizar estado de llegada
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7_
  
  - [ ] 9.8 Implementar cancelación de pedidos
    - Método cancelPedido(id) con swalQuestion
    - Confirmación con folio del pedido
    - Cambiar estado a inactivo
    - Registrar usuario y fecha de cancelación

    - _Requirements: 3.6, 3.7_
  
  - [ ] 9.9 Implementar exportación de reportes
    - Método exportTable() para exportar tabla actual
    - Formatos: CSV y Excel
    - Incluir filtros aplicados
    - Descarga automática del archivo
    - _Requirements: 2.4, 12.1, 12.2, 12.3, 12.4, 12.5, 12.6, 12.7_

- [ ] 10. Implementar módulo frontend Productos (productos.js)
  - [ ] 10.1 Crear clase Productos extendiendo Templates
    - Configurar constructor con PROJECT_NAME
    - Implementar método render()
    - Implementar método layout() con primaryLayout
    - _Requirements: 8.1_
  
  - [ ] 10.2 Implementar barra de filtros de productos
    - Método filterBar() con createfilterBar
    - Filtros: UDN, estado (activo/inactivo)
    - Botón "Nuevo Producto"
    - _Requirements: 8.5_
  
  - [ ] 10.3 Implementar listado de productos
    - Método lsProductos() usando createTable
    - Columnas: Nombre, Descripción, Precio, Tipo, UDN, Estado, Acciones
    - Botones de editar y cambiar estado
    - _Requirements: 8.5, 8.6_
  
  - [ ] 10.4 Implementar formulario de productos
    - Método addProducto() usando createModalForm
    - Método jsonProducto() con campos del formulario
    - Campos: nombre, descripción, precio, tipo (producto/servicio), UDN
    - Validación de unicidad de nombre
    - _Requirements: 8.1, 8.2, 8.3_
  
  - [ ] 10.5 Implementar edición de productos
    - Método editProducto(id) con useFetch
    - Usar createModalForm con autofill
    - Validar que no existan pedidos asociados antes de cambios críticos
    - _Requirements: 8.3, 8.6_
  
  - [ ] 10.6 Implementar cambio de estado de productos
    - Método statusProducto(id, active) con swalQuestion
    - Validar que no tenga pedidos activos
    - Actualizar estado sin eliminar físicamente
    - _Requirements: 8.4, 8.6_

- [ ] 11. Implementar módulo frontend Canales (canales.js)
  - [ ] 11.1 Crear clase Canales extendiendo Templates
    - Configurar constructor con PROJECT_NAME
    - Implementar método render()
    - Implementar método layout() con tabLayout
    - Tabs: Canales, Campañas
    - _Requirements: 9.1, 10.1_
  
  - [ ] 11.2 Implementar gestión de canales
    - Método lsCanales() usando createTable
    - Método addCanal() con formulario modal
    - Método editCanal(id) con autofill
    - Método statusCanal(id, active)
    - Campos: nombre, icono, color
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7_
  
  - [ ] 11.3 Implementar gestión de campañas
    - Método lsCampanas() usando createTable
    - Método addCampana() con formulario modal
    - Método editCampana(id) con autofill
    - Método statusCampana(id, active)
    - Campos: nombre, estrategia, fechas, presupuesto, clics, canal, UDN
    - Validación de fechas lógicas
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_
  
  - [ ] 11.4 Implementar métricas de campañas
    - Método showCampanaPerformance(id)
    - Métricas: Pedidos generados, Ingresos, ROI, Clics
    - Gráfico de rendimiento
    - Ranking de campañas más efectivas
    - _Requirements: 10.5, 10.6, 10.7_

- [ ] 12. Implementar control de accesos y seguridad
  - [ ] 12.1 Implementar validación de sesión
    - Verificar sesión activa en cada petición
    - Timeout automático después de 30 minutos
    - Redirección a login si no hay sesión
    - _Requirements: 11.1, 11.6_
  
  - [ ] 12.2 Implementar control de permisos por rol
    - Validar rol en cada operación del backend
    - Jefe: acceso completo
    - Auxiliar: solo captura y visualización
    - Tesorería: solo verificación de pagos y visualización
    - Retornar error 403 si no tiene permisos
    - _Requirements: 11.2, 11.3, 11.4, 11.5, 11.6_
  
  - [ ] 12.3 Implementar auditoría de acciones
    - Registrar todas las operaciones CRUD
    - Guardar usuario, fecha, hora, acción
    - Tabla de logs en base de datos
    - _Requirements: 11.5, 11.7_
  
  - [ ] 12.4 Implementar validaciones de seguridad
    - Sanitización de inputs con $this->util->sql()
    - Prevención de SQL injection (prepared statements)
    - Prevención de XSS (escape de outputs)
    - Validación de CSRF tokens
    - _Requirements: 11.1, 11.2, 11.3, 11.4_

- [ ] 13. Implementar exportación de reportes
  - [ ] 13.1 Implementar exportación de tabla de pedidos
    - Método exportPedidos() en backend
    - Generar archivo CSV con todas las columnas
    - Generar archivo Excel con formato
    - Incluir filtros aplicados en el nombre del archivo
    - _Requirements: 12.1, 12.3, 12.4, 12.5_
  
  - [ ] 13.2 Implementar exportación de reporte mensual
    - Método exportMonthlyReport() en backend
    - Formato Excel con columnas por mes
    - Incluir totales y promedios
    - _Requirements: 12.2, 12.3, 12.4, 12.5_
  
  - [ ] 13.3 Implementar exportación de reporte anual
    - Método exportAnnualReport() en backend
    - Formato Excel con comparativa anual
    - Incluir gráficos embebidos
    - _Requirements: 12.2, 12.3, 12.4, 12.5_
  
  - [ ] 13.4 Implementar descarga de archivos
    - Método downloadFile() en frontend
    - Generar link de descarga temporal
    - Limpiar archivos temporales después de descarga
    - _Requirements: 12.6, 12.7_

- [ ] 14. Integración y pruebas del sistema completo
  - [ ] 14.1 Integrar todos los módulos en index.php
    - Importar todos los scripts JS
    - Configurar navegación entre módulos
    - Implementar navbar con CoffeeSoft
    - Implementar sidebar con menú de módulos
    - _Requirements: 1.1, 2.1, 6.1, 8.1, 9.1, 10.1_
  
  - [ ] 14.2 Configurar estilos y tema corporativo
    - Aplicar paleta de colores CoffeeSoft
    - Configurar TailwindCSS
    - Asegurar diseño responsive
    - _Requirements: 1.1, 2.1, 6.1, 8.1, 9.1, 10.1_
  
  - [ ]* 14.3 Realizar pruebas de integración
    - Probar flujo completo de captura de pedido
    - Probar edición dentro y fuera de 7 días
    - Probar verificación de transferencias
    - Probar registro de llegadas
    - Probar filtros y búsquedas
    - Probar exportación de reportes
    - Probar dashboard con datos reales
    - _Requirements: 1.1-1.15, 2.1-2.7, 3.1-3.7, 4.1-4.7, 5.1-5.7, 6.1-6.9, 7.1-7.7_
  
  - [ ]* 14.4 Realizar pruebas de control de accesos
    - Probar acceso con rol Jefe (completo)
    - Probar acceso con rol Auxiliar (limitado)
    - Probar acceso con rol Tesorería (limitado)
    - Probar timeout de sesión
    - _Requirements: 11.1-11.7_
  
  - [ ]* 14.5 Realizar pruebas de rendimiento
    - Probar carga de tabla con 1000+ registros
    - Probar generación de reportes grandes
    - Probar carga de dashboard con múltiples gráficos
    - Optimizar consultas lentas
    - _Requirements: 2.1, 6.1, 7.1, 12.1, 12.2_
  
  - [ ]* 14.6 Realizar pruebas de validación
    - Probar validaciones de formularios
    - Probar validaciones de reglas de negocio
    - Probar manejo de errores
    - Probar mensajes de confirmación
    - _Requirements: 1.1-1.15, 3.1-3.7, 4.1-4.7, 5.1-5.7, 8.1-8.7, 9.1-9.7, 10.1-10.7_

- [ ] 15. Documentación y despliegue
  - [ ]* 15.1 Crear documentación de usuario
    - Manual de captura de pedidos
    - Manual de verificación de transferencias
    - Manual de gestión de productos y canales
    - Manual de uso del dashboard
    - _Requirements: 1.1, 2.1, 4.1, 6.1, 8.1, 9.1, 10.1_
  
  - [ ]* 15.2 Crear documentación técnica
    - Documentar estructura de base de datos
    - Documentar APIs del backend
    - Documentar componentes del frontend
    - Documentar reglas de negocio
    - _Requirements: 1.1-12.7_
  
  - [ ]* 15.3 Preparar ambiente de producción
    - Configurar base de datos de producción
    - Configurar permisos de archivos
    - Configurar variables de entorno
    - Realizar backup de base de datos
    - _Requirements: 1.1-12.7_
  
  - [ ]* 15.4 Realizar despliegue a producción
    - Subir archivos al servidor
    - Ejecutar scripts de migración de base de datos
    - Configurar cron jobs si es necesario
    - Verificar funcionamiento en producción
    - _Requirements: 1.1-12.7_
  
  - [ ]* 15.5 Capacitar usuarios finales
    - Capacitación a jefes de atención
    - Capacitación a auxiliares
    - Capacitación a personal de tesorería
    - Resolver dudas y ajustes finales
    - _Requirements: 11.1-11.7_
