# Requirements Document

## Introduction

Este documento define los requisitos para el módulo de gestión de paquetes de eventos, que permite vincular paquetes de menú a eventos y gestionar automáticamente los productos asociados en las tablas de verificación (`evt_package_check` y `evt_check_products`).

## Glossary

- **System**: El módulo de gestión de paquetes de eventos
- **Event**: Evento registrado en la tabla `evt_events`
- **Package**: Paquete de menú registrado en la tabla `evt_package`
- **Event Package**: Relación entre un evento y un paquete en la tabla `evt_events_package`
- **Package Check**: Registro de verificación de paquete en la tabla `evt_package_check`
- **Product**: Producto individual registrado en la tabla `evt_products`
- **Check Product**: Producto asociado a una verificación en la tabla `evt_check_products`
- **User**: Usuario del sistema que gestiona eventos

## Requirements

### Requirement 1

**User Story:** Como administrador de eventos, quiero agregar un paquete de menú a un evento, para que se registre automáticamente con todos sus productos asociados en las tablas de verificación.

#### Acceptance Criteria

1. WHEN el User agrega un paquete a un evento, THE System SHALL crear un registro en la tabla `evt_events_package` con el `event_id` y `package_id` correspondientes
2. WHEN el registro en `evt_events_package` se crea exitosamente, THE System SHALL obtener el ID máximo (`idPackage`) de la tabla `evt_events_package`
3. WHEN el System obtiene el `idPackage`, THE System SHALL crear un registro en la tabla `evt_package_check` con el `events_package_id` correspondiente
4. WHEN el registro en `evt_package_check` se crea exitosamente, THE System SHALL consultar todos los productos asociados al `package_id` desde la tabla `evt_package_products`
5. WHEN el System obtiene la lista de productos, THE System SHALL insertar cada producto en la tabla `evt_check_products` con el `package_check_id` correspondiente
6. IF ocurre un error en cualquier paso de la transacción, THEN THE System SHALL revertir todos los cambios realizados mediante ROLLBACK
7. WHEN todas las inserciones se completan exitosamente, THE System SHALL confirmar la transacción mediante COMMIT
8. WHEN la operación se completa, THE System SHALL retornar un mensaje de confirmación con el `idPackage` generado

### Requirement 2

**User Story:** Como administrador de eventos, quiero que el sistema valide la existencia de productos antes de vincularlos, para evitar errores de integridad de datos.

#### Acceptance Criteria

1. WHEN el System consulta productos de un paquete, THE System SHALL verificar que el `package_id` existe en la tabla `evt_package`
2. WHEN el System inserta productos en `evt_check_products`, THE System SHALL verificar que cada `product_id` existe en la tabla `evt_products`
3. IF un `package_id` no existe, THEN THE System SHALL retornar un error con código 404 y mensaje descriptivo
4. IF un `product_id` no existe, THEN THE System SHALL omitir ese producto y continuar con los demás
5. WHEN la validación falla, THE System SHALL registrar el error en los logs del sistema

### Requirement 3

**User Story:** Como administrador de eventos, quiero que el sistema maneje transacciones de forma segura, para garantizar la consistencia de los datos en caso de errores.

#### Acceptance Criteria

1. WHEN el System inicia la operación de agregar paquete, THE System SHALL iniciar una transacción de base de datos mediante BEGIN TRANSACTION
2. WHEN ocurre un error durante la inserción en cualquier tabla, THE System SHALL ejecutar ROLLBACK para revertir todos los cambios
3. WHEN todas las operaciones se completan exitosamente, THE System SHALL ejecutar COMMIT para confirmar los cambios
4. WHEN se ejecuta ROLLBACK, THE System SHALL retornar un mensaje de error con código 500 y descripción del problema
5. WHEN se ejecuta COMMIT, THE System SHALL retornar un mensaje de éxito con código 200

### Requirement 4

**User Story:** Como desarrollador, quiero que el método `insertPackageWithProducts` esté disponible en el modelo, para poder reutilizarlo en diferentes contextos del sistema.

#### Acceptance Criteria

1. THE System SHALL implementar el método `insertPackageWithProducts` en la clase `MEvent` del archivo `mdl-eventos.php`
2. WHEN se invoca el método, THE System SHALL recibir como parámetros `events_package_id` y `package_id`
3. WHEN el método se ejecuta, THE System SHALL retornar un array con las claves `status` y `message`
4. WHEN la operación es exitosa, THE System SHALL retornar `status: 200` y un mensaje descriptivo
5. WHEN la operación falla, THE System SHALL retornar `status: 500` y un mensaje de error descriptivo
6. THE System SHALL manejar excepciones mediante bloques try-catch
7. WHEN ocurre una excepción, THE System SHALL registrar el error en los logs del sistema

### Requirement 5

**User Story:** Como administrador de eventos, quiero visualizar los productos asociados a un paquete de evento, para verificar que se vincularon correctamente.

#### Acceptance Criteria

1. WHEN el User solicita ver los productos de un paquete, THE System SHALL consultar la tabla `evt_package_check` usando el `events_package_id`
2. WHEN el System obtiene el `package_check_id`, THE System SHALL consultar todos los productos desde la tabla `evt_check_products`
3. WHEN el System obtiene los productos, THE System SHALL incluir el nombre del producto desde la tabla `evt_products`
4. WHEN el System retorna los datos, THE System SHALL incluir los campos `product_id`, `product_name`, `active` y `check_product_id`
5. IF no existen productos asociados, THEN THE System SHALL retornar un array vacío con código 200
