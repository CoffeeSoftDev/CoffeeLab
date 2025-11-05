# Requirements Document

## Introduction

Esta funcionalidad permite consultar y mostrar las formas de pago reales utilizadas en un pedido dentro del ticket de impresión. Actualmente, el sistema muestra datos de ejemplo hardcodeados (`paymentMethods: [{ method_pay: "Tarjeta", pay: 200 }, { method_pay: "Efectivo", pay: 100 }]`), pero necesita obtener los métodos de pago reales desde la base de datos para reflejar con precisión cómo se pagó cada pedido.

## Glossary

- **Sistema de Pedidos**: El módulo de pedidos que gestiona órdenes, pagos y tickets de impresión
- **Ticket**: Documento impreso o visualizado que muestra los detalles de un pedido
- **Método de Pago**: Forma en que el cliente realizó el pago (efectivo, tarjeta, transferencia, etc.)
- **Backend Controller**: El archivo `ctrl-pedidos.php` que maneja la lógica del servidor
- **Frontend App**: El archivo `app.js` que maneja la interfaz de usuario
- **ticketPasteleria**: Función que renderiza el ticket con formato específico

## Requirements

### Requirement 1

**User Story:** Como usuario del sistema, quiero que el ticket de impresión muestre las formas de pago reales utilizadas en el pedido, para tener un registro preciso de cómo se realizó el pago.

#### Acceptance Criteria

1. WHEN el método `getOrderDetails` es invocado con un ID de pedido válido, THE Sistema de Pedidos SHALL consultar los métodos de pago asociados a ese pedido desde la base de datos.

2. THE Sistema de Pedidos SHALL retornar los métodos de pago en el formato `[{ method_pay: "nombre_metodo", pay: monto_numerico }]` dentro de la respuesta de `getOrderDetails`.

3. WHEN la función `printOrder` recibe la respuesta del backend, THE Frontend App SHALL pasar los métodos de pago reales a la función `ticketPasteleria` en lugar de datos hardcodeados.

4. THE Sistema de Pedidos SHALL agrupar los pagos por método de pago y sumar los montos cuando existan múltiples pagos con el mismo método.

5. IF no existen métodos de pago registrados para un pedido, THEN THE Sistema de Pedidos SHALL retornar un array vacío para `paymentMethods`.

### Requirement 2

**User Story:** Como desarrollador, quiero mantener la estructura de datos existente sin modificar la lógica actual, para asegurar compatibilidad con el resto del sistema.

#### Acceptance Criteria

1. THE Sistema de Pedidos SHALL mantener la estructura actual del método `getOrderDetails` sin modificar su lógica principal de cálculo de totales y saldos.

2. THE Sistema de Pedidos SHALL agregar la información de métodos de pago como un campo adicional en la respuesta existente.

3. THE Frontend App SHALL mantener la estructura actual de la función `printOrder` y solo reemplazar el array hardcodeado de `paymentMethods` con los datos reales.

4. THE Sistema de Pedidos SHALL utilizar el método existente `getPaymentMethodsByOrder` del modelo para obtener los métodos de pago.

### Requirement 3

**User Story:** Como usuario, quiero que el ticket muestre los métodos de pago en un formato legible y consistente, para facilitar la comprensión de la información.

#### Acceptance Criteria

1. THE Sistema de Pedidos SHALL retornar cada método de pago con su nombre descriptivo (ej: "Efectivo", "Tarjeta", "Transferencia").

2. THE Sistema de Pedidos SHALL retornar cada monto de pago como un valor numérico con precisión decimal.

3. WHEN múltiples pagos utilizan el mismo método, THE Sistema de Pedidos SHALL consolidarlos en una sola entrada con el monto total sumado.

4. THE Frontend App SHALL pasar los métodos de pago a `ticketPasteleria` en el mismo formato que actualmente espera la función.
