# 🏢 Módulo de Proveedores

## 📋 Descripción General
Módulo para la gestión de proveedores por unidad de negocio dentro del sistema de contabilidad. Permite agregar, editar, activar y desactivar proveedores manteniendo trazabilidad contable.

---

## 🎯 Funcionalidades Implementadas

### ✅ Historia #1 – Interfaz inicial del módulo de Proveedores
- [x] Interfaz con pestañas y componentes definidos
- [x] Filtro desplegable para unidad de negocio
- [x] Tabla con campos: Proveedor, Estado, Acciones
- [x] Botón "Agregar nuevo proveedor"

### ✅ Historia #2 – Registro de nuevo proveedor
- [x] Modal "Nuevo Proveedor" con campos requeridos
- [x] Campo unidad de negocio (bloqueado con valor actual)
- [x] Campo nombre del proveedor
- [x] Validación de duplicados
- [x] Actualización automática de tabla

### ✅ Historia #3 – Edición de proveedor
- [x] Modal de edición con datos precargados
- [x] Unidad de negocio en modo solo lectura
- [x] Campo nombre editable
- [x] Actualización en base de datos

### ✅ Historia #4 – Activar y desactivar proveedor
- [x] Ícono de interruptor para cambiar estado
- [x] Mensaje de confirmación al desactivar
- [x] Mensaje de confirmación al activar
- [x] Botones Continuar/Cancelar
- [x] Trazabilidad contable preservada

---

## 📁 Estructura de Archivos

```
contabilidad/administrador/
├── proveedores.php              # Vista principal (HTML)
├── js/
│   └── proveedores.js          # Lógica frontend (jQuery + CoffeeSoft)
├── ctrl/
│   └── ctrl-proveedores.php    # Controlador (PHP)
├── mdl/
│   └── mdl-proveedores.php     # Modelo (PHP - Acceso a datos)
└── database/
    └── supplier.sql            # Script de creación de tabla
```

---

## 🗄️ Estructura de Base de Datos

### Tabla: `supplier`

| Campo    | Tipo         | Descripción                          |
|----------|--------------|--------------------------------------|
| id       | INT(11)      | ID único del proveedor (PK)         |
| name     | VARCHAR(255) | Nombre del proveedor                |
| udn_id   | INT(11)      | ID de unidad de negocio (FK)        |
| active   | TINYINT(1)   | Estado: 1=Activo, 0=Inactivo        |

**Índices:**
- PRIMARY KEY: `id`
- INDEX: `idx_udn_id` (udn_id)
- INDEX: `idx_active` (active)
- INDEX: `idx_name` (name)
- INDEX: `idx_udn_active` (udn_id, active)
- INDEX: `idx_name_udn` (name, udn_id)

---

## 🔧 Instalación

### 1. Crear la tabla en la base de datos
```sql
-- Ejecutar el archivo: database/supplier.sql
-- Base de datos: rfwsmqex_contabilidad
```

### 2. Configurar permisos de archivos
```bash
chmod 644 proveedores.php
chmod 644 js/proveedores.js
chmod 644 ctrl/ctrl-proveedores.php
chmod 644 mdl/mdl-proveedores.php
```

### 3. Verificar dependencias
- jQuery 3.7.0+
- Bootstrap 5.3.0+
- TailwindCSS
- CoffeeSoft Framework (coffeSoft.js + plugins.js)
- DataTables
- Select2
- SweetAlert2
- Bootbox

---

## 🚀 Uso del Módulo

### Acceso
```
URL: /contabilidad/administrador/proveedores.php
```

### Flujo de Trabajo

1. **Seleccionar Unidad de Negocio**
   - Usar el filtro desplegable superior
   - La tabla se actualiza automáticamente

2. **Agregar Proveedor**
   - Clic en "+ Agregar nuevo proveedor"
   - Completar nombre del proveedor
   - Guardar

3. **Editar Proveedor**
   - Clic en ícono de lápiz (✏️)
   - Modificar nombre
   - Guardar cambios

4. **Activar/Desactivar**
   - Clic en ícono de interruptor
   - Confirmar acción
   - El proveedor cambia de estado

---

## 📡 API Endpoints

### `init()`
**Descripción:** Inicializa datos para filtros  
**Método:** POST  
**Parámetros:** `opc: "init"`  
**Respuesta:**
```json
{
  "udn": [
    {"id": 1, "valor": "Fogaza"},
    {"id": 2, "valor": "Otra UDN"}
  ]
}
```

### `lsSuppliers()`
**Descripción:** Lista proveedores filtrados  
**Método:** POST  
**Parámetros:**
- `opc: "lsSuppliers"`
- `udn: <id_udn>`
- `active: <0|1>`

**Respuesta:**
```json
{
  "row": [
    {
      "id": 1,
      "Proveedor": "Marina Chiapas",
      "Estado": "<span>Activo</span>",
      "a": [...]
    }
  ],
  "ls": [...]
}
```

### `addSupplier()`
**Descripción:** Agrega nuevo proveedor  
**Método:** POST  
**Parámetros:**
- `opc: "addSupplier"`
- `name: <nombre>`
- `udn_id: <id_udn>`

**Respuesta:**
```json
{
  "status": 200,
  "message": "Proveedor agregado correctamente"
}
```

### `editSupplier()`
**Descripción:** Edita proveedor existente  
**Método:** POST  
**Parámetros:**
- `opc: "editSupplier"`
- `id: <id_proveedor>`
- `name: <nuevo_nombre>`

**Respuesta:**
```json
{
  "status": 200,
  "message": "Proveedor actualizado correctamente"
}
```

### `getSupplier()`
**Descripción:** Obtiene datos de un proveedor  
**Método:** POST  
**Parámetros:**
- `opc: "getSupplier"`
- `id: <id_proveedor>`

**Respuesta:**
```json
{
  "status": 200,
  "message": "Proveedor encontrado",
  "data": {
    "id": 1,
    "name": "Marina Chiapas",
    "udn_id": 1,
    "udn_name": "Fogaza",
    "active": 1
  }
}
```

### `toggleStatus()`
**Descripción:** Activa/desactiva proveedor  
**Método:** POST  
**Parámetros:**
- `opc: "toggleStatus"`
- `id: <id_proveedor>`
- `active: <0|1>`

**Respuesta:**
```json
{
  "status": 200,
  "message": "El proveedor estará disponible para captura de información."
}
```

---

## 🎨 Componentes Visuales

### Tabla de Proveedores
- **Tema:** Corporativo
- **Paginación:** 15 registros por página
- **DataTables:** Habilitado
- **Columnas:**
  - ID (oculto)
  - Proveedor
  - Estado (badge con color)
  - Acciones (editar/activar/desactivar)

### Modales
- **Agregar:** Formulario con campo nombre
- **Editar:** Formulario precargado
- **Confirmación:** SweetAlert2 para cambios de estado

---

## 🔒 Validaciones

### Frontend (JavaScript)
- Campo nombre requerido
- Unidad de negocio seleccionada

### Backend (PHP)
- Validación de campos vacíos
- Verificación de duplicados (nombre + UDN)
- Validación de existencia de proveedor al editar
- Validación de estado válido (0 o 1)

---

## 📝 Notas Técnicas

### Arquitectura MVC
- **Modelo (mdl):** Acceso a datos con clase CRUD
- **Controlador (ctrl):** Lógica de negocio
- **Vista (js):** Interfaz con CoffeeSoft Framework

### Nomenclatura
- **Frontend:** `lsSuppliers()`, `addSupplier()`, `editSupplier()`
- **Controlador:** `lsSuppliers()`, `addSupplier()`, `editSupplier()`
- **Modelo:** `listSuppliers()`, `createSupplier()`, `updateSupplier()`

### Trazabilidad Contable
Los proveedores desactivados:
- NO aparecen en filtros de captura
- SÍ aparecen en reportes históricos
- SÍ mantienen relaciones con registros existentes

---

## 🐛 Troubleshooting

### Error: "Ya existe un proveedor con ese nombre"
**Solución:** Verificar que no exista un proveedor activo con el mismo nombre en la misma UDN.

### Error: "Proveedor no encontrado"
**Solución:** Verificar que el ID del proveedor exista en la base de datos.

### Tabla no carga datos
**Solución:** 
1. Verificar conexión a base de datos
2. Revisar permisos de archivos PHP
3. Verificar que la tabla `supplier` exista
4. Revisar consola del navegador para errores JS

### Modal no se cierra después de guardar
**Solución:** Verificar que la respuesta del servidor tenga `status: 200`.

---

## 📞 Soporte

Para más información sobre el framework CoffeeSoft, consultar:
- `DOC COFFEESOFT.md` - Documentación completa
- `CTRL.md` - Estructura de controladores
- `MDL.md` - Estructura de modelos
- `FRONT JS.md` - Patrones frontend

---

**Versión:** 1.0.0  
**Fecha:** Enero 2025  
**Framework:** CoffeeSoft 2.0
