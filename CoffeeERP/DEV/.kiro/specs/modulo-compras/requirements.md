# Requirements Document - Módulo de Compras

## Introduction

El módulo de compras es un sistema integral para la gestión y control de las compras realizadas por la empresa. Permite registrar, visualizar, editar y administrar compras clasificadas por tipo (fondo fijo, corporativo, crédito), facilitando el control de gastos y la trazabilidad de las operaciones de compra.

## Glossary

- **System**: Módulo de Compras del sistema de contabilidad CoffeeSoft
- **User**: Usuario del sistema con permisos para gestionar compras
- **Purchase**: Registro de una compra realizada por la empresa
- **Product_Class**: Categoría principal de productos (cuenta mayor contable)
- **Product**: Subcuenta específica dentro de una categoría de productos
- **Purchase_Type**: Clasificación de la compra (Fondo fijo, Corporativo, Crédito)
- **Method_Pay**: Forma de pago utilizada para la compra
- **Supplier**: Proveedor que suministra productos o servicios
- **UDN**: Unidad de Negocio
- **Invoice**: Número de factura o ticket de la compra

## Requirements

### Requirement 1

**User Story:** Como usuario del sistema, quiero acceder al módulo de compras con una interfaz que muestre el resumen total y las listas de compras por tipo, para visualizar de forma clara el estado de las compras y acceder fácilmente a las opciones de gestión.

#### Acceptance Criteria

1. WHEN the User accesses the Purchase module, THE System SHALL display a dashboard with total purchases summary cards
2. WHEN the dashboard loads, THE System SHALL show four summary cards displaying total general purchases, fixed fund purchases, credit purchases, and corporate purchases
3. WHEN the User views the main interface, THE System SHALL display two action buttons labeled "Subir archivos de compras" and "Registrar nueva compra"
4. WHEN the User interacts with the filter dropdown, THE System SHALL allow filtering purchases by purchase type
5. WHEN the purchase table renders, THE System SHALL display columns for Folio, Product Class, Product, Purchase Type, Total, and Actions
6. WHEN the User views action icons in the table, THE System SHALL provide three action options: view detail, edit, and delete purchase

### Requirement 2

**User Story:** Como usuario del sistema, quiero registrar una nueva compra en el sistema mediante un formulario dinámico, para mantener actualizado el control de gastos y clasificar las compras según su tipo.

#### Acceptance Criteria

1. WHEN the User clicks "Registrar nueva compra", THE System SHALL display a modal form with all required purchase fields
2. WHEN the form loads, THE System SHALL include fields for Product Category, Product, Purchase Type, Supplier/Invoice, Subtotal, Tax, and Description
3. WHEN the User selects a Purchase Type, THE System SHALL adapt the form flow according to the selected type (Fixed Fund, Corporate, Credit)
4. WHEN the User attempts to save, THE System SHALL validate all required fields before submission
5. WHEN the User clicks "Guardar compra" with valid data, THE System SHALL register the purchase and update the main table
6. WHEN the purchase is saved successfully, THE System SHALL display a visual confirmation message

### Requirement 3

**User Story:** Como usuario del sistema, quiero editar los datos de una compra existente, para corregir o actualizar información registrada previamente.

#### Acceptance Criteria

1. WHEN the User clicks the edit icon for a purchase, THE System SHALL display a modal form with current purchase data
2. WHEN the edit form loads, THE System SHALL populate all fields with existing purchase information
3. WHEN the User modifies data, THE System SHALL allow editing of category, product, purchase type, payment method, subtotal, tax, and description fields
4. WHEN the User clicks "Editar compra", THE System SHALL validate the modified data before saving
5. WHEN validation passes, THE System SHALL update the purchase record in the database
6. WHEN the update completes, THE System SHALL display a success confirmation message

### Requirement 4

**User Story:** Como usuario del sistema, quiero eliminar una compra del registro, para mantener la base de datos limpia y actualizada.

#### Acceptance Criteria

1. WHEN the User clicks the delete icon for a purchase, THE System SHALL display a confirmation modal
2. WHEN the confirmation modal appears, THE System SHALL show two options: "Continuar" and "Cancelar"
3. WHEN the User clicks "Continuar", THE System SHALL permanently delete the purchase record from the database
4. WHEN the deletion completes successfully, THE System SHALL display a success message
5. WHEN the deletion fails, THE System SHALL display an error message with details
6. WHEN the User clicks "Cancelar", THE System SHALL close the modal without deleting the record

### Requirement 5

**User Story:** Como usuario del sistema, quiero visualizar el detalle completo de una compra seleccionada, para consultar la información del producto, tipo, método de pago y totales.

#### Acceptance Criteria

1. WHEN the User clicks the view detail icon for a purchase, THE System SHALL display a detail modal with complete purchase information
2. WHEN the detail modal loads, THE System SHALL show product information including category and product name
3. WHEN displaying purchase details, THE System SHALL include purchase type and payment method information
4. WHEN showing financial information, THE System SHALL display subtotal, tax, and total amounts
5. WHEN the detail view renders, THE System SHALL include description field and invoice number
6. WHEN displaying metadata, THE System SHALL show the date and user who performed the last update

### Requirement 6

**User Story:** Como administrador del sistema, quiero gestionar las categorías de productos (product_class), para organizar las compras según las cuentas mayores contables.

#### Acceptance Criteria

1. WHEN the User accesses the product categories section, THE System SHALL display a list of all active product classes
2. WHEN the User creates a new product class, THE System SHALL require a unique name and description
3. WHEN the User edits a product class, THE System SHALL allow modification of name and description fields
4. WHEN the User deactivates a product class, THE System SHALL change its active status to inactive
5. WHEN a product class is inactive, THE System SHALL not display it in purchase registration forms

### Requirement 7

**User Story:** Como administrador del sistema, quiero gestionar los productos (product), para mantener actualizado el catálogo de subcuentas disponibles para compras.

#### Acceptance Criteria

1. WHEN the User accesses the products section, THE System SHALL display products grouped by their product class
2. WHEN the User creates a new product, THE System SHALL require selection of a product class, name, and description
3. WHEN the User edits a product, THE System SHALL allow modification of product class, name, and description
4. WHEN the User deactivates a product, THE System SHALL change its active status to inactive
5. WHEN a product is inactive, THE System SHALL not display it in purchase registration forms

### Requirement 8

**User Story:** Como administrador del sistema, quiero gestionar los proveedores (supplier), para mantener un registro actualizado de los proveedores con los que trabaja la empresa.

#### Acceptance Criteria

1. WHEN the User accesses the suppliers section, THE System SHALL display a list of all suppliers by UDN
2. WHEN the User creates a new supplier, THE System SHALL require name, RFC, phone, email, and UDN fields
3. WHEN the User edits a supplier, THE System SHALL allow modification of all supplier information including balance
4. WHEN displaying supplier information, THE System SHALL show current balance with the supplier
5. WHEN a supplier is deactivated, THE System SHALL change its active status to inactive

### Requirement 9

**User Story:** Como usuario del sistema, quiero que el sistema calcule automáticamente el total de la compra, para evitar errores de cálculo manual.

#### Acceptance Criteria

1. WHEN the User enters a subtotal value, THE System SHALL store the value as a decimal with 2 decimal places
2. WHEN the User enters a tax value, THE System SHALL store the value as a decimal with 2 decimal places
3. WHEN subtotal and tax are entered, THE System SHALL automatically calculate the total as subtotal plus tax
4. WHEN displaying monetary values, THE System SHALL format amounts with currency symbol and thousand separators
5. WHEN saving the purchase, THE System SHALL store subtotal, tax, and total as separate fields in the database

### Requirement 10

**User Story:** Como usuario del sistema, quiero filtrar las compras por tipo y fecha, para analizar los gastos de manera específica.

#### Acceptance Criteria

1. WHEN the User selects a purchase type filter, THE System SHALL display only purchases matching the selected type
2. WHEN the User selects "Mostrar todas las compras", THE System SHALL display all purchases regardless of type
3. WHEN the filter is applied, THE System SHALL update the summary cards to reflect filtered totals
4. WHEN the User changes the filter, THE System SHALL refresh the purchase table with filtered results
5. WHEN no purchases match the filter criteria, THE System SHALL display an appropriate message
