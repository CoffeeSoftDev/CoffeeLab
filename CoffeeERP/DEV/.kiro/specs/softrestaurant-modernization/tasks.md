# Implementation Plan - SoftRestaurant Modernization

## Overview

Este plan de implementación convierte el diseño de modernización de SoftRestaurant en una serie de tareas incrementales y ejecutables. Cada tarea está diseñada para construir sobre las anteriores, asegurando progreso continuo sin dejar código huérfano.

---

## Phase 1: Project Setup and Infrastructure

- [x] 1. Setup project structure and base configuration



  - Create `softrestaurant-update/` directory
  - Create folder structure: `ctrl/`, `mdl/`, `js/`, `src/js/`, `src/components/`, `src/css/`, `layout/`
  - Copy and configure `src/js/coffeSoft.js` and `src/js/plugins.js` from CoffeeSoft framework
  - Create base `index.php` with proper includes and `<div id="root"></div>`
  - _Requirements: 1.1, 1.2, 1.3_



- [x] 1.1 Create layout files

  - Create `layout/head.php` with TailwindCSS CDN, jQuery, and required libraries
  - Create `layout/navbar.php` with navigation structure
  - Create `layout/footer.php` with scripts includes
  - Ensure all layouts include CoffeeSoft core files


  - _Requirements: 1.1, 10.1_



- [ ] 1.2 Configure database connection
  - Review existing database configuration in `conf/_CRUD.php`
  - Verify database name follows convention: `rfwsmqex_softrestaurant`
  - Test connection to ensure all tables are accessible

  - _Requirements: 1.1_

---

## Phase 2: Backend - Models Layer



- [x] 2. Create base model structure





  - Create `mdl/mdl-administracion.php` extending CRUD class
  - Implement constructor with `$bd` and `$util` properties
  - Add `lsUDN()` method for UDN selection
  - _Requirements: 3.4, 3.5, 3.6_

- [x] 2.1 Implement Administracion model methods






  - Migrate `listProductos()` using `_Select` method



  - Migrate `getProductoById()` using `_Select` method
  - Migrate `existsProductoByName()` using `_Read` method
  - Migrate `createProducto()` using `_Insert` method
  - Migrate `updateProducto()` using `_Update` method
  - Migrate `lsCategorias()` for category filters
  - Migrate `lsGrupo()` for group listings
  - Migrate `lsGrupoFogaza()` for Fogaza-specific groups
  - _Requirements: 3.5, 3.6, 4.1, 5.1-5.7_

- [x] 2.2 Create ProductosVendidos model



  - Create `mdl/mdl-productos-vendidos.php` extending CRUD
  - Migrate `listProductosVendidos()` with date filters
  - Migrate `listDesplazamiento()` for displacement calculations
  - Migrate `listFogaza()` for Fogaza-specific queries
  - Migrate `lsDiasPendientes()` for pending days tracking
  - _Requirements: 3.4, 3.5, 6.1-6.9_

- [x] 2.3 Create Salidas model


  - Create `mdl/mdl-salidas.php` extending CRUD
  - Migrate `listSalidas()` with filters
  - Migrate `getSalidaById()` method
  - Migrate `createSalida()` method
  - Migrate `updateSalida()` method
  - Migrate `deleteSalidaById()` method
  - _Requirements: 3.4, 3.5, 7.1-7.5_

- [x] 2.4 Create CostoPotencial model


  - Create `mdl/mdl-costo-potencial.php` extending CRUD
  - Migrate `calculateCostoPotencial()` method
  - Migrate `listCostoPotencial()` method
  - Migrate `createCostoPotencial()` using `_Insert`
  - Migrate `updateCostoPotencial()` using `_Update`
  - Preserve all calculation logic exactly as original
  - _Requirements: 3.4, 3.5, 4.6, 6.5-6.7_

- [x] 2.5 Create ArchivoDiarios model


  - Create `mdl/mdl-gestion-archivos.php` extending CRUD
  - Migrate `listArchivos()` method
  - Migrate `getArchivoByFecha()` method
  - Migrate `createArchivo()` method
  - Migrate `lsDiasPendientes()` for file tracking
  - _Requirements: 3.4, 3.5, 9.1-9.5_

---

## Phase 3: Backend - Controllers Layer

- [-] 3. Create Administracion controller

  - Create `ctrl/ctrl-administracion.php` extending mdl
  - Implement `init()` method returning UDN and categories
  - Implement `ls()` method with row formatting and dropdown
  - Implement `lsGrupo()` method for category view
  - Implement `rptDetallado()` method for detailed report
  - _Requirements: 3.1, 3.2, 3.3, 5.1-5.3_



- [x] 3.1 Implement Administracion CRUD methods


  - Implement `getProducto()` with status 200/404 responses
  - Implement `addProducto()` with validation and status codes
  - Implement `editProducto()` with update logic
  - Implement `statusProducto()` for activate/deactivate
  - Implement `enlaceCostsys()` for product-recipe linking
  - Add helper functions: `dropdown()`, `evaluar()`, `renderStatus()`
  - _Requirements: 3.3, 3.8, 5.4-5.7_



- [x] 3.2 Create ProductosVendidos controller



  - Create `ctrl/ctrl-productos-vendidos.php` extending mdl
  - Implement `init()` method
  - Implement `ls()` method for Soft Restaurant data
  - Implement `lsCostsys()` method for Costsys data
  - Implement `lsFogaza()` method with category filter



  - _Requirements: 3.1, 3.2, 3.3, 6.1-6.4_

- [ ] 3.3 Implement ProductosVendidos advanced methods
  - Implement `subirCostoPotencial()` with compare/upload logic
  - Implement `lsDiasPendientes()` for pending days


  - Implement `lsRegistros()` for date range queries

  - Add helper functions for data formatting
  - _Requirements: 3.3, 3.8, 6.5-6.9_

- [ ] 3.4 Create Salidas controller
  - Create `ctrl/ctrl-salidas.php` extending mdl
  - Implement `init()` method
  - Implement `ls()` method with filters
  - Implement `getSalida()` method
  - Implement `addSalida()` method

  - Implement `editSalida()` method
  - Implement `statusSalida()` method
  - _Requirements: 3.1, 3.2, 3.3, 7.1-7.5_

- [ ] 3.5 Create file upload controllers
  - Create `ctrl/ctrl-subir-productos.php` for Excel upload


  - Implement PHPSpreadsheet integration

  - Implement compare logic for existing products
  - Implement bulk insert/update logic
  - Return detailed results (added, updated, errors)
  - _Requirements: 3.3, 4.7, 5.3_

- [ ] 3.6 Create ArchivoDiarios controller
  - Create `ctrl/ctrl-soft-archivos-diarios.php`



  - Implement `ls()` for file listing
  - Implement `lsDiasPendientes()` for tracking
  - Implement file validation logic
  - _Requirements: 3.1, 3.2, 9.1-9.5_

---

## Phase 4: Frontend - Base Classes and Layouts


- [x] 4. Create Administracion frontend class

  - Create `js/administracion.js` extending Templates
  - Implement constructor with PROJECT_NAME = "administracion"
  - Implement `render()` method calling layout and filterBar

  - Implement `layout()` using `primaryLayout()` component
  - _Requirements: 2.1, 2.2, 2.3, 2.6_


- [ ] 4.1 Implement Administracion filterBar and listing
  - Implement `filterBar()` using `createfilterBar()` component
  - Add UDN select, report type select, and search button
  - Implement `ls()` method using `createTable()` component
  - Configure table with theme 'corporativo', pagination, and DataTables
  - _Requirements: 2.5, 2.6, 5.1-5.3_



- [ ] 4.2 Implement Administracion CRUD operations


  - Implement `lsGrupo()` for category grid view
  - Implement `rptDetallado()` for detailed table view


  - Implement `addProducto()` using `createModalForm()`
  - Implement `editProducto(id)` with async data fetch
  - Implement `statusProducto(id)` using `swalQuestion()`
  - Replace all `$.ajax` calls with `useFetch()`
  - _Requirements: 2.4, 2.5, 2.8, 5.4-5.7_


- [ ] 4.3 Implement Excel upload functionality
  - Implement `uploadExcel()` method with file input handling
  - Add SweetAlert confirmation for compare/upload options
  - Handle file upload with FormData
  - Display results in table format
  - Update product count display

  - _Requirements: 2.4, 2.5, 4.7, 5.3_

- [ ] 4.4 Create ProductosVendidos frontend class
  - Create `js/productos-vendidos.js` extending Templates
  - Implement constructor with PROJECT_NAME = "productosVendidos"
  - Implement `render()` method
  - Implement `layout()` using `primaryLayout()`


  - _Requirements: 2.1, 2.2, 2.3, 2.6_

- [ ] 4.5 Implement ProductosVendidos filterBar and views
  - Implement `filterBar()` with UDN, year, month, report type selectors
  - Add date range picker integration
  - Implement `lsSoftRestaurant()` method using `createTable()`
  - Implement `lsCostsys()` method for Costsys data
  - Implement `lsFogaza()` with category selector
  - _Requirements: 2.5, 2.6, 6.1-6.4_




- [ ] 4.6 Implement ProductosVendidos advanced features
  - Implement `subirCostoPotencial()` with confirmation dialog
  - Implement `tabLayout()` for results (added/not found)
  - Implement `lsDiasPendientes()` for pending days display
  - Implement `lsRegistros()` with date filter
  - Add counter display for pending days
  - _Requirements: 2.5, 2.6, 6.5-6.9_



- [ ] 4.7 Create Salidas frontend class
  - Create `js/salidas.js` extending Templates
  - Implement constructor with PROJECT_NAME = "salidas"
  - Implement `render()`, `layout()`, `filterBar()` methods
  - Implement `ls()` method using `createTable()`
  - Implement `addSalida()` using `createModalForm()`


  - Implement `editSalida(id)` with async fetch
  - Implement `statusSalida(id)` using `swalQuestion()`
  - _Requirements: 2.1-2.6, 7.1-7.5_

---

## Phase 5: Custom Components

- [ ] 5. Create ProductCard component
  - Create `src/components/product-card.js`
  - Implement `productCard(options)` method with defaults
  - Use jQuery + TailwindCSS for rendering
  - Support image, name, price, category display
  - Add click event handling
  - _Requirements: 2.7, 10.3_

- [ ] 5.1 Create ExcelUploader component
  - Create `src/components/excel-uploader.js`
  - Implement `excelUploader(options)` method
  - Add file input with drag-and-drop support
  - Add compare/upload button options
  - Implement file validation
  - Add progress indicator
  - _Requirements: 2.7, 4.7, 10.3_

- [ ] 5.2 Create CategorySelector component
  - Create `src/components/category-selector.js`
  - Implement `categorySelector(options)` method
  - Support dynamic category loading
  - Add special handling for Fogaza categories
  - Implement onChange event
  - _Requirements: 2.7, 6.3, 10.3_

---

## Phase 6: UI Enhancements and Styling

- [ ] 6. Implement consistent theming
  - Apply 'corporativo' theme to all tables
  - Ensure all forms use TailwindCSS classes
  - Implement consistent button styles
  - Add hover effects and transitions
  - _Requirements: 10.1, 10.2, 10.3_

- [ ] 6.1 Implement breadcrumb navigation
  - Add breadcrumbs to all main views
  - Use consistent format: produccion > softrestaurant > [module]
  - Style with TailwindCSS
  - _Requirements: 10.4_

- [ ] 6.2 Implement icon consistency
  - Replace all icons with icon-font library
  - Use consistent icons: icon-pencil (edit), icon-trash (delete), icon-toggle-on/off (status)
  - Add icons to buttons and actions
  - _Requirements: 10.5_

- [ ] 6.3 Implement responsive tables
  - Configure DataTables with responsive plugin
  - Set appropriate column priorities
  - Test on mobile/tablet viewports
  - _Requirements: 10.6_

- [ ] 6.4 Implement date pickers
  - Configure moment.js date range pickers
  - Add preset ranges (Today, Yesterday, Last Week, etc.)
  - Style with TailwindCSS
  - _Requirements: 10.7_

- [ ] 6.5 Implement alert messages
  - Use SweetAlert2 for all confirmations
  - Use consistent alert types (success, error, warning, info)
  - Add custom styling to match theme
  - _Requirements: 10.8_

---

## Phase 7: Integration and Data Migration

- [ ] 7. Test all endpoints
  - Test each controller method with Postman
  - Verify response format matches original
  - Verify status codes are correct
  - Document any discrepancies
  - _Requirements: 4.2, 12.1, 12.2_

- [ ] 7.1 Validate SQL queries
  - Compare query results between old and new versions
  - Verify row counts match
  - Verify data values match
  - Test with different filter combinations
  - _Requirements: 4.1, 12.3_

- [ ] 7.2 Test Excel import/export
  - Test product upload with sample files
  - Verify compare functionality works
  - Test bulk insert/update operations
  - Verify error handling for invalid files
  - _Requirements: 4.7, 12.5_

- [ ] 7.3 Test Costo Potencial calculations
  - Verify displacement calculations are correct
  - Test compare before upload functionality
  - Verify products added/not found logic
  - Compare results with original system
  - _Requirements: 4.6, 6.5-6.7_

- [ ] 7.4 Test file tracking system
  - Verify pending days calculation
  - Test file upload tracking
  - Verify missing file detection
  - Test date range queries
  - _Requirements: 9.1-9.5_

---

## Phase 8: Testing and Quality Assurance

- [ ] 8. Perform functional testing per module
  - Test Administracion: all CRUD operations, filters, Excel upload
  - Test ProductosVendidos: all report types, filters, Costo Potencial
  - Test Salidas: CRUD operations, filters, status changes
  - Test Desplazamientos: category views, detail views
  - Test GestionArchivos: file tracking, pending days
  - _Requirements: 12.1-12.6_

- [ ] 8.1 Perform integration testing
  - Test complete user flows (add product → view in reports)
  - Test data consistency across modules
  - Test concurrent operations
  - Test error scenarios
  - _Requirements: 12.1-12.6_

- [ ] 8.2 Perform regression testing
  - Verify all original features still work
  - Test edge cases from original system
  - Verify calculations match original
  - Test with production-like data volumes
  - _Requirements: 12.1-12.6_

- [ ]* 8.3 Performance testing
  - Test table loading with large datasets
  - Test Excel upload with large files
  - Test report generation speed
  - Optimize slow queries if needed
  - _Requirements: 12.1-12.6_

---

## Phase 9: Documentation and Deployment

- [ ] 9. Create migration documentation
  - Document folder structure changes
  - Document file naming changes
  - Create "before → after" mapping for each module
  - Document new components created
  - _Requirements: 11.5, 11.6, 11.7_

- [ ] 9.1 Create technical documentation
  - Document all custom components
  - Document API endpoints and parameters
  - Document database schema changes (if any)
  - Create developer setup guide
  - _Requirements: 11.1-11.7_

- [ ] 9.2 Create user documentation
  - Document any UI changes
  - Create user guide for new features
  - Document keyboard shortcuts
  - Create troubleshooting guide
  - _Requirements: 11.5_

- [ ] 9.3 Create deployment checklist
  - Database backup procedure
  - File backup procedure
  - Deployment steps
  - Rollback procedure
  - Post-deployment verification
  - _Requirements: 12.1-12.6_

- [ ]* 9.4 Prepare training materials
  - Create demo environment
  - Prepare training presentation
  - Create video tutorials
  - Schedule training sessions
  - _Requirements: 11.5_

---

## Phase 10: Deployment and Validation

- [ ] 10. Deploy to staging environment
  - Copy files to staging server
  - Configure database connection
  - Test all functionality in staging
  - Fix any environment-specific issues
  - _Requirements: 12.1-12.6_

- [ ] 10.1 User acceptance testing
  - Conduct UAT sessions with key users
  - Document feedback and issues
  - Prioritize and fix critical issues
  - Re-test after fixes
  - _Requirements: 12.1-12.6_

- [ ] 10.2 Deploy to production
  - Schedule deployment window
  - Backup current production system
  - Deploy new version
  - Verify all functionality works
  - Monitor for errors
  - _Requirements: 12.1-12.6_

- [ ] 10.3 Post-deployment monitoring
  - Monitor error logs for 48 hours
  - Monitor performance metrics
  - Collect user feedback
  - Address any issues immediately
  - _Requirements: 12.1-12.6_

---

## Summary

**Total Tasks**: 10 major phases with 60+ subtasks
**Estimated Duration**: 8 weeks
**Critical Path**: Backend Models → Controllers → Frontend Classes → Testing
**Dependencies**: Each phase builds on previous phases
**Risk Mitigation**: Incremental approach with testing at each phase

## Notes

- All tasks preserve existing functionality
- No database schema changes required
- All SQL queries adapted to CRUD methods
- All endpoints maintain same opc values
- All calculations preserved exactly
- Excel import/export functionality maintained
- Integration with external systems preserved
