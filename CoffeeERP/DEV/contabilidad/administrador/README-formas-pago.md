# Módulo de Formas de Pago

## 📋 Descripción

El módulo de Formas de Pago permite administrar los métodos de pago disponibles en el sistema de contabilidad para todas las unidades de negocio. Los usuarios pueden agregar, editar, activar o desactivar formas de pago que estarán disponibles para su uso en las compras.

## 🗂️ Estructura de Archivos

```
contabilidad/administrador/
├── sql/
│   ├── payment_methods.sql          # Script de creación de tabla
│   └── README-formas-pago.md        # Documentación de base de datos
├── mdl/
│   └── mdl-formasPago.php           # Modelo - Acceso a datos
├── ctrl/
│   └── ctrl-formasPago.php          # Controlador - Lógica de negocio
├── js/
│   ├── admin.js                     # Integración con pestañas
│   └── formasPago.js                # Frontend - Interfaz de usuario
└── index.php                        # Punto de entrada (incluye scripts)
```

## 🚀 Instalación

### 1. Base de Datos

Ejecutar el script SQL para crear la tabla:

```bash
mysql -u username -p database_name < sql/payment_methods.sql
```

Esto creará:
- Tabla `payment_methods` con campos: id, name, active, date_creation, date_updated
- 5 formas de pago predeterminadas (Efectivo, Transferencia, Tarjeta de débito, Tarjeta de crédito, Almacén de compras)

### 2. Archivos Backend

Los archivos PHP ya están en su ubicación correcta:
- `mdl/mdl-formasPago.php` - Modelo
- `ctrl/ctrl-formasPago.php` - Controlador

### 3. Archivos Frontend

Los archivos JavaScript ya están incluidos en `index.php`:
- `js/formasPago.js` - Módulo principal
- `js/admin.js` - Integración con pestañas

## 🎯 Funcionalidades

### 1. Listar Formas de Pago
- Tabla con paginación (15 registros por página)
- Filtro por estado (Activos/Inactivos)
- Columnas: ID, Nombre, Estado, Fecha de creación, Acciones

### 2. Agregar Nueva Forma de Pago
- Modal con formulario
- Campo obligatorio: Nombre
- Validación de duplicados (case-insensitive)
- Mensaje de confirmación

### 3. Editar Forma de Pago
- Modal con formulario precargado
- Actualización sin recargar página
- Mensaje de confirmación

### 4. Activar/Desactivar Forma de Pago
- Modal de confirmación con mensaje descriptivo
- Actualización de estado en tiempo real
- Cambio de icono según estado

## 🔌 API Endpoints

### Backend (ctrl-formasPago.php)

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `lsFormasPago` | POST | Lista todas las formas de pago |
| `getFormaPago` | POST | Obtiene una forma de pago por ID |
| `addFormaPago` | POST | Crea nueva forma de pago |
| `editFormaPago` | POST | Actualiza forma de pago existente |
| `statusFormaPago` | POST | Cambia estado activo/inactivo |

### Parámetros

**lsFormasPago:**
```json
{
  "opc": "lsFormasPago",
  "active": "1"  // 1=activos, 0=inactivos
}
```

**getFormaPago:**
```json
{
  "opc": "getFormaPago",
  "id": 1
}
```

**addFormaPago:**
```json
{
  "opc": "addFormaPago",
  "name": "Nombre de la forma de pago"
}
```

**editFormaPago:**
```json
{
  "opc": "editFormaPago",
  "id": 1,
  "name": "Nuevo nombre"
}
```

**statusFormaPago:**
```json
{
  "opc": "statusFormaPago",
  "id": 1,
  "active": 0  // 0=desactivar, 1=activar
}
```

### Respuestas

**Éxito:**
```json
{
  "status": 200,
  "message": "Operación exitosa",
  "data": {...}
}
```

**Error:**
```json
{
  "status": 500,
  "message": "Descripción del error"
}
```

**Conflicto (duplicado):**
```json
{
  "status": 409,
  "message": "Ya existe una forma de pago con ese nombre"
}
```

## 🎨 Interfaz de Usuario

### Componentes CoffeeSoft Utilizados

1. **createTable()** - Tabla con paginación y filtros
2. **createModalForm()** - Modales para agregar/editar
3. **swalQuestion()** - Confirmaciones de activar/desactivar
4. **createfilterBar()** - Barra de filtros
5. **alert()** - Mensajes de éxito/error

### Temas

- **Tema principal:** Corporativo (azul #003360)
- **Estados:**
  - Activo: Verde (#3FC189)
  - Inactivo: Rojo (#ba464d)

## 🔒 Validaciones

### Frontend
- Campo nombre obligatorio
- Validación de formulario antes de enviar

### Backend
- Validación de nombre no vacío
- Validación de duplicados (case-insensitive)
- Sanitización de datos con `$this->util->sql()`

### Base de Datos
- UNIQUE constraint en campo `name`
- NOT NULL en campo `name`

## 📊 Integración con Otros Módulos

Las formas de pago activas están disponibles para:
- **Módulo de Compras:** Filtros y captura de compras
- **Reportes:** Consultas por forma de pago
- **Todas las UDN:** Disponibilidad global

## 🧪 Testing

### Pruebas Manuales

1. **Agregar forma de pago:**
   - Abrir modal
   - Ingresar nombre válido
   - Verificar que aparece en tabla

2. **Validar duplicados:**
   - Intentar agregar nombre existente
   - Verificar mensaje de error

3. **Editar forma de pago:**
   - Seleccionar registro
   - Modificar nombre
   - Verificar actualización en tabla

4. **Cambiar estado:**
   - Desactivar forma de pago
   - Verificar modal de confirmación
   - Verificar cambio de icono

### Casos de Prueba

| Caso | Entrada | Resultado Esperado |
|------|---------|-------------------|
| Agregar válido | "Cheque" | Status 200, registro creado |
| Agregar duplicado | "Efectivo" | Status 409, error de duplicado |
| Editar válido | id=1, name="Efectivo MXN" | Status 200, registro actualizado |
| Desactivar | id=1, active=0 | Status 200, estado cambiado |
| Activar | id=1, active=1 | Status 200, estado cambiado |

## 🐛 Troubleshooting

### Error: "Ya existe una forma de pago con ese nombre"
- **Causa:** Nombre duplicado en base de datos
- **Solución:** Usar un nombre diferente o editar el registro existente

### Error: "No se pudo agregar la forma de pago"
- **Causa:** Error de conexión a base de datos o permisos
- **Solución:** Verificar credenciales de BD y permisos de usuario

### La tabla no se actualiza después de agregar/editar
- **Causa:** Error en callback de success
- **Solución:** Verificar que `this.lsFormasPago()` se ejecute en el callback

### Modal no se cierra después de guardar
- **Causa:** Error en respuesta del servidor
- **Solución:** Verificar que el servidor retorne status 200

## 📝 Notas Técnicas

### Arquitectura MVC
- **Modelo (mdl):** Acceso a datos usando clase CRUD
- **Controlador (ctrl):** Lógica de negocio y validaciones
- **Vista (js):** Interfaz de usuario con CoffeeSoft

### Convenciones de Nombres
- **Modelo:** `list*()`, `create*()`, `update*()`, `get*ById()`
- **Controlador:** `ls*()`, `add*()`, `edit*()`, `get*()`, `status*()`
- **Frontend:** `ls*()`, `add*()`, `edit*()`, `status*()`

### Base de Datos
- **Prefijo:** `rfwsmqex_contabilidad.`
- **Tabla:** `payment_methods`
- **Engine:** InnoDB
- **Charset:** utf8mb4_unicode_ci

## 🔄 Actualizaciones Futuras

Posibles mejoras:
- [ ] Agregar campo de descripción
- [ ] Agregar campo de icono personalizado
- [ ] Agregar ordenamiento manual (drag & drop)
- [ ] Agregar filtro de búsqueda por nombre
- [ ] Agregar exportación a Excel/PDF
- [ ] Agregar log de cambios (auditoría)

## 👥 Soporte

Para soporte técnico o reportar bugs:
- Revisar documentación en `.kiro/specs/formas-pago/`
- Consultar logs del servidor
- Verificar consola del navegador para errores JavaScript

## 📄 Licencia

Este módulo es parte del sistema de contabilidad CoffeeSoft.
