# Requirements Document

## Introduction

Esta especificación define las mejoras necesarias para el componente `orderPanelComponent` en el sistema de pedidos de pastelería, específicamente para mejorar la experiencia de edición de pedidos personalizados. El objetivo es proporcionar una interfaz más intuitiva que permita a los usuarios distinguir claramente entre productos regulares y pedidos personalizados, ofreciendo opciones de edición específicas para cada tipo.

## Requirements

### Requirement 1

**User Story:** Como usuario del sistema de pedidos, quiero poder identificar visualmente los pedidos personalizados en mi carrito, para distinguirlos fácilmente de los productos regulares.

#### Acceptance Criteria

1. WHEN un producto tiene `custom_id` definido THEN el sistema SHALL mostrar un indicador visual distintivo (ícono 🎂 y texto "Pedido personalizado")
2. WHEN se renderiza un pedido personalizado THEN el sistema SHALL aplicar estilos visuales diferenciados (color púrpura para el indicador)
3. WHEN se muestra la información del producto THEN el sistema SHALL incluir todos los detalles relevantes (dedicatoria, detalles del pedido, imágenes adjuntas)

### Requirement 2

**User Story:** Como usuario del sistema de pedidos, quiero tener botones de edición específicos para cada tipo de producto, para acceder a las funciones de edición apropiadas según el tipo de pedido.

#### Acceptance Criteria

1. WHEN un producto es regular (sin `custom_id`) THEN el sistema SHALL mostrar únicamente el botón de edición estándar
2. WHEN un producto es personalizado (con `custom_id`) THEN el sistema SHALL mostrar un botón especial "Armar Pastel" además del botón de edición regular
3. WHEN se hace clic en el botón "Armar Pastel" THEN el sistema SHALL ejecutar la función `onBuildCake` con el ID del producto
4. WHEN se hace clic en el botón de edición regular en un producto personalizado THEN el sistema SHALL ejecutar la función `onEdit` estándar

### Requirement 3

**User Story:** Como usuario del sistema de pedidos, quiero que los botones de acción sean visualmente claros y accesibles, para poder realizar las acciones deseadas de manera eficiente.

#### Acceptance Criteria

1. WHEN se renderiza un producto personalizado THEN el sistema SHALL mostrar el botón "Armar Pastel" con ícono distintivo (🎂) y color diferenciado
2. WHEN se posiciona el cursor sobre los botones THEN el sistema SHALL mostrar efectos hover apropiados
3. WHEN los botones están activos THEN el sistema SHALL mantener la funcionalidad de todos los controles existentes (cantidad, eliminar, etc.)
4. WHEN se organiza la interfaz THEN el sistema SHALL mantener la disposición coherente de los elementos de acción

### Requirement 4

**User Story:** Como desarrollador del sistema, quiero que la implementación sea compatible con la estructura existente, para mantener la estabilidad y funcionalidad actual del componente.

#### Acceptance Criteria

1. WHEN se implementan las mejoras THEN el sistema SHALL mantener todas las funciones existentes del componente
2. WHEN se agregan nuevas funcionalidades THEN el sistema SHALL preservar la compatibilidad con los callbacks existentes
3. WHEN se modifica la interfaz THEN el sistema SHALL mantener la responsividad y el tema visual actual
4. WHEN se ejecutan las funciones THEN el sistema SHALL mantener el manejo de eventos y la delegación existente