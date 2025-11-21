# Implementation Plan

- [x] 1. Actualizar estilos CSS en la ventana de impresión



  - Modificar el event handler del botón btnPrintTicket en `pedidos/src/js/pedidos-catalogo.js` (líneas 1571-1612)
  - Reemplazar el bloque `<style>` actual con los nuevos estilos CSS optimizados
  - Agregar regla @page con margin: 0
  - Agregar estilos para html y body sin márgenes ni padding
  - Establecer width: 100% y box-sizing: border-box para el contenedor
  - Agregar reglas @media print para eliminar sombras y bordes redondeados
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 3.1, 3.2, 3.4_

- [ ]* 1.1 Escribir test para verificar CSS generado
  - **Property 1: CSS contiene regla @page sin márgenes**
  - **Property 2: Body tiene margin 0 en modo impresión**
  - **Property 3: Elementos html y body sin padding ni margin**
  - **Property 4: Contenedor con ancho 100% y box-sizing border-box**
  - **Property 5: Fuente Courier New se mantiene**


  - **Validates: Requirements 1.1, 1.2, 1.3, 1.4, 3.1, 3.2, 3.4**

- [ ] 2. Agregar validación de ventana emergente bloqueada
  - Verificar que window.open() no retorne null
  - Mostrar mensaje al usuario si el popup es bloqueado
  - Prevenir errores al intentar escribir en una ventana null
  - _Requirements: 4.1, 4.2_



- [ ]* 2.1 Escribir test para manejo de popup bloqueado
  - **Property 7: Ventana se abre como _blank**
  - **Validates: Requirements 4.2**

- [ ] 3. Verificar manejo de errores existente
  - Confirmar que la validación if (ticketContent) funciona correctamente
  - Asegurar que el código no se ejecuta si el elemento no existe
  - Mantener la estructura actual del evento click
  - _Requirements: 4.1, 4.4, 4.5_



- [ ]* 3.1 Escribir test para validación de elemento
  - **Property 9: Validación de existencia del elemento**
  - **Property 10: Elemento ticketPasteleria como fuente**
  - **Validates: Requirements 4.4, 4.5**

- [ ] 4. Verificar comportamiento del setTimeout
  - Confirmar que el delay de 250ms se mantiene
  - Asegurar que print() se llama después del delay


  - Verificar que close() se llama después de print()
  - _Requirements: 2.4, 4.3_

- [ ]* 4.1 Escribir test para timing de impresión
  - **Property 6: Delay de 250ms antes de imprimir**
  - **Property 8: Ventana se cierra después de imprimir**
  - **Validates: Requirements 2.4, 4.3**

- [ ] 5. Checkpoint - Testing manual en navegadores
  - Asegurar que todos los tests automáticos pasen
  - Realizar testing visual en Chrome
  - Realizar testing visual en Firefox
  - Realizar testing visual en Edge
  - Verificar que el ticket ocupe todo el espacio sin márgenes
  - Confirmar que no hay cortes de contenido
  - Preguntar al usuario si surgen dudas

- [ ]* 6. Testing de impresión real (opcional)
  - Imprimir ticket en impresora física
  - Verificar uso eficiente del papel
  - Confirmar que no hay márgenes visibles en el papel impreso
  - Probar con tickets de diferentes tamaños (pocos y muchos productos)
  - _Requirements: 1.5, 3.3_
