# Implementation Plan

- [ ] 1. Implementar métodos auxiliares en el modelo
- [ ] 1.1 Crear método `getProductsByPackage` en mdl-eventos.php
  - Consultar productos activos de un paquete desde evt_package_products
  - Retornar array con product_id y quantity
  - _Requirements: 1.4_

- [ ] 1.2 Crear método `insertPackageCheck` en mdl-eventos.php
  - Insertar registro en evt_package_check con events_package_id
  - Retornar package_check_id generado o false en caso de error
  - _Requirements: 1.3_

- [ ] 1.3 Crear método `maxPackageCheckId` en mdl-eventos.php
  - Obtener el ID máximo de evt_package_check
  - Retornar el último ID insertado
  - _Requirements: 1.3_

- [ ] 1.4 Crear método `insertProductCheck` en mdl-eventos.php
  - Validar que no exista duplicado (package_check_id + product_id)
  - Insertar producto en evt_check_products con active=1
  - Retornar true si se inserta o ya existe, false en caso de error
  - _Requirements: 1.5_

- [ ] 1.5 Crear método `getPackageCheckByEventPackageId` en mdl-eventos.php
  - Consultar registro de evt_package_check por events_package_id
  - Retornar array con id, events_package_id y created_at
  - _Requirements: 5.1_

- [ ] 1.6 Crear método `listProductsCheckByPackageCheckId` en mdl-eventos.php
  - Consultar productos de evt_check_products con JOIN a evt_products
  - Retornar array con check_product_id, product_id, active y product_name
  - _Requirements: 5.2, 5.3, 5.4_

- [ ] 1.7 Crear método `updateProductCheckActive` en mdl-eventos.php
  - Actualizar campo active en evt_check_products por id
  - Usar método _Update de la clase CRUD
  - Retornar true/false según resultado
  - _Requirements: 5.4_

- [ ] 2. Implementar método principal de vinculación
- [ ] 2.1 Crear método `insertPackageWithProducts` en mdl-eventos.php
  - Validar existencia de package_id en evt_package
  - Iniciar transacción con BEGIN TRANSACTION
  - Llamar a insertPackageCheck para crear registro de verificación
  - Obtener package_check_id mediante maxPackageCheckId
  - Consultar productos del paquete con getProductsByPackage
  - Iterar productos e insertar cada uno con insertProductCheck
  - Ejecutar COMMIT si todo es exitoso
  - Ejecutar ROLLBACK en caso de error
  - Retornar array con status (200/404/500), message y data
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 2.1, 2.2, 2.3, 3.1, 3.2, 3.3, 3.4, 3.5, 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7_

- [ ]* 2.2 Agregar manejo de excepciones con try-catch
  - Capturar excepciones durante la transacción
  - Registrar errores en logs con error_log
  - Retornar mensaje descriptivo del error
  - _Requirements: 2.5, 4.6, 4.7_

- [ ] 3. Integrar vinculación en controlador para agregar menús
- [ ] 3.1 Modificar método `addEventMenus` en ctrl-eventos.php
  - Después de insertar en evt_events_package exitosamente
  - Iterar sobre array de menús agregados
  - Para cada menú, obtener package_id y events_package_id
  - Llamar a insertPackageWithProducts con ambos IDs
  - Registrar errores en logs si status !== 200
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [ ] 4. Integrar vinculación en controlador para editar menús
- [ ] 4.1 Modificar método `editEventMenus` en ctrl-eventos.php
  - Después de insertar nuevos paquetes en evt_events_package
  - Iterar sobre array de menús editados
  - Para cada menú, obtener package_id y events_package_id
  - Llamar a insertPackageWithProducts con ambos IDs
  - Registrar errores en logs si status !== 200
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [ ] 5. Crear endpoints en controlador para consulta de productos
- [ ] 5.1 Crear método `getProductsCheck` en ctrl-eventos.php
  - Recibir events_package_id desde POST
  - Llamar a getPackageCheckByEventPackageId para obtener package_check
  - Si no existe, retornar status 404 con array vacío
  - Llamar a listProductsCheckByPackageCheckId con package_check.id
  - Retornar status 200 con array de productos
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [ ] 5.2 Crear método `updateProductCheck` en ctrl-eventos.php
  - Recibir id y active desde POST
  - Llamar a updateProductCheckActive con datos procesados por util->sql
  - Retornar status 200 si actualización exitosa, 500 si falla
  - _Requirements: 5.4_

- [ ] 6. Implementar interfaz de visualización de productos
- [ ] 6.1 Crear método `renderProductCheckboxList` en eventos.js
  - Recibir events_package_id y containerId como parámetros
  - Hacer petición AJAX con useFetch a opc: "getProductsCheck"
  - Si status !== 200, mostrar mensaje de error en contenedor
  - Iterar sobre array de productos recibidos
  - Generar HTML con checkbox por cada producto
  - Marcar checkbox como checked si active == 1
  - Asignar evento onchange que llame a toggleProductCheck
  - Insertar HTML generado en el contenedor especificado
  - _Requirements: 5.1, 5.2, 5.3, 5.4_

- [ ] 6.2 Crear método `toggleProductCheck` en eventos.js
  - Recibir check_product_id e isChecked como parámetros
  - Hacer petición AJAX con useFetch a opc: "updateProductCheck"
  - Enviar id y active (1 si isChecked, 0 si no)
  - Si status !== 200, mostrar alerta de error
  - _Requirements: 5.4_

- [ ] 6.3 Integrar renderProductCheckboxList en método `showEvent`
  - Después de renderizar la lista de menús en el modal
  - Iterar sobre menuList obtenido del backend
  - Para cada paquete, crear contenedor con ID único
  - Llamar a renderProductCheckboxList con pkg.idPackage y containerId
  - _Requirements: 5.1, 5.2, 5.3, 5.4_

- [ ]* 7. Agregar validaciones y manejo de errores
- [ ]* 7.1 Validar parámetros de entrada en controlador
  - Usar filter_var con FILTER_VALIDATE_INT para IDs
  - Retornar status 400 si parámetros son inválidos
  - _Requirements: 2.1, 2.2_

- [ ]* 7.2 Agregar validación de permisos en controlador
  - Verificar que subsidiaries_id del evento coincida con SESSION['SUB']
  - Retornar status 403 si usuario no tiene acceso
  - _Requirements: 2.1_

- [ ]* 8. Optimizar rendimiento
- [ ]* 8.1 Crear índices en base de datos
  - Crear índice en evt_package_check(events_package_id)
  - Crear índice en evt_check_products(package_check_id)
  - Crear índice en evt_check_products(product_id)
  - _Requirements: Performance_

- [ ]* 8.2 Implementar inserción múltiple de productos
  - Modificar insertProductCheck para aceptar array de productos
  - Usar _Insert con múltiples valores en una sola query
  - _Requirements: Performance_

- [ ]* 9. Documentar código
- [ ]* 9.1 Agregar comentarios PHPDoc en métodos del modelo
  - Documentar parámetros, retorno y excepciones
  - Incluir ejemplos de uso
  - _Requirements: 4.1, 4.2, 4.3_

- [ ]* 9.2 Agregar comentarios JSDoc en métodos del frontend
  - Documentar parámetros y comportamiento
  - Incluir ejemplos de uso
  - _Requirements: 5.1, 5.2, 5.3, 5.4_
