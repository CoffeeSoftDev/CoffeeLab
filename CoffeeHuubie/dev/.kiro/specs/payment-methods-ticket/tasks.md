# Implementation Plan

- [x] 1. Modificar el método getOrderDetails en el backend para incluir métodos de pago




  - Agregar llamada a `$this->getMethodPayment([$orderId])` después de obtener los productos del pedido
  - Implementar validación para manejar casos donde `getMethodPayment()` retorna `null` o no es un array
  - Agregar la clave `paymentMethods` al array `$data` que se retorna en la respuesta



  - Asegurar que el array vacío `[]` se asigne cuando no hay métodos de pago disponibles
  - _Requirements: 1.1, 1.2, 1.4, 1.5, 2.1, 2.2, 2.4_

- [ ] 2. Modificar el método printOrder en el frontend para usar datos reales
  - Reemplazar el array hardcodeado de `paymentMethods` en la llamada a `ticketPasteleria()`
  - Usar `pos.data.paymentMethods` como fuente de datos
  - Implementar fallback con operador OR (`|| []`) para manejar casos donde los datos no estén disponibles
  - Mantener la estructura existente del método sin modificar otra lógica
  - _Requirements: 1.3, 2.3, 2.4, 3.4_

- [ ]* 3. Validar la implementación con diferentes escenarios
  - Probar con un pedido que tenga múltiples métodos de pago (efectivo y tarjeta)
  - Probar con un pedido que tenga un solo método de pago
  - Probar con un pedido sin pagos registrados
  - Probar con un pedido que tenga múltiples pagos del mismo método
  - Verificar que el ticket se renderice correctamente en todos los casos
  - Validar que los montos mostrados coincidan con los totales pagados
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 3.1, 3.2, 3.3, 3.4_
