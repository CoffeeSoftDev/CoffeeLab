# 💱 Módulo de Moneda Extranjera

## Descripción

Módulo para administrar monedas extranjeras utilizadas por la empresa, configurando su nombre, símbolo y tipo de cambio (MXN), así como la posibilidad de activar o desactivar dichas monedas para el registro contable.

## Estructura de Archivos

```
contabilidad/administrador/
├── moneda.js                    # Frontend JavaScript
├── ctrl/
│   └── ctrl-moneda.php          # Controlador
├── mdl/
│   └── mdl-moneda.php           # Modelo
└── sql/
    └── foreign_currency.sql     # Script de base de datos
```

## Instalación

### 1. Crear la tabla en la base de datos

Ejecuta el script SQL ubicado en `sql/foreign_currency.sql`:

```sql
mysql -u usuario -p nombre_base_datos < sql/foreign_currency.sql
```

O ejecuta el contenido del archivo directamente en tu gestor de base de datos (phpMyAdmin, MySQL Workbench, etc.).

### 2. Verificar configuración de base de datos

Asegúrate de que el prefijo de base de datos en `mdl-moneda.php` coincida con tu configuración:

```php
$this->bd = "coffeesoft."; // Ajusta según tu configuración
```

### 3. Incluir el módulo en el sistema

Agrega el script JavaScript en tu archivo principal de administración:

```html
<script src="moneda.js"></script>
```

## Uso

### Funcionalidades Principales

#### 1. Listar Monedas Extranjeras
- Visualiza todas las monedas registradas en el sistema
- Filtra por unidad de negocio (UDN)
- Filtra por estado (Activas/Inactivas)
- Muestra: Nombre, Símbolo, Tipo de cambio (MXN), Estado

#### 2. Agregar Nueva Moneda
- Haz clic en el botón "+ Agregar nueva moneda extranjera"
- Completa el formulario:
  - **Nombre del concepto**: Ej. Dólar, Quetzal, Euro
  - **Símbolo de la moneda**: Ej. USD, GTQ, EUR
  - **Tipo de cambio (MXN)**: Valor de conversión a pesos mexicanos
- El sistema valida que no existan duplicados por UDN

#### 3. Editar Moneda Existente
- Haz clic en el ícono de editar (lápiz) en la fila de la moneda
- Modifica los valores necesarios
- **⚠️ Advertencia**: Los cambios afectarán a todas las unidades. Confirma que los retiros de efectivo se hayan realizado antes de actualizar el tipo de cambio.

#### 4. Activar/Desactivar Moneda
- Haz clic en el ícono de toggle (interruptor) en la fila de la moneda
- **Desactivar**: La moneda ya no estará disponible para nuevos registros, pero seguirá visible en registros históricos
- **Activar**: La moneda estará disponible nuevamente para captura de información

## Validaciones

### Frontend
- Todos los campos son obligatorios
- El tipo de cambio debe ser mayor a cero
- Formato numérico con 2 decimales

### Backend
- Validación de campos requeridos
- Validación de tipo de cambio > 0
- Prevención de duplicados por UDN
- Protección contra inyección SQL
- Sanitización de datos de entrada

## Códigos de Respuesta

| Código | Significado | Descripción |
|--------|-------------|-------------|
| 200 | Success | Operación completada exitosamente |
| 400 | Bad Request | Campos faltantes o inválidos |
| 404 | Not Found | Moneda no encontrada |
| 409 | Conflict | Moneda duplicada para la misma UDN |
| 500 | Server Error | Error del servidor o base de datos |

## API Endpoints

### init
Obtiene datos iniciales para filtros
```javascript
POST: { opc: "init" }
Response: { udn: [...], paymentMethods: [...] }
```

### lsCurrencies
Lista monedas con filtros
```javascript
POST: { opc: "lsCurrencies", udn: 1, active: 1 }
Response: { row: [...], ls: [...] }
```

### getCurrency
Obtiene una moneda por ID
```javascript
POST: { opc: "getCurrency", id: 1 }
Response: { status: 200, message: "...", data: {...} }
```

### addCurrency
Crea nueva moneda
```javascript
POST: { 
    opc: "addCurrency", 
    name: "Dólar", 
    code: "USD", 
    conversion_value: 20.00,
    udn_id: 1
}
Response: { status: 200, message: "Moneda agregada correctamente" }
```

### editCurrency
Actualiza moneda existente
```javascript
POST: { 
    opc: "editCurrency", 
    id: 1,
    name: "Dólar", 
    code: "USD", 
    conversion_value: 20.50
}
Response: { status: 200, message: "La moneda se actualizó con éxito..." }
```

### toggleStatus
Cambia estado de moneda
```javascript
POST: { opc: "toggleStatus", id: 1, active: 0 }
Response: { status: 200, message: "La moneda extranjera ya no estará disponible..." }
```

## Seguridad

- ✅ Prepared statements para prevenir SQL injection
- ✅ Sanitización de entrada con `$this->util->sql()`
- ✅ Validación de sesión en controlador
- ✅ Escape de salida para prevenir XSS
- ✅ Validación de permisos de usuario

## Optimización

- ✅ Índices en base de datos (id, udn_id, active)
- ✅ Paginación con DataTables (15 registros por página)
- ✅ Caché de datos de filtros
- ✅ Consultas optimizadas con LEFT JOIN

## Soporte

Para reportar problemas o solicitar mejoras, contacta al equipo de desarrollo de CoffeeSoft.

---

**Versión**: 1.0.0  
**Fecha**: 2025  
**Framework**: CoffeeSoft
