# Design Document - Módulo de Compras

## Overview

El módulo de compras es un sistema completo de gestión de compras que permite registrar, visualizar, editar y administrar las compras realizadas por la empresa. El sistema está diseñado siguiendo la arquitectura MVC del framework CoffeeSoft, con una interfaz moderna usando TailwindCSS y jQuery.

### Key Features

- Dashboard con resumen de totales por tipo de compra
- Registro de compras con formulario dinámico
- Gestión completa de categorías de productos (cuentas mayores)
- Gestión de productos (subcuentas)
- Gestión de proveedores con control de saldos
- Filtros dinámicos por tipo de compra
- Cálculo automático de totales (subtotal + impuesto)
- Acciones CRUD completas (crear, leer, actualizar, eliminar)

## Architecture

### System Components

```
contabilidad/captura/
├── js/
│   └── compras.js          # Frontend principal (extiende Templates)
├── ctrl/
│   └── ctrl-compras.php    # Controlador de compras
└── mdl/
    ├── mdl-compras.php     # Modelo de compras
    └── mdl-proveedores.php # Modelo de proveedores
```

### Technology Stack

- **Frontend**: jQuery + CoffeeSoft Framework + TailwindCSS
- **Backend**: PHP 7.4+
- **Database**: MySQL
- **Architecture Pattern**: MVC (Model-View-Controller)


## Components and Interfaces

### Frontend Components (compras.js)

#### Class Structure

```javascript
class App extends Templates {
    constructor(link, div_modulo)
    PROJECT_NAME = "compras"
    
    // Main methods
    render()
    layout()
    filterBar()
    ls()
    addPurchase()
    editPurchase(id)
    deletePurchase(id)
    viewPurchase(id)
}

class AdminPurchase extends App {
    // Admin tabs management
    lsProductClass()
    lsProducts()
    lsSuppliers()
    
    // Product Class CRUD
    addProductClass()
    editProductClass(id)
    statusProductClass(id, active)
    
    // Product CRUD
    addProduct()
    editProduct(id)
    statusProduct(id, active)
    
    // Supplier CRUD
    addSupplier()
    editSupplier(id)
    statusSupplier(id, active)
}
```


#### UI Components Used

- **primaryLayout**: Layout principal con filterBar y container
- **tabLayout**: Pestañas para Compras y Administrador
- **createfilterBar**: Barra de filtros con selects dinámicos
- **createTable**: Tablas con paginación y acciones
- **createModalForm**: Formularios modales para CRUD
- **swalQuestion**: Confirmaciones de eliminación
- **infoCard**: Tarjetas de resumen de totales

### Backend Controllers

#### ctrl-compras.php

```php
class ctrl extends mdl {
    init()                    // Inicializa filtros (UDN, tipos, métodos pago)
    ls()                      // Lista compras con filtros
    getPurchase()             // Obtiene una compra por ID
    addPurchase()             // Registra nueva compra
    editPurchase()            // Actualiza compra existente
    deletePurchase()          // Elimina compra
    
    // Admin methods
    lsProductClass()          // Lista categorías de productos
    addProductClass()         // Crea categoría
    editProductClass()        // Actualiza categoría
    statusProductClass()      // Cambia estado categoría
    
    lsProducts()              // Lista productos
    addProduct()              // Crea producto
    editProduct()             // Actualiza producto
    statusProduct()           // Cambia estado producto
    
    lsSuppliers()             // Lista proveedores
    addSupplier()             // Crea proveedor
    editSupplier()            // Actualiza proveedor
    statusSupplier()          // Cambia estado proveedor
}
```


### Backend Models

#### mdl-compras.php

```php
class mdl extends CRUD {
    // Purchase operations
    listPurchases($array)              // Lista compras con filtros
    getPurchaseById($id)               // Obtiene compra por ID
    createPurchase($array)             // Inserta nueva compra
    updatePurchase($array)             // Actualiza compra
    deletePurchaseById($id)            // Elimina compra
    
    // Product Class operations
    listProductClass($array)           // Lista categorías
    getProductClassById($id)           // Obtiene categoría por ID
    createProductClass($array)         // Inserta categoría
    updateProductClass($array)         // Actualiza categoría
    lsProductClass()                   // Lista para selects
    
    // Product operations
    listProducts($array)               // Lista productos
    getProductById($id)                // Obtiene producto por ID
    createProduct($array)              // Inserta producto
    updateProduct($array)              // Actualiza producto
    lsProducts($productClassId)        // Lista productos por categoría
    
    // Catalog operations
    lsPurchaseTypes()                  // Lista tipos de compra
    lsMethodPay()                      // Lista métodos de pago
    lsUDN()                            // Lista unidades de negocio
}
```

#### mdl-proveedores.php

```php
class mdl extends CRUD {
    listSuppliers($array)              // Lista proveedores
    getSupplierById($id)               // Obtiene proveedor por ID
    createSupplier($array)             // Inserta proveedor
    updateSupplier($array)             // Actualiza proveedor
    lsSuppliers($udnId)                // Lista proveedores por UDN
    updateSupplierBalance($array)      // Actualiza saldo proveedor
}
```


## Data Models

### Database Schema

#### Table: purchase

```sql
CREATE TABLE rfwsmqex_contabilidad.purchase (
    id INT PRIMARY KEY AUTO_INCREMENT,
    udn_id INT NOT NULL,
    product_class_id INT NOT NULL,
    product_id INT NOT NULL,
    supplier_id INT,
    purchase_type_id INT NOT NULL,
    method_pay_id INT NOT NULL,
    total DECIMAL(12,2) NOT NULL,
    subtotal DECIMAL(12,2) NOT NULL,
    tax DECIMAL(12,2) NOT NULL,
    description TEXT,
    operation_date DATE NOT NULL,
    active TINYINT DEFAULT 1,
    FOREIGN KEY (udn_id) REFERENCES udn(id),
    FOREIGN KEY (product_class_id) REFERENCES product_class(id),
    FOREIGN KEY (product_id) REFERENCES product(id),
    FOREIGN KEY (supplier_id) REFERENCES supplier(id),
    FOREIGN KEY (purchase_type_id) REFERENCES purchase_type(id),
    FOREIGN KEY (method_pay_id) REFERENCES method_pay(id)
);
```

#### Table: product_class

```sql
CREATE TABLE rfwsmqex_contabilidad.product_class (
    id INT PRIMARY KEY AUTO_INCREMENT,
    udn_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    active TINYINT DEFAULT 1,
    FOREIGN KEY (udn_id) REFERENCES udn(id)
);
```

#### Table: product

```sql
CREATE TABLE rfwsmqex_contabilidad.product (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_class_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    active TINYINT DEFAULT 1,
    FOREIGN KEY (product_class_id) REFERENCES product_class(id)
);
```


#### Table: supplier

```sql
CREATE TABLE rfwsmqex_contabilidad.supplier (
    id INT PRIMARY KEY AUTO_INCREMENT,
    udn_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    rfc TEXT,
    phone CHAR(5),
    email TEXT,
    balance DECIMAL(12,2) DEFAULT 0.00,
    active TINYINT DEFAULT 1,
    FOREIGN KEY (udn_id) REFERENCES udn(id)
);
```

#### Table: purchase_type

```sql
CREATE TABLE rfwsmqex_contabilidad.purchase_type (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    active TINYINT DEFAULT 1
);

-- Data
INSERT INTO purchase_type (name) VALUES 
('Fondo fijo'),
('Corporativo'),
('Crédito');
```

#### Table: method_pay

```sql
CREATE TABLE rfwsmqex_contabilidad.method_pay (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    active TINYINT DEFAULT 1
);

-- Data
INSERT INTO method_pay (name) VALUES 
('Efectivo'),
('Tarjeta de débito'),
('Tarjeta de crédito'),
('Transferencia'),
('Almacén del área compras');
```

### Data Flow

1. **Purchase Registration Flow**:
   - User selects UDN → Loads product classes
   - User selects product class → Loads products
   - User selects purchase type → Adapts form fields
   - User enters subtotal + tax → System calculates total
   - User saves → System validates and inserts record

2. **Purchase Listing Flow**:
   - System loads purchases by UDN
   - User applies filters → System refreshes table
   - System calculates totals by purchase type
   - System displays summary cards


## Error Handling

### Frontend Validation

- **Required Fields**: All mandatory fields validated before submission
- **Numeric Fields**: Subtotal and tax must be valid decimal numbers
- **Select Fields**: Must have a valid selection (not placeholder)
- **Date Fields**: operation_date must be valid date format

### Backend Validation

```php
// Purchase validation
if (empty($_POST['product_class_id'])) {
    return ['status' => 400, 'message' => 'Categoría de producto requerida'];
}

if (empty($_POST['product_id'])) {
    return ['status' => 400, 'message' => 'Producto requerido'];
}

if (!is_numeric($_POST['subtotal']) || $_POST['subtotal'] <= 0) {
    return ['status' => 400, 'message' => 'Subtotal inválido'];
}

// Calculate total
$_POST['total'] = $_POST['subtotal'] + $_POST['tax'];
```

### Database Error Handling

- **Foreign Key Violations**: Validate related records exist before insert
- **Duplicate Prevention**: Check for duplicate entries where applicable
- **Transaction Rollback**: Use transactions for multi-table operations
- **Soft Deletes**: Use active flag instead of hard deletes

### User Feedback

```javascript
// Success messages
alert({ 
    icon: "success", 
    text: "Compra registrada correctamente" 
});

// Error messages
alert({ 
    icon: "error", 
    text: response.message,
    btn1: true,
    btn1Text: "Ok"
});

// Confirmation dialogs
this.swalQuestion({
    opts: {
        title: "¿Eliminar compra?",
        text: "Esta acción no se puede deshacer",
        icon: "warning"
    }
});
```


## Testing Strategy

### Unit Testing

#### Frontend Tests
- Form validation logic
- Total calculation (subtotal + tax)
- Filter application
- Data formatting (currency, dates)

#### Backend Tests
- CRUD operations for each entity
- Data validation rules
- SQL query correctness
- Foreign key relationships

### Integration Testing

1. **Purchase Registration Flow**
   - Select UDN → Verify product classes load
   - Select product class → Verify products load
   - Enter amounts → Verify total calculation
   - Submit form → Verify database insert
   - Verify table refresh with new record

2. **Purchase Edit Flow**
   - Click edit → Verify form populates
   - Modify data → Verify validation
   - Save changes → Verify database update
   - Verify table reflects changes

3. **Purchase Delete Flow**
   - Click delete → Verify confirmation modal
   - Confirm delete → Verify database update (active = 0)
   - Verify record removed from table

4. **Admin CRUD Flows**
   - Test product class CRUD operations
   - Test product CRUD operations
   - Test supplier CRUD operations
   - Verify cascading effects

### User Acceptance Testing

- Verify dashboard totals match database sums
- Test all filter combinations
- Verify form validations prevent invalid data
- Test responsive design on different screen sizes
- Verify all action buttons work correctly
- Test error messages display appropriately

### Performance Testing

- Table pagination with large datasets (1000+ records)
- Filter response time
- Form submission speed
- Dashboard load time with calculations


## UI/UX Design Decisions

### Layout Structure

```
┌─────────────────────────────────────────────────────────┐
│  Header: "📦 Módulo de Compras"                         │
├─────────────────────────────────────────────────────────┤
│  Tabs: [Compras] [Administrador]                        │
├─────────────────────────────────────────────────────────┤
│  Summary Cards:                                          │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │ Total    │ │ Fondo    │ │ Crédito  │ │ Corporat.│  │
│  │ $13,826  │ │ $1,635   │ │ $2,758   │ │ $9,432   │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘  │
├─────────────────────────────────────────────────────────┤
│  Actions: [📤 Subir archivos] [➕ Registrar compra]    │
│  Filter:  [Mostrar todas ▼]                             │
├─────────────────────────────────────────────────────────┤
│  Table: Folio | Clase | Producto | Tipo | Total | ⚙️   │
│  ─────────────────────────────────────────────────────  │
│  #203713 | Gastos admin | Internet | Corp | $1,100 | ⚙️│
│  ...                                                     │
└─────────────────────────────────────────────────────────┘
```

### Color Scheme (CoffeeSoft Theme)

- **Primary**: `#103B60` (Azul corporativo)
- **Success**: `#8CC63F` (Verde acción)
- **Background**: `#EAEAEA` (Gris claro)
- **Dark Mode**: `#1F2A37` (Fondo oscuro)
- **Text**: `#FFFFFF` (Texto claro en dark mode)

### Form Design

- **Modal Forms**: Centered, responsive, with close button
- **Field Layout**: 2-column grid on desktop, single column on mobile
- **Input Styling**: TailwindCSS classes with focus states
- **Button Placement**: Primary action right-aligned, secondary left-aligned
- **Validation Feedback**: Red border + error message below field

### Table Design

- **Theme**: `corporativo` (dark blue header)
- **Pagination**: 15 rows per page
- **Actions Column**: Dropdown menu with icons
- **Responsive**: Horizontal scroll on mobile
- **Hover Effects**: Row highlight on hover
- **Currency Format**: Right-aligned with $ symbol

### Accessibility

- **Labels**: All inputs have descriptive labels
- **Required Fields**: Marked with asterisk (*)
- **Error Messages**: Clear, actionable text
- **Keyboard Navigation**: Tab order follows logical flow
- **Color Contrast**: WCAG AA compliant


## Security Considerations

### Authentication & Authorization

- **Session Validation**: All requests validate active user session
- **UDN Filtering**: Users only see data for their assigned UDN
- **Role-Based Access**: Admin tab only visible to authorized users
- **CSRF Protection**: Forms include CSRF tokens

### Input Sanitization

```php
// All POST data sanitized using util->sql()
$data = $this->util->sql($_POST);

// Numeric validation
if (!is_numeric($_POST['subtotal'])) {
    return ['status' => 400, 'message' => 'Invalid input'];
}

// SQL injection prevention
$this->_Select([
    'where' => 'id = ?',
    'data' => [$id]  // Prepared statements
]);
```

### Data Protection

- **Soft Deletes**: Records marked inactive, not deleted
- **Audit Trail**: operation_date tracks when purchases created
- **Balance Tracking**: Supplier balances updated transactionally
- **Decimal Precision**: Financial amounts stored as DECIMAL(12,2)

## Performance Optimization

### Database Optimization

- **Indexes**: Primary keys and foreign keys indexed
- **Query Optimization**: Use JOINs instead of multiple queries
- **Pagination**: Limit results to 15 rows per page
- **Caching**: Store catalog data (types, methods) in session

### Frontend Optimization

- **Lazy Loading**: Load product lists only when category selected
- **Debouncing**: Delay filter application on rapid changes
- **Minimal DOM Updates**: Update only changed table rows
- **Asset Compression**: Minified CSS/JS in production

### Code Reusability

- **Shared Components**: Use CoffeeSoft framework components
- **DRY Principle**: Reuse CRUD patterns across entities
- **Template Inheritance**: AdminPurchase extends App class
- **Utility Functions**: formatPrice(), formatSpanishDate()
