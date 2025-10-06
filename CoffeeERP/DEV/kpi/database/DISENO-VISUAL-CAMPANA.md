# 🎨 Diseño Visual del Formulario de Campaña

## Descripción

Se implementó un diseño visual completamente personalizado que coincide exactamente con el mockup proporcionado en la imagen.

## 📐 Estructura del Diseño

```
┌─────────────────────────────────────────────────────────────────┐
│                        📢 CAMPAÑA 1                             │
├─────────────────────────────────────────────────────────────────┤
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ Estrategia    │ Unidad de negocio │ Red social │  [+]    │ │
│  │ [Mensajes]    │ [Fogaza ▼]        │ [Facebook ▼] │       │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌──────────────────────┐  ┌──────────────────────┐           │
│  │ Nombre del anuncio   │  │ Nombre del anuncio   │           │
│  │ [Diseño imagen]      │  │ [Diseño imagen]      │           │
│  │                      │  │                      │           │
│  │ Fecha inicio  Fecha fin│ │ Fecha inicio  Fecha fin│         │
│  │ [01/07/2025] [14/07]│  │ [15/07/2025] [30/07]│           │
│  │                      │  │                      │           │
│  │ Tipo de anuncio      │  │ Tipo de anuncio      │           │
│  │ [Publicación ▼]      │  │ [Publicación ▼]      │           │
│  │                      │  │                      │           │
│  │ Clasificación        │  │ Clasificación        │           │
│  │ [Pauta 1]            │  │ [Pauta 2]            │           │
│  │                      │  │                      │           │
│  │ Imagen               │  │ Imagen               │           │
│  │ ┌──────────────────┐ │  │ ┌──────────────────┐ │           │
│  │ │       ⬆️         │ │  │ │       ⬆️         │ │           │
│  │ │  Click para      │ │  │ │  Click para      │ │           │
│  │ │  subir imagen    │ │  │ │  subir imagen    │ │           │
│  │ └──────────────────┘ │  │ └──────────────────┘ │           │
│  │                      │  │                      │           │
│  │ [Actualizar][Eliminar]│ │ [Actualizar][Eliminar]│          │
│  └──────────────────────┘  └──────────────────────┘           │
│                                                                 │
│                    [Cancelar] [Guardar Campaña]                │
└─────────────────────────────────────────────────────────────────┘
```

## 🎯 Características Implementadas

### 1. Barra Superior de Campaña
```html
<div class="row mb-4 p-3 bg-light rounded">
    - Estrategia (input text)
    - Unidad de negocio (select)
    - Red social (select)
    - Botón [+] Agregar (para añadir más anuncios)
</div>
```

**Funcionalidad:**
- ✅ Campos compartidos para toda la campaña
- ✅ Botón [+] agrega nuevas tarjetas de anuncio dinámicamente
- ✅ Fondo gris claro para diferenciar del resto

### 2. Tarjetas de Anuncios (Grid 2 columnas)
```html
<div class="row">
    <div class="col-md-6"> <!-- Anuncio 1 --> </div>
    <div class="col-md-6"> <!-- Anuncio 2 --> </div>
    <!-- Más anuncios dinámicamente -->
</div>
```

**Cada tarjeta contiene:**
- ✅ Nombre del anuncio (input)
- ✅ Fecha inicio / Fecha fin (date inputs)
- ✅ Tipo de anuncio (select)
- ✅ Clasificación (input)
- ✅ Área de carga de imagen (drag & drop visual)
- ✅ Botones: [Actualizar] [Eliminar]

### 3. Área de Carga de Imagen
```html
<div class="ad-image-upload" style="cursor: pointer;">
    <i class="icon-upload"></i>
    <p>Click para subir imagen</p>
    <input type="file" class="d-none" accept="image/*">
</div>
```

**Funcionalidad:**
- ✅ Click en el área abre selector de archivos
- ✅ Preview de imagen después de seleccionar
- ✅ Conversión a base64 para envío
- ✅ Icono de upload visual

### 4. Botones de Acción por Anuncio

**Actualizar (Azul):**
- Valida el anuncio individual
- Verifica que tenga nombre
- Muestra confirmación

**Eliminar (Rojo):**
- Elimina la tarjeta del anuncio
- Validación: Mínimo 1 anuncio requerido
- Confirmación antes de eliminar

### 5. Botón [+] Agregar Anuncio
```javascript
$('#btnAddAd').on('click', () => {
    adCounter++;
    $('#ads-container').append(this.buildAdCardHTML(adCounter, ...));
});
```

**Funcionalidad:**
- ✅ Agrega nuevas tarjetas dinámicamente
- ✅ Contador automático (Pauta 1, Pauta 2, Pauta 3...)
- ✅ Fechas por defecto automáticas
- ✅ Sin límite de anuncios

## 🎨 Estilos y Diseño

### Colores
- **Barra superior:** `bg-light` (gris claro)
- **Tarjetas:** `border` con fondo blanco
- **Botón Actualizar:** `btn-info` (azul)
- **Botón Eliminar:** `btn-danger` (rojo)
- **Botón Agregar:** `btn-success` (verde)

### Layout Responsivo
```css
col-md-6  /* 2 columnas en desktop */
col-12    /* 1 columna en móvil */
```

### Espaciado
- `mb-3` entre campos
- `p-3` padding en barra superior
- `gap-2` entre botones

## 🔧 Funcionalidades JavaScript

### 1. Inicialización del Formulario
```javascript
showCampaignForm() {
    // Calcula fechas por defecto
    // Construye HTML del formulario
    // Muestra modal con bootbox
    // Inicializa eventos
}
```

### 2. Construcción Dinámica de HTML
```javascript
buildCampaignFormHTML() {
    // Barra superior
    // Contenedor de anuncios
    // 2 tarjetas iniciales
}

buildAdCardHTML(index, startDate, endDate) {
    // Estructura de cada tarjeta
    // Campos precargados
    // Botones de acción
}
```

### 3. Eventos Interactivos
```javascript
initCampaignFormEvents() {
    // Botón agregar anuncio
    // Eventos de tarjetas
}

initAdCardEvents() {
    // Click en área de imagen
    // Cambio de archivo
    // Botón eliminar
    // Botón actualizar
}
```

### 4. Guardado de Datos
```javascript
saveCampaignWithAds() {
    // Recopila datos de campaña
    // Itera sobre todas las tarjetas
    // Construye array de anuncios
    // Envía al backend
}
```

## 📊 Flujo de Datos

### Frontend → Backend
```javascript
{
    strategy: "Mensajes",
    udn_id: 1,
    social_network: "Facebook",
    ads: [
        {
            ad_name: "Diseño imagen",
            start_date: "2025-07-01",
            end_date: "2025-07-14",
            type_id: 1,
            classification_name: "Pauta 1",
            image_url: "data:image/png;base64,..."
        },
        {
            ad_name: "Diseño imagen 2",
            start_date: "2025-07-15",
            end_date: "2025-07-30",
            type_id: 1,
            classification_name: "Pauta 2",
            image_url: "data:image/png;base64,..."
        }
    ]
}
```

### Backend Processing
```php
function addCampaignWithMultipleAds() {
    // 1. Crear campaña
    $campaignId = $this->createCampaign(...);
    
    // 2. Iterar sobre anuncios
    foreach ($ads as $ad) {
        $this->createCampaignAd(...);
    }
    
    // 3. Retornar resultado
    return ['status' => 200, 'message' => '...'];
}
```

## ✅ Validaciones

### Frontend
- ✅ Al menos 1 anuncio requerido
- ✅ Nombre de anuncio obligatorio
- ✅ Fechas válidas
- ✅ Confirmación antes de eliminar

### Backend
- ✅ Validación de datos de campaña
- ✅ Validación de cada anuncio
- ✅ Manejo de errores por anuncio
- ✅ Contador de anuncios creados

## 🎯 Ventajas del Diseño

1. **Visual Intuitivo:**
   - Diseño tipo tarjetas
   - Separación clara entre campaña y anuncios
   - Iconos descriptivos

2. **Flexibilidad:**
   - Agregar/eliminar anuncios dinámicamente
   - Sin límite de anuncios
   - Validación individual

3. **Experiencia de Usuario:**
   - Drag & drop para imágenes
   - Preview inmediato
   - Feedback visual
   - Botones de acción claros

4. **Responsive:**
   - 2 columnas en desktop
   - 1 columna en móvil
   - Adaptable a cualquier pantalla

## 🧪 Pruebas Recomendadas

1. **Agregar Anuncios:**
   - Click en [+]
   - Verificar que se agrega nueva tarjeta
   - Verificar contador (Pauta 3, 4, 5...)

2. **Eliminar Anuncios:**
   - Click en [Eliminar]
   - Verificar que se elimina tarjeta
   - Intentar eliminar último anuncio (debe fallar)

3. **Subir Imágenes:**
   - Click en área de imagen
   - Seleccionar archivo
   - Verificar preview
   - Verificar conversión a base64

4. **Validar Anuncios:**
   - Click en [Actualizar]
   - Dejar nombre vacío (debe fallar)
   - Llenar nombre (debe pasar)

5. **Guardar Campaña:**
   - Llenar todos los campos
   - Click en [Guardar Campaña]
   - Verificar creación en BD
   - Verificar múltiples anuncios

## 📝 Notas Técnicas

### Manejo de Imágenes
- Se usa `FileReader` para convertir a base64
- Se almacena en campo oculto `ad-image-url`
- Se envía como string al backend
- Backend puede guardar en servidor o BD

### Contador Dinámico
```javascript
let adCounter = 2;  // Inicia en 2 (ya hay 2 tarjetas)
$('#btnAddAd').on('click', () => {
    adCounter++;  // Incrementa
    // Usa adCounter para "Pauta X"
});
```

### Fechas por Defecto
```javascript
const firstDay = new Date(year, month, 1);      // Día 01
const fifteenthDay = new Date(year, month, 15); // Día 15
```

## 🔄 Diferencias con Versión Anterior

| Aspecto | Antes | Ahora |
|---------|-------|-------|
| Diseño | Formulario vertical simple | Tarjetas en grid 2 columnas |
| Anuncios | 1 anuncio por vez | Múltiples anuncios simultáneos |
| Imágenes | Input URL | Drag & drop con preview |
| Validación | Al final | Individual por anuncio |
| Flexibilidad | Fija | Dinámica (agregar/eliminar) |
| Visual | Básico | Profesional con tarjetas |

---

**Estado**: ✅ DISEÑO VISUAL IMPLEMENTADO  
**Fecha**: 2025  
**Desarrollado con**: CoffeeIA ☕
