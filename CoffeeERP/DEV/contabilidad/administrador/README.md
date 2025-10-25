# 💵 Módulo de Efectivo - CoffeeSoft

## Descripción

Módulo de gestión de efectivo que permite registrar movimientos, realizar cierres de caja y controlar el flujo de efectivo por unidad de negocio.

## Estructura de Archivos

```
contabilidad/administrador/
├── index.php                    # Punto de entrada principal
├── efectivo.js                  # Frontend (App y CashMovement)
├── ctrl/
│   └── ctrl-efectivo.php       # Controlador PHP
├── mdl/
│   └── mdl-efectivo.php        # Modelo PHP
└── sql/
    └── create_cash_tables.sql  # Script de creación de tablas
```

## Instalación

### 1. Base de Datos

Ejecuta el script SQL para crear las tablas necesarias:

```bash
mysql -u usuario -p nombre_bd < sql/create_cash_tables.sql
```

O ejecuta manualmente en tu gestor de base de datos:

```sql
-- Ejecutar el contenido de sql/create_cash_tables.sql
```

### 2. Configuración

Actualiza la variable `$bd` en `mdl/mdl-efectivo.php` con el nombre de tu base de datos:

```php
$this->bd = "tu_base_de_datos.";
```

### 3. Permisos

Asegúrate de que el usuario de la sesión tenga permisos para:
- Crear conceptos de efectivo
- Registrar movimientos
- Realizar cierres de caja

## Funcionalidades

### 📋 Gestión de Conceptos

- **Crear conceptos**: Define categorías de efectivo (Efectivo, Bancos, Retiros, etc.)
- **Editar conceptos**: Modifica nombre, tipo de operación y descripción
- **Activar/Desactivar**: Controla qué conceptos están disponibles

### 💰 Gestión de Movimientos

- **Registrar movimientos**: Captura entradas y salidas de efectivo
- **Editar movimientos**: Corrige errores de captura
- **Consultar historial**: Visualiza todos los movimientos por unidad de negocio

### 🔒 Cierre de Efectivo

- **Cierre de caja**: Consolida movimientos y genera registro contable
- **Bloqueo automático**: Previene nuevos movimientos después del cierre

## Uso

### Acceso al Módulo

1. Abre el navegador y accede a:
   ```
   http://tu-dominio/contabilidad/administrador/
   ```

2. Selecciona la pestaña "Conceptos de Efectivo" o "Movimientos"

### Crear un Concepto

1. Click en "Nuevo Concepto"
2. Completa el formulario:
   - Unidad de Negocio
   - Nombre del Concepto
   - Tipo de Operación (Suma/Resta)
   - Descripción (opcional)
3. Click en "Guardar"

### Registrar un Movimiento

1. Ve a la pestaña "Movimientos"
2. Click en "Nuevo Movimiento"
3. Completa el formulario:
   - Unidad de Negocio
   - Concepto (se carga dinámicamente)
   - Tipo de Movimiento (Entrada/Salida)
   - Monto
   - Descripción (opcional)
4. Click en "Guardar"

### Realizar Cierre de Efectivo

1. En la pestaña "Movimientos"
2. Click en "Cerrar Efectivo"
3. Confirma la acción
4. El sistema generará el cierre automáticamente

## Validaciones

### Frontend
- Monto debe ser numérico y mayor a 0
- Campos obligatorios deben estar completos

### Backend
- Validación de nombres duplicados en conceptos
- Validación de montos positivos
- Control de permisos por usuario

## Mensajes del Sistema

### Éxito
- ✅ "Concepto agregado correctamente"
- ✅ "Movimiento registrado correctamente"
- ✅ "El cierre de efectivo se realizó con éxito"

### Errores
- ❌ "Ya existe un concepto con ese nombre"
- ❌ "El monto debe ser mayor a 0"
- ❌ "Error al procesar la solicitud"

### Información
- ℹ️ "El flujo de efectivo se ha deshabilitado temporalmente"
- ℹ️ "El flujo de efectivo está habilitado nuevamente"

## Estructura de Base de Datos

### Tabla: cash_concept
```sql
- id (PK)
- udn_id (FK)
- name
- operation_type (suma/resta)
- description
- active
- date_creation
```

### Tabla: cash_movement
```sql
- id (PK)
- udn_id (FK)
- concept_id (FK)
- movement_type (entrada/salida)
- amount
- description
- user_id (FK)
- date_creation
- active
```

### Tabla: cash_closure
```sql
- id (PK)
- udn_id (FK)
- total_amount
- closure_date
- user_id (FK)
- notes
```

## Dependencias

### Backend
- PHP 7.4+
- MySQL 5.7+
- Clases CRUD y Utileria de CoffeeSoft

### Frontend
- jQuery 3.6+
- CoffeeSoft Framework
- TailwindCSS
- Bootstrap 5
- DataTables
- SweetAlert2
- Bootbox
- Select2
- Moment.js
- DateRangePicker

## Soporte

Para reportar problemas o solicitar nuevas funcionalidades, contacta al equipo de desarrollo de CoffeeSoft.

## Versión

**v1.0.0** - Implementación inicial del módulo de efectivo

---

Desarrollado con ☕ por CoffeeSoft
