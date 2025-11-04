# Design Document: Calendario de Pedidos Integrado

## Overview

El módulo de Calendario de Pedidos Integrado extiende la funcionalidad existente del módulo de pedidos agregando una vista de calendario interactivo. La solución se integra con la arquitectura actual del sistema, reutilizando los controladores y modelos existentes, y añadiendo una nueva capa de presentación basada en FullCalendar.js.

El diseño sigue el patrón MVC existente en el proyecto y se integra de manera no invasiva con el código actual, permitiendo que ambas vistas (lista y calendario) coexistan sin conflictos.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Pedidos Module                            │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐         ┌──────────────┐                  │
│  │  Vista Lista │◄────────┤ Toggle View  ├────────►         │
│  │   (Actual)   │         │   Button     │         │        │
│  └──────────────┘         └──────────────┘         │        │
│                                                     │        │
│  ┌──────────────────────────────────────────────┐  │        │
│  │         Vista Calendario (Nueva)              │  │        │
│  │  ┌────────────────────────────────────────┐  │  │        │
│  │  │      FullCalendar.js Component         │  │  │        │
│  │  └────────────────────────────────────────┘  │  │        │
│  └──────────────────────────────────────────────┘  │        │
│                      │                             │        │
│                      ▼                             ▼        │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           Shared Filter Bar Component                 │  │
│  │  (Fecha Inicio, Fecha Fin, Estado, Sucursal)         │  │
│  └──────────────────────────────────────────────────────┘  │
│                      │                                      │
└──────────────────────┼──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              Backend Layer (Existing)                        │
├─────────────────────────────────────────────────────────────┤
│  ctrl-pedidos.php                                            │
│  ├─ listOrders()      ← Reutilizado                         │
│  ├─ getOrderDetails() ← Reutilizado                         │
│  └─ getCalendarioData() ← Nuevo método                      │
│                                                              │
│  mdl-pedidos.php                                             │
│  └─ getOrders()       ← Reutilizado                         │
└─────────────────────────────────────────────────────────────┘
```

### Directory Structure

```
pedidos/
├── calendario/
│   ├── index.php              # Página principal del calendario
│   ├── ctrl/
│   │   └── ctrl-calendario.php # Controlador del calendario
│   ├── mdl/
│   │   └── mdl-calendario.php  # Modelo del calendario (hereda de MPedidos)
│   └── src/
│       ├── js/
│       │   ├── app-calendario.js      # Inicialización
│       │   └── calendario-pedidos.js  # Lógica del calendario
│       └── css/
│           └── calendario.css         # Estilos personalizados
├── ctrl/
│   └── ctrl-pedidos.php       # Controlador existente (se extiende)
├── mdl/
│   └── mdl-pedidos.php        # Modelo existente (sin cambios)
└── index.php                  # Vista de lista existente (se modifica)
```

## Components and Interfaces

### 1. Frontend Components

#### 1.1 Toggle View Component

**Ubicación:** `pedidos/index.php` (modificación)

**Responsabilidad:** Permitir al usuario cambiar entre vista lista y vista calendario.

**Interfaz:**
```html
<div class="view-toggle-buttons">
    <button id="btn-view-list" class="btn btn-secondary active">
        <i class="icon-list"></i> Lista
    </button>
    <button id="btn-view-calendar" class="btn btn-secondary">
        <i class="icon-calendar"></i> Calendario
    </button>
</div>
```

**Comportamiento:**
- Al hacer clic en "Calendario", oculta la tabla y muestra el contenedor del calendario
- Al hacer clic en "Lista", oculta el calendario y muestra la tabla
- Mantiene los filtros aplicados al cambiar de vista
- Actualiza la clase "active" en el botón correspondiente

#### 1.2 Calendar Container Component

**Ubicación:** `pedidos/index.php` (nuevo contenedor)

**Responsabilidad:** Contenedor donde se renderiza el calendario de FullCalendar.

**Interfaz:**
```html
<div id="pedidos-calendar-container" style="display: none;">
    <div id="pedidos-calendar"></div>
</div>
```

#### 1.3 FullCalendar Instance

**Ubicación:** `pedidos/calendario/src/js/calendario-pedidos.js`

**Responsabilidad:** Configurar y gestionar la instancia de FullCalendar.

**Configuración:**
```javascript
{
    initialView: 'dayGridMonth',
    locale: 'es',
    headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    events: function(info, successCallback, failureCallback) {
        // Cargar eventos desde el backend
    },
    eventClick: function(info) {
        // Abrir modal de detalle
    },
    eventContent: function(arg) {
        // Renderizar contenido personalizado del evento
    }
}
```

#### 1.4 Event Detail Modal

**Ubicación:** `pedidos/index.php` (reutiliza modal existente o crea uno nuevo)

**Responsabilidad:** Mostrar detalles completos del pedido al hacer clic en un evento.

**Interfaz:**
```html
<div id="modal-pedido-detalle" class="modal">
    <div class="modal-content">
        <div class="modal-header">
            <h3 id="modal-folio"></h3>
            <button class="close">&times;</button>
        </div>
        <div class="modal-body">
            <!-- Información del pedido -->
        </div>
    </div>
</div>
```

### 2. Backend Components

#### 2.1 Calendar Controller

**Archivo:** `pedidos/calendario/ctrl/ctrl-calendario.php`

**Clase:** `CalendarioPedidos extends Pedidos`

**Métodos:**

```php
class CalendarioPedidos extends Pedidos {
    
    /**
     * Obtiene los pedidos en formato compatible con FullCalendar
     * @return array Eventos formateados para FullCalendar
     */
    function getCalendarioData() {
        // Obtiene pedidos usando el método existente listOrders()
        // Transforma los datos al formato de FullCalendar
        // Retorna array de eventos
    }
    
    /**
     * Obtiene el detalle de un pedido específico
     * @return array Información completa del pedido
     */
    function getOrderDetail() {
        // Reutiliza getOrderDetails() del controlador padre
    }
}
```

#### 2.2 Calendar Model

**Archivo:** `pedidos/calendario/mdl/mdl-calendario.php`

**Clase:** `MCalendarioPedidos extends MPedidos`

**Métodos:**

```php
class MCalendarioPedidos extends MPedidos {
    
    /**
     * Hereda todos los métodos de MPedidos
     * No requiere métodos adicionales en esta fase
     */
}
```

### 3. Data Flow

#### 3.1 Loading Calendar Events

```
Usuario → Clic en "Calendario"
    ↓
Frontend: calendario-pedidos.js
    ↓
AJAX Request: { opc: 'getCalendarioData', fi: '2025-11-01', ff: '2025-11-30', status: '1,2,3' }
    ↓
Backend: ctrl-calendario.php → getCalendarioData()
    ↓
Backend: Llama a listOrders() heredado
    ↓
Backend: Transforma datos al formato FullCalendar
    ↓
Response: JSON con eventos
    ↓
Frontend: FullCalendar renderiza eventos
```

#### 3.2 Viewing Order Details

```
Usuario → Clic en evento del calendario
    ↓
Frontend: eventClick handler
    ↓
AJAX Request: { opc: 'getOrderDetail', id: 123 }
    ↓
Backend: ctrl-calendario.php → getOrderDetail()
    ↓
Backend: Llama a getOrderDetails() heredado
    ↓
Response: JSON con detalles del pedido
    ↓
Frontend: Abre modal y muestra información
```

## Data Models

### Event Object (FullCalendar Format)

```javascript
{
    id: "123",                          // ID del pedido
    title: "P-MM-123 - Rosa Pérez",     // Folio + Cliente
    start: "2025-11-03T20:53:00",       // date_order + time_order
    backgroundColor: "#FFCC00",          // Color según estado
    borderColor: "#FFCC00",
    extendedProps: {
        folio: "P-MM-123",
        cliente: "Rosa Pérez",
        telefono: "555-1234",
        estado: "Pendiente",
        estadoId: 2,
        total: 1500.00,
        saldo: 500.00,
        domicilio: true,                // delivery_type
        nota: "Entregar en la tarde"
    }
}
```

### Order Data (Backend Format)

Reutiliza la estructura existente de `listOrders()`:

```php
[
    'id' => 123,
    'folio' => 'P-MM-123',
    'name_client' => 'Rosa Pérez',
    'phone' => '555-1234',
    'date_order' => '2025-11-03',
    'time_order' => '20:53',
    'idStatus' => 2,
    'status_label' => 'Pendiente',
    'total_pay' => 1500.00,
    'discount' => 0,
    'delivery_type' => 1,  // 1 = domicilio, 0 = recoger
    'note' => 'Entregar en la tarde'
]
```

## Error Handling

### Frontend Error Handling

1. **Error al cargar eventos:**
   - Mostrar mensaje de error en el calendario
   - Ofrecer botón de "Reintentar"
   - Log del error en consola

2. **Error al abrir detalle:**
   - Mostrar notificación de error con SweetAlert2
   - Mantener el calendario visible
   - Log del error en consola

3. **Error de conexión:**
   - Detectar timeout de AJAX
   - Mostrar mensaje amigable al usuario
   - Ofrecer opción de recargar

### Backend Error Handling

1. **Error en consulta de base de datos:**
   ```php
   return [
       'status' => 500,
       'message' => 'Error al obtener los pedidos',
       'data' => []
   ];
   ```

2. **Pedido no encontrado:**
   ```php
   return [
       'status' => 404,
       'message' => 'Pedido no encontrado',
       'data' => null
   ];
   ```

3. **Parámetros inválidos:**
   ```php
   return [
       'status' => 400,
       'message' => 'Parámetros inválidos',
       'data' => null
   ];
   ```

## Testing Strategy

### Unit Testing

**Objetivo:** Verificar que las funciones individuales funcionan correctamente.

**Áreas a probar:**
1. Transformación de datos de formato backend a formato FullCalendar
2. Cálculo de colores según estado
3. Formateo de fechas y horas
4. Generación de folios

### Integration Testing

**Objetivo:** Verificar que los componentes funcionan juntos correctamente.

**Escenarios:**
1. Cargar calendario con pedidos existentes
2. Filtrar pedidos por estado
3. Filtrar pedidos por rango de fechas
4. Cambiar entre vistas (lista ↔ calendario)
5. Abrir detalle de pedido desde calendario

### Manual Testing

**Objetivo:** Verificar la experiencia de usuario completa.

**Casos de prueba:**
1. Navegación entre meses
2. Visualización de múltiples pedidos en un día
3. Identificación visual de pedidos con envío a domicilio
4. Colores correctos según estado
5. Responsividad en diferentes tamaños de pantalla

### Performance Testing

**Objetivo:** Asegurar que el calendario funciona eficientemente.

**Métricas:**
1. Tiempo de carga inicial del calendario (< 2 segundos)
2. Tiempo de respuesta al cambiar de mes (< 500ms)
3. Tiempo de apertura del modal de detalle (< 300ms)
4. Rendimiento con 100+ pedidos en un mes

## Design Decisions and Rationales

### 1. Uso de FullCalendar.js

**Decisión:** Utilizar FullCalendar.js como librería de calendario.

**Razones:**
- Ya está implementado en el módulo de eventos
- Ampliamente documentado y mantenido
- Soporte nativo para múltiples vistas (mes, semana, día)
- Fácil personalización de eventos
- Compatible con el stack tecnológico actual

### 2. Herencia de Controladores

**Decisión:** Crear `CalendarioPedidos extends Pedidos` en lugar de modificar el controlador existente.

**Razones:**
- No invasivo: no modifica código existente
- Reutiliza toda la lógica de negocio
- Facilita el mantenimiento
- Permite agregar funcionalidad específica del calendario sin afectar la vista de lista

### 3. Directorio Separado

**Decisión:** Crear `pedidos/calendario/` como subdirectorio.

**Razones:**
- Organización clara del código
- Sigue el patrón existente en `eventos/calendario/`
- Facilita la localización de archivos relacionados
- Permite desarrollo independiente

### 4. Toggle de Vistas en la Misma Página

**Decisión:** Implementar el cambio de vista mediante show/hide en lugar de páginas separadas.

**Razones:**
- Mejor experiencia de usuario (sin recarga de página)
- Mantiene el estado de los filtros
- Transición más fluida
- Menor carga en el servidor

### 5. Reutilización del Método listOrders()

**Decisión:** Usar el método existente `listOrders()` y transformar los datos en el frontend.

**Razones:**
- Evita duplicación de lógica de negocio
- Garantiza consistencia de datos entre vistas
- Simplifica el mantenimiento
- Reduce el riesgo de bugs

### 6. Modal para Detalles

**Decisión:** Usar modal en lugar de redirección para mostrar detalles del pedido.

**Razones:**
- Mantiene el contexto del calendario
- Navegación más rápida
- Mejor experiencia de usuario
- Permite consultar múltiples pedidos sin perder la vista

## Integration Points

### 1. Integración con Filtros Existentes

El calendario debe responder a los mismos filtros que la vista de lista:
- Rango de fechas (fi, ff)
- Estado del pedido (status)
- Sucursal (subsidiaries_id)

### 2. Integración con Sistema de Colores

Reutilizar la función `status()` existente para mantener consistencia visual:
```php
function status($id) {
    switch($id) {
        case 1: return '<span style="color: #1E90FF">Cotización</span>';
        case 2: return '<span style="color: #FFCC00">Pendiente</span>';
        case 3: return '<span style="color: #8CC63F">Pagado</span>';
        case 4: return '<span style="color: #FF3B30">Cancelado</span>';
    }
}
```

### 3. Integración con Modal de Detalles Existente

Si existe un modal de detalles en la vista de lista, reutilizarlo para el calendario. Si no existe, crear uno nuevo que pueda ser usado por ambas vistas.

## Security Considerations

1. **Validación de Entrada:**
   - Validar parámetros de fecha (fi, ff)
   - Validar ID de pedido antes de consultar
   - Sanitizar datos antes de mostrar en el frontend

2. **Control de Acceso:**
   - Verificar sesión activa (`session_start()`)
   - Validar permisos de sucursal (`$_SESSION['SUB']`)
   - Restringir acceso a pedidos de otras sucursales

3. **Prevención de XSS:**
   - Escapar datos al renderizar en HTML
   - Usar `htmlspecialchars()` para datos de usuario
   - Validar formato de datos recibidos

4. **Prevención de SQL Injection:**
   - Usar prepared statements (ya implementado en `_Read()`)
   - No concatenar datos de usuario en queries
   - Validar tipos de datos

## Performance Optimization

1. **Carga Lazy de Eventos:**
   - Cargar solo eventos del mes visible
   - Implementar paginación en el backend si hay muchos pedidos

2. **Caché de Datos:**
   - Cachear respuesta de `getCalendarioData()` en el frontend
   - Invalidar caché al aplicar filtros

3. **Optimización de Queries:**
   - Reutilizar queries existentes optimizados
   - Agregar índices si es necesario (date_order, status)

4. **Minimización de Redraws:**
   - Actualizar solo eventos modificados
   - Usar `refetchEvents()` en lugar de recrear el calendario
