# Requirements Document

## Introduction

Este documento define los requisitos para el **Módulo de Gestión de Paquetes y Productos Relacionados** dentro del sistema de eventos CoffeeSoft. El módulo optimiza el proceso de inserción de paquetes, asegurando la relación automática de productos y proporcionando una interfaz visual mediante checkboxes para la administración de productos incluidos en cada paquete.

## Glossary

- **System**: El módulo de gestión de paquetes y productos relacionados del sistema de eventos CoffeeSoft
- **Package**: Paquete de menú que contiene múltiples productos (platillos y bebidas)
- **Product**: Elemento individual (platillo o bebida) que puede formar parte de un paquete
- **Package Check**: Registro de control que vincula un paquete con sus productos seleccionables
- **Active Status**: Estado binario (0 o 1) que indica si un producto está habilitado o deshabilitado en un paquete
- **User**: Usuario del sistema que gestiona eventos y paquetes
- **Event Package Table**: Tabla `evt_events_package` que almacena los paquetes asignados a eventos
- **Package Check Table**: Tabla `evt_package_check` que registra el control de paquetes
- **Check Products Table**: Tabla `evt_check_products` que almacena los productos relacionados con cada paquete

## Requirements

### Requirement 1

**User Story:** Como usuario del sistema, quiero agregar un paquete al sistema y que automáticamente se inserten sus productos relacionados, para mantener coherencia entre los paquetes y los productos asociados en las tablas de control.

#### Acceptance Criteria

1. WHEN THE User inserts a package into Event Package Table, THE System SHALL maintain the original insertion flow in `evt_events_package`

2. WHEN a package is successfully inserted into Event Package Table, THE System SHALL query all products associated with that package from the package-product relationship table

3. WHEN products associated with a package are retrieved, THE System SHALL create a new record in Package Check Table with the package identifier

4. WHEN a record is created in Package Check Table, THE System SHALL insert each related product into Check Products Table with fields `package_check_id`, `product_id`, and `active` set to 1

5. WHEN inserting products into Check Products Table, THE System SHALL validate for duplicate entries and handle errors gracefully without interrupting the main package insertion flow

6. WHEN the insertion process completes, THE System SHALL return a success status with the count of products inserted

### Requirement 2

**User Story:** Como usuario del sistema, quiero visualizar los productos relacionados a un paquete con checkboxes seleccionables, para activar o desactivar manualmente los productos del paquete desde la interfaz.

#### Acceptance Criteria

1. WHEN THE User views the menu detail interface, THE System SHALL display a list of products related to the selected package with a checkbox for each product

2. WHEN the product list is rendered, THE System SHALL display all checkboxes in checked state by default for products with `active` equal to 1

3. WHEN THE User clicks on a product checkbox, THE System SHALL update the `active` field to 0 or 1 in Check Products Table based on the checkbox state

4. WHEN a checkbox state changes, THE System SHALL send an asynchronous request to update the database without reloading the entire page

5. WHEN the database update completes successfully, THE System SHALL maintain visual synchronization between the interface state and the database state

6. WHEN the product list is refreshed, THE System SHALL retrieve the current state from Check Products Table and render checkboxes accordingly

7. WHEN displaying the checkbox list, THE System SHALL apply consistent visual styling following CoffeeSoft design principles with dark theme colors (#1F2A37, #103B60, #8CC63F)

### Requirement 3

**User Story:** Como desarrollador del sistema, quiero que el módulo tenga funciones bien definidas en el modelo y controlador, para facilitar el mantenimiento y la extensibilidad del código.

#### Acceptance Criteria

1. THE System SHALL implement a model function `getProductsByPackage($package_id)` that returns all products associated with a given package

2. THE System SHALL implement a model function `insertPackageCheck($package_id)` that creates a new record in Package Check Table and returns the generated check ID

3. THE System SHALL implement a model function `insertProductCheck($check_id, $product_id)` that inserts a product into Check Products Table with `active` set to 1

4. THE System SHALL implement a model function `getProductsCheckByPackage($check_id)` that retrieves all products with their active status for a given package check

5. THE System SHALL implement a controller function `updateProductActive($check_product_id, $active)` that updates the active status of a product in Check Products Table

6. THE System SHALL implement a frontend function `renderProductCheckboxList($package_id)` that generates the HTML structure for the checkbox list with proper event handlers

7. WHEN any database operation fails, THE System SHALL log the error and return a structured error response with status code and message
