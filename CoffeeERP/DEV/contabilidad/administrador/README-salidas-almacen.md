# 📦 Módulo: Salidas de Almacén

## 🎯 Objetivo General
Implementar un módulo que permita registrar, visualizar, editar y eliminar salidas de almacén, mostrando un resumen total y manteniendo el control de los movimientos de inventario de forma clara y organizada.

---

## 📁 Estructura de Archivos

```
contabilidad/administrador/
├── salidas-almacen.php              # Vista principal del módulo
├── js/
│   └── salidas-almacen.js          # Frontend (Clase AdminWarehouseOutput)
├── ctrl/
│   └── ctrl-salidas-almacen.php    # Controlador (Lógica de negocio)
├── mdl/
│   └── mdl-salidas-almacen.php     # Modelo (Acceso a datos)
└── sql/
    └── warehouse_output.sql         # Script de creación de tabla
```

---

## 🗄️ Base de Datos

### Tabla: `warehouse_output`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | INT(11) | ID único (PK, AUTO_INCREMENT) |
| `insumo_id` | INT(11) | ID del insumo/almacén (FK) |
| `amount` | DECIMAL(10,2) | Cantidad/Monto de la salida |
| `description` | TEXT | Descripción opcional |
| `operation_date` | DATETIME | Fecha de la operación |
| `active` | TINYINT(1) | Estado (1=Activo, 0=Eliminado) |
| `created_at` | TIMESTAMP | Fecha de creación |
| `updated_at` | TIMESTAMP | Fecha de última actualización |

**Índices:**
- `idx_insumo` en `insumo_id`
- `idx_active` en `active`
- `idx_operation_date` en `operation_date`

---

## 🚀 Funcionalidades Implementadas

### ✅ Historia #1 – Interfaz Principal
- Tabla con columnas: Almacén, Monto, Descripción, Acciones
- Total general de salidas de almacén
- Botones: "Subir archivos de almacén" y "Registrar nueva salida"
- Filtros por UDN y estado (Activas/Eliminadas)

### ✅ Historia #2 – Registro de Nueva Salida
- Formulario modal con campos:
  - Almacén (select obligatorio)
  - Cantidad (input numérico obligatorio)
  - Descripción (textarea opcional)
- Validaciones:
  - Campos obligatorios completos
  - Cantidad mayor a cero
- Mensaje de confirmación al guardar

### ✅ Historia #3 – Edición de Salida
- Carga de datos actuales en formulario
- Permite modificar: Almacén, Cantidad, Descripción
- Validaciones iguales al registro
- Mensaje de éxito/error tras edición

### ✅ Historia #4 – Eliminación de Salida
- Modal de confirmación con SweetAlert2
- Opciones: "Continuar" y "Cancelar"
- Eliminación lógica (active = 0)
- Mensaje de éxito/error tras eliminación

---

## 📋 API Endpoints (ctrl-salidas-almacen.php)

| Método | Descripción | Parámetros |
|--------|-------------|------------|
| `init()` | Inicializa datos (almacenes, UDN) | - |
| `lsWarehouseOutputs()` | Lista salidas de almacén | `active`, `udn` |
| `getWarehouseOutput()` | Obtiene una salida por ID | `id` |
| `addWarehouseOutput()` | Registra nueva salida | `insumo_id`, `amount`, `description` |
| `editWarehouseOutput()` | Edita salida existente | `id`, `insumo_id`, `amount`, `description` |
| `deleteWarehouseOutput()` | Elimina salida (lógica) | `id` |
| `getTotalOutputs()` | Obtiene total de salidas | `udn` |

---

## 🎨 Componentes Frontend

### Clase: `AdminWarehouseOutput`
Extiende: `Templates` (CoffeeSoft Framework)

**Métodos principales:**
- `render()` - Renderiza el módulo completo
- `layout()` - Crea estructura con primaryLayout
- `filterBar()` - Barra de filtros y botones de acción
- `lsWarehouseOutputs()` - Lista salidas en tabla
- `addWarehouseOutput()` - Modal para nueva salida
- `editWarehouseOutput(id)` - Modal para editar salida
- `deleteWarehouseOutput(id)` - Confirmación y eliminación
- `uploadFiles()` - Placeholder para carga de archivos
- `jsonWarehouseOutput()` - Estructura del formulario
- `formatPrice(amount)` - Formatea números como moneda

---

## 🔧 Uso del Módulo

### Acceso
```
URL: /contabilidad/administrador/salidas-almacen.php
```

### Inicialización
```javascript
$(async () => {
    const data = await useFetch({ url: api, data: { opc: "init" } });
    warehouses = data.warehouses;
    lsudn = data.udn;

    warehouseOutput = new AdminWarehouseOutput(api, "root");
    warehouseOutput.render();
});
```

### Ejemplo de Registro
```javascript
warehouseOutput.addWarehouseOutput();
// Abre modal con formulario
// Al guardar, envía: { opc: 'addWarehouseOutput', insumo_id, amount, description }
```

---

## 🎯 Validaciones

### Frontend
- Campos obligatorios: Almacén, Cantidad
- Cantidad debe ser numérica
- Formato de moneda con `validationInputForNumber()`

### Backend
- Validación de campos vacíos (400)
- Validación de cantidad > 0 (400)
- Manejo de errores con try-catch
- Respuestas estandarizadas (status, message)

---

## 🔒 Seguridad

- ✅ Prepared statements en todas las queries
- ✅ Sanitización de inputs con `$this->util->sql()`
- ✅ Validación de sesión en vista PHP
- ✅ Headers CORS configurados
- ✅ Eliminación lógica (no física)

---

## 📊 Características Técnicas

### Framework
- **Backend:** PHP 7.4+ con patrón MVC
- **Frontend:** jQuery + CoffeeSoft Framework
- **Estilos:** TailwindCSS + Bootstrap
- **Base de datos:** MySQL/MariaDB

### Componentes CoffeeSoft Utilizados
- `primaryLayout()` - Layout principal
- `createfilterBar()` - Barra de filtros
- `createTable()` - Tabla con DataTables
- `createModalForm()` - Formularios modales
- `swalQuestion()` - Confirmaciones
- `useFetch()` - Peticiones AJAX

---

## 🚧 Funcionalidades Pendientes

- [ ] Carga de archivos de almacén
- [ ] Exportación a Excel/PDF
- [ ] Gráficas de salidas por período
- [ ] Historial de cambios
- [ ] Notificaciones por email
- [ ] Integración con inventario

---

## 📝 Notas de Desarrollo

### Convenciones de Nomenclatura
- **Modelo:** `list*()`, `create*()`, `update*()`, `get*ById()`
- **Controlador:** `ls*()`, `add*()`, `edit*()`, `delete*()`
- **Frontend:** `ls*()`, `add*()`, `edit*()`, `delete*()`

### Patrón de Respuesta API
```json
{
    "status": 200,
    "message": "Operación exitosa",
    "data": {}
}
```

---

## 🐛 Troubleshooting

### Error: "Almacén no encontrado"
- Verificar que existan registros en tabla `insumos`
- Verificar que `Stado = 1` en tabla `insumos`

### Error: "No se puede conectar al servidor"
- Verificar ruta del API en `js/salidas-almacen.js`
- Verificar que el archivo `ctrl-salidas-almacen.php` exista

### Tabla no carga datos
- Verificar que la tabla `warehouse_output` exista
- Ejecutar script SQL: `sql/warehouse_output.sql`
- Verificar permisos de base de datos

---

## 📞 Soporte

Para reportar bugs o solicitar nuevas funcionalidades, contactar al equipo de desarrollo de CoffeeSoft.

**Versión:** 1.0.0  
**Fecha:** Enero 2025  
**Autor:** CoffeeIA ☕
