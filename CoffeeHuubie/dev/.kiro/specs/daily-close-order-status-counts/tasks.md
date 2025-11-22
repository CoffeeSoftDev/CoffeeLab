# Implementation Plan

- [x] 1. Extend backend to include status counts


  - Modify `getDailySalesMetrics()` method in `pedidos/mdl/mdl-pedidos.php`
  - Add three COUNT queries for quotations (status=1), cancelled (status=4), and pending (status=2)
  - Respect existing date and subsidiary filters
  - Return new fields in response array: `quotation_count`, `cancelled_count`, `pending_count`
  - Initialize counts to 0 if queries return no results
  - _Requirements: 1.1, 2.1, 3.1, 4.1, 4.2, 4.3_

- [ ]* 1.1 Write property test for status count accuracy
  - **Property 1: Status count accuracy**
  - **Validates: Requirements 1.1, 2.1, 3.1**


- [ ] 2. Update controller to pass status counts to frontend
  - Modify `getDailyClose()` method in `pedidos/ctrl/ctrl-pedidos.php`
  - Add the three new count fields to the data array returned to frontend
  - Ensure counts are included in both success (200) and no-data (404) responses


  - _Requirements: 1.1, 2.1, 3.1_

- [ ] 3. Update frontend to display status counts in ticket
  - Modify `ticketDailyClose()` method in `pedidos/src/js/app.js`
  - Add three new rows in the ticket after "NÚMERO DE PEDIDOS" section
  - Display "COTIZACIONES: [count]", "PENDIENTES: [count]", "CANCELADOS: [count]"
  - Use same styling as existing ticket rows (flex justify-between)
  - Handle undefined/null values by defaulting to 0
  - _Requirements: 1.2, 2.2, 3.2_

- [ ]* 3.1 Write property test for status label rendering
  - **Property 2: Status label rendering**
  - **Validates: Requirements 1.2, 2.2, 3.2**

- [ ]* 3.2 Write property test for subsidiary filtering
  - **Property 3: Subsidiary filtering consistency**
  - **Validates: Requirements 4.1, 4.2**



- [ ]* 3.3 Write property test for date filtering
  - **Property 4: Date filtering consistency**
  - **Validates: Requirements 4.3**

- [ ] 4. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
