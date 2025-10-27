# Implementation Plan - Módulo de Compras

## Tareas de Implementación

- [x] 1. Configurar estructura de base de datos



  - Crear tablas principales con relaciones y constraints
  - Insertar datos iniciales en tablas de catálogo
  - Configurar índices para optimización de consultas




  - _Requirements: Todos los requisitos dependen de la estructura de BD_

- [x] 2. Implementar modelo de compras (mdl-compras.php)


  - [ ] 2.1 Crear clase base y configuración
    - Extender clase CRUD y configurar propiedades $bd y $util
    - Implementar constructor con inicialización de base de datos
    - _Requirements: 1.1, 2.1, 3.1, 4.1, 5.1_


  - [ ] 2.2 Implementar métodos de consulta
    - Crear método listCompras() con filtros por tipo y estado
    - Crear método getCompraById() para obtener detalle de compra
    - Crear método getTotalesByType() para calcular totales agrupados


    - _Requirements: 1.1, 1.5, 3.1, 7.1, 7.2, 7.3, 7.4_

  - [ ] 2.3 Implementar métodos de escritura
    - Crear método createCompra() para insertar nuevas compras




    - Crear método updateCompra() para actualizar compras existentes
    - Crear método deleteCompraById() para eliminación física
    - _Requirements: 2.8, 2.9, 4.6, 5.5, 5.6_


  - [ ] 2.4 Implementar métodos de catálogos
    - Crear método lsInsumo() para listar productos
    - Crear método lsClaseInsumo() para listar categorías
    - Crear método lsTipoCompra() para listar tipos de compra
    - Crear método lsFormaPago() para listar métodos de pago





    - _Requirements: 2.1, 2.2, 2.4, 9.2, 9.3_

- [ ] 3. Implementar modelo de proveedores (mdl-proveedores.php)
  - [x] 3.1 Crear clase base y métodos CRUD


    - Extender clase CRUD y configurar propiedades
    - Implementar listProveedores() con filtro por estado
    - Implementar getProveedorById() para obtener detalle
    - _Requirements: 8.2, 8.3_

  - [x] 3.2 Implementar métodos de escritura y validación


    - Crear método createProveedor() para insertar proveedores
    - Crear método updateProveedor() para actualizar proveedores
    - Crear método existsProveedorByName() para validar unicidad
    - _Requirements: 8.4, 8.5_



- [ ] 4. Implementar controlador de compras (ctrl-compras.php)
  - [ ] 4.1 Crear clase base y método init()
    - Extender clase mdl y configurar estructura
    - Implementar método init() para cargar catálogos iniciales
    - Retornar arrays de categorías, productos, proveedores, tipos y formas de pago
    - _Requirements: 2.1, 2.2, 8.2, 9.2_



  - [ ] 4.2 Implementar método lsCompras()
    - Recibir filtro de tipo de compra desde $_POST
    - Llamar a listCompras() del modelo con parámetros
    - Construir array de filas con formato para tabla CoffeeSoft
    - Incluir dropdown con acciones (ver, editar, eliminar)
    - Retornar array con 'row' y totales calculados

    - _Requirements: 1.3, 1.4, 1.5, 1.6, 6.1, 6.2, 6.3, 6.4, 6.5_

  - [ ] 4.3 Implementar método getCompra()
    - Recibir id desde $_POST
    - Llamar a getCompraById() del modelo

    - Validar existencia del registro
    - Retornar status 200 con datos o 404 si no existe
    - _Requirements: 3.1, 3.2, 3.6_

  - [x] 4.4 Implementar método addCompra()


    - Validar campos obligatorios desde $_POST
    - Validar que subtotal sea mayor a cero
    - Calcular total automáticamente (subtotal + impuesto)
    - Agregar fecha_operacion con timestamp actual
    - Llamar a createCompra() del modelo
    - Retornar status 200 si éxito o 400/500 si error


    - _Requirements: 2.7, 2.8, 2.9, 2.10, 10.5_

  - [x] 4.5 Implementar método editCompra()




    - Recibir id y datos actualizados desde $_POST
    - Validar campos obligatorios
    - Recalcular total si subtotal o impuesto cambiaron
    - Llamar a updateCompra() del modelo
    - Retornar status 200 si éxito o 400/500 si error

    - _Requirements: 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8_

  - [ ] 4.6 Implementar método deleteCompra()
    - Recibir id desde $_POST
    - Llamar a deleteCompraById() del modelo
    - Retornar status 200 si éxito o 500 si error


    - _Requirements: 5.5, 5.6, 5.7, 5.8_

  - [ ] 4.7 Implementar método getTotales()
    - Llamar a getTotalesByType() del modelo
    - Formatear montos con símbolo de moneda
    - Retornar objeto con totales por tipo

    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.8_

  - [ ] 4.8 Implementar métodos de proveedores
    - Crear método lsProveedores() para listar proveedores
    - Crear método getProveedor() para obtener detalle
    - Crear método addProveedor() con validación de unicidad


    - Crear método editProveedor() para actualizar
    - Crear método statusProveedor() para cambiar estado
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

  - [ ] 4.9 Crear funciones auxiliares
    - Implementar función dropdown() para generar menú de acciones
    - Implementar función renderStatus() para badges de estado
    - Implementar función formatSpanishDate() si no existe


    - _Requirements: 1.6_


- [ ] 5. Implementar frontend principal (compras.js)
  - [ ] 5.1 Crear estructura base de la clase App
    - Definir clase App extendiendo Templates
    - Configurar constructor con link y div_modulo

    - Definir PROJECT_NAME = "compras"
    - Declarar variables globales para catálogos
    - _Requirements: Todos_

  - [ ] 5.2 Implementar método render() y layout()
    - Crear método render() que ejecute layout(), filterBar() y lsCompras()
    - Implementar layout() usando primaryLayout de CoffeeSoft
    - Configurar tabLayout con pestañas "Compras" y "Proveedores"


    - Agregar header con título y descripción del módulo
    - _Requirements: 1.1, 1.2_

  - [ ] 5.3 Implementar método filterBar()
    - Usar createfilterBar de CoffeeSoft
    - Agregar selector de tipo de compra con opciones


    - Agregar botón "Registrar nueva compra"
    - Agregar botón "Subir archivos de compras" (opcional)
    - Configurar eventos onchange para actualizar tabla
    - _Requirements: 1.2, 1.3, 6.1, 6.2, 6.3, 6.4, 6.5_

  - [x] 5.4 Implementar método lsCompras()

    - Usar createTable de CoffeeSoft con coffeesoft: true
    - Configurar data con opc: 'lsCompras' y filtro de tipo
    - Configurar attr con theme 'corporativo' y columnas centradas/derechas
    - Habilitar datatable con paginación de 15 registros
    - _Requirements: 1.4, 1.5, 1.6_


  - [ ] 5.5 Implementar método jsonCompra()
    - Crear array de configuración de formulario
    - Incluir campos: categoría, producto, tipo de compra, proveedor
    - Incluir campos numéricos: subtotal, impuesto
    - Incluir campo textarea para descripción
    - Configurar validaciones required en campos obligatorios



    - Agregar evento onchange en categoría para cargar productos
    - Agregar evento onchange en tipo de compra para mostrar métodos de pago
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 9.1, 9.2, 9.3, 9.4_


  - [ ] 5.6 Implementar método addCompra()
    - Usar createModalForm de CoffeeSoft
    - Configurar bootbox con título "Nueva Compra"
    - Pasar json desde jsonCompra()
    - Configurar data con opc: 'addCompra'
    - Implementar callback success para mostrar alertas

    - Actualizar tabla y totales después de éxito
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9, 2.10_

  - [ ] 5.7 Implementar método editCompra(id)
    - Hacer petición async con useFetch para obtener datos (opc: 'getCompra')

    - Usar createModalForm con autofill de datos obtenidos
    - Configurar bootbox con título "Editar Compra"
    - Pasar json desde jsonCompra()
    - Configurar data con opc: 'editCompra' e id
    - Implementar callback success para actualizar tabla
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8_


  - [ ] 5.8 Implementar método viewCompra(id)
    - Hacer petición async con useFetch (opc: 'getCompra')
    - Usar detailCard de CoffeeSoft para mostrar información
    - Organizar datos en secciones: Producto, Facturación, Descripción, Resumen

    - Formatear montos con formatPrice()
    - Mostrar fecha de actualización y usuario
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7_


  - [x] 5.9 Implementar método deleteCompra(id)

    - Usar swalQuestion de CoffeeSoft
    - Configurar opts con título y mensaje de confirmación
    - Configurar data con opc: 'deleteCompra' e id
    - Implementar callback send para actualizar tabla después de éxito
    - Actualizar totales después de eliminación
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8_


  - [ ] 5.10 Implementar cálculo automático de total
    - Agregar evento onkeyup en campos subtotal e impuesto
    - Calcular total sumando subtotal + impuesto



    - Actualizar campo total en tiempo real
    - Validar que sean valores numéricos
    - _Requirements: 2.6, 4.4, 10.1, 10.2, 10.3, 10.4, 10.5, 10.6_

  - [ ] 5.11 Implementar carga dinámica de productos por categoría
    - Agregar evento onchange en selector de categoría
    - Hacer petición para obtener productos filtrados
    - Actualizar selector de productos con option_select
    - Deshabilitar selector de productos si no hay categoría
    - _Requirements: 9.3, 9.4, 9.5_


- [ ] 6. Implementar gestión de proveedores (compras.js - Clase Proveedor)
  - [ ] 6.1 Crear clase Proveedor extendiendo App
    - Definir constructor heredando de App
    - Configurar PROJECT_NAME = "proveedores"
    - _Requirements: 8.1_

  - [ ] 6.2 Implementar filterBarProveedor()
    - Usar createfilterBar de CoffeeSoft
    - Agregar selector de estado (Activos/Inactivos)
    - Agregar botón "Nuevo Proveedor"
    - Configurar eventos para actualizar tabla
    - _Requirements: 8.1_

  - [ ] 6.3 Implementar lsProveedor()
    - Usar createTable con data opc: 'lsProveedores'
    - Configurar columnas: Nombre, RFC, Teléfono, Email, Estado, Acciones
    - Incluir dropdown con opciones editar y cambiar estado
    - _Requirements: 8.1, 8.2_

  - [ ] 6.4 Implementar addProveedor()
    - Usar createModalForm con campos de proveedor
    - Configurar data con opc: 'addProveedor'
    - Validar campos obligatorios (nombre)
    - Implementar callback success
    - _Requirements: 8.4_

  - [ ] 6.5 Implementar editProveedor(id)
    - Hacer petición async para obtener datos
    - Usar createModalForm con autofill
    - Configurar data con opc: 'editProveedor' e id
    - _Requirements: 8.3, 8.5_

  - [ ] 6.6 Implementar statusProveedor(id, estado)
    - Usar swalQuestion para confirmar cambio de estado
    - Configurar data con opc: 'statusProveedor', id y nuevo estado
    - Actualizar tabla después de éxito
    - _Requirements: 8.1_

- [ ] 7. Implementar componente de totales
  - [ ] 7.1 Crear método renderTotales()
    - Hacer petición async con opc: 'getTotales'
    - Usar infoCard de CoffeeSoft para mostrar 4 tarjetas
    - Configurar tarjetas: Total general, Fondo fijo, Crédito, Corporativo
    - Formatear montos con formatPrice()
    - _Requirements: 1.1, 7.1, 7.2, 7.3, 7.4, 7.8_

  - [ ] 7.2 Implementar actualización automática de totales
    - Llamar a renderTotales() después de addCompra()
    - Llamar a renderTotales() después de editCompra()
    - Llamar a renderTotales() después de deleteCompra()
    - _Requirements: 2.10, 4.8, 5.8, 7.5, 7.6, 7.7_

- [ ] 8. Crear archivo index.php
  - Crear estructura HTML básica con div id="root"
  - Incluir scripts de CoffeeSoft (coffeSoft.js, plugins.js)
  - Incluir script del módulo (compras.js)
  - Configurar estilos de TailwindCSS
  - Validar sesión de usuario
  - _Requirements: Todos_

- [ ] 9. Integrar componentes y realizar pruebas
  - [ ] 9.1 Probar flujo completo de registro de compra
    - Verificar carga de catálogos iniciales
    - Probar registro con diferentes tipos de compra
    - Validar cálculo automático de total
    - Verificar actualización de tabla y totales
    - _Requirements: 2.1 a 2.10_

  - [ ] 9.2 Probar flujo de edición de compra
    - Verificar carga de datos en modal
    - Probar actualización de campos
    - Validar recálculo de total
    - Verificar actualización en tabla
    - _Requirements: 4.1 a 4.8_

  - [ ] 9.3 Probar flujo de eliminación
    - Verificar modal de confirmación
    - Probar eliminación exitosa
    - Validar actualización de totales
    - _Requirements: 5.1 a 5.8_

  - [ ] 9.4 Probar filtrado por tipo de compra
    - Verificar filtro "Todas las compras"
    - Probar filtros individuales (fondo fijo, corporativo, crédito)
    - Validar que totales generales no cambien
    - _Requirements: 6.1 a 6.6_

  - [ ] 9.5 Probar gestión de proveedores
    - Verificar listado de proveedores
    - Probar agregar nuevo proveedor
    - Probar edición de proveedor
    - Probar cambio de estado
    - _Requirements: 8.1 a 8.5_

  - [ ] 9.6 Validar relación categoría-producto
    - Verificar carga dinámica de productos
    - Probar con diferentes categorías
    - Validar que selector esté deshabilitado sin categoría
    - _Requirements: 9.1 a 9.5_

  - [ ] 9.7 Probar validaciones de campos
    - Verificar validación de campos obligatorios
    - Probar validación de montos numéricos
    - Validar formato de montos con decimales
    - Probar validación de subtotal mayor a cero
    - _Requirements: 10.1 a 10.6_

- [ ] 10. Documentación y deployment
  - Crear documentación de usuario (manual de uso)
  - Documentar API endpoints
  - Preparar scripts de migración de base de datos
  - Configurar variables de entorno
  - Realizar pruebas en ambiente de staging
  - Desplegar en producción
  - _Requirements: Todos_

