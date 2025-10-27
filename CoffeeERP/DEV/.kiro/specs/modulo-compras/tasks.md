# Implementation Plan - Módulo de Compras

## Overview

Este plan de implementación detalla las tareas necesarias para desarrollar el módulo de compras siguiendo la arquitectura MVC de CoffeeSoft. Las tareas están organizadas en orden lógico de dependencias, comenzando con la base de datos y modelos, seguido por controladores y finalmente la interfaz de usuario.

---

## Tasks

- [x] 1. Configurar estructura de base de datos


  - Crear las tablas necesarias para el módulo de compras con sus relaciones
  - Insertar datos iniciales en tablas de catálogo (purchase_type, method_pay)
  - Verificar integridad referencial y constraints
  - _Requirements: 1.1, 2.1, 6.1, 7.1, 8.1, 9.1_





- [ ] 2. Implementar modelo de compras (mdl-compras.php)

- [ ] 2.1 Crear estructura base del modelo
  - Implementar clase mdl extendiendo CRUD

  - Configurar propiedades $bd y $util
  - Establecer conexión con base de datos rfwsmqex_contabilidad
  - _Requirements: 1.1, 2.1_

- [ ] 2.2 Implementar operaciones CRUD de compras
  - Crear método listPurchases() con filtros por UDN y tipo
  - Implementar getPurchaseById() para obtener detalle de compra

  - Desarrollar createPurchase() para insertar nuevas compras
  - Implementar updatePurchase() para editar compras existentes
  - Crear deletePurchaseById() para soft delete (active = 0)
  - _Requirements: 1.6, 2.6, 3.5, 4.3, 5.1_

- [ ] 2.3 Implementar operaciones de categorías de productos
  - Crear listProductClass() para listar categorías activas
  - Implementar getProductClassById() para obtener categoría específica

  - Desarrollar createProductClass() para insertar categorías
  - Implementar updateProductClass() para editar categorías
  - Crear lsProductClass() para poblar selects
  - _Requirements: 6.1, 6.2, 6.3, 6.4_


- [x] 2.4 Implementar operaciones de productos

  - Crear listProducts() para listar productos por categoría
  - Implementar getProductById() para obtener producto específico
  - Desarrollar createProduct() para insertar productos
  - Implementar updateProduct() para editar productos


  - Crear lsProducts() para poblar selects filtrados por product_class_id

  - _Requirements: 7.1, 7.2, 7.3, 7.4_

- [ ] 2.5 Implementar métodos de catálogos
  - Crear lsPurchaseTypes() para listar tipos de compra

  - Implementar lsMethodPay() para listar métodos de pago
  - Desarrollar lsUDN() para listar unidades de negocio
  - _Requirements: 1.4, 2.3, 10.1_

- [ ] 3. Implementar modelo de proveedores (mdl-proveedores.php)

- [x] 3.1 Crear estructura base del modelo de proveedores



  - Implementar clase mdl extendiendo CRUD

  - Configurar propiedades $bd y $util
  - _Requirements: 8.1_

- [ ] 3.2 Implementar operaciones CRUD de proveedores
  - Crear listSuppliers() para listar proveedores por UDN
  - Implementar getSupplierById() para obtener proveedor específico

  - Desarrollar createSupplier() para insertar proveedores
  - Implementar updateSupplier() para editar proveedores
  - Crear lsSuppliers() para poblar selects filtrados por UDN
  - Implementar updateSupplierBalance() para actualizar saldos
  - _Requirements: 8.1, 8.2, 8.3, 8.4_

- [x] 4. Implementar controlador de compras (ctrl-compras.php)


- [ ] 4.1 Crear estructura base del controlador
  - Implementar clase ctrl extendiendo mdl
  - Configurar validación de $_POST['opc']
  - Establecer manejo de sesiones
  - _Requirements: 1.1_



- [ ] 4.2 Implementar método init() para inicialización
  - Cargar catálogos de tipos de compra
  - Cargar catálogos de métodos de pago
  - Cargar lista de UDN
  - Cargar categorías de productos
  - Retornar array con todos los catálogos

  - _Requirements: 1.1, 2.1_

- [ ] 4.3 Implementar operaciones de listado y consulta de compras
  - Crear ls() para listar compras con filtros
  - Implementar cálculo de totales por tipo de compra

  - Desarrollar getPurchase() para obtener detalle de compra
  - Formatear datos para tabla (folio, fechas, montos)
  - Construir array de acciones (ver, editar, eliminar)
  - _Requirements: 1.5, 1.6, 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 10.1, 10.2, 10.3_

- [ ] 4.4 Implementar operaciones de registro y edición de compras
  - Crear addPurchase() con validación de campos requeridos

  - Implementar cálculo automático de total (subtotal + tax)
  - Desarrollar editPurchase() con validación de datos
  - Validar existencia de registros relacionados (producto, proveedor)
  - Retornar respuestas estandarizadas (status, message)
  - _Requirements: 2.2, 2.3, 2.4, 2.5, 2.6, 3.2, 3.3, 3.4, 3.5, 9.1, 9.2, 9.3, 9.4, 9.5_


- [ ] 4.5 Implementar operación de eliminación de compras
  - Crear deletePurchase() con soft delete (active = 0)
  - Validar existencia de compra antes de eliminar
  - Retornar confirmación de eliminación
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [x] 4.6 Implementar operaciones de administración de categorías

  - Crear lsProductClass() para listar categorías en tabla
  - Implementar addProductClass() con validación de nombre único
  - Desarrollar editProductClass() para actualizar categorías
  - Crear statusProductClass() para cambiar estado activo/inactivo


  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_



- [ ] 4.7 Implementar operaciones de administración de productos
  - Crear lsProducts() para listar productos en tabla
  - Implementar addProduct() con validación de campos
  - Desarrollar editProduct() para actualizar productos

  - Crear statusProduct() para cambiar estado activo/inactivo
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [ ] 4.8 Implementar operaciones de administración de proveedores
  - Crear lsSuppliers() para listar proveedores en tabla
  - Implementar addSupplier() con validación de RFC y email
  - Desarrollar editSupplier() para actualizar proveedores

  - Crear statusSupplier() para cambiar estado activo/inactivo
  - Incluir visualización de saldo actual en listado
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

- [ ] 4.9 Implementar funciones auxiliares del controlador
  - Crear función dropdown() para menú de acciones
  - Implementar función renderStatus() para badges de estado
  - Desarrollar función formatSpanishDate() para formato de fechas

  - Crear función evaluar() para formato de moneda
  - _Requirements: 1.6, 5.6, 9.4_

- [ ] 5. Implementar interfaz principal de compras (compras.js)

- [ ] 5.1 Crear estructura base de la clase App
  - Implementar clase App extendiendo Templates

  - Configurar constructor con link y div_modulo
  - Definir PROJECT_NAME = "compras"
  - Implementar método render() principal
  - _Requirements: 1.1_

- [ ] 5.2 Implementar layout principal del módulo
  - Crear método layout() con primaryLayout

  - Configurar tabLayout con pestañas Compras y Administrador
  - Implementar contenedores para filterBar y container
  - Agregar header con título y descripción del módulo
  - _Requirements: 1.1, 1.2_


- [ ] 5.3 Implementar tarjetas de resumen de totales
  - Crear método showSummaryCards() usando infoCard
  - Mostrar total general de compras
  - Mostrar total de compras de fondo fijo
  - Mostrar total de compras a crédito
  - Mostrar total de compras corporativas
  - Formatear montos con formatPrice()
  - _Requirements: 1.2_


- [ ] 5.4 Implementar barra de filtros y acciones
  - Crear método filterBar() con createfilterBar
  - Agregar select para filtrar por tipo de compra
  - Implementar botón "Subir archivos de compras"
  - Implementar botón "Registrar nueva compra"
  - Configurar evento onchange para actualizar tabla

  - _Requirements: 1.3, 1.4_

- [ ] 5.5 Implementar tabla de listado de compras
  - Crear método ls() usando createTable
  - Configurar columnas: Folio, Clase producto, Producto, Tipo compra, Total, Acciones
  - Implementar paginación con 15 registros por página
  - Configurar tema corporativo para la tabla

  - Alinear columnas numéricas a la derecha
  - _Requirements: 1.5, 1.6_

- [ ] 5.6 Implementar formulario de registro de compra
  - Crear método addPurchase() con createModalForm
  - Implementar método jsonPurchase() con campos del formulario
  - Agregar select de categoría de producto con carga dinámica
  - Agregar select de producto filtrado por categoría

  - Agregar select de tipo de compra
  - Agregar select de proveedor
  - Agregar select de método de pago
  - Agregar inputs para subtotal e impuesto con validación numérica
  - Agregar textarea para descripción



  - Implementar cálculo automático de total

  - Configurar validación de campos requeridos
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 9.1, 9.2, 9.3_


- [ ] 5.7 Implementar formulario de edición de compra
  - Crear método editPurchase(id) con async/await

  - Implementar consulta getPurchase con useFetch
  - Usar createModalForm con autofill de datos existentes
  - Reutilizar jsonPurchase() para estructura del formulario
  - Configurar callback success para actualizar tabla
  - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [ ] 5.8 Implementar eliminación de compra
  - Crear método deletePurchase(id) con swalQuestion

  - Configurar modal de confirmación con opciones Continuar/Cancelar
  - Implementar callback para eliminar registro
  - Mostrar mensaje de éxito o error
  - Actualizar tabla después de eliminación
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [ ] 5.9 Implementar vista de detalle de compra
  - Crear método viewPurchase(id) con detailCard

  - Mostrar información del producto (categoría y nombre)
  - Mostrar tipo de compra y método de pago
  - Mostrar información financiera (subtotal, impuesto, total)
  - Mostrar descripción y número de factura
  - Mostrar fecha y usuario de última actualización
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_

- [ ] 5.10 Implementar actualización dinámica de filtros
  - Crear método updateSummaryCards() para recalcular totales
  - Implementar filtrado por tipo de compra
  - Actualizar tarjetas de resumen al aplicar filtros
  - Mantener sincronización entre filtros y tabla
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

- [ ] 6. Implementar módulo de administración (AdminPurchase class)

- [ ] 6.1 Crear estructura de la clase AdminPurchase
  - Implementar clase AdminPurchase extendiendo App
  - Configurar constructor heredando de App
  - Implementar método render() para tab de administrador
  - _Requirements: 6.1, 7.1, 8.1_


- [ ] 6.2 Implementar gestión de categorías de productos
  - Crear método filterBarProductClass() con barra de filtros
  - Implementar método lsProductClass() para tabla de categorías
  - Desarrollar addProductClass() con formulario modal
  - Implementar editProductClass(id) con carga de datos
  - Crear statusProductClass(id, active) para cambiar estado
  - Configurar validación de nombre único
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [ ] 6.3 Implementar gestión de productos
  - Crear método filterBarProducts() con barra de filtros
  - Implementar método lsProducts() para tabla de productos
  - Desarrollar addProduct() con formulario modal
  - Agregar select de categoría en formulario de producto
  - Implementar editProduct(id) con carga de datos
  - Crear statusProduct(id, active) para cambiar estado
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [ ] 6.4 Implementar gestión de proveedores
  - Crear método filterBarSuppliers() con barra de filtros
  - Implementar método lsSuppliers() para tabla de proveedores
  - Desarrollar addSupplier() con formulario modal
  - Agregar campos: nombre, RFC, teléfono, email, UDN
  - Implementar editSupplier(id) con carga de datos
  - Crear statusSupplier(id, active) para cambiar estado
  - Mostrar saldo actual en tabla de proveedores
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

- [ ] 7. Integración y pruebas del módulo completo

- [ ] 7.1 Integrar todos los componentes
  - Verificar comunicación entre frontend y backend
  - Probar flujo completo de registro de compra
  - Validar cálculos automáticos de totales
  - Verificar actualización de tarjetas de resumen
  - Probar filtros y su efecto en la tabla
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 2.1-2.6, 9.1-9.5, 10.1-10.5_


- [ ] 7.2 Realizar pruebas de validación
  - Probar validación de campos requeridos en formularios
  - Verificar validación de tipos de datos (números, fechas)
  - Probar manejo de errores en operaciones CRUD
  - Validar mensajes de error y éxito
  - Verificar comportamiento de confirmaciones de eliminación
  - _Requirements: 2.4, 3.4, 4.1, 4.2_

- [ ] 7.3 Realizar pruebas de integración con base de datos
  - Verificar integridad referencial en inserts
  - Probar cascada de relaciones entre tablas
  - Validar soft deletes (active = 0)
  - Verificar cálculos de totales en consultas
  - Probar filtros con diferentes combinaciones
  - _Requirements: 1.5, 1.6, 4.3, 10.1-10.5_

- [ ] 7.4 Optimizar rendimiento del módulo
  - Verificar tiempo de carga de tablas con datos grandes
  - Optimizar consultas SQL con índices
  - Implementar carga lazy de selects dependientes
  - Verificar paginación funciona correctamente
  - Probar responsive design en diferentes dispositivos
  - _Requirements: 1.5, 2.1, 10.4_

- [ ]* 7.5 Documentar el módulo
  - Crear documentación de uso para usuarios finales
  - Documentar estructura de base de datos
  - Documentar API endpoints del controlador
  - Crear guía de mantenimiento del código
  - _Requirements: All_

---

## Notes

- Las tareas marcadas con * son opcionales y pueden omitirse para un MVP más rápido
- Cada tarea debe completarse antes de pasar a la siguiente para mantener dependencias
- Los números de requerimientos (_Requirements:_) referencian los criterios de aceptación del documento requirements.md
- Se recomienda hacer commits frecuentes después de completar cada tarea principal (1, 2, 3, 4, 5, 6, 7)
