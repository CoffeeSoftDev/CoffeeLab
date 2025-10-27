# Módulo de Salidas de Almacén

## 📋 Descripción

Módulo completo para gestionar las salidas de almacén en el sistema de contabilidad CoffeeSoft. Permite registrar, visualizar, editar y eliminar movimientos de inventario con control total y resumen de totales.

## 🗂️ Archivos Creados

### Base de Datos
- `sql/warehouse_output.sql` - Script SQL para crear la tabla

### Backend (PHP)
- `mdl/mdl-salidas-almacen.php` - Modelo con operaciones CRUD
- `ctrl/ctrl-salidas-almacen.php` - Controlador con lógica de negocio

### Frontend (JavaScript)
- `js/salidas-almacen.js` - Interfaz de usuario con CoffeeSoft Framework

### Vista (PHP)
- `salidas-almacen.php` - Página principal del módulo

## 🚀 Instalación

### 1. Ejecutar Script SQL

Ejecuta el archivo `sql/warehouse_output.sql` en tu base de datos:

```sql
-- Asegúrate de tener la tabla 'insumo' creada primero
-- Luego ejecuta:
SOURCE contabilidad/administrador/sql/warehouse_output.sql;
```

### 2. Verificar Estructura de Base de Datos

La tabla `warehouse_output` debe tener la siguiente estructura:

```
warehouse_output
├── id (INT, PRIMARY KEY, AUTO_INCREMENT)
├── insumo_id (INT, FOREIGN KEY → insumo.id)
├── amount (DECIMAL(10,2))
├── description (TEXT, nullable)
├── operation_date (DATETIME, DEFAULT CURRENT_TIMESTAMP)
└── active (TINYINT(1), DEFAULT 1)
```

### 3. Acceder al Módulo

Navega a:
```
http://tu-dominio/contabilidad/administrador/salidas-almacen.php
```

## ✨ Funcionalidades

### 1. Visualización Principal
- ✅ Tabla con todas las salidas de almacén
- ✅ Resumen con total general de salidas
- ✅ Paginación y búsqueda integrada
- ✅ Tema corporativo con TailwindCSS

### 2. Registro de Salidas
- ✅ Formulario modal "NUEVA SALIDA DE ALMACÉN"
- ✅ Campos: Almacén (select), Cantidad (currency), Descripción (opcional)
- ✅ Validación de campos obligatorios
- ✅ Formato de moneda automático

### 3. Edición de Salidas
- ✅ Formulario modal "EDITAR SALIDA DE ALMACÉN"
- ✅ Pre-carga de datos existentes
- ✅ Actualización en tiempo real

### 4. Eliminación de Salidas
- ✅ Modal de confirmación con opciones "Continuar" y "Cancelar"
- ✅ Borrado lógico (soft delete)
- ✅ Actualización automática de totales

### 5. Cálculo de Totales
- ✅ Suma automática de todas las salidas activas
- ✅ Formato de moneda: $ X,XXX.XX
- ✅ Actualización dinámica después de cada operación

## 🔧 Configuración

### Cambiar Base de Datos

Si necesitas usar una base de datos diferente, edita el archivo `mdl/mdl-salidas-almacen.php`:

```php
public function __construct() {
    $this->util = new Utileria;
    $this->bd = "rfwsmqex_tu_base_de_datos."; // Cambiar aquí
}
```

### Personalizar Tema

El módulo usa el tema 'corporativo' de CoffeeSoft. Para cambiarlo, edita `js/salidas-almacen.js`:

```javascript
attr: {
    id: `tb${this.PROJECT_NAME}`,
    theme: 'light', // Opciones: 'light', 'dark', 'corporativo', 'shadcdn'
    // ...
}
```

## 📊 Estructura de Datos

### Tabla warehouse_output

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INT | Identificador único |
| insumo_id | INT | FK a tabla insumo (almacén) |
| amount | DECIMAL(10,2) | Monto de la salida |
| description | TEXT | Descripción opcional |
| operation_date | DATETIME | Fecha de operación |
| active | TINYINT(1) | Estado (1=activo, 0=eliminado) |

### Relaciones

```
warehouse_output.insumo_id → insumo.id
```

## 🔐 Seguridad

- ✅ Validación de sesión en todas las páginas
- ✅ Prepared statements en todas las consultas SQL
- ✅ Validación de campos en frontend y backend
- ✅ Sanitización de datos con `$this->util->sql()`
- ✅ Headers CORS configurados

## 🐛 Troubleshooting

### Error: "Tabla warehouse_output no existe"
**Solución:** Ejecuta el script SQL en `sql/warehouse_output.sql`

### Error: "Foreign key constraint fails"
**Solución:** Asegúrate de que la tabla `insumo` existe y tiene registros

### Error: "Cannot read property 'warehouses'"
**Solución:** Verifica que el método `init()` en el controlador retorna correctamente los almacenes

### No se muestra el total
**Solución:** Verifica que existan registros con `active = 1` en la tabla

## 📝 Notas Técnicas

### Arquitectura MVC
- **Modelo (MDL):** Operaciones de base de datos
- **Vista (View):** Interfaz HTML/PHP
- **Controlador (CTRL):** Lógica de negocio
- **Frontend (JS):** Interacción con usuario

### Framework Utilizado
- **Backend:** PHP 7.4+ con clase CRUD personalizada
- **Frontend:** jQuery + CoffeeSoft Framework
- **Estilos:** TailwindCSS
- **Base de Datos:** MySQL/MariaDB

### Convenciones de Código
- Nombres de métodos en camelCase
- Nombres de tablas en snake_case
- Clases en PascalCase
- Variables globales en minúsculas

## 📞 Soporte

Para reportar problemas o solicitar mejoras, contacta al equipo de desarrollo de CoffeeSoft.

---

**Versión:** 1.0.0  
**Fecha:** Octubre 2025  
**Desarrollado con:** CoffeeSoft Framework
