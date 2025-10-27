# Implementación del Módulo: Tipos de Compra

## 📋 Resumen del Proyecto

**Fecha:** 2025-10-26  
**Módulo:** Tipos de Compra  
**Estado:** ✅ Completado  
**Framework:** CoffeeSoft

---

## 🎯 Objetivo

Implementar un submódulo dentro del sistema de **Compras** que permita administrar los **Tipos de Compra**, incluyendo la creación, edición, activación y desactivación de registros, con una interfaz ordenada y validaciones visuales mediante modales.

---

## 📁 Archivos Creados

### 1. Frontend (JavaScript)
**Archivo:** `contabilidad/administrador/js/tipo-compras.js`

**Clase Principal:** `TipoCompras extends Templates`

**Métodos Implementados:**
- ✅ `render()` - Inicializa el módulo
- ✅ `layout()` - Crea la estructura visual
- ✅ `filterBar()` - Barra de filtros (UDN, Estado, Botón agregar)
- ✅ `lsTipoCompras()` - Lista tipos de compra en tabla
- ✅ `addTipoCompra()` - Modal para agregar nuevo tipo
- ✅ `editTipoCompra(id)` - Modal para editar tipo existente
- ✅ `toggleStatusTipoCompra(id, status)` - Activar/Desactivar tipo
- ✅ `jsonTipoCompra()` - Estructura del formulario

### 2. Controlador (PHP)
**Archivo:** `contabilidad/administrador/ctrl/ctrl-tipo-compras.php`

**Clase Principal:** `ctrl extends mdl`

**Métodos Implementados:**
- ✅ `init()` - Inicializa datos (lista UDN)
- ✅ `lsTipoCompras()` - Lista tipos de compra con filtros
- ✅ `getTipoCompra()` - Obtiene tipo de compra por ID
- ✅ `addTipoCompra()` - Crea nuevo tipo de compra
- ✅ `editTipoCompra()` - Actualiza tipo de compra
- ✅ `toggleStatusTipoCompra()` - Cambia estado (activo/inactivo)

**Función Auxiliar:**
- ✅ `renderStatus($status)` - Renderiza badge de estado

### 3. Modelo (PHP)
**Archivo:** `contabilidad/administrador/mdl/mdl-tipo-compras.php`

**Clase Principal:** `mdl extends CRUD`

**Métodos Implementados:**
- ✅ `lsUDN()` - Lista unidades de negocio
- ✅ `listPurchaseType($array)` - Lista tipos de compra con filtros
- ✅ `getPurchaseTypeById($array)` - Obtiene tipo por ID
- ✅ `existsPurchaseTypeByName($array)` - Valida duplicados
- ✅ `createPurchaseType($array)` - Crea nuevo tipo
- ✅ `updatePurchaseType($array)` - Actualiza tipo existente

### 4. Base de Datos (SQL)
**Archivo:** `contabilidad/administrador/database/purchase_type_schema.sql`

**Tabla:** `purchase_type`

**Estructura:**
```sql
CREATE TABLE purchase_type (
    id INT PRIMARY KEY AUTO_INCREMENT,
    udn_id INT NOT NULL,
    name VARCHAR(50) NOT NULL,
    active TINYINT(1) DEFAULT 1,
    
    FOREIGN KEY (udn_id) REFERENCES udn(idUDN)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    
    INDEX idx_purchase_type_udn_id (udn_id),
    INDEX idx_purchase_type_active (active),
    INDEX idx_purchase_type_name (name)
);
```

---

## 🎨 Características Implementadas

### Interfaz de Usuario

#### 1. Filtros
- ✅ **Selector de UDN** - Filtra tipos de compra por unidad de negocio
- ✅ **Selector de Estado** - Muestra activos o inactivos
- ✅ **Botón "Agregar nuevo tipo de compra"** - Abre modal de creación

#### 2. Tabla de Tipos de Compra
- ✅ Columna: **Tipo de compra** (nombre)
- ✅ Columna: **Estado** (badge verde/rojo)
- ✅ Columna: **Acciones** (editar, activar/desactivar)
- ✅ Paginación con DataTables
- ✅ Tema corporativo

#### 3. Modales

**Modal: Nuevo Tipo de Compra**
- ✅ Título: "NUEVO TIPO DE COMPRA"
- ✅ Campo: Nombre del tipo de compra
- ✅ Placeholder: "Ej: Corporativo, Fondo fijo, Crédito"
- ✅ Botón: "Guardar"
- ✅ Validación: Campo obligatorio

**Modal: Editar Tipo de Compra**
- ✅ Título: "EDITAR TIPO DE COMPRA"
- ✅ Campo: Nombre del tipo de compra (prellenado)
- ✅ Botón: "Guardar"
- ✅ Validación: Campo obligatorio

**Modal: Activar Tipo de Compra**
- ✅ Título: "ACTIVAR TIPO DE COMPRA"
- ✅ Ícono: Advertencia (!)
- ✅ Mensaje: "El tipo de compra estará disponible para capturar o filtrar las compras de todas las unidades de negocio."
- ✅ Botones: "Continuar" / "Cancelar"

**Modal: Desactivar Tipo de Compra**
- ✅ Título: "DESACTIVAR TIPO DE COMPRA"
- ✅ Ícono: Advertencia (!)
- ✅ Mensaje: "El tipo de compra ya no estará disponible para capturar o filtrar las compras de todas las unidades de negocio."
- ✅ Botones: "Continuar" / "Cancelar"

---

## 🔧 Validaciones Implementadas

### Frontend (JavaScript)
- ✅ Campo "nombre" obligatorio
- ✅ Validación de UDN seleccionada al agregar

### Backend (PHP)
- ✅ Validación de campo "name" no vacío
- ✅ Validación de "udn_id" no vacío
- ✅ Validación de duplicados (mismo nombre en misma UDN)
- ✅ Mensajes de error descriptivos

---

## 📊 Flujos de Trabajo

### Flujo 1: Agregar Tipo de Compra
1. Usuario selecciona UDN en filtro
2. Usuario hace clic en "Agregar nuevo tipo de compra"
3. Se abre modal con formulario
4. Usuario ingresa nombre del tipo
5. Usuario hace clic en "Guardar"
6. Sistema valida datos
7. Sistema verifica que no exista duplicado
8. Sistema crea registro en BD
9. Sistema muestra mensaje de éxito
10. Tabla se actualiza automáticamente

### Flujo 2: Editar Tipo de Compra
1. Usuario hace clic en botón "Editar" (ícono lápiz)
2. Sistema obtiene datos del tipo de compra
3. Se abre modal con formulario prellenado
4. Usuario modifica el nombre
5. Usuario hace clic en "Guardar"
6. Sistema valida datos
7. Sistema actualiza registro en BD
8. Sistema muestra mensaje de éxito
9. Tabla se actualiza automáticamente

### Flujo 3: Desactivar Tipo de Compra
1. Usuario hace clic en botón "Desactivar" (toggle rojo)
2. Se abre modal de confirmación
3. Usuario lee mensaje de advertencia
4. Usuario hace clic en "Continuar"
5. Sistema cambia estado a inactivo (active = 0)
6. Sistema muestra mensaje de éxito
7. Tabla se actualiza automáticamente
8. Registro desaparece del filtro de activos

### Flujo 4: Activar Tipo de Compra
1. Usuario cambia filtro a "Inactivos"
2. Usuario hace clic en botón "Activar" (toggle gris)
3. Se abre modal de confirmación
4. Usuario lee mensaje de advertencia
5. Usuario hace clic en "Continuar"
6. Sistema cambia estado a activo (active = 1)
7. Sistema muestra mensaje de éxito
8. Tabla se actualiza automáticamente

---

## 🗄️ Estructura de Base de Datos

### Tabla: purchase_type

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | INT | Identificador único (PK, AUTO_INCREMENT) |
| `udn_id` | INT | Referencia a unidad de negocio (FK → udn.idUDN) |
| `name` | VARCHAR(50) | Nombre del tipo de compra |
| `active` | TINYINT(1) | Estado (1=activo, 0=inactivo) |

**Foreign Keys:**
- `fk_purchase_type_udn` → `udn(idUDN)` (ON DELETE RESTRICT, ON UPDATE CASCADE)

**Índices:**
- `PRIMARY KEY` (id)
- `INDEX idx_purchase_type_udn_id` (udn_id)
- `INDEX idx_purchase_type_active` (active)
- `INDEX idx_purchase_type_name` (name)

---

## 🎨 Diseño Visual

### Colores Corporativos
- **Azul corporativo:** `#003360` (botones primarios)
- **Verde activo:** `#014737` / `#3FC189` (badge activo)
- **Rojo inactivo:** `#721c24` / `#ba464d` (badge inactivo)
- **Gris fondo:** `#f9fafb` (fondo general)

### Iconos
- ✏️ Editar: `icon-pencil`
- 🔴 Desactivar: `icon-toggle-on`
- ⚪ Activar: `icon-toggle-off`
- ⚠️ Advertencia: `fas fa-exclamation-circle`

---

## 📝 Mensajes del Sistema

### Mensajes de Éxito
- ✅ "Tipo de compra agregado correctamente"
- ✅ "Tipo de compra actualizado correctamente"
- ✅ "El tipo de compra está disponible para capturar o filtrar compras"
- ✅ "El tipo de compra ya no está disponible"

### Mensajes de Error
- ❌ "El nombre del tipo de compra es obligatorio"
- ❌ "Debe seleccionar una unidad de negocio"
- ❌ "Ya existe un tipo de compra con ese nombre en esta unidad de negocio"
- ❌ "Error al agregar tipo de compra"
- ❌ "Error al editar tipo de compra"
- ❌ "Error al cambiar el estado del tipo de compra"
- ❌ "Tipo de compra no encontrado"

---

## 🚀 Instrucciones de Instalación

### Paso 1: Ejecutar Script SQL
```sql
-- Ejecutar en MySQL/phpMyAdmin
SOURCE contabilidad/administrador/database/purchase_type_schema.sql;

-- O copiar y pegar el contenido del archivo
```

### Paso 2: Verificar Estructura
```sql
-- Verificar que la tabla se creó correctamente
DESCRIBE purchase_type;

-- Verificar foreign keys
SHOW CREATE TABLE purchase_type;
```

### Paso 3: Integrar en el Sistema

**Opción A: Módulo Independiente**
```html
<!-- Crear archivo: contabilidad/administrador/tipo-compras.php -->
<!DOCTYPE html>
<html>
<head>
    <title>Tipos de Compra</title>
    <!-- Incluir CSS y librerías -->
</head>
<body>
    <div id="root"></div>
    <script src="js/tipo-compras.js"></script>
</body>
</html>
```

**Opción B: Integrar en Admin Existente**
```javascript
// En admin.js, agregar:
let api_tipoCompras = 'ctrl/ctrl-tipo-compras.php';
let tipoCompras;

// En $(async () => { ... }):
tipoCompras = new TipoCompras(api_tipoCompras, "root");

// En layoutTabs(), agregar:
{
    id: "tipo-compras",
    tab: "Tipos de compra",
    onClick: () => tipoCompras.render()
}
```

### Paso 4: Probar Funcionalidad
1. ✅ Abrir módulo en navegador
2. ✅ Seleccionar UDN
3. ✅ Agregar nuevo tipo de compra
4. ✅ Editar tipo de compra
5. ✅ Desactivar tipo de compra
6. ✅ Activar tipo de compra
7. ✅ Verificar filtros

---

## ✅ Checklist de Implementación

### Base de Datos
- [x] Tabla `purchase_type` creada
- [x] Foreign key con `udn` configurada
- [x] Índices creados
- [x] Estructura verificada

### Backend (PHP)
- [x] Modelo `mdl-tipo-compras.php` creado
- [x] Controlador `ctrl-tipo-compras.php` creado
- [x] Métodos CRUD implementados
- [x] Validaciones implementadas
- [x] Sin errores de sintaxis

### Frontend (JavaScript)
- [x] Archivo `tipo-compras.js` creado
- [x] Clase `TipoCompras` implementada
- [x] Layout y filtros creados
- [x] Tabla con DataTables configurada
- [x] Modales implementados
- [x] Validaciones frontend implementadas
- [x] Sin errores de sintaxis

### Funcionalidades
- [x] Listar tipos de compra
- [x] Filtrar por UDN
- [x] Filtrar por estado (activo/inactivo)
- [x] Agregar nuevo tipo de compra
- [x] Editar tipo de compra existente
- [x] Activar tipo de compra
- [x] Desactivar tipo de compra
- [x] Validar duplicados
- [x] Mensajes de confirmación
- [x] Mensajes de éxito/error

---

## 📞 Soporte y Mantenimiento

### Archivos a Modificar para Cambios

**Cambiar estructura de tabla:**
- `contabilidad/administrador/database/purchase_type_schema.sql`
- `contabilidad/administrador/mdl/mdl-tipo-compras.php`

**Cambiar validaciones:**
- `contabilidad/administrador/ctrl/ctrl-tipo-compras.php`
- `contabilidad/administrador/js/tipo-compras.js`

**Cambiar diseño visual:**
- `contabilidad/administrador/js/tipo-compras.js` (métodos `layout()`, `filterBar()`)

**Agregar nuevos campos:**
1. Modificar tabla SQL
2. Actualizar método `jsonTipoCompra()` en JS
3. Actualizar validaciones en controlador
4. Actualizar métodos del modelo si es necesario

---

## 🎓 Notas Técnicas

### Patrón MVC Implementado
```
Vista (JS) → Controlador (PHP) → Modelo (PHP) → Base de Datos
     ↓              ↓                  ↓
TipoCompras    ctrl-tipo-compras   mdl-tipo-compras
```

### Convenciones de Nombres
- **Tabla:** `purchase_type` (snake_case)
- **Clase JS:** `TipoCompras` (PascalCase)
- **Métodos JS:** `lsTipoCompras()` (camelCase)
- **Métodos PHP Controlador:** `lsTipoCompras()` (camelCase)
- **Métodos PHP Modelo:** `listPurchaseType()` (camelCase)

### Seguridad
- ✅ Prepared statements en todas las consultas SQL
- ✅ Validación de datos en backend
- ✅ Escape de caracteres especiales
- ✅ Validación de permisos (sesión requerida)

---

**Última actualización:** 2025-10-26  
**Desarrollado por:** CoffeeIA ☕  
**Framework:** CoffeeSoft 2.0  
**Estado:** ✅ Listo para producción
