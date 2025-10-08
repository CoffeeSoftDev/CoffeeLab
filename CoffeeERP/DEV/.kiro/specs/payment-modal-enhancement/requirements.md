# Requirements Document

## Introduction

Este documento define los requisitos para mejorar el modal de método de pago en el sistema de pedidos de Control Fogaza. Las mejoras incluyen la implementación de un toggle para mostrar/ocultar campos de pago, cálculo automático de diferencias, y la adición de un sistema de descuentos que afecte el precio real del pedido.

## Requirements

### Requirement 1

**User Story:** Como usuario del sistema de pedidos, quiero tener un toggle que me permita mostrar u ocultar los campos de Efectivo, Transferencia y Diferencia, para tener un control más limpio de la interfaz cuando no necesito todos los campos visibles.

#### Acceptance Criteria

1. WHEN el usuario abra el modal de método de pago THEN el sistema SHALL mostrar un toggle switch claramente visible
2. WHEN el toggle esté desactivado THEN el sistema SHALL ocultar los campos de Efectivo, Transferencia y Diferencia
3. WHEN el toggle esté activado THEN el sistema SHALL mostrar todos los campos de pago (Efectivo, Transferencia, Diferencia)
4. WHEN el usuario cambie el estado del toggle THEN el sistema SHALL aplicar la transición de manera suave y sin errores

### Requirement 2

**User Story:** Como usuario del sistema de pedidos, quiero que el sistema calcule automáticamente la diferencia entre el monto total y los pagos ingresados (efectivo + transferencia), para evitar errores de cálculo manual.

#### Acceptance Criteria

1. WHEN el usuario ingrese un monto en el campo Efectivo THEN el sistema SHALL recalcular automáticamente la diferencia
2. WHEN el usuario ingrese un monto en el campo Transferencia THEN el sistema SHALL recalcular automáticamente la diferencia
3. WHEN la suma de Efectivo + Transferencia sea igual al total THEN el campo Diferencia SHALL mostrar 0.00
4. WHEN la suma de Efectivo + Transferencia sea menor al total THEN el campo Diferencia SHALL mostrar el monto restante
5. WHEN la suma de Efectivo + Transferencia sea mayor al total THEN el campo Diferencia SHALL mostrar un valor negativo (cambio a devolver)

### Requirement 3

**User Story:** Como usuario del sistema de pedidos, quiero poder aplicar un descuento manual al pedido que afecte el precio real, para poder ofrecer promociones o descuentos especiales a los clientes.

#### Acceptance Criteria

1. WHEN el usuario abra el modal de método de pago THEN el sistema SHALL mostrar un campo para ingresar descuento
2. WHEN el usuario ingrese un descuento THEN el sistema SHALL recalcular el total del pedido restando el descuento
3. WHEN se aplique un descuento THEN el sistema SHALL mostrar claramente el precio original y el precio con descuento
4. WHEN el descuento sea mayor al precio original THEN el sistema SHALL validar y mostrar un mensaje de error
5. WHEN se aplique un descuento THEN todos los cálculos de diferencia SHALL basarse en el nuevo precio con descuento

### Requirement 4

**User Story:** Como usuario del sistema de pedidos, quiero que el descuento se ingrese de forma manual y clara, para tener control total sobre los descuentos aplicados y evitar errores automáticos.

#### Acceptance Criteria

1. WHEN el usuario vea el campo de descuento THEN el sistema SHALL mostrar un campo de entrada numérico claramente etiquetado
2. WHEN el usuario ingrese un descuento THEN el sistema SHALL validar que sea un número válido
3. WHEN el usuario ingrese un descuento THEN el sistema SHALL aplicar el descuento inmediatamente al total
4. WHEN el descuento sea 0 o esté vacío THEN el sistema SHALL usar el precio original sin descuento
5. WHEN el usuario modifique el descuento THEN el sistema SHALL recalcular todos los valores dependientes en tiempo real