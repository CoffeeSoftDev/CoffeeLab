# Implementation Plan

- [x] 1. Set up project structure and core files


  - Create directory structure (ctrl/, mdl/, js/)
  - Create index.php with root container
  - Import CoffeeSoft libraries (coffeeSoft.js, plugins.js)
  - _Requirements: 15.1, 15.2_




- [ ] 2. Implement database models (mdl-campaign.php)
  - [ ] 2.1 Create base model structure extending CRUD
    - Define class mdl extends CRUD
    - Initialize $bd and $util properties

    - Require _CRUD.php and _Utileria.php
    - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5_

  - [ ] 2.2 Implement campaign data access methods
    - Create listCampaigns() method with filters (udn_id, red_social_id, active)
    - Create getCampaignById() method
    - Create createCampaign() method

    - Create updateCampaign() method
    - Create getLastCampaignId() method for auto-naming
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

  - [ ] 2.3 Implement announcement data access methods
    - Create listAnnouncements() method with filters (campaña_id, fecha_inicio, fecha_fin)
    - Create getAnnouncementById() method

    - Create createAnnouncement() method
    - Create updateAnnouncement() method
    - Create captureResults() method to update total_clics and total_monto
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_


  - [x] 2.4 Implement catalog data access methods


    - Create lsTypes() method for tipo_anuncio
    - Create lsClassifications() method for clasificacion_anuncio
    - Create lsRedSocial() method for red_social
    - Create lsUDN() method for unidades de negocio

    - _Requirements: 8.1, 9.1, 11.1, 11.2_

- [ ] 3. Implement campaign controller (ctrl-campaign.php)
  - [ ] 3.1 Create base controller structure
    - Define class ctrl extends mdl
    - Implement session validation
    - Implement role-based access control

    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

  - [ ] 3.2 Implement init() method
    - Load UDN list
    - Load red_social list
    - Load tipo_anuncio list
    - Load clasificacion_anuncio list

    - Return JSON with all catalogs
    - _Requirements: 11.1, 11.2_

  - [ ] 3.3 Implement campaign CRUD methods
    - Create lsCampaigns() method with filterBar data
    - Create getCampaign() method by id
    - Create addCampaign() method with auto-naming logic

    - Create editCampaign() method
    - Create statusCampaign() method to toggle active
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

  - [x] 3.4 Implement announcement CRUD methods


    - Create lsAnnouncements() method with campaña_id filter


    - Create getAnnouncement() method by id
    - Create addAnnouncement() method
    - Create editAnnouncement() method
    - Create captureResults() method with CPC calculation
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 3.1, 3.2, 3.3, 3.4, 3.5_


  - [ ] 3.5 Implement validation methods
    - Validate required fields
    - Validate date ranges (fecha_fin >= fecha_inicio)
    - Validate numeric values (total_monto > 0, total_clics >= 0)

    - Return standardized error responses
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5_

- [ ] 4. Implement frontend campaign module (campaign.js)
  - [ ] 4.1 Create App class structure
    - Define class App extends Templates
    - Initialize api variable

    - Implement constructor with PROJECT_NAME
    - Implement init() method to load catalogs
    - _Requirements: 1.1_

  - [ ] 4.2 Implement layout and navigation
    - Create layout() method with primaryLayout
    - Implement tabLayout with tabs: Campañas, Anuncios

    - Create filterBar() method with UDN, red social, estado filters
    - _Requirements: 1.1, 11.3, 11.4, 11.5_

  - [ ] 4.3 Implement campaign management methods
    - Create lsCampaigns() method with createTable
    - Create addCampaign() method with createModalForm
    - Create editCampaign(id) method with autofill
    - Create statusCampaign(id, active) method with swalQuestion
    - Create jsonCampaign() method with form fields
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

  - [ ] 4.4 Implement announcement management methods
    - Create lsAnnouncements(campaña_id) method
    - Create addAnnouncement(campaña_id) method
    - Create editAnnouncement(id) method
    - Create captureResults(id) method with CPC display
    - Create jsonAnnouncement() method with form fields
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

  - [ ] 4.5 Implement client-side validations
    - Validate required fields before submit
    - Validate date ranges
    - Validate numeric inputs
    - Show error messages with alert component
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5_

- [ ] 5. Implement dashboard models (mdl-dashboard.php)
  - [ ] 5.1 Create dashboard data access methods
    - Create getKPIs() method (inversión total, clics totales, CPC promedio, CAC promedio)
    - Create getMonthlyTrends() method for line charts
    - Create getComparativeData() method for bar charts (año actual vs anterior)
    - Create getTopCampaigns() method for ranking
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

  - [ ] 5.2 Implement metric calculation methods
    - Create calculateCPC() method (total_monto / total_clics)
    - Create calculateCAC() method (inversión / número de clientes)
    - Create calculateAverageCPC() method for campaigns
    - _Requirements: 3.2, 13.1, 13.2_

- [ ] 6. Implement dashboard controller (ctrl-dashboard.php)
  - [ ] 6.1 Create dashboard API methods
    - Implement getDashboardData() method with filters (año, udn_id, red_social_id)
    - Format data for Chart.js (labels, datasets)
    - Calculate KPIs and return JSON
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

  - [ ] 6.2 Implement filter handling
    - Process año, mes, udn_id, red_social_id filters
    - Return filtered data for charts and KPIs
    - _Requirements: 11.3, 11.4, 11.5_

- [ ] 7. Implement dashboard frontend (dashboard.js)
  - [ ] 7.1 Create CampaignDashboard class
    - Define class CampaignDashboard extends Templates
    - Implement render() method
    - Implement layout() method with dashboardComponent
    - _Requirements: 4.1_

  - [ ] 7.2 Implement filter bar
    - Create filterBar() method with año, mes, UDN, red social selects
    - Implement onChange events to reload dashboard
    - Set default values (current year, current month)
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_

  - [ ] 7.3 Implement KPI cards
    - Create showCards() method with infoCard component
    - Display: Inversión Total, Total Clics, CPC Promedio, CAC Promedio
    - Format currency values with formatPrice()
    - _Requirements: 4.1, 4.2_

  - [ ] 7.4 Implement charts
    - Create renderCharts() method
    - Implement linearChart for monthly trends
    - Implement barChart for year-over-year comparison
    - Use Chart.js with corporate colors (#103B60, #8CC63F)
    - _Requirements: 4.3, 4.4, 4.5, 14.5_

- [ ] 8. Implement summary models (mdl-summary.php)
  - [ ] 8.1 Create summary data access methods
    - Create getCampaignSummary() method with filters (año, mes, udn_id, red_social_id)
    - Join campaña and anuncio tables
    - Calculate totals per campaign (total_clics, total_monto, CPC promedio)
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

  - [ ] 8.2 Implement aggregation methods
    - Create calculateCampaignTotals() method
    - Create calculateMonthlySummary() method
    - Group announcements by campaign
    - _Requirements: 13.2, 13.5_

- [ ] 9. Implement summary controller (ctrl-summary.php)
  - [ ] 9.1 Create summary API methods
    - Implement lsSummary() method with filterBar data
    - Format data for createTable component
    - Calculate CPC per announcement and campaign averages
    - Return row array with grouped data
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

  - [ ] 9.2 Implement data formatting
    - Format dates with formatSpanishDate()
    - Format currency with evaluar()
    - Calculate duración (fecha_fin - fecha_inicio)
    - _Requirements: 5.2_

- [ ] 10. Implement summary frontend (summary.js)
  - [ ] 10.1 Create CampaignSummary class
    - Define class CampaignSummary extends Templates
    - Implement render() method
    - Implement layout() method
    - _Requirements: 5.1_

  - [ ] 10.2 Implement filter bar
    - Create filterBar() method with año, mes, UDN, red social selects
    - Implement onChange events to reload summary
    - _Requirements: 5.1, 11.3, 11.4, 11.5_

  - [ ] 10.3 Implement summary table
    - Create lsSummary() method with createTable
    - Configure table with grouped rows by campaign
    - Display: estrategia, nombre anuncio, duración, tipo, inversión, clics, CPC
    - Show campaign totals and averages
    - _Requirements: 5.2, 5.3, 5.4, 5.5_

- [ ] 11. Implement history models (mdl-history.php)


  - [x] 11.1 Create CPC history data access methods


    - Create getCPCHistory() method with filters (año, udn_id, red_social_id)
    - Group by month (1-12)
    - Calculate monthly: inversión total, total clics, CPC promedio
    - Use formula: (inversión / resultado) * 1000
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_


  - [ ] 11.2 Create CAC history data access methods
    - Create getCACHistory() method with filters (año, udn_id, red_social_id)
    - Group by month (1-12)
    - Calculate monthly: inversión total, número de clientes, CAC
    - Use formula: inversión / número de clientes
    - Join with pedidos table to get client count
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [ ] 12. Implement history controller (ctrl-history.php)
  - [ ] 12.1 Create history API methods
    - Implement lsCPC() method with filterBar data
    - Implement lsCAC() method with filterBar data
    - Format data for createTable component
    - Return 12-month array with calculated metrics
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 7.1, 7.2, 7.3, 7.4, 7.5_

  - [ ] 12.2 Implement metric calculations
    - Calculate CPC promedio per month
    - Calculate CAC per month
    - Handle months with no data (return 0 or "Sin datos")
    - _Requirements: 6.3, 7.2, 13.3, 13.4_

- [ ] 13. Implement history frontend (history.js)
  - [x] 13.1 Create AnnualHistory class

    - Define class AnnualHistory extends Templates


    - Implement render() method
    - Implement layout() method with tabLayout (CPC/CAC tabs)
    - _Requirements: 6.1, 7.1_

  - [x] 13.2 Implement filter bar

    - Create filterBar() method with año, UDN, red social, tipo reporte selects
    - Implement onChange events to reload history
    - _Requirements: 6.1, 7.1, 11.3, 11.4, 11.5_

  - [x] 13.3 Implement CPC history table

    - Create lsCPC() method with createTable


    - Display columns: Mes, Inversión Total, Total Clics, CPC Promedio
    - Show 12 months of data
    - _Requirements: 6.2, 6.3, 6.4, 6.5_

  - [ ] 13.4 Implement CAC history table
    - Create lsCAC() method with createTable

    - Display columns: Mes, Inversión Total, Número de Clientes, CAC
    - Show 12 months of data
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [ ] 14. Implement admin models (mdl-admin.php)
  - [ ] 14.1 Create tipo_anuncio data access methods
    - Create lsTypes() method with active filter


    - Create getTypeById() method
    - Create createType() method
    - Create updateType() method
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

  - [ ] 14.2 Create clasificacion_anuncio data access methods
    - Create lsClassifications() method with active filter
    - Create getClassificationById() method
    - Create createClassification() method
    - Create updateClassification() method
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

- [ ] 15. Implement admin controller (ctrl-admin.php)
  - [ ] 15.1 Create tipo_anuncio CRUD methods
    - Implement lsTypes() method with filterBar data
    - Implement getType() method by id
    - Implement addType() method
    - Implement editType() method
    - Implement statusType() method to toggle active
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

  - [ ] 15.2 Create clasificacion_anuncio CRUD methods
    - Implement lsClassifications() method with filterBar data
    - Implement getClassification() method by id
    - Implement addClassification() method
    - Implement editClassification() method
    - Implement statusClassification() method to toggle active
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

- [ ] 16. Implement admin frontend (admin.js)
  - [ ] 16.1 Create Admin class
    - Define class Admin extends Templates
    - Implement render() method
    - Implement layout() method with tabLayout (Tipos/Clasificaciones tabs)
    - _Requirements: 8.1, 9.1_

  - [ ] 16.2 Implement tipo_anuncio management
    - Create filterBarTypes() method with estado filter
    - Create lsTypes() method with createTable
    - Create addType() method with createModalForm
    - Create editType(id) method with autofill
    - Create statusType(id, active) method with swalQuestion
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

  - [ ] 16.3 Implement clasificacion_anuncio management
    - Create filterBarClassifications() method with estado filter
    - Create lsClassifications() method with createTable
    - Create addClassification() method with createModalForm
    - Create editClassification(id) method with autofill
    - Create statusClassification(id, active) method with swalQuestion
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

- [ ] 17. Implement main index.php
  - [ ] 17.1 Create HTML structure
    - Add DOCTYPE and HTML5 structure
    - Include meta tags and viewport
    - Link TailwindCSS CDN
    - Create root container div
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5_

  - [ ] 17.2 Import JavaScript dependencies
    - Import jQuery
    - Import Chart.js
    - Import CoffeeSoft libraries (coffeeSoft.js, plugins.js)
    - Import module scripts (campaign.js, dashboard.js, summary.js, history.js, admin.js)
    - _Requirements: 15.1_

  - [ ] 17.3 Initialize application
    - Create script tag with app initialization
    - Call app.init() on document ready
    - _Requirements: 1.1_

- [ ] 18. Implement responsive design
  - [ ] 18.1 Configure TailwindCSS classes
    - Use responsive grid layouts (grid-cols-1 md:grid-cols-2 lg:grid-cols-4)
    - Implement responsive tables with horizontal scroll
    - Use responsive text sizes (text-sm md:text-base)
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5_

  - [ ] 18.2 Optimize charts for mobile
    - Configure Chart.js responsive options
    - Set maintainAspectRatio: false for flexible sizing
    - Adjust font sizes for mobile devices
    - _Requirements: 14.2, 14.5_

- [ ] 19. Implement security measures
  - [ ] 19.1 Add input sanitization
    - Use $this->util->sql() for all database inputs
    - Sanitize file uploads (validate extensions, size)
    - Escape HTML output to prevent XSS
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5_

  - [ ] 19.2 Implement role-based access control
    - Validate $_SESSION['ROL'] in all controller methods
    - Return 403 error for unauthorized access
    - Hide edit/delete buttons for view-only roles in frontend
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

  - [ ] 19.3 Add CSRF protection
    - Generate CSRF token in session
    - Validate token on form submissions
    - Return error if token is invalid
    - _Requirements: 10.4_

- [ ] 20. Integration and final testing
  - [ ] 20.1 Test complete campaign workflow
    - Create campaign with auto-generated name
    - Add multiple announcements to campaign
    - Capture results and verify CPC calculation
    - Verify data appears in dashboard
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 2.1, 2.2, 2.3, 2.4, 2.5, 3.1, 3.2, 3.3, 3.4, 3.5_

  - [ ] 20.2 Test reporting modules
    - Generate campaign summary with filters
    - Generate CPC annual history
    - Generate CAC annual history
    - Verify calculations are correct
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 6.1, 6.2, 6.3, 6.4, 6.5, 7.1, 7.2, 7.3, 7.4, 7.5_

  - [ ] 20.3 Test admin module
    - Create, edit, and deactivate tipo_anuncio
    - Create, edit, and deactivate clasificacion_anuncio
    - Verify inactive items don't appear in selects
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 9.1, 9.2, 9.3, 9.4, 9.5_

  - [ ] 20.4 Test role-based access
    - Login as "Jefa de publicidad" and verify full access
    - Login as "Jefe de atención a clientes" and verify view-only access
    - Login as "Auxiliar de marketing" and verify view-only access
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

  - [ ] 20.5 Test responsive design
    - Test on desktop (1920x1080)
    - Test on tablet (768x1024)
    - Test on mobile (375x667)
    - Verify all components adapt correctly
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5_
