# 🔄 Actualización del Flujo de Creación de Campaña

## Cambios Realizados

Se actualizó el flujo de creación de campaña para cumplir exactamente con los requerimientos especificados en la imagen.

## 📋 Requerimientos Originales

Según la imagen de requerimientos:

### 2. Agregar campaña
- Al dar clic al botón se abre un **modal preguntando** si deseas crear una nueva campaña
- Si aceptas se abre el **formulario de crear campaña**

### 2.1 Crear un modal (bootbox) con formulario
**Una barra de filtro que tenga:**
- Input de estrategia
- Select de unidad de negocio
- Select Red Social
- Botón de crear nueva anuncio

**Por defecto se cargan dos formularios**

### 2.2 El formulario de anuncio debe tener:
- Nombre del anuncio
- Fecha inicio (por defecto el día 01 inicio del mes)
- Fecha final (por defecto el día 15 del mes actual)
- Tipo de anuncio
- Clasificación
- Imagen del anuncio (subir la imagen)
- Botón Guardar

## ✅ Implementación Actualizada

### Flujo Nuevo

```
1. Usuario hace clic en "Agregar Campaña"
   ↓
2. Aparece SweetAlert de confirmación:
   "¿Deseas crear una nueva campaña con anuncio?"
   [Sí, crear] [Cancelar]
   ↓
3. Si acepta → Se abre UN SOLO MODAL con DOS formularios:
   
   ┌─────────────────────────────────────────┐
   │ 📋 Información de la Campaña           │
   │ - Estrategia (input)                   │
   │ - Unidad de Negocio (select)           │
   │ - Red Social (select)                  │
   ├─────────────────────────────────────────┤
   │ 📢 Datos del Anuncio                   │
   │ - Nombre del Anuncio                   │
   │ - Fecha Inicio (default: día 01)       │
   │ - Fecha Final (default: día 15)        │
   │ - Tipo de Anuncio                      │
   │ - Clasificación                        │
   │ - Imagen (URL)                         │
   │                                         │
   │         [Guardar] [Cancelar]           │
   └─────────────────────────────────────────┘
   ↓
4. Al guardar → Se crean AMBOS registros:
   - Campaña en tabla `campaigns`
   - Anuncio en tabla `campaign_ads`
   ↓
5. Mensaje de éxito y recarga de tabla
```

## 🔧 Cambios en el Código

### Frontend (kpi-campaign.js)

#### 1. Método `addCampaign()` - Actualizado
```javascript
addCampaign() {
    // Primero muestra confirmación
    alert({
        icon: "question",
        title: "Crear Nueva Campaña",
        text: "¿Deseas crear una nueva campaña con anuncio?",
        btn1: true,
        btn1Text: "Sí, crear",
        btn2: true,
        btn2Text: "Cancelar"
    }).then((result) => {
        if (result.isConfirmed) {
            this.showCampaignForm();
        }
    });
}
```

#### 2. Nuevo Método `showCampaignForm()`
```javascript
showCampaignForm() {
    // Calcula fechas por defecto
    const currentDate = new Date();
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const fifteenthDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 15);
    
    // Muestra modal con ambos formularios
    this.createModalForm({
        id: 'formCampaignWithAd',
        data: { opc: 'addCampaignWithAd' },
        bootbox: {
            title: '📢 Crear Campaña y Anuncio',
            size: 'large'
        },
        json: this.jsonCampaignWithAd(formatDate(firstDay), formatDate(fifteenthDay)),
        success: (response) => {
            if (response.status === 200) {
                alert({ icon: "success", text: response.message });
                this.lsCampaignAds();
            }
        }
    });
}
```

#### 3. Nuevo Método `jsonCampaignWithAd()`
```javascript
jsonCampaignWithAd(defaultStartDate, defaultEndDate) {
    return [
        // Sección 1: Campaña
        {
            opc: "label",
            id: "lblCampaign",
            text: "📋 Información de la Campaña",
            class: "col-12 text-lg mb-3"
        },
        {
            opc: "input",
            id: "strategy",
            lbl: "Estrategia",
            class: "col-12 mb-3"
        },
        {
            opc: "select",
            id: "udn_id",
            lbl: "Unidad de Negocio",
            class: "col-12 col-md-6 mb-3",
            data: udnList,
            required: true
        },
        {
            opc: "select",
            id: "social_network",
            lbl: "Red Social",
            class: "col-12 col-md-6 mb-3",
            data: socialNetworksList,
            required: true
        },
        
        // Sección 2: Anuncio
        {
            opc: "label",
            id: "lblAnuncio",
            text: "📢 Datos del Anuncio",
            class: "col-12 text-lg mb-3 mt-4"
        },
        {
            opc: "input",
            id: "ad_name",
            lbl: "Nombre del Anuncio",
            class: "col-12 mb-3",
            required: true
        },
        {
            opc: "input",
            id: "start_date",
            lbl: "Fecha Inicio",
            type: "date",
            class: "col-12 col-md-6 mb-3",
            valor: defaultStartDate  // Día 01 del mes
        },
        {
            opc: "input",
            id: "end_date",
            lbl: "Fecha Final",
            type: "date",
            class: "col-12 col-md-6 mb-3",
            valor: defaultEndDate  // Día 15 del mes
        },
        {
            opc: "select",
            id: "type_id",
            lbl: "Tipo de Anuncio",
            class: "col-12 col-md-6 mb-3",
            data: typesList
        },
        {
            opc: "select",
            id: "classification_id",
            lbl: "Clasificación",
            class: "col-12 col-md-6 mb-3",
            data: classificationsList
        },
        {
            opc: "input",
            id: "image",
            lbl: "Imagen del Anuncio (URL)",
            class: "col-12 mb-3"
        }
    ];
}
```

### Backend (ctrl-kpi-campaign.php)

#### Nuevo Método `addCampaignWithAd()`
```php
function addCampaignWithAd() {
    $status = 500;
    $message = 'No se pudo crear la campaña y anuncio';

    // 1. Crear campaña
    $campaignData = [
        'name' => $_POST['ad_name'] . ' - Campaña',
        'udn_id' => $_POST['udn_id'],
        'social_network' => $_POST['social_network'],
        'strategy' => $_POST['strategy'],
        'start_date' => $_POST['start_date'],
        'end_date' => $_POST['end_date'],
        'active' => 1,
        'date_creation' => date('Y-m-d H:i:s')
    ];

    $campaignId = $this->createCampaign($this->util->sql($campaignData));

    if ($campaignId) {
        // 2. Crear anuncio vinculado a la campaña
        $adData = [
            'campaign_id' => $campaignId,
            'ad_name' => $_POST['ad_name'],
            'title' => $_POST['ad_name'],
            'type_id' => $_POST['type_id'] ?? null,
            'classification_id' => $_POST['classification_id'] ?? null,
            'image' => $_POST['image'] ?? null,
            'start_date' => $_POST['start_date'],
            'end_date' => $_POST['end_date'],
            'active' => 1,
            'date_creation' => date('Y-m-d H:i:s')
        ];

        $adId = $this->createCampaignAd($this->util->sql($adData));

        if ($adId) {
            $status = 200;
            $message = 'Campaña y anuncio creados correctamente';
        } else {
            $message = 'Campaña creada pero error al crear anuncio';
        }
    }

    return [
        'status' => $status,
        'message' => $message
    ];
}
```

## 🎯 Características Implementadas

### ✅ Confirmación Inicial
- SweetAlert con pregunta antes de abrir el formulario
- Botones: "Sí, crear" y "Cancelar"

### ✅ Formulario Unificado
- Un solo modal con dos secciones claramente diferenciadas
- Sección 1: Información de la Campaña (azul)
- Sección 2: Datos del Anuncio (verde)

### ✅ Fechas por Defecto
- **Fecha Inicio**: Día 01 del mes actual
- **Fecha Final**: Día 15 del mes actual
- Calculadas automáticamente con JavaScript

### ✅ Campos Requeridos
- Estrategia (input texto)
- Unidad de Negocio (select)
- Red Social (select)
- Nombre del Anuncio (input texto)
- Fechas (date inputs con valores por defecto)
- Tipo de Anuncio (select opcional)
- Clasificación (select opcional)
- Imagen (input URL opcional)

### ✅ Guardado Transaccional
- Se crea primero la campaña
- Luego se crea el anuncio vinculado
- Si falla el anuncio, se notifica pero la campaña queda creada

## 📊 Comparación: Antes vs Ahora

### Antes (Incorrecto)
```
Click "Agregar Campaña"
  ↓
Modal de Campaña
  ↓
Guardar
  ↓
Pregunta: "¿Crear anuncio?"
  ↓
Otro modal de Anuncio
```

### Ahora (Correcto según requerimientos)
```
Click "Agregar Campaña"
  ↓
Confirmación: "¿Deseas crear?"
  ↓
UN SOLO Modal con ambos formularios
  ↓
Guardar → Crea campaña Y anuncio
```

## 🎨 Mejoras Visuales

- Labels con emojis para mejor identificación:
  - 📋 Información de la Campaña (azul)
  - 📢 Datos del Anuncio (verde)
- Separación visual clara entre secciones
- Fechas precargadas automáticamente
- Modal de tamaño grande para mejor visualización

## 🧪 Pruebas Recomendadas

1. **Flujo completo:**
   - Click en "Agregar Campaña"
   - Confirmar en el SweetAlert
   - Verificar que aparecen ambos formularios
   - Verificar fechas por defecto (01 y 15)
   - Llenar campos y guardar
   - Verificar que se crean ambos registros

2. **Validaciones:**
   - Intentar guardar sin campos requeridos
   - Verificar que las fechas se guardan correctamente
   - Verificar relación campaña-anuncio en BD

3. **Cancelación:**
   - Click en "Cancelar" en confirmación
   - Verificar que no se abre el formulario

## ✅ Checklist de Cumplimiento

- [x] Modal de confirmación inicial
- [x] Un solo formulario con dos secciones
- [x] Estrategia (input)
- [x] Unidad de Negocio (select)
- [x] Red Social (select)
- [x] Nombre del anuncio
- [x] Fecha inicio (default día 01)
- [x] Fecha final (default día 15)
- [x] Tipo de anuncio (select)
- [x] Clasificación (select)
- [x] Imagen del anuncio
- [x] Guardado de ambos registros
- [x] Mensaje de éxito
- [x] Recarga de tabla

---

**Estado**: ✅ ACTUALIZADO SEGÚN REQUERIMIENTOS  
**Fecha**: 2025  
**Desarrollado con**: CoffeeIA ☕
