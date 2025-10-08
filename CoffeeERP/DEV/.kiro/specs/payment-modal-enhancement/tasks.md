# Implementation Plan

- [x] 1. Implementar sistema de descuentos en el modal de pago



  - Modificar la función `addPayment()` para incluir campo de descuento
  - Agregar validación para que el descuento no exceda el precio original
  - Implementar cálculo automático del precio con descuento
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 4.1, 4.2, 4.3, 4.4, 4.5_

- [x] 2. Crear función de toggle para campos de pago


  - Implementar función `togglePaymentFieldsVisibility()` para mostrar/ocultar campos
  - Agregar toggle switch en la interfaz del modal


  - Configurar transiciones suaves para mostrar/ocultar campos
  - Resetear valores de campos cuando se oculten
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [x] 3. Mejorar el cálculo automático de diferencias


  - Modificar función `CalculoDiferencia()` para trabajar con precio con descuento
  - Implementar cálculo en tiempo real cuando se modifiquen efectivo o transferencia
  - Manejar casos de pago exacto, insuficiente y sobrepago
  - Mostrar valores negativos cuando hay cambio a devolver
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [ ] 4. Integrar validaciones y manejo de errores
  - Implementar validación de campos numéricos
  - Agregar mensajes de error para descuentos inválidos
  - Validar que la suma de pagos sea coherente
  - Manejar casos edge como valores negativos o texto en campos numéricos
  - _Requirements: 3.4, 4.2_

- [ ] 5. Actualizar la estructura del formulario modal
  - Reorganizar el JSON de configuración del modal para incluir nuevos campos
  - Agregar sección de resumen de precios (original, descuento, final)
  - Implementar contenedor para campos de pago con clase CSS para toggle
  - Asegurar que el orden de campos sea intuitivo para el usuario
  - _Requirements: 1.1, 3.2, 4.1_

- [ ] 6. Implementar estilos CSS para el toggle y transiciones
  - Crear estilos para el toggle switch
  - Implementar animaciones suaves para mostrar/ocultar campos
  - Agregar estilos para el resumen de precios
  - Crear clases CSS para estados de error en validaciones
  - _Requirements: 1.4_

- [ ]* 7. Crear tests unitarios para las funciones de cálculo
  - Escribir tests para la función de cálculo de descuentos
  - Crear tests para la función mejorada de cálculo de diferencias
  - Implementar tests para la función de toggle de campos
  - Agregar tests de validación de entrada de datos
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 3.1, 3.2, 3.3_

- [ ]* 8. Realizar testing de integración con el backend
  - Verificar que los datos de descuento se envíen correctamente al controlador
  - Probar que el precio final calculado coincida entre frontend y backend
  - Validar que la respuesta del servidor se maneje adecuadamente
  - Asegurar que el modal se cierre correctamente después del envío exitoso
  - _Requirements: 3.2, 3.3_