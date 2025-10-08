# Design Document

## Overview

El diseño se enfoca en mejorar el modal de método de pago existente (`modalPaymentMethod()` y `addPayment()`) en el archivo `pedidos.js`. Las mejoras incluyen la implementación de un sistema de toggle para campos de pago, cálculo automático de diferencias, y un sistema de descuentos que modifique el precio real del pedido.

## Architecture

### Componentes Existentes a Modificar

1. **Modal de Pago Principal**: `addPayment()` - Modal actual que se utilizará como base
2. **Función de Cálculo**: `CalculoDiferencia()` - Función existente que se mejorará
3. **Estructura JSON**: Array de configuración del formulario modal

### Nuevos Componentes a Implementar

1. **Toggle Controller**: Función para controlar la visibilidad de campos
2. **Discount Calculator**: Lógica para aplicar descuentos al precio original
3. **Enhanced Difference Calculator**: Versión mejorada del cálculo de diferencias

## Components and Interfaces

### 1. Enhanced Modal Structure

```javascript
// Estructura mejorada del modal addPayment()
{
    // Toggle para mostrar/ocultar campos de pago
    togglePaymentFields: {
        id: "togglePaymentFields",
        type: "switch",
        label: "Mostrar campos de pago detallados",
        defaultState: false
    },
    
    // Campo de descuento
    discountField: {
        id: "descuento",
        type: "input-group",
        label: "Descuento",
        icon: "icon-percent",
        validation: "numeric",
        onchange: "calculateWithDiscount()"
    },
    
    // Campos de pago (controlados por toggle)
    paymentFields: {
        efectivo: { visible: false, onkeyup: "calculateDifference()" },
        transferencia: { visible: false, onkeyup: "calculateDifference()" },
        diferencia: { visible: false, readonly: true }
    }
}
```

### 2. Toggle Controller Interface

```javascript
// Función para controlar visibilidad de campos
togglePaymentFieldsVisibility(show) {
    // Parámetros:
    // - show: boolean - true para mostrar, false para ocultar
    
    // Campos afectados:
    // - #efectivo
    // - #tdc (transferencia)  
    // - #diferencia
    
    // Comportamiento:
    // - Animación suave de transición
    // - Reseteo de valores cuando se ocultan
    // - Recálculo automático cuando se muestran
}
```

### 3. Discount Calculator Interface

```javascript
// Sistema de cálculo de descuentos
calculateWithDiscount() {
    // Entrada:
    // - precioOriginal: number - precio base del pedido
    // - descuento: number - monto del descuento a aplicar
    
    // Salida:
    // - precioConDescuento: number - precio final después del descuento
    // - descuentoAplicado: number - descuento efectivamente aplicado
    
    // Validaciones:
    // - Descuento no puede ser mayor al precio original
    // - Descuento debe ser un número válido >= 0
    // - Actualización automática de todos los campos dependientes
}
```

### 4. Enhanced Difference Calculator

```javascript
// Cálculo mejorado de diferencias
calculateDifference() {
    // Entrada:
    // - totalConDescuento: number - total después de aplicar descuento
    // - efectivo: number - monto en efectivo
    // - transferencia: number - monto por transferencia
    
    // Salida:
    // - diferencia: number - monto restante o cambio a devolver
    
    // Lógica:
    // diferencia = totalConDescuento - (efectivo + transferencia)
    // - Positivo: monto que falta por pagar
    // - Negativo: cambio a devolver
    // - Cero: pago exacto
}
```

## Data Models

### Payment Modal State

```javascript
const paymentModalState = {
    // Precios
    precioOriginal: 0,      // Precio base del pedido
    descuento: 0,           // Descuento aplicado
    precioFinal: 0,         // Precio después del descuento
    
    // Pagos
    efectivo: 0,            // Monto en efectivo
    transferencia: 0,       // Monto por transferencia
    diferencia: 0,          // Diferencia calculada
    
    // UI State
    fieldsVisible: false,   // Estado del toggle
    
    // Validaciones
    isValidDiscount: true,  // Validez del descuento
    isValidPayment: true    // Validez de los pagos
}
```

### Form Configuration

```javascript
const enhancedFormConfig = [
    // Información del monto
    {
        opc: "div",
        id: "amountDisplay",
        html: `
            <div class="payment-summary">
                <div class="original-price">Precio original: $<span id="originalPrice">0.00</span></div>
                <div class="discount-applied">Descuento: -$<span id="discountAmount">0.00</span></div>
                <div class="final-price">Total a pagar: $<span id="finalPrice">0.00</span></div>
            </div>
        `
    },
    
    // Campo de descuento
    {
        opc: "input-group",
        lbl: "Descuento",
        id: "descuento",
        tipo: "cifra",
        icon: "icon-percent",
        placeholder: "0.00",
        onkeyup: "calculateWithDiscount()"
    },
    
    // Toggle para campos de pago
    {
        opc: "div",
        id: "paymentToggle",
        html: `
            <div class="toggle-container">
                <label class="toggle-switch">
                    <input type="checkbox" id="togglePaymentFields" onchange="togglePaymentFieldsVisibility(this.checked)">
                    <span class="slider">Mostrar campos de pago detallados</span>
                </label>
            </div>
        `
    },
    
    // Campos de pago (inicialmente ocultos)
    {
        opc: "div",
        id: "paymentFieldsContainer",
        class: "payment-fields-hidden",
        html: "<!-- Campos de efectivo, transferencia y diferencia -->"
    }
]
```

## Error Handling

### Validation Rules

1. **Descuento Validation**:
   - Debe ser un número válido
   - No puede ser negativo
   - No puede ser mayor al precio original
   - Mensaje de error: "El descuento no puede ser mayor al precio del pedido"

2. **Payment Validation**:
   - Efectivo y transferencia deben ser números válidos
   - No pueden ser negativos
   - La suma no debe exceder significativamente el total (permitir pequeño margen para cambio)

3. **Calculation Validation**:
   - Verificar que todos los cálculos sean números válidos
   - Manejar casos de división por cero
   - Redondear a 2 decimales para evitar errores de punto flotante

### Error Display Strategy

```javascript
const errorHandling = {
    // Mostrar errores en tiempo real
    showFieldError: (fieldId, message) => {
        // Agregar clase de error al campo
        // Mostrar mensaje debajo del campo
        // Cambiar color del borde a rojo
    },
    
    // Limpiar errores
    clearFieldError: (fieldId) => {
        // Remover clases de error
        // Ocultar mensajes de error
        // Restaurar estilo normal
    },
    
    // Validación general del formulario
    validateForm: () => {
        // Validar todos los campos
        // Retornar true/false
        // Mostrar resumen de errores si es necesario
    }
}
```

## Testing Strategy

### Unit Tests (Opcionales)

1. **Discount Calculator Tests**:
   - Descuento válido aplicado correctamente
   - Descuento mayor al precio original rechazado
   - Descuento cero no afecta el precio
   - Descuento con decimales manejado correctamente

2. **Difference Calculator Tests**:
   - Cálculo correcto con pago exacto
   - Cálculo correcto con pago insuficiente
   - Cálculo correcto con sobrepago
   - Manejo de valores decimales

3. **Toggle Functionality Tests**:
   - Campos se ocultan/muestran correctamente
   - Valores se resetean al ocultar
   - Transiciones suaves funcionan
   - Estado se mantiene durante la sesión

### Integration Tests (Opcionales)

1. **Modal Integration**:
   - Modal se abre con valores correctos
   - Cálculos se actualizan en tiempo real
   - Formulario se envía con datos correctos
   - Modal se cierra correctamente después del envío

2. **Backend Integration**:
   - Datos de descuento se envían correctamente
   - Precio final se calcula en backend
   - Respuesta del servidor se maneja adecuadamente

### Manual Testing Scenarios

1. **Flujo Básico**:
   - Abrir modal con pedido de $100
   - Aplicar descuento de $10
   - Verificar que total sea $90
   - Activar toggle de campos de pago
   - Ingresar $50 efectivo, $40 transferencia
   - Verificar diferencia = $0

2. **Casos Edge**:
   - Descuento mayor al precio
   - Pago mayor al total
   - Valores con muchos decimales
   - Toggle múltiples veces seguidas

3. **Validaciones**:
   - Ingresar texto en campos numéricos
   - Dejar campos vacíos
   - Ingresar valores negativos