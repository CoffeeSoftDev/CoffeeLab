# Implementation Plan

- [x] 1. Crear migración de base de datos



  - Crear script SQL para tabla `evt_package_check` con campos id, events_package_id, created_at
  - Crear script SQL para tabla `evt_check_products` con campos id, package_check_id, product_id, active
  - Agregar índices y foreign keys según diseño
  - Agregar índice único compuesto en evt_check_products (package_check_id, product_id)
  - Crear script de migración de datos existentes si aplica


  - _Requirements: 1.1, 1.2, 1.3, 1.4_



- [ ] 2. Implementar funciones del modelo (mdl-eventos.php)
  - _Requirements: 3.1, 3.2, 3.3, 3.4_


- [ ] 2.1 Crear función getProductsByPackage()
  - Implementar consulta SELECT a evt_package_products filtrando por package_id y active = 1
  - Retornar array con product_id y quantity de cada producto
  - _Requirements: 3.1_


- [ ] 2.2 Crear función insertPackageCheck()
  - Implementar INSERT en evt_package_check con events_package_id y created_at
  - Crear función auxiliar maxPackageCheckId() para obtener el ID insertado
  - Retornar el check_id generado o false en caso de error
  - _Requirements: 3.2_


- [ ] 2.3 Crear función insertProductCheck()
  - Implementar INSERT en evt_check_products con package_check_id, product_id, active = 1
  - Agregar validación para evitar duplicados (verificar si ya existe la combinación)

  - Retornar true si se insertó correctamente o si ya existía
  - _Requirements: 3.3_

- [ ] 2.4 Crear función getPackageCheckByEventPackageId()
  - Implementar SELECT en evt_package_check filtrando por events_package_id

  - Retornar el primer registro encontrado o null
  - _Requirements: 3.4_

- [x] 2.5 Crear función listProductsCheckByPackageCheckId()


  - Implementar SELECT con LEFT JOIN entre evt_check_products y evt_products
  - Retornar campos: check_product_id, product_id, active, product_name, id_classification


  - Filtrar por package_check_id
  - _Requirements: 3.4_

- [ ] 2.6 Crear función updateProductCheckActive()
  - Implementar UPDATE en evt_check_products para campo active
  - Filtrar por id (check_product_id)
  - Retornar true si se actualizó correctamente


  - _Requirements: 3.6_

- [ ] 3. Implementar funciones del controlador (ctrl-eventos.php)
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 2.3, 2.4, 3.5_



- [ ] 3.1 Crear función insertPackageWithProducts()
  - Recibir events_package_id y package_id como parámetros
  - Llamar a insertPackageCheck() y obtener check_id
  - Llamar a getProductsByPackage() para obtener lista de productos
  - Iterar sobre productos y llamar insertProductCheck() para cada uno
  - Implementar try-catch para manejo de errores
  - Retornar array con status, message, check_id y products_inserted
  - _Requirements: 1.2, 1.3, 1.4, 1.5_


- [ ] 3.2 Modificar función addEventMenus()
  - Después de insertar en evt_events_package, obtener el ID insertado
  - Llamar a insertPackageWithProducts() para cada paquete agregado
  - Mantener el flujo original de inserción sin modificaciones
  - Agregar logging de errores si falla la vinculación de productos

  - _Requirements: 1.1, 1.2_


- [x] 3.3 Modificar función editEventMenus()


  - Después de eliminar y reinsertar paquetes, llamar a insertPackageWithProducts()
  - Verificar que no se dupliquen registros en evt_check_products
  - Mantener estados personalizados de productos si ya existían
  - _Requirements: 1.1, 1.2_

- [ ] 3.4 Crear función getProductsCheckByPackage()
  - Recibir events_package_id por POST
  - Llamar a getPackageCheckByEventPackageId() para obtener check_id

  - Llamar a listProductsCheckByPackageCheckId() para obtener productos con estados
  - Retornar array con status, message y data (lista de productos)
  - _Requirements: 2.6, 3.4_

- [ ] 3.5 Crear función updateProductActive()
  - Recibir check_product_id y active por POST
  - Validar que active sea 0 o 1
  - Llamar a updateProductCheckActive() del modelo
  - Retornar array con status y message
  - _Requirements: 2.3, 3.5_

- [ ] 4. Implementar componente de checkboxes en frontend (eventos.js)
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7_

- [ ] 4.1 Crear función renderProductCheckboxList()
  - Recibir events_package_id como parámetro
  - Hacer petición useFetch a getProductsCheckByPackage
  - Agrupar productos por clasificación (platillos vs bebidas)
  - Generar HTML con estructura de grid (2 columnas)
  - Renderizar checkboxes con data-attributes (check-product-id, product-id)
  - Aplicar estado checked según campo active
  - Aplicar estilos CoffeeSoft (bg-[#1F2A37], text-gray-300, etc.)
  - _Requirements: 2.1, 2.2, 2.7_

- [ ] 4.2 Implementar event handler onChange para checkboxes
  - Capturar evento change en elementos con clase .product-checkbox
  - Obtener check_product_id y nuevo estado (checked = 1, unchecked = 0)
  - Hacer petición useFetch a updateProductActive
  - Implementar feedback visual (animación flash) en caso de éxito
  - Revertir estado del checkbox en caso de error
  - Mostrar mensaje de error con alert() si falla la actualización
  - _Requirements: 2.3, 2.4, 2.5_

- [ ] 4.3 Integrar renderProductCheckboxList() en showEvent()
  - Modificar la función showEvent() para incluir sección de checkboxes
  - Agregar contenedor HTML para checkboxes en el modal de detalles
  - Llamar a renderProductCheckboxList() después de renderizar el menú
  - Aplicar solo cuando category === "Evento" (no para subeventos)
  - _Requirements: 2.1, 2.6_

- [ ] 4.4 Agregar estilos CSS para checkboxes
  - Crear clase .updated-flash para animación de feedback
  - Agregar estilos hover para labels de checkboxes
  - Asegurar que checkboxes sean visibles en tema oscuro
  - _Requirements: 2.7_

- [ ] 5. Implementar manejo de errores
  - _Requirements: 1.5, 1.6, 2.4, 2.5, 3.7_

- [ ] 5.1 Agregar validación de duplicados en insertProductCheck()
  - Verificar si ya existe registro con misma combinación package_check_id + product_id
  - Retornar true sin insertar si ya existe (evitar error de clave única)
  - _Requirements: 1.5_

- [ ] 5.2 Implementar try-catch en insertPackageWithProducts()
  - Envolver lógica en bloque try-catch
  - Registrar errores en log con error_log()
  - Retornar respuesta estructurada con status 500 y mensaje de error
  - _Requirements: 1.6, 3.7_

- [ ] 5.3 Agregar validación de parámetros en updateProductActive()
  - Validar que active sea 0 o 1 (usar in_array)
  - Validar que check_product_id sea numérico
  - Retornar status 400 con mensaje descriptivo si validación falla
  - _Requirements: 3.7_

- [ ] 5.4 Implementar timeout en peticiones frontend
  - Agregar Promise.race con timeout de 5 segundos en useFetch
  - Mostrar mensaje de error si la petición excede el timeout
  - _Requirements: 2.4_

- [ ] 5.5 Agregar manejo de errores en event handler de checkboxes
  - Capturar errores de red con try-catch
  - Revertir estado del checkbox si falla la actualización
  - Mostrar mensaje de error al usuario
  - _Requirements: 2.5_

- [ ]* 6. Crear pruebas unitarias
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 2.3, 3.1, 3.2, 3.3, 3.5, 3.6_

- [ ]* 6.1 Crear pruebas para funciones del modelo
  - Test insertPackageCheck() con events_package_id válido
  - Test insertPackageCheck() con events_package_id inválido
  - Test insertProductCheck() con datos válidos
  - Test insertProductCheck() con duplicado (debe manejar correctamente)
  - Test updateProductCheckActive() con active = 1 y active = 0
  - Test getProductsByPackage() con package_id existente
  - Test getProductsByPackage() con package_id sin productos
  - _Requirements: 3.1, 3.2, 3.3, 3.6_

- [ ]* 6.2 Crear pruebas para funciones del controlador
  - Test insertPackageWithProducts() con paquete válido
  - Test insertPackageWithProducts() con paquete sin productos
  - Test updateProductActive() con active = 1
  - Test updateProductActive() con active = 2 (debe retornar error)
  - Test getProductsCheckByPackage() con events_package_id válido
  - _Requirements: 1.2, 1.3, 1.4, 3.5_

- [ ]* 6.3 Crear pruebas de integración
  - Test flujo completo: crear evento → agregar paquete → verificar registros en BD
  - Test flujo de actualización: cambiar estado de producto → verificar en BD
  - Test edición de menú: verificar que no se duplican registros
  - Test con múltiples paquetes: verificar independencia de listas de productos
  - _Requirements: 1.1, 1.2, 2.3_

- [ ] 7. Optimizar rendimiento
  - _Requirements: 1.4_

- [ ] 7.1 Agregar índices a tablas
  - Crear índice en evt_package_check.events_package_id
  - Crear índice en evt_check_products.package_check_id
  - Verificar que índice único compuesto esté creado
  - _Requirements: 1.4_

- [ ] 7.2 Optimizar consultas SQL
  - Revisar que listProductsCheckByPackageCheckId() use LEFT JOIN eficientemente
  - Limitar campos en SELECT a solo los necesarios
  - _Requirements: 3.4_

- [ ] 7.3 Implementar debounce en event handler de checkboxes
  - Agregar delay de 300ms antes de enviar petición
  - Cancelar peticiones pendientes si usuario hace múltiples clics rápidos
  - _Requirements: 2.3_

- [ ] 8. Documentar código
  - _Requirements: Todos_

- [ ] 8.1 Agregar comentarios PHPDoc a funciones del modelo
  - Documentar parámetros, tipos de retorno y propósito de cada función
  - Incluir ejemplos de uso donde sea relevante
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.6_

- [ ] 8.2 Agregar comentarios JSDoc a funciones del frontend
  - Documentar parámetros y comportamiento de renderProductCheckboxList()
  - Documentar event handlers y su propósito
  - _Requirements: 2.1, 2.3_

- [ ] 8.3 Actualizar README del proyecto
  - Documentar nuevas tablas de base de datos
  - Explicar flujo de inserción de paquetes con productos
  - Incluir capturas de pantalla de la interfaz de checkboxes
  - _Requirements: Todos_

- [ ] 9. Realizar pruebas manuales
  - _Requirements: Todos_

- [ ] 9.1 Probar creación de evento con paquetes
  - Crear nuevo evento y agregar paquete
  - Verificar que se muestran todos los productos en vista de detalle
  - Verificar que todos los checkboxes están marcados por defecto
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 2.1, 2.2_

- [ ] 9.2 Probar actualización de estado de productos
  - Desmarcar checkbox de un producto
  - Verificar que se actualiza sin recargar página
  - Recargar página y verificar que checkbox sigue desmarcado
  - _Requirements: 2.3, 2.4, 2.5, 2.6_

- [ ] 9.3 Probar edición de evento existente
  - Editar evento con paquetes
  - Verificar que se cargan correctamente los estados de productos
  - Modificar estados y guardar
  - Verificar que cambios persisten
  - _Requirements: 1.1, 2.6_

- [ ] 9.4 Probar casos edge
  - Probar con paquete sin productos (no debe generar errores)
  - Probar con múltiples paquetes (verificar independencia)
  - Probar con conexión lenta (verificar feedback visual)
  - Probar desactivar todos los productos de un paquete
  - _Requirements: 1.5, 1.6, 2.4, 2.5_

- [ ] 10. Desplegar a producción
  - _Requirements: Todos_

- [ ] 10.1 Preparar entorno de producción
  - Hacer backup completo de base de datos
  - Verificar que servidor tiene espacio suficiente
  - Notificar a usuarios sobre mantenimiento programado
  - _Requirements: Todos_

- [ ] 10.2 Ejecutar migración de base de datos
  - Ejecutar script de creación de tablas en producción
  - Ejecutar script de migración de datos existentes
  - Verificar integridad de datos migrados
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [ ] 10.3 Desplegar código
  - Subir archivos mdl-eventos.php y ctrl-eventos.php actualizados
  - Subir archivo eventos.js actualizado
  - Limpiar caché del servidor si aplica
  - _Requirements: Todos_

- [ ] 10.4 Verificar funcionalidad en producción
  - Probar creación de evento con paquetes
  - Probar actualización de estado de productos
  - Monitorear logs de errores durante las primeras horas
  - Solicitar feedback de usuarios piloto
  - _Requirements: Todos_
