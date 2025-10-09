# Design Document

## Overview

Este diseño mejora el componente `orderPanelComponent` para proporcionar una experiencia de usuario más intuitiva al manejar pedidos personalizados. La solución implementa indicadores visuales distintivos y botones de acción específicos que permiten a los usuarios identificar y editar pedidos personalizados de manera eficiente.

## Architecture

### Component Structure

El componente `orderPanelComponent` mantendrá su estructura actual pero incorporará lógica condicional para renderizar elementos específicos según el tipo de producto:

```
orderPanelComponent
├── Header (sin cambios)
├── OrderItems Container
│   └── Product Cards (mejorados)
│       ├── Product Info (con indicadores visuales)
│       ├── Quantity Controls (sin cambios)
│       └── Action Buttons (mejorados con lógica condicional)
└── Footer (sin cambios)
```

### Visual Hierarchy

1. **Productos Regulares**: Mantienen la apariencia actual
2. **Productos Personalizados**: Incluyen indicadores visuales distintivos
3. **Botones de Acción**: Se organizan según el tipo de producto

## Components and Interfaces

### Enhanced Product Card Rendering

#### Product Information Display
```javascript
// Estructura mejorada para mostrar información del producto
const info = $("<div>", { class: "flex-1 space-y-1" }).append(
    $("<p>", { class: `${textColor} font-medium text-sm`, text: item.name }),
    $("<p>", { class: `${subColor} font-semibold text-sm`, text: formatPrice(item.price) }),
    
    // Indicador de pedido personalizado
    item.custom_id ? 
        $("<p>", { 
            class: "text-purple-400 text-xs font-semibold", 
            text: "🎂 Pedido personalizado" 
        }) : null,
    
    // Información adicional existente
    item.dedication ? $("<p>", { class: `${mutedColor} text-xs italic`, text: `Dedicatoria: ${item.dedication}` }) : null,
    item.order_details ? $("<p>", { class: `${mutedColor} text-xs`, text: `Detalles: ${item.order_details}` }) : null,
    
    // Indicador de imágenes adjuntas
    item.images && item.images.length > 0 ? 
        $("<p>", {
            class: `text-green-400 text-xs`,
            text: `📷 Pedido con ${item.images.length} foto${item.images.length > 1 ? 's' : ''} adjunta${item.images.length > 1 ? 's' : ''}`
        }) : null
);
```

#### Action Buttons Logic
```javascript
// Lógica condicional para botones de acción
const createActionButtons = (item) => {
    const baseButtons = [
        // Botones de cantidad (sin cambios)
        decrementButton,
        quantityDisplay,
        incrementButton
    ];
    
    if (item.custom_id) {
        // Producto personalizado: botón especial + botón regular
        baseButtons.push(
            createBuildCakeButton(item),
            createEditButton(item),
            createDeleteButton(item)
        );
    } else {
        // Producto regular: solo botón de edición estándar
        baseButtons.push(
            createEditButton(item),
            createDeleteButton(item)
        );
    }
    
    return baseButtons;
};
```

### Button Components

#### Build Cake Button (Nuevo)
```javascript
const createBuildCakeButton = (item) => {
    return $("<button>", {
        class: "text-purple-400 hover:text-purple-600 transition-colors duration-200",
        html: `<i class="icon-cake"></i>`,
        title: "Armar Pastel",
        click: () => {
            if (typeof opts.onBuildCake === "function") {
                opts.onBuildCake(item.id);
            }
        }
    });
};
```

#### Enhanced Edit Button
```javascript
const createEditButton = (item) => {
    return $("<button>", {
        class: "text-blue-400 hover:text-blue-600 transition-colors duration-200",
        html: `<i class="icon-pencil"></i>`,
        title: item.custom_id ? "Editar Detalles" : "Editar Producto",
        click: () => {
            if (typeof opts.onEdit === "function") {
                opts.onEdit(item.id);
            }
        }
    });
};
```

## Data Models

### Product Item Structure
```javascript
// Estructura de datos esperada para cada producto
const productItem = {
    id: Number,           // ID único del producto
    name: String,         // Nombre del producto
    price: Number,        // Precio unitario
    quantity: Number,     // Cantidad en el carrito
    custom_id: Number,    // ID del pedido personalizado (opcional)
    dedication: String,   // Dedicatoria (opcional)
    order_details: String, // Detalles del pedido (opcional)
    images: Array         // Array de imágenes adjuntas (opcional)
};
```

### Options Interface
```javascript
// Interfaz de opciones del componente (extendida)
const componentOptions = {
    // Opciones existentes
    parent: String,
    title: String,
    data: Array,
    theme: String,
    
    // Callbacks existentes
    onEdit: Function,
    onRemove: Function,
    onQuanty: Function,
    
    // Nuevo callback para pedidos personalizados
    onBuildCake: Function  // (itemId) => void
};
```

## Error Handling

### Validation Logic
1. **Custom ID Validation**: Verificar que `custom_id` sea un número válido antes de mostrar indicadores
2. **Callback Validation**: Validar que `onBuildCake` sea una función antes de ejecutarla
3. **Data Integrity**: Manejar casos donde los datos del producto estén incompletos

### Fallback Behavior
```javascript
// Manejo seguro de datos faltantes
const safeRender = (item) => {
    const isCustom = item.custom_id && typeof item.custom_id === 'number';
    const hasImages = Array.isArray(item.images) && item.images.length > 0;
    
    // Renderizar solo elementos con datos válidos
    return {
        showCustomIndicator: isCustom,
        showImageIndicator: hasImages,
        showBuildCakeButton: isCustom && typeof opts.onBuildCake === 'function'
    };
};
```

## Testing Strategy

### Unit Testing Focus
1. **Conditional Rendering**: Verificar que los indicadores se muestren correctamente según el tipo de producto
2. **Button Functionality**: Confirmar que los botones ejecuten las funciones correctas
3. **Data Handling**: Validar el manejo seguro de datos faltantes o inválidos

### Integration Testing
1. **Component Interaction**: Verificar que el componente funcione correctamente con el sistema existente
2. **Callback Execution**: Confirmar que los callbacks se ejecuten con los parámetros correctos
3. **Visual Consistency**: Validar que los estilos se apliquen correctamente en diferentes temas

### User Acceptance Testing
1. **Visual Distinction**: Los usuarios pueden identificar fácilmente los pedidos personalizados
2. **Action Clarity**: Los botones de acción son intuitivos y funcionan como se espera
3. **Workflow Efficiency**: El flujo de edición es más eficiente que la implementación anterior

## Implementation Notes

### CSS Classes
- `text-purple-400`: Color distintivo para indicadores de pedidos personalizados
- `text-green-400`: Color para indicadores de imágenes adjuntas
- `transition-colors duration-200`: Transiciones suaves para botones

### Accessibility Considerations
- Uso de atributos `title` para tooltips informativos
- Mantenimiento de contraste de colores adecuado
- Preservación de la navegación por teclado existente

### Performance Considerations
- Renderizado condicional para evitar elementos DOM innecesarios
- Reutilización de funciones de creación de botones
- Mantenimiento de la delegación de eventos existente