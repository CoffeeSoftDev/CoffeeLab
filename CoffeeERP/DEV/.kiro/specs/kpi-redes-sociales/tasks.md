# Implementation Plan

- [x] 1. Set up project structure and database schema





  - Create directory structure for kpi module (ctrl, mdl, js folders)
  - Create index.php with root container
  - Create database tables: kpi_social_networks, kpi_metrics, kpi_social_captures, kpi_metric_movements
  - Add necessary indexes and foreign keys
  - _Requirements: 1.1, 2.1, 3.1, 4.1_


- [ ] 2. Implement backend model (mdl-campaign.php)
- [ ] 2.1 Create base model structure
  - Extend CRUD class and configure database connection
  - Implement lsSocialNetworks() for filter selects
  - Implement lsMetricsByNetwork() for dynamic metric loading
  - _Requirements: 6.1, 6.3_

- [ ] 2.2 Implement social networks CRUD methods
  - Code listSocialNetworks() with active filter
  - Code getSocialNetworkById() for edit operations
  - Code createSocialNetwork() with validation
  - Code updateSocialNetwork() for edits and status changes
  - Code existsSocialNetworkByName() for duplicate validation
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7_

- [ ] 2.3 Implement metrics CRUD methods
  - Code listMetrics() with active filter and social network join
  - Code getMetricById() for edit operations
  - Code createMetric() with validation
  - Code updateMetric() for edits and status changes
  - Code existsMetricByName() for duplicate validation
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7_

- [ ] 2.4 Implement capture and movements methods
  - Code listCaptures() with filters (UDN, year, month, social network)
  - Code getCaptureById() with movements join
  - Code createCapture() with uniqueness validation
  - Code updateCapture() for modifications
  - Code existsCapture() to prevent duplicates
  - Code createMetricMovement() for individual metric values
  - Code updateMetricMovement() for edits
  - Code deleteMetricMovement() for removals
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7_

- [ ] 2.5 Implement reporting methods
  - Code getAnnualReport() with monthly aggregation
  - Code getMonthlyComparative() with previous month comparison
  - Code getAnnualComparative() with previous year comparison
  - Code getDashboardMetrics() for KPI cards
  - Code getTrendData() for interaction trends chart
  - Code getComparativeData() for summary table
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 2.8, 2.9, 2.10, 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_

- [ ] 3. Implement backend controller (ctrl-campaign.php)
- [ ] 3.1 Create base controller structure
  - Extend mdl class and implement init() method
  - Return lists for filters: lsSocialNetworks, lsMetrics, lsUDN
  - _Requirements: 6.1_

- [ ] 3.2 Implement social networks controller methods
  - Code lsSocialNetworks() to build table rows with actions
  - Code getSocialNetwork() to retrieve single record
  - Code addSocialNetwork() with duplicate validation
  - Code editSocialNetwork() with update logic
  - Code statusSocialNetwork() to toggle active state
  - Create helper function renderStatus() for status badges
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7_

- [ ] 3.3 Implement metrics controller methods
  - Code lsMetrics() to build table rows with actions
  - Code getMetric() to retrieve single record
  - Code addMetric() with duplicate validation
  - Code editMetric() with update logic
  - Code statusMetric() to toggle active state
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7_

- [ ] 3.4 Implement capture controller methods
  - Code lsCaptures() to build table rows
  - Code getCapture() to retrieve capture with movements
  - Code addCapture() with uniqueness validation
  - Code editCapture() with update logic
  - Code addMetricMovement() to add individual metric
  - Code editMetricMovement() to update metric value
  - Code deleteMetricMovement() to remove metric
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7_

- [ ] 3.5 Implement reporting controller methods
  - Code apiAnnualReport() to format annual data
  - Code apiMonthlyComparative() with percentage calculations
  - Code apiAnnualComparative() with percentage calculations
  - Code apiDashboardMetrics() for KPI cards
  - Code apiTrendChart() for Chart.js format
  - Code apiComparativeTable() with ROI calculations
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 2.8, 2.9, 2.10, 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_

- [ ] 4. Implement frontend base structure (campaign.js)
- [ ] 4.1 Create App class with main layout
  - Extend Templates class
  - Implement render() and layout() methods
  - Create primaryLayout with tabs structure
  - Implement tabLayout with 4 tabs: Dashboard, Captura, Admin Métricas, Admin Redes Sociales
  - Initialize all submodule instances
  - _Requirements: 1.1, 2.1, 3.1, 4.1_

- [ ] 4.2 Implement global filter initialization
  - Code init() method to fetch filter data (UDN, social networks, metrics)
  - Store filter data in global variables
  - _Requirements: 6.1, 6.2_

- [ ] 5. Implement Dashboard module (DashboardSocialNetwork class)
- [ ] 5.1 Create dashboard layout and filters
  - Extend App class
  - Implement render() and layout() methods
  - Create filterBar() with UDN, year, and month selects
  - Set default values to current month and year
  - _Requirements: 1.5, 1.6, 6.5_

- [ ] 5.2 Implement KPI cards component
  - Code showCards() method using infoCard() component
  - Display: Total Reach, Interactions, Month Views, Total Investment
  - Fetch data from apiDashboardMetrics endpoint
  - _Requirements: 1.1_

- [ ] 5.3 Implement trend chart
  - Code trendChart() method using linearChart() component
  - Support 3 months, 6 months, and annual views
  - Fetch data from apiTrendChart endpoint
  - Format data for Chart.js
  - _Requirements: 1.3_

- [ ] 5.4 Implement monthly comparative chart
  - Code monthlyComparative() method using barChart() component
  - Compare current month vs previous month by social network
  - Fetch data from apiMonthlyComparative endpoint
  - _Requirements: 1.2, 5.1_

- [ ] 5.5 Implement summary table
  - Code comparativeTable() method using createCoffeTable() component
  - Display: Platform, Reach, Interactions, Followers, Investment, ROI
  - Fetch data from apiComparativeTable endpoint
  - Calculate ROI: (Reach + Interactions) / Investment
  - _Requirements: 1.4, 5.6_


- [ ] 6. Implement Capture module (RegisterSocialNetWork class)
- [ ] 6.1 Create capture layout and filters
  - Extend App class
  - Implement render() and layout() methods

  - Create filterBar() with UDN, social network, year, and report type selects
  - _Requirements: 2.1, 6.1, 6.2_

- [ ] 6.2 Implement new capture component
  - Code createCapture() method with filter bar (UDN, social network, month, year)
  - Add "Create" button to initialize capture form
  - Fetch metrics for selected social network
  - Generate input fields dynamically for each metric
  - Implement save functionality with validation
  - _Requirements: 2.2, 2.3, 2.4_

- [ ] 6.3 Implement metric movement management
  - Code addMetricMovement() to add individual metric value
  - Code editMetricMovement() to modify metric value

  - Code deleteMetricMovement() to remove metric
  - Add edit and delete buttons for each metric row
  - _Requirements: 2.4, 2.5_

- [ ] 6.4 Implement annual report view
  - Code showAnnualReport() method using createTable() component

  - Display columns: Metric, Jan, Feb, ..., Dec, Total
  - Fetch data from apiAnnualReport endpoint
  - Calculate totals per metric
  - _Requirements: 2.8_

- [ ] 6.5 Implement monthly comparative view
  - Code showMonthlyComparative() method using createTable() component


  - Display columns: Metric, Previous Month, Current Month, Comparison, Percentage
  - Fetch data from apiMonthlyComparative endpoint
  - Calculate percentage: ((Current - Previous) / Previous) * 100
  - Color code positive (green) and negative (red) changes
  - _Requirements: 2.9, 5.1, 5.2, 5.3, 5.4_

- [ ] 6.6 Implement annual comparative view
  - Code showAnnualComparative() method using createTable() component
  - Display columns: Metric, Previous Year Sum, Current Year Sum, Comparison, Percentage
  - Fetch data from apiAnnualComparative endpoint
  - Calculate percentage: ((Current - Previous) / Previous) * 100
  - Color code positive (green) and negative (red) changes

  - _Requirements: 2.10, 5.1, 5.2, 5.3, 5.4_


- [ ] 7. Implement Admin Metrics module (AdminMetrics class)
- [ ] 7.1 Create admin metrics layout
  - Extend App class
  - Implement render() and layout() methods

  - Create filterBar() with UDN and active status selects
  - _Requirements: 4.1, 6.1_

- [ ] 7.2 Implement metrics listing
  - Code lsMetrics() method using createTable() component

  - Display columns: Type, Description, Status, Actions
  - Add edit and delete buttons
  - _Requirements: 4.2_

- [x] 7.3 Implement add metric functionality

  - Code addMetric() method using createModalForm() component
  - Fields: UDN, Social Network, Metric Name, Description
  - Validate duplicate names
  - _Requirements: 4.3, 4.4_


- [ ] 7.4 Implement edit metric functionality
  - Code editMetric() method using createModalForm() component
  - Fetch metric data with getMetric endpoint
  - Use autofill to populate form
  - _Requirements: 4.5_

- [ ] 7.5 Implement status toggle functionality
  - Code statusMetric() method using swalQuestion() component
  - Toggle active/inactive state
  - Update table after status change



  - _Requirements: 4.6_

- [ ] 8. Implement Admin Social Networks module (AdminSocialNetWork class)
- [ ] 8.1 Create admin social networks layout
  - Extend App class

  - Implement render() and layout() methods
  - Create filterBar() with UDN and active status selects
  - _Requirements: 3.1, 6.1_

- [x] 8.2 Implement social networks listing

  - Code lsSocialNetworks() method using createTable() component
  - Display columns: Icon, Name, Active, Creation Date, Actions
  - Add edit and delete buttons
  - _Requirements: 3.2_


- [ ] 8.3 Implement add social network functionality
  - Code addSocialNetwork() method using createModalForm() component
  - Fields: UDN, Name, Icon, Color, Description
  - Validate duplicate names
  - _Requirements: 3.3, 3.4_


- [ ] 8.4 Implement edit social network functionality
  - Code editSocialNetwork() method using createModalForm() component
  - Fetch social network data with getSocialNetwork endpoint
  - Use autofill to populate form
  - _Requirements: 3.5_

- [ ] 8.5 Implement status toggle functionality
  - Code statusSocialNetwork() method using swalQuestion() component
  - Toggle active/inactive state
  - Update table after status change
  - _Requirements: 3.6, 3.7_

- [ ] 9. Implement validations and error handling
- [ ] 9.1 Frontend validations
  - Validate required fields before form submission
  - Validate numeric fields (reach, interactions, investment)
  - Validate date ranges
  - Display user-friendly error messages
  - _Requirements: 7.1, 7.5_

- [ ] 9.2 Backend validations
  - Validate duplicate social networks and metrics
  - Validate duplicate captures (same UDN, network, month, year)
  - Validate foreign key relationships
  - Return appropriate HTTP status codes (200, 400, 409, 500)
  - _Requirements: 7.2, 7.3_

- [ ] 9.3 Permission validations
  - Validate user access to UDN
  - Validate user permissions for module
  - Restrict data access based on user UDN
  - _Requirements: 7.4, 7.6_

- [ ] 10. Implement UI components and styling
- [ ] 10.1 Style dashboard components
  - Apply CoffeeSoft color palette (#103B60, #8CC63F, #EAEAEA)
  - Style KPI cards with appropriate colors
  - Format currency values with formatPrice()
  - Format dates with formatSpanishDate()
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [ ] 10.2 Style tables and forms
  - Apply CoffeeSoft table theme (light/corporativo)
  - Center and right-align appropriate columns
  - Add hover effects and transitions
  - Style status badges (active/inactive)
  - _Requirements: 2.1, 3.2, 4.2_

- [ ] 10.3 Style charts and visualizations
  - Configure Chart.js with CoffeeSoft colors
  - Add tooltips with formatted values
  - Implement responsive chart sizing
  - Add legends and labels
  - _Requirements: 1.2, 1.3_

- [ ] 11. Integration and testing
- [ ] 11.1 Test complete capture flow
  - Create new monthly capture
  - Add metric movements
  - Edit metric values
  - Delete metric movements
  - Verify data persistence
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7_

- [ ] 11.2 Test dashboard visualizations
  - Verify KPI card calculations
  - Test trend chart with different time ranges
  - Verify monthly comparative data
  - Test summary table with ROI calculations
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [ ] 11.3 Test admin modules
  - Create, edit, and deactivate social networks
  - Create, edit, and deactivate metrics
  - Verify duplicate validations
  - Test filter functionality
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7_

- [ ] 11.4 Test comparative reports
  - Verify annual report calculations
  - Test monthly comparative with percentage calculations
  - Test annual comparative with percentage calculations
  - Verify color coding for positive/negative changes
  - _Requirements: 2.8, 2.9, 2.10, 5.1, 5.2, 5.3, 5.4_

- [ ] 11.5 Test filters and navigation
  - Test UDN filter across all modules
  - Test date filters (year, month)
  - Verify filter persistence between tabs
  - Test default filter values
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [ ] 12. Documentation and deployment
  - Document API endpoints and parameters
  - Document database schema and relationships
  - Create user guide for capture process
  - Create admin guide for managing catalogs
  - Prepare deployment checklist
  - _Requirements: All_
