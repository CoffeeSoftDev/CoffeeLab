# Design Document

## Overview

El diseño propone modificar los estilos CSS aplicados en la ventana de impresión del ticket para eliminar todos los márgenes y espacios en blanco, permitiendo que el contenido ocupe el 100% del área imprimible. La solución se implementa únicamente en el frontend, modificando el código JavaScript que genera la ventana de impresión dentro del método `ticketPasteleria` en el archivo `pedidos/src/js/pedidos-catalogo.js`.

## Architecture

```
Usuario hace clic en "Imprimir"
    ↓
btnPrintTicket.click() se ejecuta
    ↓
Se obtiene el elemento #ticketPasteleria
    ↓
Se crea nueva ventana con window.open()
    ↓
Se escribe HTML con estilos CSS optimizados
    ↓
Se aplican reglas @page y @media print
    ↓
Se ejecuta printWindow.print() después de 250ms
    ↓
Ticket se imprime sin márgenes
```

## Components and Interfaces

### Componente Modificado

**Archivo:** `pedidos/src/js/pedidos-catalogo.js`

**Método:** `ticketPasteleria(options)`

**Sección específica:** Event handler del botón `btnPrintTicket` (líneas 1571-1612)

### Interfaz de Impresión

El componente no cambia su interfaz externa. Mantiene:
- **Input:** Elemento DOM `ticketContent` obtenido por `getElementById('ticketPasteleria')`
- **Output:** Ventana de impresión con el ticket renderizado
- **Comportamiento:** Abre ventana, imprime, cierra automáticamente

## Data Models

No se requieren cambios en modelos de datos. La modificación es puramente de presentación CSS.

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Acceptance Criteria Testing Prework

1.1 WHEN el usuario hace clic en el botón de imprimir, THE Sistema de Impresión SHALL generar una ventana de impresión sin márgenes en el body
Thoughts: Este es un comportamiento visual que se puede verificar inspeccionando los estilos aplicados al body en la ventana de impresión. Podemos verificar que el CSS generado contenga `margin: 0` para el body.
Testable: yes - example

1.2 WHEN se aplica el modo de impresión (@media print), THE Sistema de Impresión SHALL establecer todos los márgenes del body a 0
Thoughts: Similar al anterior, esto verifica que dentro de la regla @media print exista `body { margin: 0; }`
Testable: yes - example

1.3 THE Sistema de Impresión SHALL establecer todos los márgenes de la página (@page) a 0 para eliminar espacios en blanco
Thoughts: Esto verifica que el CSS contenga la regla `@page { margin: 0; }`
Testable: yes - example

1.4 THE Sistema de Impresión SHALL mantener la fuente 'Courier New' monospace para preservar el estilo de ticket térmico
Thoughts: Verifica que el font-family del body incluya 'Courier New', monospace
Testable: yes - example

1.5 WHEN el ticket se renderiza en la ventana de impresión, THE Sistema de Impresión SHALL mostrar el contenido completo sin recortes ni desbordamientos
Thoughts: Este es un comportamiento visual complejo que depende del contenido específico. Es difícil de automatizar sin herramientas de testing visual.
Testable: no

2.1 THE Sistema de Impresión SHALL aplicar estilos CSS compatibles con Chrome, Firefox, Edge y Safari
Thoughts: Esto requiere testing manual en múltiples navegadores. No es automatizable fácilmente.
Testable: no

2.2 THE Sistema de Impresión SHALL utilizar la regla @page para controlar los márgenes de impresión de manera estándar
Thoughts: Verifica que el CSS contenga una regla @page
Testable: yes - example

2.3 WHEN se abre la ventana de impresión, THE Sistema de Impresión SHALL cargar los estilos necesarios antes de ejecutar la función print()
Thoughts: Esto se verifica comprobando que el HTML escrito incluya las etiquetas <style> antes del contenido del body
Testable: yes - example

2.4 THE Sistema de Impresión SHALL mantener un delay de 250ms antes de imprimir para asegurar que los estilos se apliquen correctamente
Thoughts: Verifica que el setTimeout tenga un valor de 250
Testable: yes - example

3.1 THE Sistema de Impresión SHALL establecer el ancho del contenedor del ticket al 100% del área disponible
Thoughts: Verifica que el CSS del contenedor incluya width: 100%
Testable: yes - example

3.2 THE Sistema de Impresión SHALL aplicar box-sizing: border-box para incluir padding y borders en el cálculo del ancho
Thoughts: Verifica que el CSS incluya box-sizing: border-box
Testable: yes - example

3.3 WHEN el contenido del ticket es más ancho que el área imprimible, THE Sistema de Impresión SHALL ajustar el tamaño automáticamente sin cortar información
Thoughts: Este es un comportamiento visual que depende del contenido. Difícil de automatizar.
Testable: no

3.4 THE Sistema de Impresión SHALL eliminar cualquier padding o margin del elemento html para maximizar el espacio disponible
Thoughts: Verifica que el CSS incluya reglas para html con margin y padding en 0
Testable: yes - example

4.1 THE Sistema de Impresión SHALL mantener la estructura actual del evento click del botón btnPrintTicket
Thoughts: Esto es sobre mantener la estructura del código, no un comportamiento funcional testeable
Testable: no

4.2 THE Sistema de Impresión SHALL continuar abriendo una nueva ventana (_blank) para la impresión
Thoughts: Verifica que window.open se llame con el parámetro '_blank'
Testable: yes - example

4.3 THE Sistema de Impresión SHALL mantener el cierre automático de la ventana después de imprimir
Thoughts: Verifica que printWindow.close() se llame después de print()
Testable: yes - example

4.4 THE Sistema de Impresión SHALL preservar el uso del elemento ticketPasteleria como fuente del contenido
Thoughts: Verifica que getElementById('ticketPasteleria') se use para obtener el contenido
Testable: yes - example

4.5 WHEN el elemento ticketPasteleria no existe, THE Sistema de Impresión SHALL manejar el error sin romper la aplicación
Thoughts: Verifica que exista una validación if (ticketContent) antes de proceder
Testable: yes - example

### Property Reflection

Revisando las propiedades identificadas, encontramos que:
- La mayoría son verificaciones de ejemplos específicos (que el CSS contenga ciertas reglas)
- No hay propiedades redundantes ya que cada una verifica un aspecto diferente del CSS
- Las propiedades no testeables (visuales y de compatibilidad) requieren testing manual
- Las propiedades testeables son principalmente verificaciones de que el código generado contenga las reglas CSS correctas

No se requiere consolidación ya que cada propiedad testeable verifica un aspecto único del CSS generado.

### Correctness Properties

**Property 1: CSS contiene regla @page sin márgenes**
*For any* ejecución del botón de impresión, el HTML generado debe contener la regla CSS `@page { margin: 0; }`
**Validates: Requirements 1.3, 2.2**

**Property 2: Body tiene margin 0 en modo impresión**
*For any* ejecución del botón de impresión, el HTML generado debe contener `@media print { body { margin: 0; } }`
**Validates: Requirements 1.1, 1.2**

**Property 3: Elementos html y body sin padding ni margin**
*For any* ejecución del botón de impresión, el HTML generado debe establecer margin y padding a 0 para html y body
**Validates: Requirements 3.4**

**Property 4: Contenedor con ancho 100% y box-sizing border-box**
*For any* ejecución del botón de impresión, el CSS del contenedor del ticket debe incluir `width: 100%` y `box-sizing: border-box`
**Validates: Requirements 3.1, 3.2**

**Property 5: Fuente Courier New se mantiene**
*For any* ejecución del botón de impresión, el font-family del body debe incluir 'Courier New', monospace
**Validates: Requirements 1.4**

**Property 6: Delay de 250ms antes de imprimir**
*For any* ejecución del botón de impresión, debe existir un setTimeout con valor 250 antes de llamar a print()
**Validates: Requirements 2.4**

**Property 7: Ventana se abre como _blank**
*For any* ejecución del botón de impresión, window.open debe ser llamado con el parámetro '_blank'
**Validates: Requirements 4.2**

**Property 8: Ventana se cierra después de imprimir**
*For any* ejecución del botón de impresión, printWindow.close() debe ser llamado después de printWindow.print()
**Validates: Requirements 4.3**

**Property 9: Validación de existencia del elemento**
*For any* ejecución del botón de impresión, debe existir una validación if (ticketContent) antes de proceder con la impresión
**Validates: Requirements 4.5**

**Property 10: Elemento ticketPasteleria como fuente**
*For any* ejecución del botón de impresión, el contenido debe obtenerse mediante getElementById('ticketPasteleria')
**Validates: Requirements 4.4**

## Error Handling

### Escenario 1: Elemento ticketPasteleria no existe
- **Detección:** La validación `if (ticketContent)` detecta cuando el elemento es null
- **Manejo:** El código no ejecuta la lógica de impresión, evitando errores
- **Resultado:** La aplicación continúa funcionando sin crashes

### Escenario 2: Ventana de impresión bloqueada por el navegador
- **Detección:** window.open() retorna null si el popup es bloqueado
- **Manejo actual:** No hay manejo explícito
- **Recomendación:** Agregar validación `if (printWindow)` antes de escribir en la ventana

### Escenario 3: Estilos no se cargan a tiempo
- **Detección:** El contenido se imprime sin estilos aplicados
- **Manejo:** El setTimeout de 250ms da tiempo para que los estilos se apliquen
- **Resultado:** Los estilos se aplican correctamente en la mayoría de los casos

## Testing Strategy

### Unit Testing

Dado que esta funcionalidad genera HTML dinámicamente y abre ventanas del navegador, el testing unitario tradicional es limitado. Sin embargo, podemos testear:

1. **Generación de CSS correcto**
   - Verificar que el string HTML generado contenga todas las reglas CSS requeridas
   - Usar expresiones regulares para validar la presencia de @page, @media print, etc.

2. **Validación de elemento**
   - Mockear getElementById para retornar null
   - Verificar que no se ejecute window.open cuando el elemento no existe

3. **Estructura del HTML**
   - Verificar que el HTML generado tenga la estructura correcta (html, head, body)
   - Validar que el contenido del ticket se incluya en el body

### Property-Based Testing

Para esta funcionalidad, el property-based testing es limitado ya que:
- No hay generación de datos aleatorios significativa
- El comportamiento es determinístico basado en el DOM existente
- La mayoría de las propiedades son verificaciones de strings CSS

Sin embargo, podemos implementar:

**Property Test 1: CSS Rules Completeness**
- Generar variaciones del contenido del ticket
- Verificar que independientemente del contenido, el CSS generado siempre contenga las reglas de márgenes

### Manual Testing

El testing manual es esencial para esta funcionalidad:

1. **Testing visual en diferentes navegadores**
   - Chrome, Firefox, Edge, Safari
   - Verificar que el ticket ocupe todo el espacio
   - Confirmar que no hay márgenes visibles

2. **Testing de impresión real**
   - Imprimir en impresora física
   - Verificar que el papel se use eficientemente
   - Confirmar que no hay cortes de contenido

3. **Testing con diferentes tamaños de ticket**
   - Tickets con pocos productos
   - Tickets con muchos productos
   - Tickets con notas largas

### Integration Testing

1. **Flujo completo de impresión**
   - Crear un pedido
   - Abrir el modal de impresión
   - Hacer clic en el botón de imprimir
   - Verificar que la ventana se abra correctamente
   - Confirmar que la ventana se cierre después de imprimir

## Implementation Notes

### Cambios CSS Requeridos

El bloque de estilos actual:
```css
body { 
    margin: 0; 
    font-family: 'Courier New', monospace;
    background: white;
}
@media print {
    body { 
        margin: 0; 
    }
}
```

Debe ser reemplazado por:
```css
html, body {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    font-family: 'Courier New', monospace;
    background: white;
}

* {
    box-sizing: border-box;
}

#ticketPasteleria {
    width: 100%;
    max-width: 100%;
    margin: 0;
    padding: 1rem;
}

@page {
    margin: 0;
    size: auto;
}

@media print {
    html, body {
        margin: 0;
        padding: 0;
        width: 100%;
        height: auto;
    }
    
    #ticketPasteleria {
        box-shadow: none !important;
        border-radius: 0 !important;
    }
}
```

### Consideraciones de Compatibilidad

- **@page margin:** Soportado en todos los navegadores modernos
- **box-sizing: border-box:** Soportado universalmente
- **@media print:** Estándar CSS, soportado en todos los navegadores

### Mejoras Opcionales

1. **Validación de ventana bloqueada:**
```javascript
const printWindow = window.open('', '_blank');
if (!printWindow) {
    alert('Por favor permite las ventanas emergentes para imprimir');
    return;
}
```

2. **Indicador de carga:**
```javascript
btnPrint.prop('disabled', true).text('Preparando impresión...');
setTimeout(() => {
    printWindow.print();
    printWindow.close();
    btnPrint.prop('disabled', false).html('<i class="icon-print"></i> Imprimir');
}, 250);
```

## Dependencies

- **jQuery:** Ya está en uso en el proyecto
- **Tailwind CSS:** Se carga desde CDN en la ventana de impresión
- **Navegador moderno:** Con soporte para @page y @media print

## Performance Considerations

- El setTimeout de 250ms es necesario para dar tiempo a que los estilos se apliquen
- La carga de Tailwind desde CDN puede ser lenta en conexiones lentas
- Considerar incluir solo los estilos necesarios en lugar de todo Tailwind

## Security Considerations

- No hay riesgos de seguridad significativos
- El contenido del ticket ya está en el DOM del usuario
- No se envían datos a servidores externos (excepto CDN de Tailwind)
