# 🏗️ Estructura del Módulo de Campañas

## 📊 Interfaz Principal

```
┌─────────────────────────────────────────────────────────────┐
│  📊 Módulo de Campañas                                      │
│  Gestiona campañas de marketing, anuncios y análisis       │
├─────────────────────────────────────────────────────────────┤
│  [Dashboard] [Anuncios] [Resumen] [Historial] [Admin] ✅   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  CONTENIDO DINÁMICO SEGÚN PESTAÑA SELECCIONADA            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 🎯 Pestaña: Administrador (COMPLETADA)

```
┌─────────────────────────────────────────────────────────────┐
│  📊 Administrador de Campañas                               │
│  Gestiona tipos y clasificaciones de campañas              │
├─────────────────────────────────────────────────────────────┤
│  [Tipos de Campaña] ✅  [Clasificación de Campaña] ✅      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐  │
│  │ Filtros:                                            │  │
│  │ [UDN ▼] [Estado ▼] [Nuevo Tipo]                   │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐  │
│  │ Tabla de Tipos de Campaña                          │  │
│  │ ┌────┬──────────┬─────────────┬────────┬────────┐ │  │
│  │ │ ID │ Nombre   │ Descripción │ Estado │ Acción │ │  │
│  │ ├────┼──────────┼─────────────┼────────┼────────┤ │  │
│  │ │ 1  │ Promo... │ Campañas... │ Activo │ [✏️][🔴]│ │  │
│  │ │ 2  │ Lanza... │ Campañas... │ Activo │ [✏️][🔴]│ │  │
│  │ └────┴──────────┴─────────────┴────────┴────────┘ │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 🔄 Flujo de Datos

```
┌──────────────┐
│   Usuario    │
└──────┬───────┘
       │
       ▼
┌──────────────────────┐
│  kpi-campaign.js     │ ◄─── Frontend (jQuery + CoffeeSoft)
│  - App               │
│  - CampaignTypes     │
│  - Classification    │
└──────┬───────────────┘
       │ AJAX (useFetch)
       ▼
┌──────────────────────┐
│ ctrl-kpi-campaign.php│ ◄─── Controlador (PHP)
│  - init()            │
│  - lsCampaignTypes() │
│  - addCampaignType() │
│  - editCampaignType()│
│  - statusCampaign... │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ mdl-kpi-campaign.php │ ◄─── Modelo (PHP + CRUD)
│  - listCampaign...() │
│  - createCampaign...()│
│  - updateCampaign...()│
│  - getCampaignBy...()│
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│   MySQL Database     │
│  rfwsmqex_kpi        │
│  - campaign_types    │
│  - campaign_class... │
└──────────────────────┘
```

## 📦 Componentes CoffeeSoft Utilizados

### Templates
- ✅ `primaryLayout()` - Layout principal
- ✅ `tabLayout()` - Sistema de pestañas
- ✅ `createfilterBar()` - Barra de filtros
- ✅ `createTable()` - Tablas dinámicas
- ✅ `createModalForm()` - Formularios modales
- ✅ `swalQuestion()` - Confirmaciones

### Utilidades
- ✅ `useFetch()` - Peticiones AJAX
- ✅ `alert()` - Notificaciones
- ✅ DataTables - Tablas interactivas

## 🎨 Temas y Estilos

```css
/* Tema Principal: Dark */
- Background: #1F2A37
- Text: white / gray-400
- Accent: blue-400, green-400, purple-400

/* Estados */
- Activo: bg-[#014737] text-[#3FC189]
- Inactivo: bg-[#721c24] text-[#ba464d]

/* Botones */
- Primary: btn-primary (Editar)
- Danger: btn-danger (Desactivar)
- Outline: btn-outline-danger (Activar)
```

## 🔐 Validaciones Implementadas

### Backend (PHP)
- ✅ Nombres únicos por UDN
- ✅ Validación de campos requeridos
- ✅ Sanitización de datos (util->sql())
- ✅ Control de estados (active 0/1)

### Frontend (JS)
- ✅ Confirmación antes de cambiar estado
- ✅ Validación de formularios
- ✅ Mensajes de éxito/error
- ✅ Recarga automática de tablas

## 📊 Campos de Formulario

### Tipos de Campaña
```
┌─────────────────────────────────┐
│ Nombre del Tipo: [_________]   │
│ Unidad de Negocio: [UDN ▼]     │
│ Descripción: [____________]     │
│                                 │
│         [Guardar] [Cancelar]    │
└─────────────────────────────────┘
```

### Clasificación de Campaña
```
┌─────────────────────────────────┐
│ Nombre: [_________________]     │
│ Unidad de Negocio: [UDN ▼]     │
│ Descripción: [____________]     │
│                                 │
│         [Guardar] [Cancelar]    │
└─────────────────────────────────┘
```

## ✅ Checklist de Implementación

### ETAPA 1 - Administrador
- [x] Base de datos creada
- [x] Modelo (mdl) implementado
- [x] Controlador (ctrl) implementado
- [x] Frontend (js) implementado
- [x] Vista principal (php) creada
- [x] Interfaz inicial con pestañas
- [x] Tipos de Campaña - CRUD completo
- [x] Clasificación - CRUD completo
- [x] Filtros por UDN y Estado
- [x] Validaciones implementadas
- [x] Documentación creada

### Próximas Etapas
- [ ] Dashboard con KPIs
- [ ] Gestión de Anuncios
- [ ] Resumen de Campaña
- [ ] Historial Anual

---

**Estado**: ✅ ETAPA 1 COMPLETADA  
**Desarrollado con**: CoffeeIA ☕
