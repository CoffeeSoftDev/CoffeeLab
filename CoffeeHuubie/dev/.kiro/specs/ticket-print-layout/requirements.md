# Requirements Document

## Introduction

El sistema actual de impresión de tickets de pedidos genera una ventana de impresión con márgenes y espacios en blanco innecesarios. Los usuarios necesitan que el ticket ocupe todo el espacio disponible de la página al imprimir, eliminando márgenes y optimizando el uso del papel para una impresión más eficiente y profesional.

## Glossary

- **Sistema de Impresión**: El módulo JavaScript que genera la ventana de impresión del ticket
- **Ticket**: Documento que muestra los detalles de un pedido de pastelería
- **Ventana de Impresión**: Nueva ventana del navegador que se abre para imprimir el ticket
- **ticketContent**: Elemento DOM que contiene el HTML del ticket a imprimir
- **btnPrintTicket**: Botón que activa la función de impresión del ticket

## Requirements

### Requirement 1

**User Story:** Como usuario del sistema, quiero que el ticket impreso ocupe todo el espacio disponible de la página, para aprovechar mejor el papel y tener una impresión más limpia.

#### Acceptance Criteria

1. WHEN el usuario hace clic en el botón de imprimir, THE Sistema de Impresión SHALL generar una ventana de impresión sin márgenes en el body.

2. WHEN se aplica el modo de impresión (@media print), THE Sistema de Impresión SHALL establecer todos los márgenes del body a 0.

3. THE Sistema de Impresión SHALL establecer todos los márgenes de la página (@page) a 0 para eliminar espacios en blanco.

4. THE Sistema de Impresión SHALL mantener la fuente 'Courier New' monospace para preservar el estilo de ticket térmico.

5. WHEN el ticket se renderiza en la ventana de impresión, THE Sistema de Impresión SHALL mostrar el contenido completo sin recortes ni desbordamientos.

### Requirement 2

**User Story:** Como usuario, quiero que el ticket se imprima correctamente en diferentes navegadores, para asegurar consistencia sin importar el navegador utilizado.

#### Acceptance Criteria

1. THE Sistema de Impresión SHALL aplicar estilos CSS compatibles con Chrome, Firefox, Edge y Safari.

2. THE Sistema de Impresión SHALL utilizar la regla @page para controlar los márgenes de impresión de manera estándar.

3. WHEN se abre la ventana de impresión, THE Sistema de Impresión SHALL cargar los estilos necesarios antes de ejecutar la función print().

4. THE Sistema de Impresión SHALL mantener un delay de 250ms antes de imprimir para asegurar que los estilos se apliquen correctamente.

### Requirement 3

**User Story:** Como usuario, quiero que el contenido del ticket se ajuste automáticamente al ancho de la página, para evitar cortes o texto fuera del área imprimible.

#### Acceptance Criteria

1. THE Sistema de Impresión SHALL establecer el ancho del contenedor del ticket al 100% del área disponible.

2. THE Sistema de Impresión SHALL aplicar box-sizing: border-box para incluir padding y borders en el cálculo del ancho.

3. WHEN el contenido del ticket es más ancho que el área imprimible, THE Sistema de Impresión SHALL ajustar el tamaño automáticamente sin cortar información.

4. THE Sistema de Impresión SHALL eliminar cualquier padding o margin del elemento html para maximizar el espacio disponible.

### Requirement 4

**User Story:** Como desarrollador, quiero mantener la funcionalidad existente del botón de impresión, para asegurar que no se rompa ninguna característica actual.

#### Acceptance Criteria

1. THE Sistema de Impresión SHALL mantener la estructura actual del evento click del botón btnPrintTicket.

2. THE Sistema de Impresión SHALL continuar abriendo una nueva ventana (_blank) para la impresión.

3. THE Sistema de Impresión SHALL mantener el cierre automático de la ventana después de imprimir.

4. THE Sistema de Impresión SHALL preservar el uso del elemento ticketPasteleria como fuente del contenido.

5. WHEN el elemento ticketPasteleria no existe, THE Sistema de Impresión SHALL manejar el error sin romper la aplicación.
