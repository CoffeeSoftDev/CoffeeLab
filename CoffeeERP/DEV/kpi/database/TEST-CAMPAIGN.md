# 🧪 Guía de Pruebas - Módulo de Campañas

## 📋 Pre-requisitos

1. ✅ Base de datos `rfwsmqex_kpi` creada
2. ✅ Tablas `campaign_types` y `campaign_classification` creadas
3. ✅ Tabla `rfwsmqex_gvsl_finanzas.udn` accesible
4. ✅ Sesión de usuario activa (cookie IDU)

## 🚀 Pasos de Prueba

### 1. Acceso al Módulo

```
URL: http://tu-dominio/kpi/campaign.php
```

**Resultado esperado:**
- ✅ Se muestra la interfaz principal
- ✅ Título: "📊 Módulo de Campañas"
- ✅ 5 pestañas visibles: Dashboard, Anuncios, Resumen, Historial, Administrador

---

### 2. Navegación entre Pestañas

**Prueba:**
1. Click en "Dashboard" → Debe mostrar mensaje "En desarrollo..."
2. Click en "Anuncios" → Debe mostrar mensaje "En desarrollo..."
3. Click en "Resumen de campaña" → Debe mostrar mensaje "En desarrollo..."
4. Click en "Historial Anual" → Debe mostrar mensaje "En desarrollo..."
5. Click en "Administrador" → Debe cargar el módulo completo

**Resultado esperado:**
- ✅ Cada pestaña cambia el contenido
- ✅ La pestaña "Administrador" carga correctamente

---

### 3. Administrador - Tipos de Campaña

#### 3.1 Visualización Inicial

**Resultado esperado:**
- ✅ Se muestra "📊 Administrador de Campañas"
- ✅ Dos sub-pestañas: "Tipos de Campaña" y "Clasificación de Campaña"
- ✅ Filtros: UDN y Estado
- ✅ Botón "Nuevo Tipo"
- ✅ Tabla con datos de ejemplo (si ejecutaste el SQL)

#### 3.2 Filtrar por UDN

**Prueba:**
1. Seleccionar una UDN del dropdown
2. La tabla debe actualizarse automáticamente

**Resultado esperado:**
- ✅ Solo se muestran tipos de esa UDN
- ✅ La tabla se recarga sin errores

#### 3.3 Filtrar por Estado

**Prueba:**
1. Cambiar entre "Activos" e "Inactivos"
2. La tabla debe actualizarse

**Resultado esperado:**
- ✅ Se filtran correctamente los registros
- ✅ Estados "Activo" aparecen con badge verde
- ✅ Estados "Inactivo" aparecen con badge rojo

#### 3.4 Agregar Nuevo Tipo

**Prueba:**
1. Click en "Nuevo Tipo"
2. Llenar formulario:
   - Nombre: "Campaña de Prueba"
   - UDN: Seleccionar cualquiera
   - Descripción: "Descripción de prueba"
3. Click en "Guardar"

**Resultado esperado:**
- ✅ Modal se abre correctamente
- ✅ Formulario tiene 3 campos
- ✅ Al guardar muestra mensaje de éxito
- ✅ Modal se cierra
- ✅ Tabla se actualiza con el nuevo registro

#### 3.5 Validación de Duplicados

**Prueba:**
1. Intentar agregar un tipo con el mismo nombre y UDN
2. Click en "Guardar"

**Resultado esperado:**
- ✅ Muestra mensaje: "Ya existe un tipo de campaña con ese nombre"
- ✅ No se crea el registro duplicado

#### 3.6 Editar Tipo

**Prueba:**
1. Click en botón de editar (✏️) de cualquier registro
2. Modificar el nombre
3. Click en "Guardar"

**Resultado esperado:**
- ✅ Modal se abre con datos precargados
- ✅ Al guardar muestra mensaje de éxito
- ✅ Tabla se actualiza con los cambios

#### 3.7 Cambiar Estado

**Prueba:**
1. Click en botón de estado (🔴 o toggle)
2. Confirmar en el diálogo

**Resultado esperado:**
- ✅ Aparece confirmación con SweetAlert
- ✅ Al confirmar, el estado cambia
- ✅ Badge se actualiza (verde ↔ rojo)
- ✅ Botones cambian según el estado

---

### 4. Administrador - Clasificación de Campaña

#### 4.1 Cambiar a Clasificación

**Prueba:**
1. Click en pestaña "Clasificación de Campaña"

**Resultado esperado:**
- ✅ Se carga la tabla de clasificaciones
- ✅ Filtros: UDN y Estado
- ✅ Botón "Nueva Clasificación"

#### 4.2 Agregar Clasificación

**Prueba:**
1. Click en "Nueva Clasificación"
2. Llenar formulario:
   - Nombre: "Digital"
   - UDN: Seleccionar
   - Descripción: "Campañas digitales"
3. Guardar

**Resultado esperado:**
- ✅ Modal se abre
- ✅ Se guarda correctamente
- ✅ Tabla se actualiza

#### 4.3 Operaciones CRUD

**Prueba:**
- Editar clasificación
- Cambiar estado
- Filtrar por UDN y Estado

**Resultado esperado:**
- ✅ Todas las operaciones funcionan igual que en Tipos

---

## 🐛 Errores Comunes y Soluciones

### Error: "No se puede conectar a la base de datos"

**Solución:**
```php
// Verificar en mdl-kpi-campaign.php
$this->bd = "rfwsmqex_kpi.";
```

### Error: "UDN no se carga"

**Solución:**
```sql
-- Verificar que existe la tabla
SELECT * FROM rfwsmqex_gvsl_finanzas.udn WHERE Stado = 1;
```

### Error: "Modal no se abre"

**Solución:**
```html
<!-- Verificar que están cargadas las librerías -->
<script src="../src/plugin/bootbox.min.js"></script>
```

### Error: "Tabla no se actualiza"

**Solución:**
```javascript
// Verificar en consola del navegador (F12)
// Debe mostrar la respuesta del servidor
```

---

## ✅ Checklist de Pruebas

### Funcionalidad Básica
- [ ] Acceso al módulo
- [ ] Navegación entre pestañas principales
- [ ] Carga de sub-pestañas en Administrador

### Tipos de Campaña
- [ ] Visualización de tabla
- [ ] Filtro por UDN
- [ ] Filtro por Estado
- [ ] Agregar nuevo tipo
- [ ] Validación de duplicados
- [ ] Editar tipo existente
- [ ] Cambiar estado (activar/desactivar)

### Clasificación de Campaña
- [ ] Visualización de tabla
- [ ] Filtro por UDN
- [ ] Filtro por Estado
- [ ] Agregar nueva clasificación
- [ ] Validación de duplicados
- [ ] Editar clasificación
- [ ] Cambiar estado

### Validaciones
- [ ] Nombres únicos por UDN
- [ ] Campos requeridos
- [ ] Mensajes de error claros
- [ ] Mensajes de éxito

### UI/UX
- [ ] Diseño responsive
- [ ] Tema dark aplicado
- [ ] Iconos visibles
- [ ] Badges de estado correctos
- [ ] Botones funcionan correctamente

---

## 📊 Datos de Prueba

### SQL para Insertar Datos de Prueba

```sql
-- Tipos de Campaña
INSERT INTO rfwsmqex_kpi.campaign_types (name, udn_id, description, active) VALUES
('Black Friday', 1, 'Campaña de descuentos especiales', 1),
('Día de las Madres', 1, 'Promoción especial madres', 1),
('Verano 2025', 1, 'Campaña de temporada', 0);

-- Clasificaciones
INSERT INTO rfwsmqex_kpi.campaign_classification (name, udn_id, description, active) VALUES
('Redes Sociales', 1, 'Campañas en Facebook, Instagram', 1),
('Email Marketing', 1, 'Campañas por correo electrónico', 1),
('Publicidad Tradicional', 1, 'TV, Radio, Prensa', 0);
```

---

## 🎯 Resultado Final Esperado

Al completar todas las pruebas:

✅ **Módulo funcional al 100%**
- Interfaz principal con 5 pestañas
- Administrador completamente operativo
- CRUD completo para Tipos y Clasificaciones
- Filtros funcionando correctamente
- Validaciones activas
- UI/UX profesional con tema dark

---

**Fecha de prueba**: _____________  
**Probado por**: _____________  
**Estado**: [ ] Aprobado [ ] Con observaciones  
**Observaciones**: _____________

---

**Desarrollado con**: CoffeeIA ☕
